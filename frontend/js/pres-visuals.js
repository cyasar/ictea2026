/** Animated visuals for presentation slides — scientific + animated HUDs */
const PresVisuals = (function () {
  let phase = 0;
  let slidePhase = 0;
  let currentSlide = 0;
  let energyCounter = -1.2;
  let energyTarget = -2.35;

  const C = {
    green: "#2e7d32",
    blue: "#1976d2",
    cyan: "#00e5ff",
    red: "#e53935",
    orange: "#fb8c00",
    grey: "#90a4ae",
    water: "#0288d1",
    waterLight: "#b3e5fc",
    algae: "#558b2f",
    hudBg: "rgba(15, 23, 42, 0.92)",
    membrane: "#4fc3f7",
    sediment: "#6d4c41",
    plate: "#cfd8dc",
  };

  const BENCHMARK = [
    { id: 1, f: 0.9, p: 0.3 },
    { id: 2, f: 0.75, p: 0.25 },
    { id: 3, f: 0.6, p: 0.2 },
    { id: 4, f: 0.85, p: 0.35 },
    { id: 5, f: 0.5, p: 0.15 },
    { id: 6, f: 0.7, p: 0.25 },
  ];

  const SELECTED = [0, 1, 5];

  function setupCanvas(canvas) {
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    const w = Math.max(Math.floor(rect.width || parent.clientWidth), 280);
    const h = Math.max(Math.floor(rect.height || parent.clientHeight), 240);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function hudRoundRect(ctx, x, y, rw, rh, r) {
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, rw, rh, r);
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + rw - r, y);
    ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
    ctx.lineTo(x + rw, y + rh - r);
    ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
    ctx.lineTo(x + r, y + rh);
    ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawHud(ctx, w, h, lines) {
    if (!lines?.length) return;
    const lh = 16;
    const pad = 8;
    const boxH = lines.length * lh + pad * 2 + 14;
    const boxW = Math.min(w - 16, 240);
    const bx = w - boxW - 8;
    ctx.fillStyle = C.hudBg;
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    hudRoundRect(ctx, bx, 8, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 10px Segoe UI, sans-serif";
    ctx.fillText("SIM VALUES", bx + pad, 24);
    ctx.font = "11px Consolas, monospace";
    lines.forEach((line, i) => {
      ctx.fillStyle = line.color || "#94a3b8";
      ctx.fillText(line.text, bx + pad, 40 + i * lh);
    });
  }

  function drawNanobubble(ctx, x, y, r, alpha, glow) {
    if (glow) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
      g.addColorStop(0, `rgba(0, 229, 255, ${alpha * 0.5})`);
      g.addColorStop(1, "rgba(0, 229, 255, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, alpha + 0.2)})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fill();
  }

  function stateHud(state) {
    const p = state?.params || {};
    const r = state?.result;
    const c = state?.channels ?? 6;
    const pp = state?.poresPerChannel ?? 8;
    const lines = [
      { text: `C × P = ${c} × ${pp} = ${c * pp}` },
      { text: `Pmax = ${(p.pmax ?? 0.8).toFixed(2)}` },
      { text: `K = ${p.kActive ?? 3}` },
    ];
    if (r) {
      lines.push({ text: `H(x) = ${r.hamiltonian?.toFixed(3)}`, color: "#93c5fd" });
      lines.push({ text: `η = ${r.total_efficiency?.toFixed(2)}  P = ${r.total_pressure?.toFixed(2)}`, color: "#86efac" });
      lines.push({ text: `Active: {${(r.active_pores || []).join(",")}}`, color: "#fde68a" });
      lines.push({ text: `Feasible: ${r.feasible ? "YES" : "NO"}`, color: r.feasible ? "#4ade80" : "#f87171" });
    }
    return lines;
  }

  function drawLake(ctx, w, h) {
    const gSky = ctx.createLinearGradient(0, 0, 0, h * 0.2);
    gSky.addColorStop(0, "#33691e");
    gSky.addColorStop(1, C.algae);
    ctx.fillStyle = gSky;
    ctx.fillRect(0, 0, w, h * 0.2);
    const gWater = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.62);
    gWater.addColorStop(0, "#0d47a1");
    gWater.addColorStop(1, "#1565c0");
    ctx.fillStyle = gWater;
    ctx.fillRect(0, h * 0.2, w, h * 0.42);
    const pulse = 0.5 + 0.5 * Math.sin(phase * 2);
    ctx.fillStyle = `rgba(183, 28, 28, ${0.4 + pulse * 0.2})`;
    ctx.fillRect(0, h * 0.62, w, h * 0.22);
    ctx.fillStyle = C.sediment;
    ctx.fillRect(0, h * 0.84, w, h * 0.16);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px Segoe UI,sans-serif";
    ctx.fillText("Algal bloom zone", 12, 22);
    ctx.fillText("Water column", 12, h * 0.38);
    ctx.fillStyle = C.red;
    ctx.fillText("Hypoxic bottom  DO ≈ 1.2 mg/L", 12, h * 0.72);
    drawHud(ctx, w, h, [
      { text: "Surface DO: 8.5 mg/L", color: "#86efac" },
      { text: "Bottom DO: 1.2 mg/L", color: "#f87171" },
    ]);
  }

  function drawBubbles(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#012a4a");
    g.addColorStop(0.5, "#014f86");
    g.addColorStop(1, "#013a63");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 22; i++) {
      const bx = 30 + (i % 8) * ((w - 60) / 7);
      const by = h - 15 - ((phase * 45 + i * 38) % (h - 30));
      const r = 5 + (i % 5) * 2.5;
      const alpha = 0.65 + 0.35 * Math.sin(phase * 2 + i);
      drawNanobubble(ctx, bx + Math.sin(phase * 1.8 + i) * 12, by, r, alpha, true);
    }
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Segoe UI,sans-serif";
    ctx.fillText("O₂ nanobubbles (~100 nm)", 12, 24);
    drawHud(ctx, w, h, [
      { text: "Size: ~100 nm", color: "#80deea" },
      { text: "Rise: slow · η high", color: "#a5d6a7" },
    ]);
  }

  function drawPoresQuestion(ctx, w, h) {
    ctx.fillStyle = "#263238";
    ctx.fillRect(0, 0, w, h);
    const cols = 8;
    const rows = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = 36 + c * ((w - 72) / (cols - 1));
        const y = 36 + r * ((h - 100) / (rows - 1));
        const on = Math.sin(phase * 3 + r + c) > 0;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fillStyle = on ? C.blue : "#546e7a";
        ctx.fill();
        ctx.strokeStyle = on ? C.green : "#78909c";
        ctx.stroke();
      }
    }
    ctx.font = "bold 36px Segoe UI,sans-serif";
    ctx.fillStyle = C.orange;
    ctx.fillText("?", w / 2 - 14, h / 2 + 14);
    drawHud(ctx, w, h, [{ text: "Which subset?" }, { text: "Pmax · K · continuity", color: "#fde68a" }]);
  }

  function drawScientificSection(ctx, w, h) {
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, w, h);
    const mx = 32;
    const mw = w - 64;
    const layers = [
      { id: "inlet", label: "O₂ inlet", sub: "gas feed", h: 0.1, color: "#37474f", accent: C.red },
      { id: "plate", label: "Upper porous support", sub: "distribution plate", h: 0.08, color: "#546e7a" },
      { id: "micro", label: "Microchannel network", sub: "C1–C6 milled channels", h: 0.22, color: "#455a64" },
      { id: "membrane", label: "Nanoporous membrane", sub: "pore release zone", h: 0.14, color: "#0277bd" },
      { id: "water", label: "Water phase", sub: "bulk aquatic layer", h: 0.16, color: "#01579b" },
      { id: "if", label: "Sediment–water interface", sub: "restoration target", h: 0.12, color: C.sediment },
    ];
    let y = 20;
    layers.forEach((L, idx) => {
      const lh = h * L.h;
      const g = ctx.createLinearGradient(mx, y, mx + mw, y + lh);
      g.addColorStop(0, L.color);
      g.addColorStop(1, shade(L.color, -15));
      ctx.fillStyle = g;
      ctx.fillRect(mx, y, mw, lh);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.strokeRect(mx, y, mw, lh);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px Segoe UI,sans-serif";
      ctx.fillText(L.label, mx + 10, y + 16);
      ctx.font = "9px Segoe UI,sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.fillText(L.sub, mx + 10, y + 28);

      if (L.id === "inlet") {
        const ix = mx + mw / 2;
        ctx.strokeStyle = C.red;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ix, 8);
        ctx.lineTo(ix, y);
        ctx.stroke();
        ctx.fillStyle = C.red;
        ctx.font = "bold 10px Segoe UI,sans-serif";
        ctx.fillText("O₂", ix - 8, 8);
        ctx.lineWidth = 1;
      }

      if (L.id === "micro") {
        const chTop = y + 32;
        const chH = lh - 40;
        for (let c = 0; c < 6; c++) {
          const cy = chTop + c * (chH / 5);
          ctx.strokeStyle = C.green;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(mx + 20, cy);
          ctx.lineTo(mx + mw - 20, cy);
          ctx.stroke();
          const dotX = mx + 30 + ((phase * 60 + c * 40) % (mw - 60));
          ctx.beginPath();
          ctx.arc(dotX, cy, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
          ctx.fillStyle = "#a5d6a7";
          ctx.font = "8px Segoe UI,sans-serif";
          ctx.fillText(`C${c + 1}`, mx + 4, cy + 3);
        }
        ctx.lineWidth = 1;
      }

      if (L.id === "membrane") {
        for (let p = 0; p < 14; p++) {
          const px = mx + 20 + p * ((mw - 40) / 13);
          ctx.beginPath();
          ctx.arc(px, y + lh / 2, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.fill();
        }
      }

      if (L.id === "if") {
        for (let b = 0; b < 10; b++) {
          const bx = mx + 30 + b * ((mw - 60) / 9);
          const by = y + lh * 0.35 - ((phase * 30 + b * 25) % (lh * 0.5));
          drawNanobubble(ctx, bx, by, 4 + (b % 3), 0.85, true);
        }
      }
      y += lh + 3;
    });
    drawHud(ctx, w, h, [{ text: "Top → membrane → IF", color: "#80deea" }]);
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
    const b = Math.max(0, Math.min(255, (n & 255) + amt));
    return `rgb(${r},${g},${b})`;
  }

  function drawBinaryMap(ctx, w, h) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) {
      const x = 40 + i * ((w - 80) / 5);
      ctx.fillStyle = "#334155";
      ctx.fillRect(x - 20, h * 0.12, 40, 40);
      ctx.fillStyle = C.blue;
      ctx.beginPath();
      ctx.arc(x, h * 0.62, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`x${i + 1}`, x - 12, h * 0.66);
      const bit = Math.sin(phase * 2 + i) > 0 ? 1 : 0;
      ctx.fillStyle = bit ? "#4ade80" : "#94a3b8";
      ctx.font = "bold 16px monospace";
      ctx.fillText(String(bit), x - 5, h * 0.26);
    }
    drawHud(ctx, w, h, [{ text: "xᵢ ∈ {0, 1}" }, { text: "1 = active pore", color: "#86efac" }]);
  }

  function drawQUBOBoxes(ctx, w, h, state) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);
    const p = state?.params || {};
    const terms = [
      { t: "−Σfᵢxᵢ", c: C.green, v: "reward" },
      { t: "Σqᵢⱼxᵢxⱼ", c: C.blue, v: "hydraulic" },
      { t: `λp(Pmax=${(p.pmax ?? 0.8).toFixed(2)})`, c: C.red, v: "penalty" },
      { t: `λk(K=${p.kActive ?? 3})`, c: C.orange, v: "penalty" },
      { t: "λc·C(x)", c: "#7e57c2", v: "continuity" },
    ];
    terms.forEach((term, i) => {
      const bx = 12 + (i % 3) * (w / 3.1);
      const by = 28 + Math.floor(i / 3) * (h * 0.38);
      ctx.fillStyle = term.c;
      ctx.fillRect(bx, by, w / 3.3, h * 0.28);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px Segoe UI,sans-serif";
      ctx.fillText(term.t, bx + 6, by + h * 0.12);
      ctx.font = "9px Segoe UI,sans-serif";
      ctx.fillText(term.v, bx + 6, by + h * 0.2);
    });
  }

  function drawQUBOGraphPres(ctx, w, h, state) {
    ctx.fillStyle = "#0a0f1a";
    ctx.fillRect(0, 0, w, h);
    const channels = 6;
    const pores = 8;
    const xArr = state?.result?.x;
    const useArr = xArr && xArr.length >= channels * pores ? xArr : null;

    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 12px Segoe UI,sans-serif";
    ctx.fillText("QUBO Graph Mapping", 14, 22);
    ctx.fillStyle = "#64748b";
    ctx.font = "10px Segoe UI,sans-serif";
    ctx.fillText("6 channels × 8 pores = 48 binary variables", 14, 38);

    const gridL = 36;
    const gridT = 52;
    const gridW = w - 72;
    const gridH = h - 100;
    const cellW = gridW / pores;
    const cellH = gridH / channels;

    ctx.strokeStyle = "rgba(144, 202, 249, 0.35)";
    ctx.lineWidth = 1;
    for (let r = 0; r < channels; r++) {
      const y = gridT + r * cellH + cellH / 2;
      const rowOn = !useArr || Array.from({ length: pores }, (_, c) => {
        const idx = r * pores + c;
        return useArr[idx] === 1;
      }).some(Boolean);
      ctx.strokeStyle = rowOn ? "rgba(46, 125, 50, 0.7)" : "rgba(144, 202, 249, 0.25)";
      ctx.lineWidth = rowOn ? 2.5 : 1;
      ctx.beginPath();
      ctx.moveTo(gridL, y);
      ctx.lineTo(gridL + gridW, y);
      ctx.stroke();
    }

    for (let c = 0; c < pores; c++) {
      const x = gridL + c * cellW + cellW / 2;
      ctx.strokeStyle = "rgba(144, 202, 249, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, gridT);
      ctx.lineTo(x, gridT + gridH);
      ctx.stroke();
    }

    let activeCount = 0;
    for (let r = 0; r < channels; r++) {
      for (let c = 0; c < pores; c++) {
        const idx = r * pores + c;
        const active = useArr ? useArr[idx] === 1 : false;
        if (active) activeCount++;
        const x = gridL + c * cellW + cellW / 2;
        const y = gridT + r * cellH + cellH / 2;
        const pulse = active && Math.sin(phase * 4 + idx) > 0;
        if (pulse) {
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(25, 118, 210, 0.3)";
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = active ? C.blue : "#546e7a";
        ctx.fill();
        ctx.strokeStyle = active ? C.green : "#78909c";
        ctx.lineWidth = active ? 2 : 1;
        ctx.stroke();
        if (active) {
          ctx.fillStyle = "#fff";
          ctx.font = "7px monospace";
          ctx.fillText("1", x - 2, y + 3);
        }
      }
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px Segoe UI,sans-serif";
      ctx.fillText(`C${r + 1}`, gridL - 22, gridT + r * cellH + cellH / 2 + 3);
    }

    const legend = [
      { c: C.green, l: "active flow edge" },
      { c: C.blue, l: "QUBO-selected pore" },
      { c: "#546e7a", l: "inactive candidate" },
    ];
    legend.forEach((item, i) => {
      const lx = 14 + i * (w / 3.2);
      ctx.fillStyle = item.c;
      ctx.fillRect(lx, h - 28, 10, 10);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "8px Segoe UI,sans-serif";
      ctx.fillText(item.l, lx + 14, h - 19);
    });

    drawHud(ctx, w, h, [
      { text: `n = ${channels * pores} QUBO vars`, color: "#93c5fd" },
      { text: `Active: ${useArr ? activeCount : "—"}/${channels * pores}`, color: "#86efac" },
      { text: "2^48 search space", color: "#fde68a" },
    ]);
  }

  function drawSpinFlip(ctx, w, h) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, h);
    [[0, 1, "binary x"], [-1, 1, "spin s"]].forEach((col, i) => {
      const cx = w * (0.3 + i * 0.4);
      const val = Math.sin(phase * 2 + i * Math.PI) > 0 ? col[1] : col[0];
      ctx.beginPath();
      ctx.arc(cx, h * 0.45, 44, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? C.blue : "#7c3aed";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 26px Segoe UI,sans-serif";
      ctx.fillText(String(val), cx - (String(val).length > 1 ? 22 : 10), h * 0.45 + 9);
      ctx.font = "11px Segoe UI,sans-serif";
      ctx.fillText(col[2], cx - 24, h * 0.72);
    });
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px Segoe UI,sans-serif";
    ctx.fillText("x = (1 + s) / 2", w / 2 - 48, h - 16);
  }

  function drawBenchmarkTable(ctx, w, h) {
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#263238";
    ctx.font = "bold 10px Segoe UI,sans-serif";
    ctx.fillText("Pore", 20, 28);
    ctx.fillText("fᵢ", 70, 28);
    ctx.fillText("pᵢ", 120, 28);
    BENCHMARK.forEach((row, i) => {
      const y = 44 + i * 26;
      ctx.fillStyle = "#37474f";
      ctx.font = "11px Consolas,monospace";
      ctx.fillText(String(row.id), 24, y);
      ctx.fillText(row.f.toFixed(2), 70, y);
      ctx.fillText(row.p.toFixed(2), 120, y);
    });
    ctx.fillStyle = C.green;
    ctx.font = "bold 10px Segoe UI,sans-serif";
    ctx.fillText("Pmax=0.80  K=3  →  2⁶=64 states", 20, h - 18);
  }

  function drawSixPore(ctx, w, h, highlight, animateSelect) {
    ctx.fillStyle = "#1a2332";
    ctx.fillRect(0, 0, w, h);
    const cx0 = w / 2;
    const cy0 = h * 0.42;
    const radius = Math.min(w, h) * 0.32;

    BENCHMARK.forEach((row, i) => {
      const angle = -Math.PI / 2 + (i / 6) * Math.PI * 2;
      const cx = cx0 + Math.cos(angle) * radius;
      const cy = cy0 + Math.sin(angle) * radius * 0.55;
      let active = false;
      if (highlight && animateSelect) {
        const stagger = SELECTED.indexOf(i);
        active = stagger >= 0 && slidePhase > stagger * 0.9 + 0.3;
      } else if (highlight) {
        active = SELECTED.includes(i);
      } else {
        active = Math.sin(phase * 4 + i) > 0;
      }

      if (active && highlight) {
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(46, 125, 50, 0.25)";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fillStyle = active ? C.blue : C.grey;
      ctx.fill();
      if (active) {
        ctx.strokeStyle = C.green;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.lineWidth = 1;
        if (highlight && animateSelect && SELECTED.includes(i)) {
          ctx.strokeStyle = "rgba(0, 229, 255, 0.8)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, 28 + Math.sin(phase * 5) * 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px Segoe UI,sans-serif";
      ctx.fillText(String(row.id), cx - 4, cy + 5);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px Consolas,monospace";
      ctx.fillText(`f=${row.f}`, cx - 16, cy + 38);
      ctx.fillText(`p=${row.p}`, cx - 16, cy + 50);
    });

    if (highlight) {
      const allShown = !animateSelect || slidePhase > SELECTED.length * 0.9 + 0.5;
      if (allShown) {
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 14px Segoe UI,sans-serif";
        ctx.fillText("Selected: {1, 2, 6}", cx0 - 58, h - 36);
        ctx.fillStyle = "#93c5fd";
        ctx.font = "12px Consolas,monospace";
        ctx.fillText("η = 2.35   P = 0.80   ✓ Feasible", cx0 - 72, h - 16);
      }
      drawHud(ctx, w, h, [
        { text: animateSelect && !allShown ? "Selecting…" : "η = 2.35", color: "#86efac" },
        { text: "P = 0.80", color: "#93c5fd" },
        { text: "Feasible: YES", color: "#4ade80" },
      ]);
    }
  }

  function drawNetwork48(ctx, w, h, state) {
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, w, h);
    const channels = state?.channels ?? 6;
    const pores = state?.poresPerChannel ?? 8;
    const xArr = state?.result?.x;
    for (let c = 0; c < channels; c++) {
      const y = 36 + c * ((h - 72) / Math.max(channels - 1, 1));
      ctx.strokeStyle = C.green;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(36, y);
      ctx.lineTo(w - 36, y);
      ctx.stroke();
      ctx.fillStyle = "#64748b";
      ctx.font = "9px Segoe UI,sans-serif";
      ctx.fillText(`C${c + 1}`, 8, y + 4);
      for (let p = 0; p < pores; p++) {
        const x = 44 + p * ((w - 88) / Math.max(pores - 1, 1));
        const idx = c * pores + p;
        const active = xArr ? xArr[idx] === 1 : false;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = active ? C.blue : C.grey;
        ctx.fill();
      }
    }
    drawHud(ctx, w, h, [{ text: `${channels}×${pores} = ${channels * pores} vars` }, { text: "2^48 search space", color: "#fde68a" }]);
  }

  function drawEnergyDrop(ctx, w, h, state) {
    ctx.fillStyle = "#0a0f1a";
    ctx.fillRect(0, 0, w, h);

    energyCounter += (energyTarget - energyCounter) * 0.025;
    const iter = Math.floor((phase * 30) % 5000);

    const padL = 48;
    const padB = 44;
    const padT = 56;
    const plotW = w - padL - 24;
    const plotH = h - padB - padT;

    ctx.fillStyle = "#1e293b";
    hudRoundRect(ctx, padL, 12, plotW, 36, 6);
    ctx.fill();
    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 11px Consolas,monospace";
    ctx.fillText(`H(x) = ${energyCounter.toFixed(3)}`, padL + 12, 34);
    ctx.fillStyle = "#64748b";
    ctx.font = "10px Segoe UI,sans-serif";
    ctx.fillText(`iter: ${iter}`, padL + plotW - 70, 34);

    ctx.strokeStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(padL, h - padB);
    ctx.lineTo(w - 16, h - padB);
    ctx.moveTo(padL, h - padB);
    ctx.lineTo(padL, padT);
    ctx.stroke();

    const points = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const x = padL + t * plotW;
      const y = padT + plotH * (1 - Math.exp(-i * 0.06) * (0.85 + 0.15 * Math.sin(phase + i * 0.1)));
      points.push({ x, y });
    }

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();
    ctx.setLineDash([]);

    const scanT = (phase * 0.4) % 1;
    const scanIdx = Math.floor(scanT * 80);
    ctx.strokeStyle = C.cyan;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.slice(0, scanIdx + 1).forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();

    const dot = points[scanIdx];
    if (dot) {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = C.cyan;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const hVal = state?.result?.hamiltonian?.toFixed(3) ?? energyCounter.toFixed(3);
    ctx.fillStyle = "#4ade80";
    ctx.font = "bold 11px Segoe UI,sans-serif";
    ctx.fillText("Energy minimization ↓", padL, h - 12);

    drawHud(ctx, w, h, [
      { text: `H(x) → ${hVal}`, color: "#86efac" },
      { text: "Exhaustive · Annealing · Ising", color: "#c4b5fd" },
    ]);
  }

  function drawVenn(ctx, w, h) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);
    [
      { x: w * 0.32, label: "Water\nRestoration", c: C.waterLight },
      { x: w * 0.5, label: "Nanoporous\nDesign", c: "#90caf9" },
      { x: w * 0.68, label: "QUBO/Ising\nOptimization", c: "#7986cb" },
    ].forEach((c) => {
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(c.x, h * 0.45, 54, 0, Math.PI * 2);
      ctx.fillStyle = c.c;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "bold 10px Segoe UI,sans-serif";
      c.label.split("\n").forEach((ln, j) => ctx.fillText(ln, c.x - 38, h * 0.4 + j * 14));
    });
  }

  function drawFuture(ctx, w, h) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#546e7a";
    ctx.fillRect(24, h * 0.35, w * 0.38, h * 0.3);
    ctx.fillStyle = C.green;
    ctx.fillRect(w * 0.52, h * 0.35, w * 0.38, h * 0.3);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px Segoe UI,sans-serif";
    ctx.fillText("PoC simulation", 36, h * 0.52);
    ctx.fillText("CFD + experiment", w * 0.54, h * 0.52);
    const t = (phase * 0.25) % 1;
    ctx.fillStyle = C.cyan;
    ctx.fillRect(w * 0.42, h * 0.48, (w * 0.1) * t, 4);
  }

  function drawProblemSplit(ctx, w, h) {
    const mid = w / 2;
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
    ctx.fillRect(mid - 1, 12, 2, h - 24);

    const gL = ctx.createLinearGradient(0, 0, 0, h);
    gL.addColorStop(0, "#01579b");
    gL.addColorStop(1, "#0277bd");
    ctx.fillStyle = gL;
    ctx.fillRect(8, 36, mid - 16, h - 48);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Segoe UI,sans-serif";
    ctx.fillText("Conventional aeration", 16, 28);
    for (let i = 0; i < 8; i++) {
      const bx = 24 + (i % 4) * ((mid - 48) / 3);
      const by = h * 0.55 - ((phase * 35 + i * 28) % (h * 0.35));
      drawNanobubble(ctx, bx, by, 6 + (i % 2), 0.55, false);
    }
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px Segoe UI,sans-serif";
    ctx.fillText("Bulk O₂ addition", 16, h - 20);

    const gR = ctx.createLinearGradient(mid, 0, w, h);
    gR.addColorStop(0, "#1b4332");
    gR.addColorStop(0.5, "#01579b");
    gR.addColorStop(1, C.sediment);
    ctx.fillStyle = gR;
    ctx.fillRect(mid + 8, 36, mid - 16, h - 48);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Segoe UI,sans-serif";
    ctx.fillText("Nanoporous delivery", mid + 16, 28);
    ctx.strokeStyle = C.green;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mid + 28, 48);
    ctx.lineTo(mid + 28, h * 0.55);
    ctx.stroke();
    for (let b = 0; b < 6; b++) {
      const bx = mid + 40 + b * ((mid - 56) / 5);
      const by = h * 0.72 - ((phase * 25 + b * 20) % 30);
      drawNanobubble(ctx, bx, by, 4, 0.9, true);
    }
    ctx.fillStyle = C.green;
    ctx.font = "9px Segoe UI,sans-serif";
    ctx.fillText("→ sediment–water IF", mid + 16, h - 20);
    drawHud(ctx, w, h, [{ text: "Problem: optimize pores", color: "#fde68a" }]);
  }

  function drawHypothesisFlow(ctx, w, h) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      const x = 28 + i * ((w - 56) / 3);
      ctx.fillStyle = "#334155";
      ctx.fillRect(x - 14, h * 0.18, 28, 28);
      ctx.beginPath();
      ctx.arc(x, h * 0.42, 12, 0, Math.PI * 2);
      ctx.fillStyle = C.blue;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "9px monospace";
      ctx.fillText(`P${i + 1}`, x - 8, h * 0.46);
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 14px monospace";
      ctx.fillText("→", x + 18, h * 0.44);
      ctx.fillStyle = C.green;
      ctx.font = "bold 11px monospace";
      ctx.fillText(`x${i + 1}`, x - 10, h * 0.68);
    }
    ctx.fillStyle = "#1e293b";
    hudRoundRect(ctx, w * 0.22, h * 0.78, w * 0.56, h * 0.16, 8);
    ctx.fill();
    ctx.strokeStyle = C.cyan;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = C.cyan;
    ctx.font = "bold 12px Consolas,monospace";
    ctx.fillText("min H(x)  —  Hamiltonian", w * 0.28, h * 0.88);
    const pulse = 0.5 + 0.5 * Math.sin(phase * 3);
    ctx.fillStyle = `rgba(0, 229, 255, ${0.2 + pulse * 0.3})`;
    ctx.fillRect(w * 0.22, h * 0.78, w * 0.56 * pulse, h * 0.16);
  }

  function drawAimPipeline(ctx, w, h) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);
    const steps = [
      { label: "Environmental\nProblem", c: C.algae },
      { label: "Nanoporous\nNetwork", c: "#455a64" },
      { label: "Binary Pore\nSelection", c: C.blue },
      { label: "QUBO/Ising\nModel", c: "#7986cb" },
      { label: "Feasible O₂\nPathway", c: C.green },
    ];
    const gap = (w - 40) / steps.length;
    steps.forEach((s, i) => {
      const cx = 20 + gap * i + gap / 2;
      ctx.beginPath();
      ctx.arc(cx, h * 0.42, 36, 0, Math.PI * 2);
      ctx.fillStyle = s.c;
      ctx.fill();
      ctx.fillStyle = "#f1f5f9";
      ctx.font = "bold 9px Segoe UI,sans-serif";
      s.label.split("\n").forEach((ln, j) => ctx.fillText(ln, cx - 34, h * 0.38 + j * 12));
      if (i < steps.length - 1) {
        const t = Math.min(1, (phase * 0.3 + i * 0.15) % 1.2);
        ctx.strokeStyle = C.cyan;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 38, h * 0.42);
        ctx.lineTo(cx + 38 + (gap - 76) * t, h * 0.42);
        ctx.stroke();
      }
    });
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Segoe UI,sans-serif";
    ctx.fillText("Aim: computable optimization framework", 14, h - 14);
  }

  function drawMethodSteps(ctx, w, h) {
    ctx.fillStyle = "#0a0f1a";
    ctx.fillRect(0, 0, w, h);
    const steps = [
      "Network Model",
      "Binary Encoding",
      "Hamiltonian",
      "Benchmark",
      "Dynamic Sim",
    ];
    const colors = [C.grey, C.blue, C.orange, C.green, "#7c3aed"];
    const stepH = (h - 48) / steps.length;
    steps.forEach((label, i) => {
      const y = 28 + i * stepH;
      const reveal = Math.min(1, slidePhase * 1.2 - i * 0.15);
      if (reveal <= 0) return;
      ctx.globalAlpha = reveal;
      ctx.fillStyle = colors[i];
      ctx.fillRect(24, y, w - 48, stepH - 8);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px Segoe UI,sans-serif";
      ctx.fillText(`${i + 1}. ${label}`, 36, y + stepH * 0.45);
      ctx.globalAlpha = 1;
      if (i < steps.length - 1 && reveal > 0.8) {
        ctx.fillStyle = C.cyan;
        ctx.beginPath();
        ctx.moveTo(w / 2, y + stepH - 6);
        ctx.lineTo(w / 2 - 6, y + stepH + 2);
        ctx.lineTo(w / 2 + 6, y + stepH + 2);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  function drawFindingsP4(ctx, w, h) {
    drawClassicalQuboComparisonTable(ctx, w, h);
  }

  const FINDINGS_COMPARE = [
    {
      approach: "Classical naive",
      sub: "top-3 by fᵢ",
      pores: "{1, 2, 4}",
      eta: "2.50",
      pres: "0.90",
      h: "−2.00",
      feasible: false,
      accent: C.red,
    },
    {
      approach: "QUBO · exhaustive",
      sub: "min H(x), 64 states",
      pores: "{1, 2, 6}",
      eta: "2.35",
      pres: "0.80",
      h: "−2.35",
      feasible: true,
      accent: C.green,
      highlight: true,
    },
    {
      approach: "QUBO · annealing",
      sub: "simulated annealing",
      pores: "{1, 2, 6}",
      eta: "2.35",
      pres: "0.80",
      h: "−2.35",
      feasible: true,
      accent: C.blue,
      highlight: true,
    },
    {
      approach: "QUBO · Ising",
      sub: "Ising-compatible search",
      pores: "{1, 2, 6}",
      eta: "2.35",
      pres: "0.80",
      h: "−2.35",
      feasible: true,
      accent: "#7c3aed",
      highlight: true,
    },
  ];

  function drawClassicalQuboComparisonTable(ctx, w, h) {
    ctx.fillStyle = "#0a0f1a";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 12px Segoe UI,sans-serif";
    ctx.fillText("Classical vs QUBO-Based — Six-Pore Benchmark", 14, 22);
    ctx.fillStyle = "#64748b";
    ctx.font = "10px Segoe UI,sans-serif";
    ctx.fillText("Pmax = 0.80  ·  K = 3  ·  search space 2⁶ = 64", 14, 38);

    const padL = 10;
    const padT = 48;
    const tableW = w - padL * 2;
    const rowH = Math.min(34, (h - padT - 52) / (FINDINGS_COMPARE.length + 1));
    const cols = [
      { label: "Approach", w: tableW * 0.28, align: "left" },
      { label: "Pores", w: tableW * 0.16, align: "center" },
      { label: "η", w: tableW * 0.1, align: "center" },
      { label: "P", w: tableW * 0.1, align: "center" },
      { label: "H(x)", w: tableW * 0.12, align: "center" },
      { label: "OK?", w: tableW * 0.1, align: "center" },
    ];

    let x = padL;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(padL, padT, tableW, rowH);
    ctx.strokeStyle = "#334155";
    ctx.strokeRect(padL, padT, tableW, rowH);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 9px Segoe UI,sans-serif";
    cols.forEach((col) => {
      const tx = col.align === "center" ? x + col.w / 2 : x + 6;
      ctx.textAlign = col.align === "center" ? "center" : "left";
      ctx.fillText(col.label, tx, padT + rowH * 0.62);
      x += col.w;
    });
    ctx.textAlign = "left";

    FINDINGS_COMPARE.forEach((row, ri) => {
      const y = padT + rowH * (ri + 1);
      const pulse = row.highlight && Math.sin(phase * 3 + ri) > 0.3;
      ctx.fillStyle = row.highlight
        ? pulse ? "rgba(46, 125, 50, 0.22)" : "rgba(46, 125, 50, 0.12)"
        : ri % 2 === 0 ? "#0f172a" : "#111827";
      ctx.fillRect(padL, y, tableW, rowH);
      ctx.strokeStyle = row.highlight ? row.accent : "#1e293b";
      ctx.lineWidth = row.highlight ? 1.5 : 1;
      ctx.strokeRect(padL, y, tableW, rowH);
      ctx.lineWidth = 1;

      x = padL;
      const cells = [
        { text: row.approach, sub: row.sub, w: cols[0].w, align: "left", color: row.accent },
        { text: row.pores, w: cols[1].w, align: "center", color: "#e2e8f0", mono: true },
        { text: row.eta, w: cols[2].w, align: "center", color: "#86efac", mono: true },
        { text: row.pres, w: cols[3].w, align: "center", color: row.feasible ? "#93c5fd" : "#f87171", mono: true },
        { text: row.h, w: cols[4].w, align: "center", color: "#c4b5fd", mono: true },
        { text: row.feasible ? "✓" : "✗", w: cols[5].w, align: "center", color: row.feasible ? "#4ade80" : "#f87171", bold: true },
      ];
      cells.forEach((cell) => {
        ctx.fillStyle = cell.color;
        ctx.font = (cell.bold ? "bold " : "") + (cell.mono ? "10px Consolas,monospace" : "bold 9px Segoe UI,sans-serif");
        const tx = cell.align === "center" ? x + cell.w / 2 : x + 6;
        ctx.textAlign = cell.align === "center" ? "center" : "left";
        ctx.fillText(cell.text, tx, y + rowH * 0.55);
        if (cell.sub) {
          ctx.fillStyle = "#64748b";
          ctx.font = "8px Segoe UI,sans-serif";
          ctx.fillText(cell.sub, x + 6, y + rowH * 0.82);
        }
        x += cell.w;
      });
      ctx.textAlign = "left";
    });

    const noteY = padT + rowH * (FINDINGS_COMPARE.length + 1) + 10;
    ctx.fillStyle = "#fde68a";
    ctx.font = "9px Segoe UI,sans-serif";
    ctx.fillText("Naive classical picks {1,2,4} → P exceeds Pmax", padL + 4, noteY);
    ctx.fillStyle = "#86efac";
    ctx.fillText("QUBO solvers agree on feasible optimum {1, 2, 6}", padL + 4, noteY + 14);

    drawMiniPoreStrip(ctx, w - 118, h - 36, SELECTED);
  }

  function drawMiniPoreStrip(ctx, x, y, selected) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    hudRoundRect(ctx, x, y - 22, 108, 28, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px Segoe UI,sans-serif";
    ctx.fillText("QUBO optimum", x + 6, y - 10);
    BENCHMARK.forEach((row, i) => {
      const px = x + 8 + i * 16;
      const on = selected.includes(i);
      ctx.beginPath();
      ctx.arc(px, y + 4, 5, 0, Math.PI * 2);
      ctx.fillStyle = on ? C.blue : "#475569";
      ctx.fill();
      if (on) {
        ctx.strokeStyle = C.green;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineWidth = 1;
      }
    });
  }

  function drawInterpretationCompare(ctx, w, h) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);
    const pw = (w - 36) / 2;
    [
      { x: 12, title: "Naive selection", sub: "highest fᵢ only", sel: [0, 1, 3], c: C.red },
      { x: 24 + pw, title: "QUBO selection", sub: "η · P · continuity", sel: SELECTED, c: C.green },
    ].forEach((panel) => {
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(panel.x, 28, pw, h - 44);
      ctx.strokeStyle = panel.c;
      ctx.lineWidth = 2;
      ctx.strokeRect(panel.x, 28, pw, h - 44);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px Segoe UI,sans-serif";
      ctx.fillText(panel.title, panel.x + 10, 48);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px Segoe UI,sans-serif";
      ctx.fillText(panel.sub, panel.x + 10, 62);
      BENCHMARK.forEach((row, i) => {
        const cx = panel.x + 20 + (i % 3) * ((pw - 40) / 2);
        const cy = 90 + Math.floor(i / 3) * 36;
        const active = panel.sel.includes(i);
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fillStyle = active ? panel.c : "#475569";
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "8px monospace";
        ctx.fillText(String(row.id), cx - 3, cy + 3);
      });
    });
    ctx.fillStyle = panelFlash(phase) ? C.green : "#64748b";
    ctx.font = "bold 10px Segoe UI,sans-serif";
    ctx.fillText("QUBO balances network effects →", w / 2 - 90, h - 12);
  }

  function panelFlash(p) {
    return Math.sin(p * 4) > 0;
  }

  function drawDiscussionLayers(ctx, w, h) {
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, w, h);
    const layers = [
      { label: "Physical System", c: "#546e7a", y: 0.12 },
      { label: "CFD / Experimental Data", c: "#0288d1", y: 0.28 },
      { label: "QUBO Model", c: C.blue, y: 0.44 },
      { label: "Optimization Solver", c: "#7c3aed", y: 0.6 },
      { label: "Feasible Architecture", c: C.green, y: 0.76 },
    ];
    layers.forEach((L, i) => {
      const ly = h * L.y;
      const lh = h * 0.12;
      ctx.fillStyle = L.c;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(32, ly, w - 64, lh);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px Segoe UI,sans-serif";
      ctx.fillText(L.label, 44, ly + lh * 0.55);
      if (i < layers.length - 1) {
        const t = Math.min(1, (phase * 0.2 + i * 0.12) % 1);
        ctx.strokeStyle = C.cyan;
        ctx.beginPath();
        ctx.moveTo(w / 2, ly + lh);
        ctx.lineTo(w / 2, ly + lh + (h * 0.04) * t);
        ctx.stroke();
      }
    });
    ctx.fillStyle = "#f87171";
    ctx.font = "9px Segoe UI,sans-serif";
    ctx.fillText("No quantum advantage claimed", 32, h - 10);
  }

  function drawConclusionPipeline(ctx, w, h) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);
    const nodes = ["Problem", "QUBO", "Feasible Path", "CFD / Lab"];
    const colors = [C.red, C.blue, C.green, C.orange];
    nodes.forEach((label, i) => {
      const x = 40 + i * ((w - 80) / (nodes.length - 1));
      ctx.beginPath();
      ctx.arc(x, h * 0.45, 28, 0, Math.PI * 2);
      ctx.fillStyle = colors[i];
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px Segoe UI,sans-serif";
      ctx.fillText(label, x - (label.length > 6 ? 28 : 18), h * 0.48);
      if (i < nodes.length - 1) {
        const nx = 40 + (i + 1) * ((w - 80) / (nodes.length - 1));
        const prog = Math.min(1, (phase * 0.25 + i * 0.2) % 1.1);
        ctx.strokeStyle = C.cyan;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 30, h * 0.45);
        ctx.lineTo(x + 30 + (nx - x - 60) * prog, h * 0.45);
        ctx.stroke();
      }
    });
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Segoe UI,sans-serif";
    ctx.fillText("Contribution: optimization framework, not quantum superiority", 14, h - 16);
  }

  function drawTitleHero(ctx, w, h, state) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#1e3a5f");
    g.addColorStop(1, "#0f172a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    drawQUBOGraphPres(ctx, w, h * 0.58, state);
    for (let i = 0; i < 12; i++) {
      const bx = 30 + i * ((w - 60) / 11);
      const by = h * 0.82 - ((phase * 40 + i * 30) % 40);
      drawNanobubble(ctx, bx, by, 5 + (i % 3), 0.8, true);
    }
    drawHud(ctx, w, h, [
      { text: "ICTEA 2026 · QUBO teaching demo", color: "#93c5fd" },
      { text: "Six-pore benchmark + 6×8 network", color: "#86efac" },
    ]);
  }

  function drawMathCanvas(ctx, w, h, title, lines, accent) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = accent || "#38bdf8";
    ctx.font = "bold 11px Segoe UI,sans-serif";
    ctx.fillText(title, 14, 22);
    ctx.strokeStyle = accent || "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, 28);
    ctx.lineTo(w - 14, 28);
    ctx.stroke();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "11px Consolas, monospace";
    lines.forEach((line, i) => {
      ctx.fillText(line, 16, 48 + i * 17);
    });
  }

  function drawConceptGlossaryQUBO(ctx, w, h) {
    drawMathCanvas(ctx, w, h, "Binary design space", [
      "x = (x1, x2, ..., xn)   xi in {0, 1}",
      "",
      "|Omega| = 2^n configurations",
      "n=6  -> 64 states (exhaustive OK)",
      "n=48 -> 2^48 states (use SA)",
    ], "#4ade80");
    for (let i = 0; i < 6; i++) {
      const x = 24 + i * ((w - 48) / 5);
      const on = i === 0 || i === 1 || i === 5;
      ctx.beginPath();
      ctx.arc(x, h - 36, 14, 0, Math.PI * 2);
      ctx.fillStyle = on ? C.blue : "#475569";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px monospace";
      ctx.fillText(on ? "1" : "0", x - 4, h - 32);
    }
    ctx.fillStyle = "#94a3b8";
    ctx.font = "9px Segoe UI,sans-serif";
    ctx.fillText("example pattern x = (1,1,0,0,0,1)", 14, h - 10);
  }

  function drawConceptGlossaryHamiltonian(ctx, w, h) {
    drawMathCanvas(ctx, w, h, "H(x) structure", [
      "H = flow + hyd + P_pen + K_pen + C",
      "flow  = - sum fi*xi        (reward)",
      "hyd   = sum qij*xi*xj      (coupling)",
      "P_pen = lp * max(0,P-Pmax)^2",
      "K_pen = lk * max(0,sum xi-K)^2",
    ], "#f472b6");
    const bars = [
      { l: "flow", v: -2.35, c: C.green },
      { l: "P_pen", v: 0, c: C.red },
      { l: "K_pen", v: 0, c: C.orange },
    ];
    bars.forEach((b, i) => {
      const bx = 20 + i * (w / 3.5);
      const bh = Math.abs(b.v) * 18 + 8;
      ctx.fillStyle = b.c;
      ctx.fillRect(bx, h - 50 - bh, w / 4, bh);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "8px Segoe UI,sans-serif";
      ctx.fillText(b.l, bx, h - 18);
    });
  }

  function drawConceptGlossaryIsingSolvers(ctx, w, h) {
    drawMathCanvas(ctx, w, h, "Ising & observables", [
      "xi = (1 + si) / 2,   si in {-1, +1}",
      "eta(x) = sum fi*xi",
      "P(x)   = sum pi*xi",
      "feasible: P <= Pmax and sum xi <= K",
    ], "#a78bfa");
    ctx.fillStyle = "#64748b";
    ctx.font="9px Segoe UI,sans-serif";
    ctx.fillText("Solver scaling (relative)", 14, h * 0.52);
    const xs = [0.2, 0.5, 0.8];
    const hs = [0.85, 0.35, 0.4];
    const labs = ["2^n", "SA", "Ising"];
    xs.forEach((xr, i) => {
      const bx = xr * w;
      const barH = hs[i] * (h * 0.28);
      ctx.fillStyle = i === 0 ? C.red : i === 1 ? C.blue : "#7c3aed";
      ctx.fillRect(bx - 22, h * 0.78 - barH, 44, barH);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(labs[i], bx - 12, h * 0.82);
    });
  }

  const drawers = [
    (c, w, h, s) => drawTitleHero(c, w, h, s),
    drawProblemSplit,
    drawHypothesisFlow,
    drawAimPipeline,
    drawMethodSteps,
    (c, w, h, s) => drawQUBOBoxes(c, w, h, s),
    drawLake,
    drawBubbles,
    drawPoresQuestion,
    drawScientificSection,
    drawBinaryMap,
    (c, w, h, s) => drawQUBOBoxes(c, w, h, s),
    drawSpinFlip,
    drawBenchmarkTable,
    (c, w, h) => drawSixPore(c, w, h, true, true),
    (c, w, h) => {
      drawSixPore(c, w, h, false, false);
      drawHud(c, w, h, [
        { text: "P4: f=0.85  p=0.35 ⚠", color: "#f87171" },
        { text: "Excluded: pressure", color: "#fde68a" },
      ]);
    },
    (c, w, h, s) => drawQUBOGraphPres(c, w, h, s),
    (c, w, h, s) => drawEnergyDrop(c, w, h, s),
    drawVenn,
    drawFuture,
    drawFindingsP4,
    drawInterpretationCompare,
    drawDiscussionLayers,
    drawConclusionPipeline,
    drawConceptGlossaryQUBO,
    drawConceptGlossaryHamiltonian,
    drawConceptGlossaryIsingSolvers,
  ];

  function drawSlide(canvas, slideIndex, state) {
    if (!canvas) return;
    const { ctx, w, h } = setupCanvas(canvas);
    ctx.clearRect(0, 0, w, h);
    const fn = drawers[slideIndex] || drawers[0];
    fn(ctx, w, h, state);
  }

  function tick() {
    phase += 0.028;
    slidePhase += 0.018;
  }

  function onSlideChange(idx) {
    currentSlide = idx;
    slidePhase = 0;
    energyCounter = -1.2;
    if (idx === 17) energyCounter = -0.5;
  }

  function getHudForSlide(slideIndex) {
    const hudMap = {
      1: [{ l: "Problem → optimize delivery" }],
      4: [{ l: "5-step pipeline" }],
      6: [{ l: "DO: 8.5 → 1.2 mg/L" }],
      7: [{ l: "~100 nm · slow rise" }],
      8: [{ l: "Optimal subset?" }],
      9: [{ l: "O₂ → IF target" }],
      10: [{ l: "xᵢ ∈ {0,1}" }],
      13: [{ l: "64 states · Pmax=0.80" }],
      14: [{ l: "{1,2,6} · η=2.35" }],
      16: [{ l: "48 QUBO variables" }],
      17: [{ l: "H(x) minimizing…" }],
      20: [{ l: "Classical vs QUBO table" }],
      21: [{ l: "Naive vs QUBO" }],
      23: [{ l: "Final conclusion" }],
      24: [{ l: "Concept: QUBO & binary x" }],
      25: [{ l: "Concept: H(x) terms" }],
      26: [{ l: "Concept: Ising & solvers" }],
    };
    return hudMap[slideIndex] || [];
  }

  return { drawSlide, tick, getHudForSlide, stateHud, onSlideChange };
})();
