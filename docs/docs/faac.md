# FAAC Technical Reference

`faac` is an open-source MPEG-2/4 AAC audio encoder library (`libfaac`) and CLI tool.

<span class="badge-lgpl">LGPL v2.1+</span>

---

## Technical Specifications

- **Language & License**: C11/C99, LGPL v2.1+ (ISO reference code removed).
- **Profiles**:
  - **AAC-LC**: Low Complexity profile (ISO/IEC 14496-3).
  - **HE-AAC v1**: Spectral Band Replication (SBR) for low bitrates.
- **Sampling**: 8 kHz – 96 kHz.
- **Channels**: Mono, Stereo, 5.1, up to 64 channels.
- **Rate Control**:
  - **ABR (`-b <kbps>`)**: Average Bitrate (default 128 kbps).
  - **VBR (`-q <quality>`)**: Quantization quality mode (1..5000).
  - **CBR (`-b <kbps> --cbr`)**: Constant Bitrate (6144-bit/ch buffer model).
  - **Capped VBR (`-q <q> --cap-rate <kbps>`)**: Quality bounded by maximum frame bitrate ceiling.

---

## Ecosystem Integration

- **[fre:ac](https://www.freac.org/)**: Audio converter & CD ripper.
- **[Thingino](https://thingino.com/)**: Embedded Linux IP camera firmware.
- **[Audiobook Boss](https://github.com/Allmight97/audiobook-boss)**: Audiobook M4B processing.
- **[FFmpeg](https://ffmpeg.org/)**: External `libfaac` library support.
- **[Avidemux](https://avidemux.sourceforge.net/)**: Video editor & multiplexer.
