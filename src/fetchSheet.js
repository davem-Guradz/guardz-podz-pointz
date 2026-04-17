const SHEET_ID = '1gyQvlraX-nNu0yI1xWIpI8a1e3e6yKWjJPtJaNVjrn4';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

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
