---
layout: home
hero:
  name: "Freeware Advanced Audio"
  text: "Fast, compact AAC encoding and decoding in C"
  tagline: "FAAC encoding and FAAD decoding for embedded devices, media applications, and listeners who want to hear the difference."
  image:
    alt: "Freeware Advanced Audio visualizer"
  actions:
    - theme: brand
      text: "Get Started"
      link: "/docs/install"
    - theme: alt
      text: "Try Your Own Music"
      link: "/playground"
    - theme: alt
      text: "Choose an Implementation"
      link: "/docs/comparison"
features:
  - icon: "<i class=\"fa-solid fa-bolt feature-icon feature-icon--cyan\" aria-hidden=\"true\"></i>"
    title: "Fast encoding"
    details: "Faster aggregate encoding than the compared FDK-AAC, Apple AAC, and FFmpeg AAC builds in published testing."
    link: "/docs/optimization"
    linkText: "Compare encoding speed"
  - icon: "<i class=\"fa-solid fa-microchip feature-icon feature-icon--blue\" aria-hidden=\"true\"></i>"
    title: "Small encoder footprint"
    details: "Lower measured code footprint and peak RAM than the compared encoders. Built for applications with limited resources."
    link: "/docs/optimization"
    linkText: "Compare code and memory"
  - icon: "<i class=\"fa-solid fa-headphones feature-icon feature-icon--violet\" aria-hidden=\"true\"></i>"
    title: "Competitive audio quality"
    details: "Leading aggregate objective quality scores in published testing. Fine-tuned across speech, music, and difficult passages."
    link: "/docs/optimization"
    linkText: "See quality results"
  - icon: "<i class=\"fa-solid fa-code feature-icon feature-icon--cyan\" aria-hidden=\"true\"></i>"
    title: "Open development"
    details: "Source code, CLI guides, and C APIs for AAC encoding and decoding. Check the license and release status for the library you plan to use."
    link: "/docs/install"
    linkText: "Choose your library"
---

<div class="home-technical-wrapper vp-doc">

## More audio. Less overhead. {data-icon="gauge-high"}

### FAAC: fast encoding in a small footprint

<BenchmarkShowcase view="resources" />

### FAAD3: fast decoding in a small footprint

<BenchmarkShowcase view="decoder" />

FAAD3 targets modern processors with floating-point units and is a development engine. It ties the top overall MOS, leads the measured decoder throughput and stereo fidelity, and keeps peak RAM to 3.0 MB. Helix uses fixed-point arithmetic and a smaller ROM image than FAAD3, making it an option for legacy hardware without an efficient FPU; it lacks HE-AAC v2 Parametric Stereo support.

**Benchmark snapshot · October 28, 2026 · MacBook Pro M1, 32 GB.** Encoder and decoder figures come from the same generated leaderboard. Results depend on the tested builds and hardware. See the [benchmark results and tested versions](/docs/optimization).

## Hear FAAC with your own music {data-icon="headphones"}

Try FAAC with familiar tracks and choose the settings that work for you. The browser converter needs no installation or uploads.

[Drop your own music into the converter](/playground), choose a bitrate, and listen. For a closer comparison, the [listening guide](/docs/listening) walks through a controlled test. Your feedback helps us understand what works well and what still needs attention.

For measured quality results, see the [AAC benchmark results](/docs/optimization). Objective scores complement listening, and results depend on the tested builds and hardware.

## Choose your starting point {data-icon="compass"}

| What you want to do | Start here |
| :--- | :--- |
| Encode music, speech, or streaming audio | [Install FAAC](/docs/install), then try the [CLI and C API](/docs/faac) |
| Play or decode existing AAC files | [FAAD decoder guide](/docs/faad) and [libfaad API reference](/docs/libfaad) |
| Mux, demux, or tag MP4/M4A files | [FAAM guide](/docs/faam), [libfaam C API](/docs/libfaam), and [faam(1)](/docs/faam-cli) |
| Convert audio sample rates | [FAAR guide](/docs/faar), [libfaar C API](/docs/libfaar), and [faar(1)](/docs/faar-cli) |
| Choose an encoder or decoder for your application | [Implementation selection guide](/docs/comparison), including hardware, profiles, and licensing |
| Compare speed, footprint, and objective quality | [AAC benchmark results](/docs/optimization) |
| Hear FAAC with your own music | [Browser converter](/playground), with an optional [listening guide](/docs/listening) |

## Where FAAC and FAAD are used {data-icon="layer-group"}

From camera firmware to desktop audio tools, these projects integrate FAAC or FAAD:

| Project | Integration |
| :--- | :--- |
| [Thingino](https://github.com/themactep/thingino-firmware/blob/stable/package/faac/faac.mk) | Packages FAAC for open-source firmware for Ingenic IP cameras. |
| GStreamer | Provides [FAAC encoding](https://gstreamer.freedesktop.org/documentation/faac/index.html) and [FAAD decoding](https://gstreamer.freedesktop.org/documentation/faad/index.html) elements for multimedia pipelines. |
| [VLC Media Player](https://github.com/videolan/vlc/blob/master/modules/codec/faad.c) | Includes a FAAD AAC decoder integration. |
| [fre:ac](https://github.com/enzo1982/freac/blob/master/Readme) | Uses FAAC and FAAD for AAC conversion in its audio converter and CD ripper. |

Available libraries and features depend on each project's version and build. Report reproducible library problems in [FAAC and FAAD issues](https://github.com/FreewareAdvancedAudio/faac/issues), including your library version and settings.

## Quick questions {data-icon="circle-question"}

### How do I install the libraries and tools?

Use a package manager or build from source. The [installation guide](/docs/install) explains the options and why package versions matter.

### Which software license do FAAC and FAAD use?

FAAC is the encoder; FAAD is the decoder. Both libraries use LGPL v2.1+. See the [version comparison](/docs/comparison#software-licenses-and-patent-rights) for legacy release details.

### Do AAC patents affect my use?

Patent considerations depend on the AAC profile and jurisdiction. See [patent status by profile](/docs/comparison#patent-status-by-aac-profile).

### How can I help improve quality?

Share the exact encoder version, settings, source sample you have permission to distribute, and what you hear. Our [listening guide](/docs/listening) explains how to make a useful comparison and report.

</div>
