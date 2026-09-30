# FAAC vs Competitor Encoders

| Feature / Metric | FAAC 2.0+ | Fraunhofer FDK-AAC | FFmpeg Native AAC | Apple AAC (afconvert / QAAC) |
| :--- | :--- | :--- | :--- | :--- |
| **Software License** | **LGPL v2.1+** (Free & Open Source) | Non-Free / Custom Copyleft | **LGPL v2.1+** / GPL | Proprietary (macOS / Windows DLLs) |
| **Redistributable** | ✅ Yes | ❌ Restrictions apply | ✅ Yes | ❌ Requires Apple runtime |
| **Speed / Throughput** | 🚀 Extremely Fast (3-5x headroom) | Moderate | Fast | Fast |
| **SBR / HE-AAC v1** | ✅ Supported | ✅ Supported | ❌ Limited | ✅ Supported |
| **Clean ISO-Free Code** | ✅ Yes (Rewritten) | ❌ ISO Reference derivative | ✅ Native implementation | Proprietary |

---

## Strategic Advantages of FAAC

1. **True LGPL Compliance**: Unlike FDK-AAC (which suffers from non-free patent licensing constraints that prohibit bundling in GPL binaries like FFmpeg by default), FAAC is 100% LGPL v2.1+ compliant.
2. **Speed & Efficiency**: Designed for high-speed batch conversion, edge devices, and embedded WebAssembly environments.
3. **Standalone Library**: `libfaac` provides a lightweight, focused library without requiring massive multimedia framework dependencies.
