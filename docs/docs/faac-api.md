# FAAC C API (`libfaac`)

Include header: `#include <faac.h>`

---

## API Workflow

1. Initialize params: `faac_params_init(&params, sizeof(params))`
2. Open encoder: `faac_encoder_open(&params, &hEncoder)`
3. Read encoder metadata: `faac_encoder_get_info(hEncoder, &info)`
4. Retrieve ASC header: `faac_encoder_asc(hEncoder, &asc, &asc_len)`
5. Encode PCM frames: `faac_encoder_encode(hEncoder, pcm, samples, bitbuf, max_bytes, &written)`
6. Flush & close: `faac_encoder_close(&hEncoder)`

---

## Minimal Example

```c
#include <stdio.h>
#include <faac.h>

int main(void) {
    faac_params params;
    faac_params_init(&params, sizeof(params));

    params.sample_rate = 44100;
    params.num_channels = 2;
    params.mpeg_version = FAAC_MPEG4;
    params.object_type = FAAC_OBJECT_LC;
    params.bit_rate = (128 * 1000) / params.num_channels;
    params.output_format = FAAC_STREAM_RAW;
    params.input_format = FAAC_INPUT_FLOAT;

    faac_encoder *hEncoder = NULL;
    if (faac_encoder_open(&params, &hEncoder) != FAAC_OK) return 1;

    faac_encoder_info info = { .struct_size = sizeof(info) };
    faac_encoder_get_info(hEncoder, &info);

    printf("Frame samples: %u, Max bytes: %u\n", info.frame_samples, info.max_output_bytes);

    faac_encoder_close(&hEncoder);
    return 0;
}
```
