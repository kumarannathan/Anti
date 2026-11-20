# Anti website

The marketing site for Anti: React 18 + TypeScript, built with Vite. It's separate from the browser app (its own `package.json`); nothing here touches `../src`.

```bash
npm install
npm run dev        # local server with hot reload
npm run build      # typecheck, then a static build in dist/
npm run preview    # serve dist/ locally
```

`dist/` is plain static files with relative paths, so it can go on any static host (GitHub Pages, Netlify, Cloudflare Pages, S3).

## Layout

- `src/App.tsx`: the page, top to bottom. Holds the one shared theme, so a preset picked in Themes also recolors the hero window.
- `src/components/Sky.tsx`: a rounded sky panel. Clouds are painted behind its children; grass (and optionally a rock) in front. Each panel passes a `SceneConfig` (seed, grass height per x, rock).
- `src/components/AntiWindow.tsx`: the Anti window, drawn in HTML at 960 × 580 from the app's real sizes and colors, then scaled to fit.
- `src/components/demos.tsx`: the animated feature-tab demos (spaces swipe, split view, import, passwords).
- `src/components/Keyboard.tsx`: shortcut list (defaults from `src/main/store.js`), command bar and Ctrl+Tab switcher.
- `src/components/Sections.tsx`: themes, details, privacy, left out, get Anti, questions, footer.
- `src/lib/paint.ts`: value noise plus the sky, grass and rock painters. Colors come from the CSS tokens.
- `src/lib/themes.ts`: the 12 presets, copied from the app's `src/renderer/settings.js`.
- `src/lib/hooks.ts`: `useLoop` runs a demo's steps only while it's on screen; motion stops for reduced-motion visitors.
- `src/styles.css`: tokens (light and dark) first, then components.

## Before launch

- Replace the drawn windows with real screenshots or video when available (see the shot list in the website spec).
- Add the public repository link in `GetAnti` and the footer once the code is public.
- Change the "runs from source" section when a signed Mac build exists.
- Copy follows the website spec: don't add claims it lists as not built (permission prompts, tracker blocking, private windows).
