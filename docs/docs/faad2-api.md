# FAAD2 C API Reference (`libfaad`)

`libfaad` is the C decoding library for MPEG-2 and MPEG-4 AAC audio streams, including HE-AAC v1/v2 (SBR and PS).

---

## Initialization & Stream Decoding Flow

```c
#include <faad.h>

// 1. Open decoder handle
faacDecHandle hDecoder = NeAACDecOpen();

// 2. Configure decoder capabilities
faacDecConfigurationPtr config = NeAACDecGetCurrentConfiguration(hDecoder);
config->outputFormat = FAAD_FMT_16BIT; // 16-bit PCM output
NeAACDecSetConfiguration(hDecoder, config);

// 3. Initialize decoder with stream buffer
unsigned long samplerate;
unsigned char channels;
NeAACDecInit(hDecoder, buffer, buffer_len, &samplerate, &channels);

// 4. Decode frame loop
faacDecFrameInfo frameInfo;
void *pcm_samples = NeAACDecDecode(hDecoder, &frameInfo, buffer, buffer_len);

if (frameInfo.error == 0 && frameInfo.samples > 0) {
    // pcm_samples contains frameInfo.samples * sizeof(int16_t) PCM bytes
}

// 5. Close decoder handle
NeAACDecClose(hDecoder);
```

---

## Core API Reference

### `NeAACDecOpen`
```c
faacDecHandle NeAACDecOpen(void);
```
Allocates and initializes a new FAAD2 decoder handle.

### `NeAACDecGetCurrentConfiguration` / `NeAACDecSetConfiguration`
```c
faacDecConfigurationPtr NeAACDecGetCurrentConfiguration(faacDecHandle hDecoder);
unsigned char NeAACDecSetConfiguration(faacDecHandle hDecoder, faacDecConfigurationPtr config);
```
Gets or sets the current decoding configuration options (e.g. PCM sample format, downmixing).

### `NeAACDecInit`
```c
long NeAACDecInit(faacDecHandle hDecoder,
                  unsigned char *buffer,
                  unsigned long buffer_size,
                  unsigned long *samplerate,
                  unsigned char *channels);
```
Initializes the decoder using the bitstream header bytes or first frame.

### `NeAACDecDecode`
```c
void* NeAACDecDecode(faacDecHandle hDecoder,
                     faacDecFrameInfo *frameInfo,
                     unsigned char *buffer,
                     unsigned long buffer_size);
```
Decodes a single AAC frame from the bitstream buffer into raw PCM audio samples.

### `NeAACDecClose`
```c
void NeAACDecClose(faacDecHandle hDecoder);
```
Frees all resources associated with the decoder instance.
