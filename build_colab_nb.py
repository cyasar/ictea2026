"""Run the Colab notebook builder from the project root."""
import runpy
from pathlib import Path

runpy.run_path(
    str(Path(__file__).resolve().parent / "notebooks" / "build_colab_nb.py"),
    run_name="__main__",
)
