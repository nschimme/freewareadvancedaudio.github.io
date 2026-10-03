---
title: FAAC AAC Encoder Guide & C API Reference
description: Complete guide for FAAC (LGPL v2.1+ AAC encoder). Includes CLI usage examples, rate control tuning (-b ABR, -q VBR), and libfaac C API documentation.
---

# FAAC AAC Encoder Guide & C API Reference

**FAAC (Freeware Advanced Audio Coder)** is an open-source MPEG-2 and MPEG-4 AAC audio encoder licensed under **LGPL v2.1+**.

Written in clean C11/C99 without legacy ISO reference code, FAAC delivers high encoding throughput (>500x realtime) with an ultra-small binary footprint (~73 KB).

---

## Technical Highlights

| Feature | Details |
| :--- | :--- |
| **License** | GNU Lesser General Public License v2.1+ (LGPL v2.1+) |
| **Supported Profiles** | MPEG-4 AAC-LC, MPEG-4 HE-AAC v1 (SBR) |
| **Rate Control** | Average Bitrate (`-b`), Variable Bitrate (`-q`), Constant Bitrate (`--cbr`) |
| **Binary Footprint** | ~73 KB compiled binary |
| **Installation** | See [Installation Guide](/docs/install) |
| **Full CLI Options** | See [FAAC CLI Manual Page](/docs/faac-cli) |

---

## Quick Start CLI Examples

```bash
# 1. Standard stereo encoding (128 kbps ABR - recommended default)
faac -b 128 -w -o output.m4a input.wav

# 2. High-fidelity archival encoding (192 kbps ABR)
faac -b 192 -w -o high_quality.m4a input.wav

# 3. Low-bitrate streaming (64 kbps HE-AAC v1 / SBR)
faac -b 64 -object 5 -w -o low_bitrate.m4a input.wav
```

For complete options and flags, view the dedicated [FAAC Command-Line Manual](/docs/faac-cli).

---

## C API Reference (`libfaac`)

FAAC 2.0 introduces a modern, thread-safe C API. Link against `-lfaac` and include `<faac.h>`.

### Integration Lifecycle

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <faac.h>

int main(void) {
    faac_params params;
    faac_encoder *hEncoder = NULL;

    // 1. Initialize parameter struct (zeroes memory and stamps struct_size)
    faac_params_init(&params, sizeof(params));
    params.sample_rate = 44100;
    params.num_channels = 2;
    params.bit_rate = 64000; // Bitrate per channel (64 kbps x 2 = 128 kbps stereo)
    params.object_type = FAAC_OBJ_LOW; // AAC-LC
    params.output_format = FAAC_STREAM_ADTS;
    params.input_format = FAAC_INPUT_16BIT;

    // 2. Open encoder instance
    faac_status st = faac_encoder_open(&params, &hEncoder);
    if (st != FAAC_OK) {
        fprintf(stderr, "Encoder open failed: %s\n", faac_strerror(st));
        return 1;
    }

    // 3. Query resolved encoder properties & gapless priming delay
    faac_encoder_info info = { .struct_size = sizeof(info) };
    faac_encoder_get_info(hEncoder, &info);

    printf("Frame samples: %u, Max output bytes: %u, Encoder delay: %u samples\n",
           info.frame_samples, info.max_output_bytes, info.encoder_delay);

    // 4. Allocate buffers and encode PCM frames
    uint32_t pcmSamples = info.frame_samples * params.num_channels;
    int16_t *pcmInput = calloc(pcmSamples, sizeof(int16_t));
    uint8_t *aacOutput = malloc(info.max_output_bytes);
    uint32_t bytesWritten = 0;

    st = faac_encoder_encode(hEncoder, pcmInput, pcmSamples, aacOutput, info.max_output_bytes, &bytesWritten);

    // 5. Cleanup
    free(pcmInput);
    free(aacOutput);
    faac_encoder_close(&hEncoder);
    return 0;
}
```

### Core API Functions

#### `faac_params_init`
```c
faac_status faac_params_init(faac_params *p, uint32_t caller_size);
```
Zeroes parameter memory and sets `struct_size` to ensure ABI compatibility across versions.

#### `faac_encoder_open`
```c
faac_status faac_encoder_open(const faac_params *p, faac_encoder **out);
```
Validates supplied configuration parameters and initializes an encoder instance handle in `*out`.

#### `faac_encoder_get_info`
```c
faac_status faac_encoder_get_info(faac_encoder *enc, faac_encoder_info *out);
```
Queries resolved encoder properties, including `frame_samples`, `max_output_bytes`, and gapless priming delay (`encoder_delay`).

#### `faac_encoder_encode`
```c
faac_status faac_encoder_encode(faac_encoder *enc,
                                const void *in, uint32_t in_samples,
                                uint8_t *out, uint32_t out_cap,
                                uint32_t *bytes_written);
```
Encodes PCM audio samples into an AAC bitstream packet. Pass `in = NULL` or `in_samples = 0` to flush remaining buffered frames at end-of-stream.

#### Gapless Playback & Priming Delay (`encoder_delay`)
FAAC 2.0 tracks exact encoder priming delay in `info.encoder_delay` (in output sample units). When muxing into MP4 containers (`.m4a`), use `encoder_delay` and padding sample counts to write gapless metadata atoms (`iTunSMPB` or edit lists), matching the gapless handling implemented in `faac` CLI.

#### `faac_encoder_close`
```c
faac_status faac_encoder_close(faac_encoder **enc);
```
Destroys encoder instance and sets handle to `NULL` to guard against double-free errors.
