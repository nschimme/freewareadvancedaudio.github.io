---
title: FAAC AAC Encoder Library Overview
description: FAAC is an LGPL v2.1+ C AAC encoder for AAC-LC and HE-AAC v1. Explore its library and CLI, supported output, and benchmark results.
---

# FAAC AAC Encoder and C Library

**FAAC (Freeware Advanced Audio Coder)** encodes PCM audio as MPEG-2 or MPEG-4 AAC. Use the C library to add encoding to an application, or use the `faac` command-line tool for file conversion. Both are licensed under **LGPL v2.1 or later**.

## AAC encoding capabilities

FAAC supports **AAC-LC** and **HE-AAC v1** encoding. The library accepts PCM and returns AAC access units for an application to mux into its chosen container. The command-line tool supports common AAC file-conversion workflows, including M4A output. FAAC does not encode HE-AAC v2 or xHE-AAC.

## Choose how to use FAAC

| If you want to… | Go to… |
| :--- | :--- |
| Convert audio files from a terminal | [FAAC command-line manual](/docs/faac-cli) |
| Embed AAC encoding in a C application | [libfaac C API reference](/docs/libfaac) |
| Build FAAC from source | [Installation guide](/docs/install) |
| Try encoding without installing software | [Browser converter](/playground) |

## Evaluate quality and resource use

Published results compare FAAC with other AAC encoders for quality, throughput, code footprint, and memory use. Results depend on the tested build and hardware; objective quality scores are not listening-test results. See the [benchmark methods, results, and tested builds](/docs/optimization).

For profile support, competing implementations, and licensing context, see the [encoder comparison](/docs/comparison).
