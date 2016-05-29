find . -name "*.wav" | while read track;do
  ffmpeg -i "$track" -codec:a libmp3lame -qscale:a 2 "${track%.wav}.mp3"
done