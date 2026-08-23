/** Presentation copy — keep English for judging */
export const PITCH = {
  name: 'TOWERBELL',
  oneLiner: 'Hyperlocal shop discovery without internet, servers, or accounts.',
  problem:
    'When you walk a new street, maps need internet, accounts, and paid listings. Local shops that are open right now stay invisible offline.',
  solution:
    'A shop turns on a Towerbell beacon. Travelers nearby see name, category, hours, and today’s promo on a free local map — peer-to-peer.',
  how: 'UI talks only to scan() and beacon(). Expo runs a mock contract today. On Pear Mobile the same contract plugs into Hyperswarm + Hyperbee via a Bare worklet.',
  criteria: [
    {
      title: 'Technicality',
      body: 'Clean P2P contract, role ACL, permissions gate, OSM map, notifications, dark mode, Expo → Bare migration path.'
    },
    {
      title: 'Originality',
      body: 'Discovery is hyperlocal and offline-first — not another Maps clone. Beacon + traveler modes share one binary idea.'
    },
    {
      title: 'UI / UX / DX',
      body: 'English UI, owl brand, map/radar/list, loading states, dark mode, role isolation, docs for judges and APK build.'
    },
    {
      title: 'Practicality',
      body: 'Real use: street markets, outages, tourist zones with weak data. Free map tiles. Demo works on web without keys.'
    },
    {
      title: 'Presentation',
      body: 'About screen + docs/DEMO.md + docs/JUDGING.md. Clear 90-second walkthrough for travelers and shops.'
    }
  ],
  demoSteps: [
    'Open app → pick Traveler → allow permissions.',
    'Nearby opens with Map (OpenStreetMap). Watch peers appear.',
    'Open a place → Connect / Save promo. Check the bell.',
    'Settings → switch to Shop → Start broadcasting.',
    'Toggle Dark mode. Show About for the pitch story.'
  ]
}
