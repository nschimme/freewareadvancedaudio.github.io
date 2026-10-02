
### NAME

faad — Process an Advanced Audio Codec stream

### SYNOPSIS

faad
[options] [-w | -o &lt;output_filename&gt; | -a &lt;output_filename&gt;] input_filename

### DESCRIPTION

This utility provides a command line interface to libfaad2. This program reads in MPEG-4 AAC files, processes, and outputs them in either Microsoft WAV, MPEG-4 AAC ADTS, or standard PCM formats.

### OPTIONS

- **`-a <filename>, -\^-adtsout <filename>`**
  Sets the processing to output to the specified file in MPEG-4 AAC ADTS format
- **`-b <number>, -\^-bits <number>`**
  Set the output (individual) sample format. The number takes one of the following values: 1: 16-bit PCM data (default).

2: 24-bit PCM data.

3: 32-bit PCM data.

4: 32-bit floating-point data.

5: 64-bit floating-point data.
- **`-d, -\^-downmix`**
  Set the processing to downsample from 5.1 (surround sound and bass) channels to 2 channels (stereo).
- **`-f <number>, -\^-format <number>`**
  Set the output file format. The number takes one of the following values: 1: Microsoft WAV format (default).

2: Raw PCM data.
- **`-g`**
  Disable sample-accurate gapless decoding (output un-trimmed raw PCM).
- **`-h, -\^-help`**
  Shows a usage summary.
- **`-i, -\^-info`**
  Shows information about the about the input file.
- **`-l <number>, -\^-objecttype <number>`**
  Sets the MPEG(4 profile and object type for the processing to use. The number takes one of the following values: 1: Main object type.

2: Low Complexity (LC) object type (default).

4: Long Term Prediction (LTP) object type.

23: Low Delay (LD) object type.
- **`-o <filename>, -\^-outfile <number>`**
  Sets the filename for processing output.
- **`-q, -\^-quiet`**
  Quiet - Suppresses status messages during processing.
- **`-t, -\^-oldformat`**
  Sets the processing to use the old MPEG-4 AAC ADTS format when outputting in said format.
- **`-w, -\^-stdio`**
  Sets the processing output to be sent to the standard out.

### AUTHOR

Matthew W. S. Bell &lt;matthew (at) bells23.org.uk&gt;

### SEE ALSO

faac(1)