/** Main application controller. */
(function () {
  const state = {
    data: null,
    channels: 6,
    poresPerChannel: 8,
    result: null,
    params: {},
  };

  const els = {
    channels: document.getElementById("channels"),
    pores: document.getElementById("pores"),
    pmax: document.getElementById("pmax"),
    kActive: document.getElementById("k-active"),
    lambdaP: document.getElementById("lambda-p"),
    lambdaK: document.getElementById("lambda-k"),
    lambdaC: document.getElementById("lambda-c"),
    method: document.getElementById("method"),
    benchmark: document.getElementById("use-benchmark"),
    seed: document.getElementById("seed"),
    status: document.getElementById("status-bar"),
    resH: document.getElementById("res-h"),
    resEff: document.getElementById("res-eff"),
    resPres: document.getElementById("res-pres"),
    resActive: document.getElementById("res-active"),
    resFeasible: document.getElementById("res-feasible"),
    resSpace: document.getElementById("res-space"),
    resRuntime: document.getElementById("res-runtime"),
    feasibleMetric: document.getElementById("feasible-metric"),
  };

  const canvases = {
    main: document.getElementById("main-canvas"),
    section: document.getElementById("section-canvas"),
    topview: document.getElementById("topview-canvas"),
    qubo: document.getElementById("qubo-canvas"),
    energy: document.getElementById("energy-canvas"),
  };

  function getParams() {
    return {
      pmax: parseFloat(els.pmax.value),
      kActive: parseInt(els.kActive.value, 10),
      lambdaP: parseFloat(els.lambdaP.value),
      lambdaK: parseFloat(els.lambdaK.value),
      lambdaC: parseFloat(els.lambdaC.value),
    };
  }

  function buildData() {
    if (els.benchmark.checked) {
      state.data = QUBOSim.sixPoreBenchmark();
      state.channels = 6;
      state.poresPerChannel = 1;
      els.channels.value = 6;
      els.pores.value = 1;
      els.kActive.value = 3;
      els.pmax.value = 0.8;
    } else {
      state.channels = parseInt(els.channels.value, 10);
      state.poresPerChannel = parseInt(els.pores.value, 10);
      const seed = parseInt(els.seed.value, 10) || 42;
      state.data = QUBOSim.generateNetwork(state.channels, state.poresPerChannel, seed);
    }
  }

  function updateResults(result) {
    state.result = result;
    els.resH.textContent = result.hamiltonian.toFixed(4);
    els.resEff.textContent = result.total_efficiency.toFixed(3);
    els.resPres.textContent = result.total_pressure.toFixed(3);
    els.resActive.textContent = result.active_pores.join(", ") || "—";
    els.resFeasible.textContent = result.feasible ? "Yes" : "No";
    els.feasibleMetric.className = "metric " + (result.feasible ? "feasible-yes" : "feasible-no");
    els.resSpace.textContent = result.search_space >= 1e6
      ? result.search_space.toExponential(2)
      : String(result.search_space);
    els.resRuntime.textContent = (result.runtime * 1000).toFixed(1);
    Viz.drawEnergy(canvases.energy, result.energy_history);
    if (window.AppBridge?.onResult) window.AppBridge.onResult(result);
  }

  function runOptimization() {
    buildData();
    state.params = getParams();
    const n = state.data.efficiency.length;
    const method = els.method.value;

    if (method === "exhaustive" && n > QUBOSim.EXHAUSTIVE_MAX_N) {
      els.status.textContent = `Exhaustive search disabled for n=${n}. Use simulated annealing or Ising search.`;
      return;
    }

    els.status.textContent = "Running optimization… energy decreasing…";
    state.result = null;

    setTimeout(() => {
      try {
        const result = QUBOSim.run(method, state.data, state.params, parseInt(els.seed.value, 10) || 42);
        updateResults(result);
        els.status.textContent = `Done — ${result.method}, ${result.active_count} active pore(s), feasible ${result.feasible ? "yes" : "no"}.`;
      } catch (err) {
        els.status.textContent = err.message;
      }
    }, 300);
  }

  function resetDefaults() {
    els.channels.value = 6;
    els.pores.value = 8;
    els.pmax.value = 0.8;
    els.kActive.value = 3;
    els.lambdaP.value = 50;
    els.lambdaK.value = 50;
    els.lambdaC.value = 5;
    els.method.value = "simulated_annealing";
    els.benchmark.checked = false;
    els.seed.value = 42;
    state.result = null;
    buildData();
    Viz.drawEnergy(canvases.energy, []);
    ["res-h", "res-eff", "res-pres", "res-active", "res-feasible", "res-space", "res-runtime"].forEach((id) => {
      document.getElementById(id).textContent = "—";
    });
    els.status.textContent = "Reset to defaults.";
  }

  function exportResults() {
    if (!state.result) {
      alert("Run optimization first.");
      return;
    }
    const payload = {
      timestamp: new Date().toISOString(),
      authors: window.PROJECT_AUTHORS?.authorsLine || "Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Yazılım Geliştirme)",
      channels: state.channels,
      pores_per_channel: state.poresPerChannel,
      params: state.params,
      result: state.result,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qubo_nanopore_results.json";
    a.click();
  }

  function setupColabLinks() {
    const cfg = window.DEMO_LINKS || {};
    const url = cfg.colabTeaching;
    const valid = url && url !== "YOUR_COLAB_NOTEBOOK_URL";
    const targets = [
      document.getElementById("btn-teaching"),
      document.getElementById("teaching-link-inline"),
    ];
    targets.forEach((el) => {
      if (!el) return;
      if (valid) {
        el.href = url;
      } else {
        el.href = "#";
        el.addEventListener("click", (e) => {
          e.preventDefault();
          alert("Upload teaching_mode_colab.ipynb to Google Colab and set the link in config/links.js");
        });
      }
    });
  }

  document.getElementById("btn-run").addEventListener("click", runOptimization);
  document.getElementById("btn-reset").addEventListener("click", resetDefaults);
  document.getElementById("btn-export").addEventListener("click", exportResults);

  document.getElementById("btn-presentation").addEventListener("click", () => {
    document.getElementById("btn-presentation").classList.add("active");
    document.getElementById("btn-simulation").classList.remove("active");
    Presentation.enter();
  });

  document.getElementById("btn-simulation").addEventListener("click", () => {
    document.getElementById("btn-simulation").classList.add("active");
    document.getElementById("btn-presentation").classList.remove("active");
    if (document.getElementById("presentation").classList.contains("active")) {
      Presentation.exit();
    }
  });

  Presentation.init();
  Presentation.setStateProvider(() => ({
    ...state,
    channels: state.channels,
    poresPerChannel: state.poresPerChannel,
    params: getParams(),
  }));
  window.AppBridge = {
    getState: () => ({ ...state, params: getParams() }),
    runOptimization,
    onResult: null,
  };
  window.AppBridge.onResult = () => {
    if (document.getElementById("presentation").classList.contains("active")) {
      /* presentation loop refreshes metrics */
    }
  };
  Presentation.setOnExit(() => {
    document.getElementById("btn-simulation").classList.add("active");
    document.getElementById("btn-presentation").classList.remove("active");
  });

  els.benchmark.addEventListener("change", () => {
    if (els.benchmark.checked) {
      els.method.value = "exhaustive";
    }
    buildData();
  });

  els.channels.addEventListener("change", buildData);
  els.pores.addEventListener("change", buildData);

  buildData();
  state.params = getParams();
  setupColabLinks();
  if (window.PROJECT_AUTHORS) {
    const line = window.PROJECT_AUTHORS.authorsLine;
    document.querySelectorAll(".authors-line").forEach((el) => { el.textContent = line; });
    const fullTitle = window.PROJECT_AUTHORS.title;
    document.querySelectorAll(".paper-title").forEach((el) => { el.textContent = fullTitle; });
  }
  Viz.startAnimation(canvases, () => state);

  window.addEventListener("resize", () => {
    if (state.result) Viz.drawEnergy(canvases.energy, state.result.energy_history);
  });
})();
