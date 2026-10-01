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

### Have AAC patents expired for AAC-LC and HE-AAC v1?
**Yes.** All core patents covering the **AAC-LC** (Low Complexity) and **HE-AAC v1** (Spectral Band Replication - SBR) profiles have expired worldwide. As a result, standard AAC-LC and HE-AAC v1 audio encoding and decoding via FAAC and FAAD2 can be freely deployed globally without patent licensing restrictions or royalty fees.

### Do I need to pay MPEG-LA patent royalties to use FAAC or FAAD2?
Since all patents covering AAC-LC and HE-AAC v1 have expired, open-source distribution and commercial usage of FAAC (LGPL v2.1+) and FAAD2 (GPL v2+) for these standard profiles require no MPEG-LA or Via Licensing patent royalties.

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
