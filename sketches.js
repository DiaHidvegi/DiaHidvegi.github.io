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
      // Trace the found path from start to goal over 1.8 s, then hold briefly and start over
      const P = st.path.slice().reverse(), k = Math.min(1, (t - st.done) / 1800), m = k * (P.length - 1), mi = Math.floor(m);
      const tip = mi >= P.length - 1 ? P[P.length - 1] : { x: lerp(P[mi].x, P[mi + 1].x, m - mi), y: lerp(P[mi].y, P[mi + 1].y, m - mi) };
      ctx.lineWidth = 2.2; ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(P[0].x, P[0].y);
      for (let i = 1; i <= mi; i++) ctx.lineTo(P[i].x, P[i].y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      ctx.globalAlpha = 0.25; ctx.setLineDash([2, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tip.x, tip.y);
      for (let i = mi + 1; i < P.length; i++) ctx.lineTo(P[i].x, P[i].y); ctx.stroke(); ctx.setLineDash([]);
      ctx.globalAlpha = 1; dot(ctx, tip.x, tip.y, 4); ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.arc(tip.x, tip.y, 9, 0, TAU); ctx.stroke();
      if (t - st.done > 3000) st.nodes = null;
    }
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
  }

  // ---- Knowledge graph agent: a search wave spreads from a node while pulses race along the edges ----
  function walker({ ctx, w, h, ink }, t, st) {
    if (!st.g) {
      st.g = makeGraph(5, 30); st.r = rng(9); st.pulses = []; st.cycle = 3200;
      const { nodes, edges } = st.g; st.adj = nodes.map(() => []); edges.forEach(([a, b], e) => { st.adj[a].push([b, e]); st.adj[b].push([a, e]); });
      st.src = -1;
    }
    const { nodes, edges } = st.g, ph = (t % st.cycle) / st.cycle, cyc = Math.floor(t / st.cycle);
    if (cyc !== st.src) {
      // New source each cycle; compute hop distance to every node
      st.src = cyc; const start = Math.floor(st.r() * nodes.length);
      st.depth = nodes.map(() => Infinity); st.depth[start] = 0; const q = [start];
      while (q.length) { const u = q.shift(); for (const [v] of st.adj[u]) if (st.depth[v] === Infinity) { st.depth[v] = st.depth[u] + 1; q.push(v); } }
      st.maxD = Math.max(...st.depth.filter(d => d < Infinity)) + 1;
    }
    const front = ph * st.maxD * 1.15;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1;
    for (const [i, j] of edges) {
      const lit = Math.max(st.depth[i], st.depth[j]) <= front;
      ctx.globalAlpha = lit ? 0.5 : 0.12; ctx.lineWidth = lit ? 1.4 : 1;
      line(ctx, nodes[i].x * w, nodes[i].y * h, nodes[j].x * w, nodes[j].y * h);
    }
    ctx.lineWidth = 1;
    nodes.forEach((n, i) => {
      const d = st.depth[i], hit = d <= front, fresh = hit ? Math.max(0, 1 - (front - d)) : 0;
      ctx.globalAlpha = hit ? 0.9 : 0.3; dot(ctx, n.x * w, n.y * h, hit ? 2.6 + 3 * fresh : 2);
      if (fresh > 0) { ctx.globalAlpha = 0.5 * fresh; ctx.beginPath(); ctx.arc(n.x * w, n.y * h, 5 + 10 * (1 - fresh), 0, TAU); ctx.stroke(); }
    });
    // Fast pulses racing along random edges
    if (st.pulses.length < 7 && st.r() < 0.25) st.pulses.push({ e: Math.floor(st.r() * edges.length), k: 0, dir: st.r() < 0.5 ? 1 : -1 });
    st.pulses = st.pulses.filter(p => {
      p.k += 0.05; const [i, j] = edges[p.e], a = p.dir > 0 ? nodes[i] : nodes[j], b = p.dir > 0 ? nodes[j] : nodes[i];
      ctx.globalAlpha = 1; dot(ctx, lerp(a.x, b.x, p.k) * w, lerp(a.y, b.y, p.k) * h, 2.4);
      return p.k < 1;
    });
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

  // ---- Curriculum learning: two learning curves draw themselves, one climbing faster ----
  function curves({ ctx, w, h, ink }, t, st) {
    if (!st.n) { const r = rng(37); st.n = Array.from({ length: 80 }, () => r() - 0.5); }
    const k = (t % 6000) / 6000, x0 = w * 0.12, x1 = w * 0.9, y0 = h * 0.85, y1 = h * 0.18;
    ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.globalAlpha = 0.25;
    line(ctx, x0, y0, x1, y0); line(ctx, x0, y0, x0, y1);
    const draw = (rate, alpha, width) => {
      ctx.globalAlpha = alpha; ctx.lineWidth = width; ctx.beginPath();
      const n = Math.floor(Math.min(1, k * 1.15) * 80);
      for (let i = 0; i <= n; i++) {
        const u = i / 80, v = 1 - Math.exp(-u * rate), y = y0 - (y1 - y0) * -v * 0.95 + st.n[i] * 6 * (1 - v);
        i ? ctx.lineTo(x0 + u * (x1 - x0), y) : ctx.moveTo(x0 + u * (x1 - x0), y);
      }
      ctx.stroke();
    };
    draw(2.2, 0.35, 1.2); draw(6, 0.95, 2);
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
  }

  // ---- Visual odometry: a camera traces a path; landmarks appear inside its field of view as it passes ----
  function odometry({ ctx, w, h, ink }, t, st) {
    if (!st.path) {
      const r = rng(43); st.path = []; st.marks = [];
      let x = w * 0.15, y = h * 0.8, a = -0.9;
      for (let i = 0; i < 140; i++) {
        a += (r() - 0.5) * 0.25 + Math.sin(i * 0.05) * 0.02; x += Math.cos(a) * w * 0.006; y += Math.sin(a) * h * 0.006;
        st.path.push({ x, y, a });
        // Landmarks placed ahead of this pose, within a +-28 degree cone, so the camera sees them when it gets here
        if (i % 3 === 0) { const d = 14 + r() * 26, s = (r() - 0.5) * 1.0; st.marks.push({ i, x: x + Math.cos(a + s) * d, y: y + Math.sin(a + s) * d }); }
      }
    }
    const n = Math.floor(((t % 7000) / 7000) * st.path.length);
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1.6;
    ctx.globalAlpha = 0.9; ctx.beginPath();
    st.path.slice(0, n + 1).forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
    for (const m of st.marks) if (m.i <= n) { const age = Math.min(1, (n - m.i) / 6); ctx.globalAlpha = 0.25 + 0.6 * (1 - age); dot(ctx, m.x, m.y, 1.6 + 2 * (1 - age)); }
    if (n > 0) {
      const p = st.path[n];
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-9, -6); ctx.lineTo(-9, 6); ctx.closePath(); ctx.stroke();
      ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(42, -22); ctx.lineTo(42, 22); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1; ctx.lineWidth = 1;
  }

  // ---- Site selection: a search ring sweeps over candidate locations and settles on one ----
  function sites({ ctx, w, h, ink }, t, st) {
    if (!st.pts) {
      const r = rng(47); st.pts = [];
      for (let i = 0; i < 60; i++) { const a = r() * TAU, d = Math.sqrt(r()) * 0.36; st.pts.push({ x: 0.5 + Math.cos(a) * d, y: 0.5 + Math.sin(a) * d * 0.85, s: 1 + r() * 2.5 }); }
      st.best = st.pts.reduce((b, p, i) => (Math.hypot(p.x - 0.56, p.y - 0.46) < Math.hypot(st.pts[b].x - 0.56, st.pts[b].y - 0.46) ? i : b), 0);
    }
    const k = (t % 5000) / 5000, target = st.pts[st.best];
    // Ring spirals inward toward the chosen site, then holds
    const spin = Math.min(1, k / 0.7), cx = 0.5 + Math.cos(spin * TAU * 1.5) * 0.25 * (1 - spin) + (target.x - 0.5) * spin;
    const cy = 0.5 + Math.sin(spin * TAU * 1.5) * 0.22 * (1 - spin) + (target.y - 0.5) * spin, rad = w * (0.16 - 0.1 * spin);
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1;
    for (const p of st.pts) {
      const near = Math.hypot(p.x * w - cx * w, p.y * h - cy * h) < rad;
      ctx.globalAlpha = near ? 0.9 : 0.3; dot(ctx, p.x * w, p.y * h, p.s);
    }
    ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(cx * w, cy * h, rad, 0, TAU); ctx.stroke();
    if (k > 0.7) { const pulse = ((k - 0.7) / 0.3); ctx.globalAlpha = 0.6 * (1 - pulse); ctx.beginPath(); ctx.arc(target.x * w, target.y * h, rad + pulse * 22, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1; dot(ctx, target.x * w, target.y * h, 4); }
    ctx.globalAlpha = 1;
  }

  const TYPES = { orbit, sort, network, tree, walker, traffic, agents, stream, gate, curves, odometry, sites };

  function start(canvas, opts) {
    const draw = TYPES[opts.type];
    if (!draw) return () => {};
    let env = setup(canvas), st = {}, raf = 0;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // While the tile's colour is transitioning (hover in/out), re-read it each frame
    let recolorUntil = 0;
    const recolor = () => { recolorUntil = performance.now() + 450; };
    const tile = canvas.parentElement;
    tile.addEventListener('pointerenter', recolor); tile.addEventListener('pointerleave', recolor);
    tile.addEventListener('focus', recolor); tile.addEventListener('blur', recolor);
    const frame = (t) => {
      if (t < recolorUntil) env.ink = getComputedStyle(canvas).color;
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
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mq.removeEventListener('change', onTheme); ['pointerenter', 'pointerleave', 'focus', 'blur'].forEach(e => tile.removeEventListener(e, recolor)); };
  }

  return { start };
})();
