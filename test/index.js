const { test } = require('brittle')
const path = require('bare-path')
const os = require('bare-os')
const fs = require('bare-fs')
const process = require('bare-process')
const Corestore = require('corestore')
const { DataManager } = require('../backend/data.js')

let counter = 0

function openStore(t) {
  counter++
  const dir = path.join(os.tmpdir(), `towerbell-test-${process.pid}-${Date.now()}-${counter}`)
  const store = new Corestore(dir)
  t.teardown(async () => {
    await store.close()
    fs.rmSync(dir, { recursive: true, force: true })
  })
  return store
}

test('DataManager stores and reads back a beacon record', async (t) => {
  const data = new DataManager(openStore(t))
  const { db } = await data.getLocalDb()

  const record = {
    id: 'test-id',
    name: 'Test Shop',
    category: 'cafeteria',
    status: 'open',
    message: 'hello',
    hours: '09:00-18:00',
    updated: new Date().toISOString()
  }

  await data.updateRecord(db, record)
  const read = await data.readRecord(db)

  t.alike(read, record)
})

test('DataManager updateRecord overwrites the previous record', async (t) => {
  const data = new DataManager(openStore(t))
  const { db } = await data.getLocalDb()

  await data.updateRecord(db, { id: 'a', name: 'First', status: 'open' })
  await data.updateRecord(db, { id: 'a', name: 'Second', status: 'closed' })

  const read = await data.readRecord(db)
  t.is(read.name, 'Second')
  t.is(read.status, 'closed')
})

test('DataManager readRecord returns null when nothing was written yet', async (t) => {
  const data = new DataManager(openStore(t))
  const { db } = await data.getLocalDb()

  const read = await data.readRecord(db)
  t.is(read, null)
})

test('DataManager getRemoteDb caches by key instead of reopening', async (t) => {
  const data = new DataManager(openStore(t))
  const local = await data.getLocalDb()

  const first = await data.getRemoteDb(local.core.key)
  const second = await data.getRemoteDb(local.core.key)

  t.is(first.db, second.db)
})

// --- Contract tests -------------------------------------------------------
// FRONTEND_INTEGRATION.md freezes nine names: scan, beacon, peer-found,
// peer-lost, status, visitor, list, update, stop. Two consumers depend on
// them (the Pear CLI TUI and the Expo app), and a rename has already shipped
// once without either consumer noticing. These tests exist so the next one
// fails here instead of in someone's UI.

const mock = require('../backend/mock.js')

// Fast enough for CI, same ordering as the real timeline.
const TIMINGS = { connect: 10, found: 25, lost: 60, visitor: 25 }

const RECORD_FIELDS = ['id', 'name', 'category', 'status', 'message', 'hours', 'updated']

function once(emitter, event, t) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out waiting for "${event}"`)), 5000)
    emitter.on(event, (payload) => {
      clearTimeout(timer)
      resolve(payload)
    })
  })
}

test('contract: scan() exposes list, stop and on', (t) => {
  const network = mock.scan({ timings: TIMINGS })
  t.teardown(() => network.stop())

  t.is(typeof network.on, 'function', 'on')
  t.is(typeof network.list, 'function', 'list')
  t.is(typeof network.stop, 'function', 'stop')
  t.alike(network.list(), [], 'list starts empty')
})

test('contract: scan() emits status with mode and connected', async (t) => {
  const network = mock.scan({ timings: TIMINGS })
  t.teardown(() => network.stop())

  const status = await once(network, 'status', t)
  t.is(typeof status.mode, 'string', 'status.mode is a string')
  t.is(status.connected, true, 'status.connected')
})

test('contract: peer-found carries a full record and lands in list()', async (t) => {
  const network = mock.scan({ timings: TIMINGS })
  t.teardown(() => network.stop())

  const record = await once(network, 'peer-found', t)
  for (const field of RECORD_FIELDS) {
    t.ok(record[field] !== undefined, `record.${field} is present`)
  }
  t.ok(record.status === 'open' || record.status === 'closed', 'status is open or closed')
  t.is(network.list().length, 1, 'peer is listed')
  t.is(network.list()[0].id, record.id, 'listed peer is the one announced')
})

test('contract: peer-lost carries the id and removes the peer from list()', async (t) => {
  const network = mock.scan({ timings: TIMINGS })
  t.teardown(() => network.stop())

  const found = await once(network, 'peer-found', t)
  const lostId = await once(network, 'peer-lost', t)

  t.is(typeof lostId, 'string', 'peer-lost carries an id, not a record')
  t.is(lostId, found.id, 'the id matches the peer that was found')
  t.is(network.list().length, 0, 'peer is gone from the list')
})

test('contract: beacon() exposes update, stop and emits visitor totals', async (t) => {
  const record = {
    id: 'shop-1',
    name: 'Test Shop',
    category: 'cafeteria',
    status: 'open',
    message: 'hello',
    hours: '09:00-18:00',
    updated: new Date().toISOString()
  }
  const bcn = mock.beacon(record, { timings: TIMINGS })
  t.teardown(() => bcn.stop())

  t.is(typeof bcn.on, 'function', 'on')
  t.is(typeof bcn.update, 'function', 'update')
  t.is(typeof bcn.stop, 'function', 'stop')

  const visitor = await once(bcn, 'visitor', t)
  t.is(typeof visitor.total, 'number', 'visitor.total is a number')
  t.ok(visitor.total >= 1, 'visitor.total counts up')

  await bcn.update({ ...record, message: 'changed' })
  t.is(bcn.record.message, 'changed', 'update() replaces the record')
})

test('contract: stop() is idempotent and silences the scanner', async (t) => {
  const network = mock.scan({ timings: TIMINGS })

  await network.stop()
  await network.stop()

  let fired = false
  network.on('peer-found', () => {
    fired = true
  })
  await new Promise((resolve) => setTimeout(resolve, 120))
  t.is(fired, false, 'no events after stop()')
})
