# FAAC C API Reference (`libfaac`)

The `libfaac` library provides a lightweight C API for integrating AAC encoding into C/C++ applications.

---

## Basic Encoding Workflow

1. Initialize parameters using `faac_params_init()`.
2. Open encoder instance using `faac_encoder_open()`.
3. Query encoder info (`faac_encoder_get_info()`) to get frame sample size and buffer allocation requirements.
4. Retrieve ASC header (`faac_encoder_asc()`) if muxing into MP4 containers.
5. Feed PCM audio frames into `faac_encoder_encode()`.
6. Flush remaining frames and close using `faac_encoder_close()`.

---

## C Code Example

```c
#include <stdio.h>
#include <stdlib.h>
#include <faac.h>

int main(void) {
    faac_params params;
    faac_params_init(&params, sizeof(params));

    params.sample_rate = 44100;
    params.num_channels = 2;
    params.mpeg_version = FAAC_MPEG4;
    params.object_type = FAAC_OBJECT_LC;
    params.bit_rate = (128 * 1000) / params.num_channels; // 128 kbps total
    params.output_format = FAAC_STREAM_RAW;
    params.input_format = FAAC_INPUT_FLOAT;

    faac_encoder *hEncoder = NULL;
    if (faac_encoder_open(&params, &hEncoder) != FAAC_OK) {
        fprintf(stderr, "Failed to open FAAC encoder\n");
        return 1;
    }

    faac_encoder_info info = { .struct_size = sizeof(info) };
    faac_encoder_get_info(hEncoder, &info);

    printf("Frame samples: %u, Max output bytes: %u\n",
           info.frame_samples, info.max_output_bytes);

    // Clean up
    faac_encoder_close(&hEncoder);
    return 0;
}
```
