---
title: FAAC AAC Encoder
description: FAAC is the LGPL-licensed AAC encoder in the Freeware Advanced Audio suite. Find installation, CLI, and C API guides.
---

# FAAC AAC Encoder

**FAAC (Freeware Advanced Audio Coder)** encodes PCM audio as MPEG-2 or MPEG-4 AAC. The library and command-line tool are licensed under **LGPL v2.1 or later**.

FAAC supports AAC-LC and HE-AAC v1. It emits ADTS or raw AAC access units; applications that need MP4/M4A output can use the command-line tool or mux the library output in their own container layer.

## Get started

- [Install FAAC and FAAD](/docs/install)
- [FAAC command-line reference](/docs/faac-cli)
- [libfaac C API reference](/docs/libfaac)
- [Try FAAC in your browser](/playground)

## Quick examples

```sh
# Encode AAC-LC in an M4A container
faac --object-type lc -b 128 -o output.m4a input.wav

# Encode HE-AAC v1 at a lower bitrate
faac --object-type he-aac-v1 -b 64 -o output.m4a input.wav
```

The [command-line reference](/docs/faac-cli) describes output formats and options. For applications embedding the encoder, use the current [`faac.h` API guide](/docs/libfaac).
