import fs from 'fs';
import path from 'path';

function cleanRoffText(str) {
  if (!str) return '';
  let res = str;
  // Font change stripping
  res = res.replace(/\\f[A-Za-z0-9]/g, '');
  res = res.replace(/\\f\[[A-Za-z0-9]+\]/g, '');
  // Unescape troff sequences
  res = res.replace(/\\-\^?/g, '-');
  res = res.replace(/\\\(hy/g, '-');
  res = res.replace(/\\ /g, ' ');
  res = res.replace(/\\\(em/g, '—');
  res = res.replace(/\\e/g, '\\');
  res = res.replace(/\\~/g, '~');
  res = res.replace(/\\</g, '<');
  res = res.replace(/\\>/g, '>');
  res = res.replace(/\\hy/g, '');
  return res;
}

function escapeVueHtml(str) {
  if (!str) return '';
  // Escape unformatted angle brackets outside backticks so Vue parser doesn't treat them as tags
  let result = '';
  let inBacktick = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '`') {
      inBacktick = !inBacktick;
      result += char;
    } else if (!inBacktick && char === '<') {
      result += '&lt;';
    } else if (!inBacktick && char === '>') {
      result += '&gt;';
    } else {
      result += char;
    }
  }
  return result;
}

function parseMacroArgs(line) {
  const tokens = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ' ' && !inQuotes) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current.length > 0) {
    tokens.push(current);
  }
  return tokens;
}

function parseManpageToMarkdown(manContent) {
  const lines = manContent.split(/\r?\n/);
  let md = [];
  let inTP = false;
  let tpTerm = '';
  let tpDesc = [];

  function flushTP() {
    if (inTP) {
      if (tpTerm) {
        let cleanTerm = cleanRoffText(tpTerm).replace(/\s+/g, ' ').trim();
        cleanTerm = cleanTerm.replace(/\s+,/g, ',');
        md.push(`- **\`${cleanTerm}\`**`);
        if (tpDesc.length > 0) {
          let descText = tpDesc.map(cleanRoffText).join(' ').replace(/\s+/g, ' ').trim();
          if (descText) {
            md.push(`  ${escapeVueHtml(descText)}`);
          }
        }
      }
      inTP = false;
      tpTerm = '';
      tpDesc = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (!inTP) {
        md.push('');
      }
      continue;
    }

    if (line.startsWith('.')) {
      const tokens = parseMacroArgs(line);
      const macro = tokens[0];

      if (macro === '.TH') {
        continue;
      } else if (macro === '.SH') {
        flushTP();
        const sectionName = tokens.slice(1).join(' ').replace(/^"(.*)"$/, '$1');
        md.push(`\n### ${cleanRoffText(sectionName)}\n`);
      } else if (macro === '.SS') {
        flushTP();
        const subSec = tokens.slice(1).join(' ').replace(/^"(.*)"$/, '$1');
        md.push(`\n#### ${cleanRoffText(subSec)}\n`);
      } else if (macro === '.TP') {
        flushTP();
        inTP = true;
      } else if (macro === '.PP' || macro === '.P' || macro === '.br') {
        flushTP();
        md.push('');
      } else if (macro === '.RS' || macro === '.RE' || macro === '.nh') {
        // structural or hyphenation macros
      } else if (macro === '.BR' || macro === '.BI' || macro === '.B' || macro === '.I' || macro === '.RI') {
        const rawArgs = tokens.slice(1);
        let formatted = '';
        if (macro === '.BR' || macro === '.BI') {
          rawArgs.forEach((arg) => {
            formatted += ' ' + cleanRoffText(arg);
          });
        } else if (macro === '.B' || macro === '.I') {
          formatted = cleanRoffText(rawArgs.join(' '));
        } else if (macro === '.RI') {
          formatted = rawArgs.map(cleanRoffText).join(' ');
        }

        if (inTP && !tpTerm) {
          tpTerm = formatted.trim();
        } else if (inTP) {
          tpDesc.push(formatted);
        } else {
          md.push(escapeVueHtml(formatted));
        }
      } else {
        const rest = tokens.slice(1).map(cleanRoffText).join(' ');
        if (rest && !/^\d+$/.test(rest)) {
          if (inTP) tpDesc.push(rest);
          else md.push(escapeVueHtml(rest));
        }
      }
    } else {
      const cleanLine = cleanRoffText(line);
      if (inTP) {
        if (!tpTerm) {
          tpTerm = cleanLine;
        } else {
          tpDesc.push(cleanLine);
        }
      } else {
        md.push(escapeVueHtml(cleanLine));
      }
    }
  }

  flushTP();

  return md.join('\n').replace(/\n{3,}/g, '\n\n');
}

// Generate FAAC CLI markdown snippet
const faacManPath = path.join(process.cwd(), 'vendor/faac/docs/faac.1');
if (fs.existsSync(faacManPath)) {
  const faacMan = fs.readFileSync(faacManPath, 'utf8');
  const faacMd = parseManpageToMarkdown(faacMan);
  fs.writeFileSync(path.join(process.cwd(), 'docs/docs/faac-cli-gen.md'), faacMd);
  console.log('Generated docs/docs/faac-cli-gen.md');
}

// Generate FAAD2 CLI markdown snippet
const faadManPath = path.join(process.cwd(), 'vendor/faad2/frontend/faad.man');
if (fs.existsSync(faadManPath)) {
  const faadMan = fs.readFileSync(faadManPath, 'utf8');
  const faadMd = parseManpageToMarkdown(faadMan);
  fs.writeFileSync(path.join(process.cwd(), 'docs/docs/faad2-cli-gen.md'), faadMd);
  console.log('Generated docs/docs/faad2-cli-gen.md');
}
