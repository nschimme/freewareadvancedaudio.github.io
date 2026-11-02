---
title: "AAC Encoder and Decoder for ESP32"
description: "Run FAAC encoding and FAAD decoding in real time on ESP32, ESP32-S3, and ESP32-C6 microcontrollers, or Helix on the FPU-less ESP8266. Find out which chip handles HE-AAC v2 and 5.1, and when you need PSRAM."
pageClass: esp32-aac-page
---

# AAC on ESP32

Two things decide what an ESP32 project can do with AAC: whether the chip has an **FPU**, and how much **internal RAM** the codec state needs. PSRAM is how you get past the second limit.

- **ESP32-S3 with PSRAM** is the board to pick. It runs every path tested here: decode through HE-AAC v2, encode through HE-AAC v2, and 5.1 encode.
- **Classic ESP32 without PSRAM** decodes AAC-LC and HE-AAC v1 and encodes stereo AAC-LC. Stereo HE-AAC encode does not fit.
- **No FPU (ESP32-C6, ESP8266):** use Helix to decode. FAAC encoding on the C6 is far below real time except mono voice.

## What each feature needs

Memory is the codec state allocated when you open it. It is the same at every bitrate and sample rate. Figures are internal RAM taken from the heap, measured on real boards.

| Feature | Library | FPU | State in RAM | PSRAM |
| :--- | :--- | :--- | :--- | :--- |
| Decode AAC-LC, HE-AAC v1 | [FAAD](/docs/faad) | Yes | about 97 KB | Optional |
| Decode HE-AAC v2 (stereo) | [FAAD](/docs/faad) | Yes | about 119 KB | Optional: 16 KB internal |
| Decode, no FPU | Helix | No | about 79 KB | Optional |
| Encode AAC-LC | [FAAC](/docs/faac) | Yes | mono 49 KB, stereo 90 KB | Not needed |
| Encode HE-AAC v1 | [FAAC](/docs/faac) | Yes | mono 83 KB, stereo 142 KB | Stereo: recommended |
| Encode HE-AAC v2 (stereo only) | [FAAC](/docs/faac) | Yes | 184 KB | Recommended |
| Encode 5.1 (6 channels) | [FAAC](/docs/faac) | Yes | about 250 KB | Required |

- **Stack:** an encoder task used about 9 KB for AAC-LC and about 9.5 KB for HE-AAC v1 and v2, so budget 10–14 KB. FAAD3 needs about 6 KB; FAAD2 needs about 56 KB.
- **Flash and static RAM:** with default options FAAD3 takes about 77 KB of flash and 69 KB of static RAM, and FAAC about 47 KB of flash (57 KB with the HE-AAC v2 encoder) and 22 KB of static RAM. Most of FAAD3's footprint is optional; see [Trim the build](#trim-the-build).
- **Speed is separate.** An FPU-less chip can often hold the state and still be too slow. See the support matrix below.

### Why PSRAM, not "a big enough block"

State of 100 KB or more is a PSRAM requirement in practice. On a bare chip the free internal RAM is split into regions, and Wi-Fi, Bluetooth and your own tasks fragment it further. The classic ESP32 has 257 KB free after boot with a largest block of only 108 KB, and the S3 has 245 KB free with a largest block of 232 KB. Anything near those sizes may not allocate in a real application.

## Choose your board

| Board | FPU | PSRAM | Use it for |
| :--- | :--- | :--- | :--- |
| ESP32-S3 (240 MHz) | Yes | Usually 2–8 MB | Everything: full decode, HE-AAC v2 encode, 5.1 encode |
| Classic ESP32 (240 MHz) | Yes | Not on WROOM; WROVER has it | Decode through HE-AAC v1, stereo AAC-LC encode, mono HE-AAC v1 encode |
| ESP32-C6 (160 MHz) | No | No | Decode with Helix; mono voice encode only |
| ESP8266 (80/160 MHz) | No | No | AAC-LC decode with Helix |

- **ESP32-S3 without PSRAM:** not tested. HE-AAC v2 stereo encode (184 KB) fits in its 245 KB of free internal RAM on bare firmware, with little room left for anything else. 5.1 does not fit.
- **Classic ESP32 with PSRAM (WROVER):** not tested. It has the FPU, so PSRAM-backed encoder state should unlock stereo HE-AAC encode there.
- **ESP32-C6:** the HE-AAC v2 encoder state (183 KB) opens fine, but without an FPU the encoder runs at about a tenth of real time.
- **ESP8266:** Helix has no SBR, so no HE-AAC. FAAC has not been tested on it.

## Will it keep up?

Real-time support for stereo 44.1/48 kHz music. "No" can mean too slow or too big for the RAM.

**Decode**

| Board | AAC-LC | HE-AAC v1 | HE-AAC v2 (stereo) |
| :--- | :--- | :--- | :--- |
| ESP32-S3 | Yes | Yes | Yes |
| Classic ESP32 | Yes | Yes | No: PS state does not fit without PSRAM |
| ESP32-C6 | Yes (Helix) | Yes (Helix) | No: Helix drops PS, FAAD3 too slow |
| ESP8266 | Yes (Helix), not measured | No | No |

**Encode**

| Board | AAC-LC | HE-AAC v1 | HE-AAC v2 | 5.1 |
| :--- | :--- | :--- | :--- | :--- |
| ESP32-S3 | Yes | Yes | Yes | Yes, with PSRAM |
| Classic ESP32 | Yes | Mono only | No | No |
| ESP32-C6 | Mono voice at 24 kHz and below | No | No | No |
| ESP8266 | No | No | No | No |

HE-AAC v2 encode runs at about 2× real time on the ESP32-S3 for 48 kHz stereo. That is one scenario, so treat it as a rough indication, not a general figure.

<Esp32Showcase view="devices" />

<Esp32Showcase view="memory" />

## HE-AAC v2 on ESP32

- **Decode:** FAAD3 decodes stereo HE-AAC v2 on the ESP32-S3. PS does not need PSRAM: the S3 ran every v2 stream with state in internal RAM (119 KB). Moving the state to PSRAM cuts internal use to 16 KB and costs 13% speed.
- **Encode:** build FAAC with `-Dencoder-ps=true`. Input must be stereo at 32 kHz or above.
- **The v2 build costs memory for every HE stream.** With PS compiled in, HE-AAC v1 state grows from 142 KB to 184 KB for stereo and from 83 KB to 126 KB for mono, even when you never encode v2. If you only need AAC-LC and HE-AAC v1, leave `encoder-ps` off.

## 5.1 on ESP32

- **Encode:** AAC-LC and HE-AAC v1 5.1 encode work on the ESP32-S3 once libfaac's state may go to PSRAM. Without that, the open call fails with an out-of-memory error because the state is about 250 KB and the S3 has 245 KB free. With PSRAM-backed `malloc`, about 100 KB stays in internal RAM.
- **Build:** use `-Dmax-channels=6` or higher. A higher channel limit costs nothing on stereo streams: stereo state was the same on 2-channel and 6-channel builds.
- **ESP-IDF settings:** set `CONFIG_SPIRAM_USE_MALLOC=y` and a small `CONFIG_SPIRAM_MALLOC_ALWAYSINTERNAL` so large allocations go to PSRAM.
- **Other chips:** a 5.1 encoder needs about 250 KB of state. Chips without PSRAM do not have a practical way to hold it alongside the application.
- **Decode:** 5.1 decode is not measured on ESP32. The decoder benchmark builds were limited to two channels.

## Trim the build

The defaults switch on every feature, including ones most ESP32 projects never use. Pick the smallest build that covers what you need. Figures are libfaad and libfaac on an ESP32-S3, built for two channels, and decoded audio was identical for every stream a build still supports.

### Playing AAC (FAAD)

| I need to play | Build | Flash | Static RAM |
| :--- | :--- | :--- | :--- |
| Everything, including HE-AAC v2 | Defaults | 76.7 KB | 68.7 KB |
| AAC-LC and HE-AAC v1 | `-Ddecoder-ps=false -Ddecoder-dab=false -Ddecoder-drc=false` | 57.2 KB | 38.6 KB |
| AAC-LC only | The same, plus `-Ddecoder-sbr=false` | 28.8 KB | 34.5 KB |

Each switch on its own, against the defaults:

| Option | Removes | Flash | Static RAM |
| :--- | :--- | :--- | :--- |
| `-Ddecoder-dab=false` | DAB 960/120-sample frames; ordinary 1024-sample AAC is unaffected | −4.7 KB | −13.2 KB |
| `-Ddecoder-drc=false` | Dynamic range control | −2.9 KB | none |
| `-Ddecoder-ps=false` | HE-AAC v2 decode | −11.8 KB | −16.9 KB |
| `-Ddecoder-sbr=false` | All HE-AAC (also removes PS); HE streams then play as the half-rate core | −40.5 KB | −21.0 KB |

### Recording AAC (FAAC)

| I need to record | Build | Flash | Static RAM | Encoder state |
| :--- | :--- | :--- | :--- | :--- |
| AAC-LC (voice or music) | `-Dencoder-sbr=false` | 37.4 KB | 22.0 KB | mono 49 KB, stereo 90 KB |
| Low-bitrate HE-AAC v1 | Defaults | 47.4 KB | 22.0 KB | mono 83 KB, stereo 142 KB |
| Low-bitrate stereo HE-AAC v2 | `-Dencoder-ps=true` | 57.4 KB | 22.0 KB | stereo 184 KB |
| 5.1 surround | `-Dmax-channels=6` as well | +0.7 KB | unchanged | AAC-LC about 250 KB, needs PSRAM |

- **Build options save flash, not RAM.** The encoder's static RAM is 22 KB in every build, and the AAC-LC state is the same with or without HE-AAC compiled in. What you encode decides RAM use: mono against stereo, and AAC-LC against HE-AAC.
- **HE-AAC v2 support costs RAM for every HE stream.** With `encoder-ps` on, HE-AAC v1 state grows from 142 KB to 184 KB for stereo and from 83 KB to 126 KB for mono, even when you never encode v2.
- **More channels cost nothing on stereo streams.** A 6-channel build uses the same state for a stereo stream as a 2-channel build. Do not raise `max-channels` for the decoder without measuring: an 8-channel decoder build was not measured.

## Start building

1. **Build for ESP-IDF.** Use the FAAC and FAAD sources with the [installation guide](/docs/install).
2. **Pick build options.** Start from the table in [Trim the build](#trim-the-build) that matches your goal.
3. **Feed frames or PCM.** FAAD consumes AAC frames; FAAC consumes PCM. See the [libfaad API](/docs/libfaad) and [libfaac API](/docs/libfaac).
4. **Choose where state lives.** It uses internal RAM by default. On the ESP32-S3, move it to PSRAM when you need the headroom.

**ESP8266:** not ESP-IDF. Use the Helix port in [ESP8266Audio](https://github.com/earlephilhower/ESP8266Audio).

## Known limits

- Memory figures are heap taken at open on bare firmware. Wi-Fi, Bluetooth and your own tasks come out of the same pool and were not measured.
- Not tested: an ESP32-S3 without PSRAM, and a WROVER-class classic ESP32 with PSRAM-backed encoder state.
- 5.1 input in the encoder tests was synthesized from a stereo clip. It is valid for memory, not for speed.
- Gate subset; speed and bitrate accuracy, not listening quality.

## Common questions

### Can an ESP32 encode AAC?

Yes. FAAC does AAC-LC, HE-AAC v1 and, with `encoder-ps`, stereo HE-AAC v2. How much fits depends on RAM; see the table above.

### What is the difference between AAC-LC, HE-AAC v1, and HE-AAC v2?

LC is the baseline; v1 adds SBR for low bitrates; v2 adds PS for low-bitrate stereo.

### Does FAAC encode HE-AAC v2 on ESP32?

Yes, on the ESP32-S3, at about 2× real time for 48 kHz stereo. The classic ESP32 cannot open the encoder (184 KB of state), and the ESP32-C6 is far below real time.

### Do I need PSRAM?

Not for decoding, and not for AAC-LC encoding. For stereo HE-AAC encode and for 5.1 encode, yes in practice. State over about 100 KB is unreliable in fragmented internal RAM.

### Can I use AAC on an ESP8266?

AAC-LC decode with Helix. No HE-AAC (no SBR) and no tested encoder.

### Does FAAD support multichannel on ESP32?

Not measured. The decoder benchmark covers stereo.

## Benchmark notes

See the [full ESP32 AAC benchmark notes](https://gist.github.com/nschimme/cfa0a3d225c8c001eb7d998739b7298a) for builds, scenarios, and exact numbers on decoders. The HE-AAC v2 encode, 5.1 and state-size figures on this page come from on-device runs of FAAC at commit `daf64763` on ESP-IDF v5.5.5, using an ESP32-S3 (8 MB PSRAM), an ESP32-C6 and an ESP32-D0WDQ6 without PSRAM.
