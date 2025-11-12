# Multimedia

Multimedia library


## Format

### Mac

```
brew install ffmpeg
```

### PC

```
winget install ffmpeg
# Add ffmpeg path to Windows env. var
```

### Movies

```
ffmpeg -i myMovie.mkv

Stream #0:0: Video: h264, ...
Stream #0:1: Audio: aac, ...
Stream #0:2: Subtitle: srt, ...



ffmpeg -i myMovie.mkv -map 0:v -map 0:a:0 -c:v copy -c:a aac myMovieEn.mp4

-map 0:v: Selects all video streams.
-map 0:a:1: Selects the second audio track (replace 1 with your desired track number).
-c:v copy: Copies the video stream without re-encoding.
-c:a aac: Encodes audio to AAC (required for MP4 compatibility).

Find srt file and save it with UTF8 encoding

ffmpeg -i myMovieEn.mp4 -vf "subtitles=subEn.srt" -c:v libx264 -crf 20 -c:a aac -b:a 192k myMovieEnSub.mp4
```

### Audio

Check adminend/tools.

```
ffmpeg -i input.flac -codec:a libmp3lame -qscale:a 0 output.mp3

-qscale:a 0 sets high quality (adjust between 0–9, where 0 is best).
```

// TODO: https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/