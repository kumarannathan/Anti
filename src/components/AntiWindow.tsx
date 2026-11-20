import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { themeVars, type Theme } from '../lib/themes';
import { useLoop } from '../lib/hooks';
import { Back, Close, Fav, Folder, Forward, Library, Plus, Reload, SidebarToggle } from './Icons';

const W = 960;   // the drawing's own width; it is scaled to fit its stage

const PaneActs = () => <span className="acts"><Back /><Reload /><Close /></span>;

/** The Anti window, drawn in HTML from the app's real sizes and colors, scaled to its container. */
export function AntiWindow({ theme, animate = false, label }: { theme: Theme; animate?: boolean; label?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // the right pane shows its skeleton loader, then crossfades into the page
  useLoop(stage, [[() => setLoaded(false), 1500], [() => setLoaded(true), 4200]], animate);

  const style = { ...themeVars(theme), '--s': scale.toFixed(4) } as CSSProperties;
  return (
    <div className="stage" ref={stage}>
      <div className="win" style={style} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
        <aside className="m-sb">
          <div className="m-tl"><i /><i /><i /><span className="m-space">🏠 Personal</span></div>
          <div className="m-favs">
            {[['#e86a50', 'M'], ['#4f7cf0', 'C'], ['#34a37a', 'D'], ['#a463d6', 'F'], ['#e2a23b', 'P'], ['#3a3f47', 'N'], ['#2fa5c4', 'S'], ['#d9577f', 'T']].map(([c, l]) => (
              <div className="m-fav" key={l + c}><Fav c={c} l={l} /></div>
            ))}
          </div>
          <div className="m-row"><Folder /><span>Launch</span></div>
          <div className="m-row child on"><Fav c="#6a5cff" l="L" /><span>Launch checklist</span></div>
          <div className="m-row child"><Fav c="#34a37a" l="R" /><span>Release notes 0.1</span></div>
          <div className="m-row"><Folder /><span>Reading</span></div>
          <div className="m-row"><Fav c="#e2a23b" l="D" /><span>Design notes</span></div>
          <div className="m-div" />
          <div className="m-row mut"><Plus /><span>New Tab</span><kbd>⌘T</kbd></div>
          <div className="m-row"><Fav c="#2fa5c4" l="W" /><span>Weekend in Lisbon</span></div>
          <div className="m-row"><span className="spin" /><span className="m-skelbar" /></div>
          <div className="m-row"><Fav c="#a463d6" l="K" /><span>Keyboard layouts</span></div>
          <div className="m-foot"><Library /><span className="m-dots"><i className="on" /><i /><i /></span><Plus /></div>
        </aside>
        <div className="m-main">
          <div className="m-top">
            <span className="m-ib"><SidebarToggle /></span><span className="m-ib"><Back /></span><span className="m-ib"><Forward /></span><span className="m-ib"><Reload /></span>
            <span className="m-crumb"><b>Personal</b><span className="sep">›</span><span className="h">notes.local</span><span className="sep">›</span><span className="tt">Launch checklist</span></span>
          </div>
          <div className="m-content">
            <div className="m-pane">
              <div className="m-ph"><Fav c="#6a5cff" l="L" /><span>Launch checklist</span><PaneActs /></div>
              <div className="m-page">
                <div className="doc">
                  <small>notes.local / Launch</small>
                  <h4>Launch checklist</h4>
                  <p>Everything left before the first public build.</p>
                  <div className="chk">
                    {[['y', 'Import from Arc, Chrome and Safari'], ['y', 'Split view, up to four panes'], ['y', 'Passwords filled only when you ask'], ['', 'Record the hero video'], ['', 'Sign and notarize the Mac build'], ['', 'Write the import guide']].map(([c, t]) => (
                      <div className={c} key={t}><i /><span>{t}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={`m-pane${loaded ? ' loaded' : ''}`}>
              <div className="m-ph"><Fav c="#34a37a" l="R" /><span>Release notes 0.1</span><PaneActs /></div>
              <div className="m-page">
                <div className="layer skel" aria-hidden="true">
                  {['38%', '72%', '90%', '84%', '60%', '88%', '70%'].map((w, i) => (
                    <b key={i} style={{ width: w, ...(i === 1 ? { height: 22 } : {}), ...(i === 5 ? { marginTop: 10 } : {}) }} />
                  ))}
                </div>
                <div className="layer page2">
                  <div className="doc">
                    <small>notes.local / Releases</small>
                    <h4>Release notes 0.1</h4>
                    <p>Spaces with their own colors and logins. Ctrl+Tab with live previews. A command bar for addresses, searches and open tabs.</p>
                    <p>Split view up to four panes. Import from Arc, Chrome, Brave, Edge and Safari. Twelve theme presets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
