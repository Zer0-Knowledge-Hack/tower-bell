import { INSTALL_COMMAND, SHOPS } from '../data'
import { CopyCommand } from './CopyCommand'
import { ScanDevice } from './ScanDevice'

export function Opening() {
  return (
    <section id="opening" className="paper">
      <div className="mx-auto grid max-w-[1120px] items-end gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-24">
        <div>
          <p className="kicker mb-5">Buenos Aires · barrio edition</p>
          <h1 className="display text-[clamp(2.4rem,5.4vw,4.6rem)] text-ink">
            The shop across the street can ring.{' '}
            <em className="font-normal italic">You hear it if you’re close.</em>
          </h1>
          <p className="mt-7 max-w-[38rem] text-[18px] leading-[1.55] text-ink/90">
            Maps still lists the café that closed last winter. Paid pins. A
            spinner when the signal dies. Towerbell is a bell on the block: the
            kiosco turns it on, you walk past, it appears.
          </p>
          <p className="mt-4 max-w-[36rem] text-[16px] text-mute">
            No internet. No servers. No accounts. A shop broadcasts a card —
            name, rubro, hours, today’s line — and a walker sees it. That is
            the whole product.
          </p>
          <div className="mt-8 max-w-[36rem]">
            <CopyCommand command={INSTALL_COMMAND} />
            <p className="mt-3 font-mono text-[12px] text-mute">
              Then <span className="text-ink">towerbell scan</span> or{' '}
              <span className="text-ink">towerbell beacon</span>
            </p>
          </div>
          <p className="mt-6">
            <a
              href="#scan"
              className="text-[15px] text-navy underline decoration-sky/70 underline-offset-4 hover:decoration-navy"
            >
              See how a scan looks
            </a>
          </p>
        </div>
        <div className="lg:mb-1 lg:translate-y-2">
          <ScanDevice shops={SHOPS} />
        </div>
      </div>
    </section>
  )
}
