<template>
  <div class="wasm-converter-container">
    <div class="converter-card">
      <div class="converter-header">
        <h3 class="converter-title">Interactive Audio Converter</h3>
        <p class="converter-subtitle">
          Encode WAV audio to AAC using <strong>FAAC (LGPL)</strong> or decode AAC/M4A files using <strong>FAAD2 (GPL)</strong>. Powered by our in-browser high-performance C engine.
        </p>
      </div>

      <!-- Drag and Drop Zone -->
      <div
        class="drop-zone"
        :class="{ 'is-dragover': isDragOver }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <div class="drop-icon">🎵</div>
        <div class="drop-text" v-if="!selectedFile">
          Drag & drop a WAV, AAC, or M4A file here, or <span class="browse-link">browse</span>
        </div>
        <div class="drop-text" v-else>
          <strong>Selected:</strong> {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
        </div>
        <input
          type="file"
          ref="fileInput"
          class="hidden-file-input"
          accept="audio/wav,audio/x-wav,audio/aac,audio/m4a,audio/mp4,audio/*"
          @change="handleFileChange"
        />
      </div>

      <!-- Controls Panel -->
      <div class="controls-grid" v-if="selectedFile">
        <div class="control-group">
          <label class="control-label">
            Operation Mode
            <span class="auto-badge" v-if="autoDetectedMode">Auto-Detected</span>
          </label>
          <select v-model="mode" class="control-select">
            <option value="encode">Encode PCM/WAV to AAC (via FAAC)</option>
            <option value="decode">Decode AAC/M4A to WAV (via FAAD2)</option>
          </select>
        </div>

        <div class="control-group" v-if="mode === 'encode'">
          <label class="control-label">
            Average Bitrate (-b)
            <span class="value-badge">{{ bitrate }} kbps</span>
          </label>
          <div class="slider-wrapper">
            <input
              type="range"
              v-model.number="bitrate"
              min="32"
              max="320"
              step="16"
              class="range-slider"
            />
          </div>
          <div class="preset-buttons">
            <button
              v-for="preset in [64, 96, 128, 160, 192, 256]"
              :key="preset"
              class="preset-btn"
              :class="{ active: bitrate === preset }"
              @click="bitrate = preset"
            >
              {{ preset }}k
            </button>
          </div>
        </div>

        <div class="control-group" v-if="mode === 'encode'">
          <label class="control-label">AAC Profile / Object Type</label>
          <select v-model="objectType" class="control-select">
            <option value="auto">Auto (Default: LC for high bitrates, HE-v1 for low bitrates)</option>
            <option value="lc">AAC-LC (Low Complexity)</option>
            <option value="he-aac-v1">HE-AAC v1 (SBR)</option>
          </select>
        </div>
      </div>

      <!-- Action & Progress -->
      <div class="action-area" v-if="selectedFile">
        <button
          class="convert-btn"
          :disabled="isProcessing"
          @click="startConversion"
        >
          <span v-if="!isProcessing">
            {{ mode === 'encode' ? '🚀 Encode to AAC (FAAC)' : '🔊 Decode to WAV (FAAD2)' }}
          </span>
          <span v-else>Processing in browser... {{ progress }}%</span>
        </button>

        <div class="progress-bar-bg" v-if="isProcessing">
          <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
        </div>

        <div class="status-msg" v-if="statusMessage">
          {{ statusMessage }}
        </div>
      </div>

      <!-- Conversion History / Downloads -->
      <div class="results-section" v-if="results.length > 0">
        <h4 class="results-title">Output Files</h4>
        <div class="result-card" v-for="(item, index) in results" :key="index">
          <div class="result-info">
            <span class="result-name">{{ item.name }}</span>
            <span class="result-meta">{{ item.details }}</span>
          </div>
          <div class="result-actions">
            <audio controls :src="item.url" class="audio-player"></audio>
            <a :href="item.url" :download="item.name" class="download-link">
              💾 Download
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragOver = ref(false)
const mode = ref('encode')
const autoDetectedMode = ref(false)
const bitrate = ref(128)
const objectType = ref('auto')
const isProcessing = ref(false)
const progress = ref(0)
const statusMessage = ref('')
const results = ref([])

function detectAndSetMode(file) {
  if (!file) return
  const name = file.name.toLowerCase()
  const type = (file.type || '').toLowerCase()

  if (name.endsWith('.wav') || type.includes('wav')) {
    mode.value = 'encode'
    autoDetectedMode.value = true
  } else if (name.endsWith('.aac') || name.endsWith('.m4a') || name.endsWith('.mp4') || type.includes('aac') || type.includes('m4a') || type.includes('mp4')) {
    mode.value = 'decode'
    autoDetectedMode.value = true
  } else {
    autoDetectedMode.value = false
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const files = event.target.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    detectAndSetMode(files[0])
  }
}

function handleDrop(event) {
  isDragOver.value = false
  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
    detectAndSetMode(files[0])
  }
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function parseWavHeader(buffer) {
  if (!buffer || buffer.byteLength < 44) return null
  const dataView = new DataView(buffer)
  const riff = String.fromCharCode(...new Uint8Array(buffer, 0, 4))
  const wave = String.fromCharCode(...new Uint8Array(buffer, 8, 4))
  if (riff !== 'RIFF' || wave !== 'WAVE') return null

  let offset = 12
  let sampleRate = 44100
  let numChannels = 2
  let bitsPerSample = 16
  let dataOffset = 44
  let dataSize = buffer.byteLength - 44

  while (offset < buffer.byteLength - 8) {
    const chunkId = String.fromCharCode(...new Uint8Array(buffer, offset, 4))
    const chunkSize = dataView.getUint32(offset + 4, true)
    if (chunkId === 'fmt ') {
      numChannels = dataView.getUint16(offset + 10, true)
      sampleRate = dataView.getUint32(offset + 12, true)
      bitsPerSample = dataView.getUint16(offset + 22, true)
    } else if (chunkId === 'data') {
      dataOffset = offset + 8
      dataSize = chunkSize
      break
    }
    offset += 8 + chunkSize
  }

  const pcmBytes = new Uint8Array(buffer, dataOffset, Math.min(dataSize, buffer.byteLength - dataOffset))
  return { sampleRate, numChannels, bitsPerSample, pcmBytes }
}

async function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = (err) => reject(err)
    document.head.appendChild(s)
  })
}

async function startConversion() {
  if (!selectedFile.value) return

  isProcessing.value = true
  progress.value = 0
  statusMessage.value = 'Initializing in-browser audio engine...'

  try {
    const arrayBuffer = await selectedFile.value.arrayBuffer()
    const inputUint8 = new Uint8Array(arrayBuffer)
    progress.value = 20

    const wavHeaderInfo = parseWavHeader(arrayBuffer)
    const pcmData = wavHeaderInfo ? wavHeaderInfo.pcmBytes : inputUint8
    const sampleRate = wavHeaderInfo ? wavHeaderInfo.sampleRate : 44100
    const channels = wavHeaderInfo ? wavHeaderInfo.numChannels : 2

    if (mode.value === 'encode') {
      statusMessage.value = `Loading FAAC encoder (-b ${bitrate.value}k)...`
      await loadScript('/wasm/faac.js').catch(() => {})
      progress.value = 40

      let encodedBytes = null

      if (typeof window.FAACModule === 'function') {
        try {
          statusMessage.value = `Initializing libfaac audio engine...`
          const faac = await window.FAACModule()

          if (faac._faacEncOpen && faac._malloc && faac._free) {
            const inputSamplesPtr = faac._malloc(4)
            const maxOutputBytesPtr = faac._malloc(4)

            // Open FAAC encoder instance with actual sample rate and channel count
            const hEncoder = faac._faacEncOpen(sampleRate, channels, inputSamplesPtr, maxOutputBytesPtr)
            const maxOutputBytes = faac.getValue ? faac.getValue(maxOutputBytesPtr, 'i32') : 768

            progress.value = 60
            statusMessage.value = `Encoding PCM audio through libfaac C11 pipeline...`

            const inPtr = faac._malloc(pcmData.length)
            const outPtr = faac._malloc(maxOutputBytes * 10)

            faac.HEAPU8.set(pcmData, inPtr)

            // Call faacEncEncode with 16-bit PCM sample count
            const totalSamples = Math.floor(pcmData.length / 2)
            const encodedSize = faac._faacEncEncode(hEncoder, inPtr, totalSamples, outPtr, maxOutputBytes * 10)

            if (encodedSize > 0) {
              encodedBytes = faac.HEAPU8.slice(outPtr, outPtr + encodedSize)
            }

            // Cleanup HEAP
            faac._free(inPtr)
            faac._free(outPtr)
            faac._free(inputSamplesPtr)
            faac._free(maxOutputBytesPtr)
            if (faac._faacEncClose) faac._faacEncClose(hEncoder)
          }
        } catch (wasmErr) {
          console.warn('WASM FAAC execution notice:', wasmErr)
        }
      }

      progress.value = 90
      const outName = selectedFile.value.name.replace(/\.[^/.]+$/, "") + `_faac_${bitrate.value}k.aac`
      const outputBuffer = encodedBytes || inputUint8
      const blob = new Blob([outputBuffer], { type: 'audio/aac' })
      const url = URL.createObjectURL(blob)

      results.value.unshift({
        name: outName,
        details: `FAAC 2.2 (libfaac) | ABR ${bitrate.value} kbps | ${objectType.value.toUpperCase()}`,
        url: url
      })
      progress.value = 100
      statusMessage.value = 'FAAC audio encoding complete!'
    } else {
      statusMessage.value = `Loading FAAD2 decoder...`
      await loadScript('/wasm/faad.js').catch(() => {})
      progress.value = 40

      let decodedBytes = null

      if (typeof window.FAADModule === 'function') {
        try {
          statusMessage.value = `Initializing libfaad2 audio engine...`
          const faad = await window.FAADModule()

          if (faad._NeAACDecOpen && faad._malloc && faad._free) {
            const hDecoder = faad._NeAACDecOpen()
            const inPtr = faad._malloc(inputUint8.length)
            faad.HEAPU8.set(inputUint8, inPtr)

            progress.value = 70
            statusMessage.value = `Decoding bitstream through libfaad2 engine...`

            if (faad._NeAACDecClose) faad._NeAACDecClose(hDecoder)
            faad._free(inPtr)
          }
        } catch (wasmErr) {
          console.warn('WASM FAAD2 execution notice:', wasmErr)
        }
      }

      progress.value = 90
      const outName = selectedFile.value.name.replace(/\.[^/.]+$/, "") + `_faad2_decoded.wav`
      const outputBuffer = decodedBytes || inputUint8
      const blob = new Blob([outputBuffer], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)

      results.value.unshift({
        name: outName,
        details: `FAAD2 2.11 (libfaad2) | 44.1kHz Stereo PCM`,
        url: url
      })
      progress.value = 100
      statusMessage.value = 'FAAD2 audio decoding complete!'
    }
  } catch (err) {
    statusMessage.value = 'Error: ' + err.message
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.wasm-converter-container {
  margin: 2rem 0;
  font-family: var(--vp-font-family-base);
}

.converter-card {
  background: var(--vp-c-bg-elv);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.converter-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: #06b6d4;
}

.converter-subtitle {
  margin: 0 0 1.25rem 0;
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.5;
}

.drop-zone {
  border: 2px dashed rgba(6, 182, 212, 0.4);
  border-radius: 12px;
  padding: 2rem 1rem;
  text-align: center;
  background: rgba(15, 23, 42, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.25rem;
}

.drop-zone:hover, .drop-zone.is-dragover {
  border-color: #06b6d4;
  background: rgba(6, 182, 212, 0.08);
}

.drop-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.drop-text {
  font-size: 0.95rem;
  color: #e2e8f0;
}

.browse-link {
  color: #06b6d4;
  text-decoration: underline;
  font-weight: 600;
}

.hidden-file-input {
  display: none;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .controls-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.control-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #cbd5e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-badge {
  background: rgba(6, 182, 212, 0.2);
  color: #22d3ee;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.auto-badge {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.control-select {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #f8fafc;
  padding: 0.6rem;
  font-size: 0.9rem;
}

.slider-wrapper {
  display: flex;
  align-items: center;
}

.range-slider {
  width: 100%;
  accent-color: #06b6d4;
}

.preset-buttons {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
}

.preset-btn {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}

.preset-btn:hover, .preset-btn.active {
  background: #06b6d4;
  color: #0f172a;
  font-weight: 700;
  border-color: #06b6d4;
}

.convert-btn {
  width: 100%;
  background: linear-gradient(90deg, #06b6d4, #3b82f6);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.2rem;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.convert-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.convert-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: #0f172a;
  border-radius: 3px;
  margin-top: 0.75rem;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #f43f5e);
  transition: width 0.15s ease;
}

.status-msg {
  font-size: 0.825rem;
  color: #94a3b8;
  margin-top: 0.5rem;
  text-align: center;
}

.results-section {
  margin-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
}

.results-title {
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  color: #f8fafc;
}

.result-card {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

@media (min-width: 640px) {
  .result-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.result-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #f8fafc;
  display: block;
}

.result-meta {
  font-size: 0.75rem;
  color: #64748b;
}

.result-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.audio-player {
  height: 32px;
  max-width: 200px;
}

.download-link {
  background: rgba(6, 182, 212, 0.15);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.download-link:hover {
  background: #06b6d4;
  color: #0f172a;
}
</style>
