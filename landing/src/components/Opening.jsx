import { INSTALL_COMMAND, SHOPS } from '../data'
import { CopyCommand } from './CopyCommand'
import { ScanDevice } from './ScanDevice'

export function Opening() {
  return (
    <section id="opening" className="paper">
      <div className="mx-auto grid max-w-[1120px] items-end gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
        <div className="min-w-0">
          <p className="kicker mb-5">Walk by. It shows up.</p>
          <h1 className="display text-[clamp(2rem,8.2vw,4.6rem)] text-ink">
            Walk past a shop.{' '}
            <em className="font-normal italic">See today’s promo.</em> No
            internet.
          </h1>
          <p className="mt-7 max-w-[38rem] text-[18px] leading-[1.55] text-ink/90">
            Maps is slow. The pins are paid. The café it shows you closed last
            winter. Towerbell is the shop itself talking when you walk by. No
            account. No signal required.
          </p>
          <p className="mt-4 max-w-[36rem] text-[16px] text-mute">
            A kiosco types its name and today’s deal. Anyone nearby sees it.
          </p>
          <div className="mt-8 max-w-[36rem] min-w-0">
            <CopyCommand command={INSTALL_COMMAND} />
            <p className="mt-3 font-mono text-[12px] text-mute">
              Then choose shop{' '}
              <span className="text-ink">towerbell beacon</span> or walker{' '}
              <span className="text-ink">towerbell scan</span>
            </p>
          </div>
          <p className="mt-6">
            <a
              href="#scan"
              className="text-[15px] text-navy underline decoration-sky/70 underline-offset-4 hover:decoration-navy"
            >
              See how a walk looks
            </a>
          </p>
        </div>
        <div className="min-w-0 lg:mb-1 lg:translate-y-2">
          <ScanDevice shops={SHOPS} />
        </div>
      </div>
    </section>
  )
}
