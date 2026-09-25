// Small abstract canvas animations used as project tiles.
// Every sketch draws in the current text colour, so tiles follow light/dark mode.
// Sketches.start(canvas, opts) returns a stop() function.

const Sketches = (() => {
  const TAU = Math.PI * 2;
  const lerp = (a, b, k) => a + (b - a) * k;

  // Deterministic random so every tile looks the same on each visit.
  function rng(seed) {
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  function setup(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    return { ctx, w, h, ink: getComputedStyle(canvas).color };
  }

  function dot(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  function line(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }

  // Random 2D graph shared by the network sketches
  function makeGraph(seed, n) {
    const r = rng(seed), nodes = [], edges = [];
    for (let i = 0; i < n; i++) nodes.push({ x: 0.1 + r() * 0.8, y: 0.1 + r() * 0.8, p: r() * TAU });
    for (let i = 0; i < n; i++) {
      const ds = nodes.map((m, j) => [Math.hypot(m.x - nodes[i].x, m.y - nodes[i].y), j]).sort((a, b) => a[0] - b[0]);
      for (let k = 1; k <= 2; k++) if (ds[k][1] > i) edges.push([i, ds[k][1]]);
    }
    return { nodes, edges };
  }

  // ---- Dexterous manipulation: a rotating 3D point graph (a posture manifold) ----
  function orbit({ ctx, w, h, ink }, t, st) {
    if (!st.pts) {
      const r = rng(7); st.pts = []; st.edges = [];
      for (let i = 0; i < 90; i++) {
        const u = r() * TAU, v = Math.acos(2 * r() - 1), k = 0.55 + 0.45 * r();
        st.pts.push([Math.sin(v) * Math.cos(u) * k, Math.sin(v) * Math.sin(u) * k, Math.cos(v) * k]);
      }
      for (let i = 0; i < st.pts.length; i++) for (let j = i + 1; j < st.pts.length; j++) {
        const a = st.pts[i], b = st.pts[j];
        if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.36) st.edges.push([i, j]);
      }
    }
    const a = t * 0.00025, b = t * 0.00015, R = Math.min(w, h) * 0.38;
    const proj = st.pts.map(([x, y, z]) => {
      const x1 = x * Math.cos(a) - z * Math.sin(a), z1 = x * Math.sin(a) + z * Math.cos(a);
      const y1 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
      const s = 1 / (1.9 - z2);
      return [w / 2 + x1 * R * s * 1.4, h / 2 + y1 * R * s * 1.4, s];
    });
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1;
    for (const [i, j] of st.edges) {
      ctx.globalAlpha = 0.12 + 0.25 * (proj[i][2] + proj[j][2] - 1);
      line(ctx, proj[i][0], proj[i][1], proj[j][0], proj[j][1]);
    }
    for (const [x, y, s] of proj) { ctx.globalAlpha = 0.35 + 0.65 * (s - 0.5); dot(ctx, x, y, 1.2 + 2.2 * s); }
    ctx.globalAlpha = 1;
  }

  // ---- Vision-language-action: shapes drifting down into matching bins ----
  function sort({ ctx, w, h, ink }, t, st) {
    const bins = 3;
    if (!st.items) {
      const r = rng(11); st.r = r; st.items = [];
      for (let i = 0; i < 24; i++) st.items.push({ x: r() * w, y: -r() * h * 1.5, bin: Math.floor(r() * bins), v: 0.3 + r() * 0.5, size: 3 + r() * 3 });
    }
    const pad = w * 0.12, bw = (w - pad * 2) / bins;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
    for (let i = 0; i < bins; i++) {
      const x = pad + i * bw + bw * 0.15, bx = bw * 0.7, y = h * 0.78;
      ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x, y); ctx.lineTo(x + bx, y); ctx.lineTo(x + bx, y - 18); ctx.stroke();
    }
    for (const it of st.items) {
      const tx = pad + it.bin * bw + bw / 2;
      it.y += it.v; it.x += (tx - it.x) * 0.04;
      if (it.y > h * 0.78 - it.size) { it.y = -st.r() * h * 0.6; it.x = st.r() * w; it.bin = Math.floor(st.r() * bins); }
      ctx.globalAlpha = 0.9;
      if (it.bin === 1) ctx.fillRect(it.x - it.size, it.y - it.size, it.size * 2, it.size * 2);
      else if (it.bin === 2) { ctx.beginPath(); ctx.moveTo(it.x, it.y - it.size); ctx.lineTo(it.x + it.size, it.y + it.size); ctx.lineTo(it.x - it.size, it.y + it.size); ctx.closePath(); ctx.fill(); }
      else dot(ctx, it.x, it.y, it.size);
    }
    ctx.globalAlpha = 1;
  }

  // ---- Graph neural network: a graph whose nodes and edges breathe ----
  function network({ ctx, w, h, ink }, t, st) {
    if (!st.g) st.g = makeGraph(3, 34);
    const { nodes, edges } = st.g;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1;
    for (const [i, j] of edges) { ctx.globalAlpha = 0.12 + 0.12 * Math.sin(t * 0.002 + nodes[i].p); line(ctx, nodes[i].x * w, nodes[i].y * h, nodes[j].x * w, nodes[j].y * h); }
    for (const n of nodes) { const k = 0.5 + 0.5 * Math.sin(t * 0.002 + n.p); ctx.globalAlpha = 0.3 + 0.6 * k; dot(ctx, n.x * w, n.y * h, 1.5 + 2.5 * k); }
    ctx.globalAlpha = 1;
  }

  // ---- Drone path planning: a sampling tree grows toward the goal, then starts over ----
  function tree({ ctx, w, h, ink }, t, st) {
    if (!st.nodes) { st.r = rng(13); st.nodes = [{ x: w * 0.12, y: h * 0.85, p: -1 }]; st.goal = { x: w * 0.85, y: h * 0.18 }; st.done = 0; }
    if (!st.done) for (let k = 0; k < 2; k++) {
      const s = st.r() < 0.1 ? st.goal : { x: st.r() * w, y: st.r() * h };
      let best = 0, bd = Infinity;
      st.nodes.forEach((n, i) => { const d = Math.hypot(n.x - s.x, n.y - s.y); if (d < bd) { bd = d; best = i; } });
      const n = st.nodes[best], step = Math.min(w, h) * 0.07, ang = Math.atan2(s.y - n.y, s.x - n.x);
      const nn = { x: n.x + Math.cos(ang) * step, y: n.y + Math.sin(ang) * step, p: best };
      if (nn.x < 4 || nn.y < 4 || nn.x > w - 4 || nn.y > h - 4) continue;
      st.nodes.push(nn);
      if (Math.hypot(nn.x - st.goal.x, nn.y - st.goal.y) < step || st.nodes.length > 300) {
        st.done = t; st.path = []; let i = st.nodes.length - 1; while (i >= 0) { st.path.push(st.nodes[i]); i = st.nodes[i].p; }
      }
    }
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1; ctx.globalAlpha = 0.28;
    for (const n of st.nodes) if (n.p >= 0) { const p = st.nodes[n.p]; line(ctx, p.x, p.y, n.x, n.y); }
    ctx.globalAlpha = 0.9; dot(ctx, st.nodes[0].x, st.nodes[0].y, 3);
    ctx.beginPath(); ctx.arc(st.goal.x, st.goal.y, 5, 0, TAU); ctx.stroke();
    if (st.done) {
      ctx.lineWidth = 2; ctx.globalAlpha = 1; ctx.beginPath();
      st.path.forEach((n, i) => i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y)); ctx.stroke();
      if (t - st.done > 2500) st.nodes = null;
    }
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
  }

  // ---- Knowledge graph agent: a query walks the edges of a graph ----
  function walker({ ctx, w, h, ink }, t, st) {
    if (!st.g) { st.g = makeGraph(5, 30); st.e = 0; st.f = 0; }
    const { nodes, edges } = st.g;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1;
    for (const [i, j] of edges) { ctx.globalAlpha = 0.18; line(ctx, nodes[i].x * w, nodes[i].y * h, nodes[j].x * w, nodes[j].y * h); }
    for (const n of nodes) { ctx.globalAlpha = 0.5; dot(ctx, n.x * w, n.y * h, 2.2); }
    st.f += 0.012;
    if (st.f >= 1) { st.f = 0; st.e = (st.e + 7) % edges.length; }
    const [i, j] = edges[st.e], x = lerp(nodes[i].x, nodes[j].x, st.f) * w, y = lerp(nodes[i].y, nodes[j].y, st.f) * h;
    ctx.globalAlpha = 1; dot(ctx, x, y, 4);
    ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ---- Traffic surveillance: vehicles in lanes, each with a tracking box ----
  function traffic({ ctx, w, h, ink }, t, st) {
    if (!st.cars) { const r = rng(17); st.cars = []; for (let i = 0; i < 12; i++) st.cars.push({ lane: i % 4, x: r() * w, v: 0.5 + r() * 0.9, len: 8 + r() * 8 }); }
    const lanes = 4, top = h * 0.25, gap = (h * 0.5) / (lanes - 1);
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1; ctx.setLineDash([4, 6]); ctx.globalAlpha = 0.18;
    for (let i = 0; i < lanes; i++) line(ctx, 0, top + i * gap, w, top + i * gap);
    ctx.setLineDash([]);
    for (const c of st.cars) {
      const dir = c.lane < 2 ? 1 : -1; c.x += c.v * dir; if (c.x > w + 20) c.x = -20; if (c.x < -20) c.x = w + 20;
      const y = top + c.lane * gap;
      ctx.globalAlpha = 0.85; ctx.fillRect(c.x - c.len / 2, y - 3, c.len, 6);
      ctx.globalAlpha = 0.35; ctx.strokeRect(c.x - c.len / 2 - 4, y - 8, c.len + 8, 16);
    }
    ctx.globalAlpha = 1;
  }

  // ---- Healthcare simulator: agents on a grid changing state ----
  function agents({ ctx, w, h, ink }, t, st) {
    const cols = 16, rows = 12;
    if (!st.cells) { const r = rng(19); st.r = r; st.cells = Array.from({ length: cols * rows }, () => r() < 0.35 ? 1 : 0); st.next = 0; }
    if (t > st.next) {
      st.next = t + 140;
      const c = st.cells.slice();
      for (let i = 0; i < c.length; i++) {
        const x = i % cols, y = (i / cols) | 0; let n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue; n += st.cells[((y + dy + rows) % rows) * cols + (x + dx + cols) % cols];
        }
        c[i] = st.cells[i] ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
        if (st.r() < 0.004) c[i] = 1;
      }
      st.cells = c;
    }
    const cw = w / cols, ch = h / rows, rad = Math.min(cw, ch) * 0.28;
    ctx.fillStyle = ink;
    for (let i = 0; i < st.cells.length; i++) {
      ctx.globalAlpha = st.cells[i] ? 0.9 : 0.12;
      dot(ctx, (i % cols + 0.5) * cw, ((i / cols | 0) + 0.5) * ch, st.cells[i] ? rad : rad * 0.5);
    }
    ctx.globalAlpha = 1;
  }

  // ---- Financial data extractor: document lines scrolling past, with fields picked out ----
  function stream({ ctx, w, h, ink }, t, st) {
    if (!st.rows) { const r = rng(23); st.rows = []; for (let i = 0; i < 18; i++) st.rows.push({ segs: Array.from({ length: 3 + (r() * 4 | 0) }, () => 0.05 + r() * 0.25), hit: r() < 0.3 ? (r() * 3 | 0) : -1 }); st.off = 0; }
    st.off += 0.35;
    const gap = h / 12, span = w * 0.76, x0 = w * 0.12, total = gap * st.rows.length;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 2;
    st.rows.forEach((row, i) => {
      const y = ((i * gap - st.off) % total + total) % total - gap;
      let x = x0;
      row.segs.forEach((s, k) => {
        const len = s * span;
        if (k === row.hit) { ctx.globalAlpha = 0.9; ctx.lineWidth = 1; ctx.strokeRect(x - 3, y - 5, len + 6, 10); ctx.lineWidth = 2; }
        ctx.globalAlpha = k === row.hit ? 0.9 : 0.25; line(ctx, x, y, x + len, y);
        x += len + span * 0.04;
      });
    });
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
  }

  // ---- Credit underwriting: applicants reach a gate and are routed up or down ----
  function gate({ ctx, w, h, ink }, t, st) {
    if (!st.a) { st.r = rng(29); st.a = []; st.next = 0; }
    if (t > st.next) { st.next = t + 700; st.a.push({ x: -0.05, y: 0.5, ok: st.r() > 0.4, f: 1 }); }
    st.a = st.a.filter(a => {
      a.x += 0.004;
      if (a.x > 0.5) { a.y += ((a.ok ? 0.25 : 0.75) - a.y) * 0.05; if (!a.ok) a.f = Math.max(0.2, a.f - 0.015); }
      return a.x < 1.06;
    });
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1;
    ctx.globalAlpha = 0.22; line(ctx, 0, h * 0.5, w * 0.5, h * 0.5);
    ctx.setLineDash([3, 5]); line(ctx, w * 0.5, h * 0.5, w, h * 0.25); line(ctx, w * 0.5, h * 0.5, w, h * 0.75); ctx.setLineDash([]);
    ctx.globalAlpha = 0.5; line(ctx, w * 0.5, h * 0.36, w * 0.5, h * 0.64);
    for (const a of st.a) { ctx.globalAlpha = 0.9 * a.f; dot(ctx, a.x * w, a.y * h, 3); }
    ctx.globalAlpha = 1;
  }

  const TYPES = { orbit, sort, network, tree, walker, traffic, agents, stream, gate };

  function start(canvas, opts) {
    const draw = TYPES[opts.type];
    if (!draw) return () => {};
    let env = setup(canvas), st = {}, raf = 0;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = (t) => {
      env.ctx.clearRect(0, 0, env.w, env.h);
      draw(env, t, st, opts);
      if (!still) raf = requestAnimationFrame(frame);
    };
    // Warm up so a still frame (reduced motion) already has structure in it.
    if (still) for (let i = 0; i < 240; i++) { env.ctx.clearRect(0, 0, env.w, env.h); draw(env, i * 16, st, opts); }
    raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(() => { env = setup(canvas); st = {}; });
    ro.observe(canvas);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onTheme = () => { env = setup(canvas); };
    mq.addEventListener('change', onTheme);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mq.removeEventListener('change', onTheme); };
  }

  return { start };
})();
