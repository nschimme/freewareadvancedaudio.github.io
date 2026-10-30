---
title: "AAC on ESP32: Real-Time Encoding and Decoding"
description: "FAAC and FAAD bring real-time AAC encoding and decoding to ESP32, ESP32-S3, and ESP32-C6 microcontrollers."
---

# AAC on ESP32: Real-Time Encoding and Decoding

*Published: October 2026*

FAAC and FAAD are known for fast AAC encoding and decoding on desktop-class hardware. The more interesting result is what happens when the hardware gets much smaller.

## The desktop was never the hard part

The [AAC benchmark results](/docs/optimization) show the libraries at full speed on a modern laptop. That is expected. The question is whether the same code can finish a real stream on a microcontroller.

## 240 MHz is enough

On an ESP32-S3, it is. FAAC encodes stereo AAC-LC at up to about 10× real time. FAAD decodes HE-AAC at about 5× real time, using roughly a fifth of one core. Both fit in under 100 KB of flash.

No bespoke port. The same libraries, cross-compiled for the chip.

## No PSRAM, no problem

The original ESP32 has roughly a quarter megabyte of free internal RAM and no PSRAM. It still runs the full decode path in real time, and it encodes AAC-LC stereo in real time.

On boards that do have PSRAM, the decoder state can move there to free internal RAM. AAC-LC keeps full speed; HE-AAC gives up about a tenth.

## Three chips, one dividing line

The ESP32-S3 and the classic ESP32 both run ahead of real time. The ESP32-C6 has no FPU, and FAAD's floating-point path falls behind real time there. Fixed-point decoders still carry the load.

## The honest part

Not every combination fits everywhere. The FPU-less ESP32-C6 and ESP8266 should use Helix; FAAD's floating-point path runs correctly on the C6, but not in real time. The classic ESP32 cannot fit HE-AAC v1 encoding. FAAC can now encode HE-AAC v2 in a Parametric Stereo build, though that path has not been measured on ESP32, and the measured FAAD3 build is still a work in progress.

The point is not that one decoder wins on every chip. The point is that the family covers the range.

## Read the story

The [AAC on ESP32 page](/docs/esp32-aac) walks through the encoding and decoding results, the HE-AAC v2 stereo case, and the limits. For exact builds and numbers, see the [full benchmark notes](https://gist.github.com/nschimme/cfa0a3d225c8c001eb7d998739b7298a). To choose a decoder for your target, use the [implementation comparison](/docs/comparison).
