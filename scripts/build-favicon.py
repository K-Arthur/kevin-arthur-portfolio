#!/usr/bin/env python3
"""Pack existing PNG icons into a real favicon.ico (PNG-in-ICO)."""

from pathlib import Path
import struct

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def png_size(data: bytes) -> tuple[int, int]:
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")
    width = int.from_bytes(data[16:20], "big")
    height = int.from_bytes(data[20:24], "big")
    return width, height


def write_ico(png_paths: list[Path], dest: Path) -> None:
    images = []
    for path in png_paths:
        data = path.read_bytes()
        width, height = png_size(data)
        images.append((width, height, data))

    count = len(images)
    header = struct.pack("<HHH", 0, 1, count)
    entries = b""
    payload = b""
    offset = 6 + 16 * count
    for width, height, data in images:
        entries += struct.pack(
            "<BBBBHHII",
            width if width < 256 else 0,
            height if height < 256 else 0,
            0,
            0,
            1,
            32,
            len(data),
            offset,
        )
        payload += data
        offset += len(data)

    dest.write_bytes(header + entries + payload)
    print(f"Wrote {dest} ({dest.stat().st_size} bytes, {count} PNG image(s))")


def main() -> None:
    sources = [
        PUBLIC / "favicon-16x16.png",
        PUBLIC / "favicon-32x32.png",
        PUBLIC / "apple-touch-icon.png",
    ]
    existing = [p for p in sources if p.exists()]
    if not existing:
        raise SystemExit("No source PNGs found")
    write_ico(existing, PUBLIC / "favicon.ico")


if __name__ == "__main__":
    main()
