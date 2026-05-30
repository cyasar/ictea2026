/** Multilingual presentation — visuals + live simulation split */
const Presentation = (function () {
  const STORAGE_KEY = "ictea2026-hub-lang";
  const TRANS_MS = 480;
  let overlay;
  let container;
  let notesPanel;
  let notesBody;
  let notesTitle;
  let notesSlideLabel;
  let notesLangHint;
  let simPanel;
  let notesVisible = false;
  let simMode = false;
  let slides = [];
  let index = 0;
  let currentLang = "en";
  let animFrame = null;
  let transitionTimer = null;
  let onExit;
  let getAppState = () => ({});

  function t() {
    return window.PRES_I18N?.[currentLang] || window.PRES_I18N.en;
  }

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  function slideHTML(slide, i, pack, total) {
    const isTitle = i === 0;
    let text = "";
    if (slide.appendix) {
      text += `<p class="pres-appendix-label">${pack.ui.conceptReading || "Concept reading"}</p>`;
    }
    if (isTitle) {
      text += `<h2 class="pres-paper-title">${slide.title}</h2>`;
      if (slide.subtitle) text += `<p class="pres-subtitle">${slide.subtitle}</p>`;
      text += `<p class="pres-slide-authors">${pack.ui.authorsSlide}</p>`;
    } else {
      text += `<h2>${slide.title}</h2>`;
      if (slide.math?.length) {
        text += '<div class="pres-math-block">';
        slide.math.forEach((line) => { text += `<p class="pres-math-line">${line}</p>`; });
        text += "</div>";
      }
      if (slide.body?.length) {
        text += '<ul class="pres-bullets">';
        slide.body.forEach((line) => { text += `<li>${line}</li>`; });
        text += "</ul>";
      }
    }
    if (slide.footer) text += `<p class="pres-slide-authors pres-footer-authors">${pack.ui.authorsFooter}</p>`;

    return `
      <div class="pres-slide-inner ${isTitle ? "pres-slide-title" : ""}">
        <div class="pres-text-col">${text}</div>
        <div class="pres-visual-col">
          <canvas class="pres-visual-canvas" data-slide-idx="${i}"></canvas>
          <div class="pres-visual-hud" aria-live="polite"></div>
        </div>
      </div>`;
  }

  function renderSlides() {
    const pack = t();
    container.innerHTML = "";
    pack.slides.forEach((slide, i) => {
      const el = document.createElement("div");
      el.className = "pres-slide" + (i === index ? " active" : "");
      el.dataset.slide = String(i);
      el.dataset.note = slide.note || "";
      el.innerHTML = slideHTML(slide, i, pack, pack.slides.length);
      container.appendChild(el);
    });
    slides = [...container.querySelectorAll(".pres-slide")];
    buildThumbnails();
  }

  function applyUI() {
    const ui = t().ui;
    document.getElementById("pres-close").textContent = ui.exit;
    document.getElementById("pres-prev").textContent = ui.prev;
    document.getElementById("pres-next").textContent = ui.next;
    document.getElementById("pres-notes-btn").textContent = notesVisible ? ui.notesHide : ui.speakerNotes;
    document.getElementById("pres-sim-btn").textContent = simMode ? ui.backToSlides : ui.liveSimulation;
    document.getElementById("pres-run-btn").textContent = ui.runOptimization;
    const simTitle = overlay.querySelector(".pres-sim-title");
    if (simTitle) simTitle.textContent = ui.liveSimulation;
    const simHint = overlay.querySelector(".pres-sim-hint");
    if (simHint && !simMode) {
      simHint.innerHTML = `${ui.simHint} · <kbd>S</kbd> · <kbd>N</kbd> · <kbd>F11</kbd>`;
    }
    overlay.querySelector(".pres-authors").innerHTML = ui.authorsTop;
    document.querySelectorAll(".pres-lang-label").forEach((el) => { el.textContent = ui.langLabel; });
    if (notesTitle) notesTitle.textContent = ui.speakerNotes || "Presenter View";
    if (notesLangHint) notesLangHint.textContent = ui.notesLangHint || "";
    updateNotes();
  }

  function setLanguage(lang) {
    if (!window.PRES_I18N[lang]) lang = "en";
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    const prevIndex = index;
    renderSlides();
    applyUI();
    show(prevIndex, 0);
  }

  function drawActiveVisuals() {
    PresVisuals.tick();
    const state = getAppState();
    slides.forEach((slide, i) => {
      const canvas = slide.querySelector(".pres-visual-canvas");
      if (canvas && i === index) PresVisuals.drawSlide(canvas, i, state);
      if (i === index) updateSlideHud(slide, i, state);
    });
    if (simMode) {
      const liveMain = document.getElementById("pres-live-main");
      const liveQubo = document.getElementById("pres-live-qubo");
      if (liveMain) Viz.drawMain(liveMain, { ...state, channels: state.channels || 6, poresPerChannel: state.poresPerChannel || 8 });
      if (liveQubo) Viz.drawQUBOGraph(liveQubo, state);
      updateSimMetrics(state);
    }
  }

  function updateSlideHud(slide, slideIndex, state) {
    const hud = slide.querySelector(".pres-visual-hud");
    if (!hud) return;
    const extra = PresVisuals.getHudForSlide(slideIndex);
    const lines = PresVisuals.stateHud(state);
    const r = state?.result;
    let html = "";
    extra.forEach((e) => { html += `<span>${e.l}</span>`; });
    if (r && slideIndex >= 11) {
      lines.slice(-4).forEach((ln) => {
        html += `<span style="color:${ln.color || "#cbd5e1"}">${ln.text}</span>`;
      });
    }
    if (slideIndex === 8 && !r) {
      html += `<span class="pres-metric-hint">S → Run Optimization</span>`;
    }
    hud.innerHTML = html;
  }

  function updateSimMetrics(state) {
    const r = state?.result;
    const p = state?.params || {};
    const el = document.getElementById("pres-sim-metrics");
    if (!el) return;
    const ui = t().ui;
    const c = state?.channels ?? 6;
    const pp = state?.poresPerChannel ?? 8;
    let html = `
      <span><b>n</b> ${c}×${pp}=${c * pp}</span>
      <span><b>Pmax</b> ${(p.pmax ?? 0.8).toFixed(2)}</span>
      <span><b>K</b> ${p.kActive ?? 3}</span>`;
    if (r) {
      html += `
      <span><b>H(x)</b> ${r.hamiltonian?.toFixed(3)}</span>
      <span><b>η</b> ${r.total_efficiency?.toFixed(2)}</span>
      <span><b>P</b> ${r.total_pressure?.toFixed(2)}</span>
      <span><b>${ui.active || "Active"}</b> {${(r.active_pores || []).join(",")}}</span>
      <span><b>${ui.feasible || "OK"}</b> ${r.feasible ? "✓" : "✗"}</span>`;
    } else {
      html += `<span class="pres-metric-hint">${ui.simHint || "Run Optimization"}</span>`;
    }
    el.innerHTML = html;
  }

  function startAnimLoop() {
    stopAnimLoop();
    function loop() {
      if (overlay.classList.contains("active")) drawActiveVisuals();
      animFrame = requestAnimationFrame(loop);
    }
    loop();
  }

  function stopAnimLoop() {
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = null;
  }

  function requestFullscreen() {
    const el = overlay;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) {
      req.call(el).catch(() => {
        overlay.classList.add("pres-fullscreen");
      });
    } else {
      overlay.classList.add("pres-fullscreen");
    }
  }

  function exitFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exit) exit.call(document).catch(() => {});
    }
    overlay.classList.remove("pres-fullscreen");
  }

  function show(i, direction) {
    const prev = index;
    const next = Math.max(0, Math.min(i, slides.length - 1));
    const dir = direction ?? (next > prev ? 1 : next < prev ? -1 : 0);

    if (transitionTimer) clearTimeout(transitionTimer);

    if (dir !== 0 && slides[prev] && slides[next] && prev !== next) {
      slides[prev].classList.remove("active");
      slides[prev].classList.add(dir > 0 ? "exit-left" : "exit-right");
      slides[next].classList.add(dir > 0 ? "enter-from-right" : "enter-from-left");
      slides[next].classList.add("active");

      transitionTimer = setTimeout(() => {
        slides.forEach((s, j) => {
          s.classList.remove("exit-left", "exit-right", "enter-from-right", "enter-from-left");
          if (j !== next) s.classList.remove("active");
        });
        slides[next]?.classList.add("active");
      }, TRANS_MS);
    } else {
      slides.forEach((s, j) => s.classList.toggle("active", j === next));
    }

    index = next;
    document.getElementById("pres-counter").textContent = `${index + 1} / ${slides.length}`;
    const bar = document.getElementById("pres-progress-bar");
    if (bar) bar.style.width = `${((index + 1) / slides.length) * 100}%`;
    updateNotes();
    document.querySelectorAll(".pres-thumb").forEach((thumb, j) => {
      thumb.classList.toggle("active", j === index);
    });
    PresVisuals.onSlideChange(index);
    requestAnimationFrame(() => drawActiveVisuals());
  }

  function updateNotes() {
    if (!notesBody || !slides[index]) return;
    notesBody.textContent = slides[index].dataset.note || "";
    const ui = t().ui;
    if (notesSlideLabel) {
      notesSlideLabel.textContent = `${ui.slideCounter || "Slide"} ${index + 1} / ${slides.length}`;
    }
  }

  function toggleNotes() {
    notesVisible = !notesVisible;
    notesPanel.classList.toggle("open", notesVisible);
    notesPanel.setAttribute("aria-hidden", notesVisible ? "false" : "true");
    applyUI();
  }

  function toggleSimMode() {
    simMode = !simMode;
    overlay.classList.toggle("pres-split-sim", simMode);
    applyUI();
    if (simMode) drawActiveVisuals();
  }

  function go(delta) {
    if (simMode) toggleSimMode();
    show(index + delta, delta);
  }

  function onKey(e) {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "ArrowRight" || e.key === " ") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "Escape") {
      if (notesVisible) toggleNotes();
      else if (simMode) toggleSimMode();
      else exit();
    } else if (e.key === "n" || e.key === "N") toggleNotes();
    else if (e.key === "s" || e.key === "S") toggleSimMode();
    else if (e.key === "f" || e.key === "F") {
      if (document.fullscreenElement) exitFullscreen();
      else requestFullscreen();
    }
  }

  function enter() {
    overlay.classList.add("active");
    simMode = false;
    notesVisible = false;
    notesPanel.classList.remove("open");
    notesPanel.setAttribute("aria-hidden", "true");
    overlay.classList.remove("pres-split-sim");
    setLanguage(getLang());
    show(0, 0);
    startAnimLoop();
    updateSimMetrics(getAppState());
    requestFullscreen();
  }

  function exit() {
    exitFullscreen();
    overlay.classList.remove("active", "pres-split-sim", "pres-fullscreen");
    simMode = false;
    notesVisible = false;
    notesPanel.classList.remove("open");
    notesPanel.setAttribute("aria-hidden", "true");
    stopAnimLoop();
    if (onExit) onExit();
  }

  function buildThumbnails() {
    const strip = document.getElementById("pres-thumb-strip");
    if (!strip) return;
    strip.innerHTML = "";
    slides.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pres-thumb" + (i === index ? " active" : "");
      btn.textContent = String(i + 1);
      btn.title = `Slide ${i + 1}`;
      btn.addEventListener("click", () => {
        if (simMode) toggleSimMode();
        show(i, i > index ? 1 : i < index ? -1 : 0);
      });
      strip.appendChild(btn);
    });
  }

  function init() {
    overlay = document.getElementById("presentation");
    container = document.getElementById("pres-slides-container");
    notesPanel = document.getElementById("pres-notes-panel");
    notesBody = document.getElementById("pres-notes-body");
    notesTitle = document.getElementById("pres-notes-title");
    notesSlideLabel = document.getElementById("pres-notes-slide-label");
    notesLangHint = document.getElementById("pres-notes-lang-hint");
    simPanel = document.getElementById("pres-sim-panel");

    document.getElementById("pres-close").addEventListener("click", exit);
    document.getElementById("pres-prev").addEventListener("click", () => go(-1));
    document.getElementById("pres-next").addEventListener("click", () => go(1));
    document.getElementById("pres-notes-btn").addEventListener("click", toggleNotes);
    document.getElementById("pres-sim-btn").addEventListener("click", toggleSimMode);
    document.getElementById("pres-run-btn").addEventListener("click", () => {
      if (window.AppBridge?.runOptimization) window.AppBridge.runOptimization();
    });
    document.querySelectorAll(".pres-lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });
    document.addEventListener("keydown", onKey);
  }

  function setStateProvider(fn) {
    getAppState = fn;
  }

  function setOnExit(fn) {
    onExit = fn;
  }

  return { init, enter, exit, setOnExit, setLanguage, setStateProvider, toggleSimMode };
})();
