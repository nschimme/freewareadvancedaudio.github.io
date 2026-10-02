---
title: FAAD2 AAC Decoder — Guide, CLI Options & C API
description: Complete technical documentation for FAAD2 GPL v2+ and FAAD3 LGPL v2.1+ AAC audio decoders. Covers command-line usage, generated CLI reference, HE-AAC decoding, and C API (libfaad).
---

# FAAD2 & FAAD3 AAC Decoder: Guide, CLI Options & C API

**FAAD2 (Freeware Advanced Audio Decoder 2)** is a fast, standalone **GPL v2+** open-source MPEG-2 and MPEG-4 AAC audio decoder written in **C99**.

The next-generation **FAAD3** decoder is written in clean **C11** and relicensed under **LGPL v2.1+**, providing lightweight, LGPL-compliant decoding for embedded systems and cross-platform applications.

Both decoders support AAC-LC, HE-AAC v1 (SBR), HE-AAC v2 (Parametric Stereo), Main, and LTP profiles, as well as multi-channel surround sound streams (up to 7.1 channels).

---

## Key Features & Capabilities

- **Licensing & Architecture**:
  - **FAAD2**: **GPL v2+** license, written in portable **C99**.
  - **FAAD3**: **LGPL v2.1+** license, rewritten in modern **C11** for seamless commercial and open-source library integration.
- **Full AAC Profile Support**:
  - **MPEG-4 AAC-LC** (Low Complexity)
  - **HE-AAC v1** (Spectral Band Replication - SBR)
  - **HE-AAC v2** (Parametric Stereo - PS)
  - **MPEG-2 AAC** (ADTS and raw streams)
- **Multi-Channel & Surround Sound**: Decodes 5.1 and 7.1 surround sound AAC streams with full channel mapping.
- **Container Format Support**: Decodes raw ADTS `.aac` streams, MP4/M4A containers, and MP4 audio tracks.
- **Ultra-Fast Performance**: Achieves **>350x–500x realtime** decoding speeds with minimal RAM footprint (~2.8 MB peak memory).

---

## Quick Start CLI Examples

### Syntax

```bash
faad [options] <input.aac|input.m4a>
```

#### 1. Decode AAC or M4A File to WAV
```bash
faad -o decoded_output.wav input.m4a
```

#### 2. Inspect AAC Bitstream Headers & Metadata
```bash
faad -i audio_file.aac
```

#### 3. Downmix 5.1 Surround Stream to Stereo WAV
```bash
faad -d -o stereo_downmix.wav surround_51.m4a
```

---

## FAAD Command-Line Interface Manual (Generated from Man Page)

The command-line interface documentation below is generated directly from the upstream `faad.man` manual page in the repository.

<!-- @include: ./faad2-cli-gen.md -->

---

## C API Reference (`libfaad`)

Integrate `libfaad2` directly into your C/C++ audio playback application or decoder pipeline. Include `<faad.h>` and link against `-lfaad`.

### Complete Integration Example

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <faad.h>

int main(void) {
    // 1. Open decoder handle
    NeAACDecHandle hDecoder = NeAACDecOpen();
    if (!hDecoder) {
        fprintf(stderr, "Failed to initialize FAAD2 decoder handle\n");
        return 1;
    }

    // 2. Configure decoder options
    NeAACDecConfigurationPtr config = NeAACDecGetCurrentConfiguration(hDecoder);
    config->outputFormat = FAAD_FMT_16BIT; // 16-bit PCM output
    NeAACDecSetConfiguration(hDecoder, config);

    // 3. Initialize decoder with stream buffer
    unsigned char buffer[2048] = { /* AAC bitstream header or first frame bytes */ };
    unsigned long sampleRate;
    unsigned char channels;

    long initResult = NeAACDecInit(hDecoder, buffer, sizeof(buffer), &sampleRate, &channels);
    if (initResult < 0) {
        fprintf(stderr, "Failed to initialize FAAD2 bitstream stream\n");
        NeAACDecClose(hDecoder);
        return 1;
    }

    printf("Initialized stream: %lu Hz, %d Channels\n", sampleRate, channels);

    // 4. Decode frame loop
    NeAACDecFrameInfo frameInfo;
    void *pcmSamples = NeAACDecDecode(hDecoder, &frameInfo, buffer, sizeof(buffer));

    if (frameInfo.error == 0 && frameInfo.samples > 0) {
        // pcmSamples points to decoded PCM audio buffer
        // Frame byte length consumed = frameInfo.bytesconsumed
    } else if (frameInfo.error > 0) {
        fprintf(stderr, "Decode error: %s\n", NeAACDecGetErrorMessage(frameInfo.error));
    }

    // 5. Cleanup
    NeAACDecClose(hDecoder);
    return 0;
}
```

### Core C API Functions

#### `NeAACDecOpen`
```c
NeAACDecHandle NeAACDecOpen(void);
```
Allocates and initializes a new FAAD2 decoder handle instance.

#### `NeAACDecGetCurrentConfiguration` / `NeAACDecSetConfiguration`
```c
NeAACDecConfigurationPtr NeAACDecGetCurrentConfiguration(NeAACDecHandle hDecoder);
unsigned char NeAACDecSetConfiguration(NeAACDecHandle hDecoder, NeAACDecConfigurationPtr config);
```
Gets or updates decoder parameters, including PCM sample format (16-bit, 24-bit, 32-bit float) and multi-channel downmixing settings.

#### `NeAACDecInit`
```c
long NeAACDecInit(NeAACDecHandle hDecoder,
                  unsigned char *buffer,
                  unsigned long bufferSize,
                  unsigned long *sampleRate,
                  unsigned char *channels);
```
Initializes bitstream parsing using frame headers or AudioSpecificConfig (ASC) initialization bytes.

#### `NeAACDecDecode`
```c
void* NeAACDecDecode(NeAACDecHandle hDecoder,
                     NeAACDecFrameInfo *frameInfo,
                     unsigned char *buffer,
                     unsigned long bufferSize);
```
Decodes a single AAC bitstream frame into raw PCM audio samples and populates the `NeAACDecFrameInfo` metadata struct.

#### `NeAACDecClose`
```c
void NeAACDecClose(NeAACDecHandle hDecoder);
```
Frees all memory resources allocated for the decoder handle.
