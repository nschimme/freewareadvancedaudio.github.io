---
title: FAAC LGPL AAC Encoder — Technical Guide & C API Reference
description: Comprehensive technical guide for the FAAC LGPL v2.1+ MPEG-4 AAC encoder. Features rate control tuning (-b ABR, -q VBR), CLI command examples, generated manual reference, and C API (libfaac) integration.
---

# FAAC LGPL AAC Encoder: Technical Guide & C API Reference

**FAAC (Freeware Advanced Audio Coder)** is a high-performance, open-source MPEG-2 and MPEG-4 AAC audio encoder licensed under the **GNU Lesser General Public License v2.1 or later (LGPL v2.1+)**.

Engineered in clean, modern C11/C99, FAAC is completely free of legacy ISO reference code. It delivers exceptional encoding throughput (>500x realtime) with an ultra-compact binary size (~73 KB), making it an ideal choice for embedded systems, desktop conversion tools, streaming pipelines, and cross-platform applications.

---

## Downloads & Installation

### Package Managers

#### macOS (Homebrew)
Install FAAC on macOS via [Homebrew](https://brew.sh/):
```bash
brew install faac
```

#### Linux Package Managers
- **Debian / Ubuntu**: `sudo apt install faac`
- **Fedora**: `sudo dnf install faac`
- **Arch Linux**: `sudo pacman -S faac`

### Official Releases & Source Code
Source code archives, tagged releases, and release notes for FAAC are published on GitHub:
- **Latest FAAC Releases**: [github.com/FreewareAdvancedAudio/faac/releases](https://github.com/FreewareAdvancedAudio/faac/releases)
- **Source Repository**: [github.com/FreewareAdvancedAudio/faac](https://github.com/FreewareAdvancedAudio/faac)

---

## Core Capabilities & Audio Profiles

### Supported AAC Profiles
- **MPEG-4 AAC-LC (Low Complexity)**: The universal standard for broadcast, streaming, and audio playback across consumer hardware and mobile platforms.
- **MPEG-4 HE-AAC v1 (High-Efficiency AAC with SBR)**: Combines a Low Complexity AAC core with Spectral Band Replication (SBR) to achieve transparent audio at reduced bitrates (32–96 kbps).

### Rate Control Strategies
- **Average Bitrate (ABR - Recommended)**: Configured via the `-b` flag (e.g., `-b 128`). Maintains a target average bitrate across the entire file while dynamically allocating bits to complex passages.
- **Variable Bitrate (VBR)**: Configured via the `-q` flag (e.g., `-q 100`). Maintains constant psychoacoustic quality, allowing bitrates to fluctuate based on signal complexity.
- **Constant Bitrate (CBR)**: Configured via the `--cbr` flag alongside `-b`. Employs a bit reservoir mechanism (6144 bits/channel) for strict bandwidth-constrained transports.

---

## Command-Line Quick Start

### Basic CLI Syntax

```bash
faac [options] -o <output_filename.m4a> <input_filename.wav>
```

### Common Command Examples

#### 1. Standard Stereo Audio (128 kbps ABR)
Recommended default for music and general audio encoding:
```bash
faac -b 128 -w -o output.m4a input.wav
```

#### 2. High-Fidelity Archival Audio (192 kbps ABR)
High-bitrate configuration for critical audio archival:
```bash
faac -b 192 -w -o high_quality.m4a input.wav
```

#### 3. Low-Bitrate Streaming (64 kbps HE-AAC v1 / SBR)
Optimized for voice, podcasting, and bandwidth-constrained streaming:
```bash
faac -b 64 -object 5 -w -o low_bitrate.m4a input.wav
```

---

## Command-Line Manual Page

The following reference is generated automatically from the upstream `faac.1` manual page:

<!-- @include: ./faac-cli-gen.md -->

---

## C API Integration Guide (`libfaac`)

Integrate `libfaac` directly into your C/C++ application for real-time in-memory AAC encoding. Include `<faac.h>` and link against `-lfaac`.

### Complete Lifecycle Example

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <faac.h>

int main(void) {
    unsigned long inputSamples;
    unsigned long maxOutputBytes;

    // 1. Initialize encoder handle (44.1 kHz, 2 Channels)
    faacEncHandle hEncoder = faacEncOpen(44100, 2, &inputSamples, &maxOutputBytes);
    if (!hEncoder) {
        fprintf(stderr, "Error: Failed to initialize FAAC encoder handle\n");
        return 1;
    }

    // 2. Configure encoder parameters
    faacEncConfigurationPtr config = faacEncGetCurrentConfiguration(hEncoder);
    config->bitRate = 128000 / 2; // Bitrate per channel (64 kbps/ch = 128 kbps stereo)
    config->aacObjectType = LOW;   // AAC-LC Profile
    config->mpegVersion = MPEG4;   // MPEG-4 AAC
    config->useTns = 1;            // Enable Temporal Noise Shaping
    config->allowMidSide = 1;      // Enable Mid/Side Stereo

    if (!faacEncSetConfiguration(hEncoder, config)) {
        fprintf(stderr, "Error: Invalid FAAC encoder configuration\n");
        faacEncClose(hEncoder);
        return 1;
    }

    // 3. Allocate buffers
    int32_t *pcmInput = (int32_t *)malloc(inputSamples * sizeof(int32_t));
    unsigned char *aacOutput = (unsigned char *)malloc(maxOutputBytes);

    // 4. Encode audio frame
    // (Fill pcmInput with 32-bit PCM audio samples here)
    int bytesEncoded = faacEncEncode(hEncoder, pcmInput, inputSamples, aacOutput, maxOutputBytes);

    if (bytesEncoded > 0) {
        // Process or write encoded AAC bitstream buffer (aacOutput)
    }

    // 5. Cleanup resources
    free(pcmInput);
    free(aacOutput);
    faacEncClose(hEncoder);
    return 0;
}
```

### Core API Functions

#### `faacEncOpen`
```c
faacEncHandle faacEncOpen(unsigned long sampleRate,
                          unsigned int numChannels,
                          unsigned long *inputSamples,
                          unsigned long *maxOutputBytes);
```
Allocates an encoder instance for the given sample rate and channel configuration. Sets `inputSamples` to the required PCM samples per frame and `maxOutputBytes` to the worst-case encoded buffer size.

#### `faacEncGetCurrentConfiguration` / `faacEncSetConfiguration`
```c
faacEncConfigurationPtr faacEncGetCurrentConfiguration(faacEncHandle hEncoder);
int faacEncSetConfiguration(faacEncHandle hEncoder, faacEncConfigurationPtr config);
```
Retrieves and applies the encoder configuration structure controlling bitrates, object types, and acoustic modules.

#### `faacEncEncode`
```c
int faacEncEncode(faacEncHandle hEncoder,
                  int32_t *inputBuffer,
                  unsigned int samplesInput,
                  unsigned char *outputBuffer,
                  unsigned int bufferSize);
```
Encodes a frame of PCM audio samples into an AAC bitstream packet. Returns the number of encoded bytes generated.

#### `faacEncClose`
```c
void faacEncClose(faacEncHandle hEncoder);
```
Finalizes bitstream output, flushes internal state, and releases all allocated memory.
