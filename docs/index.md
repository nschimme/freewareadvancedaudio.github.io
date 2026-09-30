---
layout: home

hero:
  name: "Freeware Advanced Audio"
  text: "Open-Source AAC Codecs"
  tagline: "ISO-Free LGPL v2.1+ AAC Encoder (FAAC) & GPL v2+ Decoder (FAAD2)"
  actions:
    - theme: brand
      text: "In-Browser Demo"
      link: "/playground"
    - theme: alt
      text: "C API & Docs"
      link: "/docs/faac"
    - theme: alt
      text: "GitHub Org"
      link: "https://github.com/FreewareAdvancedAudio"

features:
  - icon: "🛠️"
    title: "FAAC 2.0+ Architecture"
    details: "Written in C11/C99. Free of legacy ISO reference code. LGPL v2.1+ licensed."
  - icon: "📊"
    title: "Profiles & Rate Control"
    details: "AAC-LC and HE-AAC v1 (SBR). Supports VBR (-q), ABR (-b), and CBR (--cbr) with bit reservoir modeling."
  - icon: "⚡"
    title: "Encoding Speed"
    details: "Lightweight, low-overhead C implementation with 3–5x throughput headroom over standard encoders."
  - icon: "🔊"
    title: "FAAD2 Decoder"
    details: "Standalone GPL v2+ decoder for MPEG-2/4 AAC, HE-AAC v1/v2 (SBR+PS), and multi-channel streams up to 7.1."
---

<div class="home-technical-wrapper">

## Ecosystem Users & Integrations

FAAC and FAAD2 are integrated into major open-source media frameworks, audio converters, and embedded systems worldwide:

- **[fre:ac](https://www.freac.org/)**: Free audio converter and CD ripper using FAAC and FAAD2.
- **[Thingino](https://thingino.com/)**: Open-source IP camera firmware utilizing FAAC for efficient live audio encoding.
- **[Audiobook Boss](https://github.com/AudiobookBoss)**: Open-source audiobook management tools using FAAC for M4A/AAC conversion.
- **[FFmpeg](https://ffmpeg.org/)**: Provides native support for `libfaac` and `libfaad2` via `--enable-libfaac` / `--enable-libfaad`.
- **[VLC Media Player](https://www.videolan.org/vlc/)**: Utilizes FAAD2 for fast, cross-platform AAC decoding.
- **[GStreamer](https://gstreamer.freedesktop.org/)**: Plug-and-play GStreamer elements (`faac`, `faad`) for audio pipeline processing.

---

## Interactive In-Browser Audio Converter

Test FAAC encoding and FAAD2 decoding live inside your web browser without installing any software or uploading files to a server:

<WasmConverter />

</div>
