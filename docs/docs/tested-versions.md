---
title: Tested Versions and Benchmark Snapshots
description: Tested AAC encoder and decoder versions, build identifiers, hardware, and measured results used on this site.
---

# Tested Versions and Benchmark Snapshots

Benchmark figures on this site describe specific builds and test runs. Encoder and decoder results below come from separate measurement sections of the same generated leaderboard; they still should not be treated as a single head-to-head run.

## Encoder snapshot

**Run:** October 28, 2026 · MacBook Pro M1 · 32 GB. The leaderboard reports results for 35 scenarios for FAAC, FDK-AAC, and FFmpeg; Apple completed 29 of 35 after 6 encoding failures. See the [published leaderboard and per-scenario results](https://gist.github.com/nschimme/003da901f4b681f3ee4f679b07d2e31e).

| Encoder | Tested version or build | Throughput | Peak RAM | ROM image |
| :--- | :--- | ---: | ---: | ---: |
| FAAC | 3.0.0 (`ecc245c0`) | 721.6× realtime | 2.6 MB | 99.9 KB |
| FDK-AAC | 1.0.9 | 169.2× realtime | 3.3 MB | 940.5 KB |
| Apple AAC | 27.2 | 181.8× realtime | 8.3 MB | 100.3 KB |
| FFmpeg AAC | N-127192-gef52e1cc38, experimental NMR | 51.6× realtime | 18.0 MB | 274.9 KB |

The report ranks encoder quality by 1st-percentile MOS, with overall MOS as the tiebreaker. FAAC ranks first on both aggregate metrics with 2.785 first-percentile MOS and 4.541 overall MOS, is the fastest encoder at 4.3× FDK-AAC throughput, and has the lowest peak RAM and smallest ROM image of the four encoders. These are objective estimates, not listening-test outcomes.

At 48 kHz stereo AAC-LC, FAAC leads average and first-percentile MOS from 24–64 kbps. At 48 kbps it scores 4.177 average / 3.446 first-percentile MOS, versus FFmpeg 3.741 / 2.933, FDK-AAC 2.951 / 2.240, and Apple AAC 2.875 / 2.314. FAAC also leads all four encoders at 128 kbps (4.867 / 4.707). From 160–320 kbps it stays within 0.008 average MOS and 0.022 first-percentile MOS of Apple while ahead of FDK-AAC and FFmpeg, and has the leading stereo fidelity at 160–192 kbps. The report also includes per-scenario quality, transient fidelity, and bitrate accuracy.

## Decoder snapshot

The [decoder leaderboard](https://gist.github.com/nschimme/003da901f4b681f3ee4f679b07d2e31e) reports aggregate decode quality, speed, memory, and footprint from the same October 28, 2026 leaderboard. Encoder and decoder measurements are separate and should not be treated as a single head-to-head run. Decoder timings are concurrent and include contention.

| Decoder | Tested version | 1st-percentile MOS | Overall MOS | Stereo fidelity | Mean SNR | Timing error | Throughput | Peak RAM | ROM image |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| FAAD3 | 3.0.0 (`ecc245c0`) | 1.641 | 4.193 | 0.9557 | 20.9 dB | 0.32 ms | 2,120.0× realtime | 3.0 MB | 168.1 KB |
| FFmpeg AAC | N-127192-gef52e1cc38 | 1.644 | 4.193 | 0.9523 | 20.8 dB | 9.54 ms | 579.7× realtime | 17.0 MB | 274.9 KB |
| Apple AAC | 27.2 | 1.641 | 3.944 | 0.9500 | 12.5 dB | 0.33 ms | 1,145.7× realtime | 7.8 MB | 100.3 KB |
| FDK AAC | 2.0.0 | 1.641 | 4.188 | 0.9499 | 20.8 dB | 0.33 ms | 875.9× realtime | 7.4 MB | 940.5 KB |
| Helix AAC | 1.0 | 1.409 | 3.575 | 0.8809 | 12.7 dB | 78.01 ms | 943.0× realtime | 1.9 MB | 121.4 KB |

FAAD3 ties the top overall MOS (4.193), leads stereo fidelity and throughput, and keeps peak RAM to 3.0 MB. Apple AAC has the smallest ROM image (100.3 KB), followed by Helix (121.4 KB) and FAAD3 (168.1 KB). Helix recorded 421 crashes and 169 timeouts and did not support HE-AAC v2 Parametric Stereo in single-channel scenarios; FDK recorded 10 runaways. At 48 kHz stereo, FAAD3 matches FFmpeg, Apple, and FDK within about 0.003 MOS (LC and HE-v1) while running 1.85–3.66× faster than Apple and FFmpeg. For profile and licensing guidance, see the [implementation comparison](/docs/comparison).

## How to read these figures

- **Throughput** is aggregate audio duration decoded or encoded per unit of processing time on the listed machine. It does not predict performance on another processor.
- **ROM image** is `.text` + `.rodata` + `.data`, the measured static image used by the reports. It is not the installed package size.
- **Peak RAM** is specific to the report's scenarios and measurement method.
- A dash means the linked summary does not publish that measure for the row; it does not mean zero or a failed measurement.

See the [benchmark methodology and quality results](/docs/optimization) for encoder test methods and the [implementation comparison](/docs/comparison) for profile and licensing guidance.
