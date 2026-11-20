import { useRef, useState } from 'react';
import { Sky, type SceneConfig } from './Sky';
import { Fav } from './Icons';
import { useLoop, type Step } from '../lib/hooks';
import { byName, themeVars } from '../lib/themes';
import { wave } from '../lib/paint';

// Default shortcuts from the app's src/main/store.js
const KEYS: [string, string[]][] = [
  ['New tab or command bar', ['⌘', 'T']],
  ['Switch tabs, most recent first', ['⌃', 'Tab']],
  ['Close tab', ['⌘', 'W']],
  ['Reopen closed tab', ['⌘', '⇧', 'T']],
  ['Pin or unpin tab', ['⌘', 'D']],
  ['Copy current URL', ['⌘', '⇧', 'C']],
  ['Copy URL as Markdown', ['⌘', '⇧', '⌥', 'C']],
  ['Show or hide sidebar', ['⌘', 'S']],
  ['Next or previous space', ['⌘', '⌥', '→', 'or', '←']],
  ['New folder', ['⌘', '⇧', 'N']],
  ['Back, forward, reload', ['⌘', '[', ']', 'R']],
  ['Settings', ['⌘', ',']],
];

export const Caps = ({ keys }: { keys: string[] }) => (
  <span className="caps">{keys.map((k, i) => (k === 'or' ? <span key={i}>or</span> : <span className="cap" key={i}>{k}</span>))}</span>
);

const scene: SceneConfig = { seed: 41, flowers: 0.8, hill: (W, H) => { const wv = wave(26, 140, 7); return (x) => H * 0.11 + (x / W) * H * 0.05 + wv(x); } };

const TABS: [string, string, string, string][] = [['L', '#6a5cff', 'Launch checklist', 'notes.local'], ['R', '#34a37a', 'Launch retro', 'docs.local'], ['W', '#2fa5c4', 'Weekend in Lisbon', 'trips.local']];
const WORD = 'launch';

/** The command bar as the app draws it (src/renderer/command.html), typing a query that matches open tabs. */
function CommandBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(0);
  const [sel, setSel] = useState(0);
  const steps: Step[] = [[() => { setTyped(0); setSel(0); }, 1200]];
  for (let k = 1; k <= WORD.length; k++) steps.push([() => setTyped(k), 110]);
  steps.push([() => setSel(1), 900], [() => setSel(0), 1800]);
  useLoop(ref, steps);
  const q = WORD.slice(0, typed);
  const rows = q ? [TABS[0], TABS[1], ['⌕', '#3c3c46', `Search for “${q}”`, '']] : TABS;
  return (
    <div className="cmd" ref={ref}>
      <div className="in"><span>{q}</span><span className="caret" />{!q && <span className="ph">Search or enter URL…</span>}</div>
      <div className="res">
        {rows.map(([l, c, t, u], i) => (
          <div key={i} className={`row${i === sel ? ' sel' : ''}`}><Fav c={c} l={l} /><span className="t">{t}</span><span className="u">{u}</span></div>
        ))}
      </div>
      <div className="hint">↵ open · ↑↓ pick a tab · Esc close</div>
    </div>
  );
}

const CARDS: [string, string, string, string[]][] = [
  ['L', '#6a5cff', 'Launch checklist', ['90%', '70%', '80%']], ['R', '#34a37a', 'Release notes', ['76%', '88%']],
  ['W', '#2fa5c4', 'Weekend in Lisbon', ['84%', '62%', '70%']], ['D', '#e2a23b', 'Design notes', ['66%', '92%']],
];

/** The Ctrl+Tab switcher (src/renderer/switcher.html) stepping through recent tabs. */
function Switcher() {
  const ref = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState(1);
  useLoop(ref, [[() => setSel((s) => (s + 1) % CARDS.length), 950]]);
  return (
    <>
      <div className="sw" ref={ref} style={themeVars(byName('Midnight'))}>
        {CARDS.map(([l, c, t, lines], i) => (
          <div key={t} className={`swc${i === sel ? ' sel' : ''}`}>
            <div className="th"><b />{lines.map((w, j) => <b key={j} style={{ width: w }} />)}</div>
            <div className="mt"><Fav c={c} l={l} />{t}</div>
          </div>
        ))}
      </div>
      <div className="sw-cap"><span className="cap">⌃</span><span className="cap">Tab</span> release to switch</div>
    </>
  );
}

export function Keyboard() {
  return (
    <section className="two" id="keyboard" aria-labelledby="kb-h">
      <div className="kb-text panel">
        <h2 id="kb-h">Built for the keyboard.</h2>
        <p className="sub">One box for addresses, searches and every tab you already have open. Hold Control and tap Tab to go back to where you just were. Every shortcut can be remapped except that one.</p>
        <div className="keys">
          {KEYS.map(([label, keys]) => <div className="krow" key={label}><span>{label}</span><Caps keys={keys} /></div>)}
        </div>
      </div>
      <Sky as="div" scene={scene} className="kb-scene">
        <div aria-hidden="true"><CommandBar /><Switcher /></div>
      </Sky>
    </section>
  );
}
