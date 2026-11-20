import { useEffect, useRef, useState, type RefObject } from 'react';

const REDUCE = '(prefers-reduced-motion: reduce)';

export function useReducedMotion() {
  const [reduce, set] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(REDUCE).matches);
  useEffect(() => {
    const m = matchMedia(REDUCE), on = () => set(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return reduce;
}

/** True while at least `threshold` of the element is on screen. */
export function useInView(ref: RefObject<Element>, threshold = 0.2) {
  const [inView, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

export type Step = [run: () => void, waitMs: number];

/**
 * Runs `steps` in a loop (each step, then its wait) while `ref` is on screen and `active` is true.
 * Stops for reduced motion. It starts again from the first step each time it resumes.
 */
export function useLoop(ref: RefObject<Element>, steps: Step[], active = true) {
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  useEffect(() => {
    if (!inView || !active || reduce) return;
    let i = 0, t = 0, alive = true;
    const run = () => {
      if (!alive) return;
      const list = stepsRef.current, [fn, wait] = list[i % list.length];
      fn();
      i++;
      t = window.setTimeout(run, wait);
    };
    run();
    return () => { alive = false; clearTimeout(t); };
  }, [inView, active, reduce]);
}

/** Calls `fn` when the site's light or dark theme changes (system setting or a data-theme attribute). */
export function useThemeChange(fn: () => void) {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    const m = matchMedia('(prefers-color-scheme: dark)'), on = () => cb.current();
    m.addEventListener('change', on);
    const mo = new MutationObserver(on);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { m.removeEventListener('change', on); mo.disconnect(); };
  }, []);
}
