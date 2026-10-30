---
title: "AAC on ESP32: FAAC and FAAD for Microcontrollers"
description: "Run FAAC encoding and FAAD decoding in real time on ESP32, ESP32-S3, and ESP32-C6 microcontrollers. The same AAC libraries, in a tiny footprint."
pageClass: esp32-aac-page
---

# AAC on ESP32

Run FAAC and FAAD in real time on ESP32. Use FAAD on the ESP32-S3, FAAC plus FAAD on the classic ESP32, and LibHelix on the ESP32-C6.

## Choose your board

| Board | Use | HE-AAC v2 | PSRAM | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| ESP32-S3 | [FAAC](/docs/faac) + [FAAD](/docs/faad) | Stereo | Optional | Best overall |
| Classic ESP32 | [FAAC](/docs/faac) AAC-LC + [FAAD](/docs/faad) | Not measured | Not required | Best no-PSRAM decode target |
| ESP32-C6 | [LibHelix](https://github.com/earlephilhower/ESP8266Audio/blob/master/src/libhelix-aac/aacdec.c) decode; mono AAC-LC encode | No | Not needed | Use LibHelix |

## Choose your job

### Decode a stream or file

Use [FAAD](/docs/faad) on the ESP32-S3 or classic ESP32. Both decode AAC-LC and HE-AAC in real time. On the ESP32-C6, use LibHelix.

### Encode voice or music

Use [FAAC](/docs/faac) on the ESP32-S3. The classic ESP32 handles AAC-LC stereo in real time; HE-AAC encoding does not fit in its internal RAM.

### Stream stereo at low bitrates

Use [FAAD](/docs/faad) on the ESP32-S3 with Parametric Stereo enabled. It is the only tested decoder that produced stereo HE-AAC v2 output on that board.

## What it costs

Speed is relative to real time. Memory depends on where the decoder state lives.

<Esp32Showcase view="devices" />

<Esp32Showcase view="memory" />

## Start building

1. **Build for ESP-IDF.** Use the FAAC and FAAD sources with the [installation guide](/docs/install).
2. **Feed frames or PCM.** FAAD consumes AAC frames; FAAC consumes PCM. See the [libfaad API](/docs/libfaad) and [libfaac API](/docs/libfaac).
3. **Choose the memory mode.** Decoder state lives in internal RAM by default. On the ESP32-S3, move it to PSRAM when you need the headroom.

## Known limits

- Multichannel is unmeasured. The benchmark covers two channels.
- The classic ESP32 cannot fit HE-AAC encoding in its internal RAM.
- FAAC does not encode HE-AAC v2.
- The ESP32-C6 has no FPU. Use LibHelix rather than FAAD's floating-point path.
- The benchmark is a gate subset, not the full corpus. Encoder results report speed and bitrate accuracy, not listening quality.

## Common questions

### Can an ESP32 encode AAC?

Yes. FAAC encodes AAC-LC and HE-AAC v1. Stereo AAC-LC is real time on the ESP32-S3 and classic ESP32; HE-AAC encoding in real time needs the ESP32-S3.

### Does ESP32 AAC decoding need PSRAM?

No. The classic ESP32 decodes the full bitrate range without PSRAM. On the ESP32-S3, PSRAM is optional headroom for decoder state.

### Does FAAD support multichannel on ESP32?

Not established. The benchmark covers two channels, and the measured FAAD3 build is capped at two. Treat 5.1 and 7.1 as unmeasured.

## Benchmark notes

Read the [full ESP32 AAC benchmark notes](https://gist.github.com/nschimme/cfa0a3d225c8c001eb7d998739b7298a) for tested builds, scenarios, and exact numbers.
