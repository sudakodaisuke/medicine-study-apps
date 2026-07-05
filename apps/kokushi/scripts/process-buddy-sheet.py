from __future__ import annotations

import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image


POSES = [
    "idle",
    "correct",
    "wrong",
    "excellent",
    "thinking",
    "level-up",
    "bonus",
    "sleepy",
    "encourage",
    "surprised",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Split a 5x2 buddy expression sheet into transparent 640px PNG files."
    )
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--chroma-helper", required=True, type=Path)
    parser.add_argument(
        "--skip-despill",
        action="store_true",
        help="Preserve subject colors when they are close to the chroma key color.",
    )
    parser.add_argument(
        "--edge-contract",
        type=int,
        default=0,
        help="Shrink the visible alpha matte by this many pixels.",
    )
    parser.add_argument(
        "--min-component-area",
        type=int,
        default=0,
        help="Remove disconnected alpha components smaller than this many pixels.",
    )
    return parser.parse_args()


def remove_chroma(
    helper: Path,
    source: Path,
    output: Path,
    *,
    skip_despill: bool,
    edge_contract: float,
) -> None:
    command = [
        sys.executable,
        str(helper),
        "--input",
        str(source),
        "--out",
        str(output),
        "--auto-key",
        "border",
        "--soft-matte",
        "--transparent-threshold",
        "12",
        "--opaque-threshold",
        "220",
        "--force",
    ]
    if not skip_despill:
        command.append("--despill")
    if edge_contract:
        command.extend(["--edge-contract", str(edge_contract)])
    subprocess.run(command, check=True)


def normalized_sprite(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    if not box:
        raise ValueError(f"No visible pixels found after chroma removal: {source}")

    sprite = image.crop(box)
    max_width = 560
    max_height = 560
    scale = min(max_width / sprite.width, max_height / sprite.height)
    size = (
        max(1, round(sprite.width * scale)),
        max(1, round(sprite.height * scale)),
    )
    sprite = sprite.resize(size, Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    offset = ((640 - sprite.width) // 2, (640 - sprite.height) // 2)
    canvas.alpha_composite(sprite, offset)
    return canvas


def remove_small_components(source: Path, min_area: int) -> None:
    if min_area <= 0:
        return

    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    width, height = image.size
    alpha_pixels = alpha.load()
    seen = bytearray(width * height)
    components_to_clear: list[list[tuple[int, int]]] = []

    for start_y in range(height):
        for start_x in range(width):
            start_index = start_y * width + start_x
            if seen[start_index] or alpha_pixels[start_x, start_y] == 0:
                continue

            stack = [(start_x, start_y)]
            seen[start_index] = 1
            component: list[tuple[int, int]] = []

            while stack:
                x, y = stack.pop()
                component.append((x, y))
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    index = ny * width + nx
                    if seen[index] or alpha_pixels[nx, ny] == 0:
                        continue
                    seen[index] = 1
                    stack.append((nx, ny))

            if len(component) < min_area:
                components_to_clear.append(component)

    if not components_to_clear:
        return

    for component in components_to_clear:
        for x, y in component:
            alpha.putpixel((x, y), 0)
    image.putalpha(alpha)
    image.save(source)


def validate_sprite(image: Image.Image, pose: str) -> None:
    alpha = image.getchannel("A")
    if alpha.getbbox() is None:
        raise ValueError(f"{pose}: generated sprite is empty")

    corners = [
        alpha.getpixel((0, 0)),
        alpha.getpixel((639, 0)),
        alpha.getpixel((0, 639)),
        alpha.getpixel((639, 639)),
    ]
    if any(corners):
        raise ValueError(f"{pose}: expected transparent corners, got {corners}")


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    sheet = Image.open(args.input).convert("RGB")

    with tempfile.TemporaryDirectory(prefix="buddy-sheet-") as tmp:
        tmp_dir = Path(tmp)
        for index, pose in enumerate(POSES):
            column = index % 5
            row = index // 5
            box = (
                round(sheet.width * column / 5),
                round(sheet.height * row / 2),
                round(sheet.width * (column + 1) / 5),
                round(sheet.height * (row + 1) / 2),
            )
            cell = sheet.crop(box)
            source = tmp_dir / f"{pose}-source.png"
            transparent = tmp_dir / f"{pose}-transparent.png"
            destination = args.output_dir / f"{pose}.png"
            cell.save(source)
            remove_chroma(
                args.chroma_helper,
                source,
                transparent,
                skip_despill=args.skip_despill,
                edge_contract=args.edge_contract,
            )
            remove_small_components(transparent, args.min_component_area)
            sprite = normalized_sprite(transparent)
            validate_sprite(sprite, pose)
            sprite.save(destination)

    print(f"wrote {len(POSES)} sprites to {args.output_dir}")


if __name__ == "__main__":
    main()
