<script setup lang="ts">
defineProps<{ view: 'home' | 'devices' | 'memory' }>()

const metrics = [
  {
    icon: 'bolt',
    title: 'Real-time speed',
    value: 'About 10×',
    unit: 'realtime',
    summary: 'Stereo AAC-LC encoding on an ESP32-S3.',
    rows: [
      { name: 'FAAC encode', value: 100, label: 'about 10×', tone: 'encode' },
      { name: 'FAAD decode', value: 50, label: 'about 5×', tone: 'decode' }
    ],
    note: 'Relative to real time · higher is better'
  },
  {
    icon: 'microchip',
    title: 'Flash footprint',
    value: '100 KB',
    unit: 'or less per library',
    summary: 'Each library fits in a small flash budget.',
    rows: [
      { name: 'FAAC', value: 45, label: 'under 50 KB', tone: 'encode' },
      { name: 'FAAD', value: 65, label: 'under 70 KB', tone: 'decode' }
    ],
    note: 'Code + constants + initialized data · lower is better'
  }
]

const devices = [
  { name: 'ESP32-S3', note: '240 MHz · FPU', decode: 5, decodeLabel: '~5×', encode: 10, encodeLabel: '~10×' },
  { name: 'Classic ESP32', note: '240 MHz · no PSRAM', decode: 5, decodeLabel: '~5×', encode: 10, encodeLabel: '~10×' },
  { name: 'ESP32-C6', note: '160 MHz · no FPU', decode: 0.3, decodeLabel: '~0.3×', encode: 0.6, encodeLabel: '~0.6×' }
]

const deviceMax = 10
const barWidth = (value: number) => `${Math.max((value / deviceMax) * 100, value > 0 ? 2 : 0)}%`

const memoryRows = [
  { label: 'AAC-LC speed', value: 100, display: '100%' },
  { label: 'HE-AAC speed', value: 88, display: '~90%' }
]
</script>

<template>
  <div class="esp32-showcase">
    <div v-if="view === 'home'" class="esp32-metric-grid">
      <article v-for="metric in metrics" :key="metric.title" class="esp32-card esp32-card--interactive">
        <div class="esp32-card-heading">
          <i :class="`fa-solid fa-${metric.icon}`" aria-hidden="true"></i>
          <h3>{{ metric.title }}</h3>
        </div>
        <div class="esp32-card-value">{{ metric.value }} <span>{{ metric.unit }}</span></div>
        <p class="esp32-card-summary">{{ metric.summary }}</p>
        <div class="esp32-resource-rows">
          <div v-for="row in metric.rows" :key="row.name" class="esp32-resource-row">
            <div class="esp32-resource-label"><span>{{ row.name }}</span><strong>{{ row.label }}</strong></div>
            <div class="esp32-track" aria-hidden="true">
              <div class="esp32-fill" :class="`esp32-fill--${row.tone}`" :style="{ width: `${row.value}%` }"></div>
            </div>
          </div>
        </div>
        <p class="esp32-card-note">{{ metric.note }}</p>
      </article>
    </div>

    <figure v-else-if="view === 'devices'" class="esp32-chart-card">
      <figcaption>Speed across the ESP32 family</figcaption>
      <p class="esp32-chart-deck">Rounded speed relative to real time. The ESP32-S3 and classic ESP32 land in the same range; the FPU-less ESP32-C6 is the outlier.</p>
      <div class="esp32-device-list">
        <div v-for="device in devices" :key="device.name" class="esp32-device">
          <div class="esp32-device-head">
            <strong>{{ device.name }}</strong>
            <span>{{ device.note }}</span>
          </div>
          <div class="esp32-device-bars">
            <div class="esp32-bar-row">
              <span class="esp32-bar-label">HE-AAC decode</span>
              <span class="esp32-bar-value">{{ device.decodeLabel }}</span>
              <div class="esp32-bar-track" aria-hidden="true">
                <div class="esp32-bar-fill esp32-bar-fill--decode" :style="{ width: barWidth(device.decode) }"></div>
              </div>
            </div>
            <div class="esp32-bar-row">
              <span class="esp32-bar-label">AAC-LC stereo encode</span>
              <span class="esp32-bar-value">{{ device.encodeLabel }}</span>
              <div class="esp32-bar-track" aria-hidden="true">
                <div class="esp32-bar-fill esp32-bar-fill--encode" :style="{ width: barWidth(device.encode) }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="esp32-chart-note">The dashed line marks 1× real time. Rounded figures; see the full notes for exact results.</p>
    </figure>

    <figure v-else class="esp32-chart-card">
      <figcaption>Internal RAM vs PSRAM</figcaption>
      <p class="esp32-chart-deck">Moving decoder state to PSRAM frees internal RAM. AAC-LC keeps full speed; HE-AAC gives up about a tenth.</p>
      <div class="esp32-compare-grid">
        <div class="esp32-compare-panel">
          <span class="esp32-compare-label">Internal RAM</span>
          <strong>~100 KB</strong>
          <span>state held internally</span>
        </div>
        <div class="esp32-compare-panel is-highlight">
          <span class="esp32-compare-label">PSRAM</span>
          <strong>~15 KB</strong>
          <span>internal RAM after the move</span>
        </div>
      </div>
      <div class="esp32-memory-rows">
        <div v-for="row in memoryRows" :key="row.label" class="esp32-bar-row">
          <span class="esp32-bar-label">{{ row.label }}</span>
          <span class="esp32-bar-value">{{ row.display }}</span>
          <div class="esp32-bar-track" aria-hidden="true">
            <div class="esp32-bar-fill esp32-bar-fill--memory" :style="{ width: `${row.value}%` }"></div>
          </div>
        </div>
      </div>
      <p class="esp32-chart-note">Speed relative to state in internal RAM. PSRAM is effectively free for AAC-LC and costs about a tenth for HE-AAC. It is a memory-headroom trade, not a bitrate requirement.</p>
    </figure>
  </div>
</template>
