---
title: Installation Guide — FAAC & FAAD
description: Install the current FAAC AAC encoder and FAAD decoder from source or use available operating-system packages.
---

# Installation Guide

Get **FAAC** for AAC encoding and **FAAD** for AAC decoding. Choose a platform below or build from source.

## Windows {data-icon="windows"}

Download the Windows release packages for FAAC and FAAD from the [releases page](https://github.com/FreewareAdvancedAudio/faac/releases).

## macOS (Homebrew) {data-icon="apple"}

Install using Homebrew on macOS:

```bash
# Install FAAC AAC Encoder
brew install faac

# Install the decoder package available in Homebrew (check its version)
brew install faad2
```

---

## Linux Package Managers {data-icon="linux"}

Where available in your configured repositories, install using your system package manager:

### Debian / Ubuntu
```bash
sudo apt update
sudo apt install faac faad
```

### Fedora / RHEL
```bash
sudo dnf install faac faad2
```

### Arch Linux
```bash
sudo pacman -S faac faad2
```

---

## Build the current libraries and tools from source {data-icon="code"}

For developers who need to build the current libraries and command-line tools, use the source repository. Some operating-system packages still provide the legacy FAAD2 decoder rather than the current FAAD API; see the [version comparison](/docs/comparison#choose-a-decoder-for-your-hardware) for details.

Current combined source for FAAC, FAAD, FAAM and FAAR:
- **FAAC, FAAD, FAAM and FAAR Source**: [github.com/FreewareAdvancedAudio/faac](https://github.com/FreewareAdvancedAudio/faac)

### Building the libraries and tools (Meson / Ninja)

```bash
git clone https://github.com/FreewareAdvancedAudio/faac.git
cd faac

meson setup build -Dencoder=true -Ddecoder=true
meson compile -C build
sudo meson install -C build
```

Use `-Dencoder=false` or `-Ddecoder=false` to leave out the encoder or decoder. `libfaam` and `libfaar` are always built; `-Dfrontend=false` omits the command-line tools.

### Documentation

| Library or tool | Guide | CLI manual |
| :--- | :--- | :--- |
| FAAC AAC encoder | [FAAC guide](/docs/faac), [libfaac C API](/docs/libfaac) | [faac(1)](/docs/faac-cli) |
| FAAD AAC decoder | [FAAD guide](/docs/faad), [libfaad C API](/docs/libfaad) | [faad(1)](/docs/faad-cli) |
| FAAM MP4 muxer/demuxer | [FAAM guide](/docs/faam), [libfaam C API](/docs/libfaam) | [faam(1)](/docs/faam-cli) |
| FAAR sample rate converter | [FAAR guide](/docs/faar), [libfaar C API](/docs/libfaar) | [faar(1)](/docs/faar-cli) |
