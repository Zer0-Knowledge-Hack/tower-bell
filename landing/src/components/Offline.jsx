const layers = [
  {
    name: 'With internet',
    term: 'Hyperswarm',
    body: 'Finds shops a bit farther down the street.'
  },
  {
    name: 'Same Wi‑Fi, no internet',
    term: 'mDNS',
    body: 'Still works in the room. A café with a dead uplink can still list.'
  },
  {
    name: 'No network at all',
    term: 'Bluetooth',
    body: 'The sidewalk only. This is the bonus we aimed at. It is still rough.'
  }
]

export function Offline() {
  return (
    <section className='border-t border-rule bg-paper-2'>
      <div className='mx-auto grid max-w-[1120px] gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-24'>
        <div className='min-w-0 lg:pt-2'>
          <p className='kicker mb-4'>When the signal dies</p>
          <h2 className='display text-[clamp(1.9rem,3.4vw,3rem)]'>
            Turn Wi‑Fi off. It keeps listing.
          </h2>
          <p className='mt-5 max-w-[28rem] text-[17px]'>
            Three ways to find the same shop. Internet first. Then the room. Then the sidewalk.
          </p>
          <p className='mt-6 max-w-[30rem] text-[15px] text-mute'>
            Nothing here talks to a company server. The shop and the walker find each other. Updates
            arrive the same way.
          </p>
        </div>
        <ol className='m-0 list-none p-0'>
          {layers.map((layer, i) => (
            <li key={layer.name} className='layer'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6'>
                <p className='font-display text-[12px] leading-relaxed sm:text-[14px]'>
                  <span className='mr-3 font-mono text-[12px] text-mute'>0{i + 1}</span>
                  {layer.name}
                </p>
                <p className='font-mono text-[11px] tracking-[0.06em] text-navy uppercase'>
                  {layer.term}
                </p>
              </div>
              <p className='mt-3 max-w-[36rem] text-[16px] text-ink/85'>{layer.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
