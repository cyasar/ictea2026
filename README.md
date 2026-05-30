# ICTEA 2026 — QUBO Oxygen Flow Optimization Demo

**Optimization of Oxygen Flow in Nanoporous Networks Using a Quantum Ising Machine: A QUBO-Based Approach for Sustainable Water De-Eutrophication**

**Authors:** Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Software Development)

Interactive web demo and Google Colab teaching notebook for ICTEA 2026 — conference presentation, live simulation, and step-by-step QUBO teaching.

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

---

## Modes

| Mode | Where | Purpose |
|------|-------|---------|
| **Presentation** | Web App → *Presentation Mode* | 24-slide deck, animated visuals, speaker notes (EN / TR / RO) |
| **Simulation** | Web App → *Simulation Mode* | Adjust QUBO parameters, run optimization, live canvases |
| **Teaching** | Google Colab notebook | Comparative charts, classical vs QUBO, 6×8 network SA |

---

## Presentation Mode

- **Enter:** Click *Presentation Mode* on the web app.
- **Navigate:** ← → arrow keys, **Space**, thumbnail strip, or *Previous / Next*.
- **Speaker notes:** **N** — presenter drawer (audience sees slides only).
- **Live simulation:** **S** — split view with physical simulation + QUBO graph.
- **Fullscreen:** **F** · **Esc** to exit.
- **Language:** English · Türkçe · Română (toolbar).

Slide flow includes research summary (problem → hypothesis → QUBO model), scientific visuals, benchmark comparison, and key findings (classical naive {1,2,4} vs QUBO optimum {1,2,6}).

---

## Simulation Mode

1. Set channels **C**, pores per channel **P**, **Pmax**, **K**, penalty weights λ.
2. Enable **Six-pore benchmark** for validation (expected: {1,2,6}, η=2.35, P=0.80, feasible).
3. Choose optimizer: Exhaustive / Simulated annealing / Ising mean field.
4. Click **Run Optimization** and inspect physical + QUBO canvases.

---

## Colab notebook

File: `notebooks/teaching_mode_colab.ipynb` (15 sections, English, chart commentary under every figure).

Regenerate after editing the builder:

```bash
python build_colab_nb.py
```

Source: `notebooks/build_colab_nb.py` — do not edit the `.ipynb` by hand if you use the builder.

---

## Project structure

```
ictea2026/
├── index.html              # Multilingual link hub (EN / TR / RO)
├── README.md
├── build_colab_nb.py       # Wrapper → notebooks/build_colab_nb.py
├── config/
│   ├── links.js            # Web + Colab URLs
│   ├── i18n-presentation.js
│   ├── i18n-hub.js
│   └── authors.js
├── frontend/
│   ├── index.html          # Presentation + Simulation
│   ├── css/style.css
│   └── js/                 # simulation, presentation, visuals
├── js/hub-i18n.js
├── backend/                # Optional Flask API
│   ├── app.py
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

Default API: `http://localhost:5000` — set `config/links.js` → `apiBase` if used.

---

## GitHub Pages

1. Push to `main` on [cyasar/ictea2026](https://github.com/cyasar/ictea2026).
2. Repository **Settings → Pages → Source:** Deploy from branch `main`, folder `/ (root)`.
3. Hub URL: `https://cyasar.github.io/ictea2026/`

Update share URLs in `config/links.js` if the repo name or host changes.

---

## Benchmark (six-pore validation)

| Quantity | Value |
|----------|-------|
| Active pores | {1, 2, 6} |
| Total efficiency η | 2.35 |
| Total pressure P | 0.80 |
| Feasible | Yes |
| Classical naive (top-3 fᵢ) | {1, 2, 4}, η=2.50, P=0.90 — **infeasible** |

---

## Keyboard shortcuts (Presentation)

| Key | Action |
|-----|--------|
| → / Space | Next slide |
| ← | Previous slide |
| N | Toggle speaker notes |
| S | Toggle live simulation |
| F | Toggle fullscreen |
| Esc | Close notes / sim / exit |

---

## Citation

Academic demo for **ICTEA 2026**. When reusing this material, cite the full paper title and authors above.
