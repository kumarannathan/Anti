import { useEffect, useRef, type ReactNode } from 'react';
import { paintGrass, paintRock, paintSky, palette, rng, type Hill, type Rock } from '../lib/paint';
import { useThemeChange } from '../lib/hooks';

export interface SceneConfig {
  seed: number;
  flowers?: number;
  rock?: Rock;
  /** Grass height from the bottom edge at each x; `el` is the panel, for scenes that track their contents. */
  hill?: (W: number, H: number, el: HTMLElement) => Hill;
}

interface Props {
  as?: 'section' | 'div' | 'footer';
  scene: SceneConfig;
  className?: string;
  id?: string;
  label?: string;
  hidden?: boolean;
  children?: ReactNode;
  /** Rendered above the grass (things the grass must not cover). */
  over?: ReactNode;
}

/** A rounded sky panel: painted clouds behind its children, grass (and a rock) painted in front. */
export function Sky({ as: Tag = 'section', scene, className = '', id, label, children, over }: Props) {
  const ref = useRef<HTMLElement>(null);
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const size = useRef('');
  const hasFront = !!(scene.hill || scene.rock);

  const render = (force = false) => {
    const el = ref.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    if (!W || !H) return;
    const key = `${W}x${H}`;
    if (!force && key === size.current) return;
    size.current = key;
    const P = palette();
    if (back.current) paintSky(back.current, scene.seed, P);
    const cv = front.current;
    if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (scene.rock) paintRock(ctx, W, H, scene.seed, scene.rock, P);
    if (scene.hill) paintGrass(ctx, W, H, rng(scene.seed * 7 + 1), scene.hill(W, H, el), P, { flowers: scene.flowers ?? 0, blade: Math.max(0.5, Math.min(1, W / 1000)) });
  };
  const renderRef = useRef(render);
  renderRef.current = render;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    renderRef.current();
    const ro = new ResizeObserver(() => { clearTimeout(t); t = window.setTimeout(() => renderRef.current(), 120); });
    ro.observe(el);
    // the hero's grass follows the window drawing, which moves once the display font arrives
    document.fonts?.ready.then(() => renderRef.current(true));
    return () => { ro.disconnect(); clearTimeout(t); };
  }, []);
  useThemeChange(() => render(true));

  return (
    <Tag ref={ref as never} className={`sky ${className}`} id={id} aria-label={label}>
      <canvas ref={back} className="back" aria-hidden="true" />
      {children}
      {hasFront && <canvas ref={front} className="front" aria-hidden="true" />}
      {over}
    </Tag>
  );
}
