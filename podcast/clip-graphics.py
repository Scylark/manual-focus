#!/usr/bin/env python3
"""Draws the still layers of a podcast clip for podcast/make-clips.mjs.

ffmpeg on the Mac has no text filters (no freetype or libass), so every piece
of type is drawn here with Pillow and ffmpeg only composites PNGs, the audio
and the waveform. The look follows public/images/podcast-cover.jpg: the
#0A0A0B background, the pink to purple to cyan gradient, the two rings, Arial
Narrow uppercase display type and small spaced-out monospace labels.

Usage: python3 podcast/clip-graphics.py <spec.json>
The spec (written by make-clips.mjs) names the output folder, the post
title and the caption states. Writes into that folder:
  bg.png        the static frame: gradient bar, label, title, rings, footer
  bar.png       the dark strip that slides off the top bar as progress
  wave.png      the gradient the waveform is cut out of
  endcard.png   the closing card
  cap-NNN.png   one transparent caption image per caption state
"""

import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
BG = (10, 10, 11)
TEXT = (242, 237, 230)
MUTED = (140, 135, 128)
DIM = (90, 86, 80)
PINK, PURPLE, CYAN = (255, 45, 120), (192, 38, 211), (0, 229, 255)
SPEAKER_COLOUR = {'JAMES': PINK, 'HANNAH': CYAN}
MARGIN = 90

# Layout, in pixels from the top. YouTube's Shorts buttons cover the bottom
# fifth and the right edge, so nothing that matters sits there.
BAR_H = 12
LABEL_Y = 150
TITLE_Y = 215
RINGS_CY = 765
WAVE_Y, WAVE_H = 965, 140  # make-clips.mjs uses the same numbers
CAPTION_Y, CAPTION_H = 1150, 300
FOOTER_Y = 1480

FONT_DIR = '/System/Library/Fonts/Supplemental'
NARROW = os.path.join(FONT_DIR, 'Arial Narrow.ttf')
NARROW_BOLD = os.path.join(FONT_DIR, 'Arial Narrow Bold.ttf')
MONO = '/System/Library/Fonts/Menlo.ttc'


def font(path, size):
    return ImageFont.truetype(path, size)


def gradient(width, height, diagonal=False):
    """Pink to purple to cyan, left to right (or top-left to bottom-right)."""
    img = Image.new('RGB', (width, height))
    px = img.load()
    for y in range(height):
        for x in range(width):
            t = (x / max(width - 1, 1)) if not diagonal else (x + y) / max(width + height - 2, 1)
            a, b, u = (PINK, PURPLE, t * 2) if t < 0.5 else (PURPLE, CYAN, (t - 0.5) * 2)
            px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * u) for i in range(3))
    return img


def spaced(draw, xy, text, fnt, fill, tracking):
    """Monospace label with letter spacing, as on the cover."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x


def spaced_width(draw, text, fnt, tracking):
    return sum(draw.textlength(ch, font=fnt) + tracking for ch in text) - tracking


def wrap(draw, text, fnt, width):
    lines, line = [], ''
    for word in text.split():
        trial = f'{line} {word}'.strip()
        if draw.textlength(trial, font=fnt) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def rings(size, stroke):
    """The logo's two interlocking rings, gradient-stroked, antialiased."""
    scale = 3
    w, h = size, round(size * 1.53)
    r = size / 2 - stroke / 2
    mask = Image.new('L', (w * scale, h * scale), 0)
    d = ImageDraw.Draw(mask)
    for cy in (size / 2, h - size / 2):
        box = [(w / 2 - r - stroke / 2) * scale, (cy - r - stroke / 2) * scale,
               (w / 2 + r + stroke / 2) * scale, (cy + r + stroke / 2) * scale]
        d.ellipse(box, outline=255, width=stroke * scale)
    mask = mask.resize((w, h), Image.LANCZOS)
    layer = gradient(w, h, diagonal=True).convert('RGBA')
    layer.putalpha(mask)
    return layer


def title_block(draw, title, top, max_lines=4):
    """Post title in Arial Narrow uppercase, shrunk until it fits."""
    for size in (80, 74, 68, 62, 56):
        fnt = font(NARROW, size)
        lines = wrap(draw, title.upper(), fnt, W - 2 * MARGIN)
        if len(lines) <= max_lines:
            break
    lines = lines[:max_lines]
    y = top
    for line in lines:
        draw.text((MARGIN, y), line, font=fnt, fill=TEXT)
        y += round(size * 1.02)
    return y


def background(spec, out):
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    # The cover's top bar doubles as the progress bar: a dark strip (bar.png)
    # slides off it to the right as the clip plays.
    img.paste(gradient(W, BAR_H), (0, 0))
    mono = font(MONO, 30)
    x = spaced(d, (MARGIN, LABEL_Y), 'MANUAL FOCUS', mono, TEXT, 7)
    spaced(d, (x + 7, LABEL_Y), ' · THE PODCAST', mono, MUTED, 7)
    title_block(d, spec['title'], TITLE_Y)
    ring = rings(205, 15)
    img.paste(ring, ((W - ring.width) // 2, RINGS_CY - ring.height // 2), ring)
    small = font(MONO, 24)
    text = 'AI-GENERATED VOICES · MANUAL-FOCUS.CO.UK'
    spaced(d, ((W - spaced_width(d, text, small, 4)) / 2, FOOTER_Y), text, small, DIM, 4)
    img.save(os.path.join(out, 'bg.png'))
    Image.new('RGBA', (W, BAR_H), BG + (200,)).save(os.path.join(out, 'bar.png'))
    gradient(W - 2 * MARGIN, WAVE_H).save(os.path.join(out, 'wave.png'))


def endcard(out):
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    img.paste(gradient(W, BAR_H), (0, 0))
    ring = rings(230, 17)
    img.paste(ring, ((W - ring.width) // 2, 330), ring)
    mono = font(MONO, 32)
    y = 760
    label = 'FULL EPISODE'
    spaced(d, ((W - spaced_width(d, label, mono, 8)) / 2, y), label, mono, MUTED, 8)
    big = font(NARROW, 132)
    y += 80
    for line in ('MANUAL FOCUS', 'PODCAST'):
        d.text(((W - d.textlength(line, font=big)) / 2, y), line, font=big, fill=TEXT)
        y += 136
    site = font(NARROW, 70)
    y += 70
    text = 'MANUAL-FOCUS.CO.UK'
    d.text(((W - d.textlength(text, font=site)) / 2, y), text, font=site, fill=TEXT)
    y += 130
    text = 'APPLE PODCASTS · SPOTIFY'
    spaced(d, ((W - spaced_width(d, text, mono, 8)) / 2, y), text, mono, MUTED, 8)
    small = font(MONO, 24)
    text = 'AI-GENERATED VOICES'
    spaced(d, ((W - spaced_width(d, text, small, 4)) / 2, FOOTER_Y), text, small, DIM, 4)
    img.save(os.path.join(out, 'endcard.png'))


def caption(state, path):
    """Speaker name, then the current few words with the spoken one lit."""
    img = Image.new('RGBA', (W, CAPTION_H), (0, 0, 0, 0))
    if state.get('words'):
        d = ImageDraw.Draw(img)
        colour = SPEAKER_COLOUR[state['speaker']]
        name = font(MONO, 30)
        label = state['speaker']
        lx = (W - spaced_width(d, label, name, 8)) / 2
        d.ellipse([lx - 30, 12, lx - 14, 28], fill=colour)
        spaced(d, (lx, 4), label, name, colour, 8)
        words = [w.upper() for w in state['words']]
        for size in (104, 94, 84, 76):
            fnt = font(NARROW_BOLD, size)
            lines = wrap(d, ' '.join(words), fnt, W - 2 * MARGIN)
            if len(lines) <= 2:
                break
        space = d.textlength(' ', font=fnt)
        y = 70 if len(lines) == 2 else 70 + size // 2
        i = 0
        for line in lines:
            parts = line.split(' ')
            x = (W - d.textlength(line, font=fnt)) / 2
            for part in parts:
                d.text((x, y), part, font=fnt, fill=colour if i == state['active'] else TEXT)
                x += d.textlength(part, font=fnt) + space
                i += 1
            y += round(size * 1.08)
    img.save(path)


def main():
    spec = json.load(open(sys.argv[1]))
    out = spec['out']
    os.makedirs(out, exist_ok=True)
    background(spec, out)
    endcard(out)
    for i, state in enumerate(spec['states']):
        caption(state, os.path.join(out, f'cap-{i:03d}.png'))


if __name__ == '__main__':
    main()
