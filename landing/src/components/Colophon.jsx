import { REPO_URL } from '../data'
import { Logo } from './Logo'

export function Colophon() {
  return (
    <footer className="border-t border-ink bg-paper">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <span className="wordmark">Towerbell</span>
          </div>
          <p className="mt-4 max-w-[22rem] font-display text-[20px] leading-snug">
            No servers to rent. No account to create. The shop talks if you’re
            close enough.
          </p>
        </div>
        <div className="text-[14px] text-mute md:text-right">
          <p>
            <a
              href={REPO_URL}
              className="text-navy underline decoration-sky/70 underline-offset-4 hover:decoration-navy"
            >
              Source
            </a>
            <span className="mx-2 text-rule">/</span>
            Pears Track
          </p>
          <p className="mt-3 font-display italic">
            A bell only works if someone is near enough to hear it.
          </p>
        </div>
      </div>
    </footer>
  )
}
