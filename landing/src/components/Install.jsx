import { INSTALL_COMMAND } from '../data'
import { CopyCommand } from './CopyCommand'

export function Install() {
  return (
    <section id="install" className="paper border-t border-rule">
      <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="kicker mb-4">Install</p>
            <h2 className="display text-[clamp(1.9rem,3.4vw,3rem)]">
              Install it once. It updates itself.
            </h2>
            <p className="mt-5 max-w-[28rem] text-[17px]">
              One command puts it on your machine. Then you choose shop or
              walker. Works on Mac, Windows, and Linux. There is also a phone
              app.
            </p>
          </div>
          <p className="font-mono text-[13px] text-mute lg:text-right">
            one command · then pick a side
          </p>
        </div>
        <div className="mt-10 min-w-0 border-2 border-sky bg-deep px-3 py-4 sm:px-6 sm:py-5">
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            <li className="min-w-0">
              <CopyCommand command={INSTALL_COMMAND} />
            </li>
            <li className="min-w-0">
              <CopyCommand command="towerbell beacon" />
            </li>
            <li className="min-w-0">
              <CopyCommand command="towerbell scan" />
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
