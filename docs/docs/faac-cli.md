# FAAC Command Line Interface (CLI) Guide

The `faac` command-line utility provides flexible audio encoding options.

```bash
faac [options] [-o outfile] infiles...
```

---

## Rate Control Modes

FAAC supports VBR, ABR, and CBR rate control mechanisms:

### 1. Average Bitrate (ABR) - Recommended

```bash
# Encode at average 128 kbps (default)
faac -b 128 input.wav -o output.m4a

# High quality stereo ABR at 192 kbps
faac -b 192 input.wav -o output.m4a
```

### 2. Constant Quality (VBR)

```bash
# VBR quality mode (1..5000, default 100)
faac -q 120 input.wav -o output.m4a
```

### 3. Constant Bitrate (CBR)

```bash
# Enforce strict constant bitrate with frame buffer stuffing
faac -b 128 --cbr input.wav -o output.m4a
```

---

## Object Types & Profiles

```bash
# Auto mode (selects LC or HE-AAC v1 based on sample rate/bitrate)
faac --object-type auto -b 64 input.wav -o output.m4a

# Explicit Low Complexity (AAC-LC)
faac --object-type lc -b 160 input.wav -o output.m4a

# Explicit HE-AAC v1 (SBR)
faac --object-type he-aac-v1 -b 48 input.wav -o output.m4a
```

---

## MP4 Metadata Tags

```bash
faac -b 128 \
  --artist "Artist Name" \
  --title "Track Title" \
  --album "Album Title" \
  --year "2026" \
  --cover-art cover.jpg \
  input.wav -o output.m4a
```
