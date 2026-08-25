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
