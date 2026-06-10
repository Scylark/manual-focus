#!/usr/bin/env python3
"""
Generate PNG title and outro cards for a HeyGen video render.

The Homebrew ffmpeg build does not include libfreetype, so the
drawtext filter is unavailable. We render the text in PIL, save
the cards as PNGs, then ffmpeg composes them into the video without
needing drawtext.

Usage:
    python3 make-cards.py <output-folder> [--title "TEXT"] [--subtitle "TEXT"]
                                          [--outro-url "URL"]
                                          [--outro-tagline "TEXT"]
                                          [--outro-cta "TEXT"]

Writes title.png and outro.png into <output-folder>.
"""
from __future__ import annotations
import argparse
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# Manual Focus brand palette.
BG = (10, 10, 10)          # dark background, matches /lens hero
WHITE = (255, 255, 255)
ACCENT = (255, 31, 92)     # primary brand pink/magenta
GRAY = (170, 170, 170)
MUTED = (100, 100, 100)

# Card dimensions, matched to HeyGen 9:16 vertical render.
W, H = 1080, 1920

# Font candidates, picked from macOS system fonts. Impact is a bold
# condensed display face that fills the "THE LENS" title nicely.
DISPLAY_FONT = "/System/Library/Fonts/Supplemental/Impact.ttf"
BODY_FONT = "/System/Library/Fonts/HelveticaNeue.ttc"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size=size)
    except OSError as exc:
        sys.exit(f"Font load failed for {path}: {exc}")


def measure(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def draw_centred(
    img: Image.Image,
    text: str,
    fnt: ImageFont.FreeTypeFont,
    colour: tuple[int, int, int],
    y: int,
) -> None:
    draw = ImageDraw.Draw(img)
    text_w, _ = measure(draw, text, fnt)
    x = (W - text_w) // 2
    draw.text((x, y), text, font=fnt, fill=colour)


def make_title(out_path: Path, title: str, subtitle: str) -> None:
    img = Image.new("RGB", (W, H), BG)

    title_fnt = font(DISPLAY_FONT, 220)
    subtitle_fnt = font(BODY_FONT, 70)
    eyebrow_fnt = font(BODY_FONT, 36)

    # Subtle eyebrow at the top so the card feels branded, not generic.
    eyebrow_text = "000 · THE LENS"
    draw_centred(img, eyebrow_text, eyebrow_fnt, MUTED, y=int(H * 0.18))

    # Big display title, slightly above centre.
    title_text = title.upper()
    draw_centred(img, title_text, title_fnt, WHITE, y=int(H * 0.36))

    # Accent line below the title for the brand colour cue.
    draw = ImageDraw.Draw(img)
    line_w = 200
    line_y = int(H * 0.51)
    draw.rectangle(
        [(W - line_w) // 2, line_y, (W + line_w) // 2, line_y + 6],
        fill=ACCENT,
    )

    # Subtitle in accent.
    draw_centred(img, subtitle, subtitle_fnt, ACCENT, y=int(H * 0.55))

    img.save(out_path)


def make_outro(
    out_path: Path,
    url: str,
    tagline: str,
    cta: str,
) -> None:
    img = Image.new("RGB", (W, H), BG)

    eyebrow_fnt = font(BODY_FONT, 36)
    url_fnt = font(DISPLAY_FONT, 96)
    tagline_fnt = font(BODY_FONT, 54)
    cta_fnt = font(BODY_FONT, 60)

    # Eyebrow.
    draw_centred(img, "THE LENS", eyebrow_fnt, MUTED, y=int(H * 0.22))

    # URL as the main payload.
    draw_centred(img, url, url_fnt, WHITE, y=int(H * 0.33))

    # Accent line.
    draw = ImageDraw.Draw(img)
    line_w = 200
    line_y = int(H * 0.49)
    draw.rectangle(
        [(W - line_w) // 2, line_y, (W + line_w) // 2, line_y + 6],
        fill=ACCENT,
    )

    # Tagline beneath the line.
    draw_centred(img, tagline, tagline_fnt, GRAY, y=int(H * 0.53))

    # CTA pill at the bottom third.
    draw_centred(img, cta, cta_fnt, ACCENT, y=int(H * 0.65))

    img.save(out_path)


def make_urlbar(out_path: Path, url: str) -> None:
    # Translucent bottom strip with the URL. Saved with alpha so ffmpeg
    # can overlay it over the talking-head footage.
    strip_h = 110
    img = Image.new("RGBA", (W, strip_h), (0, 0, 0, 140))  # 55% black
    fnt = font(BODY_FONT, 42)
    draw = ImageDraw.Draw(img)
    text_w, text_h = measure(draw, url, fnt)
    draw.text(
        ((W - text_w) // 2, (strip_h - text_h) // 2 - 4),
        url,
        font=fnt,
        fill=WHITE,
    )
    img.save(out_path)


def make_badge(out_path: Path, text: str) -> None:
    # Floating badge for mid-video annotation. Pink pill with text.
    pad_x, pad_y = 40, 24
    fnt = font(BODY_FONT, 52)

    # Measure first against a temp image, then size the badge to fit.
    tmp = Image.new("RGBA", (W, 200), (0, 0, 0, 0))
    tmp_draw = ImageDraw.Draw(tmp)
    text_w, text_h = measure(tmp_draw, text, fnt)

    badge_w = text_w + 2 * pad_x
    badge_h = text_h + 2 * pad_y

    img = Image.new("RGBA", (badge_w, badge_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Rounded-rectangle pill.
    radius = badge_h // 2
    draw.rounded_rectangle(
        [(0, 0), (badge_w - 1, badge_h - 1)],
        radius=radius,
        fill=ACCENT,
    )
    draw.text(
        (pad_x, pad_y - 4),
        text,
        font=fnt,
        fill=WHITE,
    )
    img.save(out_path)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("output_folder")
    p.add_argument("--title", default="The Lens")
    p.add_argument("--subtitle", default="Your AI marketing team.")
    p.add_argument("--outro-url", default="manual-focus.co.uk/lens")
    p.add_argument("--outro-tagline", default="Free to read.  Free to install.")
    p.add_argument("--outro-cta", default="Subscribe in the post.")
    p.add_argument("--urlbar-text", default="manual-focus.co.uk/lens")
    p.add_argument("--badge-text", default="46 playbooks · 26 skills · free")
    args = p.parse_args()

    out = Path(args.output_folder)
    out.mkdir(parents=True, exist_ok=True)

    make_title(out / "title.png", args.title, args.subtitle)
    make_outro(
        out / "outro.png",
        args.outro_url,
        args.outro_tagline,
        args.outro_cta,
    )
    make_urlbar(out / "urlbar.png", args.urlbar_text)
    make_badge(out / "badge.png", args.badge_text)

    print(f"✅ Wrote title.png, outro.png, urlbar.png, badge.png to {out}/")


if __name__ == "__main__":
    main()
