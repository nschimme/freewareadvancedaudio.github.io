---
title: FAAC Benchmarks — Speed, Size & Quality
description: "Published AAC encoder benchmarks and quality methodology for FAAC versus FDK-AAC, FFmpeg, and Apple."
---

# FAAC Benchmarks: Speed, Size, and Quality

Compare **measured encoding speed, code footprint, and low-bitrate quality**. The results below are a published encoder benchmark snapshot; the methods explain how these measurements guide FAAC tuning.

## FAAC encoder speed and footprint {data-icon="gauge-high"}

<BenchmarkShowcase view="resources" />

**Benchmark snapshot · October 28, 2026 · MacBook Pro M1, 32 GB.** The leaderboard reports results for 35 scenarios for FAAC, FDK-AAC, and FFmpeg; Apple completed 29 of 35. See [tested versions and measurements](/docs/tested-versions) or the [published leaderboard and per-scenario results](https://gist.github.com/nschimme/003da901f4b681f3ee4f679b07d2e31e).

## AAC quality: low bitrate through archival {data-icon="headphones"}

Compare FAAC HE-AAC v1 against FFmpeg's native LC encoder at low bitrates, or select LC vs LC. Switch the dashboard to high bitrates to compare FAAC LC with FDK-AAC LC or FFmpeg AAC-LC.

<BenchmarkShowcase view="quality" />

**48 kHz stereo, AAC-LC.** In LC-vs-LC comparisons, FAAC leads quality from 24–64 kbps and matches Apple at archival bitrates while beating FDK-AAC and FFmpeg. At 48 kbps it scores 4.18 average MOS versus 3.74 for FFmpeg.

Scores are average objective estimates from the same snapshot, not listening-test results. See the report for [profile breakdowns and bitrate accuracy](https://gist.github.com/nschimme/003da901f4b681f3ee4f679b07d2e31e).

## How audio quality is tuned {data-icon="headphones"}

The [FAAC benchmark suite](https://github.com/nschimme/faac-benchmark) evaluates mono speech, stereo music, and multichannel audio across sample rates and bitrates. Fine-tuning considers difficult passages alongside average quality.

- **Speech and music quality:** ViSQOL and Zimtohrli estimate changes relative to the source.
- **Difficult passages:** lower-tail scores help expose regressions hidden by an average.
- **Sharp attacks:** onset timing measurements track changes around percussion and plucked strings.
- **Stereo image:** coherence measurements track changes between the left and right channels.
- **Frequency balance:** spectral diagnostics locate regions where distortion changes.

These measurements guide investigation; objective scores do not establish audible preference.

## How bitrate efficiency is checked {data-icon="sliders"}

Quality comparisons use the **actual AAC payload bitrate**, excluding M4A headers and metadata. This prevents extra bits or container overhead from disguising a rate-control difference.

Rate–quality curves and BD-rate analysis compare the bits needed to reach the same objective quality. Sample-rate and channel groups stay separate, as do AAC-LC and HE-AAC v1. ABR, VBR, and CBR are evaluated as distinct modes.

## How speed and footprint are checked {data-icon="microchip"}

Benchmarking tracks three resource costs:

- **Throughput:** audio duration encoded per unit of processing time.
- **Code footprint:** executable code, constant tables, and initialized data.
- **Memory:** writable static data and peak process memory.

Baseline and candidate builds record their toolchain and settings. Parameter sweeps, decode validation, and regression reports help weigh a tuning change's quality gain against its processing and storage cost.

For your application, measure the selected build on the target device. Encoding throughput alone does not establish live-audio delay or power consumption.

## Benchmark methodology {data-icon="code"}

The benchmark documentation defines the [quality and efficiency metrics](https://github.com/nschimme/faac-benchmark/blob/master/docs/metrics.md), [test scenarios](https://github.com/nschimme/faac-benchmark/blob/master/docs/benchmarking.md), and [footprint checks](https://github.com/nschimme/faac-benchmark/blob/master/docs/footprint-gate.md).

**Next:** [choose an encoder or decoder](/docs/comparison), or [test audible quality](/docs/listening).
