import type { CSSProperties } from 'react';
import { hex } from './paint';

/** Anti's 12 theme presets, copied from THEMES in the app's src/renderer/settings.js. */
export interface Theme { name: string; accent: string; color: string; color2?: string; angle?: number }

export const THEMES: Theme[] = [
  { name: 'Graphite', accent: '#8e8ef0', color: '#1b1b1f' },
  { name: 'Lavender', accent: '#f3d9ff', color: '#8a5aa8', color2: '#5a35b0', angle: 165 },
  { name: 'Ocean', accent: '#7dd3fc', color: '#0f2b46', color2: '#0b4f6c', angle: 160 },
  { name: 'Forest', accent: '#4ade80', color: '#13261d', color2: '#1f3d2c', angle: 170 },
  { name: 'Sunset', accent: '#ffd166', color: '#e06c5a', color2: '#9b3f8f', angle: 155 },
  { name: 'Rose', accent: '#ff8ac8', color: '#3a1426', color2: '#5f1f40', angle: 160 },
  { name: 'Ember', accent: '#f6a04d', color: '#2a1410', color2: '#4a2015', angle: 165 },
  { name: 'Midnight', accent: '#6a5cff', color: '#0d0d14', color2: '#1a1736', angle: 170 },
  { name: 'Slate', accent: '#8ab4f8', color: '#23272e' },
  { name: 'Sand', accent: '#b0703c', color: '#efe6d8', color2: '#e2d2bb', angle: 160 },
  { name: 'Snow', accent: '#2d6cdf', color: '#f2f2f5' },
  { name: 'Mint', accent: '#0f9d68', color: '#dff3e9', color2: '#c9eadb', angle: 160 },
];

export const DEFAULT_THEME = 7;   // Midnight
export const byName = (n: string) => THEMES.find((t) => t.name === n) ?? THEMES[0];

export const themeBg = (t: Theme) => (t.color2 ? `linear-gradient(${t.angle ?? 160}deg, ${t.color}, ${t.color2})` : t.color);

const lum = (h: string) => { const [r, g, b] = hex(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };

// The sidebar's own text and fill values for dark and light sidebars (src/renderer/sidebar.css)
const DARK_UI = { '--t': '#f3f3f6', '--t2': 'rgba(255,255,255,.56)', '--t3': 'rgba(255,255,255,.3)', '--tile': 'rgba(255,255,255,.07)', '--act': 'rgba(255,255,255,.15)', '--div': 'rgba(255,255,255,.09)', '--crd': 'rgba(255,255,255,.07)' };
const LIGHT_UI = { '--t': '#16161b', '--t2': 'rgba(0,0,0,.55)', '--t3': 'rgba(0,0,0,.28)', '--tile': 'rgba(0,0,0,.05)', '--act': 'rgba(255,255,255,.8)', '--div': 'rgba(0,0,0,.08)', '--crd': 'rgba(0,0,0,.055)' };

/** CSS variables that paint an Anti window (or a piece of one) in a theme. */
export function themeVars(t: Theme): CSSProperties {
  return { ...(lum(t.color) > 150 ? LIGHT_UI : DARK_UI), '--sb': themeBg(t), '--acc': t.accent } as CSSProperties;
}
