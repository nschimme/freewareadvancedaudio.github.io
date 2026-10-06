---
title: FAAD AAC Decoder Library Overview
description: FAAD is an LGPL v2.1+ C11 AAC decoder for AAC-LC and HE-AAC. Explore build-dependent HE-AAC v2 support, library and CLI use, and migration from FAAD2.
---

# FAAD AAC Decoder and C Library

**FAAD (Freeware Advanced Audio Decoder)** is a C11 AAC decoder library and command-line tool, licensed under **LGPL v2.1 or later**. Use `faad` to convert supported AAC files to PCM audio, or integrate `libfaad` to decode AAC frames inside an application.

## AAC profiles and build options

FAAD decodes **AAC-LC** and **HE-AAC v1**. **HE-AAC v2 Parametric Stereo** is available when the library is built with SBR and PS support enabled. Check the options used by your build when you depend on a particular profile.

## Library and command-line use

The C library decodes AAC frames supplied by the application and returns PCM. It does not parse MP4/M4A containers; the host application supplies the AAC frames. The `faad` command-line tool handles file conversion, including container input supported by the build.

| If you want to… | Go to… |
| :--- | :--- |
| Decode files from a terminal | [FAAD command-line manual](/docs/faad-cli) |
| Embed AAC decoding in a C application | [libfaad C API reference](/docs/libfaad) |
| Build FAAD from source | [Installation guide](/docs/install) |
| Compare profiles, implementations, and licenses | [Encoder and decoder comparison](/docs/comparison) |

## Migrating from FAAD2

FAAD uses the `<faad.h>` C API, which differs from FAAD2's legacy `NeAACDec*` API. Applications need a source-level port and rebuild. Read the [FAAD2 migration notes](/docs/libfaad#porting-from-the-legacy-neaacdec-api) before changing an existing integration.

## Decoder performance and quality

Published results compare decode quality, speed, memory use, and code footprint across AAC implementations. FAAD's comparison with FAAD2 and notes on the tested builds are in the [decoder comparison](/docs/comparison#faad3-and-faad2-benchmark-comparison) and [tested versions](/docs/tested-versions).
