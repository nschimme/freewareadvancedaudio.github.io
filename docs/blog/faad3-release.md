---
title: Introducing the FAAD Decoder Rewrite
description: Why FAAD was rewritten as a modern C11 decoder library, how its new library boundary works, and where to find integration and comparison details.
---

# Introducing the FAAD Decoder Rewrite

*Published: October 2026*

FAAD has been rewritten as a C11 AAC decoder library and command-line tool under **LGPL v2.1 or later**. The project now has a clear boundary between decoding AAC frames and handling media files around them.

## A decoder that fits into an application

An application already has its own ideas about files, containers, buffering, and audio output. The FAAD library now focuses on decoding ADTS frames or raw AAC access units into PCM; the host application owns the surrounding media pipeline. The `faad` command-line tool provides the file-oriented workflow.

That separation gives developers a choice: use the command-line tool for files and scripts, or embed the library inside an existing player or media service. The [FAAD overview](/docs/faad) describes its supported audio and build options; the [CLI manual](/docs/faad-cli) and [C API reference](/docs/libfaad) cover each integration path.

## A deliberate break with FAAD2

The rewrite does not preserve FAAD2's `NeAACDec*` API or ABI. Applications built against FAAD2 need a source port and rebuild. Stream and profile support also differs, so check the [supported streams](/docs/libfaad#supported-streams) before migrating.

## Follow the evidence

The decoder comparison and tested-versions pages are the references for measured quality, speed, footprint, memory use, and the exact builds behind those results. Start with the [FAAD and FAAD2 comparison](/docs/comparison#faad3-and-faad2-benchmark-comparison), then see [tested versions](/docs/tested-versions) for snapshot details.

For license history and patent context, see [software licenses and patent rights](/docs/comparison#software-licenses-and-patent-rights). To install the tools and libraries, visit [installation](/docs/install).
