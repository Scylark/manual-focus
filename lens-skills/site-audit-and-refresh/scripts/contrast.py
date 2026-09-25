#!/usr/bin/env python3
"""WCAG 2 contrast ratio for pairs of hex colours.

Usage: python3 contrast.py <fg> <bg> [<fg> <bg> ...]
Example: python3 contrast.py '#4A4845' '#0A0A0B' '#7F7A73' '#0A0A0B'

AA needs 4.5:1 for body text and 3:1 for large text (24px, or 18.66px bold).
"""
import sys


def luminance(hex_colour):
    h = hex_colour.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    channels = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    linear = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]


def ratio(fg, bg):
    hi, lo = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


args = sys.argv[1:]
if not args or len(args) % 2:
    sys.exit(__doc__)
for fg, bg in zip(args[::2], args[1::2]):
    r = ratio(fg, bg)
    verdict = 'AA' if r >= 4.5 else 'AA large only' if r >= 3 else 'FAIL'
    print(f'{fg} on {bg}: {r:.2f}:1  {verdict}')
