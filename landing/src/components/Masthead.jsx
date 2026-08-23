import { BellMark } from './BellMark'

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#beacon', label: 'For shops' },
  { href: '#scan', label: 'For walkers' },
  { href: '#install', label: 'Install' },
]

export function Masthead() {
  return (
    <header className="paper sticky top-0 z-40">
      <div className="mx-auto flex max-w-[1120px] items-end justify-between gap-6 px-5 py-3.5 sm:px-8">
        <a href="#opening" className="flex items-end gap-3 no-underline">
          <BellMark className="mb-0.5 h-8 w-8 text-navy" />
          <span>
            <span className="wordmark block">Towerbell</span>
            <span className="font-display text-[13px] italic text-mute">
              Hyperlocal. No internet.
            </span>
          </span>
        </a>
        <nav aria-label="Sections">
          <ul className="flex flex-wrap justify-end gap-x-5 gap-y-1 text-[13px] text-mute">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="underline-offset-4 hover:text-navy hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <hr className="double-rule m-0" />
    </header>
  )
}
