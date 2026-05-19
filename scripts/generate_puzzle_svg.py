#!/usr/bin/env python3
"""Generate Corel-compatible SVG puzzle cutlines.

Creates an A4 puzzle vector with natural-looking jigsaw tabs.
No external dependencies required.
"""

from __future__ import annotations

import argparse
import random
from pathlib import Path


def build_puzzle_svg(width_mm: float, height_mm: float, cols: int, rows: int, include_dimensions: bool) -> str:
    cell_w = width_mm / cols
    cell_h = height_mm / rows
    rng = random.Random(20260429)

    v_seams = {}
    for c in range(1, cols):
        for r in range(rows):
            v_seams[(c, r)] = {
                "dir": 1 if (c + r) % 2 == 0 else -1,
                "amp": cell_w * (0.145 + rng.random() * 0.015),
                "span": cell_h * (0.40 + rng.random() * 0.05),
                "shift": (rng.random() - 0.5) * cell_h * 0.06,
                "wave_a": (rng.random() - 0.5) * cell_w * 0.03,
                "wave_b": (rng.random() - 0.5) * cell_w * 0.03,
            }

    h_seams = {}
    for r in range(1, rows):
        for c in range(cols):
            h_seams[(c, r)] = {
                "dir": -1 if (c + r) % 2 == 0 else 1,
                "amp": cell_h * (0.145 + rng.random() * 0.015),
                "span": cell_w * (0.40 + rng.random() * 0.05),
                "shift": (rng.random() - 0.5) * cell_w * 0.06,
                "wave_a": (rng.random() - 0.5) * cell_h * 0.03,
                "wave_b": (rng.random() - 0.5) * cell_h * 0.03,
            }

    def h_piece(x0: float, y: float, x1: float, seam: dict[str, float]) -> list[str]:
        xm = (x0 + x1) / 2.0 + seam["shift"]
        amp = seam["amp"] * seam["dir"]
        span = seam["span"]
        wave_a = seam["wave_a"]
        wave_b = seam["wave_b"]
        x_a = xm - span / 2.0
        x_b = xm + span / 2.0
        r = abs(amp)
        sign = 1.0 if amp >= 0 else -1.0
        y_peak = y + amp

        return [
            f"C {x0 + (x_a - x0) * 0.33:.3f} {y + wave_a * 0.35:.3f} {x0 + (x_a - x0) * 0.72:.3f} {y + wave_a:.3f} {x_a:.3f} {y + wave_a:.3f}",
            f"C {xm - r * 1.05:.3f} {y + wave_a:.3f} {xm - r * 0.90:.3f} {y_peak - sign * r * 0.28:.3f} {xm:.3f} {y_peak:.3f}",
            f"C {xm + r * 0.90:.3f} {y_peak - sign * r * 0.28:.3f} {xm + r * 1.05:.3f} {y + wave_b:.3f} {x_b:.3f} {y + wave_b:.3f}",
            f"C {x_b + (x1 - x_b) * 0.28:.3f} {y + wave_b:.3f} {x_b + (x1 - x_b) * 0.67:.3f} {y + wave_b * 0.35:.3f} {x1:.3f} {y:.3f}",
        ]

    def v_piece(x: float, y0: float, y1: float, seam: dict[str, float]) -> list[str]:
        ym = (y0 + y1) / 2.0 + seam["shift"]
        amp = seam["amp"] * seam["dir"]
        span = seam["span"]
        wave_a = seam["wave_a"]
        wave_b = seam["wave_b"]
        y_a = ym - span / 2.0
        y_b = ym + span / 2.0
        r = abs(amp)
        sign = 1.0 if amp >= 0 else -1.0
        x_peak = x + amp

        return [
            f"C {x + wave_a * 0.35:.3f} {y0 + (y_a - y0) * 0.33:.3f} {x + wave_a:.3f} {y0 + (y_a - y0) * 0.72:.3f} {x + wave_a:.3f} {y_a:.3f}",
            f"C {x + wave_a:.3f} {ym - r * 1.05:.3f} {x_peak - sign * r * 0.28:.3f} {ym - r * 0.90:.3f} {x_peak:.3f} {ym:.3f}",
            f"C {x_peak - sign * r * 0.28:.3f} {ym + r * 0.90:.3f} {x + wave_b:.3f} {ym + r * 1.05:.3f} {x + wave_b:.3f} {y_b:.3f}",
            f"C {x + wave_b:.3f} {y_b + (y1 - y_b) * 0.28:.3f} {x + wave_b * 0.35:.3f} {y_b + (y1 - y_b) * 0.67:.3f} {x:.3f} {y1:.3f}",
        ]

    outer = f"M 0 0 L {width_mm:.3f} 0 L {width_mm:.3f} {height_mm:.3f} L 0 {height_mm:.3f} Z"

    internal_paths: list[str] = []
    for c in range(1, cols):
        x = c * cell_w
        cmds = [f"M {x:.3f} 0.000"]
        for r in range(rows):
            y0, y1 = r * cell_h, (r + 1) * cell_h
            cmds.extend(v_piece(x, y0, y1, v_seams[(c, r)]))
        internal_paths.append(" ".join(cmds))

    for r in range(1, rows):
        y = r * cell_h
        cmds = [f"M 0.000 {y:.3f}"]
        for c in range(cols):
            x0, x1 = c * cell_w, (c + 1) * cell_w
            cmds.extend(h_piece(x0, y, x1, h_seams[(c, r)]))
        internal_paths.append(" ".join(cmds))

    lines = [
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
        f"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"{width_mm}mm\" height=\"{height_mm}mm\" viewBox=\"0 0 {width_mm} {height_mm}\" version=\"1.1\">",
        f"  <title>Puzzle {cols}x{rows}</title>",
        "  <defs>",
        "    <style>",
        "      .border { fill: none; stroke: #111111; stroke-width: 0.35; }",
        "      .cut { fill: none; stroke: #d90000; stroke-width: 0.25; }",
        "      .dim { fill: none; stroke: #0066cc; stroke-width: 0.2; }",
        "      .txt { font-family: Arial, sans-serif; font-size: 4px; fill: #0066cc; }",
        "    </style>",
        "    <marker id=\"arrow\" markerWidth=\"4\" markerHeight=\"4\" refX=\"2\" refY=\"2\" orient=\"auto\">",
        "      <path d=\"M0,0 L4,2 L0,4 z\" fill=\"#0066cc\" />",
        "    </marker>",
        "  </defs>",
        f"  <path class=\"border\" d=\"{outer}\"/>",
    ]

    for d in internal_paths:
        lines.append(f"  <path class=\"cut\" d=\"{d}\"/>")

    if include_dimensions:
        lines.extend(
            [
                f"  <line class=\"dim\" x1=\"5\" y1=\"{height_mm - 5:.3f}\" x2=\"{width_mm - 5:.3f}\" y2=\"{height_mm - 5:.3f}\" marker-start=\"url(#arrow)\" marker-end=\"url(#arrow)\"/>",
                f"  <text class=\"txt\" x=\"{width_mm / 2:.3f}\" y=\"{height_mm - 6.5:.3f}\" text-anchor=\"middle\">Leveys {width_mm:.0f} mm</text>",
                f"  <line class=\"dim\" x1=\"{width_mm - 2:.3f}\" y1=\"5\" x2=\"{width_mm - 2:.3f}\" y2=\"{height_mm - 5:.3f}\" marker-start=\"url(#arrow)\" marker-end=\"url(#arrow)\"/>",
                f"  <text class=\"txt\" x=\"{width_mm - 3.5:.3f}\" y=\"{height_mm / 2:.3f}\" transform=\"rotate(-90 {width_mm - 3.5:.3f} {height_mm / 2:.3f})\" text-anchor=\"middle\">Korkeus {height_mm:.0f} mm</text>",
                f"  <text class=\"txt\" x=\"6\" y=\"8\">Palapeli: {cols * rows} palaa ({cols} x {rows})</text>",
            ]
        )

    lines.append("</svg>")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate puzzle cutline SVG for CorelDRAW import")
    parser.add_argument("--out", default="tmp/incoming/puzzle_A4_15.svg", help="Output SVG path")
    parser.add_argument("--width", type=float, default=210.0, help="Document width in mm")
    parser.add_argument("--height", type=float, default=297.0, help="Document height in mm")
    parser.add_argument("--cols", type=int, default=5, help="Puzzle columns")
    parser.add_argument("--rows", type=int, default=3, help="Puzzle rows")
    parser.add_argument("--cut-only", action="store_true", help="Disable dimension annotations")
    args = parser.parse_args()

    if args.cols < 2 or args.rows < 2:
        raise SystemExit("cols and rows must be >= 2")

    svg = build_puzzle_svg(args.width, args.height, args.cols, args.rows, include_dimensions=not args.cut_only)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(svg, encoding="utf-8")
    print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
