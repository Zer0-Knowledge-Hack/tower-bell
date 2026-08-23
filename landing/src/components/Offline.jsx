const layers = [
  {
    name: 'Hyperswarm',
    when: 'If there is internet',
    body: 'The DHT finds the beacon. Same card, longer reach. This is the floor.',
  },
  {
    name: 'mDNS',
    when: 'Same Wi‑Fi, no internet',
    body: 'The venue router is enough. A café with a dead uplink still lists.',
  },
  {
    name: 'BLE',
    when: 'No network at all',
    body: 'The radio in your pocket. Sidewalk range. The differential.',
  },
]

export function Offline() {
  return (
    <section className="border-t border-rule bg-paper-2">
      <div className="mx-auto grid max-w-[1120px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
        <div className="lg:pt-2">
          <p className="kicker mb-4">When the network dies</p>
          <h2 className="display text-[clamp(1.9rem,3.4vw,3rem)]">
            Three layers. Same shop.
          </h2>
          <p className="mt-5 max-w-[28rem] text-[17px]">
            Turn Wi‑Fi off. It keeps listing.
          </p>
          <p className="mt-6 max-w-[30rem] text-[15px] text-mute">
            The screen never talks to a server. A Bare worker on the device
            runs the radios and a small Hyperbee. Pear installs the binary and
            updates it later, peer to peer. The rest is in the repo.
          </p>
        </div>
        <ol className="m-0 list-none p-0">
          {layers.map((layer, i) => (
            <li key={layer.name} className="layer">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <p className="font-display text-[26px] leading-none">
                  <span className="mr-3 font-mono text-[12px] text-mute">
                    0{i + 1}
                  </span>
                  {layer.name}
                </p>
                <p className="font-mono text-[11px] tracking-[0.06em] text-navy uppercase">
                  {layer.when}
                </p>
              </div>
              <p className="mt-3 max-w-[36rem] text-[16px] text-ink/85">
                {layer.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
