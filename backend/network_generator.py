"""Generate multi-channel nanoporous network data.

Authors:
    Prof. Dr. Eden Mamut
    Dr. Cumali Yaşar (Yazılım Geliştirme)
"""

from __future__ import annotations

import numpy as np

from qubo_model import PoreData


def generate_network(
    channels: int = 6,
    pores_per_channel: int = 8,
    seed: int | None = 42,
) -> PoreData:
    """Build C x P pore network with random efficiency and pressure."""
    rng = np.random.default_rng(seed)
    n = channels * pores_per_channel
    efficiency = rng.uniform(0.45, 0.95, size=n)
    pressure = rng.uniform(0.10, 0.40, size=n)
    channel_ids = np.repeat(np.arange(channels), pores_per_channel)

    interaction = np.zeros((n, n))
    for c in range(channels):
        start = c * pores_per_channel
        end = start + pores_per_channel
        for i in range(start, end - 1):
            interaction[i, i + 1] = interaction[i + 1, i] = rng.uniform(0.01, 0.06)
        if c > 0:
            interaction[start, start - 1] = interaction[start - 1, start] = rng.uniform(
                0.02, 0.05
            )

    return PoreData(
        efficiency=efficiency,
        pressure=pressure,
        interaction=interaction,
        channel_ids=channel_ids,
    )


def network_to_json(data: PoreData, channels: int, pores_per_channel: int) -> dict:
    n = len(data.efficiency)
    return {
        "channels": channels,
        "pores_per_channel": pores_per_channel,
        "n_variables": n,
        "search_space": 2**n,
        "efficiency": data.efficiency.tolist(),
        "pressure": data.pressure.tolist(),
        "interaction": data.interaction.tolist(),
        "channel_ids": data.channel_ids.tolist() if data.channel_ids is not None else [],
    }
