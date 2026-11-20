import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Sky, type SceneConfig } from './Sky';
import { ImportDemo, PasswordsDemo, SplitDemo, SpacesDemo } from './demos';
import { useInView, useReducedMotion } from '../lib/hooks';
import { wave } from '../lib/paint';

const DURATION = 7000;   // each tab plays this long before the next one

const TABS = [
  { title: 'Spaces', sub: 'Swipe between worlds', Demo: SpacesDemo, cta: ['See the shortcuts', '#keyboard'],
    text: "Work, personal and side projects each get their own tabs, colors and, if you like, their own logins. Two fingers sideways on the sidebar and you're somewhere else." },
  { title: 'Split view', sub: 'Up to four panes', Demo: SplitDemo, cta: ['Try Anti 0.1', '#get'],
    text: 'Drag a tab from the sidebar onto any edge of the page. Split side by side or top and bottom, up to four panes, each with its own back, forward and reload.' },
  { title: 'Import', sub: 'From Arc, Chrome, Safari', Demo: ImportDemo, cta: ['Import questions', '#faq'],
    text: 'Anti finds the browsers on your Mac and shows what each can bring. Arc spaces arrive with their names, icons and colors. Run it twice and nothing doubles up.' },
  { title: 'Passwords', sub: 'Filled when you ask', Demo: PasswordsDemo, cta: ['How privacy works', '#privacy'],
    text: "Saved logins are encrypted with your Mac's Keychain. The list appears only when you click into a login field, only on the site it was saved for, and the page can't touch it." },
] as const;

const scene: SceneConfig = {
  seed: 37,
  flowers: 1,
  rock: { x: 0.6, y: 0.8, rx: 0.46, ry: 0.13 },
  hill: (W, H) => { const wv = wave(22, 120, 4); void W; return (x) => H * 0.15 + wv(x); },
};

export function Features() {
  const [cur, setCur] = useState(0);
  const section = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const visible = useInView(section, 0.25);
  const reduce = useReducedMotion();
  const hovering = useRef(false);
  const elapsed = useRef(0);

  // the active tab's underline fills as it plays; written straight to the element, no re-render per frame
  useEffect(() => {
    elapsed.current = 0;
    tabRefs.current.forEach((t, j) => t?.style.setProperty('--p', String(j < cur || (reduce && j === cur) ? 1 : 0)));
    if (reduce || !visible) return;
    let last = 0, raf = 0;
    const tick = (now: number) => {
      const dt = last ? now - last : 0;
      last = now;
      if (!hovering.current && !document.hidden) {
        elapsed.current += dt;
        tabRefs.current[cur]?.style.setProperty('--p', Math.min(1, elapsed.current / DURATION).toFixed(4));
        if (elapsed.current >= DURATION) { setCur((c) => (c + 1) % TABS.length); return; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cur, visible, reduce]);

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    setCur(n);
    tabRefs.current[n]?.focus();
  };

  return (
    <section className="features" id="features" aria-label="Features" ref={section}
      onPointerEnter={() => { hovering.current = true; }} onPointerLeave={() => { hovering.current = false; }}>
      <div className="tabpanel">
        <div className="tabs" role="tablist" aria-label="Features">
          {TABS.map((t, i) => (
            <button key={t.title} ref={(el) => { tabRefs.current[i] = el; }} className="ftab" role="tab" id={`t${i}`} aria-controls={`c${i}`}
              aria-selected={i === cur} tabIndex={i === cur ? 0 : -1} onClick={() => setCur(i)} onKeyDown={(e) => onKey(e, i)} style={{ '--p': 0 } as CSSProperties}>
              <b>{t.title}</b><small>{t.sub}</small>
            </button>
          ))}
        </div>
        {TABS.map((t, i) => i === cur && (
          <div className="fcopy in" role="tabpanel" id={`c${i}`} aria-labelledby={`t${i}`} key={t.title}>
            <h3>{t.title}</h3>
            <p>{t.text}</p>
            <a className="btn dark" href={t.cta[1]}>{t.cta[0]}</a>
          </div>
        ))}
      </div>
      <Sky as="div" scene={scene} className="scene">
        {TABS.map(({ title, Demo }, i) => (
          <div key={title} className={`fdemo${i === cur ? ' on' : ''}`} aria-hidden="true">
            <Demo active={i === cur && visible} />
          </div>
        ))}
      </Sky>
    </section>
  );
}
