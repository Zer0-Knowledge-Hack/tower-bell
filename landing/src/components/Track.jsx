import { INSTALL_COMMAND, PEAR_LINK, REPO_URL } from '../data'
import { CopyCommand } from './CopyCommand'

const rows = [
  {
    mark: 'yes',
    plain: 'We started from the official Pear template. The shop and walker screens stay open, so updates run in the background.',
    term: 'hello-pear-bare · worker thread',
  },
  {
    mark: 'yes',
    plain: 'Anyone can install it with one command. We deploy it and keep it seeded.',
    term: 'pear install · seeded',
  },
  {
    mark: 'yes',
    plain: 'A new release reaches a copy already installed. Nobody opens a store. Nobody downloads it again.',
    term: 'P2P OTA updates',
  },
  {
    mark: 'yes',
    plain: 'Shops and walkers find each other directly. No company server in the middle.',
    term: 'Hyperswarm',
  },
  {
    mark: 'yes',
    plain: 'The shop card lives on the shop’s machine and copies to whoever is close. There is no central database.',
    term: 'Hyperbee / Hypercore',
  },
  {
    mark: 'aim',
    plain: 'No internet at all is the bonus we aimed at. Bluetooth discovery is still rough. Same-Wi‑Fi without internet is the floor we designed if it stays that way.',
    term: 'BLE-Swarm · bonus · mDNS as floor',
  },
  {
    mark: 'yes',
    plain: 'One program. Two sides: shop or walker. It stays open and can update while it runs.',
    term: 'Process shape',
  },
  {
    mark: 'yes',
    plain: 'A shop announces today’s promo. A walker sees what’s open on this sidewalk. That is something a person would actually use.',
    term: 'Would you use it',
  },
]

export function Track() {
  return (
    <section id="track" className="border-t border-rule bg-paper-2">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12 lg:py-24">
        <div className="min-w-0">
          <p className="kicker mb-4">Pears Track · Holepunch</p>
          <h2 className="display text-[clamp(1.9rem,3.4vw,3rem)]">
            Aleph Hackathon, Pear track
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px]">
            Pear lets you ship an app with no servers, no app store, no package
            registry. People install it with pear install. Updates arrive from
            other people who already have it.
          </p>
          <p className="mt-4 max-w-[30rem] text-[15px] text-mute">
            After that first install, they need no Node, no extra runtime, no
            Pear menu. One file per computer. Mac, Linux, Windows — arm64 and
            x64.
          </p>
          <p className="mt-6 max-w-[30rem] text-[15px]">
            Turn the Wi‑Fi off. It keeps listing.
          </p>
          <div className="mt-8 max-w-[34rem] min-w-0">
            <p className="mb-2 font-mono text-[11px] tracking-[0.12em] text-mute uppercase">
              The link judges need
            </p>
            <CopyCommand command={INSTALL_COMMAND} />
            <p className="mt-2 break-all font-mono text-[11px] text-mute">
              {PEAR_LINK}
            </p>
          </div>
        </div>
        <ol className="m-0 list-none p-0">
          {rows.map((row) => (
            <li key={row.term} className="score">
              <span
                className={`score-mark ${row.mark === 'aim' ? 'is-aim' : ''}`}
                aria-hidden="true"
              />
              <div>
                <p className="text-[16px] leading-snug text-ink">{row.plain}</p>
                <p className="mt-1.5 font-mono text-[11px] tracking-[0.04em] text-navy">
                  {row.term}
                </p>
              </div>
            </li>
          ))}
          <li className="score">
            <span className="score-mark" aria-hidden="true" />
            <p className="text-[15px]">
              <a
                href={REPO_URL}
                className="text-navy underline decoration-sky/70 underline-offset-4 hover:decoration-navy"
              >
                Source on GitHub
              </a>
              <span className="text-mute">
                {' '}
                · started from hello-pear-bare
              </span>
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}
