import { StreetScene } from './StreetScene'

export function Street() {
  return (
    <section id="how" className="border-t border-rule bg-paper-2">
      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div className="max-w-[28rem]">
            <p className="kicker mb-4">Range</p>
            <h2 className="display text-[clamp(1.9rem,3.4vw,3rem)]">
              A sidewalk is the whole network.
            </h2>
            <p className="mt-5 text-[17px] text-ink/90">
              A beacon does not travel the city. It travels as far as a person
              walking. That is the design, not a limit. Three blocks over,
              another barrio, another bell.
            </p>
          </div>
          <p className="max-w-[34rem] justify-self-end text-[15px] text-mute lg:text-right">
            Only the shops inside the arc show up. The librería and the taller
            keep ringing for someone else.
          </p>
        </div>
      </div>
      <div className="border-y border-rule bg-paper">
        <div className="mx-auto max-w-[1180px]">
          <StreetScene />
        </div>
        <p className="border-t border-rule px-5 py-3 text-center font-mono text-[11px] tracking-[0.08em] text-mute uppercase">
          Café and kiosco in range · librería and taller out
        </p>
      </div>
    </section>
  )
}
