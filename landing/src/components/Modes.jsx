import { useEffect, useState } from 'react'
import { SHOPS } from '../data'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const BEACON = SHOPS[0]

export function Modes() {
  return (
    <section className="paper border-t border-rule">
      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 lg:py-24">
        <p className="kicker mb-3">Two modes. One binary.</p>
        <h2 className="display max-w-[22rem] text-[clamp(1.9rem,3.2vw,2.8rem)]">
          Beacon writes the card. Scan reads the sidewalk.
        </h2>
        <div className="mt-14 grid items-start gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <BeaconPanel />
          <ScanPanel />
        </div>
      </div>
    </section>
  )
}

function BeaconPanel() {
  return (
    <div id="beacon">
      <p className="font-mono text-[12px] tracking-[0.16em] text-navy uppercase">
        Beacon
      </p>
      <p className="mt-3 max-w-[34rem] text-[17px]">
        You are the shop. You fill a card — name, rubro, hours, today’s line —
        and you broadcast. Nearby scanners see you. There is no page to claim,
        no pin to buy.
      </p>
      <div className="notice mt-8 max-w-[440px] px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <span className="badge-live">Broadcasting</span>
          <span className="font-mono text-[11px] text-mute">1 KB max</span>
        </div>
        <dl className="mt-4">
          <div className="field-row">
            <dt>Name</dt>
            <dd>{BEACON.name}</dd>
          </div>
          <div className="field-row">
            <dt>Category</dt>
            <dd>{BEACON.category}</dd>
          </div>
          <div className="field-row">
            <dt>Status</dt>
            <dd>{BEACON.status}</dd>
          </div>
          <div className="field-row">
            <dt>Today</dt>
            <dd className="text-amber">{BEACON.message}</dd>
          </div>
          <div className="field-row border-b-0">
            <dt>Hours</dt>
            <dd>{BEACON.hours}</dd>
          </div>
        </dl>
        <p className="mt-2 font-mono text-[12px] text-mute">
          4 scanners have read this card
        </p>
      </div>
    </div>
  )
}

function ScanPanel() {
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = useState(reduced ? SHOPS.length : 0)

  useEffect(() => {
    if (reduced) {
      setCount(SHOPS.length)
      return undefined
    }

    setCount(0)
    const delays = [900, 2000, 3100]
    const timers = delays.map((ms, i) =>
      window.setTimeout(() => setCount(i + 1), ms)
    )
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [reduced])

  return (
    <div id="scan" className="lg:mt-24">
      <p className="font-mono text-[12px] tracking-[0.16em] text-navy uppercase">
        Scan
      </p>
      <p className="mt-3 text-[17px]">
        You are walking. The list is empty until a peer is close. Then it is
        not.
      </p>
      <div className="mt-8 border border-rule bg-paper px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.12em] text-mute uppercase">
            Traveler
          </p>
          <p className="font-mono text-[11px] text-mute">
            {count === 0 ? 'searching' : `${count} nearby`}
          </p>
        </div>
        <hr className="rule my-3" />
        {count === 0 ? (
          <p className="py-8 text-center font-display text-[20px] italic text-mute">
            Searching nearby…
          </p>
        ) : (
          <ol className="m-0 list-none p-0">
            {SHOPS.slice(0, count).map((shop, i) => (
              <li key={shop.id} className="peer is-in">
                <div className="flex items-baseline justify-between gap-3">
                  <span>
                    <span className="mr-2 font-mono text-[11px] text-mute">
                      {i + 1}.
                    </span>
                    {shop.name}
                  </span>
                  <span className="badge-open">Open</span>
                </div>
                <p className="mt-1 text-[14px] text-amber">{shop.message}</p>
                <p className="font-mono text-[11px] text-mute">{shop.hours}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
