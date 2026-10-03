/*
 * FAAC WebAssembly Worker
 * Copyright (C) 2026 Nils Schimmelmann
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

self.onmessage = async function(e) {
  const { pcm16Data, bitrate, objectType, sampleRate, channels, baseUrl } = e.data;

  self.postMessage({ type: 'progress', progress: 5, status: 'Initializing audio converter...' });

  try {
    if (!self.FAACModule) {
      const scriptUrl = baseUrl ? new URL('/wasm/faac.js', baseUrl).href : '/wasm/faac.js';
      importScripts(scriptUrl);
    }

    self.postMessage({ type: 'progress', progress: 15, status: 'Configuring audio encoder...' });
    const faac = await self.FAACModule();

    // Initialize faac_params struct
    const paramsPtr = faac._malloc(128);
    faac._faac_params_init(paramsPtr, 128);

    faac.setValue(paramsPtr + 4, sampleRate, 'i32');
    faac.setValue(paramsPtr + 8, channels, 'i32');

    // FAAC_OBJ_LOW = 1, FAAC_OBJ_HEAAC = 5
    const objTypeNum = (objectType === 'he-v1') ? 5 : 1;
    faac.setValue(paramsPtr + 16, objTypeNum, 'i32');

    const bitRatePerChan = Math.floor((bitrate * 1000) / (channels || 1));
    faac.setValue(paramsPtr + 28, bitRatePerChan, 'i32');

    // FAAC_STREAM_RAW = 0 (elementary stream for MP4 container)
    faac.setValue(paramsPtr + 40, 0, 'i32');
    // FAAC_INPUT_16BIT = 1
    faac.setValue(paramsPtr + 44, 1, 'i32');

    const hEncoderPtr = faac._malloc(4);
    if (faac._faac_encoder_open(paramsPtr, hEncoderPtr) !== 0) {
      throw new Error('faac_encoder_open failed');
    }
    const hEncoder = faac.getValue(hEncoderPtr, 'i32');

    // Query resolved encoder info
    const infoPtr = faac._malloc(128);
    faac.setValue(infoPtr, 128, 'i32');
    faac._faac_encoder_get_info(hEncoder, infoPtr);

    const frameSamples = faac.getValue(infoPtr + 4, 'i32') || 1024;
    const maxOutputBytes = faac.getValue(infoPtr + 8, 'i32') || 2048;
    const ascPtr = faac.getValue(infoPtr + 16, 'i32');
    const ascSize = faac.getValue(infoPtr + 20, 'i32');
    const encoderDelay = faac.getValue(infoPtr + 36, 'i32') || 1024;

    // Open MP4 container output
    const outPathPtr = faac._malloc(32);
    faac.stringToUTF8('/output.m4a', outPathPtr, 32);
    faac._mp4_open(outPathPtr, 1);

    faac._mp4_set_format(sampleRate, channels, 16);
    if (ascPtr && ascSize > 0) {
      faac._mp4_set_decoder_config(ascPtr, ascSize);
    }

    let versionStr = '2.x';
    if (faac._faac_get_library_info) {
      const libInfoPtr = faac._malloc(20);
      faac.setValue(libInfoPtr + 0, 20, 'i32');
      if (faac._faac_get_library_info(libInfoPtr) === 0) {
        const strPtr = faac.getValue(libInfoPtr + 8, 'i32');
        if (strPtr) {
          versionStr = faac.UTF8ToString(strPtr);
        }
      }
      faac._free(libInfoPtr);
    }

    const encNamePtr = faac._malloc(64);
    faac.stringToUTF8('FAAC ' + versionStr, encNamePtr, 64);
    faac._mp4_set_encoder(encNamePtr);

    const pcmInput = new Int16Array(pcm16Data);
    const totalPcmSamples = Math.floor(pcmInput.length / channels);

    const inBufPtr = faac._malloc(frameSamples * channels * 2);
    const outBufPtr = faac._malloc(maxOutputBytes);
    const bytesWrittenPtr = faac._malloc(4);

    let processedSamples = 0;
    self.postMessage({ type: 'progress', progress: 20, status: 'Encoding audio frames...' });

    while (processedSamples < totalPcmSamples) {
      const remainingSamples = totalPcmSamples - processedSamples;
      const currentSamples = Math.min(frameSamples, remainingSamples);
      const currentSamplesTotal = currentSamples * channels;

      const chunk = pcmInput.subarray(processedSamples * channels, (processedSamples + currentSamples) * channels);
      faac.HEAP16.set(chunk, inBufPtr / 2);

      faac._faac_encoder_encode(hEncoder, inBufPtr, currentSamplesTotal, outBufPtr, maxOutputBytes, bytesWrittenPtr);
      const written = faac.getValue(bytesWrittenPtr, 'i32');

      if (written > 0) {
        faac._mp4_write_frame(outBufPtr, written, frameSamples);
      }

      processedSamples += currentSamples;
      const pct = Math.min(95, Math.max(20, Math.floor((processedSamples / totalPcmSamples) * 100)));
      self.postMessage({ type: 'progress', progress: pct, status: 'Encoding M4A audio... (' + pct + '%)' });
    }

    // Flush remaining buffered frames
    let flushPass = 0;
    while (flushPass < 20) {
      faac._faac_encoder_encode(hEncoder, 0, 0, outBufPtr, maxOutputBytes, bytesWrittenPtr);
      const written = faac.getValue(bytesWrittenPtr, 'i32');
      if (written <= 0) break;
      faac._mp4_write_frame(outBufPtr, written, frameSamples);
      flushPass++;
    }

    // Set iTunes gapless metadata
    const paddingSamples = (frameSamples - (totalPcmSamples % frameSamples)) % frameSamples;
    faac._mp4_set_gapless(encoderDelay, paddingSamples, totalPcmSamples);

    faac._mp4_finish();
    faac._mp4_close();

    faac._free(inBufPtr);
    faac._free(outBufPtr);
    faac._free(bytesWrittenPtr);
    faac._free(infoPtr);
    faac._free(outPathPtr);
    faac._free(encNamePtr);
    faac._faac_encoder_close(hEncoderPtr);
    faac._free(paramsPtr);
    faac._free(hEncoderPtr);

    const encodedBytes = faac.FS.readFile('/output.m4a');
    try {
      faac.FS.unlink('/output.m4a');
    } catch (err) {}

    self.postMessage({ type: 'progress', progress: 98, status: 'Finalizing M4A audio stream...' });

    if (encodedBytes) {
      self.postMessage({ type: 'complete', encodedBytes: encodedBytes.buffer, version: versionStr }, [encodedBytes.buffer]);
    } else {
      self.postMessage({ type: 'error', message: 'FAAC encoding produced no output bytes.' });
    }
  } catch (err) {
    let msg = err.message || 'Conversion failed';
    if (msg.includes('importScripts') || msg.includes('failed to load') || msg.includes('script')) {
      msg = 'Audio converter module (/wasm/faac.js) not found. Build local static assets or run "docker compose up".';
    }
    self.postMessage({ type: 'error', message: msg });
  }
};
