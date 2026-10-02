---
title: FAAD2 AAC Decoder Guide & C API Reference
description: Complete guide for FAAD2 (GPL v2+ AAC decoder) and FAAD3 (LGPL v2.1+). Includes installation, CLI examples, multi-channel surround decoding, CLI reference, and libfaad C API documentation.
---

# FAAD2 AAC Decoder Guide & C API Reference

**FAAD2 (Freeware Advanced Audio Decoder 2)** is an open-source MPEG-2 and MPEG-4 AAC audio decoder licensed under **GPL v2+** (written in C99).

The next-generation **FAAD3** decoder is written in clean C11 under **LGPL v2.1+**, providing lightweight, LGPL-compliant decoding for embedded systems and applications.

---

## Quick Start & Installation

### Installation

```bash
# macOS
brew install faad2

# Linux (Debian/Ubuntu, Fedora, Arch)
sudo apt install faad        # Debian / Ubuntu
sudo dnf install faad2       # Fedora
sudo pacman -S faad2        # Arch Linux
```

Source archives and release notes are available on [GitHub Releases](https://github.com/FreewareAdvancedAudio/faad2/releases).

### CLI Usage Examples

```bash
# 1. Decode AAC or M4A to uncompressed WAV
faad -o decoded_output.wav input.m4a

# 2. Inspect bitstream parameters and audio metadata
faad -i audio_file.aac

# 3. Downmix 5.1 surround sound stream to 2-channel stereo WAV
faad -d -o stereo_downmix.wav surround_51.m4a
```

---

## Technical Highlights & Profiles

| Feature | Details |
| :--- | :--- |
| **Licensing** | FAAD2: GPL v2+ (C99) \| FAAD3: LGPL v2.1+ (C11) |
| **Supported Profiles** | MPEG-4 AAC-LC, HE-AAC v1 (SBR), HE-AAC v2 (PS), Main, LTP |
| **Surround Sound** | Up to 7.1 channel surround sound with optional 2-channel downmix (`-d`) |
| **Containers** | Raw ADTS `.aac`, MP4/M4A containers, ADIF streams |

---

## Command-Line Interface Reference

The command-line manual below is generated directly from the upstream `faad.man` man page.

<!-- @include: ./faad2-cli-gen.md -->

---

## C API Reference (`libfaad`)

Link against `-lfaad` and include `<faad.h>`.

### Integration Lifecycle

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <faad.h>

int main(void) {
    // 1. Allocate decoder handle
    NeAACDecHandle hDecoder = NeAACDecOpen();
    if (!hDecoder) return 1;

    // 2. Configure decoder (16-bit PCM output)
    NeAACDecConfigurationPtr config = NeAACDecGetCurrentConfiguration(hDecoder);
    config->outputFormat = FAAD_FMT_16BIT;
    NeAACDecSetConfiguration(hDecoder, config);

    // 3. Initialize decoder with bitstream header
    unsigned char buffer[2048] = { /* AAC header or first frame bytes */ };
    unsigned long sampleRate;
    unsigned char channels;

    if (NeAACDecInit(hDecoder, buffer, sizeof(buffer), &sampleRate, &channels) < 0) {
        NeAACDecClose(hDecoder);
        return 1;
    }

    // 4. Decode frame
    NeAACDecFrameInfo frameInfo;
    void *pcmSamples = NeAACDecDecode(hDecoder, &frameInfo, buffer, sizeof(buffer));

    // 5. Cleanup
    NeAACDecClose(hDecoder);
    return 0;
}
```

### Core API Functions

#### `NeAACDecOpen`
```c
NeAACDecHandle NeAACDecOpen(void);
```
Initializes a new FAAD2 decoder instance.

#### `NeAACDecGetCurrentConfiguration` / `NeAACDecSetConfiguration`
```c
NeAACDecConfigurationPtr NeAACDecGetCurrentConfiguration(NeAACDecHandle hDecoder);
unsigned char NeAACDecSetConfiguration(NeAACDecHandle hDecoder, NeAACDecConfigurationPtr config);
```
Gets and sets decoder settings (PCM sample format, downmixing).

#### `NeAACDecInit`
```c
long NeAACDecInit(NeAACDecHandle hDecoder, unsigned char *buffer,
                  unsigned long bufferSize, unsigned long *sampleRate,
                  unsigned char *channels);
```
Parses stream header / AudioSpecificConfig bytes to set sample rate and channels.

#### `NeAACDecDecode`
```c
void* NeAACDecDecode(NeAACDecHandle hDecoder, NeAACDecFrameInfo *frameInfo,
                     unsigned char *buffer, unsigned long bufferSize);
```
Decodes a single AAC frame into raw PCM audio samples and updates `frameInfo`.

#### `NeAACDecClose`
```c
void NeAACDecClose(NeAACDecHandle hDecoder);
```
Frees decoder handle memory and resources.
