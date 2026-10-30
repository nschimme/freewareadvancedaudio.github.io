<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ view: 'resources' | 'decoder' | 'quality' }>()

// Published snapshot: leaderboard gist, generated 2026-10-28. Do not mix with local runs.
const encoders = [
  { name: 'FAAC', speed: 721.6, footprint: 99.9 },
  { name: 'FDK-AAC', speed: 169.2, footprint: 940.5 },
  { name: 'Apple AAC', speed: 181.8, footprint: 100.3 },
  { name: 'FFmpeg AAC', speed: 51.6, footprint: 274.9 }
]
const encoderMetrics = [
  { key: 'speed' as const, title: 'Encoding throughput', icon: 'gauge-high', value: '721.6×', unit: 'realtime', summary: '4.3× the measured FDK-AAC throughput', max: 721.6, format: (n: number) => `${n.toFixed(1)}×`, note: 'Aggregate throughput · higher is better' },
  { key: 'footprint' as const, title: 'Encoder code footprint', icon: 'microchip', value: '89%', unit: 'less code', summary: 'FAAC 99.9 KB vs FDK-AAC 940.5 KB', max: 940.5, format: (n: number) => `${n.toFixed(1)} KB`, note: 'Code + constants + initialized data · lower is better' }
]
const decoders = [
  // Lead with FAAD3; then follow the encoder card order and append decoder-only implementations.
  { name: 'FAAD3', speed: 2120.0, footprint: 168.1 },
  { name: 'FDK AAC', speed: 875.9, footprint: 940.5 },
  { name: 'Apple AAC', speed: 1145.7, footprint: 100.3 },
  { name: 'FFmpeg AAC', speed: 579.7, footprint: 274.9 },
  { name: 'Helix AAC', speed: 943.0, footprint: 121.4 }
]
const decoderMetrics = [
  { key: 'speed' as const, title: 'Decoding throughput', icon: 'gauge-high', value: '2,120×', unit: 'realtime', summary: '2.4× the measured FDK AAC throughput', max: 2120.0, format: (n: number) => `${n.toFixed(1)}×`, note: 'Aggregate throughput · higher is better' },
  { key: 'footprint' as const, title: 'Decoder code footprint', icon: 'microchip', value: '82%', unit: 'less code', summary: 'FAAD3 168.1 KB vs FDK AAC 940.5 KB', max: 940.5, format: (n: number) => `${n.toFixed(1)} KB`, note: 'Code + read-only + initialized data · lower is better' }
]
const metrics = computed(() => props.view === 'decoder' ? decoderMetrics : encoderMetrics)
const implementations = computed(() => props.view === 'decoder' ? decoders : encoders)

// 48 kHz stereo average MOS, 16–320 kbps. Published snapshot; null means not published.
const rates = [16, 24, 32, 40, 48, 56, 64, 80, 96, 128, 160, 192, 256, 320]
const rawQualitySeries = [
  {
    name: 'FAAC',
    label: { lc: 'FAAC · LC', he: 'FAAC · HE v1' },
    color: '#67e8f9',
    dash: '',
    values: {
      lc: [2.083, 2.741, 3.578, 3.972, 4.177, 4.328, 4.469, 4.613, 4.739, 4.867, 4.926, 4.955, 4.981, 4.991],
      he: [2.978, 3.484, 3.822, 4.128, 4.297, 4.451, 4.549, 4.678, 4.746, 4.807, 4.827, 4.832, 4.833, 4.833]
    }
  },
  {
    name: 'FDK-AAC',
    label: { lc: 'FDK-AAC · LC', he: 'FDK-AAC · HE v1' },
    color: '#c4b5fd',
    dash: '',
    values: {
      lc: [1.710, 2.164, 2.567, 2.760, 2.951, 4.063, 4.221, 4.606, 4.718, 4.826, 4.880, 4.927, 4.953, 4.960],
      he: [2.157, 3.321, 3.836, 4.134, 4.267, 4.440, 4.526, 4.666, 4.742, 4.815, 4.844, 4.854, 4.857, 4.860]
    }
  },
  {
    name: 'Apple AAC',
    label: { lc: 'Apple AAC · LC', he: 'Apple AAC · HE v1' },
    color: '#fbbf24',
    dash: '6 3',
    values: {
      lc: [1.487, 1.548, 2.531, 2.881, 2.875, 3.385, 3.976, 4.613, 4.710, 4.859, 4.927, 4.963, 4.983, 4.993],
      he: [null, 2.617, 3.843, 4.109, 4.262, 4.408, 4.543, null, null, null, null, null, null, null]
    }
  },
  {
    name: 'FFmpeg AAC',
    label: { lc: 'FFmpeg AAC · LC', he: 'FFmpeg AAC · HE v1' },
    color: '#94a3b8',
    dash: '2 4',
    values: {
      lc: [2.329, 2.335, 2.373, 2.609, 3.741, 4.070, 4.306, 4.535, 4.680, 4.799, 4.883, 4.928, 4.935, 4.943],
      he: [null, null, null, null, null, null, null, null, null, null, null, null, null, null]
    }
  }
]

// Each encoder is plotted at its higher-scoring profile for each bitrate.
const bestOf = (lc: (number | null)[], he: (number | null)[]) => lc.map((lcValue, index) => {
  const heValue = he[index]
  if (lcValue === null) return heValue
  if (heValue === null) return lcValue
  return Math.max(lcValue, heValue)
})
const qualitySeries = rawQualitySeries.map(series => ({
  name: series.name,
  color: series.color,
  dash: series.dash,
  values: bestOf(series.values.lc, series.values.he)
}))
const plottedSeries = computed(() => qualitySeries.filter(series => series.values.some(value => value !== null)))

const chart = { width: 760, height: 320, top: 18, right: 18, bottom: 38, left: 46 }
const plotWidth = chart.width - chart.left - chart.right
const plotHeight = chart.height - chart.top - chart.bottom
const minRate = rates[0]
const maxRate = rates[rates.length - 1]
const xFor = (rate: number) => chart.left + (Math.log2(rate) - Math.log2(minRate)) / (Math.log2(maxRate) - Math.log2(minRate)) * plotWidth
const yFor = (score: number) => chart.top + (5 - score) / 4 * plotHeight
const xTicks = [16, 32, 64, 128, 320]
const yTicks = [1, 2, 3, 4, 5]
const linePoints = (values: (number | null)[]) => values
  .map((value, index) => value === null ? null : `${xFor(rates[index]).toFixed(1)},${yFor(value).toFixed(1)}`)
  .filter(Boolean)
  .join(' ')

// High-bitrate magnification: same 128–320 kbps segment, y-axis 4.75–5.00.
const zoomStart = rates.indexOf(128)
const zoomRates = rates.slice(zoomStart)
const zoomChart = { width: 760, height: 210, top: 18, right: 18, bottom: 30, left: 46 }
const zoomPlotWidth = zoomChart.width - zoomChart.left - zoomChart.right
const zoomPlotHeight = zoomChart.height - zoomChart.top - zoomChart.bottom
const zoomMinRate = zoomRates[0]
const zoomMaxRate = zoomRates[zoomRates.length - 1]
const zoomXFor = (rate: number) => zoomChart.left + (Math.log2(rate) - Math.log2(zoomMinRate)) / (Math.log2(zoomMaxRate) - Math.log2(zoomMinRate)) * zoomPlotWidth
const zoomYFor = (score: number) => zoomChart.top + (5 - score) / 0.25 * zoomPlotHeight
const zoomXTicks = [128, 160, 192, 256, 320]
const zoomYTicks = [4.75, 4.8, 4.85, 4.9, 4.95, 5]
const zoomPoints = (values: (number | null)[]) => values
  .slice(zoomStart)
  .map((value, index) => value === null ? null : `${zoomXFor(zoomRates[index]).toFixed(1)},${zoomYFor(value).toFixed(1)}`)
  .filter(Boolean)
  .join(' ')

const qualityAria = computed(() => `Line chart of average MOS from ${minRate} to ${maxRate} kbps, log scale, for ${plottedSeries.value.map(series => series.name).join(', ')}.`)
const displayScore = (score: number | null) => score === null ? '—' : (Math.round(score * 100) / 100).toFixed(2)
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
    <figcaption id="quality-chart-caption">48 kHz stereo · average objective MOS across 16–320 kbps · higher is better</figcaption>

    <ul class="series-legend">
      <li v-for="series in plottedSeries" :key="series.name">
        <span class="legend-swatch" :style="{ background: series.dash ? `repeating-linear-gradient(90deg, ${series.color} 0 5px, transparent 5px 9px)` : series.color }"></span>
        {{ series.name }}
      </li>
    </ul>

    <svg class="quality-svg" :viewBox="`0 0 ${chart.width} ${chart.height}`" role="img" :aria-label="qualityAria">
      <title>Average MOS vs bitrate</title>
      <g aria-hidden="true">
        <rect class="zoom-region" :x="xFor(128)" :y="chart.top" :width="xFor(320) - xFor(128)" :height="plotHeight" />
        <text class="axis-title" :x="(xFor(128) + xFor(320)) / 2" :y="chart.top - 6" text-anchor="middle">detail below</text>
        <line v-for="tick in yTicks" :key="tick" class="grid-line" :x1="chart.left" :x2="chart.width - chart.right" :y1="yFor(tick)" :y2="yFor(tick)" />
        <text v-for="tick in yTicks" :key="`y-${tick}`" class="axis-label" :x="chart.left - 10" :y="yFor(tick) + 3" text-anchor="end">{{ tick }}</text>
        <text v-for="rate in xTicks" :key="`x-${rate}`" class="axis-label" :x="xFor(rate)" :y="chart.height - 14" :text-anchor="rate === maxRate ? 'end' : 'middle'">{{ rate }}</text>
        <text class="axis-label axis-title" :x="chart.left + plotWidth / 2" :y="chart.height" text-anchor="middle">kbps · logarithmic scale</text>
        <text class="axis-label axis-title" :x="chart.left - 34" :y="chart.top - 4" text-anchor="start">MOS</text>
      </g>
      <g v-for="series in plottedSeries" :key="series.name" :style="{ color: series.color }">
        <polyline :points="linePoints(series.values)" fill="none" stroke="currentColor" :stroke-width="series.name === 'FAAC' ? 3 : 2" :stroke-dasharray="series.dash || undefined" stroke-linejoin="round" stroke-linecap="round" />
        <circle v-for="(value, index) in series.values" :key="index" v-show="value !== null" :cx="xFor(rates[index])" :cy="value === null ? 0 : yFor(value)" :r="series.name === 'FAAC' ? 4 : 3" fill="currentColor" stroke="var(--vp-c-bg)" stroke-width="1.5">
          <title>{{ series.name }} · {{ rates[index] }} kbps: {{ displayScore(value) }} MOS</title>
        </circle>
      </g>
    </svg>

    <p class="chart-note">
      Each encoder is shown at its higher-scoring profile for that bitrate, so points may mix profiles.
      Bitrates are requested targets, not matched actual payload rates. Scores are model estimates, not listening-test results.
    </p>

    <div class="zoom-panel">
      <p class="zoom-title">High-bitrate detail · 128–320 kbps · y-axis 4.75–5.00</p>
      <svg class="zoom-svg" :viewBox="`0 0 ${zoomChart.width} ${zoomChart.height}`" role="img" aria-label="Magnified view of average MOS from 128 to 320 kbps, y-axis 4.75 to 5.00">
        <title>High-bitrate detail: average MOS vs bitrate</title>
        <g aria-hidden="true">
          <line v-for="tick in zoomYTicks" :key="tick" class="grid-line" :x1="zoomChart.left" :x2="zoomChart.width - zoomChart.right" :y1="zoomYFor(tick)" :y2="zoomYFor(tick)" />
          <text v-for="tick in zoomYTicks" :key="`zy-${tick}`" class="axis-label" :x="zoomChart.left - 10" :y="zoomYFor(tick) + 3" text-anchor="end">{{ tick.toFixed(2) }}</text>
          <text v-for="rate in zoomXTicks" :key="`zx-${rate}`" class="axis-label" :x="zoomXFor(rate)" :y="zoomChart.height - 12" :text-anchor="rate === zoomMaxRate ? 'end' : 'middle'">{{ rate }}</text>
          <text class="axis-label axis-title" :x="zoomChart.left + zoomPlotWidth / 2" :y="zoomChart.height" text-anchor="middle">kbps · logarithmic scale</text>
        </g>
        <g v-for="series in plottedSeries" :key="series.name" :style="{ color: series.color }">
          <polyline :points="zoomPoints(series.values)" fill="none" stroke="currentColor" :stroke-width="series.name === 'FAAC' ? 3 : 2" :stroke-dasharray="series.dash || undefined" stroke-linejoin="round" stroke-linecap="round" />
          <circle v-for="(value, index) in series.values.slice(zoomStart)" :key="index" v-show="value !== null" :cx="zoomXFor(zoomRates[index])" :cy="value === null ? 0 : zoomYFor(value)" :r="series.name === 'FAAC' ? 4 : 3" fill="currentColor" stroke="var(--vp-c-bg)" stroke-width="1.5">
            <title>{{ series.name }} · {{ zoomRates[index] }} kbps: {{ displayScore(value) }} MOS</title>
          </circle>
        </g>
      </svg>
      <p class="chart-note">The detail view keeps the same 128–320 kbps data but magnifies the y-axis, so differences of a few hundredths of a MOS are visible. The shaded region in the chart above marks the range shown here.</p>
    </div>

    <details class="quality-data">
      <summary>View chart data</summary>
      <table>
        <thead>
          <tr>
            <th scope="col">kbps</th>
            <th v-for="series in plottedSeries" :key="series.name" scope="col">{{ series.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rate, index) in rates" :key="rate">
            <th scope="row">{{ rate }}</th>
            <td v-for="series in plottedSeries" :key="series.name">{{ displayScore(series.values[index]) }}</td>
          </tr>
        </tbody>
      </table>
    </details>
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
.series-legend { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 16px 0 4px; padding: 0; list-style: none; font-size: 12px; color: var(--vp-c-text-2); }
.series-legend li { display: flex; align-items: center; gap: 7px; }
.legend-swatch { display: inline-block; width: 20px; height: 3px; border-radius: 2px; }
.quality-svg, .zoom-svg { display: block; width: 100%; height: auto; overflow: visible; }
.axis-label { fill: var(--vp-c-text-3); font-size: 10px; font-variant-numeric: tabular-nums; }
.axis-title { fill: var(--vp-c-text-2); font-size: 10px; }
.grid-line { stroke: var(--vp-c-divider); stroke-width: 1; }
.zoom-region { fill: rgba(148, 163, 184, 0.08); }
.quality-chart .chart-note { font-size: 12px; line-height: 20px; color: var(--vp-c-text-2); margin: 12px 0; }
.zoom-panel { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--vp-c-divider); }
.zoom-title { font-size: 13px; font-weight: 600; color: var(--vp-c-text-2); margin: 0 0 8px; }
.quality-data { margin-top: 20px; font-size: 12px; }
.quality-data summary { cursor: pointer; color: var(--vp-c-text-2); }
.quality-data table { width: 100%; margin-top: 10px; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.quality-data th, .quality-data td { padding: 4px 8px; border-bottom: 1px solid var(--vp-c-divider); text-align: right; }
.quality-data th:first-child { text-align: left; }
@media (max-width: 640px) {
  .resource-cards { grid-template-columns: 1fr; }
  .metric-card, .quality-chart { padding: 18px; }
  .metric-card .metric-summary { min-height: 0; }
  .axis-label { font-size: 9px; }
}
</style>
