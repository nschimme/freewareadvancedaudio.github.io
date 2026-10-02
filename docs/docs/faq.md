---
title: FAAC & FAAD2 FAQ — Licensing, Audio Tuning & Embedded Compilation
description: Frequently asked questions for FAAC and FAAD2 AAC audio codecs. Answers regarding LGPL v2.1+ licensing, average bitrate tuning (-b flag), and embedded C/C++ compilation.
---

# Frequently Asked Questions (FAQ)

Answers to common developer, packager, and user questions regarding **FAAC** and **FAAD2**.

---

## 1. Licensing & Legal Questions

### Is FAAC LGPL compliant and safe for commercial software?
**Yes.** FAAC 2.0+ was completely rewritten from scratch under the **LGPL v2.1+** license. It contains zero ISO reference code or proprietary headers. Software projects can dynamically link against `libfaac` without inheriting copyleft obligations on their proprietary source code.

### What is the license difference between FAAC and FAAD2?
- **FAAC (Encoder)**: Licensed under **LGPL v2.1+**.
- **FAAD2 (Decoder)**: Licensed under **GPL v2+**.

### Have AAC patents expired for AAC-LC and HE-AAC v1? What about HE-AAC v2?
**Yes for AAC-LC and HE-AAC v1.** All core patents covering the **AAC-LC** (Low Complexity) and **HE-AAC v1** (Spectral Band Replication - SBR) profiles have expired worldwide. Standard AAC-LC and HE-AAC v1 audio encoding and decoding via FAAC and FAAD2 can be freely deployed globally without patent licensing restrictions or royalty fees.

For **HE-AAC v2** (Parametric Stereo - PS), remaining patents are scheduled to expire in **2029**.

### Do I need to pay MPEG-LA patent royalties to use FAAC or FAAD2?
Since all patents covering AAC-LC and HE-AAC v1 have expired worldwide, open-source distribution and commercial usage of FAAC (LGPL v2.1+) and FAAD2 (GPL v2+) for these standard profiles require no MPEG-LA or Via Licensing patent royalties. HE-AAC v2 patents will fully expire in 2029.

---

## 2. Integration & Usage Questions

### Which bitrate mode should I use for FAAC: `-b` or `-q`?
For consistent audio quality across varying content, **`-b` (Average Bitrate - ABR)** is strongly recommended over `-q`.
- `-b 128` (128 kbps stereo) provides excellent transparent quality for standard audio.
- `-b 64 -object 5` (64 kbps stereo HE-AAC v1 / SBR) is ideal for low-bitrate streaming, speech, and podcasts.

### Can FAAC compile on embedded systems (e.g. ARM, MIPS, RISC-V)?
**Yes.** FAAC is written in portable C11/C99 with no external library dependencies. It is actively used in embedded firmware projects like [Thingino IP camera firmware](https://thingino.com/) due to its tiny ~73 KB binary size and minimal CPU resource usage.

---

## 3. Performance & Quality Questions

### How does FAAC compare against FDK-AAC and Apple AAC?
According to objective quality benchmarks ([faac-benchmark #90](https://github.com/nschimme/faac-benchmark/discussions/90)), **FAAC 2.2.0** delivers top-tier 1st Percentile MOS scores (strong floor resilience against audio artifacts) and **>500x realtime** encoding speed on modern processors while remaining 100% open-source LGPL v2.1+.
