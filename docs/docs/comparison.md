---
title: Codec Benchmarks — Why Choose FAAC?
description: Visual audio codec comparison evaluating FAAC 2.2 against Opus, LAME MP3, Apple AAC, FDK-AAC, and FFmpeg AAC.
---

# Codec Benchmarks & Performance

FAAC 2.2 is engineered for maximum throughput, microscopic memory usage, and best-in-class transient audio precision.

<div class="benchmark-hero-grid">
  <div class="stat-card highlight">
    <div class="stat-value">496x</div>
    <div class="stat-label">Encoding Speed</div>
    <div class="stat-sub">7x faster than Opus, 4.5x faster than Apple AAC</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">82 KB</div>
    <div class="stat-label">Compiled ROM Footprint</div>
    <div class="stat-sub">6x smaller than Opus, 11x smaller than FDK-AAC</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">0.9494</div>
    <div class="stat-label">Transient Fidelity Score</div>
    <div class="stat-sub">Highest attack precision across all tested codecs</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">1.8%</div>
    <div class="stat-label">Bitrate Error</div>
    <div class="stat-sub">Flawless ABR rate control & reservoir precision</div>
  </div>
</div>

---

## Speed & Throughput Comparison

<div class="bar-chart-container">
  <div class="bar-group">
    <div class="bar-header"><span>FAAC 2.2</span><strong>496.4x Realtime</strong></div>
    <div class="bar-track"><div class="bar-fill brand" style="width: 100%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>FDK-AAC 1.0.9</span><strong>152.9x Realtime</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 30.8%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>LAME 3.100 (MP3)</span><strong>128.5x Realtime</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 25.9%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>Apple AAC 27.0</span><strong>112.1x Realtime</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 22.6%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>Opus 1.4</span><strong>67.7x Realtime</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 13.6%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>FFmpeg Native AAC</span><strong>40.4x Realtime</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 8.1%;"></div></div>
  </div>
</div>

---

## Memory & Binary Size (ROM Footprint)

<div class="bar-chart-container">
  <div class="bar-group">
    <div class="bar-header"><span>FAAC 2.2</span><strong>82.3 KB</strong></div>
    <div class="bar-track"><div class="bar-fill brand" style="width: 8.7%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>Apple AAC 27.0</span><strong>100.3 KB</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 10.6%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>LAME 3.100 (MP3)</span><strong>185.0 KB</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 19.6%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>FFmpeg Native AAC</span><strong>274.5 KB</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 29.2%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>Opus 1.4</span><strong>480.0 KB</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 51.0%;"></div></div>
  </div>
  <div class="bar-group">
    <div class="bar-header"><span>FDK-AAC 1.0.9</span><strong>940.5 KB</strong></div>
    <div class="bar-track"><div class="bar-fill" style="width: 100%;"></div></div>
  </div>
</div>

---

## Comprehensive Leaderboard

*Tested on Apple M1 processor ([faac-benchmark #90](https://github.com/nschimme/faac-benchmark/discussions/90)).*

| Encoder | Codec / Profile | Speed | Peak RAM | ROM Footprint | Transient Fidelity | Bitrate Error | License |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FAAC 2.2.0** | AAC-LC / HE-AAC v1 | **496.4x** | **2.3 MB** | **82.3 KB** | **0.9494** | **1.8%** | **LGPL v2.1+** |
| **Opus 1.4** | Opus | 67.7x | 3.8 MB | 480.0 KB | 0.9120 | 2.4% | BSD-3-Clause |
| **LAME 3.100** | MP3 | 128.5x | 2.1 MB | 185.0 KB | 0.8842 | 4.1% | LGPL v2.0+ |
| **Apple AAC 27.0** | AAC-LC | 112.1x | 8.9 MB | 100.3 KB | 0.9231 | 6.8% | Proprietary |
| **FDK-AAC 1.0.9** | AAC-LC / HE-AAC | 152.9x | 3.2 MB | 940.5 KB | 0.9310 | 1.7% | Non-Free |
| **FFmpeg AAC** | AAC-LC | 40.4x | 17.4 MB | 274.5 KB | 0.8654 | 13.8% | LGPL v2.1+ |

<style>
.benchmark-hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin: 1.5rem 0 2rem 0;
}
.stat-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.stat-card.highlight {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.8));
  border-color: rgba(16, 185, 129, 0.4);
}
.stat-value {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.1;
  color: #38bdf8;
  letter-spacing: -0.02em;
}
.stat-card.highlight .stat-value {
  color: #34d399;
}
.stat-label {
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-top: 0.5rem;
}
.stat-sub {
  font-size: 0.825rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  line-height: 1.3;
}
.bar-chart-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}
.bar-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.bar-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #cbd5e1;
}
.bar-track {
  height: 22px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 6px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: #64748b;
  border-radius: 6px;
  transition: width 0.6s ease-out;
}
.bar-fill.brand {
  background: linear-gradient(90deg, #10b981, #06b6d4);
}
</style>
