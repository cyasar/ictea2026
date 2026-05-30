"""QUBO Hamiltonian for nanoporous oxygen flow optimization.

Authors:
    Prof. Dr. Eden Mamut
    Dr. Cumali Yaşar (Yazılım Geliştirme)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable

import numpy as np


@dataclass
class QUBOParams:
    pmax: float = 0.80
    k_active: int = 3
    lambda_p: float = 50.0
    lambda_k: float = 50.0
    lambda_c: float = 5.0


@dataclass
class PoreData:
    efficiency: np.ndarray
    pressure: np.ndarray
    interaction: np.ndarray = field(default_factory=lambda: np.zeros((0, 0)))
    channel_ids: np.ndarray | None = None


def six_pore_benchmark() -> PoreData:
    """Default six-pore benchmark from the paper specification."""
    efficiency = np.array([0.90, 0.75, 0.60, 0.85, 0.50, 0.70])
    pressure = np.array([0.30, 0.25, 0.20, 0.35, 0.15, 0.25])
    n = len(efficiency)
    interaction = np.zeros((n, n))
    return PoreData(efficiency=efficiency, pressure=pressure, interaction=interaction)


def continuity_penalty(x: np.ndarray, channel_ids: np.ndarray | None) -> float:
    """Penalize channels with no active pore when neighbors are active."""
    if channel_ids is None or len(x) == 0:
        return 0.0
    penalty = 0.0
    channels = np.unique(channel_ids)
    active_channels = {int(c) for c, flag in zip(channel_ids, x) if flag == 1}
    for ch in channels:
        ch = int(ch)
        if ch not in active_channels:
            left = ch - 1 in active_channels
            right = ch + 1 in active_channels
            if left or right:
                penalty += 1.0
    return penalty


def hamiltonian(x: np.ndarray, data: PoreData, params: QUBOParams) -> float:
    """Compute H(x) for binary configuration x."""
    x = np.asarray(x, dtype=int)
    n = len(x)
    eff = data.efficiency[:n]
    pres = data.pressure[:n]
    q = data.interaction[:n, :n] if data.interaction.size else np.zeros((n, n))

    flow_reward = -float(np.sum(eff * x))
    hydraulic = float(np.sum(q * np.outer(x, x)))
    total_pressure = float(np.sum(pres * x))
    pressure_violation = max(0.0, total_pressure - params.pmax) ** 2
    active_violation = max(0.0, float(np.sum(x)) - params.k_active) ** 2
    cont = continuity_penalty(x, data.channel_ids)

    return (
        flow_reward
        + hydraulic
        + params.lambda_p * pressure_violation
        + params.lambda_k * active_violation
        + params.lambda_c * cont
    )


def evaluate_solution(
    x: Iterable[int], data: PoreData, params: QUBOParams
) -> dict:
    """Return metrics for a binary solution."""
    x_arr = np.asarray(list(x), dtype=int)
    n = len(x_arr)
    eff = data.efficiency[:n]
    pres = data.pressure[:n]
    total_eff = float(np.sum(eff * x_arr))
    total_pres = float(np.sum(pres * x_arr))
    active = [i + 1 for i, v in enumerate(x_arr) if v == 1]
    feasible = total_pres <= params.pmax + 1e-9 and len(active) <= params.k_active
    return {
        "x": x_arr.tolist(),
        "hamiltonian": hamiltonian(x_arr, data, params),
        "total_efficiency": total_eff,
        "total_pressure": total_pres,
        "active_pores": active,
        "active_count": len(active),
        "feasible": feasible,
    }


def binary_to_spin(x: np.ndarray) -> np.ndarray:
    return 2 * np.asarray(x, dtype=int) - 1


def spin_to_binary(s: np.ndarray) -> np.ndarray:
    return ((np.asarray(s) + 1) // 2).astype(int)
