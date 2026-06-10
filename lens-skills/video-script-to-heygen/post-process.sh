#!/usr/bin/env bash
# Post-process a HeyGen render into a brand-finished video with
# title card, outro card, persistent URL bar and a timed floating
# badge. Everything happens in a single ffmpeg filter_complex pass
# so there is no chance of A/V drift from concatenating clips with
# mismatched audio formats.
#
# Usage:   bash post-process.sh <video-folder>
# Reads:   <folder>/video.mp4 (the HeyGen render)
# Writes:  <folder>/final.mp4 (the published artefact)
# Also writes the intermediate PNG cards (title, outro, urlbar, badge)
# for inspection.
#
# Requires: ffmpeg, python3, python3-PIL. Homebrew ffmpeg lacks
# drawtext (no libfreetype), so all text rendering goes through
# PIL in make-cards.py, baked into PNGs that ffmpeg overlays.

set -euo pipefail

FOLDER="${1:-}"
if [ -z "$FOLDER" ]; then
  echo "Usage: $0 <video-folder>"
  echo "Expects <video-folder>/video.mp4 from a HeyGen render."
  exit 1
fi

if [ ! -f "$FOLDER/video.mp4" ]; then
  echo "Missing $FOLDER/video.mp4 (the HeyGen render)"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Optional overrides via env vars.
TITLE_TEXT="${LENS_VIDEO_TITLE:-The Lens}"
SUBTITLE_TEXT="${LENS_VIDEO_SUBTITLE:-Your AI marketing team.}"
OUTRO_URL="${LENS_VIDEO_URL:-manual-focus.co.uk/lens}"
OUTRO_TAGLINE="${LENS_VIDEO_TAGLINE:-Free to read.  Free to install.}"
OUTRO_CTA="${LENS_VIDEO_CTA:-Subscribe in the post.}"
URLBAR_TEXT="${LENS_VIDEO_URLBAR:-manual-focus.co.uk/lens}"
BADGE_TEXT="${LENS_VIDEO_BADGE:-46 playbooks · 26 skills · free}"

BADGE_START="${LENS_VIDEO_BADGE_START:-21}"
BADGE_END="${LENS_VIDEO_BADGE_END:-32}"
TITLE_DURATION="${LENS_VIDEO_TITLE_DURATION:-3}"
OUTRO_DURATION="${LENS_VIDEO_OUTRO_DURATION:-4}"

echo "── Generating PNG cards via PIL"
python3 "$SCRIPT_DIR/make-cards.py" "$FOLDER" \
  --title "$TITLE_TEXT" \
  --subtitle "$SUBTITLE_TEXT" \
  --outro-url "$OUTRO_URL" \
  --outro-tagline "$OUTRO_TAGLINE" \
  --outro-cta "$OUTRO_CTA" \
  --urlbar-text "$URLBAR_TEXT" \
  --badge-text "$BADGE_TEXT"

cd "$FOLDER"

# Probe the HeyGen render so the generated content matches its
# exact format and no resampling / frame-rate conversion is needed.
MAIN_FPS_RAW=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate \
  -of default=noprint_wrappers=1:nokey=1 video.mp4)
MAIN_FPS=$(echo "$MAIN_FPS_RAW" | awk -F/ '{ if ($2) print $1/$2; else print $1 }')
MAIN_W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width \
  -of default=noprint_wrappers=1:nokey=1 video.mp4)
MAIN_H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height \
  -of default=noprint_wrappers=1:nokey=1 video.mp4)
MAIN_SR=$(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate \
  -of default=noprint_wrappers=1:nokey=1 video.mp4)

echo "── Source: ${MAIN_W}x${MAIN_H} @ ${MAIN_FPS}fps, audio ${MAIN_SR}Hz"

BADGE_FADE_IN=0.4
BADGE_FADE_OUT_START=$(echo "$BADGE_END - 0.4" | bc)

# Composition strategy for the main video:
#   The HeyGen talking-photo animates the face but leaves the torso
#   as a frozen image, which reads as uncanny. We crop the talking
#   head to roughly head + shoulders (top 1080px of the 1920px source)
#   and place that crop at the top of a fresh 1080x1920 canvas. The
#   lower portion becomes brand-dark space that carries the URL bar
#   and the timed badge, so the static-torso problem disappears AND
#   the brand gets more on-screen real estate.
#
# Crop window is tunable via env vars so different avatars / framings
# can be accommodated without editing the script.
CROP_W="${LENS_VIDEO_CROP_W:-${MAIN_W}}"
CROP_H="${LENS_VIDEO_CROP_H:-1080}"
CROP_X="${LENS_VIDEO_CROP_X:-0}"
CROP_Y="${LENS_VIDEO_CROP_Y:-100}"
# Where the cropped head sits inside the 1080x1920 canvas.
HEAD_X="${LENS_VIDEO_HEAD_X:-0}"
HEAD_Y="${LENS_VIDEO_HEAD_Y:-60}"

echo "── Compositing in one ffmpeg pass (head crop ${CROP_W}x${CROP_H} at ${CROP_X},${CROP_Y})"
ffmpeg -y -hide_banner -loglevel error \
  -loop 1 -t "$TITLE_DURATION" -framerate "$MAIN_FPS" -i title.png \
  -i video.mp4 \
  -loop 1 -t "$OUTRO_DURATION" -framerate "$MAIN_FPS" -i outro.png \
  -i urlbar.png \
  -i badge.png \
  -f lavfi -t "$TITLE_DURATION" -i "anullsrc=channel_layout=stereo:sample_rate=${MAIN_SR}" \
  -f lavfi -t "$OUTRO_DURATION" -i "anullsrc=channel_layout=stereo:sample_rate=${MAIN_SR}" \
  -f lavfi -i "color=c=0x0A0A0A:s=${MAIN_W}x${MAIN_H}:r=${MAIN_FPS}" \
  -filter_complex "
    [0:v]scale=${MAIN_W}:${MAIN_H},setsar=1,fps=${MAIN_FPS},format=yuv420p,fade=t=in:st=0:d=0.35,fade=t=out:st=$(echo "$TITLE_DURATION-0.5" | bc):d=0.5[title_v];
    [2:v]scale=${MAIN_W}:${MAIN_H},setsar=1,fps=${MAIN_FPS},format=yuv420p,fade=t=in:st=0:d=0.4,fade=t=out:st=$(echo "$OUTRO_DURATION-0.5" | bc):d=0.5[outro_v];
    [1:v]crop=${CROP_W}:${CROP_H}:${CROP_X}:${CROP_Y},format=yuv420p,setsar=1[head];
    [7:v]trim=duration=999,setpts=PTS-STARTPTS[bg];
    [bg][head]overlay=x=${HEAD_X}:y=${HEAD_Y}:shortest=1:format=auto[main_framed];
    [3:v]format=yuva420p[bar];
    [4:v]format=yuva420p[badge];
    [main_framed][bar]overlay=x=0:y=main_h-overlay_h-180:format=auto[main_bar];
    [main_bar][badge]overlay=x=(main_w-overlay_w)/2:y=main_h-overlay_h-300:format=auto:enable='between(t,${BADGE_START},${BADGE_END})'[main_done];
    [5:a]aformat=channel_layouts=stereo:sample_rates=${MAIN_SR}[title_a];
    [1:a]aformat=channel_layouts=stereo:sample_rates=${MAIN_SR}[main_a];
    [6:a]aformat=channel_layouts=stereo:sample_rates=${MAIN_SR}[outro_a];
    [title_v][title_a][main_done][main_a][outro_v][outro_a]concat=n=3:v=1:a=1[outv][outa]
  " \
  -map "[outv]" -map "[outa]" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r "$MAIN_FPS" \
  -c:a aac -b:a 192k -ar "$MAIN_SR" \
  -movflags +faststart \
  final.mp4

# Tidy up the intermediate files from the older two-pass version of
# this script so the user does not see stale artefacts.
rm -f title.mp4 outro.mp4 main-annotated.mp4 concat.txt

echo ""
echo "── Output check"
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 final.mp4)
SIZE=$(ls -lh final.mp4 | awk '{print $5}')
A_SR=$(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of default=noprint_wrappers=1:nokey=1 final.mp4)
V_FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 final.mp4)
printf "final.mp4: %ss · %s · video %s · audio %sHz\n" "$DURATION" "$SIZE" "$V_FPS" "$A_SR"

echo ""
echo "✅ Done. Final video: $FOLDER/final.mp4"
