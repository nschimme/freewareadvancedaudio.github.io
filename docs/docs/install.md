---
title: Installation Guide — FAAC & FAAD
description: Install the current FAAC AAC encoder and FAAD decoder from source or use available operating-system packages.
---

# Installation Guide

Install **FAAC** (encoder) and **FAAD** (decoder). Current source builds provide both libraries and command-line tools from the same repository.

---

## Check the version before integrating {data-icon="circle-info"}

Operating-system package names and versions vary. Some repositories still package the legacy FAAD2 decoder under names such as `faad2`; those packages do not provide the current FAAD API. Build from source for the current `<faad.h>` interface. See the [version comparison](/docs/comparison#choose-a-decoder-for-your-hardware) for details.

## macOS (Homebrew) {data-icon="laptop"}

Install using Homebrew on macOS:

```bash
# Install FAAC AAC Encoder
brew install faac

# Install the decoder package available in Homebrew (check its version)
brew install faad2
```

---

## Linux Package Managers {data-icon="box-open"}

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

## Build current FAAC and FAAD from source {data-icon="code"}

Current combined source for FAAC and FAAD:
- **FAAC and FAAD Source**: [github.com/nschimme/faac/tree/faad-upstream](https://github.com/nschimme/faac/tree/faad-upstream)

### Building FAAC and FAAD (Meson / Ninja)

```bash
git clone --branch faad-upstream --single-branch https://github.com/nschimme/faac.git
cd faac

meson setup build -Dencoder=true -Ddecoder=true
meson compile -C build
sudo meson install -C build
```

Use `-Dencoder=false` or `-Ddecoder=false` to build only one library. See the [FAAC](/docs/faac), [FAAD](/docs/faad), [`libfaac`](/docs/libfaac), and [`libfaad`](/docs/libfaad) guides for capabilities and API details.
