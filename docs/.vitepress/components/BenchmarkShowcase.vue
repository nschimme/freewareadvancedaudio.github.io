<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ view: 'resources' | 'decoder' | 'quality' }>()

// Published snapshot: Discussion #90, 2026-09-29. Do not mix with local runs.
const encoders = [
  { name: 'FAAC', speed: 506.9, footprint: 73.4 },
  { name: 'FDK-AAC', speed: 152.9, footprint: 940.5 },
  { name: 'Apple AAC', speed: 112.1, footprint: 100.3 },
  { name: 'FFmpeg AAC', speed: 40.4, footprint: 274.5 }
]
const encoderMetrics = [
  { key: 'speed' as const, title: 'Encoding throughput', icon: 'gauge-high', value: '507×', unit: 'realtime', summary: '3.3× the measured FDK-AAC throughput', max: 506.9, format: (n: number) => `${n.toFixed(1)}×`, note: 'Aggregate throughput · higher is better' },
  { key: 'footprint' as const, title: 'Encoder code footprint', icon: 'microchip', value: '92%', unit: 'less code', summary: 'FAAC 73.4 KB vs FDK-AAC 940.5 KB', max: 940.5, format: (n: number) => `${n.toFixed(1)} KB`, note: 'Code + constants + initialized data · lower is better' }
]
const decoders = [
  // Match the encoder card order, then append decoder-only implementations.
  { name: 'FAAD3', speed: 1011.2, footprint: 161.9 },
  { name: 'FDK AAC', speed: 896.2, footprint: 940.5 },
  { name: 'Apple AAC', speed: 1049.7, footprint: 100.3 },
  { name: 'FFmpeg AAC', speed: 597.5, footprint: 274.9 },
  { name: 'FAAD2', speed: 515.8, footprint: 296.3 },
  { name: 'Helix AAC', speed: 812.4, footprint: 121.4 }
]
const decoderMetrics = [
  { key: 'speed' as const, title: 'Decoding throughput', icon: 'gauge-high', value: '1,011×', unit: 'realtime', summary: '1.96× the throughput of FAAD2', max: 1049.7, format: (n: number) => `${n.toFixed(1)}×`, note: 'Aggregate throughput · higher is better' },
  { key: 'footprint' as const, title: 'Decoder code footprint', icon: 'microchip', value: '45%', unit: 'less code', summary: 'FAAD3 161.9 KB vs FAAD2 296.3 KB', max: 940.5, format: (n: number) => `${n.toFixed(1)} KB`, note: 'Code + read-only + initialized data · lower is better' }
]
const metrics = computed(() => props.view === 'decoder' ? decoderMetrics : encoderMetrics)
const implementations = computed(() => props.view === 'decoder' ? decoders : encoders)
const profile = ref<'lc' | 'he'>('he')
const bitrateRange = ref<'low' | 'high'>('low')
const highComparator = ref<'fdk' | 'ffmpeg'>('fdk')
const faacLabel = computed(() => profile.value === 'lc' ? 'FAAC · LC' : 'FAAC · HE v1')
const quality = [
  { rate: 24, lc: 2.715, he: 3.427, ffmpeg: 2.515 },
  { rate: 32, lc: 3.454, he: 3.812, ffmpeg: 2.508 },
  { rate: 40, lc: 3.868, he: 4.020, ffmpeg: 2.667 },
  { rate: 48, lc: 4.110, he: 4.172, ffmpeg: 3.833 },
  { rate: 56, lc: 4.258, he: 4.309, ffmpeg: 4.129 },
  { rate: 64, lc: 4.379, he: 4.414, ffmpeg: 4.279 }
]
// Published AAC-LC averages for transparency and archival bitrates.
const highQuality = [
  { rate: 128, faac: 4.8336, fdk: 4.8331, ffmpeg: 4.7918 },
  { rate: 160, faac: 4.9053, fdk: 4.8856, ffmpeg: 4.8745 },
  { rate: 192, faac: 4.9427, fdk: 4.9300, ffmpeg: 4.9241 },
  { rate: 256, faac: 4.9761, fdk: 4.9553, ffmpeg: 4.9626 },
  { rate: 320, faac: 4.9889, fdk: 4.9624, ffmpeg: 4.9749 }
]
const qualityWidth = (score: number, high = false) => `${(score - (high ? 4 : 1)) / (high ? 1 : 4) * 100}%`
const displayScore = (score: number) => (Math.round(score * 100) / 100).toFixed(2)
</script>

<template>
  <div v-if="view !== 'quality'" class="resource-cards" :aria-label="view === 'decoder' ? 'Measured AAC decoder throughput and footprint' : 'Measured encoder throughput and footprint'">
    <article v-for="metric in metrics" :key="metric.key" class="metric-card">
      <div class="metric-heading"><i :class="`fa-solid fa-${metric.icon}`" aria-hidden="true"></i><h3>{{ metric.title }}</h3></div>
      <div class="metric-value">{{ metric.value }} <span>{{ metric.unit }}</span></div>
      <p class="metric-summary">{{ metric.summary }}</p>
      <div class="resource-rows">
        <div v-for="encoder in implementations" :key="encoder.name" class="resource-row" :class="{ 'is-faac': encoder.name === 'FAAC' || encoder.name === 'FAAD3' }">
          <div class="resource-label"><span>{{ encoder.name }}</span><strong>{{ metric.format(encoder[metric.key]) }}</strong></div>
          <div class="resource-track" aria-hidden="true"><div :style="{ width: `${encoder[metric.key] / metric.max * 100}%` }"></div></div>
        </div>
      </div>
      <p class="metric-note">{{ metric.note }}</p>
    </article>
  </div>

  <figure v-else class="quality-chart" aria-labelledby="quality-chart-caption">
    <figcaption id="quality-chart-caption">48 kHz stereo · {{ bitrateRange === 'low' ? '24–64 kbps' : 'High bitrate · 128–320 kbps' }}</figcaption>
    <div class="profile-controls range-controls" role="group" aria-label="Quality benchmark bitrate range">
      <button type="button" :aria-pressed="bitrateRange === 'low'" @click="bitrateRange = 'low'">Low bitrate · 24–64 kbps</button>
      <button type="button" :aria-pressed="bitrateRange === 'high'" @click="bitrateRange = 'high'; profile = 'lc'">High bitrate · 128–320 kbps</button>
    </div>
    <div v-if="bitrateRange === 'low'" class="profile-controls" role="group" aria-label="FAAC profile to compare with FFmpeg LC">
      <button type="button" :aria-pressed="profile === 'he'" @click="profile = 'he'">FAAC HE v1 vs FFmpeg LC</button>
      <button type="button" :aria-pressed="profile === 'lc'" @click="profile = 'lc'">LC vs LC</button>
    </div>
    <div v-else class="profile-controls" role="group" aria-label="AAC-LC encoder comparison">
      <button type="button" :aria-pressed="highComparator === 'fdk'" @click="highComparator = 'fdk'">FAAC vs FDK-AAC</button>
      <button type="button" :aria-pressed="highComparator === 'ffmpeg'" @click="highComparator = 'ffmpeg'">FAAC vs FFmpeg</button>
    </div>
    <p class="chart-note">Average objective MOS</p>
    <div class="quality-axis" :class="{ 'high-quality-axis': bitrateRange === 'high' }" aria-hidden="true"><span>{{ bitrateRange === 'high' ? '4.0' : '1' }}</span><span>{{ bitrateRange === 'high' ? '4.25' : '2' }}</span><span>{{ bitrateRange === 'high' ? '4.5' : '3' }}</span><span>{{ bitrateRange === 'high' ? '4.75' : '4' }}</span><span>5</span></div>
    <div class="quality-axis-hints" :class="{ 'high-quality-axis': bitrateRange === 'high' }" role="img" aria-label="Lower scores are worse; higher scores are better"><span>Worse</span><span>Better</span></div>
    <div v-for="point in (bitrateRange === 'low' ? quality : highQuality)" :key="point.rate" class="quality-group">
      <div class="rate-label">{{ point.rate }} <span>kbps</span></div>
      <div class="quality-pair">
        <div class="quality-row faac-row" :class="{ 'high-quality-row': bitrateRange === 'high' }">
          <span class="encoder-label">{{ bitrateRange === 'high' ? 'FAAC · LC' : faacLabel }}</span>
          <div class="quality-track" aria-hidden="true"><div :style="{width: qualityWidth(bitrateRange === 'high' ? point.faac : point[profile], bitrateRange === 'high')}"></div></div>
          <strong>{{ displayScore(bitrateRange === 'high' ? point.faac : point[profile]) }}</strong>
        </div>
        <div class="quality-row" :class="[bitrateRange === 'high' ? 'fdk-row high-quality-row' : 'ffmpeg-row']">
          <span class="encoder-label">{{ bitrateRange === 'high' ? (highComparator === 'fdk' ? 'FDK-AAC · LC' : 'FFmpeg · LC') : 'FFmpeg · LC' }}</span>
          <div class="quality-track" aria-hidden="true"><div :style="{width: qualityWidth(bitrateRange === 'high' ? point[highComparator] : point.ffmpeg, bitrateRange === 'high')}"></div></div>
          <strong>{{ displayScore(bitrateRange === 'high' ? point[highComparator] : point.ffmpeg) }}</strong>
        </div>
      </div>
    </div>
    <p class="chart-note profile-note" aria-live="polite">{{ bitrateRange === 'high' ? 'Both encoders use AAC-LC.' : profile === 'lc' ? 'Both encoders use AAC-LC.' : 'Different profiles: FAAC uses HE-AAC v1; the tested FFmpeg native encoder uses AAC-LC.' }} Bitrates are requested targets, not matched actual payload rates. Scores are model estimates, not listening-test results.</p>
  </figure>
</template>

<style scoped>
.resource-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 24px 0; }
.metric-card, .quality-chart { border: 1px solid var(--vp-c-divider); border-radius: 24px; background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg)); padding: 32px; }
.metric-heading { display: flex; gap: 10px; align-items: center; color: var(--audio-icon-cyan); }
.metric-heading h3 { margin: 0; font-size: 15px; color: var(--vp-c-text-1); }
.metric-value { margin-top: 22px; font-size: clamp(48px, 5vw, 68px); line-height: 1.15; letter-spacing: -2px; font-weight: 700; color: var(--audio-icon-cyan); }
.metric-value span { font-size: 15px; font-weight: 500; letter-spacing: 0; color: var(--vp-c-text-2); }
.metric-card .metric-summary { margin: 8px 0 24px; min-height: 48px; font-size: 14px; line-height: 24px; }
.resource-rows { display: grid; gap: 14px; }
.resource-label { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; line-height: 20px; }
.resource-label strong { font-variant-numeric: tabular-nums; white-space: nowrap; }
.resource-track { margin-top: 5px; height: 8px; border-radius: 3px; background: rgba(148, 163, 184, 0.12); }
.resource-track > div { height: 100%; border-radius: inherit; background: #64748b; }
.is-faac .resource-label { color: var(--audio-icon-cyan); }
.is-faac .resource-track > div { background: var(--audio-icon-cyan); }
.metric-card .metric-note { margin: 22px 0 0; color: var(--vp-c-text-3); font-size: 12px; line-height: 18px; }
.quality-chart { margin: 24px 0; }
.quality-chart figcaption { font-weight: 600; font-size: 17px; }
.profile-controls { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
.profile-controls button { padding: 7px 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; color: var(--vp-c-text-2); font-size: 12px; line-height: 18px; }
.profile-controls button[aria-pressed="true"] { color: var(--audio-icon-cyan); background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); }
.profile-controls button:focus-visible { outline: 2px solid var(--audio-icon-cyan); outline-offset: 3px; }
.quality-chart .chart-note { font-size: 12px; line-height: 20px; color: var(--vp-c-text-2); margin: 12px 0; }
.quality-axis { display: flex; justify-content: space-between; margin: 18px 42px 0 164px; color: var(--vp-c-text-3); font-size: 11px; }
.quality-axis-hints { display: flex; justify-content: space-between; margin: 8px 42px 8px 164px; color: var(--vp-c-text-2); font-size: 10px; line-height: 14px; }
.quality-group { display: grid; grid-template-columns: 48px minmax(0, 1fr); gap: 12px; padding: 12px 0; border-top: 1px solid var(--vp-c-divider); }
.rate-label { align-self: center; font-size: 16px; font-weight: 600; line-height: 20px; }
.rate-label span { display: block; font-size: 11px; font-weight: 400; color: var(--vp-c-text-3); }
.quality-pair { display: grid; gap: 7px; }
.quality-row { display: grid; grid-template-columns: 96px minmax(0, 1fr) 34px; gap: 8px; align-items: center; font-size: 11px; line-height: 18px; }
.quality-row strong { text-align: right; font-variant-numeric: tabular-nums; font-size: 12px; }
.faac-row { color: var(--audio-icon-cyan); }
.ffmpeg-row { color: var(--audio-icon-violet); }
.high-quality-axis { margin-left: 164px; }
.high-quality-row { grid-template-columns: 96px minmax(0, 1fr) 34px; }
.fdk-row { color: var(--audio-icon-violet); }
.quality-track { height: 10px; background: rgba(148, 163, 184, 0.1); border-radius: 3px; }
.quality-track > div { height: 100%; border-radius: inherit; background: currentColor; }
.quality-chart .profile-note { margin-top: 20px; }
@media (max-width: 640px) {
  .resource-cards { grid-template-columns: 1fr; }
  .metric-card, .quality-chart { padding: 18px; }
  .metric-card .metric-summary { min-height: 0; }
  .quality-group { grid-template-columns: 36px minmax(0, 1fr); gap: 8px; }
  .quality-row { grid-template-columns: minmax(0, 1fr) 34px; gap: 4px 8px; }
  .encoder-label { grid-column: 1 / -1; }
  .quality-axis { margin-left: 44px; }
  .quality-axis-hints { margin-left: 44px; }
  .high-quality-axis { margin-left: 44px; }
}
</style>
