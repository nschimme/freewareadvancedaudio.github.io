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

Link against `-lfaac` and include `<faac.h>`.

### Integration Lifecycle

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <faac.h>

int main(void) {
    unsigned long inputSamples, maxOutputBytes;

    // 1. Open encoder handle (44.1 kHz, 2 channels)
    faacEncHandle hEncoder = faacEncOpen(44100, 2, &inputSamples, &maxOutputBytes);
    if (!hEncoder) return 1;

    // 2. Configure encoder (128 kbps stereo ABR, AAC-LC)
    faacEncConfigurationPtr config = faacEncGetCurrentConfiguration(hEncoder);
    config->bitRate = 64000;      // Bitrate per channel (64 kbps = 128 kbps stereo)
    config->aacObjectType = LOW;  // AAC-LC Profile
    config->mpegVersion = MPEG4;  // MPEG-4 AAC
    faacEncSetConfiguration(hEncoder, config);

    // 3. Allocate buffers and encode frame
    int32_t *pcmInput = malloc(inputSamples * sizeof(int32_t));
    unsigned char *aacOutput = malloc(maxOutputBytes);

    int bytesEncoded = faacEncEncode(hEncoder, pcmInput, inputSamples, aacOutput, maxOutputBytes);

    // 4. Cleanup
    free(pcmInput);
    free(aacOutput);
    faacEncClose(hEncoder);
    return 0;
}
```

### Core API Functions

#### `faacEncOpen`
```c
faacEncHandle faacEncOpen(unsigned long sampleRate, unsigned int numChannels,
                          unsigned long *inputSamples, unsigned long *maxOutputBytes);
```
Initializes an encoder handle. Returns required PCM samples per frame in `inputSamples` and maximum output buffer size in `maxOutputBytes`.

#### `faacEncGetCurrentConfiguration` / `faacEncSetConfiguration`
```c
faacEncConfigurationPtr faacEncGetCurrentConfiguration(faacEncHandle hEncoder);
int faacEncSetConfiguration(faacEncHandle hEncoder, faacEncConfigurationPtr config);
```
Gets and sets encoder parameters (bitrate, object type, TNS, M/S stereo).

#### `faacEncEncode`
```c
int faacEncEncode(faacEncHandle hEncoder, int32_t *inputBuffer,
                  unsigned int samplesInput, unsigned char *outputBuffer,
                  unsigned int bufferSize);
```
Encodes a frame of 32-bit PCM audio samples into an AAC packet. Returns output byte count.

#### `faacEncClose`
```c
void faacEncClose(faacEncHandle hEncoder);
```
Closes encoder instance and releases allocated resources.
