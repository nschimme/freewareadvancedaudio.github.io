---
title: Choose an AAC Encoder or Decoder
description: Compare FAAC, FAAD, FDK-AAC, Apple AudioToolbox, and FFmpeg. Choose an AAC implementation by profile support, integration needs, software license, and patent status.
---

# Choose an AAC Encoder or Decoder

Choose by **use case, hardware, required AAC profiles, and license**. FAAC encodes; FAAD decodes. Use the matrices to compare profile support.

## Start with your application {data-icon="compass"}

| Your requirement | Start here |
| :--- | :--- |
| AAC/M4A output from a C application | FAAC |
| AAC playback in a C application | FAAD |
| Lossless music storage or masters | FLAC; retain the original PCM information |
| Interactive voice or WebRTC | Opus; evaluate delay and communications requirements |
| HE-AAC v2 encoding | FDK-AAC or Apple AudioToolbox; see the encoder matrix |
| Digital Radio Mondiale (DRM) | A DRM-aware encoder and receiver stack; see [DRM notes](#xhe-aac-digital-radio-mondiale-and-opus) |
| Low-bitrate speech and music streaming | Compare xHE-AAC and Opus for playback support and licensing |
| Existing FFmpeg pipeline | Use an encoder available in your FFmpeg build |
| Apple-platform application | AudioToolbox; see the matrices for supported profiles |
| Playback on MP3-only hardware | LAME MP3 |

## Choose a decoder for your hardware {data-icon="microchip"}

| Your target | Decoder to evaluate | Why |
| :--- | :--- | :--- |
| General purpose AAC decoding | [FAAD](/docs/faad) | C11 decoder; LGPL v2.1+. |
| Legacy processor or microcontroller without an efficient FPU | [LibHelix](https://github.com/earlephilhower/ESP8266Audio/blob/master/src/libhelix-aac/aacdec.c) | Fixed-point decoder for low-FPU targets. |
| HE-AAC v2 Parametric Stereo on a fixed-point target | [Legacy FAAD2](https://github.com/FreewareAdvancedAudio/faad2) | PS support; verify the target build and GPL v2+ terms. |
| Existing FFmpeg application | The available libavcodec decoder | Reuse the media framework already in your pipeline. |
| Native Apple application | AudioToolbox | Use the platform's audio APIs and query available formats. |

An FPU is a hardware floating-point unit. Desktop throughput does not predict microcontroller performance. See the [FAAD guide](/docs/faad) and [libfaad reference](/docs/libfaad) for build options.

## Library capabilities {data-icon="layer-group"}

### AAC encoders

| Profile or extension | [FAAC](/docs/faac) | FFmpeg native | [FDK-AAC](https://github.com/mstorsjo/fdk-aac) | [Apple AudioToolbox](https://developer.apple.com/documentation/audiotoolbox) |
| :--- | :---: | :---: | :---: | :---: |
| AAC-LC | ✓ | ✓ | ✓ | ✓ |
| AAC Main | — | — | — | — |
| AAC SSR | — | — | — | — |
| AAC-LTP | — | ✓ | — | — |
| HE-AAC v1 (SBR) | ✓ | — | ✓ | ✓ |
| HE-AAC v2 (SBR + PS) | — | — | ✓ | ✓ |
| AAC-LD | — | — | ✓ | ✓ |
| AAC-ELD (optionally with SBR) | — | — | ✓ | ✓ |
| USAC / xHE-AAC | — | — | — | — |
| DRM / DRM+ audio framing | — | — | ✓ | — |

FFmpeg builds can also include FDK-AAC or Apple AudioToolbox encoders. See [FFmpeg's encoder documentation](https://ffmpeg.org/ffmpeg-codecs.html#Audio-Encoders).

### AAC decoders

| Profile or extension | [FAAD](/docs/faad) | [Legacy FAAD2](https://github.com/FreewareAdvancedAudio/faad2) | FFmpeg native | [FDK-AAC](https://github.com/mstorsjo/fdk-aac) | [LibHelix](https://github.com/earlephilhower/ESP8266Audio/blob/master/src/libhelix-aac/aacdec.c) | [Apple AudioToolbox](https://developer.apple.com/documentation/audiotoolbox) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| AAC-LC | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AAC Main | — | † | ✓ | — | — | — |
| AAC SSR | — | † | — | — | — | — |
| AAC-LTP | — | ✓ | ✓ | — | — | — |
| HE-AAC v1 (SBR) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| HE-AAC v2 (SBR + PS) | † | ✓ | ✓ | ✓ | — | ✓ |
| ER-LC / ER-LTP | — | ✓ | — | — | — | — |
| AAC-LD | — | ✓ | — | ✓ | — | ✓ |
| AAC-ELD | — | — | † | ✓ | — | ✓ |
| USAC / xHE-AAC | — | — | † | ✓ | — | ✓ |
| DRM / DRM+ audio transport | — | † | — | ✓ | — | — |

✓ Supported · † build- or configuration-dependent · — not supported. Apple entries assume modern macOS/iOS.

<details>
<summary>Profile support notes</summary>

“Main,” “SSR,” and “LTP” are AAC profiles; SBR and PS extend the LC core to HE-AAC v1 and v2. Legacy FAAD2 Main is unavailable in fixed-point builds, SSR is disabled by default, and DRM support is optional. FAAD's HE-AAC v2 support requires SBR and PS; FFmpeg ELD and USAC support depends on its build.

Profile support does not guarantee every transport, sample rate, or channel layout. Check the selected release and build. Apple rates and channel layouts depend on the requested format; see [Apple's format identifiers](https://developer.apple.com/documentation/coreaudiotypes/audio-format-identifiers).

</details>

For measured decoder quality, speed, memory, and footprint, see the [decoder snapshot](/docs/tested-versions).

## xHE-AAC, Digital Radio Mondiale, and Opus {data-icon="tower-broadcast"}

**DRM can carry AAC with SBR/PS or xHE-AAC; FAAC does not encode xHE-AAC.** Legacy FAAD2 offers optional DRM decoding, and FDK-AAC supports DRM/DRM+ audio transport. A complete receiver also needs radio demodulation and service signaling. See [Fraunhofer's xHE-AAC overview](https://www.iis.fraunhofer.de/en/ff/amm/broadcast-streaming/xheaac.html) and the [DRM system specification](https://www.etsi.org/deliver/etsi_es/201900_201999/201980/04.03.00_50/es_201980v040300m.pdf).

xHE-AAC and [Opus](https://opus-codec.org/) overlap in streaming uses; Opus also serves interactive voice and conferencing. Compare delay, playback support, and licensing.

## Software licenses and patent rights {data-icon="scale-balanced"}

FAAC 2.0 and later, and FAAD, use LGPL v2.1+. Earlier FAAC releases included code under different terms. Check the license shipped with the exact version you use. FDK-AAC has a custom license that [Fedora classifies as non-free](https://fedoraproject.org/wiki/Licensing/FDK-AAC). Software copyright and codec patents are separate.

### Patent status by AAC profile

| Profile | Patent considerations |
| :--- | :--- |
| AAC-LC | The foundational patents have expired. |
| HE-AAC v1 | The foundational patents, including Spectral Band Replication (SBR), have expired. |
| HE-AAC v2 | Adds **Parametric Stereo**; associated patents expire in 2029. |
| xHE-AAC | Has additional patent restrictions; check current licensing terms. |

These profile distinctions apply across implementations, including FFmpeg. Patent applicability depends on jurisdiction and implementation. See the [Via Licensing Alliance AAC program](https://www.via-la.com/licensing-programs/aac/) for current HE-AAC v2 and xHE-AAC licensing information.

Via LA states that it does not charge patent license fees for distributing AAC bitstreams, including broadcasts and streams. Encoder and decoder products have separate licensing considerations.

## Validate your choice {data-icon="circle-check"}

1. **Check your budget:** use the [AAC benchmark results](/docs/optimization) as a starting point, then measure CPU, code size, and RAM on your target.
2. **Check the sound:** [try the converter](/playground) or follow the [listening-test guide](/docs/listening) at your intended bitrate.
3. **Integrate:** follow the [FAAC encoder guide](/docs/faac), [FAAD decoder guide](/docs/faad), or [installation guide](/docs/install).
