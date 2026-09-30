# FAAC Encoder Overview & Licensing

**FAAC (Freeware Advanced Audio Coder)** is an open-source MPEG-2 and MPEG-4 AAC audio encoder library (`libfaac`) and command-line utility (`faac`).

<span class="badge-lgpl">LGPL v2.1+ Licensed</span>

---

## The FAAC 2.0+ Renaissance

Historically, early FAAC 1.x releases contained legacy reference code and were evaluated as having mixed quality relative to proprietary alternatives.

Starting with **FAAC 2.0+**, the encoder was **completely rewritten** from scratch:
1. **Clean Codebase**: Removed all legacy ISO reference code.
2. **LGPL v2.1+ License**: Fully compliant free and open-source software license.
3. **Improved Quality & Efficiency**: Refactored psychoacoustic models, rate control algorithms, and SBR support.
4. **Fast Performance**: Lightweight C library with 3-5x throughput advantages on modern architectures.

---

## Supported Object Types & Profiles

- **AAC-LC (Low Complexity)**: The default standard AAC profile widely compatible with portable players, web streaming, and mobile operating systems.
- **HE-AAC v1 (High-Efficiency AAC / SBR)**: Spectral Band Replication targeting lower bitrates (e.g. 32-96 kbps) for speech and streaming.

---

## Supported Input & Output Formats

- **Inputs**: WAV (PCM), RAW PCM (8, 16, 24, 32-bit fixed/float), multi-channel up to 8 channels.
- **Outputs**:
  - **MP4 / M4A / M4B**: Includes iTunes metadata tags (`--artist`, `--title`, `--album`, cover art).
  - **ADTS (.aac)**: Transport stream format for broadcasting and streaming.
