#!/usr/bin/env python3
"""Generate the social preview image and app icons for andreclaudino.com.

Outputs (checked in, no build step on the site):
  assets/og-image.png          1200x630  Open Graph / Twitter large card
  assets/apple-touch-icon.png   180x180  iOS home screen icon
  assets/icon-192.png           192x192  PWA / Android
  assets/icon-512.png           512x512  PWA / Android

Usage: python3 scripts/make-social-assets.py
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

GROTESK_BOLD = "/usr/share/fonts/truetype/space-grotesk/SpaceGrotesk-Bold.ttf"
GROTESK_MEDIUM = "/usr/share/fonts/truetype/space-grotesk/SpaceGrotesk-Medium.ttf"
INTER_SEMIBOLD = "/home/claudino/.local/share/fonts/inter/Inter-SemiBold.otf"
INTER_REGULAR = "/home/claudino/.local/share/fonts/inter/Inter-Regular.otf"
MONO = "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf"

FG = (250, 250, 252, 255)
MUTED = (161, 161, 170, 255)
ACCENT_A = (124, 58, 237)
ACCENT_B = (37, 99, 235)


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default(size)


def gradient(size: tuple[int, int], start, end, angle: float) -> Image.Image:
    """Linear gradient rendered small, then smoothly upscaled."""
    w = h = 96
    small = Image.new("RGB", (w, h))
    px = small.load()
    dx, dy = math.cos(angle), math.sin(angle)
    for y in range(h):
        for x in range(w):
            t = ((x / (w - 1)) * dx + (y / (h - 1)) * dy + 1) / 2
            t = min(max(t, 0.0), 1.0)
            px[x, y] = tuple(round(start[i] + (end[i] - start[i]) * t) for i in range(3))
    return small.resize(size, Image.BICUBIC).convert("RGBA")


def glow(canvas: Image.Image, center, radius: int, color, strength: float) -> None:
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    steps = 48
    for i in range(steps, 0, -1):
        r = radius * i / steps
        alpha = int(255 * strength * (1 - i / steps) ** 2)
        draw.ellipse((center[0] - r, center[1] - r, center[0] + r, center[1] + r), fill=color + (alpha,))
    canvas.alpha_composite(layer)


def centered_text(draw, box, text, fnt, fill):
    x0, y0, x1, y1 = box
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text((x0 + (x1 - x0 - tw) / 2 - bbox[0], y0 + (y1 - y0 - th) / 2 - bbox[1]), text, font=fnt, fill=fill)


def make_og_image() -> None:
    W, H = 1200, 630
    img = gradient((W, H), (13, 13, 20), (26, 17, 52), math.radians(32))
    glow(img, (1120, 40), 460, ACCENT_A, 0.45)
    glow(img, (60, 620), 440, ACCENT_B, 0.35)

    draw = ImageDraw.Draw(img)

    # brand bar
    bar = gradient((W, 6), ACCENT_A, ACCENT_B, 0.0)
    img.alpha_composite(bar, (0, 0))

    # translucent boxes live on their own layer so alpha actually blends
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)

    # brand mark
    odraw.rounded_rectangle(
        (80, 64, 168, 152), radius=24, fill=(255, 255, 255, 22), outline=(255, 255, 255, 150), width=3
    )
    img.alpha_composite(overlay)
    draw = ImageDraw.Draw(img)
    centered_text(draw, (80, 64, 168, 152), "AC", font(GROTESK_BOLD, 46), FG)

    draw.text((198, 70), "André Claudino", font=font(GROTESK_MEDIUM, 36), fill=FG)
    draw.text((200, 118), "andreclaudino.com", font=font(MONO, 19), fill=MUTED)

    # headline
    f_head = font(GROTESK_BOLD, 68)
    draw.text((78, 222), "I turn AI and data", font=f_head, fill=FG)
    draw.text((78, 300), "into reliable products.", font=f_head, fill=FG)

    draw.text(
        (80, 404),
        "Senior AI/ML · Backend · MLOps engineer",
        font=font(INTER_REGULAR, 27),
        fill=(214, 214, 219, 255),
    )

    chips = ["Generative AI", "LLM agents", "Rust", "Python", "Kubernetes", "FinOps"]
    f_chip = font(INTER_SEMIBOLD, 19)
    chip_overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    cdraw = ImageDraw.Draw(chip_overlay)
    chip_boxes = []
    x, y = 80, 470
    for chip in chips:
        bbox = draw.textbbox((0, 0), chip, font=f_chip)
        w = bbox[2] - bbox[0] + 36
        if x + w > W - 80:
            x, y = 80, y + 56
        box = (x, y, x + w, y + 42)
        cdraw.rounded_rectangle(box, radius=21, fill=(255, 255, 255, 26), outline=(255, 255, 255, 90), width=1)
        chip_boxes.append((box, chip))
        x += w + 12

    img.alpha_composite(chip_overlay)
    draw = ImageDraw.Draw(img)
    for box, chip in chip_boxes:
        draw.text((box[0] + 18, box[1] + 9), chip, font=f_chip, fill=(230, 230, 234, 255))

    draw.text(
        (80, 566),
        "Consultant · Author · Speaker · Professor · Creator",
        font=font(INTER_REGULAR, 21),
        fill=MUTED,
    )

    img.convert("RGB").save(ASSETS / "og-image.png", optimize=True)


def make_icon(size: int, name: str) -> None:
    img = gradient((size, size), ACCENT_A, ACCENT_B, math.radians(45))
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * 0.22), fill=255)
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    icon.paste(img, (0, 0), mask)
    centered_text(ImageDraw.Draw(icon), (0, 0, size, size), "AC", font(GROTESK_BOLD, int(size * 0.40)), (255, 255, 255, 255))
    icon.save(ASSETS / name, optimize=True)


if __name__ == "__main__":
    ASSETS.mkdir(exist_ok=True)
    make_og_image()
    make_icon(180, "apple-touch-icon.png")
    make_icon(192, "icon-192.png")
    make_icon(512, "icon-512.png")
    print("wrote:", ", ".join(p.name for p in sorted(ASSETS.glob("*.png"))))
