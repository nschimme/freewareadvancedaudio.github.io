<template>
  <div class="visualizer-container">
    <div
      class="rack-bezel"
      @mousemove="handlePointerMove"
      @mouseleave="handlePointerLeave"
      @touchstart.passive="handlePointerMove"
      @touchmove.passive="handlePointerMove"
      @touchend="handlePointerLeave"
      @click="handlePointerClick"
    >
      <div class="display-window">
        <!-- 90s Hardware Stereo Equalizer Display -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="equalizer-svg">
          <defs>
            <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stop-color="#0f172a"/>
              <stop offset="50%" stop-color="#1e1b4b"/>
              <stop offset="100%" stop-color="#311042"/>
            </linearGradient>
            <linearGradient id="bar-cyan" x1="0%" x2="0%" y1="100%" y2="0%">
              <stop offset="0%" stop-color="#06b6d4" stop-opacity=".2"/>
              <stop offset="100%" stop-color="#3b82f6" stop-opacity=".8"/>
            </linearGradient>
            <linearGradient id="bar-purple" x1="0%" x2="0%" y1="100%" y2="0%">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity=".3"/>
              <stop offset="60%" stop-color="#8b5cf6" stop-opacity=".8"/>
              <stop offset="100%" stop-color="#ec4899" stop-opacity=".9"/>
            </linearGradient>
            <linearGradient id="bar-pink" x1="0%" x2="0%" y1="100%" y2="0%">
              <stop offset="0%" stop-color="#ec4899" stop-opacity=".4"/>
              <stop offset="70%" stop-color="#f43f5e" stop-opacity=".9"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
            <linearGradient id="wave" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stop-color="#06b6d4"/>
              <stop offset="50%" stop-color="#f43f5e"/>
              <stop offset="100%" stop-color="#f59e0b"/>
            </linearGradient>
            <filter id="glow" width="160%" height="160%" x="-30%" y="-30%">
              <feGaussianBlur stdDeviation="8"/>
              <feComposite in="SourceGraphic"/>
            </filter>
          </defs>

          <!-- Background Gradient -->
          <rect fill="url(#bg)" width="512" height="512" rx="16"/>

          <!-- Grid Overlay for 90s Hardware VFD look -->
          <g opacity="0.15" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,6">
            <line x1="0" y1="100" x2="512" y2="100"/>
            <line x1="0" y1="180" x2="512" y2="180"/>
            <line x1="0" y1="260" x2="512" y2="260"/>
            <line x1="0" y1="340" x2="512" y2="340"/>
            <line x1="0" y1="420" x2="512" y2="420"/>
          </g>

          <!-- Interactive Spectrum Equalizer Bars -->
          <g opacity="0.9" class="eq-bars">
            <rect
              v-for="(bar, index) in barScales"
              :key="index"
              :class="['bar', `bar-${index + 1}`, barGradientClass(index)]"
              :fill="barGradientUrl(index)"
              width="28"
              :height="barBaseHeights[index]"
              :x="48 + index * 40"
              :y="500 - barBaseHeights[index]"
              rx="4"
              :style="{ transform: `scaleY(${bar})`, transformOrigin: `${48 + index * 40 + 14}px 500px` }"
            />
          </g>

          <!-- Seamless Looping Oscilloscope Sine Wave modulated by interaction -->
          <path
            fill="none"
            stroke="url(#wave)"
            stroke-linecap="round"
            :stroke-width="isInteractive ? 11 : 8"
            d="M -120 256
               c 16.56 -80, 43.44 -80, 60 0 c 16.56 80, 43.44 80, 60 0
               c 16.56 -80, 43.44 -80, 60 0 c 16.56 80, 43.44 80, 60 0
               c 16.56 -80, 43.44 -80, 60 0 c 16.56 80, 43.44 80, 60 0
               c 16.56 -80, 43.44 -80, 60 0 c 16.56 80, 43.44 80, 60 0
               c 16.56 -80, 43.44 -80, 60 0 c 16.56 80, 43.44 80, 60 0
               c 16.56 -80, 43.44 -80, 60 0 c 16.56 80, 43.44 80, 60 0"
            filter="url(#glow)"
            :class="['looping-sine-wave', { 'wave-boost': isInteractive }]"
            :style="{ animationDuration: waveSpeed + 's' }"
          />
        </svg>

        <!-- 90s Hardware VFD Indicators -->
        <div class="vfd-indicators">
          <span class="vfd-tag" :class="{ highlight: isInteractive }">
            {{ isInteractive ? 'INTERACTIVE DSP' : 'STEREO L/R' }}
          </span>
          <span class="vfd-tag highlight">
            {{ activeFreqTag }}
          </span>
          <span class="vfd-tag">48 kHz / 16-BIT</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const barBaseHeights = [120, 200, 260, 320, 360, 330, 280, 230, 160, 110, 70]
const barScales = ref([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
const isInteractive = ref(false)
const activeFreqTag = ref('DSP HIGH-FIDELITY')
const waveSpeed = ref(3)

function barGradientUrl(index) {
  if (index < 2 || index >= 8) return 'url(#bar-cyan)'
  if (index >= 4 && index <= 5) return 'url(#bar-pink)'
  return 'url(#bar-purple)'
}

function barGradientClass(index) {
  return `bar-grad-${index}`
}

function handlePointerMove(e) {
  isInteractive.value = true
  const rect = e.currentTarget.getBoundingClientRect()
  const x = Math.max(0, Math.min(rect.width, (e.touches ? e.touches[0].clientX : e.clientX) - rect.left))
  const y = Math.max(0, Math.min(rect.height, (e.touches ? e.touches[0].clientY : e.clientY) - rect.top))

  const normalizedX = x / rect.width
  const normalizedY = 1 - (y / rect.height)

  // Modulate wave speed according to cursor X
  waveSpeed.value = 0.8 + (1 - normalizedX) * 3

  // Modulate frequency band label
  const freqBands = ['31 Hz (SUB)', '125 Hz (BASS)', '500 Hz (MID)', '2 kHz (PRESENCE)', '8 kHz (TREBLE)', '16 kHz (AIR)']
  const bandIndex = Math.floor(normalizedX * freqBands.length)
  activeFreqTag.value = `BOOST: ${freqBands[Math.min(bandIndex, freqBands.length - 1)]}`

  // Calculate interactive scale for each equalizer bar based on proximity to pointer X
  barScales.value = barBaseHeights.map((_, index) => {
    const barXRatio = index / (barBaseHeights.length - 1)
    const distance = Math.abs(normalizedX - barXRatio)
    const boost = Math.max(0, 1 - distance * 2.5) * (0.4 + normalizedY * 0.8)
    return 0.7 + boost
  })
}

function handlePointerLeave() {
  isInteractive.value = false
  activeFreqTag.value = 'DSP HIGH-FIDELITY'
  waveSpeed.value = 3
  barScales.value = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
}

function handlePointerClick() {
  // Fun pulse burst on click/tap
  barScales.value = barScales.value.map(s => Math.min(1.4, s * 1.3))
  activeFreqTag.value = '⚡ FAAC 2.2 PEAK 0 dB'
  setTimeout(() => {
    if (!isInteractive.value) handlePointerLeave()
  }, 1000)
}
</script>

<style scoped>
.visualizer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.rack-bezel {
  background: linear-gradient(180deg, #1e293b, #0f172a);
  border: 2px solid #334155;
  border-radius: 16px;
  padding: 10px;
  box-shadow:
    0 15px 35px -5px rgba(0, 0, 0, 0.6),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 440px;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.rack-bezel:hover {
  border-color: #06b6d4;
  box-shadow:
    0 20px 40px -5px rgba(6, 182, 212, 0.25),
    inset 0 1px 2px rgba(255, 255, 255, 0.2);
}

.display-window {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
}

.equalizer-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Slower, Smooth 90s Equalizer Bar Animations */
.bar {
  transition: transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
  animation: eq-bounce-slow 4s ease-in-out infinite alternate;
}

.bar-1 { animation-delay: 0.2s; animation-duration: 3.8s; }
.bar-2 { animation-delay: 0.6s; animation-duration: 4.2s; }
.bar-3 { animation-delay: 0.4s; animation-duration: 3.5s; }
.bar-4 { animation-delay: 0.9s; animation-duration: 4.5s; }
.bar-5 { animation-delay: 0.3s; animation-duration: 3.9s; }
.bar-6 { animation-delay: 0.8s; animation-duration: 4.1s; }
.bar-7 { animation-delay: 0.5s; animation-duration: 3.6s; }
.bar-8 { animation-delay: 1.1s; animation-duration: 4.4s; }
.bar-9 { animation-delay: 0.7s; animation-duration: 3.7s; }
.bar-10 { animation-delay: 0.3s; animation-duration: 3.9s; }
.bar-11 { animation-delay: 0.8s; animation-duration: 4.0s; }

@keyframes eq-bounce-slow {
  0% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.9;
  }
}

/* Seamless Oscilloscope Looping Wave Animation */
.looping-sine-wave {
  animation: wave-loop linear infinite;
  transition: stroke-width 0.2s ease, filter 0.2s ease;
}

.looping-sine-wave.wave-boost {
  filter: drop-shadow(0 0 12px #06b6d4);
}

@keyframes wave-loop {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-120px);
  }
}

.vfd-indicators {
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  font-family: monospace, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.5px;
  pointer-events: none;
}

.vfd-tag {
  color: rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.85);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.vfd-tag.highlight {
  color: #22d3ee;
  border-color: rgba(6, 182, 212, 0.4);
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.8);
}
</style>
