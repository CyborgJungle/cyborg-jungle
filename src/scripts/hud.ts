import { navigate } from 'astro:transitions/client';

const root = document.documentElement;
const pad = (n: number) => String(n).padStart(2, '0');

// Power-on overlay: remove after the animation, or immediately on click / key.
if (root.hasAttribute('data-boot')) {
  const end = () => root.removeAttribute('data-boot');
  setTimeout(end, 1800);
  addEventListener('pointerdown', end, { once: true });
  addEventListener('keydown', end, { once: true });
}

// Timecode HH:MM:SS:FF at 25 fps (PAL), counted from arrival on the site.
const t0 = performance.now();
let tcEl: Element | null = null;
const tick = () => {
  const ms = performance.now() - t0;
  const s = Math.floor(ms / 1000);
  if (tcEl) tcEl.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(Math.floor(ms / 40) % 25)}`;
  requestAnimationFrame(tick);
};
requestAnimationFrame(tick);

document.addEventListener('astro:page-load', () => {
  tcEl = document.querySelector('[data-tc]');
});

// Targeting crosshair with coordinate readout, for mouse / trackpad only.
const xhair = document.querySelector<HTMLElement>('.xhair');
const xy = xhair?.querySelector<HTMLElement>('.xy');
if (xhair && xy && matchMedia('(pointer: fine)').matches) {
  const sync = () => root.classList.add('has-xhair');
  sync();
  document.addEventListener('astro:after-swap', sync);
  addEventListener('pointermove', (e) => {
    xhair.style.setProperty('--x', `${e.clientX}px`);
    xhair.style.setProperty('--y', `${e.clientY}px`);
    xy.textContent = `X ${String(e.clientX).padStart(4, '0')}  Y ${String(e.clientY).padStart(4, '0')}`;
    root.classList.remove('xhair-out');
  });
  document.addEventListener('pointerleave', () => root.classList.add('xhair-out'));
}

// Remote control: 0–4 tune channels, ← → step through works.
const keyPaths: Record<string, string> = { '0': '/', '1': '/image', '2': '/video', '3': '/installations', '4': '/about' };
addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
  const t = e.target as HTMLElement;
  if (t.closest('input, textarea, select, [contenteditable]')) return;
  const path = keyPaths[e.key];
  if (path && location.pathname !== path) return navigate(path);
  const step = e.key === 'ArrowLeft' ? 'prev' : e.key === 'ArrowRight' ? 'next' : null;
  const link = step && document.querySelector<HTMLAnchorElement>(`[data-step="${step}"]`);
  if (link) navigate(link.href);
});

// Slideshows: cycle a work's frames on its timer, only while the screen is visible.
// Reduced motion starts them paused; the work page has pause / step / thumbnail controls.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let stopShows: (() => void)[] = [];

function initSlideshows() {
  stopShows.forEach((stop) => stop());
  stopShows = [];
  document.querySelectorAll<HTMLElement>('[data-slideshow]').forEach((el, n) => {
    const frames = [...el.querySelectorAll<HTMLElement>('[data-frame]')];
    if (frames.length < 2) return;
    const root = el.closest<HTMLElement>('[data-show-root]') ?? el;
    const count = root.querySelector('[data-show-count]');
    const toggle = root.querySelector<HTMLButtonElement>('[data-show="toggle"]');
    const thumbs = [...root.querySelectorAll<HTMLElement>('[data-show-goto]')];
    const ms = Number(el.dataset.interval) || 1500;
    let i = 0;
    let visible = false;
    let paused = reduceMotion.matches;
    let timer = 0;

    // Hidden frames aren't decoded until shown, which flashes black on a cut;
    // decode the next frame first, and the one after it ahead of time.
    const decode = (k: number) =>
      frames[(k + frames.length) % frames.length].querySelector('img')?.decode().catch(() => {}) ?? Promise.resolve();
    let pending = 0;
    const show = async (k: number) => {
      const ticket = ++pending;
      await decode(k);
      if (ticket !== pending) return;
      frames[i].removeAttribute('data-active');
      thumbs[i]?.removeAttribute('aria-current');
      i = (k + frames.length) % frames.length;
      decode(i + 1);
      frames[i].setAttribute('data-active', '');
      thumbs[i]?.setAttribute('aria-current', 'true');
      if (count) count.textContent = pad(i + 1);
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    };
    const schedule = () => {
      clearInterval(timer);
      if (!paused && visible) timer = window.setInterval(() => !document.hidden && show(i + 1), ms);
    };
    const setPaused = (p: boolean) => {
      paused = p;
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(p));
        toggle.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
        toggle.textContent = p ? '►' : '❚❚';
      }
      schedule();
    };

    if (root !== el) {
      root.addEventListener('click', (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>('[data-show], [data-show-goto]');
        if (!b) return;
        if (b.dataset.showGoto !== undefined) {
          show(Number(b.dataset.showGoto));
          setPaused(true);
        } else if (b.dataset.show === 'toggle') setPaused(!paused);
        else {
          show(i + (b.dataset.show === 'next' ? 1 : -1));
          schedule();
        }
      });
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) decode(i + 1);
      schedule();
    });
    // Stagger the wall's screens so they don't all cut at the same moment.
    const start = window.setTimeout(() => io.observe(el), (n % 4) * (ms / 4));
    setPaused(paused);
    stopShows.push(() => {
      clearTimeout(start);
      clearInterval(timer);
      io.disconnect();
    });
  });
}

document.addEventListener('astro:page-load', initSlideshows);
