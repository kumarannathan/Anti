import { useRef, useState, type CSSProperties } from 'react';
import { AntiWindow } from './AntiWindow';
import { Sky, type SceneConfig } from './Sky';
import { THEMES, themeBg } from '../lib/themes';
import { wave } from '../lib/paint';

export function Themes({ current, onPick }: { current: number; onPick: (i: number) => void }) {
  return (
    <section className="sect panel" id="themes" aria-labelledby="th-h">
      <div className="th-grid">
        <div>
          <h2 id="th-h">Every space gets its own color.</h2>
          <p className="sub">Twelve presets, one click each, or mix your own accent and sidebar gradient. The whole window takes the color, and a light sidebar switches to dark text by itself.</p>
          <div className="swatches" role="group" aria-label="Theme presets">
            {THEMES.map((t, i) => (
              <button key={t.name} type="button" className="swb" aria-pressed={i === current} onClick={() => onPick(i)}
                style={{ '--bg': themeBg(t), '--ac': t.accent } as CSSProperties}>
                <span className="s"><i /></span>{t.name}
              </button>
            ))}
          </div>
          <p className="th-note">Pick one to recolor the preview, and the window at the top of the page.</p>
        </div>
        <div className="pv"><AntiWindow theme={THEMES[current]} /></div>
      </div>
    </section>
  );
}

const DETAILS: [string, string][] = [
  ['Warms up on hover', 'Hovering a tab opens a connection to its site. Pressing the mouse starts the load before the click completes.'],
  ['Instant switching', 'Background tabs are hidden, not resized, so coming back to one is immediate.'],
  ['Skeleton loaders', "A new page shows a placeholder in your theme's colors, then crossfades into the real thing."],
  ['Frames that match', "Anti reads each page's background color and paints the card behind it, so edges never flash."],
  ['Ready on the first frame', 'The command bar, switcher, settings and toasts are drawn ahead of time and wait off screen.'],
  ['In step with your display', "The sidebar slides on your screen's own refresh, 60 or 120 times a second."],
  ['Lazy tabs', 'A tab loads only when you open it, so a sidebar of 200 links costs nothing.'],
  ['Quiet saves', 'Changes are written in the background and swapped in whole, so a crash never leaves half a file.'],
];

export function Details() {
  return (
    <section className="sect" id="details" aria-labelledby="det-h">
      <h2 id="det-h">No white flashes.</h2>
      <p className="sub">Anti starts loading before your click lands, keeps background tabs ready and never shows a blank page while one loads.</p>
      <div className="det">{DETAILS.map(([t, d]) => <div key={t}><b>{t}</b><p>{d}</p></div>)}</div>
    </section>
  );
}

const PRIVACY: [string, string][] = [
  ['No account, no sync, no telemetry', "Nothing to sign in to. There's no analytics, crash reporting or update check in the code. Anti goes online for the pages you open, their icons, and a warm-up connection when you hover a tab."],
  ['Passwords locked by your Keychain', 'Each saved login is encrypted on its own with a key held in the macOS Keychain. Copying one asks for Touch ID when your Mac has it, and the clipboard clears after 45 seconds.'],
  ["Autofill a page can't fake", 'The "Anti Passwords" list is drawn by Anti above the page, opens only on your click or keypress, and fills only the exact site the login was saved for.'],
  ['Profiles that stay apart', "Each profile has its own cookies, logins and storage. Imports read the other browser's files on your Mac, and passwords only if you tick them and approve the Keychain prompt."],
];

export function Privacy() {
  return (
    <section className="sect panel" id="privacy" aria-labelledby="pri-h">
      <h2 id="pri-h">Your browser, not a service.</h2>
      <p className="sub">There's no Anti server to send anything to. Your tabs, spaces, settings and passwords live in files on your Mac.</p>
      <div className="pri">{PRIVACY.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div>
      <p className="fine">Google is the default search engine. DuckDuckGo, Brave, Kagi, Startpage, Ecosia or Bing is one click away in Settings, or during first-run setup.</p>
    </section>
  );
}

const OUT = ['Easel', 'Boosts', 'Notes', 'AI chat', 'Accounts', 'Sync', 'Telemetry'];

export function LeftOut() {
  return (
    <section className="sect center" id="left-out" aria-labelledby="out-h">
      <h2 id="out-h">Left out on purpose.</h2>
      <p className="sub">Anti keeps the parts of a sidebar browser you use every day and skips the rest.</p>
      <div className="out" aria-label={`Not in Anti: ${OUT.join(', ')}`}>{OUT.map((o) => <span key={o} aria-hidden="true">{o}</span>)}</div>
    </section>
  );
}

function CopyLine({ cmd }: { cmd: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState('Copy');
  const flash = (t: string, ms: number) => { setLabel(t); window.setTimeout(() => setLabel('Copy'), ms); };
  const pick = () => {
    const el = ref.current, sel = getSelection();
    if (el && sel) { const r = document.createRange(); r.selectNodeContents(el); sel.removeAllRanges(); sel.addRange(r); }
    flash('Press ⌘C', 1800);
  };
  const copy = () => {
    try { navigator.clipboard.writeText(cmd).then(() => flash('Copied', 1400), pick); } catch { pick(); }
  };
  return <div className="code"><span ref={ref}>{cmd}</span><button className="copy" type="button" onClick={copy}>{label}</button></div>;
}

export function GetAnti() {
  return (
    <section className="sect panel" id="get" aria-labelledby="get-h">
      <div className="get">
        <div>
          <h2 id="get-h">Anti 0.1 runs from source.</h2>
          <p className="sub">There's no signed Mac app yet. Until there is, you can run Anti from its source code on your Mac.</p>
          <div className="req">
            <div><b>System</b><span>macOS 11 Big Sur or later</span></div>
            <div><b>Tools</b><span>Node.js and npm</span></div>
            <div><b>Engine</b><span>Chromium, through Electron 35</span></div>
            <div><b>License</b><span>MIT</span></div>
          </div>
        </div>
        <div>
          <div className="steps"><CopyLine cmd="npm install" /><CopyLine cmd="npm start" /></div>
          <p className="fine">Run both in the project folder. The first launch opens a short setup: import, a theme for your first space, a search engine and the shortcuts worth knowing.</p>
          <div className="notyet">
            <b>Not in 0.1 yet</b>
            <ul>{['Signed, notarized Mac app', 'Find in page and zoom', 'Saving passwords as you sign in', 'Downloads and history', 'Chrome extensions'].map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const QUESTIONS: [string, string][] = [
  ['Is this Arc?', "No. Anti is an independent, open-source browser that works the way Arc's sidebar does. It can import your Arc spaces, but it isn't made by or affiliated with The Browser Company."],
  ['Does it have AI features?', "No. There's no assistant, no summaries and no chat."],
  ['Does it sync between Macs?', "No. There's no account and no server. Everything stays in files on your Mac."],
  ['What can I bring over from Arc?', "Spaces with their names, icons and colors, pinned folders and tabs, Today tabs, Favorites, profiles, bookmarks, passwords, and your homepage and search engine. Arc's symbol icons have no emoji equivalent, so those spaces get a plain star."],
  ['How do I bring my Safari passwords?', "Safari doesn't let other apps read them. In Safari choose File › Export › Passwords…, then import the CSV in Anti's Settings › Import. Safari bookmarks need Full Disk Access, and Anti links straight to that setting."],
  ['Can I use Chrome extensions?', 'Not in 0.1.'],
  ['Windows or Linux?', 'Anti is built for macOS. Keychain encryption, Touch ID and browser import are Mac-only.'],
  ['Where is my data?', "In your user's Application Support folder: one file for tabs, spaces and settings, an encrypted file for passwords, and a separate store for each profile's cookies."],
];

export function Faq() {
  return (
    <section className="sect" id="faq" aria-labelledby="faq-h">
      <div className="faq">
        <div><h2 id="faq-h">Questions.</h2></div>
        <div>{QUESTIONS.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </div>
    </section>
  );
}

const footScene: SceneConfig = {
  seed: 53,
  flowers: 1.4,
  hill: (W, H) => { const wv = wave(30, 170, 9); return (x) => H * 0.2 + Math.pow(Math.abs(x / W - 0.5) * 2, 2) * H * 0.12 + wv(x); },
};

export function Footer() {
  return (
    <Sky as="footer" scene={footScene} className="foot" over={<div className="legal">MIT licensed · Version 0.1 · Made for macOS</div>}>
      <div className="big">Anti</div>
      <p>An open-source sidebar browser for Mac.</p>
      <nav aria-label="Footer">
        {[['features', 'Features'], ['keyboard', 'Shortcuts'], ['themes', 'Themes'], ['privacy', 'Privacy'], ['get', 'Get Anti 0.1'], ['faq', 'Questions']].map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}
      </nav>
    </Sky>
  );
}
