# Interactive In-Browser AAC/M4A Converter

Test **FAAC (LGPL v2.1+ AAC Encoder)** live directly inside your web browser with genuine **M4A (MP4 container)** output and gapless playback metadata.

---

<WasmConverter />

---

## Features & Capabilities

- **100% Client-Side Privacy**: Audio processing occurs locally inside your browser—zero file uploads to external servers.
- **Genuine M4A Container Output**: Wraps AAC audio bitstreams into standard ISO MP4/M4A containers (`.m4a`).
- **Gapless Playback Metadata**: Embeds iTunes-compatible `iTunSMPB` metadata (priming delay and padding sample counts) for seamless 100% gapless looping.
- **Average Bitrate Control (-b)**: Fine-tune target ABR bitrates from 32 kbps to 320 kbps.
- **Profile Support**: Supports MPEG-4 AAC-LC (Low Complexity) and HE-AAC v1 (SBR).
- **Seamless Loop Audition**: Test 100% gapless audio playback live in browser via Web Audio API.
