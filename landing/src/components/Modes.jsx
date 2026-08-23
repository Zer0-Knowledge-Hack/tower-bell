import { useEffect, useState } from 'react'
import { SHOPS } from '../data'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const BEACON = SHOPS[0]

export function Modes() {
  return (
    <section className="paper border-t border-rule">
      <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-16 lg:py-24">
        <p className="kicker mb-3">Two sides. Same sidewalk.</p>
        <h2 className="display max-w-[26rem] text-[clamp(1.9rem,3.2vw,2.8rem)]">
          The shop talks. The walker hears it.
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
      <p className="mt-1 text-[13px] text-mute">The shop announces itself.</p>
      <p className="mt-3 max-w-[34rem] text-[17px]">
        Turn it on. Nearby people see your name, hours, and today’s deal. No
        page to claim. No pin to buy.
      </p>
      <div className="notice mt-8 max-w-[440px] min-w-0 px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <span className="badge-live">You’re on</span>
        </div>
        <dl className="mt-4">
          <div className="field-row">
            <dt>Name</dt>
            <dd>{BEACON.name}</dd>
          </div>
          <div className="field-row">
            <dt>Kind</dt>
            <dd>{BEACON.category}</dd>
          </div>
          <div className="field-row">
            <dt>Status</dt>
            <dd>Open</dd>
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
          4 people walked by
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
      <p className="mt-1 text-[13px] text-mute">You see what’s nearby.</p>
      <p className="mt-3 text-[17px]">
        Open it. Shops around you appear. If nobody is close, the list stays
        empty. That’s honest.
      </p>
      <div className="mt-8 border border-rule bg-paper px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.12em] text-mute uppercase">
            Walker
          </p>
          <p className="font-mono text-[11px] text-mute">
            {count === 0 ? 'looking' : `${count} nearby`}
          </p>
        </div>
        <hr className="rule my-3" />
        {count === 0 ? (
          <p className="py-8 text-center font-mono text-[20px] text-mute">
            Searching nearby…
          </p>
        ) : (
          <ol className="m-0 list-none p-0">
            {SHOPS.slice(0, count).map((shop, i) => (
              <li key={shop.id} className="peer is-in">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0">
                    <span className="mr-2 font-mono text-[11px] text-mute">
                      {i + 1}.
                    </span>
                    {shop.name}
                  </span>
                  <span className="badge-open shrink-0">Open</span>
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
