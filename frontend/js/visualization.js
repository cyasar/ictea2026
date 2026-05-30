/** Canvas visualizations matching paper schematic (a1/a2).
 * Authors: Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Yazılım Geliştirme)
 */
const Viz = (function () {
  const COLORS = {
    bg: "#eef6fc",
    plate: "#d9dee3",
    plateBorder: "#9aa3ad",
    flow: "#2e7d32",
    flowLight: "#4caf50",
    poreActive: "#1976d2",
    poreInactive: "#b0bec5",
    membrane: "#b3e5fc",
    water: "#81d4fa",
    waterDeep: "#4fc3f7",
    bubble: "#26c6da",
    inlet: "#e53935",
    text: "#1a237e",
    textMuted: "#546e7a",
    boxProblem: "#fff3e0",
    boxProblemBorder: "#ffb74d",
    boxOpt: "#e3f2fd",
    boxOptBorder: "#64b5f6",
    boxFeas: "#e8f5e9",
    boxFeasBorder: "#81c784",
    graphEdge: "#90caf9",
    graphEdgeActive: "#2e7d32",
  };

  let animFrame = null;
  let phase = 0;
  let bubbles = [];
  const sizeCache = new WeakMap();

  function resizeCanvas(canvas, baseH) {
    const parent = canvas.parentElement;
    if (!parent) return { ctx: canvas.getContext("2d"), w: 800, h: baseH || 400 };

    const dpr = window.devicePixelRatio || 1;
    const h = baseH || parseInt(canvas.dataset.baseHeight || "400", 10);
    let w = Math.floor(parent.clientWidth);
    if (!w || w < 10) w = Math.floor(parent.offsetWidth) || 800;

    const prev = sizeCache.get(canvas);
    if (prev && prev.w === w && prev.h === h && prev.dpr === dpr) {
      return { ctx: canvas.getContext("2d"), w, h };
    }

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.maxWidth = "100%";
    canvas.style.display = "block";

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeCache.set(canvas, { w, h, dpr });
    return { ctx, w, h };
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawStatusBoxes(ctx, w, state) {
    const r = state.result;
    const n = (state.channels || 6) * (state.poresPerChannel || 8);
    const activeCount = r?.active_count ?? (r?.x ? r.x.filter((v) => v === 1).length : 0);
    const pmax = state.params?.pmax ?? 0.8;
    const totalP = r?.total_pressure ?? 0;
    const hVal = r?.hamiltonian;
    const feasible = r?.feasible;

    const boxes = [
      {
        x: 12, w: w * 0.31, color: COLORS.boxProblem, border: COLORS.boxProblemBorder,
        title: "Problem / Target",
        lines: [
          "Problem: oxygen-deficient bottom water.",
          "Target: controlled oxygen nanobubble delivery.",
        ],
      },
      {
        x: w * 0.345, w: w * 0.31, color: COLORS.boxOpt, border: COLORS.boxOptBorder,
        title: "Optimization",
        lines: [
          "Optimization: choose active nanopores.",
          "QUBO balances flow, pressure and continuity.",
        ],
      },
      {
        x: w * 0.68, w: w * 0.29, color: COLORS.boxFeas, border: COLORS.boxFeasBorder,
        title: "Feasibility",
        lines: r ? [
          `Feasible ${feasible ? "yes" : "no"} · H = ${hVal?.toFixed(2) ?? "—"}`,
          `Active pores: ${activeCount}/${n} · P/Pmax = ${pmax ? (totalP / pmax).toFixed(2) : "—"}`,
        ] : ["Run optimization to evaluate feasibility."],
      },
    ];

    boxes.forEach((b) => {
      roundRect(ctx, b.x, 8, b.w, 52, 6);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = b.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = COLORS.text;
      ctx.font = "bold 10px Segoe UI, sans-serif";
      ctx.fillText(b.title, b.x + 8, 22);
      ctx.font = "9px Segoe UI, sans-serif";
      ctx.fillStyle = COLORS.textMuted;
      b.lines.forEach((line, i) => ctx.fillText(line, b.x + 8, 36 + i * 11));
    });
  }

  function getPoreActive(xArr, c, p, pores) {
    if (!xArr || !xArr.length) return true;
    const idx = c * pores + p;
    return xArr[idx] === 1;
  }

  function spawnBubble(x, y, lane) {
    bubbles.push({ x, y, vy: 0.4 + Math.random() * 0.5, vx: (Math.random() - 0.5) * 0.3, r: 2 + Math.random() * 2, lane, life: 0 });
  }

  function updateBubbles(waterTop, waterBottom) {
    bubbles = bubbles.filter((b) => {
      b.y -= b.vy;
      b.x += b.vx + Math.sin(phase * 3 + b.lane) * 0.15;
      b.life++;
      return b.y > waterTop - 10 && b.life < 200;
    });
    if (bubbles.length > 120) bubbles = bubbles.slice(-120);
  }

  function drawMain(canvas, state) {
    const baseH = 520;
    canvas.dataset.baseHeight = baseH;
    const { ctx, w, h } = resizeCanvas(canvas, baseH);
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#f5fbff");
    grad.addColorStop(1, COLORS.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    drawStatusBoxes(ctx, w, state);

    const channels = state.channels || 6;
    const pores = state.poresPerChannel || 8;
    const xArr = state.result?.x || null;
    const padL = 70;
    const padR = 30;
    const netTop = 78;
    const upperH = 36;
    const midTop = netTop + upperH + 8;
    const memH = 28;
    const footerH = 36;
    const maxMidH = h - midTop - memH - footerH - 40;
    const channelH = 14;
    const channelGap = Math.max(4, Math.min(14, (maxMidH - 20 - channels * channelH) / Math.max(channels - 1, 1)));
    const midH = Math.min(channels * (channelH + channelGap) + 20, maxMidH);
    const memTop = midTop + midH + 6;
    const waterTop = memTop + memH + 4;
    const netW = w - padL - padR;

    // Upper plate
    roundRect(ctx, padL, netTop, netW, upperH, 4);
    ctx.fillStyle = COLORS.plate;
    ctx.fill();
    ctx.strokeStyle = COLORS.plateBorder;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "10px Segoe UI, sans-serif";
    ctx.fillText("Upper plate", padL + 6, netTop + 14);

    // O2 inlet arrow
    const inletX = padL + netW / 2;
    ctx.fillStyle = COLORS.inlet;
    ctx.font = "bold 11px Segoe UI, sans-serif";
    ctx.fillText("O₂ inlet", inletX - 22, netTop - 4);
    ctx.beginPath();
    ctx.moveTo(inletX, netTop - 2);
    ctx.lineTo(inletX, netTop + 10);
    ctx.strokeStyle = COLORS.inlet;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(inletX, netTop + 10);
    ctx.lineTo(inletX - 5, netTop + 4);
    ctx.lineTo(inletX + 5, netTop + 4);
    ctx.closePath();
    ctx.fill();

    // Middle plate label
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "10px Segoe UI, sans-serif";
    ctx.fillText("Middle plate (milled multi-channel network)", padL + 6, midTop - 4);

    roundRect(ctx, padL, midTop, netW, midH, 4);
    ctx.fillStyle = "#eceff1";
    ctx.fill();
    ctx.strokeStyle = COLORS.plateBorder;
    ctx.stroke();

    const manifoldX = padL + 18;
    const channelStartX = padL + 36;
    const channelEndX = padL + netW - 8;

    // Distribution manifold (animated pulse)
    const pulse = 0.5 + 0.5 * Math.sin(phase * 2);
    ctx.strokeStyle = COLORS.flow;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(inletX, netTop + upperH);
    ctx.lineTo(manifoldX, netTop + upperH);
    ctx.lineTo(manifoldX, midTop + midH - 10);
    ctx.stroke();

    ctx.fillStyle = COLORS.text;
    ctx.font = "9px Segoe UI, sans-serif";
    ctx.save();
    ctx.translate(manifoldX - 10, midTop + midH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("distribution manifold", 0, 0);
    ctx.restore();

    const channelYs = [];
    for (let c = 0; c < channels; c++) {
      const cy = midTop + 14 + c * (channelH + channelGap);
      channelYs.push(cy + channelH / 2);
      const anyActive = !xArr || Array.from({ length: pores }, (_, p) => getPoreActive(xArr, c, p, pores)).some(Boolean);
      const flowAlpha = anyActive ? 0.85 + pulse * 0.15 : 0.35;

      // Horizontal channel
      ctx.strokeStyle = anyActive ? `rgba(46, 125, 50, ${flowAlpha})` : "#bdbdbd";
      ctx.lineWidth = channelH;
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(channelStartX, cy + channelH / 2);
      ctx.lineTo(channelEndX, cy + channelH / 2);
      ctx.stroke();

      // Flow pulse dot (staggered white)
      const dotX = channelStartX + 40 + c * ((channelEndX - channelStartX - 80) / Math.max(channels - 1, 1));
      const dotPhase = (phase * 1.5 + c * 0.4) % 1;
      const pulseX = channelStartX + dotPhase * (channelEndX - channelStartX);
      ctx.beginPath();
      ctx.arc(pulseX, cy + channelH / 2, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();

      // Channel label
      ctx.fillStyle = COLORS.text;
      ctx.font = "bold 10px Segoe UI, sans-serif";
      ctx.fillText(`C${c + 1}`, padL + 4, cy + channelH / 2 + 4);

      // Closed end
      ctx.fillStyle = COLORS.textMuted;
      ctx.font = "8px Segoe UI, sans-serif";
      ctx.fillText("closed end", channelEndX - 52, cy + channelH / 2 + 3);

      // Manifold branch
      ctx.strokeStyle = anyActive ? COLORS.flow : "#bdbdbd";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(manifoldX, cy + channelH / 2);
      ctx.lineTo(channelStartX, cy + channelH / 2);
      ctx.stroke();

      // Vertical pores
      for (let p = 0; p < pores; p++) {
        const px = channelStartX + (p + 1) * ((channelEndX - channelStartX) / (pores + 1));
        const active = getPoreActive(xArr, c, p, pores);
        ctx.strokeStyle = active ? COLORS.poreActive : COLORS.poreInactive;
        ctx.lineWidth = active ? 2.5 : 1.5;
        ctx.setLineDash(active ? [] : [3, 3]);
        ctx.beginPath();
        ctx.moveTo(px, cy + channelH);
        ctx.lineTo(px, memTop);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pore node at channel
        ctx.beginPath();
        ctx.arc(px, cy + channelH / 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = active ? COLORS.poreActive : COLORS.poreInactive;
        ctx.fill();
      }
    }

    // Nanoporous membrane
    roundRect(ctx, padL, memTop, netW, memH, 3);
    ctx.fillStyle = COLORS.membrane;
    ctx.fill();
    ctx.strokeStyle = "#4fc3f7";
    ctx.stroke();
    ctx.fillStyle = COLORS.text;
    ctx.font="10px Segoe UI, sans-serif";
    ctx.fillText("Nanoporous membrane", padL + netW / 2 - 58, memTop + memH / 2 + 4);

    // Water phase with wave
    ctx.fillStyle = COLORS.water;
    ctx.beginPath();
    ctx.moveTo(padL, waterTop + 12);
    for (let x = padL; x <= padL + netW; x += 8) {
      const wy = waterTop + Math.sin((x / 30) + phase * 2) * 4;
      ctx.lineTo(x, wy);
    }
    ctx.lineTo(padL + netW, h - 20);
    ctx.lineTo(padL, h - 20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = COLORS.text;
    ctx.font = "10px Segoe UI, sans-serif";
    ctx.fillText("Water phase / sediment–water interface", padL + 8, h - 28);

    // Spawn bubbles from active pores
    if (xArr) {
      for (let c = 0; c < channels; c++) {
        for (let p = 0; p < pores; p++) {
          if (!getPoreActive(xArr, c, p, pores)) continue;
          const px = channelStartX + (p + 1) * ((channelEndX - channelStartX) / (pores + 1));
          if (Math.random() < 0.07) spawnBubble(px, waterTop + 8, c * pores + p);
        }
      }
    } else {
      for (let c = 0; c < channels; c++) {
        for (let p = 0; p < pores; p++) {
          const px = channelStartX + (p + 1) * ((channelEndX - channelStartX) / (pores + 1));
          if (Math.random() < 0.02) spawnBubble(px, waterTop + 8, c * pores + p);
        }
      }
    }

    updateBubbles(waterTop, h - 20);
    bubbles.forEach((b) => {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.5);
      g.addColorStop(0, "rgba(0, 229, 255, 0.5)");
      g.addColorStop(1, "rgba(0, 229, 255, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 229, 255, 0.85)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Footer note
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "9px Segoe UI, sans-serif";
    ctx.fillText(
      `${channels} channels × ${pores} pores/channel = ${channels * pores} QUBO variables`,
      padL, h - 8
    );
  }

  function drawSection(canvas, state) {
    const baseH = 200;
    canvas.dataset.baseHeight = baseH;
    const { ctx, w, h } = resizeCanvas(canvas, baseH);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = COLORS.text;
    ctx.font = "bold 11px Segoe UI, sans-serif";
    ctx.fillText("Section view", 10, 16);

    const lx = 30;
    const lw = w - 50;
    const layers = [
      { label: "Upper porous support", h: 22, color: COLORS.plate },
      { label: "Microchannel distribution cavity", h: 28, color: "#cfd8dc" },
      { label: "Nanoporous membrane", h: 24, color: COLORS.membrane },
    ];
    let y = 28;

    // O2 inlet
    ctx.fillStyle = COLORS.inlet;
    ctx.font = "10px Segoe UI, sans-serif";
    ctx.fillText("O₂ inlet", lx + lw / 2 - 20, y - 4);
    ctx.beginPath();
    ctx.moveTo(lx + lw / 2, y);
    ctx.lineTo(lx + lw / 2, y + 12);
    ctx.strokeStyle = COLORS.inlet;
    ctx.lineWidth = 2;
    ctx.stroke();

    layers.forEach((layer) => {
      roundRect(ctx, lx, y, lw, layer.h, 3);
      ctx.fillStyle = layer.color;
      ctx.fill();
      ctx.strokeStyle = COLORS.plateBorder;
      ctx.stroke();
      ctx.fillStyle = COLORS.textMuted;
      ctx.font = "9px Segoe UI, sans-serif";
      ctx.fillText(layer.label, lx + 8, y + layer.h / 2 + 3);
      if (layer.label.includes("membrane")) {
        for (let i = 0; i < 12; i++) {
          const dx = lx + 20 + i * ((lw - 40) / 11);
          ctx.beginPath();
          ctx.arc(dx, y + layer.h / 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = COLORS.poreActive;
          ctx.fill();
        }
      }
      y += layer.h + 4;
    });

    // Water
    const waterY = y + 4;
    ctx.fillStyle = COLORS.water;
    ctx.beginPath();
    ctx.moveTo(lx, waterY + 8);
    for (let x = lx; x <= lx + lw; x += 6) {
      ctx.lineTo(x, waterY + Math.sin(x / 15 + phase * 2) * 3);
    }
    ctx.lineTo(lx + lw, h - 10);
    ctx.lineTo(lx, h - 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "9px Segoe UI, sans-serif";
    ctx.fillText("Water phase / sediment–water interface", lx + 8, h - 14);

    // Bubbles in section
    for (let i = 0; i < 8; i++) {
      const bx = lx + 30 + i * ((lw - 60) / 7);
      const by = waterY + 20 + Math.sin(phase * 2 + i) * 8;
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.bubble;
      ctx.fill();
    }
  }

  function drawTopView(canvas, state) {
    const baseH = 200;
    canvas.dataset.baseHeight = baseH;
    const { ctx, w, h } = resizeCanvas(canvas, baseH);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = COLORS.text;
    ctx.font = "bold 11px Segoe UI, sans-serif";
    ctx.fillText("Top-view channel network", 10, 16);
    ctx.font = "9px Segoe UI, sans-serif";
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("microchannels for distribution", 10, 28);

    const cx = w / 2;
    const cy = h / 2 + 8;
    const R = Math.min(w, h) * 0.38;
    const channels = state.channels || 6;

    ctx.strokeStyle = "#cfd8dc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = COLORS.flow;
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "8px Segoe UI, sans-serif";
    ctx.fillText("source", cx - 16, cy + 22);

    for (let c = 0; c < channels; c++) {
      const angle = (c / channels) * Math.PI * 2 - Math.PI / 2;
      const x2 = cx + Math.cos(angle) * R;
      const y2 = cy + Math.sin(angle) * R;
      const xArr = state.result?.x;
      const pores = state.poresPerChannel || 8;
      const anyActive = !xArr || Array.from({ length: pores }, (_, p) => getPoreActive(xArr, c, p, pores)).some(Boolean);

      ctx.strokeStyle = anyActive ? COLORS.flow : "#bdbdbd";
      ctx.lineWidth = anyActive ? 3 : 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Branch sub-channels
      for (let b = 0; b < 3; b++) {
        const t = 0.4 + b * 0.2;
        const bx = cx + Math.cos(angle) * R * t;
        const by = cy + Math.sin(angle) * R * t;
        const ba = angle + (b - 1) * 0.35;
        ctx.strokeStyle = anyActive ? COLORS.flowLight : "#e0e0e0";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(ba) * 18, by + Math.sin(ba) * 18);
        ctx.stroke();
      }

      // Flow pulse
      const tPulse = (phase * 0.8 + c * 0.1) % 1;
      const px = cx + Math.cos(angle) * R * tPulse;
      const py = cy + Math.sin(angle) * R * tPulse;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    }

    ctx.fillStyle = COLORS.textMuted;
    ctx.font = "9px Segoe UI, sans-serif";
    ctx.fillText("branching microchannel architecture", cx - 78, h - 10);
  }

  function drawQUBOGraph(canvas, state) {
    const baseH = 280;
    canvas.dataset.baseHeight = baseH;
    const { ctx, w, h } = resizeCanvas(canvas, baseH);
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#f5fbff");
    grad.addColorStop(1, COLORS.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = COLORS.text;
    ctx.font = "bold 12px Segoe UI, sans-serif";
    ctx.fillText("QUBO graph mapping", 14, 20);
    ctx.font = "10px Segoe UI, sans-serif";
    ctx.fillStyle = COLORS.textMuted;
    ctx.fillText("physical channels → graph edges, candidate pores → binary variables", 14, 34);

    const channels = state.channels || 6;
    const pores = state.poresPerChannel || 8;
    const xArr = state.result?.x || null;
    const n = channels * pores;

    const gridLeft = 40;
    const gridTop = 48;
    const gridW = w - 80;
    const gridH = h - 110;
    const cols = pores;
    const rows = channels;
    const cellW = gridW / cols;
    const cellH = gridH / rows;

    // Grid edges (horizontal channel connections)
    for (let r = 0; r < rows; r++) {
      const y = gridTop + r * cellH + cellH / 2;
      const rowActive = !xArr || Array.from({ length: cols }, (_, c) => getPoreActive(xArr, r, c, pores)).some(Boolean);
      ctx.strokeStyle = rowActive ? COLORS.graphEdgeActive : COLORS.graphEdge;
      ctx.lineWidth = rowActive ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(gridLeft, y);
      ctx.lineTo(gridLeft + gridW, y);
      ctx.stroke();
    }

    // Vertical pore connections
    for (let c = 0; c < cols; c++) {
      const x = gridLeft + c * cellW + cellW / 2;
      ctx.strokeStyle = COLORS.graphEdge;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, gridTop);
      ctx.lineTo(x, gridTop + gridH);
      ctx.stroke();
    }

    // Nodes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gridLeft + c * cellW + cellW / 2;
        const y = gridTop + r * cellH + cellH / 2;
        const active = getPoreActive(xArr, r, c, pores);
        const glow = active && xArr && Math.sin(phase * 3 + r * cols + c) > 0.3;

        if (glow) {
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(25, 118, 210, 0.25)";
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = active ? COLORS.poreActive : COLORS.poreInactive;
        ctx.fill();
        ctx.strokeStyle = active ? "#0d47a1" : "#78909c";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    const r = state.result;
    const activeCount = r?.active_count ?? (r?.x ? r.x.filter((v) => v === 1).length : n);
    const pmax = state.params?.pmax ?? 0.8;
    const metrics = [
      { text: `n = ${n} QUBO variables`, color: COLORS.text },
      { text: `Active pores: ${r ? activeCount + "/" + n : "—"}`, color: COLORS.flow },
      { text: `H(x) = ${r ? r.hamiltonian.toFixed(2) : "—"}`, color: COLORS.poreActive },
      { text: `P/Pmax = ${r && pmax ? (r.total_pressure / pmax).toFixed(2) : "—"}`, color: COLORS.inlet },
    ];
    metrics.forEach((m, i) => {
      ctx.fillStyle = m.color;
      ctx.font = "bold 10px Segoe UI, sans-serif";
      ctx.fillText(m.text, 14 + i * (gridW / 4), h - 52);
    });

    // Legend
    const legend = [
      { color: COLORS.flow, label: "active oxygen flow" },
      { color: COLORS.poreActive, label: "QUBO-selected nanopore" },
      { color: COLORS.poreInactive, label: "inactive candidate pore" },
      { color: COLORS.bubble, label: "oxygen nanobubble" },
    ];
    legend.forEach((item, i) => {
      const lx = 14 + i * (w / 4.2);
      ctx.fillStyle = item.color;
      ctx.fillRect(lx, h - 28, 10, 10);
      ctx.fillStyle = COLORS.textMuted;
      ctx.font = "8px Segoe UI, sans-serif";
      ctx.fillText(item.label, lx + 14, h - 19);
    });
  }

  function drawEnergy(canvas, history) {
    const baseH = 120;
    canvas.dataset.baseHeight = baseH;
    const { ctx, w, h } = resizeCanvas(canvas, baseH);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = COLORS.text;
    ctx.font = "bold 11px Segoe UI, sans-serif";
    ctx.fillText("Energy convergence H(x)", 10, 16);

    if (!history || history.length < 2) {
      ctx.fillStyle = COLORS.textMuted;
      ctx.font = "10px Segoe UI, sans-serif";
      ctx.fillText("Run optimization to see energy decreasing", 10, h / 2);
      return;
    }
    const min = Math.min(...history);
    const max = Math.max(...history);
    const pad = 30;
    const range = max - min || 1;

    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, h - pad);
    ctx.lineTo(w - 10, h - pad);
    ctx.stroke();

    ctx.strokeStyle = COLORS.poreActive;
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((v, i) => {
      const x = pad + (i / (history.length - 1)) * (w - pad - 10);
      const y = h - pad - ((v - min) / range) * (h - 2 * pad);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    const last = history[history.length - 1];
    ctx.fillStyle = COLORS.flow;
    ctx.font = "9px Segoe UI, sans-serif";
    ctx.fillText(`Final H = ${last.toFixed(3)}`, w - 110, 16);
  }

  function startAnimation(canvases, getState) {
    stopAnimation();
    const allCanvases = Object.values(canvases).filter(Boolean);
    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        allCanvases.forEach((c) => sizeCache.delete(c));
      }, 100);
    };
    window.addEventListener("resize", onResize);

    function loop() {
      phase += 0.025;
      const state = getState();
      drawMain(canvases.main, state);
      if (canvases.section) drawSection(canvases.section, state);
      if (canvases.topview) drawTopView(canvases.topview, state);
      if (canvases.qubo) drawQUBOGraph(canvases.qubo, state);
      animFrame = requestAnimationFrame(loop);
    }
    loop();

    startAnimation._onResize = onResize;
  }

  function stopAnimation() {
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = null;
    if (startAnimation._onResize) {
      window.removeEventListener("resize", startAnimation._onResize);
      startAnimation._onResize = null;
    }
  }

  function highlightResult(result, delay) {
    if (!result?.x) return;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step > result.x.length) clearInterval(interval);
    }, delay || 40);
  }

  return {
    drawMain,
    drawSection,
    drawTopView,
    drawQUBOGraph,
    drawEnergy,
    drawGraph: drawQUBOGraph,
    startAnimation,
    stopAnimation,
    highlightResult,
  };
})();
