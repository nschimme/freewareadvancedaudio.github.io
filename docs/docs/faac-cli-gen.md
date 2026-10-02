

### NAME

faac - open source MPEG-4 and MPEG-2 AAC encoder

### SYNOPSIS

faac
[ options ]
[-o\ outfile ]
infiles
...

&lt; infiles &gt;
and/or
&lt; outfile &gt;
can be "-", which means stdin/stdout.

### DESCRIPTION

FAAC
is an open source MPEG-4 and MPEG-2 AAC encoder, it is licensed under the LGPL license.
Note that the quality of
FAAC
is not up to par with the currently best AAC encoders available.

### FEATURES

- **`* Portable`**
- **`* Fast`**
- **`* AAC-LC and HE-AAC v1 (SBR) support`**

### HELP OPTIONS

- **`-h`**
  Short help on using FAAC
- **`-H`**
  Description of all options for FAAC
- **`--license`**
  License terms for FAAC.
- **`--help-qual`**
  Quality-related options
- **`--help-io`**
  Input/output options
- **`--help-mp4`**
  MP4 specific options
- **`--help-advanced`**
  Advanced options, only for testing purposes

### QUALITY-RELATED OPTIONS

Rate control:
-q
holds a quality and lets the bitrate follow the material (VBR);
-b
holds an average over the file (ABR, the default at 128 kbps);
-b --cbr
holds it in every frame (CBR).
--cap-rate
bounds any single frame in any mode, so
-q --cap-rate
is capped VBR: constant quality, no frame above the cap.
-q
and
-b
are exclusive.
- **`--object-type <type>`**
  Force the AAC object type: lc (Low Complexity), he-aac-v1 (High-Efficiency AAC v1, i.e. AAC-LC plus Spectral Band Replication), or auto (default), which selects LC or HE-AAC v1 from the bitrate and sample rate. HE-AAC v1 targets low bitrates; its core is coded at half the input sample rate and reconstructed to full rate by SBR in the decoder.
- **`--joint <mode>`**
  Joint stereo coding mode: 0 (off, independent left/right), 1 (Mid/Side), 2 (Intensity Stereo), or 3 (Mixed Mode, dynamic per-band Mid/Side and Intensity Stereo). Default is 3 .
- **`--no-pns`**
  Disable Perceptual Noise Substitution, which codes noise-like bands as a noise level instead of spectral lines. On by default.
- **`--no-tns`**
  Disable Temporal Noise Shaping, which reduces pre-echo on transients. On by default.
- **`-q <quality>`**
  Constant quality, 1..5000, default 100 (VBR). Higher is better and costs more bits. The bitrate follows the material, so one quality can take twice the bits on one recording as on another, and it moves between releases as the encoder is tuned. With --object-type auto a quality up to 75 uses HE-AAC v1; from 76 it is AAC-LC at a much higher bitrate. Use -b for a predictable size.
- **`-b <bitrate>`**
  Set average bitrate (ABR) to approximately &lt;bitrate&gt; kbps. Max. ~500 kbps (stereo).
- **`--cbr`**
  Hold the -b bitrate as a constant bitrate (CBR). A bit reservoir models the decoder's input buffer (6144 bits per channel): every frame fits what the buffer holds, a frame that would otherwise overflow it is stuffed up to it, and the stream lands on its rate exactly. ADTS output declares the buffer fullness in every header; MP4 output declares the buffer size and maxBitrate equal to avgBitrate. Meant for constant-rate channels and matched-bitrate comparisons: on a file or a packet network the stuffing is bytes for nothing, and a transient may take only what the buffer holds where ABR lets it take several times the mean.
- **`--cap-rate <bitrate>`**
  Cap any single frame at &lt;bitrate&gt; kbps, for packet-oriented transports that drop an oversized frame rather than splitting it, and for bounding VBR. Must be at least the -b bitrate. A ceiling, not a second average: frames that already fit are left alone, so the stream stays ABR or VBR. Best-effort — a frame cannot shrink below the cost of its own side info, so a low enough cap is still exceeded on a few percent of frames.
- **`-c <freq>`**
  Cut the audio off above &lt;freq&gt; Hz. Left out, the encoder chooses the cutoff from the bitrate, between 14 and 19 kHz on most stereo settings; VBR codes up to 19 kHz. It is printed at the start of the encode. Set it as high as half the sample rate to keep everything; the bitrate rises with it. HE-AAC sets its own cutoff and ignores this. The actual frequency is adjusted to a band edge.

### INPUT/OUTPUT OPTIONS

- **`-o <filename>`**
  Set output file name (only for one input file). Format is auto-detected from extension (.aac/.adts -&gt; ADTS, .m4a/.mp4/.m4b -&gt; MP4; default: MP4).
- **`-a`**
  Use ADTS stream output format. Generate ADTS transport stream output.
- **`-`**
  Use stdin/stdout. If you simply use a hyphen/minus sign instead of a filename, FAAC can encode directly from stdin, thus enabling piping from other applications and utilities. The same works for stdout as well, so FAAC can pipe its output to other apps such as a server.
- **`-v <verbose>`**
  Set verbosity level (-v0 is quiet mode).
- **`-r`**
  Use RAW AAC output file. Generate raw AAC bitstream (i.e. without any headers). Not advised: raw AAC files are practically useless.
- **`-P`**
  Raw PCM input mode (default 44100 Hz, 16-bit, stereo). Raw PCM input mode (default: off, i.e. expecting a WAV header; necessary for input files or bitstreams without a header; using only -P assumes the default values for -R, -B and -C in the input file).
- **`-R <samplerate>`**
  Raw PCM input rate. Raw PCM input sample rate in Hz (default: 44100 Hz, max. 96 kHz)
- **`-B <samplebits>`**
  Raw PCM input sample size (8, 16 (default), 24 or 32 bits). Raw PCM input sample size (default: 16, also possible 8, 24, 32 bit fixed or float input).
- **`-C <channels>`**
  Raw PCM input channels. Raw PCM input channels (default: 2, max. 8).
- **`-X`**
  Swap raw PCM input byte order. Raw PCM input is read big-endian by default; -X reads it little-endian.
- **`-I <C[,LFE]>`**
  Input channel config, default is 3,4 (Center third, LFE fourth) Input multichannel configuration (default: 3,4 which means Center is third and LFE is fourth like in 5.1 WAV, so you only have to specify a different position of these two mono channels in your multichannel input files if they haven't been reordered already).
- **`--ignorelength`**
  Ignore wav length from header (useful with files over 4 GB)
- **`--overwrite`**
  Overwrite existing output file

### MP4 SPECIFIC OPTIONS

- **`--tag <tagname,tagvalue>`**
  Add named tag (iTunes '----')
- **`--artist <name>`**
  Set artist name
- **`--composer <name>`**
  Set composer name
- **`--title <name>`**
  Set title/track name
- **`--genre <number>`**
  Set genre number
- **`--album <name>`**
  Set album/performer
- **`--compilation`**
  Mark as compilation
- **`--track <number/total>`**
  Set track number
- **`--disc <number/total>`**
  Set disc number
- **`--year <number>`**
  Set year
- **`--cover-art <filename>`**
  Read cover art from &lt;filename&gt; Supported image formats are GIF, JPEG, and PNG.
- **`--comment <string>`**
  Set comment

### ADVANCED OPTIONS, ONLY FOR TESTING PURPOSES

- **`--mpeg-vers X`**
  Force AAC MPEG version, X can be 2 or 4
- **`--shortctl X`**
  Enforce block type (0 = both (default); 1 = no short; 2 = no long).

### AUTHORS

FAAC
was written by M. Bakker.

Developed and maintained by Krzysztof Nikiel &lt;knik@users.sourceforge.net&gt;.

This manpage was written by Fabian Greffrath &lt;fabian@debian-unofficial.org&gt; for the Debian Unofficial project (but may be used by others, of course).
