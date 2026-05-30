/** Client-side QUBO model and optimizers (mirrors backend).
 * Authors: Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Yazılım Geliştirme)
 */
const QUBOSim = (function () {
  const EXHAUSTIVE_MAX_N = 20;

  function sixPoreBenchmark() {
    const efficiency = [0.90, 0.75, 0.60, 0.85, 0.50, 0.70];
    const pressure = [0.30, 0.25, 0.20, 0.35, 0.15, 0.25];
    const n = efficiency.length;
    const interaction = Array.from({ length: n }, () => Array(n).fill(0));
    return { efficiency, pressure, interaction, channelIds: null };
  }

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function generateNetwork(channels, poresPerChannel, seed) {
    const rng = mulberry32(seed);
    const n = channels * poresPerChannel;
    const efficiency = Array.from({ length: n }, () => 0.45 + rng() * 0.5);
    const pressure = Array.from({ length: n }, () => 0.1 + rng() * 0.3);
    const channelIds = [];
    for (let c = 0; c < channels; c++) {
      for (let p = 0; p < poresPerChannel; p++) channelIds.push(c);
    }
    const interaction = Array.from({ length: n }, () => Array(n).fill(0));
    for (let c = 0; c < channels; c++) {
      const start = c * poresPerChannel;
      for (let i = start; i < start + poresPerChannel - 1; i++) {
        const v = 0.01 + rng() * 0.05;
        interaction[i][i + 1] = interaction[i + 1][i] = v;
      }
      if (c > 0) {
        const v = 0.02 + rng() * 0.03;
        interaction[start][start - 1] = interaction[start - 1][start] = v;
      }
    }
    return { efficiency, pressure, interaction, channelIds, channels, poresPerChannel };
  }

  function continuityPenalty(x, channelIds) {
    if (!channelIds) return 0;
    const active = new Set();
    channelIds.forEach((ch, i) => { if (x[i]) active.add(ch); });
    const allCh = [...new Set(channelIds)];
    let pen = 0;
    allCh.forEach((ch) => {
      if (!active.has(ch)) {
        if (active.has(ch - 1) || active.has(ch + 1)) pen += 1;
      }
    });
    return pen;
  }

  function hamiltonian(x, data, params) {
    const n = data.efficiency.length;
    let flow = 0;
    let hyd = 0;
    let totalP = 0;
    let active = 0;
    for (let i = 0; i < n; i++) {
      if (x[i]) {
        flow += data.efficiency[i];
        totalP += data.pressure[i];
        active++;
      }
    }
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (x[i] && x[j]) hyd += data.interaction[i][j];
      }
    }
    const pViol = Math.max(0, totalP - params.pmax) ** 2;
    const kViol = Math.max(0, active - params.kActive) ** 2;
    const cont = continuityPenalty(x, data.channelIds);
    return -flow + hyd + params.lambdaP * pViol + params.lambdaK * kViol + params.lambdaC * cont;
  }

  function evaluate(x, data, params) {
    const n = data.efficiency.length;
    let eff = 0;
    let pres = 0;
    const active = [];
    for (let i = 0; i < n; i++) {
      if (x[i]) {
        eff += data.efficiency[i];
        pres += data.pressure[i];
        active.push(i + 1);
      }
    }
    const feasible = pres <= params.pmax + 1e-9 && active.length <= params.kActive;
    return {
      x: [...x],
      hamiltonian: hamiltonian(x, data, params),
      total_efficiency: eff,
      total_pressure: pres,
      active_pores: active,
      active_count: active.length,
      feasible,
    };
  }

  function exhaustiveSearch(data, params) {
    const n = data.efficiency.length;
    if (n > EXHAUSTIVE_MAX_N) throw new Error(`Exhaustive search disabled for n=${n}`);
    const t0 = performance.now();
    let bestX = Array(n).fill(0);
    let bestH = Infinity;
    const history = [];
    const total = 2 ** n;
    for (let mask = 0; mask < total; mask++) {
      const x = Array.from({ length: n }, (_, i) => (mask >> i) & 1);
      const h = hamiltonian(x, data, params);
      history.push(h);
      if (h < bestH) {
        bestH = h;
        bestX = x;
      }
    }
    const result = evaluate(bestX, data, params);
    result.method = "exhaustive";
    result.runtime = (performance.now() - t0) / 1000;
    result.energy_history = history.slice(0, 512);
    result.n_variables = n;
    result.search_space = total;
    return result;
  }

  function simulatedAnnealing(data, params, seed, maxIter = 4000) {
    const rng = mulberry32(seed);
    const n = data.efficiency.length;
    let x = Array.from({ length: n }, () => (rng() > 0.5 ? 1 : 0));
    let curH = hamiltonian(x, data, params);
    let bestX = [...x];
    let bestH = curH;
    const history = [curH];
    const t0 = performance.now();
    const tStart = 2;
    const tEnd = 0.01;
    for (let step = 0; step < maxIter; step++) {
      const temp = tStart * (tEnd / tStart) ** (step / Math.max(maxIter - 1, 1));
      const i = Math.floor(rng() * n);
      const xNew = [...x];
      xNew[i] = 1 - xNew[i];
      const newH = hamiltonian(xNew, data, params);
      const delta = newH - curH;
      if (delta < 0 || rng() < Math.exp(-delta / Math.max(temp, 1e-12))) {
        x = xNew;
        curH = newH;
        if (curH < bestH) {
          bestH = curH;
          bestX = [...x];
        }
      }
      history.push(curH);
    }
    const result = evaluate(bestX, data, params);
    result.method = "simulated_annealing";
    result.runtime = (performance.now() - t0) / 1000;
    result.energy_history = history.filter((_, i) => i % Math.max(1, Math.floor(history.length / 400)) === 0);
    result.n_variables = n;
    result.search_space = 2 ** n;
    return result;
  }

  function isingMeanField(data, params, seed, maxIter = 200) {
    const rng = mulberry32(seed);
    const n = data.efficiency.length;
    let m = Array.from({ length: n }, () => rng() - 0.5);
    const history = [];
    const t0 = performance.now();
    for (let iter = 0; iter < maxIter; iter++) {
      const xSoft = m.map((v) => Math.min(1, Math.max(0, (v + 1) / 2)));
      const totalP = xSoft.reduce((s, xi, i) => s + xi * data.pressure[i], 0);
      const active = xSoft.reduce((s, xi) => s + xi, 0);
      const grad = m.map((_, i) => {
        let g = -data.efficiency[i];
        g += 2 * params.lambdaP * Math.max(0, totalP - params.pmax) * data.pressure[i];
        g += 2 * params.lambdaK * Math.max(0, active - params.kActive);
        return g;
      });
      m = m.map((v, i) => Math.max(-1, Math.min(1, v - 0.15 * grad[i] + (rng() - 0.5) * 0.04)));
      const xBin = m.map((v) => ((v + 1) / 2 > 0.5 ? 1 : 0));
      history.push(hamiltonian(xBin, data, params));
    }
    const xFinal = m.map((v) => ((v + 1) / 2 > 0.5 ? 1 : 0));
    const result = evaluate(xFinal, data, params);
    result.method = "ising_mean_field";
    result.runtime = (performance.now() - t0) / 1000;
    result.energy_history = history;
    result.n_variables = n;
    result.search_space = 2 ** n;
    return result;
  }

  function run(method, data, params, seed) {
    if (method === "exhaustive") return exhaustiveSearch(data, params);
    if (method === "simulated_annealing") return simulatedAnnealing(data, params, seed);
    if (method === "ising_mean_field") return isingMeanField(data, params, seed);
    throw new Error("Unknown method");
  }

  return {
    EXHAUSTIVE_MAX_N,
    sixPoreBenchmark,
    generateNetwork,
    hamiltonian,
    run,
  };
})();
