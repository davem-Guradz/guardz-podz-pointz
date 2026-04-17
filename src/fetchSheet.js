const SHEET_ID = '1gyQvlraX-nNu0yI1xWIpI8a1e3e6yKWjJPtJaNVjrn4';
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

// Quarter ID → Google Sheet tab name
export const QUARTER_TABS = {
  'q1-2026': 'Q1 Final',
  'q2-2026': 'Q2 Live',
  'q3-2026': 'Q3 Live',
  'q4-2026': 'Q4 Live',
};

const KNOWN_TEAMS = ['dream team', 'goatz', 'in guardz we trust', 'magen miami', 'revenue chasers'];

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

// Find the team name column index in a row
function findTeamCol(row) {
  for (let i = 0; i < row.length; i++) {
    if (KNOWN_TEAMS.includes((row[i] || '').toLowerCase().trim())) return i;
  }
  return -1;
}

// Parse a data row: find team name, then extract numeric columns after it
function parseDataRow(row) {
  const teamCol = findTeamCol(row);
  if (teamCol === -1) return null;

  const teamName = row[teamCol].trim();
  const nums = [];
  for (let i = teamCol + 1; i < row.length; i++) {
    const n = parseInt(row[i], 10);
    if (!isNaN(n)) nums.push(n);
  }

  // Flexible: supports 3 cols (BQL, SQL, CW) or 4 cols (BQL, SQL, AT, CW)
  if (nums.length >= 4) {
    return { teamId: toTeamId(teamName), bql: nums[0], sql: nums[1], activeTrial: nums[2], closedWon: nums[3] };
  } else if (nums.length >= 3) {
    return { teamId: toTeamId(teamName), bql: nums[0], sql: nums[1], activeTrial: 0, closedWon: nums[2] };
  }
  return null;
}

// Parse a POINT TOTALS row with AE/SDR info
function parsePointTotalRow(row) {
  const teamCol = findTeamCol(row);
  if (teamCol === -1) return null;

  const ae = row[0] || '';
  const sdr1 = row[1] || '';
  const sdr2 = row[2] || '';
  const teamName = row[teamCol].trim();
  const nums = [];
  for (let i = teamCol + 1; i < row.length; i++) {
    const n = parseInt(row[i], 10);
    if (!isNaN(n)) nums.push(n);
  }

  if (nums.length >= 4) {
    // BQL pts, SQL pts, Active Trial pts, Closed Won pts, Total
    return { ae, sdr1, sdr2, teamId: toTeamId(teamName), teamName, bqlPts: nums[0], sqlPts: nums[1], activeTrialPts: nums[2], closedWonPts: nums[3], total: nums[4] || (nums[0] + nums[1] + nums[2] + nums[3]) };
  } else if (nums.length >= 3) {
    // BQL pts, SQL pts, Closed Won pts, Total
    return { ae, sdr1, sdr2, teamId: toTeamId(teamName), teamName, bqlPts: nums[0], sqlPts: nums[1], activeTrialPts: 0, closedWonPts: nums[2], total: nums[3] || (nums[0] + nums[1] + nums[2]) };
  }
  return null;
}

async function fetchTab(tabName) {
  const res = await fetch(BASE_URL + encodeURIComponent(tabName));
  if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
  return await res.text();
}

// Fetch pod raw stats for a given quarter
export async function fetchPodStats(quarterId) {
  const tabName = QUARTER_TABS[quarterId];
  if (!tabName) return [];

  const text = await fetchTab(tabName);
  const rows = parseCSV(text);

  const pods = [];
  const seen = new Set();
  for (const row of rows) {
    // Stop at POINT TOTALS section
    if ((row[0] || '').toUpperCase().includes('POINT TOTALS')) break;

    const parsed = parseDataRow(row);
    if (parsed && !seen.has(parsed.teamId)) {
      seen.add(parsed.teamId);
      pods.push(parsed);
    }
  }
  return pods;
}

// Fetch point totals for a given quarter
export async function fetchPointTotals(quarterId) {
  const tabName = QUARTER_TABS[quarterId];
  if (!tabName) return [];

  const text = await fetchTab(tabName);
  const rows = parseCSV(text);

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
    const parsed = parsePointTotalRow(rows[i]);
    if (parsed) entries.push(parsed);
  }
  return entries.sort((a, b) => b.total - a.total);
}

// Fetch FY aggregate: sum all available quarter tabs
export async function fetchFYPodStats() {
  const results = await Promise.allSettled(
    Object.keys(QUARTER_TABS).map(qId => fetchPodStats(qId))
  );

  const totals = {};
  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const pod of result.value) {
      if (!totals[pod.teamId]) {
        totals[pod.teamId] = { teamId: pod.teamId, bql: 0, sql: 0, activeTrial: 0, closedWon: 0 };
      }
      totals[pod.teamId].bql += pod.bql;
      totals[pod.teamId].sql += pod.sql;
      totals[pod.teamId].activeTrial += pod.activeTrial;
      totals[pod.teamId].closedWon += pod.closedWon;
    }
  }
  return Object.values(totals);
}

export async function fetchFYPointTotals() {
  const results = await Promise.allSettled(
    Object.keys(QUARTER_TABS).map(qId => fetchPointTotals(qId))
  );

  const totals = {};
  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const entry of result.value) {
      if (!totals[entry.teamId]) {
        totals[entry.teamId] = { ae: entry.ae, sdr1: entry.sdr1, sdr2: entry.sdr2, teamId: entry.teamId, teamName: entry.teamName, bqlPts: 0, sqlPts: 0, activeTrialPts: 0, closedWonPts: 0, total: 0 };
      }
      totals[entry.teamId].bqlPts += entry.bqlPts;
      totals[entry.teamId].sqlPts += entry.sqlPts;
      totals[entry.teamId].activeTrialPts += entry.activeTrialPts;
      totals[entry.teamId].closedWonPts += entry.closedWonPts;
      totals[entry.teamId].total += entry.total;
    }
  }
  return Object.values(totals).sort((a, b) => b.total - a.total);
}
