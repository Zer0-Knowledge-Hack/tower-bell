import { INSTALL_COMMAND } from '../data'
import { CopyCommand } from './CopyCommand'

export function Install() {
  return (
    <section id="install" className="paper border-t border-rule">
      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="kicker mb-4">Install</p>
            <h2 className="display text-[clamp(1.9rem,3.4vw,3rem)]">
              A tool, not an account.
            </h2>
            <p className="mt-5 max-w-[28rem] text-[17px]">
              The binary updates itself. macOS, Linux, Windows — arm64 and x64.
              There is a React Native app for the same two roles. This page is
              not the product.
            </p>
          </div>
          <p className="font-mono text-[13px] text-mute lg:text-right">
            pear install · then pick a mode
          </p>
        </div>
        <div className="mt-10 bg-[#111410] px-4 py-5 sm:px-6">
          <ol className="m-0 flex list-none flex-col gap-3 p-0">
            <li>
              <CopyCommand command={INSTALL_COMMAND} />
            </li>
            <li>
              <CopyCommand command="towerbell beacon" />
            </li>
            <li>
              <CopyCommand command="towerbell scan" />
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
