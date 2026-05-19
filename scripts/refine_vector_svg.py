#!/usr/bin/env python3
"""Refine traced SVG paths for smoother, cleaner cut lines.

- Reduces jagged nodes with RDP simplification
- Applies geometric smoothing (Chaikin)
- Closes small open-end gaps with a configurable tolerance (mm)
"""

from __future__ import annotations

import argparse
import math
import statistics
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


CMD_RE = re.compile(r"([MLZ])|(-?\d+(?:\.\d+)?)", re.IGNORECASE)
PATH_RE = re.compile(r'd="([^"]+)"')
WIDTH_RE = re.compile(r'width="([0-9.]+)mm"')
HEIGHT_RE = re.compile(r'height="([0-9.]+)mm"')
VIEWBOX_RE = re.compile(r'viewBox="([0-9.\- ]+)"')


@dataclass
class SubPath:
    points: list[tuple[float, float]]
    closed: bool


def parse_path_d(d: str) -> list[SubPath]:
    tokens = CMD_RE.findall(d)
    seq: list[str] = []
    for cmd, num in tokens:
        seq.append(cmd.upper() if cmd else num)

    i = 0
    paths: list[SubPath] = []
    current: list[tuple[float, float]] = []
    closed = False
    mode = ""

    while i < len(seq):
        tok = seq[i]
        if tok in {"M", "L", "Z"}:
            mode = tok
            i += 1
            if mode == "Z":
                closed = True
                if current:
                    paths.append(SubPath(current, closed=True))
                current = []
                closed = False
            continue

        if mode in {"M", "L"}:
            x = float(tok)
            if i + 1 >= len(seq):
                break
            y = float(seq[i + 1])
            i += 2

            if mode == "M" and current:
                paths.append(SubPath(current, closed=closed))
                current = []
                closed = False
                mode = "L"
            current.append((x, y))
        else:
            i += 1

    if current:
        paths.append(SubPath(current, closed=closed))

    return paths


def point_line_distance(p: tuple[float, float], a: tuple[float, float], b: tuple[float, float]) -> float:
    if a == b:
        return math.dist(p, a)
    px, py = p
    ax, ay = a
    bx, by = b
    dx = bx - ax
    dy = by - ay
    t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    nx = ax + t * dx
    ny = ay + t * dy
    return math.hypot(px - nx, py - ny)


def rdp(points: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    if len(points) < 3:
        return points[:]
    a = points[0]
    b = points[-1]
    max_dist = -1.0
    idx = -1
    for i in range(1, len(points) - 1):
        d = point_line_distance(points[i], a, b)
        if d > max_dist:
            max_dist = d
            idx = i
    if max_dist > eps:
        left = rdp(points[: idx + 1], eps)
        right = rdp(points[idx:], eps)
        return left[:-1] + right
    return [a, b]


def chaikin_open(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    if len(points) < 3:
        return points[:]
    out = [points[0]]
    for i in range(len(points) - 1):
        p = points[i]
        q = points[i + 1]
        out.append((0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]))
        out.append((0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]))
    out.append(points[-1])
    return out


def chaikin_closed(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    if len(points) < 4:
        return points[:]
    out: list[tuple[float, float]] = []
    n = len(points)
    for i in range(n):
        p = points[i]
        q = points[(i + 1) % n]
        out.append((0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]))
        out.append((0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]))
    return out


def polygon_area(points: Iterable[tuple[float, float]]) -> float:
    pts = list(points)
    if len(pts) < 3:
        return 0.0
    s = 0.0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        s += x1 * y2 - x2 * y1
    return abs(s) * 0.5


def signed_polygon_area(points: Iterable[tuple[float, float]]) -> float:
    pts = list(points)
    if len(pts) < 3:
        return 0.0
    s = 0.0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        s += x1 * y2 - x2 * y1
    return s * 0.5


def polygon_perimeter(points: Iterable[tuple[float, float]]) -> float:
    pts = list(points)
    if len(pts) < 2:
        return 0.0
    total = 0.0
    for i in range(len(pts)):
        total += math.dist(pts[i], pts[(i + 1) % len(pts)])
    return total


def line_intersection(
    p1: tuple[float, float],
    d1: tuple[float, float],
    p2: tuple[float, float],
    d2: tuple[float, float],
) -> tuple[float, float] | None:
    det = d1[0] * d2[1] - d1[1] * d2[0]
    if abs(det) < 1e-9:
        return None
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    t = (dx * d2[1] - dy * d2[0]) / det
    return (p1[0] + d1[0] * t, p1[1] + d1[1] * t)


def outward_unit_normal(a: tuple[float, float], b: tuple[float, float], ccw: bool) -> tuple[float, float]:
    dx = b[0] - a[0]
    dy = b[1] - a[1]
    seg_len = math.hypot(dx, dy)
    if seg_len == 0.0:
        return (0.0, 0.0)
    if ccw:
        return (dy / seg_len, -dx / seg_len)
    return (-dy / seg_len, dx / seg_len)


def offset_closed_polygon(points: list[tuple[float, float]], delta: float) -> list[tuple[float, float]]:
    if len(points) < 3 or delta == 0.0:
        return points[:]

    ccw = signed_polygon_area(points) > 0.0
    out: list[tuple[float, float]] = []
    count = len(points)

    for i in range(count):
        prev_pt = points[(i - 1) % count]
        curr_pt = points[i]
        next_pt = points[(i + 1) % count]

        prev_dir = (curr_pt[0] - prev_pt[0], curr_pt[1] - prev_pt[1])
        next_dir = (next_pt[0] - curr_pt[0], next_pt[1] - curr_pt[1])
        prev_len = math.hypot(prev_dir[0], prev_dir[1])
        next_len = math.hypot(next_dir[0], next_dir[1])
        if prev_len == 0.0 or next_len == 0.0:
            out.append(curr_pt)
            continue

        prev_unit = (prev_dir[0] / prev_len, prev_dir[1] / prev_len)
        next_unit = (next_dir[0] / next_len, next_dir[1] / next_len)
        prev_normal = outward_unit_normal(prev_pt, curr_pt, ccw)
        next_normal = outward_unit_normal(curr_pt, next_pt, ccw)

        prev_offset_point = (curr_pt[0] + prev_normal[0] * delta, curr_pt[1] + prev_normal[1] * delta)
        next_offset_point = (curr_pt[0] + next_normal[0] * delta, curr_pt[1] + next_normal[1] * delta)
        intersect = line_intersection(prev_offset_point, prev_unit, next_offset_point, next_unit)

        if intersect is None:
            avg_normal = (prev_normal[0] + next_normal[0], prev_normal[1] + next_normal[1])
            avg_len = math.hypot(avg_normal[0], avg_normal[1])
            if avg_len == 0.0:
                out.append(prev_offset_point)
            else:
                out.append((curr_pt[0] + avg_normal[0] * delta / avg_len, curr_pt[1] + avg_normal[1] * delta / avg_len))
        else:
            out.append(intersect)

    return out


def bbox(points: Iterable[tuple[float, float]]) -> tuple[float, float, float, float]:
    pts = list(points)
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def is_axis_aligned_rect(points: list[tuple[float, float]], tol: float = 0.2) -> bool:
    if len(points) < 4:
        return False
    x0, y0, x1, y1 = bbox(points)
    corners = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
    hits = 0
    for cx, cy in corners:
        if any(math.dist((cx, cy), p) <= tol for p in points):
            hits += 1
    return hits >= 4


def catmull_rom_to_bezier(points: list[tuple[float, float]], closed: bool, tension: float = 1.0) -> str:
    if len(points) < 2:
        return ""

    pts = points[:]
    n = len(pts)
    if closed:
        d = [f"M {pts[0][0]:.3f} {pts[0][1]:.3f}"]
        for i in range(n):
            p0 = pts[(i - 1) % n]
            p1 = pts[i % n]
            p2 = pts[(i + 1) % n]
            p3 = pts[(i + 2) % n]
            cp1 = (p1[0] + (p2[0] - p0[0]) * tension / 6.0, p1[1] + (p2[1] - p0[1]) * tension / 6.0)
            cp2 = (p2[0] - (p3[0] - p1[0]) * tension / 6.0, p2[1] - (p3[1] - p1[1]) * tension / 6.0)
            d.append(f"C {cp1[0]:.3f} {cp1[1]:.3f} {cp2[0]:.3f} {cp2[1]:.3f} {p2[0]:.3f} {p2[1]:.3f}")
        d.append("Z")
        return " ".join(d)

    d = [f"M {pts[0][0]:.3f} {pts[0][1]:.3f}"]
    for i in range(n - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1 = pts[i]
        p2 = pts[i + 1]
        p3 = pts[i + 2] if i + 2 < n else pts[i + 1]
        cp1 = (p1[0] + (p2[0] - p0[0]) * tension / 6.0, p1[1] + (p2[1] - p0[1]) * tension / 6.0)
        cp2 = (p2[0] - (p3[0] - p1[0]) * tension / 6.0, p2[1] - (p3[1] - p1[1]) * tension / 6.0)
        d.append(f"C {cp1[0]:.3f} {cp1[1]:.3f} {cp2[0]:.3f} {cp2[1]:.3f} {p2[0]:.3f} {p2[1]:.3f}")
    return " ".join(d)


def points_to_attr(points: list[tuple[float, float]]) -> str:
    return " ".join(f"{x:.3f},{y:.3f}" for x, y in points)


def polyline_length(points: list[tuple[float, float]]) -> float:
    if len(points) < 2:
        return 0.0
    return sum(math.dist(points[i], points[i + 1]) for i in range(len(points) - 1))


def interpolate_along(points: list[tuple[float, float]], dist_target: float) -> tuple[float, float]:
    if not points:
        return (0.0, 0.0)
    if len(points) == 1:
        return points[0]
    acc = 0.0
    for i in range(len(points) - 1):
        a = points[i]
        b = points[i + 1]
        seg = math.dist(a, b)
        if acc + seg >= dist_target:
            t = 0.0 if seg == 0.0 else (dist_target - acc) / seg
            return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
        acc += seg
    return points[-1]


def resample_polyline(points: list[tuple[float, float]], count: int) -> list[tuple[float, float]]:
    if len(points) < 2 or count <= 2:
        return points[:]
    total = polyline_length(points)
    if total == 0.0:
        return [points[0]] * count
    return [interpolate_along(points, total * i / (count - 1)) for i in range(count)]


def circular_path(points: list[tuple[float, float]], start: int, end: int) -> list[tuple[float, float]]:
    n = len(points)
    out: list[tuple[float, float]] = []
    i = start
    while True:
        out.append(points[i])
        if i == end:
            break
        i = (i + 1) % n
    return out


def best_two_caps(points: list[tuple[float, float]]) -> tuple[int, int, float] | None:
    n = len(points)
    if n < 20:
        return None

    candidates: list[tuple[float, int, int]] = []
    min_sep = max(3, n // 12)
    max_sep = n - min_sep
    for i in range(n):
        for j in range(i + min_sep, n):
            sep = j - i
            if sep >= max_sep:
                continue
            d = math.dist(points[i], points[j])
            candidates.append((d, i, j))

    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0])
    best = candidates[0]
    return best[1], best[2], best[0]


def normalize_ribbon_gap(points: list[tuple[float, float]], gap_mm: float) -> tuple[list[tuple[float, float]], list[tuple[float, float]]] | None:
    # Detect thin "ribbon" loops (double-traced lines) and skip regular outlines.
    area = polygon_area(points)
    perim = polygon_perimeter(points)
    if area <= 0.0 or perim <= 0.0:
        return None
    # For a long strip: area ~= L*w, perimeter ~= 2L => w ~= 2*area/perimeter.
    avg_width = (2.0 * area) / perim
    # Isoperimetric roundness: near 1 for compact shapes, near 0 for thin ribbons.
    roundness = (4.0 * math.pi * area) / (perim * perim)

    if avg_width > max(1.6, gap_mm * 5.0):
        return None
    if roundness > 0.20:
        return None

    caps = best_two_caps(points)
    if caps is None:
        return None
    a_idx, b_idx, cap_dist = caps

    side1 = circular_path(points, a_idx, b_idx)
    side2 = circular_path(points, b_idx, a_idx)
    if len(side1) < 4 or len(side2) < 4:
        return None

    # Only normalize narrow ribbon-like loops; skip regular piece outlines.
    max_cap_for_ribbon = max(5.0, gap_mm * 20.0)
    if cap_dist > max_cap_for_ribbon:
        return None

    len1 = polyline_length(side1)
    len2 = polyline_length(side2)
    if len1 <= 0.0 or len2 <= 0.0:
        return None
    length_ratio = max(len1, len2) / min(len1, len2)
    if length_ratio > 1.6:
        return None

    side2 = side2[::-1]

    # Remove cap endpoints before normalization.
    side1_core = side1[1:-1]
    side2_core = side2[1:-1]
    if len(side1_core) < 3 or len(side2_core) < 3:
        return None

    sample_count = max(24, min(420, max(len(side1_core), len(side2_core))))
    p = resample_polyline(side1_core, sample_count)
    q = resample_polyline(side2_core, sample_count)

    distances = [math.dist(p[i], q[i]) for i in range(sample_count)]
    med = statistics.median(distances) if distances else 0.0
    if med <= 0.0:
        return None

    # If median lane width is large, this is likely not a trace ribbon.
    if med > max(2.2, gap_mm * 7.5):
        return None

    half = gap_mm / 2.0
    out1: list[tuple[float, float]] = []
    out2: list[tuple[float, float]] = []
    for i in range(sample_count):
        px, py = p[i]
        qx, qy = q[i]
        vx = qx - px
        vy = qy - py
        d = math.hypot(vx, vy)
        if d == 0.0:
            out1.append((px, py))
            out2.append((qx, qy))
            continue
        nx = vx / d
        ny = vy / d
        mx = (px + qx) / 2.0
        my = (py + qy) / 2.0
        out1.append((mx - nx * half, my - ny * half))
        out2.append((mx + nx * half, my + ny * half))

    return out1, out2


def normalize_ribbon_polygon(points: list[tuple[float, float]], gap_mm: float) -> list[tuple[float, float]] | None:
    normalized = normalize_ribbon_gap(points, gap_mm)
    if normalized is None:
        return None
    side1, side2 = normalized
    if len(side1) < 3 or len(side2) < 3:
        return None
    # Rebuild a single closed ribbon polygon: one side forward, the other backward.
    return side1 + list(reversed(side2))


def close_small_gaps(paths: list[SubPath], gap_tol_mm: float) -> None:
    open_idx = [i for i, sp in enumerate(paths) if not sp.closed and len(sp.points) >= 2]
    for i in range(len(open_idx)):
        a_idx = open_idx[i]
        a = paths[a_idx]
        for j in range(i + 1, len(open_idx)):
            b_idx = open_idx[j]
            b = paths[b_idx]
            if not a.points or not b.points:
                continue

            candidates = [
                (0, 0, math.dist(a.points[0], b.points[0])),
                (0, -1, math.dist(a.points[0], b.points[-1])),
                (-1, 0, math.dist(a.points[-1], b.points[0])),
                (-1, -1, math.dist(a.points[-1], b.points[-1])),
            ]
            which = min(candidates, key=lambda x: x[2])
            if which[2] <= gap_tol_mm:
                ax = a.points[which[0]][0]
                ay = a.points[which[0]][1]
                bx = b.points[which[1]][0]
                by = b.points[which[1]][1]
                mid = ((ax + bx) / 2.0, (ay + by) / 2.0)
                a.points[which[0]] = mid
                b.points[which[1]] = mid

    # Also snap near-closing ends within same open path.
    for sp in paths:
        if sp.closed or len(sp.points) < 3:
            continue
        if math.dist(sp.points[0], sp.points[-1]) <= gap_tol_mm:
            sp.closed = True
            sp.points[-1] = sp.points[0]


def refine_path(sp: SubPath, simplify_mm: float, smooth_passes: int, min_area_mm2: float) -> SubPath | None:
    pts = sp.points[:]
    if len(pts) < 2:
        return None

    if sp.closed and pts[0] == pts[-1]:
        pts = pts[:-1]

    if sp.closed:
        # rotate for stable simplification in closed loops
        pts = pts + [pts[0]]
        pts = rdp(pts, simplify_mm)
        if len(pts) >= 2 and pts[0] == pts[-1]:
            pts = pts[:-1]
    else:
        pts = rdp(pts, simplify_mm)

    for _ in range(max(0, smooth_passes)):
        pts = chaikin_closed(pts) if sp.closed else chaikin_open(pts)

    if sp.closed and polygon_area(pts) < min_area_mm2:
        return None

    if len(pts) < 2:
        return None

    return SubPath(points=pts, closed=sp.closed)


def main() -> int:
    parser = argparse.ArgumentParser(description="Refine traced SVG paths")
    parser.add_argument("--input", required=True, help="Input SVG path")
    parser.add_argument("--output", required=True, help="Output SVG path")
    parser.add_argument("--gap-tolerance-mm", type=float, default=0.3, help="Snap/close small gaps up to this distance")
    parser.add_argument("--simplify-mm", type=float, default=0.12, help="RDP simplification tolerance in mm")
    parser.add_argument("--smooth-passes", type=int, default=1, help="Chaikin smoothing passes")
    parser.add_argument("--min-area-mm2", type=float, default=1.5, help="Drop tiny closed artifacts below this area")
    parser.add_argument("--stroke-width", type=float, default=0.25, help="Stroke width in output SVG")
    parser.add_argument(
        "--outset-closed-mm",
        type=float,
        default=0.0,
        help="Offset all closed polygons outward by this amount to reduce line-to-line gaps",
    )
    parser.add_argument(
        "--corel-safe",
        action="store_true",
        help="Write polyline/polygon elements instead of long bezier paths for better Corel import compatibility",
    )
    parser.add_argument(
        "--normalize-gap-mm",
        type=float,
        default=0.0,
        help="If > 0, split closed ribbon polygons into two lines and normalize their line-to-line gap to this exact value",
    )
    args = parser.parse_args()

    src = Path(args.input).read_text(encoding="utf-8")
    width = WIDTH_RE.search(src)
    height = HEIGHT_RE.search(src)
    view_box = VIEWBOX_RE.search(src)

    w_mm = width.group(1) if width else "210"
    h_mm = height.group(1) if height else "297"
    vb = view_box.group(1) if view_box else f"0 0 {w_mm} {h_mm}"
    vb_parts = [float(v) for v in vb.split()]
    if len(vb_parts) == 4:
        vb_x, vb_y, vb_w, vb_h = vb_parts
    else:
        vb_x, vb_y, vb_w, vb_h = 0.0, 0.0, float(w_mm), float(h_mm)
    x_min = vb_x
    y_min = vb_y
    x_max = vb_x + vb_w
    y_max = vb_y + vb_h

    all_subpaths: list[SubPath] = []
    for m in PATH_RE.finditer(src):
        all_subpaths.extend(parse_path_d(m.group(1)))

    close_small_gaps(all_subpaths, args.gap_tolerance_mm)

    refined: list[SubPath] = []
    for sp in all_subpaths:
        rsp = refine_path(sp, args.simplify_mm, args.smooth_passes, args.min_area_mm2)
        if rsp is None:
            continue

        bx0, by0, bx1, by1 = bbox(rsp.points)

        # Drop artifact loops that go outside page bounds (the odd outer squiggle).
        bounds_margin = 0.2
        if bx0 < x_min - bounds_margin or by0 < y_min - bounds_margin or bx1 > x_max + bounds_margin or by1 > y_max + bounds_margin:
            continue

        # Drop full-page closed loops unless it is the axis-aligned document border.
        if rsp.closed:
            if args.outset_closed_mm > 0.0:
                rsp = SubPath(points=offset_closed_polygon(rsp.points, args.outset_closed_mm), closed=True)

            area = polygon_area(rsp.points)
            page_area = vb_w * vb_h
            if area > page_area * 0.85 and not is_axis_aligned_rect(rsp.points):
                continue

        refined.append(rsp)

    out_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w_mm}mm" height="{h_mm}mm" viewBox="{vb}" version="1.1">',
        '  <title>Refined vectorized bitmap</title>',
        f'  <g fill="none" stroke="#d90000" stroke-width="{args.stroke_width}" stroke-linejoin="round" stroke-linecap="round">',
    ]

    for sp in refined:
        if args.corel_safe and args.normalize_gap_mm > 0.0 and sp.closed:
            ribbon_poly = normalize_ribbon_polygon(sp.points, args.normalize_gap_mm)
            if ribbon_poly is not None:
                pts = points_to_attr(ribbon_poly)
                if pts:
                    out_lines.append(f'    <polygon points="{pts}"/>')
                continue

        if args.corel_safe:
            pts = points_to_attr(sp.points)
            if not pts:
                continue
            if sp.closed:
                out_lines.append(f'    <polygon points="{pts}"/>')
            else:
                out_lines.append(f'    <polyline points="{pts}"/>')
        else:
            d = catmull_rom_to_bezier(sp.points, sp.closed, tension=1.0)
            if d:
                out_lines.append(f'    <path d="{d}"/>')

    out_lines += ["  </g>", "</svg>"]

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(out_lines), encoding="utf-8")
    print(out_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
