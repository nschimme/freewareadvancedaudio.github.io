---
title: Installation Guide — FAAC & FAAD
description: Complete installation guide for FAAC (AAC Encoder) and FAAD (AAC Decoder) across macOS Homebrew, Linux package managers, and building from source via Meson, CMake, or Autotools.
---

# Installation Guide

Install **FAAC** (Encoder) and **FAAD** (Decoder) via macOS Homebrew, Linux package managers, or build directly from source.

---

## macOS (Homebrew)

Install official Homebrew formulas on macOS:

```bash
# Install FAAC AAC Encoder
brew install faac

# Install FAAD AAC Decoder
brew install faad2
```

---

## Linux Package Managers

Install pre-compiled packages via your system package manager:

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

## Building from Source

Source code repositories and official release archives:
- **FAAC Repository & Releases**: [github.com/FreewareAdvancedAudio/faac](https://github.com/FreewareAdvancedAudio/faac)
- **FAAD Repository & Releases**: [github.com/FreewareAdvancedAudio/faad2](https://github.com/FreewareAdvancedAudio/faad2)

### Building FAAC (Meson / Ninja)

```bash
git clone --recursive https://github.com/FreewareAdvancedAudio/faac.git
cd faac

meson setup build
ninja -C build
sudo ninja -C build install
```

### Building FAAD (CMake / Make)

```bash
git clone --recursive https://github.com/FreewareAdvancedAudio/faad2.git
cd faad2

mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
sudo make install
```
