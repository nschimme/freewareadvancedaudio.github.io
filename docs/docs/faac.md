# FAAC Encoder Technical Specification & Licensing

`faac` is an open-source MPEG-2 and MPEG-4 AAC audio encoder library (`libfaac`) and standalone CLI tool.

<span class="badge-lgpl">LGPL v2.1+ Licensed</span>

---

## Technical Specifications

- **Codebase Architecture**: Written in portable C11/C99. Free of ISO MPEG reference code.
- **Audio Object Types**:
  - **AAC-LC (Low Complexity)**: ISO/IEC 14496-3 Low Complexity profile.
  - **HE-AAC v1 (SBR)**: Spectral Band Replication targeting 32–96 kbps.
- **Sample Rates**: 8 kHz to 96 kHz.
- **Channel Configurations**: Mono, Stereo, 5.1, and multi-channel up to 64 discrete channels.
- **Rate Control**:
  - **ABR (`-b <kbps>`)**: Average Bitrate mode (Default at 128 kbps).
  - **VBR (`-q <quality>`)**: Quantization quality mode (1..5000).
  - **CBR (`-b <kbps> --cbr`)**: Constant Bitrate mode utilizing a 6144-bit per channel decoder input bit reservoir model.
  - **Capped VBR (`-q <q> --cap-rate <kbps>`)**: Constant quality bounded by a maximum per-frame bitrate ceiling.

---

## Software Integration & Ecosystem Users

FAAC is integrated into software applications, media frameworks, and embedded environments:

- **[fre:ac](https://www.freac.org/)**: Cross-platform audio converter and CD ripper using `libfaac` for AAC output.
- **[Thingino](https://thingino.com/)**: Open-source embedded Linux firmware for IP cameras utilizing `libfaac` for real-time RTSP/AAC audio encoding.
- **[Audiobook Boss](https://github.com/Allmight97/audiobook-boss)**: Automated audiobook management and M4B processing tool.
- **[FFmpeg](https://ffmpeg.org/)**: Supports AAC encoding via external `libfaac` linkage.
- **[CDex](https://cdex.mu/)**: Windows CD ripping application.
- **[Avidemux](https://avidemux.sourceforge.net/)**: Video editing and encoding suite.
