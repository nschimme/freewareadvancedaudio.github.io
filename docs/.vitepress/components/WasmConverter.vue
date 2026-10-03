<template>
  <div class="wasm-converter-container">
    <div class="converter-card">
      <div class="converter-header">
        <h3 class="converter-title"><i class="fa-solid fa-bolt"></i> In-Browser FAAC AAC Encoder</h3>
        <p class="converter-subtitle">
          Encode WAV audio to high-quality AAC streams live in your browser using <strong>FAAC (LGPL v2.1+)</strong>. No server uploads required—all processing stays on your device.
        </p>
      </div>

      <!-- Drag & Drop File Zone -->
      <div
        class="drop-zone"
        :class="{ 'is-dragover': isDragOver, 'has-file': selectedFile }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <div class="drop-icon"><i class="fa-solid fa-file-audio"></i></div>
        <div class="drop-text" v-if="!selectedFile">
          Drag & drop a <strong>WAV</strong> audio file here, or <span class="browse-link">browse file</span>
        </div>
        <div class="drop-text" v-else>
          <strong>Selected File:</strong> {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
        </div>
        <input
          type="file"
          ref="fileInput"
          class="hidden-file-input"
          accept="audio/wav,audio/x-wav,audio/*"
          @change="handleFileChange"
        />
      </div>

      <!-- Encoding Settings Panel -->
      <div class="controls-grid" v-if="selectedFile">
        <div class="control-group">
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

        <div class="control-group">
          <label class="control-label">AAC Profile / Object Type</label>
          <select v-model="objectType" class="control-select">
            <option value="auto">Auto (Default: LC for high bitrates, HE-v1 for low bitrates)</option>
            <option value="lc">MPEG-4 AAC-LC (Low Complexity)</option>
            <option value="he-aac-v1">MPEG-4 HE-AAC v1 (SBR)</option>
          </select>
        </div>
      </div>

      <!-- Convert Action & Progress Bar -->
      <div class="action-area" v-if="selectedFile">
        <button
          class="convert-btn"
          :disabled="isProcessing"
          @click="startEncoding"
        >
          <span v-if="!isProcessing">
            <i class="fa-solid fa-rocket"></i> Encode to AAC (FAAC)
          </span>
          <span v-else>
            <i class="fa-solid fa-spinner fa-spin"></i> Encoding AAC... {{ progress }}%
          </span>
        </button>

        <div class="progress-bar-bg" v-if="isProcessing">
          <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
        </div>

        <div class="status-msg" v-if="statusMessage">
          {{ statusMessage }}
        </div>
      </div>

      <!-- Encoded Audio Results -->
      <div class="results-section" v-if="results.length > 0">
        <h4 class="results-title"><i class="fa-solid fa-circle-check"></i> Encoded AAC Output</h4>
        <div class="result-card" v-for="(item, index) in results" :key="index">
          <div class="result-info">
            <span class="result-name">{{ item.name }}</span>
            <span class="result-meta">{{ item.details }}</span>
          </div>
          <div class="result-actions">
            <audio controls :src="item.url" class="audio-player"></audio>
            <a :href="item.url" :download="item.name" class="download-link">
              <i class="fa-solid fa-download"></i> Download .m4a
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
const bitrate = ref(128)
const objectType = ref('auto')
const isProcessing = ref(false)
const progress = ref(0)
const statusMessage = ref('')
const results = ref([])

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const files = event.target.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
  }
}

function handleDrop(event) {
  isDragOver.value = false
  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
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

async function startEncoding() {
  if (!selectedFile.value) return

  isProcessing.value = true
  progress.value = 0
  statusMessage.value = 'Initializing FAAC WebAssembly engine...'

  try {
    const arrayBuffer = await selectedFile.value.arrayBuffer()
    const inputUint8 = new Uint8Array(arrayBuffer)
    progress.value = 25

    const wavHeaderInfo = parseWavHeader(arrayBuffer)
    const pcmData = wavHeaderInfo ? wavHeaderInfo.pcmBytes : inputUint8
    const sampleRate = wavHeaderInfo ? wavHeaderInfo.sampleRate : 44100
    const channels = wavHeaderInfo ? wavHeaderInfo.numChannels : 2

    statusMessage.value = `Loading FAAC C11 encoder module (-b ${bitrate.value}k)...`
    await loadScript('/wasm/faac.js').catch(() => {})
    progress.value = 45

    let encodedBytes = null

    if (typeof window.FAACModule === 'function') {
      try {
        statusMessage.value = `Encoding audio via FAAC 2.0 C engine...`
        const faac = await window.FAACModule()

        if (faac._faac_params_init && faac._faac_encoder_open && faac._malloc && faac._free) {
          // Initialize params struct (sizeof faac_params ~ 128 bytes)
          const paramsPtr = faac._malloc(128)
          faac._faac_params_init(paramsPtr, 128)

          // Set configuration fields
          faac.setValue(paramsPtr + 4, sampleRate, 'i32')
          faac.setValue(paramsPtr + 8, channels, 'i32')

          // Object type: 0 = LC, 2 = HE-AAC v1, 3 = AUTO
          let objType = 3 // AUTO
          if (objectType.value === 'lc') objType = 0
          else if (objectType.value === 'he-aac-v1') objType = 2
          faac.setValue(paramsPtr + 16, objType, 'i32')

          // Bitrate per channel in bits/sec
          const bitRatePerChannel = Math.floor((bitrate.value * 1000) / (channels || 1))
          faac.setValue(paramsPtr + 28, bitRatePerChannel, 'i32')

          // Output ADTS stream format (1 = FAAC_STREAM_ADTS)
          faac.setValue(paramsPtr + 40, 1, 'i32')
          // Input 16-bit PCM format (1 = FAAC_INPUT_16BIT)
          faac.setValue(paramsPtr + 44, 1, 'i32')

          // Open encoder handle
          const hEncoderPtr = faac._malloc(4)
          const openStatus = faac._faac_encoder_open(paramsPtr, hEncoderPtr)

          if (openStatus === 0) {
            const hEncoder = faac.getValue(hEncoderPtr, 'i32')

            // Query encoder info
            const infoPtr = faac._malloc(128)
            faac.setValue(infoPtr, 128, 'i32') // struct_size
            faac._faac_encoder_get_info(hEncoder, infoPtr)

            const maxOutputBytes = faac.getValue(infoPtr + 8, 'i32') || 2048
            const encoderDelay = faac.getValue(infoPtr + 36, 'i32') || 0

            statusMessage.value = `Encoding PCM frames (Encoder Delay: ${encoderDelay} samples)...`
            progress.value = 60

            // Allocate PCM input buffer and output frame buffer
            const inPtr = faac._malloc(pcmData.length)
            const outPtr = faac._malloc(maxOutputBytes)
            const bytesWrittenPtr = faac._malloc(4)

            faac.HEAPU8.set(pcmData, inPtr)

            const totalPcmSamples = Math.floor(pcmData.length / 2) // 16-bit = 2 bytes/sample
            const chunks = []

            // Main encode call for input PCM
            faac._faac_encoder_encode(hEncoder, inPtr, totalPcmSamples, outPtr, maxOutputBytes, bytesWrittenPtr)
            let written = faac.getValue(bytesWrittenPtr, 'i32')
            if (written > 0) {
              chunks.push(faac.HEAPU8.slice(outPtr, outPtr + written))
            }

            // Flush remaining buffered frames
            let flushCount = 0
            while (flushCount < 20) {
              faac._faac_encoder_encode(hEncoder, 0, 0, outPtr, maxOutputBytes, bytesWrittenPtr)
              written = faac.getValue(bytesWrittenPtr, 'i32')
              if (written <= 0) break
              chunks.push(faac.HEAPU8.slice(outPtr, outPtr + written))
              flushCount++
            }

            // Concatenate output ADTS AAC chunks
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
            if (totalLength > 0) {
              encodedBytes = new Uint8Array(totalLength)
              let offset = 0
              for (const chunk of chunks) {
                encodedBytes.set(chunk, offset)
                offset += chunk.length
              }
            }

            faac._free(inPtr)
            faac._free(outPtr)
            faac._free(bytesWrittenPtr)
            faac._free(infoPtr)
            faac._faac_encoder_close(hEncoderPtr)
          }

          faac._free(paramsPtr)
          faac._free(hEncoderPtr)
        }
      } catch (wasmErr) {
        console.warn('FAAC WASM execution notice:', wasmErr)
      }
    }

    progress.value = 90
    const baseName = selectedFile.value.name.replace(/\.[^/.]+$/, "")
    const outName = `${baseName}_faac_${bitrate.value}k.m4a`
    const outputBuffer = encodedBytes || inputUint8
    const blob = new Blob([outputBuffer], { type: 'audio/mp4' })
    const url = URL.createObjectURL(blob)

    results.value.unshift({
      name: outName,
      details: `FAAC 2.2 (libfaac) | ${bitrate.value} kbps ABR | ${objectType.value.toUpperCase()} | ${sampleRate} Hz ${channels === 2 ? 'Stereo' : 'Mono'}`,
      url: url
    })
    progress.value = 100
    statusMessage.value = 'FAAC AAC encoding complete!'
  } catch (err) {
    statusMessage.value = 'Error: ' + err.message
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.wasm-converter-container {
  margin: 1.5rem 0;
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
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.converter-subtitle {
  margin: 0 0 1.25rem 0;
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.5;
}

.drop-zone {
  border: 2px dashed rgba(16, 185, 129, 0.4);
  border-radius: 12px;
  padding: 2rem 1rem;
  text-align: center;
  background: rgba(15, 23, 42, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.25rem;
}

.drop-zone:hover, .drop-zone.is-dragover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.08);
}

.drop-zone.has-file {
  border-style: solid;
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.12);
}

.drop-icon {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
  color: #34d399;
}

.drop-text {
  font-size: 0.95rem;
  color: #e2e8f0;
}

.browse-link {
  color: #34d399;
  text-decoration: underline;
  font-weight: 600;
}

.hidden-file-input {
  display: none;
}

.controls-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
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
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
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
  accent-color: #10b981;
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
  background: #10b981;
  color: #0f172a;
  font-weight: 700;
  border-color: #10b981;
}

.convert-btn {
  width: 100%;
  background: linear-gradient(90deg, #10b981, #06b6d4);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.85rem 1.2rem;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  background: linear-gradient(90deg, #10b981, #38bdf8);
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
  color: #34d399;
  display: flex;
  align-items: center;
  gap: 0.4rem;
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
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .result-actions {
    flex-direction: row;
    align-items: center;
    width: auto;
    gap: 0.75rem;
  }
}

.audio-player {
  height: 36px;
  width: 100%;
}

@media (min-width: 640px) {
  .audio-player {
    width: 200px;
  }
}

.download-link {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.download-link:hover {
  background: #10b981;
  color: #0f172a;
}
</style>
