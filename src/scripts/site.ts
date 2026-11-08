const pad = (n: number) => String(n).padStart(2, '0');

// Lock pinch-zoom on iOS Safari, which ignores user-scalable=no in the viewport tag.
for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
  document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
}

// Keyboard: 0–4 jump to a channel, ← → step through a channel's works.
const keyPaths: Record<string, string> = { '0': '/', '1': '/image', '2': '/video', '3': '/installations', '4': '/about' };
addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
  const t = e.target as HTMLElement;
  if (t.closest('input, textarea, select, [contenteditable]')) return;
  const path = keyPaths[e.key];
  if (path && location.pathname !== path) return void (location.href = path);
  const step = e.key === 'ArrowLeft' ? 'prev' : e.key === 'ArrowRight' ? 'next' : null;
  const link = step && document.querySelector<HTMLAnchorElement>(`[data-step="${step}"]`);
  if (link) location.href = link.href;
});

// Slideshows: cut through a work's frames on its timer, only while the screen is visible.
// Reduced motion starts them paused; the work page has pause / step / thumbnail controls.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-slideshow]').forEach((el, n) => {
  const frames = [...el.querySelectorAll<HTMLElement>('[data-frame]')];
  if (frames.length < 2) return;
  const root = el.closest<HTMLElement>('[data-show-root]') ?? el;
  const count = root.querySelector('[data-show-count]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-show="toggle"]');
  const thumbs = [...root.querySelectorAll<HTMLElement>('[data-show-goto]')];
  const ms = Number(el.dataset.interval) || 1000;
  let i = 0;
  let visible = false;
  let paused = reduceMotion.matches;
  let timer = 0;

  // Hidden frames aren't decoded until shown, which flashes black on a cut;
  // decode the next frame first, and the one after it ahead of time.
  const decode = (k: number) => {
    const frame = frames[(k + frames.length) % frames.length];
    const video = frame.querySelector('video');
    if (video) video.preload = 'auto';
    return frame.querySelector('img')?.decode().catch(() => {}) ?? Promise.resolve();
  };
  // A video frame (the last one, on a work page) holds the show until it has played through.
  const videoAt = (k: number) => frames[k].querySelector('video');
  const playable = (v: HTMLVideoElement | null): v is HTMLVideoElement => Boolean(v && !v.error);
  let pending = 0;
  const show = async (k: number, scrollThumb = false, byHand = false) => {
    const ticket = ++pending;
    await decode(k);
    if (ticket !== pending) return;
    frames[i].removeAttribute('data-active');
    thumbs[i]?.removeAttribute('aria-current');
    videoAt(i)?.pause();
    i = (k + frames.length) % frames.length;
    decode(i + 1);
    const video = videoAt(i);
    if (playable(video)) {
      video.currentTime = 0;
      if (byHand || (!paused && !reduceMotion.matches)) video.play().catch(() => {});
    }
    frames[i].setAttribute('data-active', '');
    thumbs[i]?.setAttribute('aria-current', 'true');
    if (scrollThumb) thumbs[i]?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    if (count) count.textContent = pad(i + 1);
    if (!reduceMotion.matches) {
      el.classList.remove('cut');
      void el.offsetWidth;
      el.classList.add('cut');
    }
  };
  const schedule = () => {
    clearTimeout(timer);
    if (paused || !visible || playable(videoAt(i))) return;
    timer = window.setTimeout(async () => {
      if (!document.hidden) await show(i + 1);
      schedule();
    }, ms);
  };
  for (const video of el.querySelectorAll('video')) {
    video.addEventListener('ended', async () => {
      if (paused || !visible) return;
      await show(i + 1);
      schedule();
    });
    // No playable file: the frame shows its poster and the show moves on as usual.
    video.addEventListener('error', schedule);
  }
  const setPaused = (p: boolean) => {
    paused = p;
    const video = videoAt(i);
    if (playable(video)) p ? video.pause() : video.play().catch(() => {});
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(p));
      toggle.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
    }
    schedule();
  };

  if (root !== el) {
    root.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>('[data-show], [data-show-goto]');
      if (!b) return;
      if (b.dataset.showGoto !== undefined) {
        setPaused(true);
        show(Number(b.dataset.showGoto), false, true);
      } else if (b.dataset.show === 'toggle') setPaused(!paused);
      else {
        setPaused(true);
        show(i + (b.dataset.show === 'next' ? 1 : -1), true, true);
      }
    });
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) decode(i + 1);
    const video = videoAt(i);
    if (playable(video)) visible && !paused ? video.play().catch(() => {}) : video.pause();
    schedule();
  });
  // Stagger screens on the same page so they don't all cut at the same moment.
  window.setTimeout(() => io.observe(el), (n % 4) * (ms / 4));
  setPaused(paused);
});
