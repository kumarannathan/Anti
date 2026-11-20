import { useRef, useState, type CSSProperties } from 'react';
import { useLoop } from '../lib/hooks';
import { byName, themeBg, themeVars } from '../lib/themes';
import { Check, Fav, Key } from './Icons';

// Small animated pieces of Anti's UI for the feature tabs. Each loops only while `active` and on screen,
// and rests on a state that reads on its own (a thumbnail or a reduced-motion visitor sees that).

type Row = [color: string, letter: string, title: string];

/* ---------- spaces: a narrow sidebar swiping between three spaces ---------- */
const SPACES: { name: string; theme: string; favs: [string, string][]; rows: Row[] }[] = [
  { name: '🏠 Personal', theme: 'Ocean', favs: [['#e86a50', 'M'], ['#4f7cf0', 'C'], ['#34a37a', 'D'], ['#a463d6', 'F']],
    rows: [['#2fa5c4', 'W', 'Weekend in Lisbon'], ['#e2a23b', 'R', 'Recipes to try'], ['#d9577f', 'P', 'Photo library'], ['#3a3f47', 'B', 'Bike repair guide']] },
  { name: '💼 Work', theme: 'Sunset', favs: [['#4f7cf0', 'I'], ['#3a3f47', 'G'], ['#34a37a', 'S'], ['#e86a50', 'Q']],
    rows: [['#6a5cff', 'P', 'Pull requests'], ['#e2a23b', 'S', 'Sprint board'], ['#2fa5c4', 'D', 'Design review'], ['#a463d6', 'O', 'On-call notes']] },
  { name: '✦ Side project', theme: 'Forest', favs: [['#34a37a', 'A'], ['#d9577f', 'T'], ['#e2a23b', 'F'], ['#4f7cf0', 'L']],
    rows: [['#6a5cff', 'L', 'Launch checklist'], ['#34a37a', 'R', 'Release notes 0.1'], ['#e86a50', 'T', 'Type specimens'], ['#2fa5c4', 'I', 'Icon sketches']] },
];

export function SpacesDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useLoop(ref, [[() => setK(0), 2300], [() => setK(1), 2300], [() => setK(2), 2300]], active);
  return (
    <div className="ms" ref={ref} style={themeVars(byName(SPACES[k].theme))}>
      {SPACES.map((s, i) => <div key={s.name} className={`bgl${i === k ? ' on' : ''}`} style={{ background: themeBg(byName(s.theme)) }} />)}
      <div className="ms-head"><i /><i /><i /><span className="ms-name">{SPACES[k].name}</span></div>
      <div className="ms-view">
        <div className="ms-track" style={{ transform: `translateX(${(-k * 100) / 3}%)` }}>
          {SPACES.map((s) => (
            <div className="ms-page" key={s.name}>
              <div className="m-favs">{s.favs.map(([c, l]) => <div className="m-fav" key={l}><Fav c={c} l={l} /></div>)}</div>
              {s.rows.map(([c, l, t], j) => <div key={t} className={`m-row${j === 0 ? ' on' : ''}`}><Fav c={c} l={l} /><span>{t}</span></div>)}
            </div>
          ))}
        </div>
      </div>
      <div className="ms-foot"><span className="m-dots">{SPACES.map((s, i) => <i key={s.name} className={i === k ? 'on' : undefined} />)}</span></div>
    </div>
  );
}

/* ---------- split view: panes arrive one at a time, each after its drop highlight ---------- */
type Rect = [x: number, y: number, w: number, h: number];
const G = 3, HF = (100 - G) / 2, B = HF + G;
const FULL: Rect = [0, 0, 100, 100];
const HINTS: { r: Rect; label: string }[] = [
  { r: [B, 0, HF, 100], label: 'Split Right' },
  { r: [B, B, HF, HF], label: 'Split Bottom' },
  { r: [0, B, HF, HF], label: 'Split Bottom' },
];
// each step: where the visible panes sit, and which drop highlight (if any) is up
const STEPS: { panes: Rect[]; hint?: number }[] = [
  { panes: [FULL] },
  { panes: [FULL], hint: 0 },
  { panes: [[0, 0, HF, 100], [B, 0, HF, 100]] },
  { panes: [[0, 0, HF, 100], [B, 0, HF, 100]], hint: 1 },
  { panes: [[0, 0, HF, 100], [B, 0, HF, HF], [B, B, HF, HF]] },
  { panes: [[0, 0, HF, 100], [B, 0, HF, HF], [B, B, HF, HF]], hint: 2 },
  { panes: [[0, 0, HF, HF], [B, 0, HF, HF], [B, B, HF, HF], [0, B, HF, HF]] },
];
const PANES: [string, string, string, number][] = [['#6a5cff', 'L', 'Launch checklist', 4], ['#34a37a', 'R', 'Release notes', 3], ['#e2a23b', 'D', 'Design notes', 2], ['#2fa5c4', 'P', 'Preview', 2]];
const WIDTHS = ['50%', '86%', '72%', '80%'];
const box = (r: Rect): CSSProperties => ({ left: `${r[0]}%`, top: `${r[1]}%`, width: `${r[2]}%`, height: `${r[3]}%` });

export function SplitDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(STEPS.length - 1);
  useLoop(ref, [[() => setS(0), 900], [() => setS(1), 900], [() => setS(2), 1100], [() => setS(3), 900], [() => setS(4), 1100], [() => setS(5), 900], [() => setS(6), 2400]], active);
  const step = STEPS[s], hint = step.hint != null ? HINTS[step.hint] : null;
  return (
    <div className="float" ref={ref}>
      <div className="sd" style={themeVars(byName('Midnight'))}>
        <div className="sd-top"><i /><i /><i /></div>
        <div className="sd-area">
          {PANES.map(([c, l, t, lines], j) => {
            const r = step.panes[j];
            // a pane not shown yet waits, invisible, where its drop highlight will appear
            const style = { ...box(r ?? (j === 0 ? FULL : HINTS[j - 1].r)), opacity: r ? 1 : 0 };
            return (
              <div className="sd-pane" key={t} style={style}>
                <div className="hd"><Fav c={c} l={l} />{t}</div>
                <div className="pg">{WIDTHS.slice(0, lines).map((w, i) => <b key={i} style={{ width: w }} />)}</div>
              </div>
            );
          })}
          <div className={`sd-hint${hint ? ' on' : ''}`} style={box(hint ? hint.r : HINTS[0].r)}><span>{hint ? hint.label : 'Split Right'}</span></div>
        </div>
      </div>
      <div className="sd-cap"><span><b>{step.panes.length}</b> of 4 panes</span><span>Double-click a divider to reset</span></div>
    </div>
  );
}

/* ---------- import: what each browser can bring, and the toast ---------- */
const SOURCES: [string, string, string][] = [
  ['A', 'Arc', 'Spaces, colors, passwords'], ['C', 'Chrome', 'Bookmarks, profiles'], ['B', 'Brave', 'Bookmarks, passwords'],
  ['E', 'Edge', 'Bookmarks, passwords'], ['S', 'Safari', 'Bookmarks, Reading List'], ['↥', 'A file', 'Bookmarks HTML, passwords CSV'],
];

export function ImportDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(true);
  useLoop(ref, [[() => setOn(false), 700], [() => setOn(true), 2600]], active);
  return (
    <div ref={ref}>
      <div className="float">
        <div className="imp-grid">
          {SOURCES.map(([m, n, d]) => <div className="imp" key={n}><span className="mono">{m}</span><div><b>{n}</b><small>{d}</small></div></div>)}
        </div>
      </div>
      <div className="toastp"><span className={on ? 'on' : undefined}><Check />Imported from Arc</span></div>
    </div>
  );
}

/* ---------- passwords: the list appears under the field, a row is picked, the form fills ---------- */
type Phase = 'empty' | 'open' | 'picked' | 'filled';

export function PasswordsDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState<Phase>('picked');
  useLoop(ref, [[() => setP('empty'), 700], [() => setP('open'), 900], [() => setP('picked'), 800], [() => setP('filled'), 2600]], active);
  const filled = p === 'filled', listOn = p === 'open' || p === 'picked';
  return (
    <div className="float login" ref={ref}>
      <div className="site"><i />account.example.com</div>
      <div><label>Email</label><div className={`fld${filled ? '' : ' focus'}`}><span className="val">{filled ? 'you@example.com' : ''}</span>{!filled && <span className="caret" />}</div></div>
      <div className="afl">
        <div className={`aflist${listOn ? ' on' : ''}`}>
          <div className="hdr">Anti Passwords</div>
          <div className={`r${p === 'picked' ? ' sel' : ''}`}><Key />you@example.com</div>
          <div className="r"><Key />team@example.com</div>
        </div>
      </div>
      <div><label>Password</label><div className="fld"><span className="val">{filled ? '••••••••••••' : ''}</span></div></div>
      <div className="submit">Sign in</div>
    </div>
  );
}
