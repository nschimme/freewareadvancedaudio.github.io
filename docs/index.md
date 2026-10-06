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
    title: "Small footprint"
    details: "Lower measured code footprint and peak RAM than the compared encoders and decoders. Built for applications with limited resources."
    link: "/docs/tested-versions"
    linkText: "Compare code and memory"
  - icon: "<i class=\"fa-solid fa-headphones feature-icon feature-icon--violet\" aria-hidden=\"true\"></i>"
    title: "Competitive audio quality"
    details: "Tuned across speech, music, and difficult passages, FAAC leads published quality scores; FAAD scores highly in decoding."
    link: "/docs/optimization#how-audio-quality-is-tuned"
    linkText: "How quality is tuned"
  - icon: "<i class=\"fa-solid fa-scale-balanced feature-icon feature-icon--cyan\" aria-hidden=\"true\"></i>"
    title: "Open source, LGPL licensed"
    details: "Use FAAC or FAAD in a closed-source app while meeting LGPL v2.1+ requirements."
    link: "/docs/comparison#software-licenses-and-patent-rights"
    linkText: "Review licensing"
---

<div class="home-technical-wrapper vp-doc">

## More audio. Less overhead. {data-icon="gauge-high"}

### FAAC: fast encoding in a small footprint

<BenchmarkShowcase view="resources" />

### FAAD: faster decoding for efficient playback

<BenchmarkShowcase view="decoder" />

In the published comparison, FAAD3 decodes nearly **2× as fast** as FAAD2 with **45% less code**, leaving more processing headroom for the rest of an app.

**Encoder snapshot · September 29, 2026 · MacBook Pro M1, 32 GB.** Decoder figures come from a separate leaderboard. Results depend on the tested builds and hardware. See the [tested versions and measurements](/docs/tested-versions) and [full decoder comparison](/docs/comparison#faad3-and-faad2-benchmark-comparison).

## Hear FAAC with your own music {data-icon="headphones"}

FAAC provides efficient AAC encoding for music collections, media applications, and embedded devices. Try familiar tracks and choose the settings that work for you.

[Drop your own music into the converter](/playground), choose a bitrate, and listen to the result. No installation or uploads required. If you want to compare more closely, our [listening guide](/docs/listening) walks through a controlled test. Your feedback helps us understand what works well and what still needs attention.

See the [AAC benchmark results](/docs/optimization) for measured quality, speed, and footprint. Comparative results depend on the tested builds and hardware; objective scores complement listening.

## Choose your starting point {data-icon="compass"}

| What you want to do | Start here |
| :--- | :--- |
| Encode music, speech, or streaming audio | [Install FAAC](/docs/install), then try the [CLI and C API](/docs/faac) |
| Play or decode existing AAC files | [FAAD decoder guide](/docs/faad) and [libfaad API reference](/docs/libfaad) |
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

Available libraries and features depend on each project's version and build. Report reproducible library problems in [FAAC and FAAD issues](https://github.com/nschimme/faac/issues), including your library version and settings.

## Quick questions {data-icon="circle-question"}

### How do I install the libraries and tools?

Use a package manager or build from source. The [installation guide](/docs/install) explains the options and why package versions matter.

### Which library and license do I need?

FAAC is the encoder; FAAD is the decoder. Both libraries use LGPL v2.1+. See the [version comparison](/docs/comparison#software-licenses-and-patent-rights) for legacy release details. Software licensing and codec patent rights are separate questions.

The foundational AAC-LC and HE-AAC v1 patents have expired. HE-AAC v2 adds Parametric Stereo patents expiring in 2029. See [patent status by profile](/docs/comparison#patent-status-by-aac-profile) for the distinctions and jurisdiction considerations.

### How can I help improve quality?

Share the exact encoder version, settings, source sample you have permission to distribute, and what you hear. Our [listening guide](/docs/listening) explains how to make a useful comparison and report.

</div>
