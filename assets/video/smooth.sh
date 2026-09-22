#!/bin/bash
# Stabilise (vidstab 2-pass) + motion-interpolate to 60 fps + web encode.
set -e
f=$1; src=/opt/rfs-footage-src/$f.mp4; out=/opt/rfs-footage-src/smooth/$f.mp4
[ -s "$out" ] && [ "$out" -nt "$src" ] && exit 0
ffmpeg -v error -y -i "$src" -vf "scale=1280:-2,vidstabdetect=shakiness=6:accuracy=15:result=/opt/rfs-footage-src/smooth/$f.trf" -f null -
ffmpeg -v error -y -i "$src" -an -vf "scale=1280:-2,vidstabtransform=input=/opt/rfs-footage-src/smooth/$f.trf:smoothing=6:optzoom=1:interpol=bicubic,unsharp=5:5:0.4,minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,format=yuv420p" -c:v libx264 -preset slow -crf 23 -g 12 -keyint_min 12 -sc_threshold 0 -movflags +faststart "$out.tmp.mp4"
mv "$out.tmp.mp4" "$out"
echo "done $f"
