// Procedural scenery for the sky panels: clouds, grass and a rock, painted on canvas from value noise.
// Colors come from the CSS tokens (--sky-1 … --flower), so both site themes repaint correctly.

export type RGB = [number, number, number];
export type Hill = (x: number) => number;
export interface Rock { x: number; y: number; rx: number; ry: number }
export interface Palette { s1: RGB; s2: RGB; s3: RGB; cl: RGB; g1: RGB; g2: RGB; g3: RGB; soil: RGB; stone: RGB; moss: RGB; flower: RGB }
export interface GrassOptions { flowers?: number; blade?: number; density?: number; wind?: number }

export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Noise { n(x: number, y: number): number; fbm(x: number, y: number, octaves?: number): number }

export function noise(seed: number): Noise {
  const r = rng(seed), p = new Uint8Array(512), perm = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const g = new Float32Array(256);
  for (let i = 0; i < 256; i++) g[i] = r();
  const fade = (t: number) => t * t * (3 - 2 * t);
  function n(x: number, y: number) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, X = xi & 255, Y = yi & 255;
    const a = g[p[p[X] + Y]], b = g[p[p[X + 1] + Y]], c = g[p[p[X] + Y + 1]], d = g[p[p[X + 1] + Y + 1]];
    const u = fade(xf), v = fade(yf), top = a + (b - a) * u, bot = c + (d - c) * u;
    return top + (bot - top) * v;
  }
  function fbm(x: number, y: number, o = 5) {
    let s = 0, amp = 0.5, fr = 1, nm = 0;
    for (let i = 0; i < o; i++) { s += amp * n(x * fr, y * fr); nm += amp; amp *= 0.5; fr *= 2.03; }
    return s / nm;
  }
  return { n, fbm };
}

export const sstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const mul = (a: RGB, k: number): RGB => [a[0] * k, a[1] * k, a[2] * k];
const rgb = (c: RGB) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;

export function hex(c: string): RGB {
  let s = String(c).trim().replace('#', '');
  if (s.length === 3) s = [...s].map((x) => x + x).join('');
  const n = parseInt(s, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function palette(): Palette {
  const cs = getComputedStyle(document.documentElement), v = (k: string) => hex(cs.getPropertyValue(k));
  return { s1: v('--sky-1'), s2: v('--sky-2'), s3: v('--sky-3'), cl: v('--cloud'), g1: v('--grass-1'), g2: v('--grass-2'), g3: v('--grass-3'), soil: v('--soil'), stone: v('--stone'), moss: v('--moss'), flower: v('--flower') };
}

/** Soft clouds: painted at a quarter of the size, the browser's upscaling keeps them soft. */
export function paintSky(cv: HTMLCanvasElement, seed: number, P: Palette) {
  const W = cv.clientWidth, H = cv.clientHeight;
  if (!W || !H) return;
  const k = 4, w = Math.ceil(W / k), h = Math.ceil(H / k);
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const img = ctx.createImageData(w, h), d = img.data, N = noise(seed), ox = seed * 3.1;
  for (let y = 0; y < h; y++) {
    const t = y / Math.max(1, h - 1);
    const base = t < 0.6 ? mix(P.s1, P.s2, t / 0.6) : mix(P.s2, P.s3, (t - 0.6) / 0.4);
    const band = 0.15 + 0.85 * sstep(0.02, 0.32, t) * (1 - sstep(0.7, 1, t));
    const haze = sstep(0.62, 1, t) * 0.3;
    for (let x = 0; x < w; x++) {
      const X = x * k, Y = y * k;
      const v = N.fbm(X / 560 + ox, Y / 200, 5), wisp = N.fbm(X / 240 + 40 + ox, Y / 80 + 9, 4);
      let c = sstep(0.5, 0.8, v) * band;
      c = Math.min(1, c + sstep(0.58, 0.82, wisp) * 0.32 * band);
      const col = mix(mix(base, P.cl, c * 0.9), P.s3, haze);
      const i = (y * w + x) * 4;
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

/** Grass: thousands of curved blades spread through depth, batched into a few color paths per row. */
export function paintGrass(ctx: CanvasRenderingContext2D, W: number, H: number, R: () => number, hill: Hill, P: Palette, opt: GrassOptions = {}) {
  let maxH = 0;
  for (let x = 0; x <= W; x += 12) maxH = Math.max(maxH, hill(x));
  ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, H - hill(x) + 7);
  ctx.lineTo(W, H); ctx.closePath();
  const gr = ctx.createLinearGradient(0, H - maxH, 0, H);
  gr.addColorStop(0, rgb(mix(P.g2, P.g3, 0.35))); gr.addColorStop(1, rgb(P.soil));
  ctx.fillStyle = gr; ctx.fill();
  const rows = 14, B = 6, dens = opt.density ?? 1, blade = opt.blade ?? 1, wind = opt.wind ?? 0.14;
  ctx.lineCap = 'round';
  for (let r = 0; r < rows; r++) {
    const dz = r / (rows - 1), paths = Array.from({ length: B }, () => new Path2D());
    const n = Math.round(W * (0.5 + dz * 1.1) * dens);
    for (let i = 0; i < n; i++) {
      const z = Math.min(1, (r + R()) / rows);   // spread blades through the row's depth so no stripes show
      const x = R() * W, y = H - hill(x) * (1 - z * 0.95) + 4;
      const len = (7 + R() * 17) * (0.5 + dz * 1.55) * blade, lean = (R() - 0.5) * 0.95 + wind;
      const p = paths[Math.floor(R() * B)];
      p.moveTo(x, y);
      p.quadraticCurveTo(x + lean * len * 0.22, y - len * 0.62, x + lean * len, y - len);
    }
    for (let b = B - 1; b >= 0; b--) {
      let c = mix(P.g1, P.g3, (b / (B - 1)) * (0.5 + dz * 0.5));
      c = mix(c, P.s3, (1 - dz) * 0.3);
      ctx.strokeStyle = rgb(c);
      ctx.lineWidth = 0.7 + dz * 1.35 + (b & 1) * 0.35;
      ctx.stroke(paths[b]);
    }
    if (opt.flowers && (r === 5 || r === 9)) {
      const fl = Math.round(W * 0.004 * opt.flowers);
      for (let i = 0; i < fl; i++) {
        const x = R() * W, y = H - hill(x) * (1 - dz * 0.93) - 4 - R() * 10, s = (1.4 + dz * 1.4) * blade;
        ctx.fillStyle = rgb(P.flower);
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2 + R();
          ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * s, y + Math.sin(a) * s * 0.7, s, s * 0.55, a, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = rgb(mix(P.g1, [240, 205, 90], 0.8));
        ctx.beginPath(); ctx.arc(x, y, s * 0.6, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
}

/** A slab of stone: a shaded height field with strata and moss on the upward faces. */
export function paintRock(ctx: CanvasRenderingContext2D, W: number, H: number, seed: number, rk: Rock, P: Palette) {
  const N = noise(seed + 101), cx = rk.x * W, cy = rk.y * H, rx = rk.rx * W, ry = rk.ry * H;
  ctx.save(); ctx.translate(cx, cy + ry * 0.75); ctx.scale(1, 0.22);
  const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.1);
  sh.addColorStop(0, 'rgba(0,0,0,.42)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, rx * 1.1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  const s = 2, x0 = cx - rx * 1.2, y0 = cy - ry * 1.5, w = Math.ceil((rx * 2.4) / s), h = Math.ceil((ry * 2.9) / s);
  if (w < 3 || h < 3) return;
  const hg = new Float32Array(w * h), mk = new Float32Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const X = x0 + i * s, Y = y0 + j * s, u = (X - cx) / rx, v = (Y - cy) / ry;
    const e = (N.fbm(u * 1.7 + 3, v * 1.7 + 7, 4) - 0.5) * 0.6;
    const vv = (v < 0 ? v * 0.95 : v * 1.7) + u * 0.16;
    const dd = Math.pow(Math.abs(u), 2.4) + vv * vv + e;
    const m = sstep(1, 0.955, dd);
    mk[j * w + i] = m;
    const body = Math.pow(Math.max(0, 1 - dd), 0.33);
    const strata = Math.sin(Y / 7.5 + N.n(X / 50, Y / 50) * 6) * 0.035;
    const grain = (N.fbm(X / 16, Y / 16, 4) - 0.5) * 0.2 + (N.fbm(X / 70 + 9, Y / 55, 3) - 0.5) * 0.32;
    hg[j * w + i] = body + (grain + strata) * m;
  }
  const img = ctx.createImageData(w, h), dt = img.data;
  const L: RGB = [-0.5, -0.7, 0.5], ll = Math.hypot(...L);
  L[0] /= ll; L[1] /= ll; L[2] /= ll;
  const dark = mul(P.stone, 0.38), light = mix(P.stone, [255, 255, 255], 0.25);
  for (let j = 1; j < h - 1; j++) for (let i = 1; i < w - 1; i++) {
    const k = j * w + i, m = mk[k];
    if (m <= 0) continue;
    const dx = (hg[k + 1] - hg[k - 1]) * 7, dy = (hg[k + w] - hg[k - w]) * 7, nl = Math.hypot(dx, dy, 1);
    const nx = -dx / nl, ny = -dy / nl, nz = 1 / nl;
    const lam = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
    const ao = 0.55 + 0.45 * sstep(0, 0.35, hg[k]);
    let c = mix(dark, light, Math.min(1, lam * 1.05) * ao);
    const X = x0 + i * s, Y = y0 + j * s;
    const moss = sstep(0.55, 0.7, N.fbm(X / 48 + 20, Y / 36, 4)) * sstep(0.25, 0.7, -ny + 0.3) * 0.85;
    c = mix(c, mul(P.moss, 0.55 + lam * 0.7), moss);
    dt[k * 4] = c[0]; dt[k * 4 + 1] = c[1]; dt[k * 4 + 2] = c[2]; dt[k * 4 + 3] = m * 255;
  }
  const off = document.createElement('canvas');
  off.width = w; off.height = h;
  off.getContext('2d')?.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(off, x0, y0, w * s, h * s);
}

const hillNoise = noise(77);
/** Gentle unevenness along a horizon. */
export const wave = (amp: number, freq: number, offset: number): Hill => (x) => (hillNoise.fbm(x / freq + offset, 1.7, 3) - 0.5) * amp;
