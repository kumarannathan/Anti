// Icons drawn to match Anti's own (the app's topbar, sidebar and pane-header SVGs).
import type { CSSProperties } from 'react';
const s = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const Logo = () => (
  <svg viewBox="0 0 26 26" aria-hidden="true">
    <rect x="1.6" y="3.6" width="22.8" height="18.8" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
    <path d="M6.6 3.6h3.4v18.8H6.6a5 5 0 0 1-5-5V8.6a5 5 0 0 1 5-5z" fill="currentColor" />
  </svg>
);
export const Grid = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="5" y="5" width="6" height="6" rx="1.8" /><rect x="13" y="5" width="6" height="6" rx="1.8" /><rect x="5" y="13" width="6" height="6" rx="1.8" /><rect x="13" y="13" width="6" height="6" rx="1.8" /></svg>
);
export const Command = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="1.7" aria-hidden="true"><path d="M9 9V6.6A2.4 2.4 0 1 0 6.6 9H9zm0 0h6m-6 0v6m6-6V6.6A2.4 2.4 0 1 1 17.4 9H15zm0 0v6m0 0h2.4a2.4 2.4 0 1 1-2.4 2.4V15zm0 0H9m0 0v2.4A2.4 2.4 0 1 1 6.6 15H9z" /></svg>
);
export const PaletteIcon = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="1.7" aria-hidden="true">
    <path d="M12 3.6a8.4 8.4 0 1 0 0 16.8c1.3 0 1.9-1 1.4-2.1l-.3-.7c-.5-1.1.3-2.3 1.5-2.3h2.2a3.6 3.6 0 0 0 3.6-3.6c0-4.5-3.8-8.1-8.4-8.1z" />
    <circle cx="8" cy="11.5" r="1.2" fill="currentColor" stroke="none" /><circle cx="11" cy="7.6" r="1.2" fill="currentColor" stroke="none" /><circle cx="15.4" cy="8.4" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
export const Lock = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="1.7" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.6" /><path d="M8.5 10.5V7.6a3.5 3.5 0 0 1 7 0v2.9" /></svg>
);
export const Terminal = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="1.7" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="3" /><path d="M7.5 10l2.5 2-2.5 2M12.5 14.5h4" /></svg>
);
export const Folder = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.75 6.25a1.5 1.5 0 0 1 1.5-1.5h3.4l1.6 1.75h6.5a1.5 1.5 0 0 1 1.5 1.5v6.75a1.5 1.5 0 0 1-1.5 1.5H4.25a1.5 1.5 0 0 1-1.5-1.5z" /></svg>
);
export const Plus = () => <svg viewBox="0 0 20 20" {...s} strokeWidth="1.6"><path d="M10 4.5v11M4.5 10h11" /></svg>;
export const Library = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3.25" y="3.25" width="13.5" height="13.5" rx="3" /><path d="M3.25 7.75h13.5M8.25 11h3.5" /></svg>
);
export const SidebarToggle = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><rect x="3" y="4" width="14" height="12" rx="2.5" /><path d="M8 4v12" /></svg>;
export const Back = () => <svg viewBox="0 0 20 20" {...s} strokeWidth="1.7"><path d="M12 4.75L6.75 10 12 15.25" /></svg>;
export const Forward = () => <svg viewBox="0 0 20 20" {...s} strokeWidth="1.7"><path d="M8 4.75L13.25 10 8 15.25" /></svg>;
export const Reload = () => <svg viewBox="0 0 20 20" {...s} strokeWidth="1.7"><path d="M15.5 10a5.5 5.5 0 1 1-1.6-3.9" /><path d="M15.75 3.75v3.5h-3.5" /></svg>;
export const Close = () => <svg viewBox="0 0 20 20" {...s} strokeWidth="1.7"><path d="M6 6l8 8M14 6l-8 8" /></svg>;
export const Check = () => <svg viewBox="0 0 20 20" {...s} strokeWidth="1.9"><path d="M5.25 10.5l3 3 6.5-6.75" /></svg>;
export const Key = () => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="7.5" cy="10" r="3.5" /><path d="M11 10h6.5M15 10v2.5" /></svg>;

/** A letter tile standing in for a site's favicon (no real brands drawn). */
export const Fav = ({ c, l }: { c: string; l: string }) => <span className="ico" style={{ '--c': c } as CSSProperties}>{l}</span>;
