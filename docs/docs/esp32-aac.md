---
title: "AAC on ESP32: FAAC and FAAD for Microcontrollers"
description: "Run FAAC encoding and FAAD decoding in real time on ESP32, ESP32-S3, and ESP32-C6 microcontrollers, or Helix on the FPU-less ESP8266. The same AAC libraries, in a tiny footprint."
pageClass: esp32-aac-page
---

# AAC on ESP32

For the widest tested feature set, use a board with an FPU and PSRAM: the ESP32-S3. It handles every tested decode path and both tested encode profiles, including stereo HE-AAC v2 decode.

Without PSRAM, the classic ESP32 still decodes AAC-LC and HE-AAC v1. Without an FPU, use Helix on the ESP32-C6 or ESP8266.

## Choose your board

| Board | Choose when | Library | FPU | PSRAM needed? |
| :--- | :--- | :--- | :--- | :--- |
| ESP32-S3 (240 MHz) | You want the full tested feature set | [FAAD](/docs/faad) + [FAAC](/docs/faac) | Yes | Recommended |
| Classic ESP32 (240 MHz) | You need a no-PSRAM decode target | [FAAD](/docs/faad) + [FAAC](/docs/faac) | Yes | Not required |
| ESP32-C6 (160 MHz) | Your application is decode-only | [Helix](https://github.com/earlephilhower/ESP8266Audio/blob/master/src/libhelix-aac/aacdec.c) | No | Not required |
| ESP8266 (80/160 MHz) | You need AAC-LC only | [Helix](https://github.com/earlephilhower/ESP8266Audio/blob/master/src/libhelix-aac/aacdec.c) | No | Not available |

- **ESP32-C6:** Helix handles decode. FAAC can also encode mono AAC-LC at 1.9–2.9×; stereo encoding is below real time.
- **Classic ESP32:** the benchmark used a no-PSRAM module. WROVER-class modules add PSRAM, but PSRAM-backed encoder state is untested.
- **ESP8266:** AAC-LC decode only; not benchmarked. The ESP8266Audio Helix build has no SBR, so HE-AAC is unavailable. FAAC has not been tested.
- **No FPU:** use Helix. FAAD is not reliable in real time without an FPU.

FPU is a hardware floating-point unit. PSRAM is external RAM. PS is Parametric Stereo, the HE-AAC v2 extension.

## Choose your job

### Decode a stream or file

- ESP32-S3, classic ESP32 → FAAD
- ESP32-C6, ESP8266 → Helix (ESP8266: AAC-LC only)

### Encode voice or music

- ESP32-S3 → FAAC, AAC-LC or HE-AAC v1
- Classic ESP32, ESP32-C6 → FAAC, AAC-LC only (C6: mono only)
- ESP8266 → no tested encoder

## What it costs

Speed is relative to real time. Memory depends on where the decoder state lives.

<Esp32Showcase view="devices" />

<Esp32Showcase view="memory" />

### Will it keep up?

Recommended library per board, stereo 44.1/48 kHz music, gate set, best of three passes. Values are times faster than real time; 1× is real time. FAAD decode figures use FAAD3.

**Decode**

| Board | AAC-LC | HE-AAC v1 | HE-AAC v2 |
| :--- | :--- | :--- | :--- |
| ESP32-S3 | 9.3–12.9× | 4.2–4.8× | 4.3–4.8× stereo |
| Classic ESP32 | 8.6–12.2× | 3.6–4.2× | No |
| ESP32-C6 | 6.5–12.2× | 2.3–2.6× | No |
| ESP8266 | Not measured | No | No |

**Encode**

| Board | AAC-LC | HE-AAC v1 |
| :--- | :--- | :--- |
| ESP32-S3 | 4.6–10.4× | 4.7–7.1× |
| Classic ESP32 | 4.0–7.9× | Out of memory |
| ESP32-C6 | 0.38–0.60× | 0.22–0.24× |
| ESP8266 | No | No |

| Value | Meaning |
| :--- | :--- |
| 9.3–12.9× | Real time; higher is better |
| Not measured | Not run; may be possible |
| No | No tested real-time path |

HE-AAC v2 is stereo on the S3; Helix returns mono only. The C6 encodes mono AAC-LC at 1.9–2.9×; stereo is below real time.

### Stream stereo at low bitrates

| Board | Stereo HE-AAC v2 | Why |
| :--- | :--- | :--- |
| ESP32-S3 | Yes | FAAD3 PS in internal RAM |
| Classic ESP32 | No | PS state 119 KB > 108 KB block |
| ESP32-C6 | No | No PS; FAAD3 too slow |
| ESP8266 | No | No SBR or PS |

PS does not require PSRAM: the ESP32-S3 ran 88 of 88 v2 streams with state in internal RAM (119 KB peak). Moving that state to PSRAM cuts it to 16 KB and costs 13% speed.

## Start building

1. **Build for ESP-IDF.** Use the FAAC and FAAD sources with the [installation guide](/docs/install).
2. **Feed frames or PCM.** FAAD consumes AAC frames; FAAC consumes PCM. See the [libfaad API](/docs/libfaad) and [libfaac API](/docs/libfaac).
3. **Choose the memory mode.** Decoder state lives in internal RAM by default. On the ESP32-S3, move it to PSRAM when you need the headroom.

**ESP8266:** not ESP-IDF. Use the Helix port in [ESP8266Audio](https://github.com/earlephilhower/ESP8266Audio).

## Known limits

- Multichannel: unmeasured; the benchmark covers stereo.
- Classic ESP32 HE-AAC v1 encode: 116 KB state vs 108 KB largest internal block. This board would need a PSRAM-backed state allocation; the tested board has no PSRAM, so the encode does not run.
- PSRAM-backed encoder state: not tested. The S3 fits the HE-AAC v1 state in internal RAM, so PSRAM is not required there.
- FAAC HE-AAC v2: needs `encoder-ps`; not tested on ESP32, so its state size and PSRAM needs are unknown.
- ESP8266: AAC-LC only, no SBR, no tested encoder.
- Benchmark scope: gate subset; speed and bitrate accuracy, not listening quality.

## Common questions

### Can an ESP32 encode AAC?

Yes: FAAC does AAC-LC and HE-AAC v1. HE-AAC v2 needs a PS build and is not tested on ESP32.

### What is the difference between AAC-LC, HE-AAC v1, and HE-AAC v2?

LC is the baseline; v1 adds SBR for low bitrates; v2 adds PS for low-bitrate stereo.

### Does FAAC encode HE-AAC v2?

Yes, with `encoder-ps` and stereo input at 32 kHz or above. Not tested on ESP32.

### Can I use AAC on an ESP8266?

AAC-LC decode with Helix. No HE-AAC (no SBR) and no tested encoder.

### Does ESP32 AAC decoding need PSRAM?

No. Classic ESP32 decodes without it; ESP32-S3 PSRAM is optional.

### Does FAAD support multichannel on ESP32?

Unmeasured; the benchmark covers stereo.

## Benchmark notes

See the [full ESP32 AAC benchmark notes](https://gist.github.com/nschimme/cfa0a3d225c8c001eb7d998739b7298a) for builds, scenarios, and exact numbers.
