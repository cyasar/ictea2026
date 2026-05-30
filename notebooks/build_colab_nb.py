"""Build teaching_mode_colab.ipynb with English-only comparative graphics."""
import json
import textwrap
from pathlib import Path


def md(s):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [line + "\n" for line in textwrap.dedent(s).strip().split("\n")],
    }


def code(s):
    return {
        "cell_type": "code",
        "metadata": {},
        "outputs": [],
        "execution_count": None,
        "source": [line + "\n" for line in textwrap.dedent(s).strip().split("\n")],
    }


cells = []

cells.append(
    md(
        """
        # Optimization of Oxygen Flow in Nanoporous Networks Using a Quantum Ising Machine

        **A QUBO-Based Approach for Sustainable Water De-Eutrophication**

        **ICTEA 2026 · Teaching Mode (Google Colab)**

        **Authors:** Prof. Dr. Eden Mamut · Dr. Cumali Yaşar (Software Development)

        This notebook is a **visual, comparative teaching guide** (English only). You will see:

        1. Binary pore variables and the QUBO Hamiltonian (term-by-term)
        2. **Classical naive vs QUBO-based** optimization on the six-pore benchmark
        3. Exhaustive search, simulated annealing, and Ising-inspired search **side-by-side**
        4. Scaling curves: classical exact vs heuristic vs quantum-inspired routes
        5. Dynamic **6×8 network** (48 variables) with SA convergence plots
        6. Interactive sliders for $P_{\\max}$ and $K$

        **Pair with the Web App:** Presentation Mode + Live Simulation (`frontend/index.html`).
        """
    )
)

cells.append(
    md(
        """
        ## 1. Problem definition

        Bottom waters in lakes and lagoons may become **oxygen-deficient**. Controlled **O₂ nanobubble**
        delivery through a **nanoporous membrane** supports sustainable de-eutrophication.

        **Design question:** Which pores should be **active** while respecting flow efficiency,
        pressure limit $P_{\\max}$, maximum active pores $K$, and pathway continuity?
        """
    )
)

cells.append(
    md(
        """
        ## 2. Binary representation

        Each candidate pore $i$: $x_i \\in \\{0, 1\\}$ — **1 = active**, **0 = passive**.

        With $n$ pores the search space has **$2^n$** patterns.
        """
    )
)

cells.append(
    md(
        """
        ## 3. QUBO Hamiltonian

        $$H(\\mathbf{x}) = -\\sum_i f_i x_i + \\sum_{i<j} q_{ij} x_i x_j
        + \\lambda_p \\max(0, \\sum_i p_i x_i - P_{\\max})^2
        + \\lambda_k \\max(0, \\sum_i x_i - K)^2 + \\lambda_c C(\\mathbf{x})$$

        Minimize $H(\\mathbf{x})$ to obtain the best pore architecture under constraints.
        """
    )
)

cells.append(
    md(
        """
        ## 4. Ising transformation

        $x_i = (1 + s_i)/2$, $s_i \\in \\{-1, +1\\}$. Same QUBO can be solved classically or on
        Ising / quantum-annealing hardware. **No quantum advantage is claimed in this PoC.**
        """
    )
)

cells.append(
    code(
        """
        import itertools
        import time
        import numpy as np
        import matplotlib.pyplot as plt
        import pandas as pd
        from IPython.display import display, Markdown

        try:
            from ipywidgets import interact, FloatSlider, IntSlider
            HAS_WIDGETS = True
        except ImportError:
            HAS_WIDGETS = False

        COLORS = {
            "active": "#1976d2",
            "inactive": "#b0bec5",
            "feasible": "#2e7d32",
            "infeasible": "#e53935",
            "flow": "#16a34a",
            "classical": "#2563eb",
            "quantum": "#7c3aed",
            "naive": "#ef4444",
            "qubo": "#059669",
        }

        plt.rcParams.update({
            "figure.figsize": (10, 4.5),
            "font.size": 11,
            "axes.spines.top": False,
            "axes.spines.right": False,
        })

        # Colab / Jupyter: inline plots
        try:
            get_ipython().run_line_magic("matplotlib", "inline")
        except Exception:
            pass


        def chart_notes(*items):
            \"\"\"Print numbered captions under a figure block.\"\"\"
            lines = ["**Chart commentary**"]
            for i, (title, body) in enumerate(items, 1):
                lines.append(f"{i}. **{title}** — {body}")
            display(Markdown("\\n\\n".join(lines)))
        """
    )
)

cells.append(
    md(
        """
        ## 5. Classical vs quantum-inspired scaling

        | Method | Type | Role |
        |--------|------|------|
        | Exhaustive search | Classical exact | Validate small benchmarks |
        | Simulated annealing | Classical heuristic | Scale to 48+ variables |
        | Ising mean field | Classical spin-inspired | Same energy landscape |
        | Quantum annealing | Hardware (external) | Future large networks |
        """
    )
)

cells.append(
    code(
        """
        n_grid = np.arange(4, 55, 1)
        cost_exhaustive = 2.0 ** n_grid
        cost_sa = n_grid * 5000
        cost_mf = n_grid * 200
        cost_quantum = np.maximum(n_grid ** 1.6, 1)

        fig = plt.figure(figsize=(14, 5.5))
        gs = fig.add_gridspec(1, 3, width_ratios=[1.2, 1, 1])

        ax1 = fig.add_subplot(gs[0, 0])
        ax1.semilogy(n_grid, cost_exhaustive / cost_exhaustive[0], label="Exhaustive  O(2^n)", color="#e53935", lw=2.5)
        ax1.semilogy(n_grid, cost_sa / cost_sa[0], label="Simulated annealing", color=COLORS["classical"], lw=2)
        ax1.semilogy(n_grid, cost_mf / cost_mf[0], label="Ising mean field", color="#0288d1", lw=2, ls="--")
        ax1.semilogy(n_grid, cost_quantum / cost_quantum[0], label="Quantum annealing (illustrative)", color=COLORS["quantum"], lw=2)
        for xv, lab in [(6, "6-pore"), (48, "6×8")]:
            ax1.axvline(xv, color="#64748b", ls=":", alpha=0.85)
            ax1.text(xv + 0.8, 1e1, lab, fontsize=9, color="#64748b")
        ax1.set_xlabel("Number of binary variables n")
        ax1.set_ylabel("Relative cost (log scale, normalized)")
        ax1.set_title("Computational scaling")
        ax1.legend(fontsize=8)
        ax1.grid(alpha=0.3, which="both")

        criteria = ["Exact\\nsmall n", "Large n\\nscale", "No special\\nHW", "Low-energy\\nsearch", "Teaching\\nclarity"]
        scores = {
            "Exhaustive": [5, 1, 5, 5, 5],
            "Sim. annealing": [2, 4, 5, 3, 4],
            "Ising mean field": [2, 4, 5, 3, 4],
            "Quantum / Ising HW": [3, 5, 1, 5, 3],
        }
        ax2 = fig.add_subplot(gs[0, 1])
        x = np.arange(len(criteria))
        w = 0.18
        pal = ["#e53935", COLORS["classical"], "#0288d1", COLORS["quantum"]]
        for i, (name, vals) in enumerate(scores.items()):
            ax2.bar(x + (i - 1.5) * w, vals, w, label=name, color=pal[i], edgecolor="white")
        ax2.set_xticks(x)
        ax2.set_xticklabels(criteria, fontsize=8)
        ax2.set_ylim(0, 5.8)
        ax2.set_ylabel("Score (1–5)")
        ax2.set_title("Qualitative capability")
        ax2.legend(fontsize=7)
        ax2.grid(axis="y", alpha=0.3)

        ax3 = fig.add_subplot(gs[0, 2])
        roles = ["Exhaustive\\n(n=6)", "SA\\n(n=48)", "QA\\n(concept)"]
        ax3.bar(roles, [1, 0.65, 0.55], color=["#16a34a", COLORS["classical"], COLORS["quantum"]], edgecolor="white")
        ax3.set_ylim(0, 1.15)
        ax3.set_title("Solver role in this notebook")
        ax3.set_ylabel("Relative usefulness (illustrative)")

        plt.suptitle("Classical vs quantum-inspired optimization — overview", fontsize=13, y=1.02)
        plt.tight_layout()
        plt.show()

        chart_notes(
            (
                "Computational scaling (left)",
                "Exhaustive search grows as **O(2^n)** (red curve). At **n=6** all 64 states can be checked; "
                "at **n=48** (6x8 network) exhaustive search is impractical. Simulated annealing and Ising mean field "
                "scale much more gently and remain usable for large networks.",
            ),
            (
                "Qualitative capability (centre)",
                "Each bar group scores a solver on five teaching criteria (1-5). Exhaustive search is ideal for small "
                "benchmarks but cannot scale. Quantum/Ising hardware scores high on large-n search but needs special "
                "equipment. SA balances scale and accessibility for this PoC.",
            ),
            (
                "Solver role in this notebook (right)",
                "Illustrative usefulness: exhaustive search validates the six-pore benchmark; SA handles the 48-variable "
                "network; quantum annealing is shown as a **future** route, not implemented here.",
            ),
        )
        """
    )
)

cells.append(
    md(
        """
        ## 6. Six-pore benchmark data

        Fixed validation case (aligned with web demo). No hydraulic interactions ($q_{ij}=0$).
        Expected QUBO optimum: **{1, 2, 6}**, $\\eta=2.35$, $P=0.80$, feasible.
        """
    )
)

cells.append(
    code(
        """
        efficiency = np.array([0.90, 0.75, 0.60, 0.85, 0.50, 0.70])
        pressure = np.array([0.30, 0.25, 0.20, 0.35, 0.15, 0.25])
        n = len(efficiency)
        q = np.zeros((n, n))
        channel_ids = None

        Pmax, K = 0.80, 3
        lambda_p, lambda_k, lambda_c = 50.0, 50.0, 5.0

        df = pd.DataFrame({
            "Pore": range(1, n + 1),
            "f_i (efficiency)": efficiency,
            "p_i (pressure)": pressure,
            "Note": [
                "High f, moderate p",
                "Good f, low p",
                "Moderate f, lowest p",
                "High f, highest p (risky)",
                "Lowest f and p",
                "Solid f, moderate p",
            ],
        })
        display(df)

        fig, axes = plt.subplots(1, 3, figsize=(14, 4))

        axes[0].bar(range(1, n + 1), efficiency, color=COLORS["classical"], edgecolor="white")
        axes[0].set_title("Efficiency f_i per pore")
        axes[0].set_xlabel("Pore")
        axes[0].set_ylabel("f_i")
        axes[0].grid(axis="y", alpha=0.3)

        axes[1].bar(range(1, n + 1), pressure, color="#fb8c00", edgecolor="white")
        axes[1].axhline(Pmax, color=COLORS["infeasible"], ls="--", lw=2, label=f"Pmax={Pmax}")
        axes[1].set_title("Pressure p_i per pore")
        axes[1].set_xlabel("Pore")
        axes[1].set_ylabel("p_i")
        axes[1].legend()
        axes[1].grid(axis="y", alpha=0.3)

        axes[2].scatter(efficiency, pressure, s=120, c=range(n), cmap="tab10", edgecolors="white", lw=1.5)
        for i in range(n):
            axes[2].annotate(str(i + 1), (efficiency[i], pressure[i]), ha="center", va="center", color="white", fontweight="bold")
        axes[2].axhline(Pmax, color=COLORS["infeasible"], ls="--", alpha=0.7)
        axes[2].set_xlabel("Efficiency f_i")
        axes[2].set_ylabel("Pressure p_i")
        axes[2].set_title("Pore map: efficiency vs pressure load")
        axes[2].grid(alpha=0.3)

        plt.tight_layout()
        plt.show()

        chart_notes(
            (
                "Efficiency f_i per pore (left)",
                "Pores **1** and **4** have the highest individual flow efficiency. A naive rule 'pick top-3 by f_i' "
                "therefore favours {1, 2, 4} without looking at combined pressure.",
            ),
            (
                "Pressure p_i per pore (centre)",
                "Each bar is the pressure load if that pore is active. The dashed line is **Pmax = 0.80**. "
                "Pore **4** contributes the largest single-pore pressure (0.35), which makes the naive triple risky.",
            ),
            (
                "Pore map: efficiency vs pressure (right)",
                "Each numbered point is one pore. Ideal candidates sit **high-left** (high f, low p). "
                "Pore 4 is attractive on efficiency alone but sits high on pressure — the trade-off QUBO resolves globally.",
            ),
        )
        """
    )
)

cells.append(
    code(
        """
        def continuity_penalty(x, ch_ids):
            if ch_ids is None or len(x) == 0:
                return 0.0
            penalty = 0.0
            channels = np.unique(ch_ids)
            active_channels = {int(c) for c, flag in zip(ch_ids, x) if flag == 1}
            for ch in channels:
                ch = int(ch)
                if ch not in active_channels:
                    if (ch - 1 in active_channels) or (ch + 1 in active_channels):
                        penalty += 1.0
            return penalty


        def hamiltonian(x, eff, pres, q_mat, pmax, k_val, lp, lk, lc, ch_ids=None):
            x = np.asarray(x, int)
            flow = -np.sum(eff * x)
            hyd = np.sum(q_mat * np.outer(x, x))
            total_p = np.sum(pres * x)
            p_pen = lp * max(0.0, total_p - pmax) ** 2
            k_pen = lk * max(0.0, np.sum(x) - k_val) ** 2
            c_pen = lc * continuity_penalty(x, ch_ids)
            return flow + hyd + p_pen + k_pen + c_pen


        def hamiltonian_terms(x, eff, pres, q_mat, pmax, k_val, lp, lk, lc, ch_ids=None):
            x = np.asarray(x, int)
            total_p = np.sum(pres * x)
            return {
                "Flow reward": -np.sum(eff * x),
                "Hydraulic coupling": np.sum(q_mat * np.outer(x, x)),
                "Pressure penalty": lp * max(0.0, total_p - pmax) ** 2,
                "Active pore penalty": lk * max(0.0, np.sum(x) - k_val) ** 2,
                "Continuity penalty": lc * continuity_penalty(x, ch_ids),
            }


        def evaluate(x, eff=efficiency, pres=pressure, q_mat=q, ch_ids=channel_ids,
                     pmax=Pmax, k_val=K):
            x = np.asarray(x, int)
            total_eff = float(np.sum(eff * x))
            total_pres = float(np.sum(pres * x))
            active = [i + 1 for i, v in enumerate(x) if v == 1]
            feasible = total_pres <= pmax + 1e-9 and len(active) <= k_val
            H = hamiltonian(x, eff, pres, q_mat, pmax, k_val, lambda_p, lambda_k, lambda_c, ch_ids)
            return {
                "x": x,
                "H": H,
                "efficiency": total_eff,
                "pressure": total_pres,
                "active_pores": active,
                "feasible": feasible,
            }


        def naive_greedy_top_k(eff, pres, k_val, pmax):
            order = np.argsort(-eff)[:k_val]
            x = np.zeros(len(eff), int)
            x[order] = 1
            return x


        def exhaustive_search(eff, pres, q_mat, pmax, k_val, ch_ids=None):
            n_vars = len(eff)
            t0 = time.perf_counter()
            best_feas = None
            history, feas_flags = [], []
            for bits in itertools.product([0, 1], repeat=n_vars):
                x = np.array(bits)
                h = hamiltonian(x, eff, pres, q_mat, pmax, k_val, lambda_p, lambda_k, lambda_c, ch_ids)
                ev = evaluate(x, eff, pres, q_mat, ch_ids, pmax, k_val)
                history.append(h)
                feas_flags.append(ev["feasible"])
                if ev["feasible"] and (best_feas is None or h < best_feas["H"]):
                    best_feas = {**ev, "H": h, "method": "exhaustive"}
            runtime = time.perf_counter() - t0
            if best_feas:
                best_feas["runtime"] = runtime
                best_feas["history"] = history
                best_feas["feas_flags"] = feas_flags
            return best_feas


        def simulated_annealing(eff, pres, q_mat, pmax, k_val, ch_ids=None, seed=42, max_iter=4000,
                                prefer_feasible=True):
            rng = np.random.default_rng(seed)
            n_vars = len(eff)
            x = rng.integers(0, 2, n_vars)
            cur_h = hamiltonian(x, eff, pres, q_mat, pmax, k_val, lambda_p, lambda_k, lambda_c, ch_ids)
            best_x, best_h = x.copy(), cur_h
            best_feas_x, best_feas_h = None, float("inf")
            if prefer_feasible:
                ev0 = evaluate(x, eff, pres, q_mat, ch_ids, pmax, k_val)
                if ev0["feasible"]:
                    best_feas_x, best_feas_h = x.copy(), cur_h
            hist = [cur_h]
            t0 = time.perf_counter()
            for step in range(max_iter):
                temp = 2.0 * (0.01 / 2.0) ** (step / max(max_iter - 1, 1))
                i = rng.integers(0, n_vars)
                x_new = x.copy()
                x_new[i] = 1 - x_new[i]
                new_h = hamiltonian(x_new, eff, pres, q_mat, pmax, k_val, lambda_p, lambda_k, lambda_c, ch_ids)
                if new_h - cur_h < 0 or rng.random() < np.exp(-(new_h - cur_h) / max(temp, 1e-12)):
                    x, cur_h = x_new, new_h
                    if cur_h < best_h:
                        best_x, best_h = x.copy(), cur_h
                    if prefer_feasible:
                        evn = evaluate(x, eff, pres, q_mat, ch_ids, pmax, k_val)
                        if evn["feasible"] and cur_h < best_feas_h:
                            best_feas_x, best_feas_h = x.copy(), cur_h
                if step % max(max_iter // 5, 1) == 0:
                    hist.append(cur_h)
            if prefer_feasible and best_feas_x is not None:
                best_x, best_h = best_feas_x, best_feas_h
            runtime = time.perf_counter() - t0
            ev = evaluate(best_x, eff, pres, q_mat, ch_ids, pmax, k_val)
            return {**ev, "H": best_h, "method": "simulated_annealing", "runtime": runtime, "history": hist}


        def ising_mean_field(eff, pres, q_mat, pmax, k_val, ch_ids=None, seed=42, max_iter=300, lr=0.15):
            rng = np.random.default_rng(seed)
            n_vars = len(eff)
            m = rng.uniform(-0.5, 0.5, n_vars)
            hist = []
            t0 = time.perf_counter()
            for _ in range(max_iter):
                x_soft = np.clip((m + 1) / 2, 0, 1)
                grad = -eff.copy()
                grad += 2 * lambda_p * max(0, np.sum(pres * x_soft) - pmax) * pres
                grad += 2 * lambda_k * max(0, np.sum(x_soft) - k_val)
                m = np.clip(m - lr * grad + rng.normal(0, 0.03, n_vars), -1, 1)
                x_bin = (x_soft > 0.5).astype(int)
                hist.append(hamiltonian(x_bin, eff, pres, q_mat, pmax, k_val, lambda_p, lambda_k, lambda_c, ch_ids))
            x_final = ((m + 1) / 2 > 0.5).astype(int)
            runtime = time.perf_counter() - t0
            ev = evaluate(x_final, eff, pres, q_mat, ch_ids, pmax, k_val)
            return {**ev, "H": ev["H"], "method": "ising_mean_field", "runtime": runtime, "history": hist}


        def ising_inspired_annealing(eff, pres, q_mat, pmax, k_val, ch_ids=None, seed=123, max_iter=4000):
            \"\"\"Classical annealing on the Ising/QUBO energy landscape (same solver class as QA simulators).\"\"\"
            r = simulated_annealing(eff, pres, q_mat, pmax, k_val, ch_ids, seed=seed, max_iter=max_iter)
            r["method"] = "ising_inspired_annealing"
            return r
        """
    )
)

cells.append(
    md(
        """
        ## 7. Classical naive vs QUBO-based — main comparison

        **Classical naive:** activate the **top-3 pores by individual efficiency** $f_i$ (ignores $P_{\\max}$).

        **QUBO-based:** minimize $H(\\mathbf{x})$ under penalties — selects **{1, 2, 6}**.
        """
    )
)

cells.append(
    code(
        """
        x_naive = naive_greedy_top_k(efficiency, pressure, K, Pmax)
        res_naive = evaluate(x_naive)
        res_naive["method"] = "classical_naive"
        res_naive["H"] = hamiltonian(x_naive, efficiency, pressure, q, Pmax, K, lambda_p, lambda_k, lambda_c)

        result = exhaustive_search(efficiency, pressure, q, Pmax, K)
        res_sa6 = simulated_annealing(efficiency, pressure, q, Pmax, K, seed=42)
        res_ising6 = ising_inspired_annealing(efficiency, pressure, q, Pmax, K)

        compare_rows = []
        for label, r in [
            ("Classical naive (top-3 f_i)", res_naive),
            ("QUBO · exhaustive search", result),
            ("QUBO · simulated annealing", res_sa6),
            ("QUBO · Ising-inspired annealing", res_ising6),
        ]:
            compare_rows.append({
                "Approach": label,
                "Active pores": str(r["active_pores"]),
                "eta": round(r["efficiency"], 2),
                "P": round(r["pressure"], 2),
                "H(x)": round(r["H"], 3),
                "Feasible": "Yes" if r["feasible"] else "No",
                "Runtime (ms)": round(r.get("runtime", 0) * 1000, 2) if r.get("runtime") else "—",
            })
        compare_df = pd.DataFrame(compare_rows)
        display(Markdown("### Comparison table — six-pore benchmark"))
        display(compare_df)

        fig, axes = plt.subplots(2, 2, figsize=(13, 9))

        # Table-style heatmap of numeric columns
        ax = axes[0, 0]
        heat = compare_df[["eta", "P"]].values
        im = ax.imshow(heat, aspect="auto", cmap="RdYlGn_r")
        ax.set_xticks([0, 1])
        ax.set_xticklabels(["eta", "P"])
        ax.set_yticks(range(len(compare_df)))
        ax.set_yticklabels([a.replace(" ", "\\n") for a in compare_df["Approach"]], fontsize=8)
        for i in range(heat.shape[0]):
            for j in range(heat.shape[1]):
                ax.text(j, i, f"{heat[i,j]:.2f}", ha="center", va="center", color="black", fontweight="bold")
        ax.set_title("eta and P across methods")
        plt.colorbar(im, ax=ax, fraction=0.046)

        # Bar: efficiency
        ax = axes[0, 1]
        colors = [COLORS["naive"] if "naive" in a.lower() else COLORS["qubo"] for a in compare_df["Approach"]]
        bars = ax.bar(range(len(compare_df)), compare_df["eta"], color=colors, edgecolor="white")
        ax.axhline(result["efficiency"], color=COLORS["feasible"], ls="--", label="QUBO optimum eta")
        ax.set_xticks(range(len(compare_df)))
        ax.set_xticklabels(["Naive", "Exhaust.", "SA", "Ising"], fontsize=9)
        ax.set_ylabel("Total efficiency eta")
        ax.set_title("Efficiency comparison")
        ax.legend()
        ax.grid(axis="y", alpha=0.3)

        # Bar: pressure vs Pmax
        ax = axes[1, 0]
        ax.bar(range(len(compare_df)), compare_df["P"], color=colors, edgecolor="white")
        ax.axhline(Pmax, color=COLORS["infeasible"], ls="--", lw=2, label=f"Pmax={Pmax}")
        ax.set_xticks(range(len(compare_df)))
        ax.set_xticklabels(["Naive", "Exhaust.", "SA", "Ising"], fontsize=9)
        ax.set_ylabel("Total pressure P")
        ax.set_title("Pressure vs limit")
        ax.legend()
        ax.grid(axis="y", alpha=0.3)

        # Pore activation diagram
        ax = axes[1, 1]
        methods_x = ["Naive", "QUBO opt"]
        configs = [res_naive["active_pores"], result["active_pores"]]
        for col, (name, act) in enumerate(zip(methods_x, configs)):
            for i in range(n):
                on = (i + 1) in act
                cx = col * 2.5 + (i % 3) * 0.7
                cy = 1 - (i // 3) * 0.8
                ax.add_patch(plt.Circle((cx, cy), 0.28, color=COLORS["active"] if on else COLORS["inactive"]))
                ax.text(cx, cy, str(i + 1), ha="center", va="center", color="white", fontsize=9, fontweight="bold")
            ax.text(col * 2.5 + 0.7, -0.5, name, ha="center", fontsize=10, fontweight="bold")
        ax.set_xlim(-0.5, 5)
        ax.set_ylim(-0.8, 1.5)
        ax.set_title("Active pore patterns")
        ax.axis("off")

        plt.suptitle("Classical naive vs QUBO-based — six-pore benchmark", fontsize=13, y=1.01)
        plt.tight_layout()
        plt.show()

        chart_notes(
            (
                "eta and P heatmap (top-left)",
                "Green cells are desirable (high eta, moderate P). Naive shows high eta **and** high P (infeasible). "
                "All QUBO solvers cluster at the feasible optimum: eta=2.35, P=0.80.",
            ),
            (
                "Efficiency comparison (top-right)",
                "Naive reaches eta=2.50 — higher than QUBO — but that gain comes from breaking the pressure cap. "
                "The dashed line marks the **feasible** QUBO optimum; only constrained methods reach it legitimately.",
            ),
            (
                "Pressure vs limit (bottom-left)",
                "Naive total pressure **P=0.90** exceeds Pmax=0.80 (red zone). QUBO methods sit exactly on the limit, "
                "showing how penalty terms enforce the constraint during minimization.",
            ),
            (
                "Active pore patterns (bottom-right)",
                "Blue circles = active pores. Naive activates pore **4** (high f, high p); QUBO swaps it for pore **6** "
                "(slightly lower f, much lower p), yielding {1, 2, 6} — the best **feasible** architecture.",
            ),
        )

        display(Markdown(
            "**Key insight:** Naive classical selection {1,2,4} achieves higher eta but **violates Pmax**. "
            "QUBO minimization selects the **feasible** optimum {1,2,6}. Exhaustive search and SA agree. "
            "Ising-inspired annealing explores the same QUBO energy landscape and reaches the same feasible optimum on this benchmark."
        ))
        """
    )
)

cells.append(
    md(
        """
        ## 8. Exhaustive search — energy landscape

        All $2^6 = 64$ configurations scanned. Green = feasible, grey = infeasible.
        """
    )
)

cells.append(
    code(
        """
        history = result["history"]
        feas_flags = result["feas_flags"]

        fig, axes = plt.subplots(1, 3, figsize=(14, 4))

        colors = [COLORS["feasible"] if f else COLORS["inactive"] for f in feas_flags]
        axes[0].scatter(range(len(history)), history, c=colors, s=18, alpha=0.75)
        axes[0].axhline(result["H"], color=COLORS["active"], ls="--", lw=2, label="Best feasible H(x)")
        axes[0].set_xlabel("Configuration index (0…63)")
        axes[0].set_ylabel("H(x)")
        axes[0].set_title("Full energy landscape")
        axes[0].legend()
        axes[0].grid(alpha=0.3)

        feas_h = [h for h, f in zip(history, feas_flags) if f]
        axes[1].hist(feas_h, bins=12, color=COLORS["feasible"], edgecolor="white", alpha=0.85)
        axes[1].axvline(result["H"], color=COLORS["active"], ls="--", lw=2)
        axes[1].set_xlabel("H(x) — feasible configs only")
        axes[1].set_title(f"Feasible energy distribution (n={len(feas_h)})")
        axes[1].grid(axis="y", alpha=0.3)

        active_set = set(result["active_pores"])
        for i in range(n):
            cx = i + 1
            on = (i + 1) in active_set
            axes[2].add_patch(plt.Circle((cx, 0.5), 0.35, color=COLORS["active"] if on else COLORS["inactive"]))
            axes[2].text(cx, 0.5, str(i + 1), ha="center", va="center", color="white", fontweight="bold")
            axes[2].text(cx, -0.12, f"f={efficiency[i]:.2f}", ha="center", fontsize=8)
        axes[2].set_xlim(0.3, n + 0.7)
        axes[2].set_ylim(-0.35, 1.0)
        axes[2].set_title(f"QUBO optimum: {result['active_pores']}")
        axes[2].axis("off")

        plt.tight_layout()
        plt.show()
        print(f"Runtime (exhaustive): {result['runtime']*1000:.2f} ms")

        chart_notes(
            (
                "Full energy landscape (left)",
                "Every dot is one of the **64** binary configurations. **Green** = feasible (P <= Pmax and active count <= K); "
                "**grey** = infeasible. The dashed line is the lowest feasible H(x). Most configurations violate constraints.",
            ),
            (
                "Feasible energy distribution (centre)",
                "Histogram of H(x) for feasible configs only. The optimum sits at the **left tail** — lowest energy among "
                "legal patterns. This confirms {1,2,6} is not just feasible but globally optimal under QUBO.",
            ),
            (
                "QUBO optimum pore diagram (right)",
                "Active pores highlighted in blue with their f_i values. Pores 1, 2, and 6 balance efficiency against "
                "the shared pressure budget; pore 4 is excluded despite high f because it would push P over Pmax.",
            ),
        )
        """
    )
)

cells.append(
    md(
        """
        ## 9. Hamiltonian term breakdown (QUBO optimum)

        How each mathematical term contributes to $H(\\mathbf{x})$ at the optimal feasible pattern.
        """
    )
)

cells.append(
    code(
        """
        x_opt = np.zeros(n, int)
        for p in result["active_pores"]:
            x_opt[p - 1] = 1

        terms = hamiltonian_terms(x_opt, efficiency, pressure, q, Pmax, K, lambda_p, lambda_k, lambda_c)
        term_df = pd.DataFrame({"Term": terms.keys(), "Value": terms.values()})
        term_df["Explanation"] = [
            "Negative → rewards activating efficient pores",
            "Zero — no q_ij in benchmark",
            "Zero at boundary — P exactly at Pmax",
            "Zero — exactly K=3 active pores",
            "Zero — single-row benchmark",
        ]
        term_df.loc[len(term_df)] = ["H(x) total", sum(terms.values()), "Objective minimized by QUBO solvers"]
        display(term_df.round(4))

        fig, axes = plt.subplots(1, 2, figsize=(12, 4))
        labels = list(terms.keys())
        vals = list(terms.values())
        bar_colors = ["#16a34a" if v < 0 else "#2563eb" if "penalty" not in lb.lower() else "#e53935"
                      for v, lb in zip(vals, labels)]
        axes[0].barh(labels, vals, color=bar_colors)
        axes[0].axvline(0, color="#64748b")
        axes[0].set_xlabel("Contribution to H(x)")
        axes[0].set_title("Term breakdown (bar)")

        abs_vals = np.abs(vals)
        axes[1].pie(abs_vals, labels=labels, autopct="%1.0f%%", startangle=140,
                    colors=bar_colors, textprops={"fontsize": 8})
        axes[1].set_title("Relative |term| share")

        plt.tight_layout()
        plt.show()

        chart_notes(
            (
                "Term breakdown bar chart (left)",
                "The **flow reward** term is negative (green) — activating efficient pores lowers H(x). "
                "Penalty terms are **zero at the optimum**: pressure sits exactly at Pmax, exactly K=3 pores active, "
                "and no hydraulic coupling (q_ij=0) in this benchmark.",
            ),
            (
                "Relative |term| share (right)",
                "Pie chart of absolute term magnitudes. The flow reward dominates the objective; penalties act as "
                "**guard rails** that become non-zero only when constraints are violated.",
            ),
        )
        """
    )
)

cells.append(
    md(
        """
        ## 10. Ising spin mapping (optimal configuration)
        """
    )
)

cells.append(
    code(
        """
        spins = 2 * x_opt - 1
        ising_df = pd.DataFrame({
            "Pore": range(1, n + 1),
            "x_i": x_opt,
            "s_i": spins,
            "State": ["active (+1)" if s == 1 else "passive (−1)" for s in spins],
        })
        display(ising_df)

        fig, axes = plt.subplots(1, 2, figsize=(11, 3.5))
        axes[0].bar(range(1, n + 1), spins, color=[COLORS["active"] if s == 1 else COLORS["inactive"] for s in spins])
        axes[0].axhline(0, color="#64748b")
        axes[0].set_ylabel("Ising spin s_i")
        axes[0].set_xlabel("Pore")
        axes[0].set_title("Spin configuration")

        axes[1].bar(range(1, n + 1), x_opt, color=[COLORS["active"] if v else COLORS["inactive"] for v in x_opt])
        axes[1].set_ylim(-0.1, 1.2)
        axes[1].set_ylabel("Binary x_i")
        axes[1].set_xlabel("Pore")
        axes[1].set_title("Binary pore variables")
        plt.tight_layout()
        plt.show()

        chart_notes(
            (
                "Spin configuration (left)",
                "Ising spins s_i in {-1, +1}: **+1** (blue) = active pore, **-1** (grey) = passive. "
                "This is the standard form for quantum/Ising annealers; same physics as the QUBO binary variables.",
            ),
            (
                "Binary pore variables (right)",
                "Equivalent view x_i in {0, 1}. Mapping x_i = (1 + s_i)/2 links the engineering binary decision "
                "to spin hardware. Pores 1, 2, and 6 are ON; 3, 4, and 5 are OFF in the optimal feasible layout.",
            ),
        )
        """
    )
)

cells.append(
    md(
        """
        ## 11. Solver convergence comparison (six-pore)

        Energy traces for **simulated annealing** and **Ising mean field** on the same QUBO.
        """
    )
)

cells.append(
    code(
        """
        fig, axes = plt.subplots(1, 2, figsize=(12, 4))
        axes[0].plot(res_sa6["history"][::5], color=COLORS["classical"], lw=1.5, label="Simulated annealing")
        axes[0].axhline(result["H"], color=COLORS["feasible"], ls="--", label="Exhaustive optimum H(x)")
        axes[0].set_xlabel("Iteration (sampled)")
        axes[0].set_ylabel("H(x)")
        axes[0].set_title("SA convergence — 6 pores")
        axes[0].legend()
        axes[0].grid(alpha=0.3)

        axes[1].plot(res_ising6.get("history", [res_ising6["H"]]), color=COLORS["quantum"], lw=1.5, label="Ising-inspired")
        axes[1].axhline(result["H"], color=COLORS["feasible"], ls="--", label="Exhaustive optimum H(x)")
        axes[1].set_xlabel("Iteration")
        axes[1].set_ylabel("H(x)")
        axes[1].set_title("Ising-inspired search — 6 pores")
        axes[1].legend()
        axes[1].grid(alpha=0.3)
        plt.tight_layout()
        plt.show()

        chart_notes(
            (
                "SA convergence (left)",
                "Simulated annealing energy trace (sampled). H(x) decreases as temperature cools and flips are accepted. "
                "The dashed line is the exhaustive optimum — SA reaches the same feasible minimum on this small benchmark.",
            ),
            (
                "Ising-inspired search (right)",
                "Classical annealing on the Ising/QUBO landscape (same algorithm class as quantum annealing simulators). "
                "Both heuristics converge to the **same** H(x) as exhaustive search, validating the QUBO formulation.",
            ),
        )
        """
    )
)

cells.append(
    md(
        """
        ## 12. Interactive constraints

        Adjust $P_{\\max}$ and $K$ to see how the optimal feasible subset changes.
        """
    )
)

cells.append(
    code(
        """
        def run_benchmark_search(pmax_val, k_val):
            r = exhaustive_search(efficiency, pressure, q, pmax_val, k_val)
            if r is None:
                display(Markdown("**No feasible configuration** for these constraints."))
                return
            display(Markdown(
                f"**Active:** `{r['active_pores']}` · **η**={r['efficiency']:.2f} · "
                f"**P**={r['pressure']:.2f} · **H(x)**={r['H']:.3f} · **Feasible:** {r['feasible']}"
            ))

        if HAS_WIDGETS:
            interact(
                run_benchmark_search,
                pmax_val=FloatSlider(min=0.5, max=1.2, step=0.05, value=Pmax, description="Pmax"),
                k_val=IntSlider(min=1, max=6, value=K, description="K"),
            )
        else:
            run_benchmark_search(Pmax, K)

        display(Markdown(
            "**Interactive commentary:** Move **Pmax** (pressure budget) and **K** (max active pores). "
            "When Pmax is tight, high-pressure pores drop out of the optimum; when K is small, only the best "
            "efficiency-pressure trade-offs survive. If no feasible layout exists, the notebook reports it — "
            "this mirrors real membrane design where constraints can make a configuration impossible."
        ))
        """
    )
)

cells.append(
    md(
        """
        ## 13. Dynamic 6×8 network — simulated annealing

        $n = 48$ binary variables, search space $2^{48}$. Exhaustive search is impractical; **classical SA** finds a low-energy **feasible** layout.

        **Before running:** execute Sections **5** (imports), **6** (benchmark data), and **7** (QUBO functions) above, or use *Runtime → Run all*.
        """
    )
)

cells.append(
    code(
        """
        # --- Prerequisites (Sections 5, 6, 7 must be run first) ---
        _need = ["np", "plt", "simulated_annealing", "evaluate", "Pmax", "K", "lambda_p", "COLORS"]
        _missing = [name for name in _need if name not in globals()]
        if _missing:
            raise RuntimeError(
                "Section 13 requires earlier cells. Use Runtime → Run all, or run Sections 5, 6, and 7 first. "
                f"Missing: {_missing}"
            )

        def generate_network(channels=6, pores_per_channel=8, seed=42):
            rng = np.random.default_rng(seed)
            n_vars = channels * pores_per_channel
            eff = rng.uniform(0.45, 0.95, n_vars)
            pres = rng.uniform(0.10, 0.40, n_vars)
            q_mat = np.zeros((n_vars, n_vars))
            ch_ids = np.repeat(np.arange(channels), pores_per_channel)
            for c in range(channels):
                s = c * pores_per_channel
                for i in range(s, s + pores_per_channel - 1):
                    q_mat[i, i + 1] = q_mat[i + 1, i] = rng.uniform(0.01, 0.06)
                if c > 0:
                    q_mat[s, s - 1] = q_mat[s - 1, s] = rng.uniform(0.02, 0.05)
            return eff, pres, q_mat, ch_ids, channels, pores_per_channel

        # Scaled constraints for 6×8 network (same logic as web Simulation Mode defaults)
        Pmax_big = 2.40   # total pressure budget across 48 pores
        K_big = 12        # allow ~2 active pores per channel on average

        print("Building 6×8 network and running simulated annealing…")
        eff_big, pres_big, q_big, ch_big, C, Ppc = generate_network()
        n_big = C * Ppc
        res_big = simulated_annealing(
            eff_big, pres_big, q_big, Pmax_big, K_big, ch_big,
            seed=42, max_iter=3000, prefer_feasible=True,
        )

        x_grid = np.asarray(res_big["x"], dtype=int).reshape(C, Ppc)
        sa_ms = max(res_big["runtime"] * 1000, 0.01)

        print(f"Network: {C} x {Ppc} = {n_big} variables | search space 2^{n_big}")
        print(f"Constraints: Pmax={Pmax_big:.2f}, K={K_big}")
        print(f"Active pores: {len(res_big['active_pores'])} | eta={res_big['efficiency']:.2f} | P={res_big['pressure']:.2f}")
        print(f"Feasible: {res_big['feasible']} | H(x)={res_big['H']:.3f} | SA runtime: {sa_ms:.1f} ms")

        fig, axes = plt.subplots(1, 3, figsize=(14, 4.5))

        hist = res_big.get("history") or [res_big["H"]]
        axes[0].plot(hist, color=COLORS["flow"], lw=2, marker="o", ms=3)
        axes[0].set_xlabel("Annealing progress (sampled steps)")
        axes[0].set_ylabel("H(x)")
        axes[0].set_title("SA convergence — 48 variables")
        axes[0].grid(alpha=0.3)

        im = axes[1].imshow(x_grid, aspect="auto", cmap="Blues", vmin=0, vmax=1, interpolation="nearest")
        axes[1].set_xlabel("Pore index in channel")
        axes[1].set_ylabel("Channel")
        axes[1].set_yticks(range(C))
        axes[1].set_yticklabels([f"C{i+1}" for i in range(C)])
        axes[1].set_title(f"Active pore heatmap ({len(res_big['active_pores'])} active)")
        fig.colorbar(im, ax=axes[1], fraction=0.046, pad=0.04)

        # Do not mix 2^48 and milliseconds on one axis — use annotation bars instead
        labels = ["Exhaustive\\n2^48 states", "SA\\n(this run)"]
        values = [48, 1]  # illustrative relative cost (log scale)
        bars = axes[2].bar(labels, values, color=[COLORS["infeasible"], COLORS["classical"]], edgecolor="white")
        axes[2].set_yscale("log")
        axes[2].set_ylabel("Relative cost (illustrative, log)")
        axes[2].set_title("Why SA for n=48?")
        axes[2].text(0, 48 * 1.15, "Impractical", ha="center", fontsize=9, color=COLORS["infeasible"])
        axes[2].text(1, 1.15, f"{sa_ms:.0f} ms", ha="center", fontsize=9, color=COLORS["classical"])
        for b, v in zip(bars, values):
            axes[2].text(b.get_x() + b.get_width() / 2, v, str(v), ha="center", va="bottom", fontsize=8)

        plt.suptitle("Dynamic 6×8 nanoporous network — QUBO + simulated annealing", fontsize=12, y=1.02)
        plt.tight_layout()
        plt.show()

        if not res_big["feasible"]:
            print("Note: SA did not find a feasible layout with these constraints. Try increasing Pmax_big or K_big.")

        chart_notes(
            (
                "SA convergence — 48 variables (left)",
                "Energy H(x) vs annealing progress. Even with 2^48 possible states, SA finds a low-energy **feasible** "
                "layout in about one second on CPU. The curve typically plateaus once penalties no longer dominate.",
            ),
            (
                "Active pore heatmap (centre)",
                "Rows = channels (C1-C6), columns = pore index within channel. **Dark blue** = active. "
                "SA spreads activations across channels while respecting Pmax_big and K_big — a realistic nanoporous pattern.",
            ),
            (
                "Why SA for n=48? (right)",
                "Exhaustive search over 2^48 states is labelled **Impractical** (log scale). SA completes in milliseconds, "
                "which is why heuristics replace exact search beyond small benchmarks — same logic as the web Simulation Mode.",
            ),
        )
        """
    )
)

cells.append(
    md(
        """
        ## 14. Summary dashboard — classical vs QUBO

        Side-by-side summary of all methods run in this notebook.
        """
    )
)

cells.append(
    code(
        """
        if "res_big" not in globals():
            raise RuntimeError("Run Section 13 first to define res_big.")

        summary = pd.DataFrame([
            {
                "Method": "Classical naive",
                "Network": "6 pores",
                "Active": str(res_naive["active_pores"]),
                "eta": res_naive["efficiency"],
                "P": res_naive["pressure"],
                "Feasible": res_naive["feasible"],
                "H(x)": round(res_naive["H"], 3),
            },
            {
                "Method": "QUBO exhaustive",
                "Network": "6 pores",
                "Active": str(result["active_pores"]),
                "eta": result["efficiency"],
                "P": result["pressure"],
                "Feasible": result["feasible"],
                "H(x)": round(result["H"], 3),
            },
            {
                "Method": "QUBO simulated annealing",
                "Network": "6 pores",
                "Active": str(res_sa6["active_pores"]),
                "eta": res_sa6["efficiency"],
                "P": res_sa6["pressure"],
                "Feasible": res_sa6["feasible"],
                "H(x)": round(res_sa6["H"], 3),
            },
            {
                "Method": "QUBO Ising-inspired annealing",
                "Network": "6 pores",
                "Active": str(res_ising6["active_pores"]),
                "eta": res_ising6["efficiency"],
                "P": res_ising6["pressure"],
                "Feasible": res_ising6["feasible"],
                "H(x)": round(res_ising6["H"], 3),
            },
            {
                "Method": "QUBO simulated annealing",
                "Network": "6×8 = 48",
                "Active": f"{len(res_big['active_pores'])} pores",
                "eta": round(res_big["efficiency"], 2),
                "P": round(res_big["pressure"], 2),
                "Feasible": res_big["feasible"],
                "H(x)": round(res_big["H"], 3),
            },
        ])
        display(summary)

        fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
        small = summary[summary["Network"] == "6 pores"]
        x = np.arange(len(small))
        w = 0.35
        axes[0].bar(x - w/2, small["eta"], w, label="eta", color=COLORS["flow"])
        axes[0].bar(x + w/2, small["P"], w, label="P", color="#fb8c00")
        axes[0].axhline(Pmax, color=COLORS["infeasible"], ls="--", label="Pmax (6-pore)")
        axes[0].set_xticks(x)
        axes[0].set_xticklabels(["Naive", "Exhaust.", "SA", "Ising"], rotation=15)
        axes[0].set_title("Six-pore: eta and P by method")
        axes[0].legend()
        axes[0].grid(axis="y", alpha=0.3)

        runtimes = [
            res_naive.get("runtime", 0) or 0,
            result["runtime"],
            res_sa6["runtime"],
            res_ising6["runtime"],
            res_big["runtime"],
        ]
        rt_labels = ["Naive", "Exhaust.", "SA (6)", "Ising (6)", "SA (48)"]
        axes[1].bar(rt_labels, [r * 1000 for r in runtimes], color=COLORS["classical"], edgecolor="white")
        axes[1].set_ylabel("Runtime (ms)")
        axes[1].set_title("Measured runtimes (Colab CPU)")
        axes[1].grid(axis="y", alpha=0.3)
        plt.tight_layout()
        plt.show()

        chart_notes(
            (
                "Six-pore: eta and P by method (left)",
                "Grouped bars compare total efficiency (green) and pressure (orange) for all six-pore solvers. "
                "Only **Classical naive** exceeds Pmax (dashed line). QUBO methods share the same feasible eta/P pair.",
            ),
            (
                "Measured runtimes (right)",
                "Wall-clock time on Colab CPU. Exhaustive search is fast at n=6 but impossible at n=48. "
                "SA on 48 variables remains practical (~1 s), closing the gap between teaching benchmarks and scalable design.",
            ),
        )
        """
    )
)

cells.append(
    md(
        """
        ## 15. Discussion

        | Finding | Explanation |
        |---------|-------------|
        | Naive classical fails | Top-3 by $f_i$ gives {1,2,4} with $P=0.90 > P_{\\max}$ |
        | QUBO selects {1,2,6} | Minimizing $H(\\mathbf{x})$ under penalties yields feasible optimum |
        | Methods agree | Exhaustive search and SA match on six-pore benchmark |
        | Scaling | Exhaustive for $n=6$; SA for $n=48$; quantum hardware is future work |
        | No quantum advantage claimed | QUBO is a structured optimization language for teaching and PoC |

        **Next steps:** CFD-derived coefficients, experimental pressure-flow data, embedding on quantum annealers.

        ---
        **Web demo:** `frontend/index.html` — Presentation Mode (24 slides) + Live Simulation.
        """
    )
)

nb = {
    "nbformat": 4,
    "nbformat_minor": 5,
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3",
        },
        "language_info": {
            "name": "python",
            "version": "3.10.0",
        },
        "colab": {"provenance": []},
    },
    "cells": cells,
}


def build_notebook(backup: bool = True) -> Path:
    """Write teaching_mode_colab.ipynb next to this script."""
    out = Path(__file__).resolve().parent / "teaching_mode_colab.ipynb"
    if backup and out.exists():
        bak = out.with_suffix(".ipynb.bak")
        bak.write_text(out.read_text(encoding="utf-8"), encoding="utf-8")
        print(f"Backup: {bak.name}")
    out.write_text(json.dumps(nb, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(cells)} cells -> {out}")
    return out


def verify_notebook(path: Path) -> bool:
    """Compile-check every code cell."""
    data = json.loads(path.read_text(encoding="utf-8"))
    ok = True
    for i, cell in enumerate(data.get("cells", [])):
        if cell.get("cell_type") != "code":
            continue
        src = "".join(cell.get("source", []))
        try:
            compile(src, f"cell_{i}", "exec")
        except SyntaxError as exc:
            print(f"VERIFY FAIL cell {i}: {exc}")
            ok = False
    print("Verify: OK" if ok else "Verify: FAILED")
    return ok


if __name__ == "__main__":
    import argparse
    import sys

    parser = argparse.ArgumentParser(
        description="Generate notebooks/teaching_mode_colab.ipynb from this builder script."
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Do not create teaching_mode_colab.ipynb.bak before overwrite",
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Only verify existing notebook, do not rebuild",
    )
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    out_path = script_dir / "teaching_mode_colab.ipynb"

    if args.verify_only:
        if not out_path.exists():
            print(f"Not found: {out_path}", file=sys.stderr)
            sys.exit(1)
        sys.exit(0 if verify_notebook(out_path) else 1)

    out_path = build_notebook(backup=not args.no_backup)
    if not verify_notebook(out_path):
        sys.exit(1)
