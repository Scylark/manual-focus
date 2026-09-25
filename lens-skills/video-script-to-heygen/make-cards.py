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
from itertools import combinations
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


def split_lines(text: str, n: int) -> list[list[str]]:
    # Every way of breaking the words into n consecutive lines.
    words = text.split()
    if n == 1 or len(words) < n:
        return [[text]] if n == 1 else []
    splits = []
    for cuts in combinations(range(1, len(words)), n - 1):
        bounds = (0, *cuts, len(words))
        splits.append([" ".join(words[a:b]) for a, b in zip(bounds, bounds[1:])])
    return splits


def fit_title(
    text: str,
    max_size: int,
    min_size: int,
    max_width: int,
    max_height: int,
    max_lines: int = 3,
) -> tuple[ImageFont.FreeTypeFont, list[str]]:
    # Find the largest size at which the title fits the card, trying one
    # line first and wrapping onto up to max_lines lines if that lets the
    # type stay bigger. Long titles shrink or wrap instead of clipping at
    # the card edges.
    draw = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    best: tuple[int, ImageFont.FreeTypeFont, list[str]] | None = None
    for n in range(1, max_lines + 1):
        for size in range(max_size, min_size - 1, -10):
            if best and size <= best[0]:
                break
            fnt = font(DISPLAY_FONT, size)
            # A single line keeps the original layout. Wrapped titles must
            # also clear the accent line below.
            if n > 1 and sum(fnt.getmetrics()) * n > max_height:
                continue
            fitted = [
                lines for lines in split_lines(text, n)
                if all(measure(draw, line, fnt)[0] <= max_width for line in lines)
            ]
            if fitted:
                best = (size, fnt, fitted[0])
                break
    if best is None:
        # One unbreakable word that is still too wide: keep shrinking.
        size = min_size
        fnt = font(DISPLAY_FONT, size)
        while size > 20 and measure(draw, text, fnt)[0] > max_width:
            size -= 5
            fnt = font(DISPLAY_FONT, size)
        return fnt, [text]
    return best[1], best[2]


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

    title_top = int(H * 0.36)
    line_y = int(H * 0.51)
    title_fnt, title_lines = fit_title(
        title.upper(),
        max_size=220,
        min_size=60,
        max_width=W - 120,
        max_height=line_y - 40 - title_top,
    )
    subtitle_fnt = font(BODY_FONT, 70)
    eyebrow_fnt = font(BODY_FONT, 36)

    # Subtle eyebrow at the top so the card feels branded, not generic.
    eyebrow_text = "000 · THE LENS"
    draw_centred(img, eyebrow_text, eyebrow_fnt, MUTED, y=int(H * 0.18))

    # Big display title, slightly above centre, sized to fit the card.
    line_h = sum(title_fnt.getmetrics())
    for i, line in enumerate(title_lines):
        draw_centred(img, line, title_fnt, WHITE, y=title_top + i * line_h)

    # Accent line below the title for the brand colour cue.
    draw = ImageDraw.Draw(img)
    line_w = 200
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
    p.add_argument("--badge-text", default="47 playbooks · 28 skills · free")
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

    print(f"Wrote title.png, outro.png, urlbar.png, badge.png to {out}/")


if __name__ == "__main__":
    main()
