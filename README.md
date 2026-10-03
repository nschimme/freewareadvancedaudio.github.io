# Freeware Advanced Audio Organization (FAAC & FAAD)

Official website and technical documentation platform for **FAAC** (LGPL v2.1+ AAC Encoder) and **FAAD** (GPL v2+ / LGPL v2.1+ AAC Decoder), built with VitePress.

---

## Highlights & Features

- **FAAC (Encoder)**: Cleanroom LGPL v2.1+ C11/C99 rewrite free of ISO reference code. Supports AAC-LC and HE-AAC v1 with `-b` Average Bitrate (ABR) rate control.
- **FAAD (Decoder)**: Standalone decoder for MPEG-2/4 AAC, HE-AAC v1/v2, and up to 7.1 surround audio streams (FAAD2 GPL v2+ / FAAD3 LGPL v2.1+).
- **Interactive Audio Playground**: Live in-browser audio encoding and decoding powered by C cross-compiled WebAssembly engines (Emscripten/Meson/CMake).
- **Technical Documentation & Benchmarks**: Visual codec benchmarks, CLI usage guides, C API references, and patent expiration timelines.
- **PagesCMS & Decap Integration**: Native `.pages.yml` configuration for content management and blog updates.

---

## Repository Structure

```
├── .github/workflows/deploy.yml # GitHub Actions workflow for Docker site build & GH Pages deployment
├── .gitignore                   # Ignore rules for build output, WASM binaries & generated CLI docs
├── .gitmodules                  # Git submodule configuration for vendor/faac & vendor/faad2
├── .pages.yml                   # PagesCMS schema configuration
├── Dockerfile                   # Multi-stage build compiling FAAC & FAAD C libraries to WASM + VitePress site
├── docker-compose.yml           # Docker Compose setup
├── scripts/                     # Utility scripts (generate-cli-docs.js)
├── vendor/                      # Submodules for upstream FAAC and FAAD2 repositories
└── docs/                        # VitePress documentation root
    ├── .vitepress/              # VitePress configuration, theme, and components
    │   ├── components/          # AudioVisualizer.vue & WasmConverter.vue
    │   ├── theme/               # Dark theme customizations & custom CSS
    │   └── config.ts            # VitePress navigation, sidebar, and metadata
    ├── blog/                    # Announcement blog posts
    ├── docs/                    # Technical guides (install.md, faac.md, faad.md, comparison.md)
    ├── index.md                 # Homepage with niche highlights & quick Q&A
    └── playground.md            # Interactive converter playground
```

---

## Recommended Local Development (Docker)

To compile `libfaac` and `libfaad2` C sources into WebAssembly modules using Emscripten and run the full VitePress site locally:

```bash
# Clone repository with submodules
git clone --recursive https://github.com/FreewareAdvancedAudio/freewareadvancedaudio.github.io.git
cd freewareadvancedaudio.github.io

# Build WASM modules and start local development server in Docker
docker compose up --build
```

Access the development server at `http://localhost:5173` (or `http://localhost:8080`).

---

## Node-Only Development (Docs & Content Editing)

If you are only editing documentation, blog posts, or site layout without modifying C code or compiling WebAssembly:

```bash
# Update submodules if needed
git submodule update --init --recursive

# Install Node dependencies
npm install

# Start VitePress local dev server (automatically generates CLI docs from manpages)
npm run docs:dev

# Build static production site
npm run docs:build
```

*Note: WebAssembly build artifacts (`docs/public/wasm/`) are compiled inside Docker and published automatically via GitHub Actions without committing generated binaries to Git.*
