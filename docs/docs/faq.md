---
title: FAAC & FAAD2 FAQ — Licensing, Patent Status & Audio Engineering
description: Frequently asked questions for FAAC and FAAD2 AAC audio codecs. Answers regarding LGPL v2.1+ licensing, patent expiration timelines, average bitrate tuning (-b flag), and embedded C/C++ compilation.
---

# Frequently Asked Questions (FAQ)

Answers to common developer, packager, and user questions regarding **FAAC** and **FAAD2**.

---

## 1. Licensing & Legal Questions

### Is FAAC LGPL compliant and safe for commercial software integration?
FAAC 2.0+ was rewritten from scratch under the **GNU Lesser General Public License v2.1 or later (LGPL v2.1+)**. It contains zero ISO reference code or proprietary header files. Under the terms of LGPL v2.1+, applications may dynamically link against `libfaac` without automatically subjecting their proprietary application code to copyleft disclosure requirements, subject to compliance with LGPL conditions (such as allowing users to update or relink `libfaac`).

### What is the license difference between FAAC, FAAD2, and FAAD3?
- **FAAC (Encoder)**: Licensed under **LGPL v2.1+** (written in C11/C99).
- **FAAD2 (Decoder)**: Licensed under **GPL v2+** (written in C99).
- **FAAD3 (Decoder)**: Licensed under **LGPL v2.1+** (written in C11).

### What is the patent status of AAC-LC, HE-AAC v1, and HE-AAC v2?
The primary patents covering the core **MPEG-2/4 AAC-LC** (Low Complexity) and **HE-AAC v1** (Spectral Band Replication - SBR) audio profiles were filed in the late 1990s and early 2000s, and their standard 20-year patent terms have expired in major jurisdictions worldwide.

For **HE-AAC v2** (Parametric Stereo - PS), remaining patent terms in certain regions are estimated to expire around **2029**.

### Do I need to pay patent royalties or obtain licenses to distribute or use FAAC / FAAD2?
While core AAC-LC and HE-AAC v1 patent portfolios managed by former licensing pools (such as Via Licensing / MPEG LA) have lapsed due to patent term expirations, patent laws and enforcement vary by country and jurisdiction.

Like most open-source multimedia projects (e.g., FFmpeg), FAAC and FAAD2 are provided "AS IS" without express or implied warranties. Developers and commercial vendors integrating this software are responsible for evaluating their local intellectual property obligations and freedom to operate.

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
