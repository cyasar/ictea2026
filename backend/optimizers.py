"""Optimization algorithms for QUBO nanopore selection.

Authors:
    Prof. Dr. Eden Mamut
    Dr. Cumali Yaşar (Yazılım Geliştirme)
"""

from __future__ import annotations

import itertools
import time
from typing import Callable

import numpy as np

from qubo_model import PoreData, QUBOParams, evaluate_solution, hamiltonian, spin_to_binary


def exhaustive_search(
    data: PoreData, params: QUBOParams, max_n: int = 20
) -> dict:
    """Try all 2^n configurations; disabled for large n."""
    n = len(data.efficiency)
    if n > max_n:
        raise ValueError(f"Exhaustive search disabled for n={n} (max {max_n})")

    t0 = time.perf_counter()
    best_x = None
    best_h = float("inf")
    best_feas_x = None
    best_feas_h = float("inf")
    history = []

    for bits in itertools.product([0, 1], repeat=n):
        x = np.array(bits, dtype=int)
        h = hamiltonian(x, data, params)
        history.append(h)
        ev = evaluate_solution(x, data, params)
        if ev["feasible"] and h < best_feas_h:
            best_feas_h = h
            best_feas_x = x.copy()
        if h < best_h:
            best_h = h
            best_x = x.copy()

    if best_feas_x is not None:
        best_x = best_feas_x

    runtime = time.perf_counter() - t0
    result = evaluate_solution(best_x, data, params)
    result.update(
        {
            "method": "exhaustive",
            "runtime": runtime,
            "energy_history": history[:512],
            "iterations": len(history),
        }
    )
    return result


def simulated_annealing(
    data: PoreData,
    params: QUBOParams,
    seed: int = 42,
    max_iter: int = 5000,
    t_start: float = 2.0,
    t_end: float = 0.01,
) -> dict:
    """Simulated annealing for approximate QUBO minimum."""
    rng = np.random.default_rng(seed)
    n = len(data.efficiency)
    x = rng.integers(0, 2, size=n)
    current_h = hamiltonian(x, data, params)
    best_x = x.copy()
    best_h = current_h
    history = [current_h]

    t0 = time.perf_counter()
    for step in range(max_iter):
        temp = t_start * ((t_end / t_start) ** (step / max(max_iter - 1, 1)))
        i = rng.integers(0, n)
        x_new = x.copy()
        x_new[i] = 1 - x_new[i]
        new_h = hamiltonian(x_new, data, params)
        delta = new_h - current_h
        if delta < 0 or rng.random() < np.exp(-delta / max(temp, 1e-12)):
            x = x_new
            current_h = new_h
            if current_h < best_h:
                best_h = current_h
                best_x = x.copy()
        history.append(current_h)

    runtime = time.perf_counter() - t0
    result = evaluate_solution(best_x, data, params)
    result.update(
        {
            "method": "simulated_annealing",
            "runtime": runtime,
            "energy_history": history[:: max(1, len(history) // 500)],
            "iterations": max_iter,
        }
    )
    return result


def ising_mean_field_search(
    data: PoreData,
    params: QUBOParams,
    seed: int = 42,
    max_iter: int = 200,
    learning_rate: float = 0.15,
) -> dict:
    """Simple mean-field inspired search on spin variables."""
    rng = np.random.default_rng(seed)
    n = len(data.efficiency)
    m = rng.uniform(-0.5, 0.5, size=n)
    history = []

    def energy_from_probs(p: np.ndarray) -> float:
        x = (p > 0.5).astype(int)
        return hamiltonian(x, data, params)

    t0 = time.perf_counter()
    for _ in range(max_iter):
        x_soft = ((m + 1) / 2).clip(0, 1)
        grad = np.zeros(n)
        for i in range(n):
            grad[i] -= data.efficiency[i]
            grad[i] += 2 * params.lambda_p * max(
                0, np.sum(data.pressure * x_soft) - params.pmax
            ) * data.pressure[i]
            grad[i] += 2 * params.lambda_k * max(0, np.sum(x_soft) - params.k_active)
        m -= learning_rate * grad + rng.normal(0, 0.02, size=n)
        m = np.clip(m, -1, 1)
        history.append(energy_from_probs((m + 1) / 2))

    x_final = spin_to_binary(np.sign(m))
    x_final[x_final < 0] = 0
    runtime = time.perf_counter() - t0
    result = evaluate_solution(x_final, data, params)
    result.update(
        {
            "method": "ising_mean_field",
            "runtime": runtime,
            "energy_history": history,
            "iterations": max_iter,
        }
    )
    return result


def run_optimizer(
    method: str,
    data: PoreData,
    params: QUBOParams,
    seed: int = 42,
    exhaustive_max_n: int = 20,
) -> dict:
    """Dispatch to selected optimizer."""
    dispatch: dict[str, Callable] = {
        "exhaustive": lambda: exhaustive_search(data, params, exhaustive_max_n),
        "simulated_annealing": lambda: simulated_annealing(data, params, seed=seed),
        "ising_mean_field": lambda: ising_mean_field_search(data, params, seed=seed),
    }
    if method not in dispatch:
        raise ValueError(f"Unknown method: {method}")
    return dispatch[method]()
