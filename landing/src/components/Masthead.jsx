import { Logo } from './Logo'

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#beacon', label: 'For shops' },
  { href: '#scan', label: 'For walkers' },
  { href: '#install', label: 'Install' },
  { href: '#track', label: 'Pears Track' },
]

export function Masthead() {
  return (
    <header className="paper sticky top-0 z-40">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-5 py-3 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-6">
        <a href="#opening" className="flex min-w-0 items-center gap-3 no-underline">
          <Logo size={36} />
          <span className="min-w-0">
            <span className="wordmark block">Towerbell</span>
            <span className="font-display text-[13px] italic text-mute">
              Walk by. It shows up.
            </span>
          </span>
        </a>
        <nav aria-label="Sections" className="min-w-0 md:max-w-[28rem]">
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-mute sm:text-[13px] md:justify-end">
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
