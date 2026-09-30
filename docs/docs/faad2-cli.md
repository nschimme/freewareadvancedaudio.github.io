# FAAD2 CLI & C API Reference

## Command Line Interface (`faad`)

```bash
faad [options] input.m4a
```

### Options Overview

- `-o <filename>`: Output WAV filename (`-` for stdout).
- `-a <filename>`: Output raw AAC stream to file.
- `-i`: Display track info and metadata tags without decoding.
- `-f <format>`: Output format (`0` = WAV, `1` = RAW PCM, `2` = AU).

### Example Commands

```bash
# Decode M4A file to WAV
faad -o output.wav input.m4a

# Print audio track metadata
faad -i input.m4a
```

---

## C API Reference (`libfaad`)

```c
#include <stdio.h>
#include <faad.h>

int main(void) {
    NeAACDecHandle hDecoder = NeAACDecOpen();

    NeAACDecConfigurationPtr config = NeAACDecGetCurrentConfiguration(hDecoder);
    config->outputFormat = FAAD_FMT_16BIT;
    NeAACDecSetConfiguration(hDecoder, config);

    // Initialize decoder with buffer
    unsigned long samplerate;
    unsigned char channels;
    unsigned char buffer[1024]; // ASC or ADTS frame

    if (NeAACDecInit(hDecoder, buffer, sizeof(buffer), &samplerate, &channels) < 0) {
        fprintf(stderr, "Failed to initialize FAAD2 decoder\n");
        NeAACDecClose(hDecoder);
        return 1;
    }

    printf("Decoder initialized: %lu Hz, %d channels\n", samplerate, channels);

    NeAACDecClose(hDecoder);
    return 0;
}
```
