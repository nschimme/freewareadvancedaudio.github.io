<template>
  <div
    class="waveform-player"
    :class="{ 'is-playing': isPlaying, 'is-loading': loading }"
    role="region"
    :aria-label="ariaLabel || 'Audio player'"
  >
    <!-- Hidden native audio element handles reliable decode & playback -->
    <audio
      ref="audioEl"
      :src="src"
      preload="metadata"
      @play="handleNativePlay"
      @pause="handleNativePause"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
      @loadedmetadata="handleLoadedMetadata"
      @seeking="isSeekingInternal = true"
      @seeked="isSeekingInternal = false"
    ></audio>

    <!-- Play/Pause Control Button -->
    <button
      type="button"
      class="player-btn play-pause-btn"
      :aria-label="isPlaying ? 'Pause' : 'Play'"
      :disabled="loading || !src"
      @click="togglePlay"
    >
      <i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'" aria-hidden="true"></i>
    </button>

    <!-- Interactive Waveform Timeline -->
    <div
      ref="trackRef"
      class="waveform-track"
      role="slider"
      tabindex="0"
      :aria-label="`${ariaLabel || 'Audio'} progress`"
      :aria-valuemin="0"
      :aria-valuemax="Math.round(totalDuration)"
      :aria-valuenow="Math.round(currentTime)"
      :aria-valuetext="`${formatDuration(currentTime)} of ${formatDuration(totalDuration)}`"
      @keydown="handleKeydown"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerCancel"
    >
      <!-- Background Waveform SVG Bars -->
      <svg
        class="waveform-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath :id="clipId">
            <rect :x="0" :y="0" :width="progressPercent" height="100" />
          </clipPath>
        </defs>

        <!-- Unplayed waveform bars (dimmed) -->
        <g class="waveform-bars-unplayed">
          <rect
            v-for="(bar, i) in normalizedBars"
            :key="'unplayed-' + i"
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            rx="1.2"
          />
        </g>

        <!-- Played waveform bars (colored, clipped to progress) -->
        <g class="waveform-bars-played" :clip-path="`url(#${clipId})`">
          <rect
            v-for="(bar, i) in normalizedBars"
            :key="'played-' + i"
            :x="bar.x"
            :y="bar.y"
            :width="bar.width"
            :height="bar.height"
            rx="1.2"
          />
        </g>
      </svg>

      <!-- Scrub Playhead Line -->
      <div
        class="waveform-playhead"
        :style="{ left: `${progressPercent}%` }"
        aria-hidden="true"
      ></div>

      <!-- Hover Guide Line -->
      <div
        v-if="hoverPercent !== null"
        class="waveform-hover-line"
        :style="{ left: `${hoverPercent}%` }"
        aria-hidden="true"
      ></div>
    </div>

    <!-- Duration / Timestamp -->
    <div class="player-time" aria-hidden="true">
      <span class="current-time">{{ formatDuration(currentTime) }}</span>
      <span class="time-sep">/</span>
      <span class="total-duration">{{ formatDuration(totalDuration) }}</span>
    </div>

    <!-- Mute / Unmute Toggle Button -->
    <button
      type="button"
      class="player-btn mute-btn"
      :aria-label="isMuted ? 'Unmute' : 'Mute'"
      @click="toggleMute"
    >
      <i :class="isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high'" aria-hidden="true"></i>
    </button>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  ariaLabel: { type: String, default: 'Audio' },
  peaks: { type: Array, default: () => [] },
  duration: { type: Number, default: 0 },
  activeTrackId: { type: String, default: '' },
  trackId: { type: String, required: true },
  sharedTime: { type: Number, default: 0 },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits([
  'play',
  'pause',
  'seek',
  'timeupdate'
])

const audioEl = ref(null)
const trackRef = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const localDuration = ref(0)
const isDragging = ref(false)
const isSeekingInternal = ref(false)
const hoverPercent = ref(null)
const clipId = `waveform-clip-${Math.random().toString(36).slice(2, 9)}`

const totalDuration = computed(() => {
  return props.duration || localDuration.value || 0
})

const currentTime = computed(() => {
  return props.sharedTime || 0
})

const progressPercent = computed(() => {
  if (!totalDuration.value || totalDuration.value <= 0) return 0
  const pct = (currentTime.value / totalDuration.value) * 100
  return Math.min(100, Math.max(0, pct))
})

// Normalize bars for SVG rendering (100 total bars across 0-100 viewBox coordinate space)
const normalizedBars = computed(() => {
  const barCount = 70
  const result = []
  const inputPeaks = props.peaks && props.peaks.length > 0 ? props.peaks : []

  const gapRatio = 0.35 // 35% gap, 65% bar
  const totalSlots = barCount
  const slotWidth = 100 / totalSlots
  const barWidth = slotWidth * (1 - gapRatio)

  for (let i = 0; i < barCount; i++) {
    let val = 0.2
    if (inputPeaks.length > 0) {
      const idx = Math.floor((i / barCount) * inputPeaks.length)
      val = inputPeaks[idx] ?? 0.2
    } else {
      // Gentle pseudo-wave placeholder if peaks not yet computed
      val = 0.2 + 0.15 * Math.sin(i * 0.25)
    }
    // Clamp height between 8% and 90%
    val = Math.max(0.08, Math.min(0.92, val))
    const height = val * 85
    const y = (100 - height) / 2
    const x = i * slotWidth + (slotWidth - barWidth) / 2

    result.push({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      width: Number(barWidth.toFixed(2)),
      height: Number(height.toFixed(2))
    })
  }
  return result
})

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

function handleLoadedMetadata() {
  if (audioEl.value && !isNaN(audioEl.value.duration) && audioEl.value.duration > 0) {
    localDuration.value = audioEl.value.duration
  }
}

function handleNativePlay() {
  isPlaying.value = true
  emit('play', { trackId: props.trackId })
}

function handleNativePause() {
  isPlaying.value = false
  emit('pause', { trackId: props.trackId })
}

function handleTimeUpdate() {
  if (!audioEl.value || isDragging.value || isSeekingInternal.value) return
  if (props.activeTrackId === props.trackId) {
    emit('timeupdate', audioEl.value.currentTime)
  }
}

function handleEnded() {
  isPlaying.value = false
  emit('seek', 0)
}

function togglePlay() {
  if (!audioEl.value || props.loading) return
  if (isPlaying.value) {
    audioEl.value.pause()
  } else {
    // If not this active track, ensure audioEl is synced to sharedTime before playing
    if (Math.abs(audioEl.value.currentTime - props.sharedTime) > 0.05) {
      audioEl.value.currentTime = props.sharedTime
    }
    audioEl.value.play().catch(() => {})
  }
}

function toggleMute() {
  if (!audioEl.value) return
  isMuted.value = !isMuted.value
  audioEl.value.muted = isMuted.value
}

// Coordinate to time calculation
function getTimeFromPointer(event) {
  if (!trackRef.value) return 0
  const rect = trackRef.value.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const ratio = Math.max(0, Math.min(1, offsetX / rect.width))
  return ratio * totalDuration.value
}

function handlePointerDown(event) {
  if (props.loading || !totalDuration.value) return
  trackRef.value?.setPointerCapture?.(event.pointerId)
  isDragging.value = true
  const seekTime = getTimeFromPointer(event)
  emit('seek', seekTime)
}

function handlePointerMove(event) {
  if (!trackRef.value || !totalDuration.value) return
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
  hoverPercent.value = Number((ratio * 100).toFixed(1))

  if (isDragging.value) {
    const seekTime = ratio * totalDuration.value
    emit('seek', seekTime)
  }
}

function handlePointerUp(event) {
  if (isDragging.value) {
    trackRef.value?.releasePointerCapture?.(event.pointerId)
    isDragging.value = false
    hoverPercent.value = null
  }
}

function handlePointerCancel() {
  isDragging.value = false
  hoverPercent.value = null
}

function handleKeydown(event) {
  if (!totalDuration.value) return
  const step = 5 // 5 seconds
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    togglePlay()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    const newTime = Math.max(0, currentTime.value - step)
    emit('seek', newTime)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    const newTime = Math.min(totalDuration.value, currentTime.value + step)
    emit('seek', newTime)
  } else if (event.key === 'Home') {
    event.preventDefault()
    emit('seek', 0)
  } else if (event.key === 'End') {
    event.preventDefault()
    emit('seek', totalDuration.value)
  }
}

// Watch sharedTime from parent: sync audio element when not actively updating itself
watch(() => props.sharedTime, (newTime) => {
  if (!audioEl.value) return
  if (props.activeTrackId !== props.trackId) {
    // Only update currentTime if there's noticeable drift to prevent micro-stutter
    if (Math.abs(audioEl.value.currentTime - newTime) > 0.05) {
      audioEl.value.currentTime = newTime
    }
  } else if (isDragging.value) {
    audioEl.value.currentTime = newTime
  }
})

// Watch activeTrackId: if another track becomes active, pause this one
watch(() => props.activeTrackId, (newActive) => {
  if (!audioEl.value) return
  if (newActive !== props.trackId && isPlaying.value) {
    audioEl.value.pause()
  } else if (newActive === props.trackId && !isPlaying.value) {
    if (Math.abs(audioEl.value.currentTime - props.sharedTime) > 0.05) {
      audioEl.value.currentTime = props.sharedTime
    }
    audioEl.value.play().catch(() => {})
  }
})

// Expose internal audio element and control methods
defineExpose({
  pause: () => audioEl.value?.pause(),
  play: () => audioEl.value?.play(),
  seek: (t) => { if (audioEl.value) audioEl.value.currentTime = t }
})
</script>

<style scoped>
.waveform-player {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 12px;
  box-sizing: border-box;
  user-select: none;
  transition: border-color 0.2s, background-color 0.2s;
}

.waveform-player:focus-within {
  border-color: rgba(16, 185, 129, 0.45);
}

.waveform-player.is-playing {
  border-color: rgba(16, 185, 129, 0.45);
  background: rgba(15, 23, 42, 0.85);
}

.player-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid transparent;
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  cursor: pointer;
  flex-shrink: 0;
  touch-action: manipulation;
  transition: all 0.15s ease;
}

.player-btn:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.35);
}

.player-btn:focus-visible {
  outline: 2px solid #34d399;
  outline-offset: 2px;
}

.player-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.play-pause-btn {
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1.1rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.25));
  border-color: rgba(16, 185, 129, 0.4);
  color: #6ee7b7;
}

.is-playing .play-pause-btn {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: #0f172a;
}

.mute-btn {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 0.9rem;
  color: #94a3b8;
}

.waveform-track {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 48px;
  background: rgba(2, 6, 23, 0.4);
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  outline: none;
}

.waveform-track:focus-visible {
  outline: 2px solid #34d399;
  outline-offset: 2px;
}

.waveform-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.waveform-bars-unplayed rect {
  fill: rgba(148, 163, 184, 0.25);
  transition: fill 0.2s;
}

.waveform-player:hover .waveform-bars-unplayed rect {
  fill: rgba(148, 163, 184, 0.35);
}

.waveform-bars-played rect {
  fill: url(#waveform-gradient);
  fill: #34d399;
}

.waveform-playhead {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
  pointer-events: none;
  transform: translateX(-50%);
  z-index: 2;
  transition: left 0.05s linear;
}

.waveform-hover-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.35);
  pointer-events: none;
  transform: translateX(-50%);
  z-index: 1;
}

.player-time {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.82rem;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.current-time {
  color: #e2e8f0;
}

.time-sep {
  opacity: 0.6;
}

@media (max-width: 480px) {
  .waveform-player {
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
  }
  .mute-btn {
    display: none;
  }
  .player-time {
    font-size: 0.75rem;
  }
}
</style>
