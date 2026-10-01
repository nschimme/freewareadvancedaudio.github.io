<template>
  <div class="visualizer-container">
    <div class="rack-bezel">
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
            <filter id="glow" width="140%" height="140%" x="-20%" y="-20%">
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

          <!-- Animated Spectrum Equalizer Bars -->
          <g opacity="0.9" class="eq-bars">
            <rect class="bar bar-1" fill="url(#bar-cyan)" width="28" height="120" x="48" y="300" rx="4"/>
            <rect class="bar bar-2" fill="url(#bar-cyan)" width="28" height="200" x="88" y="220" rx="4"/>
            <rect class="bar bar-3" fill="url(#bar-purple)" width="28" height="260" x="128" y="160" rx="4"/>
            <rect class="bar bar-4" fill="url(#bar-purple)" width="28" height="320" x="168" y="100" rx="4"/>
            <rect class="bar bar-5" fill="url(#bar-pink)" width="28" height="360" x="208" y="60" rx="4"/>
            <rect class="bar bar-6" fill="url(#bar-pink)" width="28" height="330" x="248" y="90" rx="4"/>
            <rect class="bar bar-7" fill="url(#bar-purple)" width="28" height="280" x="288" y="140" rx="4"/>
            <rect class="bar bar-8" fill="url(#bar-purple)" width="28" height="230" x="328" y="190" rx="4"/>
            <rect class="bar bar-9" fill="url(#bar-cyan)" width="28" height="160" x="368" y="260" rx="4"/>
            <rect class="bar bar-10" fill="url(#bar-cyan)" width="28" height="110" x="408" y="310" rx="4"/>
            <rect class="bar bar-11" fill="url(#bar-cyan)" width="28" height="70" x="448" y="350" rx="4"/>
          </g>

          <!-- Animated Glowing Frequency Sine Wave -->
          <path
            fill="none"
            stroke="url(#wave)"
            stroke-linecap="round"
            stroke-width="10"
            d="M40 256c50 0 80-186 140-186s90 372 150 372 90-186 142-186"
            filter="url(#glow)"
            class="glowing-wave"
          />
        </svg>

        <!-- 90s Hardware VFD Indicators -->
        <div class="vfd-indicators">
          <span class="vfd-tag">STEREO L/R</span>
          <span class="vfd-tag highlight">DSP HIGH-FIDELITY</span>
          <span class="vfd-tag">44.1 kHz / 16-BIT</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visualizer-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  width: 100%;
}

.rack-bezel {
  background: linear-gradient(180deg, #1e293b, #0f172a);
  border: 2px solid #334155;
  border-radius: 16px;
  padding: 12px;
  box-shadow:
    0 15px 35px -5px rgba(0, 0, 0, 0.6),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
  max-width: 600px;
  width: 100%;
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

/* 90s Equalizer Bar Animations */
.bar {
  transform-origin: bottom;
  animation: eq-bounce 1.8s ease-in-out infinite alternate;
}

.bar-1 { animation-delay: 0.1s; animation-duration: 1.4s; }
.bar-2 { animation-delay: 0.3s; animation-duration: 1.7s; }
.bar-3 { animation-delay: 0.2s; animation-duration: 1.5s; }
.bar-4 { animation-delay: 0.5s; animation-duration: 1.9s; }
.bar-5 { animation-delay: 0.1s; animation-duration: 1.6s; }
.bar-6 { animation-delay: 0.4s; animation-duration: 1.8s; }
.bar-7 { animation-delay: 0.2s; animation-duration: 1.3s; }
.bar-8 { animation-delay: 0.6s; animation-duration: 1.7s; }
.bar-9 { animation-delay: 0.3s; animation-duration: 1.5s; }
.bar-10 { animation-delay: 0.1s; animation-duration: 1.4s; }
.bar-11 { animation-delay: 0.4s; animation-duration: 1.6s; }

@keyframes eq-bounce {
  0% {
    transform: scaleY(0.4);
  }
  30% {
    transform: scaleY(1.05);
  }
  60% {
    transform: scaleY(0.65);
  }
  100% {
    transform: scaleY(0.95);
  }
}

/* Glowing Sine Wave Animation */
.glowing-wave {
  animation: wave-pulse 2.5s ease-in-out infinite alternate;
}

@keyframes wave-pulse {
  0% {
    opacity: 0.7;
    stroke-width: 8;
  }
  100% {
    opacity: 1;
    stroke-width: 13;
  }
}

.vfd-indicators {
  position: absolute;
  bottom: 12px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  font-family: monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 1px;
  pointer-events: none;
}

.vfd-tag {
  color: rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.7);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.vfd-tag.highlight {
  color: #22d3ee;
  border-color: rgba(6, 182, 212, 0.4);
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.8);
}
</style>
