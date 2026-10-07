---
title: Tested Versions and Benchmark Snapshots
description: Tested AAC encoder and decoder versions, build identifiers, hardware, and measured results used on this site.
---

# Tested Versions and Benchmark Snapshots

Benchmark figures on this site describe specific builds and test runs. Encoder and decoder results below come from separate published snapshots; results across the two tables should not be treated as a single head-to-head run.

## Encoder snapshot

**Run:** September 29, 2026 · MacBook Pro M1 · 32 GB. The leaderboard reports results for 27 of 33 configured scenarios for each listed build. See the [published encoder leaderboard and per-scenario results](https://github.com/nschimme/faac-benchmark/discussions/90).

| Encoder | Tested version or build | Throughput | Peak RAM | ROM image |
| :--- | :--- | ---: | ---: | ---: |
| FAAC | 2.2.0 (`6acbe23a`) | 506.9× realtime | 2.3 MB | 73.4 KB |
| FDK-AAC | 2.0.3 via `fdkaac` 1.0.9 | 152.9× realtime | 3.2 MB | 940.5 KB |
| Apple AAC | 27.0 (`26A428`) | 112.1× realtime | 8.9 MB | 100.3 KB |
| FFmpeg AAC | 9.1 (`g3fc4f99a79`), experimental NMR | 40.4× realtime | 17.4 MB | 274.5 KB |

The report ranks encoder quality by 1st-percentile MOS, with overall MOS as the tiebreaker. Its aggregate FAAC results are 2.953 first-percentile MOS and 4.452 overall MOS. These are objective estimates, not listening-test outcomes. The report includes per-scenario quality, stereo and transient fidelity, and bitrate accuracy.

## Decoder snapshot

The [decoder leaderboard](https://gist.github.com/nschimme/71953ca296cdfa9800e99fc806f191b5) reports aggregate decode quality, speed, memory, and footprint. Version labels below follow that report; it does not identify the FAAD rewrite commit or a full FFmpeg build string. The source does not state its machine or run date, so these decoder results are kept separate from the dated encoder snapshot above.

| Decoder | Tested version | 1st-percentile MOS | Overall MOS | Stereo fidelity | Mean SNR | Timing error | Throughput | Peak RAM | ROM image |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| FAAD3 | Rewrite build; commit not listed | 1.451 | 4.231 | 0.9601 | 23.7 dB | 0.33 ms | 1,011.2× realtime | 2.6 MB | 161.9 KB |
| FDK AAC | 2.0.0 | — | — | — | — | — | 896.2× realtime | 5.4 MB | 940.5 KB |
| Apple AAC | 27.0.1 | — | — | — | — | — | 1,049.7× realtime | 8.3 MB | 100.3 KB |
| FFmpeg AAC | Build not identified | — | — | — | — | — | 597.5× realtime | 17.5 MB | 274.9 KB |
| FAAD2 | 2.11.3 | 1.451 | 4.224 | 0.9600 | 23.7 dB | 0.33 ms | 515.8× realtime | 2.1 MB | 296.3 KB |
| Helix AAC | 1.0 | — | — | — | — | — | 812.4× realtime | 1.9 MB | 121.4 KB |

The quality measures shown for FAAD3 and FAAD2 are close and do not establish an audible preference. In this snapshot FAAD3 delivers about 1.96× FAAD2's throughput and uses 45% less ROM image, with 0.5 MB more peak RAM. The report records one FDK runaway; Helix had 14 crashes and one timeout, and did not support HE-AAC v2 Parametric Stereo in single-channel scenarios. For profile and licensing guidance, see the [implementation comparison](/docs/comparison).

## How to read these figures

- **Throughput** is aggregate audio duration decoded or encoded per unit of processing time on the listed machine. It does not predict performance on another processor.
- **ROM image** is `.text` + `.rodata` + `.data`, the measured static image used by the reports. It is not the installed package size.
- **Peak RAM** is specific to the report's scenarios and measurement method.
- A dash means the linked summary does not publish that measure for the row; it does not mean zero or a failed measurement.

See the [benchmark methodology and quality results](/docs/optimization) for encoder test methods and the [implementation comparison](/docs/comparison) for profile and licensing guidance.
