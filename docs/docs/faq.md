---
title: FAAC & FAAD2 FAQ — Licensing, FFmpeg Integration & Bitrate Tuning
description: Frequently asked questions for FAAC and FAAD2 AAC audio codecs. Answers regarding LGPL v2.1+ licensing, FFmpeg integration, average bitrate tuning (-b flag), and embedded C/C++ compilation.
---

# Frequently Asked Questions (FAQ)

Answers to common developer, packager, and user questions regarding **FAAC** and **FAAD2**.

---

## 1. Licensing & Legal Questions

### Is FAAC LGPL compliant and safe for commercial software?
**Yes.** FAAC 2.0+ was completely rewritten from scratch under the **LGPL v2.1+** license. It contains zero ISO reference code or patent-encumbered proprietary headers. Software projects can dynamically link against `libfaac` without inheriting copyleft obligations on their proprietary source code.

### What is the license difference between FAAC and FAAD2?
- **FAAC (Encoder)**: Licensed under **LGPL v2.1+**.
- **FAAD2 (Decoder)**: Licensed under **GPL v2+**.

### Do I need to pay MPEG-LA patent royalties to use FAAC or FAAD2?
FAAC and FAAD2 are open-source software libraries. Under software license terms, open-source encoders/decoders do not charge licensing fees. However, depending on commercial jurisdiction, distribution of AAC end-user products above specific volume thresholds may be subject to standard MPEG-LA patent pool policies.

---

## 2. Integration & Usage Questions

### How do I use `libfaac` with FFmpeg?
Ensure your FFmpeg build includes `libfaac` support:
```bash
ffmpeg -i input.wav -c:a libfaac -b:a 128k output.m4a
```

### Which bitrate mode should I use for FAAC: `-b` or `-q`?
For consistent quality across varying audio content, **`-b` (Average Bitrate - ABR)** is strongly recommended.
- `-b 128` (128 kbps stereo) provides excellent transparent quality for standard music.
- `-b 64 -object 5` (64 kbps stereo HE-AAC v1 / SBR) is ideal for speech, streaming, and podcasts.

### Can FAAC compile on embedded systems (e.g. ARM, MIPS)?
**Yes.** FAAC is written in portable C11/C99 with no heavy external dependencies. It is actively used in embedded firmware projects like [Thingino IP camera firmware](https://thingino.com/) due to its tiny ~73 KB binary size and low CPU consumption.

---

## 3. Performance & Quality Questions

### How does FAAC compare against FDK-AAC and Apple AAC?
According to objective quality benchmarks ([faac-benchmark #90](https://github.com/nschimme/faac-benchmark/discussions/90)), **FAAC 2.2.0** delivers top-tier 1st Percentile MOS scores (highest floor resilience against audio artifacts) and **>500x realtime** encoding speed on modern processors while remaining 100% open-source LGPL v2.1+.
