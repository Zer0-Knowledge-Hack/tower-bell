import { SHOPS } from '../data'

export function ScanDevice({ shops = SHOPS, live = false }) {
  return (
    <figure className="device mx-auto w-full max-w-[400px] p-3">
      <div className="mb-2 flex items-center justify-between px-1 font-mono text-[10px] tracking-[0.14em] text-[#c9c2b3] uppercase">
        <span>Towerbell · field</span>
        <span>{live ? 'live' : 'scan'}</span>
      </div>
      <div className="device-screen px-4 py-4">
        <p className="font-mono text-[10px] tracking-[0.16em] text-navy uppercase">
          Traveler mode
        </p>
        <p className="mt-1 font-display text-[22px] leading-tight">
          Nearby peers
        </p>
        <p className="mt-3 flex items-center gap-2 font-mono text-[11px] text-mute">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky" />
          DHT connected · sidewalk range
        </p>
        <hr className="rule my-3" />
        <ol className="m-0 list-none p-0">
          {shops.map((shop, i) => (
            <li key={shop.id} className="peer is-in">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">
                  <span className="mr-2 font-mono text-[11px] text-mute">{i + 1}.</span>
                  {shop.name}
                </span>
                <span className="badge-open">Open</span>
              </div>
              <p className="mt-1 text-[14px] text-amber">{shop.message}</p>
              <p className="mt-0.5 font-mono text-[11px] text-mute">
                {shop.category} · {shop.hours}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="sr-only">
        A Towerbell scan listing Café Rivadavia and two other open shops.
      </figcaption>
    </figure>
  )
}
