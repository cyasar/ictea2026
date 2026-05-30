"""Flask API for QUBO nanopore optimization.

Authors:
    Prof. Dr. Eden Mamut
    Dr. Cumali Yaşar (Yazılım Geliştirme)
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

from authors import AUTHORS, AUTHORS_LINE, EVENT, PROJECT_TITLE
from network_generator import generate_network, network_to_json
from optimizers import run_optimizer
from qubo_model import PoreData, QUBOParams, six_pore_benchmark

app = Flask(__name__)
CORS(app)

EXHAUSTIVE_MAX_N = 20


def _params_from_body(body: dict) -> QUBOParams:
    return QUBOParams(
        pmax=float(body.get("pmax", 0.80)),
        k_active=int(body.get("k_active", 3)),
        lambda_p=float(body.get("lambda_p", 10.0)),
        lambda_k=float(body.get("lambda_k", 10.0)),
        lambda_c=float(body.get("lambda_c", 5.0)),
    )


def _data_from_body(body: dict) -> tuple[PoreData, int, int]:
    if body.get("benchmark") or body.get("use_benchmark"):
        data = six_pore_benchmark()
        return data, 1, 6

    channels = int(body.get("channels", 6))
    pores = int(body.get("pores_per_channel", 8))
    seed = body.get("seed")
    seed = int(seed) if seed is not None else 42

    if "efficiency" in body and "pressure" in body:
        import numpy as np

        eff = np.array(body["efficiency"], dtype=float)
        pres = np.array(body["pressure"], dtype=float)
        q = np.array(body.get("interaction", []), dtype=float)
        if q.size == 0:
            q = np.zeros((len(eff), len(eff)))
        ch = body.get("channel_ids")
        channel_ids = np.array(ch) if ch else None
        data = PoreData(
            efficiency=eff, pressure=pres, interaction=q, channel_ids=channel_ids
        )
    else:
        data = generate_network(channels, pores, seed=seed)

    return data, channels, pores


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "project": PROJECT_TITLE,
        "event": EVENT,
        "authors": AUTHORS,
        "authors_line": AUTHORS_LINE,
    })


@app.route("/api/benchmark", methods=["GET"])
def benchmark():
    data = six_pore_benchmark()
    params = QUBOParams()
    return jsonify(
        {
            "network": network_to_json(data, 1, 6),
            "params": {
                "pmax": params.pmax,
                "k_active": params.k_active,
                "lambda_p": params.lambda_p,
                "lambda_k": params.lambda_k,
                "lambda_c": params.lambda_c,
            },
            "expected": {
                "active_pores": [1, 2, 6],
                "total_efficiency": 2.35,
                "total_pressure": 0.80,
                "feasible": True,
            },
        }
    )


@app.route("/api/optimize", methods=["POST"])
def optimize():
    body = request.get_json(force=True, silent=True) or {}
    params = _params_from_body(body)
    data, channels, pores = _data_from_body(body)
    n = len(data.efficiency)
    method = body.get("method", "simulated_annealing")

    if method == "exhaustive" and n > EXHAUSTIVE_MAX_N:
        return jsonify(
            {
                "error": f"Exhaustive search disabled for n={n}. Max {EXHAUSTIVE_MAX_N}.",
                "n_variables": n,
                "search_space": 2**n,
            }
        ), 400

    try:
        result = run_optimizer(
            method, data, params, seed=int(body.get("seed", 42)), exhaustive_max_n=EXHAUSTIVE_MAX_N
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    result["n_variables"] = n
    result["search_space"] = 2**n
    result["channels"] = channels
    result["pores_per_channel"] = pores
    result["network"] = network_to_json(data, channels, pores)
    result["params"] = {
        "pmax": params.pmax,
        "k_active": params.k_active,
        "lambda_p": params.lambda_p,
        "lambda_k": params.lambda_k,
        "lambda_c": params.lambda_c,
    }
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
