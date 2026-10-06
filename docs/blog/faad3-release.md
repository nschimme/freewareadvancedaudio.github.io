---
title: Introducing the FAAD3 Decoder Rewrite
description: FAAD's C11 rewrite brings an LGPL-licensed decoder library, a modern frame API, and current AAC profile support.
---

# Introducing the FAAD3 Decoder Rewrite

*Published: October 2026*

FAAD has been rewritten as **FAAD3**, replacing the earlier FAAD2 decoder implementation with a modern C11 library and command-line tool. The current FAAD library is licensed under **LGPL v2.1 or later**, providing an LGPL option for applications that previously evaluated the GPL-licensed FAAD2 release.

The rewrite also brings a new C API. Applications use `<faad.h>` and the `faad_decode_frame()` interface; FAAD2's `NeAACDec*` API is not source or ABI compatible. The API guide documents caller-owned decoder state, frame input, output formats, and migration points.

## FAAD3 and FAAD2 benchmark results

The supplied [decoder leaderboard](https://gist.github.com/nschimme/71953ca296cdfa9800e99fc806f191b5) reports an overall objective MOS of 4.231 for FAAD3 and 4.224 for FAAD2 2.11.3. Their 1st-percentile MOS is tied at 1.451, and their stereo fidelity, mean SNR, and timing error are also close. These scores do not establish a perceptible difference.

In the same report, FAAD3 measures 1,011.2× realtime throughput against 515.8× for FAAD2, with a 161.9 KB ROM image against 296.3 KB. Peak RAM is higher: 2.6 MB against 2.1 MB. These are aggregate results for the builds and scenarios in the linked report, not guarantees for other hardware or configurations.

FAAD supports AAC-LC and HE-AAC v1. HE-AAC v2 Parametric Stereo is available when SBR and PS support are enabled in the build. The library focuses on frame decoding; container and file handling live in the `faad` command-line frontend or in the host application.

## Get started

- [Install FAAC and FAAD](/docs/install)
- [FAAD command-line reference](/docs/faad-cli)
- [libfaad C API reference](/docs/libfaad)
- [Choose an encoder or decoder](/docs/comparison)

The [FAAD2 comparison and migration notes](/docs/libfaad#porting-from-the-legacy-neaacdec-api) cover the version boundary and API changes. This announcement focuses on the implementation and integration changes; performance figures should be taken from current, reproducible measurements for the target platform.
