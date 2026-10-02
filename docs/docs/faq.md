---
title: FAAC & FAAD2 FAQ — Licensing, Patent Status & Audio Engineering
description: Frequently asked questions for FAAC and FAAD2 AAC audio codecs. Answers regarding LGPL v2.1+ licensing, patent expiration timelines, average bitrate tuning (-b flag), and embedded C/C++ compilation.
---

# Frequently Asked Questions (FAQ)

Answers to common developer, packager, and user questions regarding **FAAC** and **FAAD2**.

---

## 1. Installation & Downloads

### How do I install FAAC or FAAD2?
Pre-compiled binaries and packages are available for macOS and Linux:
- **macOS (Homebrew)**: `brew install faac` and `brew install faad2`
- **Linux (Debian/Ubuntu)**: `sudo apt install faac faad`
- **Source Releases**: Tagged source tarballs are published on [FAAC Releases](https://github.com/FreewareAdvancedAudio/faac/releases) and [FAAD2 Releases](https://github.com/FreewareAdvancedAudio/faad2/releases).

For complete usage syntax, see the [FAAC Encoder Guide](/docs/faac#quick-start--installation) and [FAAD2 Decoder Guide](/docs/faad2#quick-start--installation).

---

## 2. Licensing & Legal Considerations

### What are the open-source licenses for FAAC, FAAD2, and FAAD3?
- **FAAC (Encoder)**: **LGPL v2.1+** (cleanroom C11/C99 rewrite, free of ISO reference code). Suitable for dynamic linking in commercial or open-source applications.
- **FAAD2 (Decoder)**: **GPL v2+** (C99).
- **FAAD3 (Decoder)**: **LGPL v2.1+** (modern C11 rewrite for lightweight library integration).

### What is the patent status of AAC-LC and HE-AAC?
Core patents covering **MPEG-2/4 AAC-LC** (Low Complexity) and **HE-AAC v1** (SBR) have expired worldwide due to standard 20-year patent term limits. Remaining patents for **HE-AAC v2** (Parametric Stereo) are estimated to expire around **2029**.

Like FFmpeg, FAAC and FAAD2 are provided "AS IS" without express or implied warranties. Commercial integrators are responsible for evaluating their local intellectual property obligations.

---

## 3. Audio Engineering & Performance

### Which bitrate mode is recommended for FAAC?
**`-b` (Average Bitrate - ABR)** is strongly recommended over `-q` (VBR) for predictable, consistent quality across audio content:
- `-b 128` (128 kbps stereo) — Recommended transparent default for music.
- `-b 64 -object 5` (64 kbps stereo HE-AAC v1 / SBR) — Ideal for speech and low-bitrate streaming.

Detailed CLI options are documented in the [FAAC Command-Line Reference](/docs/faac#command-line-interface-reference).

### Can FAAC be compiled for embedded systems?
**Yes.** FAAC requires no external library dependencies and compiles to a tiny ~73 KB binary size. It is actively used in embedded systems such as [Thingino IP camera firmware](https://thingino.com/).

### How does FAAC perform against other AAC encoders?
In objective 1st Percentile MOS quality benchmarks, FAAC 2.2.0 demonstrates high artifact floor resilience while achieving encoding speeds exceeding **500x realtime**. See the complete [Codec Comparison & Benchmarks](/docs/comparison) page for detailed MOS graphs and evaluations.
