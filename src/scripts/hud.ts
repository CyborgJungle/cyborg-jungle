import { navigate } from 'astro:transitions/client';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
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

// Static noise: tiny canvas, scaled up, redrawn at 12 fps.
const canvas = document.querySelector<HTMLCanvasElement>('canvas.static');
const ctx = canvas?.getContext('2d');
if (canvas && ctx) {
  const img = ctx.createImageData(canvas.width, canvas.height);
  const draw = () => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = v * 0.6;
      d[i + 1] = v * 0.8;
      d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  };
  draw();
  setInterval(() => {
    if (!reduced.matches && !document.hidden) draw();
  }, 1000 / 12);
}

// Static burst while changing channel.
document.addEventListener('astro:before-preparation', () => {
  if (!reduced.matches) canvas?.classList.add('burst');
});
document.addEventListener('astro:page-load', () => {
  setTimeout(() => canvas?.classList.remove('burst'), 160);
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
