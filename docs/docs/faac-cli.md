# FAAC CLI Reference

`faac` syntax:

```bash
faac [options] [-o outfile] infiles...
```

---

## Rate Control

```bash
# Average Bitrate (ABR, default 128 kbps)
faac -b 128 input.wav -o output.m4a

# Constant Quality (VBR, 1..5000)
faac -q 100 input.wav -o output.m4a

# Constant Bitrate (CBR)
faac -b 128 --cbr input.wav -o output.m4a

# Capped VBR
faac -q 100 --cap-rate 192 input.wav -o output.m4a
```

---

## Object Types

```bash
# Auto (Selects LC or HE-AAC v1 based on sample rate & bitrate)
faac --object-type auto -b 64 input.wav -o output.m4a

# Low Complexity (AAC-LC)
faac --object-type lc -b 160 input.wav -o output.m4a

# HE-AAC v1 (SBR)
faac --object-type he-aac-v1 -b 48 input.wav -o output.m4a
```

---

## MP4 Metadata Tags

```bash
faac -b 128 \
  --artist "Artist" \
  --title "Title" \
  --album "Album" \
  --year "2026" \
  --cover-art cover.jpg \
  input.wav -o output.m4a
```
