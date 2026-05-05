const NOTE_TO_SARGAM = { D: 'S', E: 'R', F: 'G', G: 'M', A: 'P', B: 'D', C: 'N' };

// Returns an array of items:
//   { type: 'line', tokens: [...] }  — one per ABC music source line (= one staff line)
//   { type: 'section' }              — corresponds to $ section break markers
//
// noteIndex is global across lines so it maps 1:1 to TimingCallbacks event order.
export function parseSargam(abc) {
  const items = [];
  let noteIndex = 0;

  for (const rawLine of abc.split('\n')) {
    const t = rawLine.trim();
    if (!t || t.match(/^[A-Z]:/) || t.startsWith('%')) continue;

    if (t === '$') {
      items.push({ type: 'section' });
      continue;
    }

    const line = t
      .replace(/\{[^}]*\}/g, '')
      .replace(/![^!]+!/g, '')
      .replace(/"[^"]*"/g, '');

    const tokens = [];
    const tokenRe = /(\|+|:\|)|(?:[_^=]*)([A-Ga-gz])([',]*)(\d*)(\/\d*)?/g;
    let match;

    while ((match = tokenRe.exec(line)) !== null) {
      const [, barline, letter, octaveMod = '', durNum, durDen] = match;

      if (barline) {
        if (tokens.length > 0 && tokens[tokens.length - 1].type !== 'barline') {
          tokens.push({ type: 'barline' });
        }
        continue;
      }

      if (!letter) continue;

      const num = durNum ? parseInt(durNum, 10) : 1;
      const denStr = durDen ? durDen.slice(1) : '';
      const den = denStr ? (parseInt(denStr, 10) || 2) : 1;
      const duration = num / den;

      if (letter === 'z' || letter === 'Z') {
        tokens.push({ type: 'rest', duration, noteIndex: noteIndex++ });
        continue;
      }

      const isLower = letter !== letter.toUpperCase();
      let octave = 0;
      if (isLower) octave = 1;
      if (octaveMod.includes(',')) octave = -1;
      if (!isLower && octaveMod.includes("'")) octave = 1;

      const label = NOTE_TO_SARGAM[letter.toUpperCase()];
      if (!label) continue;

      // Sa = D4, so the sargam octave spans D→C (not C→B). Ni (C) belongs to the
      // octave *below* what ABC notation assigns it, so shift it down by one.
      const sargamOctave = letter.toUpperCase() === 'C' ? octave - 1 : octave;

      tokens.push({ type: 'note', label, octave: sargamOctave, duration, noteIndex: noteIndex++ });
    }

    if (tokens.length > 0) {
      items.push({ type: 'line', tokens });
    }
  }

  return items;
}
