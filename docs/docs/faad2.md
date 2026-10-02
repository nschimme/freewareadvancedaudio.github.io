---
title: FAAD2 & FAAD3 AAC Decoder — Technical Guide & C API Reference
description: Comprehensive technical guide for the FAAD2 (GPL v2+) and FAAD3 (LGPL v2.1+) MPEG-4 AAC decoders. Features multi-channel surround decoding, CLI command examples, generated manual reference, and C API (libfaad) integration.
---

# FAAD2 & FAAD3 AAC Decoder: Technical Guide & C API Reference

**FAAD2 (Freeware Advanced Audio Decoder 2)** is an ultra-fast, open-source MPEG-2 and MPEG-4 AAC audio decoder written in **C99** under the **GNU General Public License v2 or later (GPL v2+)**.

The next-generation **FAAD3** decoder is written in clean **C11** and relicensed under the **GNU Lesser General Public License v2.1 or later (LGPL v2.1+)**, making it seamlessly embeddable into commercial applications and open-source libraries.

Both decoders support the full spectrum of MPEG AAC profiles—including AAC-LC, HE-AAC v1 (SBR), HE-AAC v2 (Parametric Stereo), Main, and LTP—with multi-channel surround sound mapping up to 7.1 channels.

---

## Technical Capabilities & AAC Profile Support

### Supported Profiles & Containers
- **MPEG-4 AAC-LC (Low Complexity)**: Full decoding support for standard 16-bit, 24-bit, and 32-bit PCM output.
- **MPEG-4 HE-AAC v1 (SBR)**: Reconstructs high-frequency audio components via Spectral Band Replication.
- **MPEG-4 HE-AAC v2 (PS)**: Decodes Parametric Stereo streams for low-bitrate spatial audio.
- **Containers & Transports**: Decodes raw ADTS `.aac` bitstreams, MP4/M4A audio tracks, and ADIF streams.

### Surround Sound & Performance
- **Multi-Channel Audio**: Full channel mapping for 5.1 and 7.1 surround sound streams, with optional downmixing to 2-channel stereo (`-d` flag).
- **High Throughput**: Achieves **>350x–500x realtime** decoding performance with an ultra-low peak RAM footprint (~2.8 MB).

---

## Command-Line Quick Start

### Basic CLI Syntax

```bash
faad [options] <input_filename.aac|input_filename.m4a>
```

### Common Command Examples

#### 1. Decode AAC / M4A to Uncompressed WAV
Decodes an M4A audio file into a 16-bit PCM WAV file:
```bash
faad -o decoded_output.wav input.m4a
```

#### 2. Inspect Bitstream Headers & Audio Metadata
Analyzes bitstream parameters, object types, sample rate, and channel configuration without decoding audio:
```bash
faad -i audio_file.aac
```

#### 3. Downmix 5.1 Surround Stream to Stereo WAV
Decodes a 5.1 surround sound stream and downmixes output to 2-channel stereo PCM:
```bash
faad -d -o stereo_downmix.wav surround_51.m4a
```

---

## Command-Line Manual Page

The following reference is generated automatically from the upstream `faad.man` manual page:

<!-- @include: ./faad2-cli-gen.md -->

---

## C API Integration Guide (`libfaad`)

Integrate `libfaad2` directly into your C/C++ media engine or playback framework. Include `<faad.h>` and link against `-lfaad`.

### Complete Lifecycle Example

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <faad.h>

int main(void) {
    // 1. Allocate decoder handle
    NeAACDecHandle hDecoder = NeAACDecOpen();
    if (!hDecoder) {
        fprintf(stderr, "Error: Failed to initialize FAAD2 decoder handle\n");
        return 1;
    }

    // 2. Configure decoder settings
    NeAACDecConfigurationPtr config = NeAACDecGetCurrentConfiguration(hDecoder);
    config->outputFormat = FAAD_FMT_16BIT; // 16-bit integer PCM output
    NeAACDecSetConfiguration(hDecoder, config);

    // 3. Initialize decoder with first frame / header buffer
    unsigned char buffer[2048] = { /* AAC bitstream header or first frame bytes */ };
    unsigned long sampleRate;
    unsigned char channels;

    long initResult = NeAACDecInit(hDecoder, buffer, sizeof(buffer), &sampleRate, &channels);
    if (initResult < 0) {
        fprintf(stderr, "Error: Failed to parse AAC bitstream header\n");
        NeAACDecClose(hDecoder);
        return 1;
    }

    printf("Bitstream Initialized: %lu Hz, %d Channels\n", sampleRate, channels);

    // 4. Decode frame loop
    NeAACDecFrameInfo frameInfo;
    void *pcmSamples = NeAACDecDecode(hDecoder, &frameInfo, buffer, sizeof(buffer));

    if (frameInfo.error == 0 && frameInfo.samples > 0) {
        // pcmSamples points to decoded PCM audio buffer
        // Bytes consumed from input buffer = frameInfo.bytesconsumed
    } else if (frameInfo.error > 0) {
        fprintf(stderr, "Decode error: %s\n", NeAACDecGetErrorMessage(frameInfo.error));
    }

    // 5. Cleanup handle
    NeAACDecClose(hDecoder);
    return 0;
}
```

### Core API Functions

#### `NeAACDecOpen`
```c
NeAACDecHandle NeAACDecOpen(void);
```
Allocates and initializes a new FAAD2 decoder instance.

#### `NeAACDecGetCurrentConfiguration` / `NeAACDecSetConfiguration`
```c
NeAACDecConfigurationPtr NeAACDecGetCurrentConfiguration(NeAACDecHandle hDecoder);
unsigned char NeAACDecSetConfiguration(NeAACDecHandle hDecoder, NeAACDecConfigurationPtr config);
```
Retrieves and updates decoder settings, including sample format (16-bit, 24-bit, 32-bit float) and downmix parameters.

#### `NeAACDecInit`
```c
long NeAACDecInit(NeAACDecHandle hDecoder,
                  unsigned char *buffer,
                  unsigned long bufferSize,
                  unsigned long *sampleRate,
                  unsigned char *channels);
```
Initializes bitstream parsing from initial header bytes or AudioSpecificConfig (ASC) payload. Returns sample rate and channel count.

#### `NeAACDecDecode`
```c
void* NeAACDecDecode(NeAACDecHandle hDecoder,
                     NeAACDecFrameInfo *frameInfo,
                     unsigned char *buffer,
                     unsigned long bufferSize);
```
Decodes a single AAC frame into raw PCM audio samples and updates `NeAACDecFrameInfo` with byte consumption and channel details.

#### `NeAACDecClose`
```c
void NeAACDecClose(NeAACDecHandle hDecoder);
```
Releases all internal state and frees memory allocated for the decoder instance.
