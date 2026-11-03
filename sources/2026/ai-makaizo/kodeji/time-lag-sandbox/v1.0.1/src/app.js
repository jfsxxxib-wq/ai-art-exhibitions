/* Original time/gesture system and Canvas artwork: こでじ, 2026. */
(() => {
  'use strict';
  const first = document.getElementById('now'), second = document.getElementById('later');
  const range = document.getElementById('delay'), out = document.getElementById('seconds');
  const status = document.getElementById('status');
  const worlds = [new SandWorld(), new SandWorld()];
  const canvases = [first, second];
  const contexts = canvases.map(c => c.getContext('2d'));
  if (contexts.some(c => !c)) { status.textContent = 'このブラウザではCanvasを開けませんでした。'; return; }
  const buffers = worlds.map(w => {
    const canvas = document.createElement('canvas'); canvas.width = w.width; canvas.height = w.height;
    return { canvas, context: canvas.getContext('2d'), data: new ImageData(w.width, w.height) };
  });
  const backdrops = canvases.map((_, i) => {
    const canvas = document.createElement('canvas'); canvas.width = 540; canvas.height = 400;
    const c = canvas.getContext('2d');
    const gradient = c.createRadialGradient(275, 130, 5, 275, 130, 320);
    gradient.addColorStop(0, i ? '#f5f1d8' : '#fff8df'); gradient.addColorStop(1, i ? '#dbe5dc' : '#e6e9db');
    c.fillStyle = gradient; c.fillRect(0, 0, 540, 400);
    c.fillStyle = i ? '#b0c1b0' : '#c0c7ae'; c.beginPath(); c.moveTo(0, 300);
    for (let x = 0; x <= 540; x += 3) c.lineTo(x, 270 + Math.sin(x / 93 + i) * 18 + Math.cos(x / 42) * 9);
    c.lineTo(540, 400); c.lineTo(0, 400); c.fill();
    c.fillStyle = '#f8f0d5'; c.beginPath(); c.arc(i ? 380 : 360, 98, i ? 21 : 24, 0, Math.PI * 2); c.fill();
    return canvas;
  });
  const palettes = [null, [[179,138,77],[207,169,103],[216,183,121],[226,197,142]], [[79,140,144],[103,162,161],[130,180,174],[157,194,183]], [[104,125,109],[111,132,115],[116,136,119],[122,141,123]]];
  const MAX_PENDING = 2048;
  const rates = [30, 12];
  let material = SandWorld.SAND, pending = [], active = null, previous = null;
  let elapsed = 0, frame = 0, last = null, accumulators = [0, 0];
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let message = '一筆を待っています。', lastMessage = '', dirty = true;

  function render() {
    worlds.forEach((world, side) => {
      const { data, canvas, context } = buffers[side], pixels = data.data;
      for (let i = 0; i < world.cells.length; i++) {
        const kind = world.cells[i], p = i * 4;
        if (!kind) { pixels[p + 3] = 0; continue; }
        let texture = Math.imul(i ^ (i >>> 8), 0x45d9f3b);
        texture ^= texture >>> 16;
        const color = palettes[kind][(texture >>> 16) & 3];
        pixels[p] = color[0]; pixels[p + 1] = color[1]; pixels[p + 2] = color[2]; pixels[p + 3] = 255;
      }
      context.putImageData(data, 0, 0);
      const c = contexts[side]; c.imageSmoothingEnabled = false;
      c.drawImage(backdrops[side], 0, 0); c.drawImage(canvas, 0, 0, 540, 400);
      // Seedlings are original decorative marks, anchored to the moving surface.
      c.strokeStyle = side ? '#4b7964' : '#688866'; c.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const x = 25 + i * 5;
        let y = 0; while (y < world.height - 1 && world.at(x, y) === SandWorld.EMPTY) y++;
        if (world.at(x, y) !== SandWorld.SAND) continue;
        const sx = x / world.width * 540, sy = y / world.height * 400, h = side ? 30 + i % 3 * 6 : 12 + i % 3 * 3;
        c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx - 3, sy - h / 2, sx + 2, sy - h); c.stroke();
        c.fillStyle = side ? '#759470' : '#91a17b'; c.fillRect(sx - 4, sy - h + 5, 6, 3); c.fillRect(sx + 2, sy - h + 11, 6, 3);
      }
    });
    dirty = false;
  }

  function announce() {
    const text = paused ? '時間を止めています。空白キーで再開します。' : message;
    if (text !== lastMessage) { status.textContent = text; lastMessage = text; }
  }

  function add(x, y) {
    if (paused) { announce(); return; }
    if (pending.length >= MAX_PENDING) { message = '一筆が届くのを、少し待ってください。'; announce(); return; }
    const point = { x, y, kind: material, due: elapsed + Number(range.value) };
    // Capture the input, including its chosen delay; later slider changes affect new input only.
    worlds[0].paint(x, y, material);
    pending.push(point); dirty = true;
    message = '一筆を受け取りました。あとから届きます。'; announce();
  }

  function update(dt) {
    elapsed += dt;
    for (const point of pending) if (point.due <= elapsed) { worlds[1].paint(point.x, point.y, point.kind); dirty = true; }
    const previousCount = pending.length;
    pending = pending.filter(point => point.due > elapsed);
    if (previousCount > 0 && !pending.length) { message = 'さっきの一筆が、届きました。'; announce(); }
    for (let side = 0; side < 2; side++) {
      accumulators[side] += dt * rates[side];
      let budget = 0;
      while (accumulators[side] >= 1 && budget < 3) {
        if (worlds[side].step()) dirty = true;
        accumulators[side]--; budget++;
      }
      accumulators[side] = Math.min(accumulators[side], 1);
    }
  }

  function loop(timestamp) {
    frame = 0;
    if (document.hidden || paused) { last = null; return; }
    if (last !== null) update(Math.min(.05, Math.max(0, (timestamp - last) / 1000)));
    last = timestamp;
    if (dirty) render();
    frame = requestAnimationFrame(loop);
  }

  function schedule() { if (!frame && !document.hidden && !paused) frame = requestAnimationFrame(loop); }
  function stopPointer() {
    const id = active; active = null; previous = null;
    if (id !== null && first.hasPointerCapture(id)) first.releasePointerCapture(id);
  }
  function reset() {
    stopPointer(); worlds[0].initialize(false); worlds[1].initialize(true);
    pending = []; accumulators = [0, 0]; elapsed = 0; last = null; dirty = true;
    message = '一筆を待っています。'; render(); announce(); schedule();
  }
  function position(e) {
    const bounds = first.getBoundingClientRect();
    return { x: Math.max(1, Math.min(worlds[0].width - 2, (e.clientX - bounds.left) / bounds.width * worlds[0].width)), y: Math.max(0, Math.min(worlds[0].height - 2, (e.clientY - bounds.top) / bounds.height * worlds[0].height)) };
  }
  first.addEventListener('pointerdown', e => {
    if (active !== null || paused || (e.pointerType === 'mouse' && e.button !== 0)) return;
    active = e.pointerId; first.setPointerCapture(active); previous = position(e); add(previous.x, previous.y);
  });
  first.addEventListener('pointermove', e => {
    if (e.pointerId !== active || !previous || paused) return;
    const point = position(e), length = Math.hypot(point.x - previous.x, point.y - previous.y);
    const count = Math.min(64, Math.ceil(length));
    for (let i = 1; i <= count; i++) add(previous.x + (point.x - previous.x) * i / count, previous.y + (point.y - previous.y) * i / count);
    previous = point;
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => first.addEventListener(type, e => { if (e.pointerId === active) stopPointer(); }));
  const kinds = { sand: 1, water: 2, stone: 3 };
  document.querySelectorAll('[data-material]').forEach(button => button.addEventListener('click', () => {
    material = kinds[button.dataset.material];
    document.querySelectorAll('[data-material]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  }));
  range.addEventListener('input', () => { out.textContent = range.value + ' 秒'; });
  document.getElementById('place').addEventListener('click', () => {
    for (let i = 0; i < 22; i++) add(80 + Math.sin(i / 5) * 12, 26 + i);
  });
  document.getElementById('reset').addEventListener('click', reset);
  function togglePause() {
    paused = !paused; last = null; stopPointer();
    if (paused && frame) { cancelAnimationFrame(frame); frame = 0; }
    document.getElementById('pause').checked = paused;
    announce(); schedule();
  }
  document.getElementById('pause').addEventListener('change', togglePause);
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !/^(INPUT|BUTTON|SUMMARY|TEXTAREA|SELECT|A)$/.test(e.target.tagName) && !e.repeat) { e.preventDefault(); togglePause(); }
  });
  document.addEventListener('visibilitychange', () => {
    stopPointer(); last = null;
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    schedule();
  });
  document.getElementById('pause').checked = paused;
  reset();
  document.documentElement.dataset.artworkReady = 'true';
})();
