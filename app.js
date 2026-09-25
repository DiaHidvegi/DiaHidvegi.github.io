// Renders project tiles and the detail panel on projects.html; counts up numbers on facts.html.

function renderProjects() {
  const grid = document.getElementById('grid');
  const dialog = document.getElementById('detail');
  if (!grid || !dialog) return;
  const stops = [];

  PROJECTS.forEach((p, i) => {
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.type = 'button';
    tile.setAttribute('aria-label', p.title);
    if (p.viz.image) {
      const img = document.createElement('img');
      img.src = p.viz.image; img.alt = ''; img.loading = 'lazy';
      tile.appendChild(img);
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
    const figs = p.figures.length
      ? `<div class="figs">${p.figures.map(f => `<img src="${f.src}" alt="${f.alt}" loading="lazy">`).join('')}</div>` : '';
    const links = p.links.length
      ? `<div class="links"><span>${p.links_label}</span>${p.links.map(l => l.url
          ? `<a href="${l.url}" target="_blank" rel="noopener">${l.name}</a>` : `<span>${l.name}</span>`).join('')}</div>` : '';
    inner.innerHTML = `
      <button class="close" type="button" aria-label="Close">×</button>
      <h2>${p.title}</h2>
      <p class="meta">${p.meta}</p>
      ${p.paragraphs.map(t => `<p>${t}</p>`).join('')}
      ${figs}${links}`;
    inner.querySelector('.close').addEventListener('click', () => dialog.close());
    dialog.showModal();
    dialog.scrollTop = 0;
  }

  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
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
