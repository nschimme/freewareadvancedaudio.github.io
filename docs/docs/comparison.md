# Codec Comparison & Benchmark Evaluation

Objective audio codec benchmarks and high-level feature matrices evaluating **FAAC** and **FAAD** against major open-source and commercial AAC implementations.

---

## High-Level Feature & License Comparison

| Feature | FAAC 2.2+ | FDK-AAC | FFmpeg Native AAC | Apple AAC |
| :--- | :--- | :--- | :--- | :--- |
| **License** | **LGPL v2.1+** | Non-Free / Custom | **LGPL v2.1+** / GPL | Proprietary |
| **Redistributable** | <i class="fa-solid fa-check" style="color: #4ade80;"></i> Yes | <i class="fa-solid fa-xmark" style="color: #f87171;"></i> Patent constraints | <i class="fa-solid fa-check" style="color: #4ade80;"></i> Yes | <i class="fa-solid fa-xmark" style="color: #f87171;"></i> macOS/iTunes DLLs |
| **Encoding Speed** | <i class="fa-solid fa-rocket"></i> 400x–600x RT | ~100x–150x RT | ~25x–40x RT | ~100x–140x RT |
| **Binary Footprint** | ~73 KB | ~940 KB | ~275 KB | ~100 KB |
| **HE-AAC v1 (SBR)** | <i class="fa-solid fa-check" style="color: #4ade80;"></i> Yes | <i class="fa-solid fa-check" style="color: #4ade80;"></i> Yes | <i class="fa-solid fa-xmark" style="color: #f87171;"></i> Experimental | <i class="fa-solid fa-check" style="color: #4ade80;"></i> Yes |
| **ISO Reference Free** | <i class="fa-solid fa-check" style="color: #4ade80;"></i> Yes (LGPL Rewrite) | <i class="fa-solid fa-xmark" style="color: #f87171;"></i> Derivative | <i class="fa-solid fa-check" style="color: #4ade80;"></i> Native | Proprietary |

---

## AAC Encoder Benchmark Results

*Data sourced from high-level objective evaluations ([faac-benchmark #90](https://github.com/nschimme/faac-benchmark/discussions/90)). Tested on Apple M1.*

### Overall Encoder Rankings

| Rank | Encoder | Status | 1st Percentile MOS ($P_1$) | Overall MOS | Speed (xRealtime) | Peak RAM | ROM Flash | Bitrate Error | License |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| <i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> 1 | **FAAC 2.2.0** | OK | **2.953** | **4.452** | **506.9x** | **2.3 MB** | **73.4 KB** | 1.7% | **LGPL v2.1+** |
| <i class="fa-solid fa-medal" style="color: #94a3b8;"></i> 2 | **FDK-AAC 1.0.9** | OK | 2.809 | 4.424 | 152.9x | 3.2 MB | 940.5 KB | 1.7% | Non-Free |
| <i class="fa-solid fa-award" style="color: #d97706;"></i> 3 | **FFmpeg AAC** (NMR Exp.) | OK | 2.121 | 4.192 | 40.4x | 17.4 MB | 274.5 KB | 13.8% | LGPL v2.1+ |
| 4 | **Apple AAC 27.0** | OK | 1.541 | 4.380 | 112.1x | 8.9 MB | 100.3 KB | 6.8% | Proprietary |

*Note: Encoders are ranked primarily by 1st Percentile MOS ($P_1$) to penalize systemic artifacts on difficult audio clips, with Overall MOS as tiebreaker.*

---

## AAC Decoder Benchmark Results

### Overall Decoder Rankings

| Rank | Decoder | 1st Percentile MOS ($P_1$) | Overall MOS | Stereo Fidelity | Mean SNR | Timing Delay | Speed (xRealtime) | ROM Flash | License |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| <i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> 1 | **Helix AAC 1.0** | 1.880 | 4.206 | 0.8936 | 18.1 dB | 78.40 ms | 426.1x | 121.4 KB | RCSL / RPSL |
| <i class="fa-solid fa-medal" style="color: #94a3b8;"></i> 2 | **FDK AAC 2.0.0** | 1.878 | 4.190 | 0.9573 | 18.0 dB | **0.01 ms** | 344.1x | 940.5 KB | Non-Free |
| <i class="fa-solid fa-award" style="color: #d97706;"></i> 3 | **FFmpeg AAC** | 1.877 | 4.195 | 0.9564 | 18.1 dB | 9.14 ms | 135.1x | 274.5 KB | LGPL v2.1+ |
| 4 | **Apple AAC 27.0** | 1.874 | 4.195 | 0.9572 | 18.1 dB | **0.01 ms** | 174.4x | 100.3 KB | Proprietary |
| 5 | **FAAD 3** | 1.874 | 4.195 | 0.9571 | **18.1 dB** | **0.01 ms** | **490.3x** | 136.0 KB | **GPL v2+** |
| 6 | **FAAD 2.11.3** | 1.873 | 4.191 | 0.9581 | **18.1 dB** | **0.01 ms** | 376.8x | 296.3 KB | **GPL v2+** |

---

## Key Takeaways

1. **Ultra-High Speed:** FAAC 2.2.0 achieves **>500x realtime** encoding speed and FAAD3 achieves **>490x realtime** decoding speed.
2. **Minimal Footprint:** FAAC's compiled binary footprint is under **75 KB**, making it exceptionally well-suited for embedded systems (e.g. Thingino IP camera firmware) and WebAssembly browser runtimes.
3. **Clean Licensing:** FAAC's LGPL v2.1+ license allows commercial static linking and distribution without royalty or proprietary constraints.
