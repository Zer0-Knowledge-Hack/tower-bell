import { REPO_URL } from '../data'
import { Logo } from './Logo'

export function Colophon() {
  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <span className="wordmark">Towerbell</span>
          </div>
          <p className="mt-4 max-w-[22rem] font-mono text-[20px] leading-snug text-mute">
            No servers to rent. No account to create. The shop talks if you’re
            close enough.
          </p>
          <p className="mt-3 font-display text-[10px] tracking-[0.12em] text-amber uppercase">
            Team Zero-Knolage
          </p>
        </div>
        <div className="text-[16px] text-mute md:text-right">
          <p>
            <a
              href={REPO_URL}
              className="text-sky underline decoration-sky/70 underline-offset-4 hover:text-amber"
            >
              Source
            </a>
            <span className="mx-2 text-mute">/</span>
            Pears Track
          </p>
          <p className="mt-3 font-mono text-[18px]">
            A bell only works if someone is near enough to hear it.
          </p>
          <img
            src="/owl-team.jpg"
            alt="Zero-Knolage"
            className="mt-4 ml-auto h-24 w-auto border-2 border-sky object-contain [image-rendering:pixelated] md:max-w-[280px]"
          />
        </div>
      </div>
    </footer>
  )
}
