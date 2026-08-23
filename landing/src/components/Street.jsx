import { StreetScene } from './StreetScene'

export function Street() {
  return (
    <section id='how' className='border-t border-rule bg-paper-2'>
      <div className='mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-16 lg:py-20'>
        <div className='grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end'>
          <div className='max-w-[28rem]'>
            <p className='kicker mb-4'>Nearby</p>
            <h2 className='display text-[clamp(1.9rem,3.4vw,3rem)]'>
              You only see shops that are actually next to you.
            </h2>
            <p className='mt-5 text-[17px] text-ink/90'>
              Three blocks away doesn’t count. The list is this sidewalk, not the whole city.
            </p>
          </div>
          <p className='max-w-[34rem] justify-self-end text-[15px] text-mute lg:text-right'>
            Walk a little farther and the list changes. Another barrio, other shops.
          </p>
        </div>
      </div>
      <div className='border-y border-rule bg-paper'>
        <div className='mx-auto max-w-[1180px] overflow-hidden'>
          <StreetScene />
        </div>
        <p className='border-t border-rule px-5 py-3 text-center font-mono text-[11px] leading-relaxed tracking-[0.04em] text-mute uppercase sm:tracking-[0.08em]'>
          Café and kiosco are next to you · librería and taller are not
        </p>
      </div>
    </section>
  )
}
