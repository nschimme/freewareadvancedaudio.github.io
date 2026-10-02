---
title: FAAC LGPL AAC Encoder — Guide, CLI Options & C API
description: Complete technical documentation for FAAC 2.0+ LGPL v2.1+ AAC audio encoder. Covers command-line usage (-b bitrate, profiles), C API reference (libfaac), and FFmpeg integration.
---

# FAAC LGPL AAC Encoder: Guide, CLI Options & C API

**FAAC (Freeware Advanced Audio Coder)** is an ISO-free, high-performance **LGPL v2.1+** open-source MPEG-2 and MPEG-4 AAC audio encoder.

Written in clean C11/C99, FAAC is designed for embedded systems, desktop converters (such as [fre:ac](https://www.freac.org/)), mobile applications, and cross-platform runtimes requiring fast, high-quality audio compression without proprietary licensing constraints.

---

## Key Features & Licensing

- **LGPL v2.1+ License**: Free and open-source software suitable for static or dynamic linking in commercial and open-source applications.
- **ISO-Free Codebase**: Completely rewritten from scratch—contains zero legacy ISO reference code or proprietary headers.
- **AAC Profiles Supported**:
  - **MPEG-4 AAC-LC** (Low Complexity) — Mainstream profile for broad hardware and software compatibility.
  - **MPEG-4 HE-AAC v1** (High-Efficiency AAC with SBR) — Optimized for low bitrates (32–96 kbps).
- **Flexible Rate Control Modes**:
  - **Average Bitrate (ABR)** (`-b` flag) — Recommended rate control mode for optimal quality distribution.
  - **Variable Bitrate (VBR)** (`-q` flag) — Quality-based variable bitrate encoding.
  - **Constant Bitrate (CBR)** (`--cbr` flag) — Fixed bitrate encoding with bit reservoir modeling.
- **High Throughput**: Encodes audio at **300x–600x realtime** speeds with a minimal binary size (~73 KB compiled).

---

## FAAC Command-Line Interface (CLI Guide)

### Syntax

```bash
faac [options] -o <output.aac|output.m4a> <input.wav>
```

### Essential CLI Flags

| Option | Flag | Description | Default / Recommended |
| :--- | :--- | :--- | :--- |
| **Average Bitrate** | `-b <kbps>` | Target average bitrate in kilobits per second per channel/stream | **`128`** (for stereo LC) |
| **VBR Quality** | `-q <quality>` | Set VBR quality level (10–500, higher is better quality) | `100` |
| **Bitrate Mode** | `--cbr` | Force strict Constant Bitrate (CBR) encoding | Off (ABR/VBR) |
| **AAC Profile** | `-object <type>` | Set object type: `2` (LC), `5` (HE-AAC v1 / SBR) | `2` (AAC-LC) |
| **Cutoff Frequency** | `-c <cutoff>` | Set low-pass filter cutoff frequency in Hz | Auto-calculated |
| **MP4 Container** | `-w` | Wrap output AAC stream inside an MP4/M4A container | Off (Raw ADTS `.aac`) |

### Usage Examples

#### 1. Standard Stereo Encoding (128 kbps ABR)
```bash
faac -b 128 -w -o output.m4a input.wav
```

#### 2. High-Quality Archival Encoding (192 kbps ABR)
```bash
faac -b 192 -w -o high_quality.m4a input.wav
```

#### 3. Low-Bitrate HE-AAC v1 Stream (64 kbps SBR)
```bash
faac -b 64 -object 5 -w -o low_bitrate.m4a input.wav
```


---

## C API Reference (`libfaac`)

Integrate `libfaac` directly into your C/C++ application. Include `<faac.h>` and link against `-lfaac`.

### Complete Integration Example

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <faac.h>

int main(void) {
    unsigned long inputSamples;
    unsigned long maxOutputBytes;

    // 1. Open encoder instance (44.1 kHz, 2 Channels)
    faacEncHandle hEncoder = faacEncOpen(44100, 2, &inputSamples, &maxOutputBytes);
    if (!hEncoder) {
        fprintf(stderr, "Failed to open FAAC encoder handle\n");
        return 1;
    }

    // 2. Configure encoder settings
    faacEncConfigurationPtr config = faacEncGetCurrentConfiguration(hEncoder);
    config->bitRate = 128000 / 2; // Bitrate per channel (64 kbps/ch = 128 kbps stereo)
    config->aacObjectType = LOW;   // AAC-LC Profile
    config->mpegVersion = MPEG4;   // MPEG-4 AAC
    config->useTns = 1;            // Enable Temporal Noise Shaping
    config->allowMidSide = 1;      // Enable Mid/Side Stereo

    // Apply configuration
    if (!faacEncSetConfiguration(hEncoder, config)) {
        fprintf(stderr, "Failed to set FAAC configuration\n");
        faacEncClose(hEncoder);
        return 1;
    }

    // 3. Prepare sample buffers
    int32_t *pcmInput = malloc(inputSamples * sizeof(int32_t));
    unsigned char *aacOutput = malloc(maxOutputBytes);

    // 4. Encode audio frame loop
    // Populate pcmInput buffer with audio PCM samples...
    int bytesEncoded = faacEncEncode(hEncoder, pcmInput, inputSamples, aacOutput, maxOutputBytes);

    if (bytesEncoded > 0) {
        // Write aacOutput buffer to output file or stream
    }

    // 5. Cleanup
    free(pcmInput);
    free(aacOutput);
    faacEncClose(hEncoder);
    return 0;
}
```

### Core C API Functions

#### `faacEncOpen`
```c
faacEncHandle faacEncOpen(unsigned long sampleRate,
                          unsigned int numChannels,
                          unsigned long *inputSamples,
                          unsigned long *maxOutputBytes);
```
Opens an encoder handle for the specified sample rate and channel count. Returns the required input sample count per frame and maximum output buffer size.

#### `faacEncGetCurrentConfiguration` / `faacEncSetConfiguration`
```c
faacEncConfigurationPtr faacEncGetCurrentConfiguration(faacEncHandle hEncoder);
int faacEncSetConfiguration(faacEncHandle hEncoder, faacEncConfigurationPtr config);
```
Gets and sets the encoder configuration struct controlling bitrates, object types, and filter settings.

#### `faacEncEncode`
```c
int faacEncEncode(faacEncHandle hEncoder,
                  int32_t *inputBuffer,
                  unsigned int samplesInput,
                  unsigned char *outputBuffer,
                  unsigned int bufferSize);
```
Encodes a frame of PCM audio samples into an AAC bitstream frame. Returns the encoded byte length.

#### `faacEncClose`
```c
void faacEncClose(faacEncHandle hEncoder);
```
Closes the encoder instance and releases allocated internal resources.
