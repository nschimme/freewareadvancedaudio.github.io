---
title: FAAD AAC Decoder
description: FAAD is the LGPL-licensed AAC decoder in the Freeware Advanced Audio suite. Find installation, CLI, and C API guides.
---

# FAAD AAC Decoder

**FAAD (Freeware Advanced Audio Decoder)** is the current AAC decoder in the Freeware Advanced Audio suite. It is a C11 rewrite of the decoder and is licensed under **LGPL v2.1 or later**.

FAAD supports AAC-LC and HE-AAC v1, with HE-AAC v2 Parametric Stereo available when built with SBR and PS support. Its library decodes frames from caller supplied input; container and file handling belongs in the command-line frontend or the host application.

## Get started

- [Install FAAC and FAAD](/docs/install)
- [FAAD command-line reference](/docs/faad-cli)
- [libfaad C API reference](/docs/libfaad)
- [Choose an encoder or decoder](/docs/comparison)

## Quick examples

```sh
# Decode an AAC or M4A input to WAV
faad -o decoded.wav input.m4a

# Print stream information
faad -i input.aac
```

The [command-line reference](/docs/faad-cli) documents the installed frontend. For applications embedding the decoder, use the current [`faad.h` API guide](/docs/libfaad).
