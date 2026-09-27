// Renders project tiles and the detail panel on projects.html; counts up numbers on facts.html.

function mediaEl(m, { controls = false } = {}) {
  if (m.video) {
    const v = document.createElement('video');
    v.src = m.video; if (m.poster) v.poster = m.poster;
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'metadata';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    if (controls) v.controls = true;
    if (m.alt) v.setAttribute('aria-label', m.alt);
    return v;
  }
  const img = document.createElement('img');
  img.src = m.image || m.src; img.alt = m.alt || ''; img.loading = 'lazy';
  if (m.fit === 'contain') img.classList.add('contain');
  return img;
}

function renderProjects() {
  const grid = document.getElementById('grid');
  const dialog = document.getElementById('detail');
  if (!grid || !dialog) return;
  const stops = [];

  // Only play tile videos while they are on screen
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => { const v = e.target; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
  }, { threshold: 0.2 }) : null;

  PROJECTS.forEach((p) => {
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.type = 'button';
    tile.setAttribute('aria-label', p.title);
    if (p.media) {
      const el = mediaEl(p.media);
      tile.appendChild(el);
      if (el.tagName === 'VIDEO' && io) io.observe(el);
    } else {
      const c = document.createElement('canvas');
      tile.appendChild(c);
      requestAnimationFrame(() => stops.push(Sketches.start(c, p.viz)));
    }
    const label = document.createElement('span');
    label.className = 'label'; label.textContent = p.short;
    tile.appendChild(label);
    tile.addEventListener('click', () => open(p));
    grid.appendChild(tile);
  });

  function open(p) {
    const inner = dialog.querySelector('.inner');
    const figs = (p.figures || []).filter(f => !(p.media && p.media.video && f.video === p.media.video && !f.caption));
    const points = p.points && p.points.length
      ? `<ul class="points">${p.points.map(t => `<li>${t}</li>`).join('')}</ul>` : '';
    const links = p.links && p.links.length
      ? `<div class="links"><span>${p.links_label}</span>${p.links.map(l => l.url
          ? `<a href="${l.url}" target="_blank" rel="noopener">${l.name}</a>` : `<span>${l.name}</span>`).join('')}</div>` : '';
    inner.innerHTML = `
      <button class="close" type="button" aria-label="Close"><svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true"><path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      <div class="hero-media"></div>
      <h2>${p.title}</h2>
      <p class="meta">${p.meta}</p>
      ${p.paragraphs.map(t => `<p>${t}</p>`).join('')}
      ${points}
      <div class="figs"></div>
      ${links}`;
    const hero = inner.querySelector('.hero-media');
    if (p.media && p.media.detail !== false) hero.appendChild(mediaEl(p.media, { controls: !!p.media.video })); else hero.remove();
    const figsEl = inner.querySelector('.figs');
    const shown = figs.filter(f => !(p.media && f.video && f.video === p.media.video));
    if (!shown.length) figsEl.remove();
    shown.forEach(f => {
      const fig = document.createElement('figure');
      if (f.tall) fig.classList.add('tall');
      if (f.wide) fig.classList.add('wide');
      fig.appendChild(mediaEl(f, { controls: !!f.video }));
      if (f.caption) { const cap = document.createElement('figcaption'); cap.textContent = f.caption; fig.appendChild(cap); }
      figsEl.appendChild(fig);
    });
    inner.querySelector('.close').addEventListener('click', () => dialog.close());
    dialog.showModal();
    dialog.scrollTop = 0;
  }

  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { dialog.querySelectorAll('video').forEach(v => v.pause()); });
  window.addEventListener('pagehide', () => stops.forEach(s => s()));
}

function countFacts() {
  const els = document.querySelectorAll('.fact .n[data-value]');
  if (!els.length) return;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  els.forEach(el => {
    const target = parseFloat(el.dataset.value), decimals = (el.dataset.value.split('.')[1] || '').length;
    const unit = el.dataset.unit ? `<small>${el.dataset.unit}</small>` : '';
    const fmt = v => v.toFixed(decimals).replace('.', ',') + unit;
    if (still) { el.innerHTML = fmt(target); return; }
    const t0 = performance.now(), dur = 900;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.innerHTML = fmt(target * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

renderProjects();
countFacts();
