const SHEET_ID = '1gyQvlraX-nNu0yI1xWIpI8a1e3e6yKWjJPtJaNVjrn4';
const SHEET_TAB = 'Q2 Live';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_TAB)}`;

// Team name in sheet → our internal ID
function toTeamId(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function parseCSV(text) {
  const rows = [];
  let current = '';
  let inQuotes = false;
  for (const char of text) {
    if (char === '"') { inQuotes = !inQuotes; continue; }
    if (char === '\n' && !inQuotes) {
      rows.push(current.split(',').map(c => c.trim()));
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) rows.push(current.split(',').map(c => c.trim()));
  return rows;
}

// Find pod data rows: look for rows where column 3 matches a known team name
const KNOWN_TEAMS = ['dream team', 'goatz', 'in guardz we trust', 'magen miami', 'revenue chasers'];

export async function fetchPodStats() {
  const res = await fetch(CSV_URL);
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  const text = await res.text();
  const rows = parseCSV(text);

  const pods = [];
  for (const row of rows) {
    if (row.length < 9) continue;
    const teamName = (row[3] || '').toLowerCase().trim();
    if (!KNOWN_TEAMS.includes(teamName)) continue;

    // First occurrence of each team is the raw counts table
    const teamId = toTeamId(row[3]);
    if (pods.find(p => p.teamId === teamId)) continue; // skip POINT TOTALS duplicate

    pods.push({
      teamId,
      bql: parseInt(row[4], 10) || 0,
      sql: parseInt(row[5], 10) || 0,
      activeTrial: parseInt(row[6], 10) || 0,
      closedWon: parseInt(row[7], 10) || 0,
    });
  }

  return pods;
}

// Parse the POINT TOTALS section (appears after the first data block)
// Values in this table are already weighted (BQL×1, SQL×2, AT×3, CW×4)
export function fetchPointTotals() {
  return fetch(CSV_URL)
    .then(res => {
      if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
      return res.text();
    })
    .then(text => {
      const rows = parseCSV(text);

      // Find the POINT TOTALS header row
      let startIdx = -1;
      for (let i = 0; i < rows.length; i++) {
        if ((rows[i][0] || '').toUpperCase().includes('POINT TOTALS')) {
          startIdx = i;
          break;
        }
      }
      if (startIdx === -1) return [];

      const entries = [];
      for (let i = startIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 9) continue;
        const teamName = (row[3] || '').toLowerCase().trim();
        if (!KNOWN_TEAMS.includes(teamName)) continue;

        entries.push({
          ae: row[0] || '',
          sdr1: row[1] || '',
          sdr2: row[2] || '',
          teamId: toTeamId(row[3]),
          teamName: row[3].trim(),
          // These are already weighted point values
          bqlPts: parseInt(row[4], 10) || 0,
          sqlPts: parseInt(row[5], 10) || 0,
          activeTrialPts: parseInt(row[6], 10) || 0,
          closedWonPts: parseInt(row[7], 10) || 0,
          total: parseInt(row[8], 10) || 0,
        });
      }

      return entries.sort((a, b) => b.total - a.total);
    });
}
