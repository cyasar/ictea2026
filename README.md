# ICTEA 2026 — QUBO Oxygen Flow Optimization Demo

**Optimization of Oxygen Flow in Nanoporous Networks Using a Quantum Ising Machine: A QUBO-Based Approach for Sustainable Water De-Eutrophication**

**Authors:** Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Software Development)

Interactive web demo and Google Colab teaching notebook for ICTEA 2026 — conference presentation, live simulation, and step-by-step QUBO teaching.

> **Important:** No quantum advantage is claimed in this proof-of-concept. QUBO is used as a structured binary optimization language for pore selection under physical constraints.

---

## Live links

| Resource | URL |
|----------|-----|
| **Hub (start here)** | [https://cyasar.github.io/ictea2026/](https://cyasar.github.io/ictea2026/) |
| **Web App** | [https://cyasar.github.io/ictea2026/frontend/index.html](https://cyasar.github.io/ictea2026/frontend/index.html) |
| **Teaching Mode (Colab)** | [Open in Colab](https://colab.research.google.com/drive/1kOonF5KpEVLWtqBB4UpNNOgkHrYvKo5b) |
| **Notebook (Drive)** | [teaching_mode_colab.ipynb](https://drive.google.com/file/d/1kOonF5KpEVLWtqBB4UpNNOgkHrYvKo5b/view?usp=sharing) |
| **Repository** | [github.com/cyasar/ictea2026](https://github.com/cyasar/ictea2026) |

---

## Quick start (local)

```bash
git clone https://github.com/cyasar/ictea2026.git
cd ictea2026
python -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/) for the multilingual hub, or [http://localhost:8080/frontend/index.html](http://localhost:8080/frontend/index.html) for the web app directly.

Regenerate the Colab notebook after editing the builder:

```bash
python build_colab_nb.py          # from repo root
python build_colab_nb.py --verify-only   # syntax check only
```

Edit **`notebooks/build_colab_nb.py`**, not the `.ipynb` directly, when using the builder. A `.ipynb.bak` backup is created on each rebuild.

---

## Recommended presentation flow (~15–20 min)

| Step | Platform | Content |
|------|----------|---------|
| 1 | **Hub** (`index.html`) | Language selection EN / TR / RO |
| 2 | **Presentation Mode** | Research summary + scientific visuals + key findings |
| 3 | **Simulation Mode** | Six-pore benchmark → Run Optimization → {1,2,6} |
| 4 | **Colab** | Section 7 (naive vs QUBO) and/or Section 13 (6×8 network) |

### Pre-rehearsal checklist

- [ ] Browser full-screen; second tab with Colab open
- [ ] Internet for GitHub Pages + Colab
- [ ] Colab: **Runtime → Run all** once (warm cache)
- [ ] Simulation: enable **Six-pore benchmark**, optimizer **Exhaustive**, click **Run Optimization**

---

## Modes

| Mode | Where | Purpose |
|------|-------|---------|
| **Presentation** | Web App → *Presentation Mode* | 24-slide deck, animated visuals, speaker notes (EN / TR / RO) |
| **Simulation** | Web App → *Simulation Mode* | Adjust QUBO parameters, run optimization, live canvases |
| **Teaching** | Google Colab notebook | Comparative charts, classical vs QUBO, 6×8 network SA |

---

## Presentation Mode (24 slides)

**Enter:** *Presentation Mode* on the web app · **Language:** EN / TR / RO · **Speaker notes:** **N** · **Live sim:** **S** · **Fullscreen:** **F**

| # | Slide | Focus |
|---|--------|--------|
| 0 | Title | Core question: optimize pores, pressure, continuity — not just aeration |
| 1 | Problem Statement | Eutrophic bottom waters; sediment–water O₂ delivery |
| 2 | Research Hypothesis | Binary pores; Hamiltonian minimization; Ising-compatible route |
| 3 | Aim of the Study | Model, penalize, validate six-pore, extend to multi-channel |
| 4 | Method | 5 steps: network → binary → QUBO → exhaustive → annealing |
| 5 | QUBO Model | H(x): reward flow, penalize pressure / K / continuity |
| 6 | Oxygen-deficient bottom waters | Hypoxic sediments, internal nutrient loading |
| 7 | O₂ micro/nanobubbles | ~100 nm, slow rise, targeted delivery |
| 8 | Design challenge | Which pores to activate under constraints? |
| 9 | Nanoporous architecture | Inlet → microchannels → membrane → interface |
| 10 | Binary variables | xᵢ ∈ {0,1} |
| 11 | QUBO Hamiltonian | Minimize H(x) |
| 12 | QUBO → Ising | x = (1+s)/2, s ∈ {−1,+1} |
| 13 | Six-pore benchmark | Pmax=0.80, K=3, 2⁶=64 states |
| 14 | Optimal feasible config | **{1, 2, 6}**, η=2.35, P=0.80 |
| 15 | Network effects | High fᵢ alone may fail |
| 16 | Scaling 6×8 | 48 variables, 2⁴⁸ search space |
| 17 | Validation strategy | Exhaustive · SA · Ising-inspired |
| 18 | Framework contribution | Nanobubbles + QUBO layer (PoC) |
| 19 | Conclusion & future | CFD, experiments, real geometry |
| **20** | **Key Findings** | Classical vs QUBO comparison table |
| **21** | **Interpretation** | Optimum ≠ top fᵢ alone |
| **22** | **Discussion** | No quantum advantage claimed |
| **23** | **Conclusion** | Feasible O₂ pathways via QUBO |

Slides 20–23 (Key Findings → Conclusion) are placed at the **end** of the deck for the academic wrap-up.

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| → / Space | Next slide |
| ← | Previous slide |
| **N** | Toggle speaker notes (presenter drawer) |
| **S** | Toggle live simulation panel |
| **F** | Toggle fullscreen |
| Esc | Close notes / sim / exit presentation |

---

## Key findings (aligned across Web + Colab)

### Six-pore benchmark data

| Pore | fᵢ (efficiency) | pᵢ (pressure) | Note |
|------|-----------------|---------------|------|
| 1 | 0.90 | 0.30 | High f, moderate p |
| 2 | 0.75 | 0.25 | Good f, low p |
| 3 | 0.60 | 0.20 | Moderate f, lowest p |
| 4 | 0.85 | 0.35 | High f, **highest p** (risky) |
| 5 | 0.50 | 0.15 | Lowest f and p |
| 6 | 0.70 | 0.25 | Solid f, moderate p |

**Constraints:** Pmax = 0.80 · K = 3 · λₚ = λₖ = 50 · λc = 5 · qᵢⱼ = 0 (no hydraulic coupling in benchmark)

### Classical naive vs QUBO optimum

| Approach | Active pores | η | P | Feasible |
|----------|--------------|---|---|----------|
| **Classical naive** (top-3 by fᵢ) | {1, 2, 4} | 2.50 | 0.90 | **No** (P > Pmax) |
| **QUBO exhaustive search** | {1, 2, 6} | 2.35 | 0.80 | **Yes** |
| **QUBO simulated annealing** | {1, 2, 6} | 2.35 | 0.80 | **Yes** |
| **QUBO Ising-inspired annealing** | {1, 2, 6} | 2.35 | 0.80 | **Yes** |

**Main message for the audience:** Naive selection looks better on η alone but **violates the pressure cap**. QUBO minimization of H(x) selects the **feasible global optimum** {1, 2, 6}. Pore 4 is excluded despite high fᵢ because it pushes total pressure over Pmax.

### Interpretation

- Highest-efficiency pores do **not** always form the best **system** solution.
- Network connectivity, pressure budget, and hydraulic interactions matter.
- QUBO evaluates **combinations**, not isolated pore performance.
- This is a **proof-of-concept framework** — it does not replace CFD or laboratory experiments.

### Scaling (6×8 network, n = 48)

| Setting | Value |
|---------|-------|
| Variables | 48 (6 channels × 8 pores) |
| Search space | 2⁴⁸ (exhaustive search impractical) |
| Pmax_big | 2.40 |
| K_big | 12 |
| Solver | Simulated annealing (feasible-first) |
| Typical result | Feasible layout, ~11 active pores, SA ~1 s on CPU |

---

## QUBO Hamiltonian

$$H(\mathbf{x}) = -\sum_i f_i x_i + \sum_{i<j} q_{ij} x_i x_j + \lambda_p \max(0, \sum_i p_i x_i - P_{\max})^2 + \lambda_k \max(0, \sum_i x_i - K)^2 + \lambda_c C(\mathbf{x})$$

- **Flow reward** (−Σ fᵢ xᵢ): negative term — activating efficient pores lowers H(x).
- **Pressure penalty**: zero at optimum when P = Pmax exactly.
- **Active-pore penalty**: zero when exactly K pores active.
- **Continuity penalty C(x)**: penalizes disconnected channel paths (used in multi-channel networks).

**Ising mapping:** xᵢ = (1 + sᵢ)/2, sᵢ ∈ {−1, +1} — same energy landscape for classical, heuristic, or future quantum-annealing hardware.

---

## Simulation Mode

1. Set channels **C**, pores per channel **P**, **Pmax**, **K**, penalty weights λ.
2. Enable **Six-pore benchmark** for validation (expected: {1,2,6}, η=2.35, P=0.80).
3. Choose optimizer: **Exhaustive** / **Simulated annealing** / **Ising mean field**.
4. Click **Run Optimization** — inspect main view, section view, top view, QUBO graph, energy plot.

For large networks (e.g. C=6, P=8), use **Simulated annealing**; exhaustive search is limited to n ≤ 20 in the client.

---

## Colab notebook (`notebooks/teaching_mode_colab.ipynb`)

28 cells · 15 sections · English only · **Chart commentary** under every figure.

| Section | Content |
|---------|---------|
| 1–4 | Problem, binary variables, QUBO, Ising transformation |
| 5 | Classical vs quantum-inspired scaling (3 charts) |
| 6 | Six-pore benchmark data + pore maps |
| 7 | **Main comparison:** naive vs QUBO (table + 4-panel chart) |
| 8 | Exhaustive search — full energy landscape (64 configs) |
| 9 | Hamiltonian term breakdown (bar + pie) |
| 10 | Ising spin mapping |
| 11 | SA vs Ising-inspired convergence |
| 12 | Interactive Pmax / K sliders |
| 13 | **Dynamic 6×8 network** — SA, heatmap, cost comparison |
| 14 | Summary dashboard (all methods) |
| 15 | Discussion table |

**Section 13 prerequisites:** Run Sections 5–7 first, or **Runtime → Run all**.

---

## Discussion summary (Section 15 / slides 20–23)

| Finding | Explanation |
|---------|-------------|
| Naive classical fails | Top-3 by fᵢ → {1,2,4}, P=0.90 > Pmax |
| QUBO selects {1,2,6} | Minimizing H(x) under penalties yields feasible optimum |
| Methods agree | Exhaustive search and SA match on six-pore benchmark |
| Scaling | Exhaustive for n=6; SA for n=48; quantum hardware is future work |
| No quantum advantage claimed | QUBO is a structured optimization language for teaching and PoC |

**Next steps (future work):** CFD-derived coefficients, experimental pressure-flow data, embedding on quantum annealers, realistic membrane geometry.

---

## Project structure

```
ictea2026/
├── index.html              # Multilingual link hub (EN / TR / RO)
├── README.md
├── build_colab_nb.py       # Wrapper → notebooks/build_colab_nb.py
├── config/
│   ├── links.js            # Web + Colab URLs
│   ├── i18n-presentation.js   # 24 slides × EN/TR/RO + speaker notes
│   ├── i18n-hub.js
│   └── authors.js
├── frontend/
│   ├── index.html          # Presentation + Simulation
│   ├── css/style.css
│   └── js/
│       ├── app.js
│       ├── simulation.js
│       ├── visualization.js
│       ├── presentation.js
│       └── pres-visuals.js
├── js/hub-i18n.js
├── backend/                # Optional Flask API
│   ├── app.py
│   ├── qubo_model.py
│   ├── optimizers.py
│   └── requirements.txt
└── notebooks/
    ├── build_colab_nb.py
    └── teaching_mode_colab.ipynb
```

---

## Optional Flask backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Default API: `http://localhost:5000` — set `config/links.js` → `apiBase` if used. The web app runs fully client-side without the backend.

---

## GitHub Pages

1. Push to `main` on [cyasar/ictea2026](https://github.com/cyasar/ictea2026).
2. **Settings → Pages → Source:** branch `main`, folder `/ (root)`.
3. Hub: `https://cyasar.github.io/ictea2026/`

Share URLs are configured in **`config/links.js`**.

---

## Maintenance notes

| Task | Command / file |
|------|----------------|
| Update Colab link | `config/links.js` → `colabTeaching` |
| Update web URL | `config/links.js` → `webApp` |
| Edit slide text / notes | `config/i18n-presentation.js` |
| Edit slide visuals | `frontend/js/pres-visuals.js` |
| Rebuild notebook | `python build_colab_nb.py` |
| Verify notebook cells | `python build_colab_nb.py --verify-only` |

---

## Citation

Academic demo for **ICTEA 2026**. When reusing this material, cite the full paper title and authors:

> *Optimization of Oxygen Flow in Nanoporous Networks Using a Quantum Ising Machine: A QUBO-Based Approach for Sustainable Water De-Eutrophication* — Prof. Dr. Eden Mamut · Dr. Cumali Yaşar
