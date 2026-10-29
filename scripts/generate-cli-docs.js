import fs from 'fs';
import path from 'path';

function unescapeRoff(str) {
  if (!str) return '';
  let res = str;
  // Font escape sequences
  res = res.replace(/\\f[BIPR]/g, '');
  res = res.replace(/\\f\[[A-Za-z0-9]+\]/g, '');
  // Hyphen and special character unescaping
  res = res.replace(/\\-\^\-/g, '--');
  res = res.replace(/\\-\^?/g, '-');
  res = res.replace(/\\\^\-/g, '-');
  res = res.replace(/\\\^/g, '');
  res = res.replace(/\\\(hy/g, '-');
  res = res.replace(/\\hy\(/g, '-');
  res = res.replace(/\\\(em/g, '—');
  res = res.replace(/\\\(en/g, '–');
  res = res.replace(/\\ /g, ' ');
  res = res.replace(/\\e/g, '\\');
  res = res.replace(/\\~/g, ' ');
  res = res.replace(/\\</g, '<');
  res = res.replace(/\\>/g, '>');
  res = res.replace(/\\hy/g, '');
  return res;
}

function escapeVueHtml(str) {
  if (!str) return '';
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
    if (char === '\\' && line[i + 1] === ' ') {
      // Roff uses an escaped space to keep words together in macro arguments.
      // Preserve it here; unescapeRoff() converts it to a literal space later.
      current += '\\ ';
      i++;
    } else if (char === '"') {
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

function formatAlternatingArgs(args) {
  let res = '';
  args.forEach((arg, idx) => {
    let cleanArg = unescapeRoff(arg);
    if (!cleanArg) return;
    if (idx > 0) {
      if (!/^\s*[\.,;:\)\]\>]/.test(cleanArg) && !/\s$/.test(res) && !/^\s/.test(cleanArg)) {
        res += ' ';
      }
    }
    res += cleanArg;
  });
  return res.replace(/\s+,/g, ',').replace(/\s+/g, ' ').trim();
}

function splitTblRow(raw, columns) {
  let parts = raw.includes('\t') ? raw.split('\t') : raw.split(/\s{2,}/);
  if (parts.length < columns) parts = raw.trim().split(/\s{2,}/);
  while (parts.length < columns) parts.push('');
  return parts.slice(0, columns);
}

function tblCell(value) {
  return escapeVueHtml(unescapeRoff((value || '').trim())).replace(/\|/g, '\\|');
}

/* Convert a tbl(1) table (.TS/.TE) into a GFM table. Handles the simple
 * tab-separated form used by the manpages: option lines ending in ';',
 * one or more format lines ending in '.', a '_' header rule, and rows. */
function parseTblTable(lines, start) {
  let i = start + 1;
  const formats = [];

  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line === '.TE') return { markdown: [], next: i + 1 };
    if (line.endsWith(';')) continue;
    if (line.startsWith('.')) break;

    const closed = line.endsWith('.');
    const spec = closed ? line.slice(0, -1).trim() : line;
    formats.push(spec.split(/\s+/).filter(Boolean));
    if (closed) {
      i++;
      break;
    }
  }

  if (!formats.length) return { markdown: [], next: i };

  const columns = formats[formats.length - 1];
  const rows = [];
  let header = null;

  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '.TE') {
      i++;
      break;
    }
    if (!line) continue;
    if (line === '_' || line === '=') {
      if (rows.length) header = rows.pop();
      continue;
    }
    if (line.startsWith('.')) continue;
    rows.push(splitTblRow(lines[i], columns.length));
  }

  const alignments = columns.map(column => {
    const align = column[0];
    return align === 'r' ? '---:' : align === 'c' ? ':---:' : ':---';
  });
  const render = cells => `| ${columns.map((_, index) => tblCell(cells[index])).join(' | ')} |`;
  const markdown = [
    render(header || columns.map(() => '')),
    `| ${alignments.join(' | ')} |`,
    ...rows.map(render)
  ];
  return { markdown, next: i };
}

function parseManpageToMarkdown(manContent) {
  const lines = manContent.split(/\r?\n/);
  let md = [];
  let inTP = false;
  let tpTerm = '';
  let tpDesc = [];
  let rsLevel = 0;
  let section = '';
  let exampleEligible = false;
  let exampleLines = [];

  function flushExample() {
    if (!exampleLines.length) return;
    md.push('', '```sh', ...exampleLines, '```', '');
    exampleLines = [];
    exampleEligible = false;
  }

  function flushTP() {
    if (inTP) {
      if (tpTerm) {
        let cleanTerm = unescapeRoff(tpTerm).replace(/\s+/g, ' ').trim();
        cleanTerm = cleanTerm.replace(/\s+,/g, ',');

        // Check if term is a bullet item like "* Portable" or "- Fast"
        if (/^[\*\-\+]\s+/.test(cleanTerm)) {
          const itemText = cleanTerm.replace(/^[\*\-\+]\s+/, '');
          md.push(`- **${itemText}**`);
        } else {
          md.push(`- **\`${cleanTerm}\`**`);
        }

        if (tpDesc.length > 0) {
          let descLines = [];
          let currentLine = [];

          tpDesc.forEach(item => {
            if (item === '\n') {
              if (currentLine.length > 0) {
                descLines.push(currentLine.join(' '));
                currentLine = [];
              }
            } else {
              currentLine.push(item);
            }
          });
          if (currentLine.length > 0) {
            descLines.push(currentLine.join(' '));
          }

          descLines.forEach(lineText => {
            let cleanLine = unescapeRoff(lineText).replace(/\s+/g, ' ').trim();
            if (!cleanLine) return;

            // Check if line looks like a sub-list item (e.g. "1: 16-bit PCM...")
            if (/^\d+:\s+/.test(cleanLine)) {
              const match = cleanLine.match(/^(\d+):\s+(.*)$/);
              md.push(`  - **${match[1]}**: ${escapeVueHtml(match[2])}`);
            } else {
              md.push(`  ${escapeVueHtml(cleanLine)}`);
            }
          });
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
      if (inTP) {
        tpDesc.push('\n');
      } else {
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
        flushExample();
        const sectionName = tokens.slice(1).join(' ').replace(/^"(.*)"$/, '$1');
        section = unescapeRoff(sectionName).trim().toUpperCase();
        md.push(`\n### ${unescapeRoff(sectionName)}\n`);
      } else if (macro === '.SS') {
        flushTP();
        const subSec = tokens.slice(1).join(' ').replace(/^"(.*)"$/, '$1');
        md.push(`\n#### ${unescapeRoff(subSec)}\n`);
      } else if (macro === '.TS') {
        flushTP();
        const table = parseTblTable(lines, i);
        if (table.markdown.length) md.push('', ...table.markdown, '');
        i = table.next - 1;
      } else if (macro === '.TP') {
        flushTP();
        inTP = true;
      } else if (macro === '.PP' || macro === '.P') {
        if (inTP) {
          tpDesc.push('\n');
        } else {
          flushTP();
          flushExample();
          md.push('');
          if (section === 'EXAMPLES') exampleEligible = true;
        }
      } else if (macro === '.IP') {
        if (inTP) {
          tpDesc.push('\n');
        } else if (section === 'EXAMPLES') {
          flushExample();
          exampleEligible = true;
        }
      } else if (macro === '.br') {
        if (inTP) {
          tpDesc.push('\n');
        } else if (!(section === 'EXAMPLES' && exampleLines.length)) {
          md.push('');
        }
      } else if (macro === '.RS') {
        rsLevel++;
        if (inTP) tpDesc.push('\n');
      } else if (macro === '.RE') {
        if (rsLevel > 0) rsLevel--;
        if (inTP) tpDesc.push('\n');
      } else if (macro === '.BR' || macro === '.BI' || macro === '.B' || macro === '.I' || macro === '.RI') {
        const rawArgs = tokens.slice(1);
        let formatted = formatAlternatingArgs(rawArgs);

        if (section === 'EXAMPLES' && (exampleEligible || exampleLines.length)) {
          if (formatted) exampleLines.push(formatted);
        } else if (inTP && !tpTerm) {
          tpTerm = formatted;
        } else if (inTP) {
          tpDesc.push(formatted);
        } else {
          md.push(escapeVueHtml(formatted));
        }
      } else if (macro === '.nh') {
        // ignore hyphenation macro
      } else {
        const rest = unescapeRoff(tokens.slice(1).join(' '));
        if (rest && !/^\d+$/.test(rest)) {
          if (inTP) tpDesc.push(rest);
          else md.push(escapeVueHtml(rest));
        }
      }
    } else {
      const cleanLine = unescapeRoff(line);
      if (inTP) {
        if (!tpTerm) {
          tpTerm = cleanLine;
        } else {
          tpDesc.push(cleanLine);
        }
      } else {
        if (section === 'EXAMPLES' && (exampleEligible || exampleLines.length)) {
          flushExample();
          exampleEligible = false;
        }
        if (rsLevel > 0 && /^\d+:\s+/.test(cleanLine)) {
          const match = cleanLine.match(/^(\d+):\s+(.*)$/);
          md.push(`- **${match[1]}**: ${escapeVueHtml(match[2])}`);
        } else {
          md.push(escapeVueHtml(cleanLine));
        }
      }
    }
  }

  flushTP();
  flushExample();

  return md.join('\n').replace(/\n{3,}/g, '\n\n');
}

for (const name of ['faac', 'faad', 'faam', 'faar']) {
  const manPath = path.join(process.cwd(), 'vendor/faac/docs', `${name}.1`);
  if (fs.existsSync(manPath)) {
    const man = fs.readFileSync(manPath, 'utf8');
    const md = parseManpageToMarkdown(man);
    fs.writeFileSync(path.join(process.cwd(), 'docs/docs', `${name}-cli-gen.md`), md);
    console.log(`Generated docs/docs/${name}-cli-gen.md`);
  }
}

for (const name of ['libfaac', 'libfaad', 'libfaam', 'libfaar']) {
  const source = path.join(process.cwd(), 'vendor/faac/docs', `${name}.md`);
  if (fs.existsSync(source)) {
    fs.writeFileSync(path.join(process.cwd(), 'docs/docs', `${name}-api-gen.md`), fs.readFileSync(source, 'utf8'));
    console.log(`Generated docs/docs/${name}-api-gen.md`);
  }
}
