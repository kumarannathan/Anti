import { useEffect, useState } from 'react';
import { Sky, type SceneConfig } from './Sky';
import { AntiWindow } from './AntiWindow';
import { Command, Grid, Lock, Logo, PaletteIcon, Terminal } from './Icons';
import { sstep, wave } from '../lib/paint';
import type { Theme } from '../lib/themes';

const SECTIONS = [
  { id: 'features', label: 'Features', icon: <Grid /> },
  { id: 'keyboard', label: 'Shortcuts', icon: <Command /> },
  { id: 'themes', label: 'Themes', icon: <PaletteIcon /> },
  { id: 'privacy', label: 'Privacy', icon: <Lock /> },
  { id: 'get', label: 'Get Anti', icon: <Terminal /> },
];

// the grass rises to the right and covers the bottom of the window drawing, as in the reference design
const scene: SceneConfig = {
  seed: 11,
  flowers: 1.2,
  hill(W, H, el) {
    const st = el.querySelector('.stage')?.getBoundingClientRect(), hr = el.getBoundingClientRect();
    const vis = Math.max(60, hr.bottom - (st ? st.top : hr.top + H * 0.6)), k = Math.min(1, W / 1000);
    const L = Math.max(24, vis * (0.1 + 0.1 * k)), R = Math.max(50, Math.min(H * 0.34, vis * (0.38 + 0.26 * k))), wv = wave(34 * k, 160, 1);
    return (x) => L + (R - L) * sstep(0.08, 1, x / W) + wv(x);
  },
};

/** The pill highlights the section in view. */
function useSectionInView() {
  const [cur, set] = useState(SECTIONS[0].id);
  useEffect(() => {
    const seen = new Map<string, number>();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
      let best = SECTIONS[0].id, br = 0;
      SECTIONS.forEach(({ id }) => { const r = seen.get(id) ?? 0; if (r > br) { br = r; best = id; } });
      set(best);
    }, { threshold: [0, 0.25, 0.5, 0.75] });
    SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return cur;
}

export function Hero({ theme }: { theme: Theme }) {
  const cur = useSectionInView();
  return (
    <Sky scene={scene} className="hero" id="top">
      <header className="nav">
        <a className="logo" href="#top" aria-label="Anti, back to top"><Logo />Anti</a>
        <nav className="pill" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={cur === s.id ? 'on' : undefined} aria-label={s.label} title={s.label}>{s.icon}</a>
          ))}
        </nav>
        <a className="btn light" href="#get">Get Anti 0.1</a>
      </header>
      <div className="hero-copy">
        <span className="badge">Open source <i /> v0.1 for macOS</span>
        <h1>The sidebar browser, minus the extras.</h1>
        <p className="lede">Spaces, split view and a command bar in a small, open-source browser for Mac. No account, no AI, nothing to sign up for.</p>
        <div className="cta">
          <a className="btn dark" href="#get">Try Anti 0.1</a>
          <a className="btn light" href="#features">See how it works</a>
        </div>
      </div>
      <div className="mock-wrap">
        <AntiWindow theme={theme} animate label="The Anti window: a sidebar with favorites, pinned folders and today's tabs, and two pages side by side" />
      </div>
    </Sky>
  );
}

export function Banner() {
  return (
    <Sky scene={{ seed: 23 }} className="banner">
      <h2>Everything you organize. Nothing you didn't ask for.</h2>
    </Sky>
  );
}
