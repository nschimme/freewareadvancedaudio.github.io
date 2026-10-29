---
title: FAAC Benchmarks — Speed, Size & Quality
description: "Published AAC encoder and decoder benchmarks, the tested builds behind them, and the methodology used for FAAC versus FDK-AAC, FFmpeg, and Apple."
---

# FAAC Benchmarks: Speed, Size, and Quality

This page reports one benchmark run in three passes: **what it found**, **how each measurement is made**, and **the exact builds and figures** behind the results. Terms such as MOS and BD-rate are defined at the end.

All results come from the **October 28, 2026** run on a **MacBook Pro M1, 32 GB**. Encoder and decoder measurements are separate sections of the same generated leaderboard and should not be treated as a single head-to-head run.

## What the run found {data-icon="chart-line"}

### Encoder quality {data-icon="headphones"}

The chart plots average MOS against bitrate from 16 to 320 kbps on a logarithmic axis, so the full rate–quality curve is visible in one view. Each encoder is shown at its higher-scoring profile for that bitrate. A magnified 128–320 kbps detail separates scores that differ by only a few hundredths of a MOS.

<BenchmarkShowcase view="quality" />

**48 kHz stereo.** FAAC leads at 16–24 and 48–128 kbps, trails Apple and FDK by at most about 0.02 MOS at 32–40 kbps, and trails Apple by at most 0.008 MOS above 160 kbps. At 48 kbps it scores 4.297 average MOS versus 4.267 for FDK-AAC, 4.262 for Apple AAC, and 3.741 for FFmpeg. [MOS](#metric-definitions) here is a 1.0–5.0 objective estimate, not a listening-test score.

FAAC ranks first on both aggregate metrics, with 2.785 first-percentile MOS and 4.541 overall MOS. See the [encoder snapshot](#encoder-snapshot) for first-percentile figures, per-scenario results, and the report's [profile breakdowns and bitrate accuracy](https://gist.github.com/nschimme/003da901f4b681f3ee4f679b07d2e31e).

### Encoder speed and footprint {data-icon="gauge-high"}

<BenchmarkShowcase view="resources" />

FAAC is the fastest encoder in the comparison at 4.3× FDK-AAC throughput, and has the lowest peak RAM (2.6 MB) and smallest ROM image (99.9 KB) of the four encoders.

### Decoder quality and speed {data-icon="headphones"}

<BenchmarkShowcase view="decoder" />

FAAD3 ties the top overall MOS (4.193), leads stereo fidelity and throughput, and keeps peak RAM to 3.0 MB. Apple AAC has the smallest ROM image (100.3 KB). At 48 kHz stereo, FAAD3 matches FFmpeg, Apple, and FDK within about 0.003 MOS (LC and HE-v1) while running 1.85–3.66× faster than Apple and FFmpeg.

## How the measurements are made {data-icon="flask"}

### Audio quality and tuning {data-icon="headphones"}

The [FAAC benchmark suite](https://github.com/nschimme/faac-benchmark) evaluates mono speech, stereo music, and multichannel audio across sample rates and bitrates. Fine-tuning considers difficult passages alongside average quality.

- **Speech and music quality:** ViSQOL and Zimtohrli estimate changes relative to the source.
- **Difficult passages:** lower-tail scores help expose regressions hidden by an average.
- **Sharp attacks:** onset timing measurements track changes around percussion and plucked strings.
- **Stereo image:** coherence measurements track changes between the left and right channels.
- **Frequency balance:** spectral diagnostics locate regions where distortion changes.

These measurements guide investigation; objective scores do not establish audible preference.

### Bitrate efficiency {data-icon="sliders"}

Quality comparisons use the **actual AAC payload bitrate**, excluding M4A headers and metadata. This prevents extra bits or container overhead from disguising a rate-control difference.

Rate–quality curves and [BD-rate](#metric-definitions) compare the bits needed to reach the same objective quality. BD-rate is the percentage bitrate change required for equal MOS; a negative value means the candidate needs fewer bits for the same quality. Sample-rate and channel groups stay separate, as do AAC-LC and HE-AAC v1. ABR, VBR, and CBR are evaluated as distinct modes.

### Speed and footprint {data-icon="microchip"}

Benchmarking tracks three resource costs:

- **Throughput:** audio duration encoded per unit of processing time.
- **Code footprint:** executable code, constant tables, and initialized data.
- **Memory:** writable static data and peak process memory.

Baseline and candidate builds record their toolchain and settings. Parameter sweeps, decode validation, and regression reports help weigh a tuning change's quality gain against its processing and storage cost.

For your application, measure the selected build on the target device. Encoding throughput alone does not establish live-audio delay or power consumption.

### Methodology references {data-icon="code"}

The benchmark documentation defines the [quality and efficiency metrics](https://github.com/nschimme/faac-benchmark/blob/master/docs/metrics.md), [test scenarios](https://github.com/nschimme/faac-benchmark/blob/master/docs/benchmarking.md), and [footprint checks](https://github.com/nschimme/faac-benchmark/blob/master/docs/footprint-gate.md).

## Tested versions and benchmark snapshots {data-icon="flask"}

### Encoder snapshot

**Run:** October 28, 2026 · MacBook Pro M1 · 32 GB. The leaderboard reports results for 35 scenarios for FAAC, FDK-AAC, and FFmpeg; Apple completed 29 of 35 after 6 encoding failures.

| Encoder | Tested version or build | Throughput | Peak RAM | ROM image |
| :--- | :--- | ---: | ---: | ---: |
| FAAC | 3.0.0 (`ecc245c0`) | 721.6× realtime | 2.6 MB | 99.9 KB |
| FDK-AAC | 1.0.9 | 169.2× realtime | 3.3 MB | 940.5 KB |
| Apple AAC | 27.2 | 181.8× realtime | 8.3 MB | 100.3 KB |
| FFmpeg AAC | N-127192-gef52e1cc38, experimental NMR | 51.6× realtime | 18.0 MB | 274.9 KB |

The report ranks encoder quality by 1st-percentile MOS, with overall MOS as the tiebreaker. In the AAC-LC comparison at 48 kbps, FAAC's first-percentile MOS is 3.446 versus 2.933 for FFmpeg, 2.240 for FDK-AAC, and 2.314 for Apple AAC; it also leads all four encoders at 128 kbps (4.867 average / 4.707 first-percentile). From 160–320 kbps it stays within 0.008 average MOS and 0.022 first-percentile MOS of Apple while ahead of FDK-AAC and FFmpeg, and has the leading stereo fidelity at 160–192 kbps. The report also includes per-scenario quality, transient fidelity, and bitrate accuracy. These are objective estimates, not listening-test outcomes.

### Decoder snapshot

The [decoder leaderboard](https://gist.github.com/nschimme/003da901f4b681f3ee4f679b07d2e31e) reports aggregate decode quality, speed, memory, and footprint from the same run. Decoder timings are concurrent and include contention.

| Decoder | Tested version | 1st-percentile MOS | Overall MOS | Stereo fidelity | Mean SNR | Timing error | Throughput | Peak RAM | ROM image |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| FAAD3 | 3.0.0 (`ecc245c0`) | 1.641 | 4.193 | 0.9557 | 20.9 dB | 0.32 ms | 2,120.0× realtime | 3.0 MB | 168.1 KB |
| FFmpeg AAC | N-127192-gef52e1cc38 | 1.644 | 4.193 | 0.9523 | 20.8 dB | 9.54 ms | 579.7× realtime | 17.0 MB | 274.9 KB |
| Apple AAC | 27.2 | 1.641 | 3.944 | 0.9500 | 12.5 dB | 0.33 ms | 1,145.7× realtime | 7.8 MB | 100.3 KB |
| FDK AAC | 2.0.0 | 1.641 | 4.188 | 0.9499 | 20.8 dB | 0.33 ms | 875.9× realtime | 7.4 MB | 940.5 KB |
| Helix AAC | 1.0 | 1.409 | 3.575 | 0.8809 | 12.7 dB | 78.01 ms | 943.0× realtime | 1.9 MB | 121.4 KB |

Helix recorded 421 crashes and 169 timeouts and did not support HE-AAC v2 Parametric Stereo in single-channel scenarios; FDK recorded 10 runaways. For profile and licensing guidance, see the [implementation comparison](/docs/comparison).

## Metric definitions {data-icon="circle-info"}

- **MOS (mean opinion score)** is a 1.0–5.0 objective estimate: ViSQOL scores speech, while Zimtohrli scores music and full-band audio. The models compare the encoded result with the source. This is not a listening test; 1.0 is poor and 5.0 is transparent.
- **First-percentile MOS** (`P1`) is the score that 99% of tested clips equal or exceed. It measures the quality floor on difficult passages and is more stable than worst-case MOS, which can be distorted by one anomalous clip.
- **BD-rate (Bjøntegaard delta rate)** is the percentage bitrate difference needed to reach the same MOS. A **negative** value means the candidate uses fewer bits for equal quality; a **positive** value means it needs more. Rate–quality curves are fitted per coding profile, so AAC-LC and HE-AAC v1 are never compared on one curve.
- **Throughput** is aggregate audio duration decoded or encoded per unit of processing time on the listed machine. It does not predict performance on another processor.
- **ROM image** is `.text` + `.rodata` + `.data`, the measured static image used by the reports. It is not the installed package size.
- **Peak RAM** is specific to the report's scenarios and measurement method.
- A dash means the linked summary does not publish that measure for the row; it does not mean zero or a failed measurement.

**Next:** [choose an encoder or decoder](/docs/comparison), or [test audible quality](/docs/listening).
