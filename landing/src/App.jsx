import { Colophon } from './components/Colophon'
import { Install } from './components/Install'
import { Masthead } from './components/Masthead'
import { Modes } from './components/Modes'
import { Offline } from './components/Offline'
import { Opening } from './components/Opening'
import { Street } from './components/Street'
import { Track } from './components/Track'

export default function App() {
  return (
    <div className="paper min-h-dvh">
      <a className="skip" href="#opening">
        Skip to content
      </a>
      <Masthead />
      <main>
        <Opening />
        <Street />
        <Modes />
        <Offline />
        <Install />
        <Track />
      </main>
      <Colophon />
    </div>
  )
}
