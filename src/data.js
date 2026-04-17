// ─── POINT SYSTEM ──────────────────────────────────────────────────────────
export const POINT_WEIGHTS = {
  bql: 1,
  sql: 2,
  activeTrial: 2,
  closedWon: 5,
};

// ─── QUARTERS ──────────────────────────────────────────────────────────────
export const QUARTERS = [
  { id: 'q2-2026', label: 'Q2 2026', year: 2026, quarter: 'Q2' },
  { id: 'q1-2026', label: 'Q1 2026', year: 2026, quarter: 'Q1' },
];

// ─── TEAMS ─────────────────────────────────────────────────────────────────
export const TEAMS = {
  'dream-team':          { id: 'dream-team',          name: 'Dream Team',          color: '#18df85' },
  'goatz':               { id: 'goatz',               name: 'Goatz',               color: '#64b4ff' },
  'in-guardz-we-trust':  { id: 'in-guardz-we-trust',  name: 'In Guardz We Trust',  color: '#ffb432' },
  'magen-miami':         { id: 'magen-miami',         name: 'Magen Miami',         color: '#b464ff' },
  'revenue-chasers':     { id: 'revenue-chasers',     name: 'Revenue Chasers',     color: '#ff6464' },
};

// ─── PEOPLE ────────────────────────────────────────────────────────────────
// role: 'ae' | 'sdr'
export const PEOPLE = [
  // Dream Team
  { id: 'jonathan',  name: 'Jonathan',  role: 'ae',  teamId: 'dream-team',         initials: 'JO', photo: null },
  { id: 'rafaela',   name: 'Rafaela',   role: 'sdr', teamId: 'dream-team',         initials: 'RM', photo: null },
  { id: 'matthew',   name: 'Matthew',   role: 'sdr', teamId: 'dream-team',         initials: 'MT', photo: null },
  // Goatz
  { id: 'nick',      name: 'Nick',      role: 'ae',  teamId: 'goatz',              initials: 'NK', photo: null },
  { id: 'marelise',  name: 'Marelise',  role: 'sdr', teamId: 'goatz',              initials: 'MM', photo: null },
  { id: 'jason',     name: 'Jason',     role: 'sdr', teamId: 'goatz',              initials: 'JP', photo: null },
  // In Guardz We Trust
  { id: 'philip',    name: 'Philip',    role: 'ae',  teamId: 'in-guardz-we-trust', initials: 'PH', photo: null },
  { id: 'alyssa',    name: 'Alyssa',    role: 'sdr', teamId: 'in-guardz-we-trust', initials: 'AL', photo: null },
  { id: 'rolando',   name: 'Rolando',   role: 'sdr', teamId: 'in-guardz-we-trust', initials: 'RO', photo: null },
  // Magen Miami
  { id: 'sandy',     name: 'Sandy',     role: 'ae',  teamId: 'magen-miami',        initials: 'SA', photo: null },
  { id: 'chantal',   name: 'Chantal',   role: 'sdr', teamId: 'magen-miami',        initials: 'CL', photo: null },
  { id: 'andrew',    name: 'Andrew',    role: 'sdr', teamId: 'magen-miami',        initials: 'AN', photo: null },
  // Revenue Chasers
  { id: 'william',   name: 'William',   role: 'ae',  teamId: 'revenue-chasers',    initials: 'WI', photo: null },
  { id: 'bianca',    name: 'Bianca',    role: 'sdr', teamId: 'revenue-chasers',    initials: 'BI', photo: null },
  { id: 'bill',      name: 'Bill',      role: 'sdr', teamId: 'revenue-chasers',    initials: 'BM', photo: null },
];

// ─── RAW STATS PER PERSON PER QUARTER ──────────────────────────────────────
// These are the pod-level totals from the spreadsheet.
// Each entry represents one pod's combined stats for the quarter.
export const POD_STATS_RAW = {
  'q2-2026': [
    { teamId: 'dream-team',         bql: 31, sql: 7,  activeTrial: 18, closedWon: 3 },
    { teamId: 'goatz',               bql: 17, sql: 5,  activeTrial: 19, closedWon: 1 },
    { teamId: 'in-guardz-we-trust',  bql: 17, sql: 8,  activeTrial: 13, closedWon: 2 },
    { teamId: 'magen-miami',         bql: 7,  sql: 3,  activeTrial: 15, closedWon: 0 },
    { teamId: 'revenue-chasers',     bql: 20, sql: 3,  activeTrial: 5,  closedWon: 1 },
  ],
  'q1-2026': [
    { teamId: 'dream-team',         bql: 28, sql: 12, activeTrial: 22, closedWon: 5 },
    { teamId: 'goatz',               bql: 14, sql: 6,  activeTrial: 17, closedWon: 2 },
    { teamId: 'in-guardz-we-trust',  bql: 19, sql: 9,  activeTrial: 11, closedWon: 3 },
    { teamId: 'magen-miami',         bql: 10, sql: 4,  activeTrial: 13, closedWon: 1 },
    { teamId: 'revenue-chasers',     bql: 15, sql: 5,  activeTrial: 8,  closedWon: 2 },
  ],
};

// Individual SDR stats — MTD / quarter breakdown (from SDR dashboard screenshots)
export const SDR_STATS_RAW = {
  'q2-2026': [
    { personId: 'rolando',  bql: 2,  sql: 1,  activeTrial: 8,  closedWon: 0, connects: 60  },
    { personId: 'chantal',  bql: 6,  sql: 3,  activeTrial: 20, closedWon: 0, connects: 62  },
    { personId: 'marelise', bql: 4,  sql: 2,  activeTrial: 15, closedWon: 0, connects: 56  },
    { personId: 'jason',    bql: 6,  sql: 3,  activeTrial: 22, closedWon: 1, connects: 52  },
    { personId: 'alyssa',   bql: 8,  sql: 4,  activeTrial: 18, closedWon: 1, connects: 58  },
    { personId: 'rafaela',  bql: 14, sql: 7,  activeTrial: 27, closedWon: 2, connects: 70  },
    { personId: 'matthew',  bql: 10, sql: 5,  activeTrial: 18, closedWon: 1, connects: 65  },
    { personId: 'andrew',   bql: 3,  sql: 1,  activeTrial: 12, closedWon: 0, connects: 48  },
    { personId: 'bianca',   bql: 4,  sql: 1,  activeTrial: 3,  closedWon: 0, connects: 40  },
    { personId: 'bill',     bql: 9,  sql: 5,  activeTrial: 8,  closedWon: 1, connects: 55  },
  ],
  'q1-2026': [
    { personId: 'rolando',  bql: 6,  sql: 3,  activeTrial: 10, closedWon: 1, connects: 75  },
    { personId: 'chantal',  bql: 5,  sql: 2,  activeTrial: 12, closedWon: 0, connects: 68  },
    { personId: 'marelise', bql: 4,  sql: 2,  activeTrial: 9,  closedWon: 0, connects: 61  },
    { personId: 'jason',    bql: 5,  sql: 3,  activeTrial: 14, closedWon: 1, connects: 58  },
    { personId: 'alyssa',   bql: 9,  sql: 4,  activeTrial: 7,  closedWon: 1, connects: 72  },
    { personId: 'rafaela',  bql: 12, sql: 6,  activeTrial: 20, closedWon: 3, connects: 80  },
    { personId: 'matthew',  bql: 9,  sql: 5,  activeTrial: 15, closedWon: 2, connects: 71  },
    { personId: 'andrew',   bql: 4,  sql: 2,  activeTrial: 8,  closedWon: 0, connects: 55  },
    { personId: 'bianca',   bql: 3,  sql: 1,  activeTrial: 3,  closedWon: 0, connects: 44  },
    { personId: 'bill',     bql: 8,  sql: 4,  activeTrial: 6,  closedWon: 2, connects: 62  },
  ],
};

// ─── COMPUTED HELPERS ───────────────────────────────────────────────────────
export function calcPoints({ bql = 0, sql = 0, activeTrial = 0, closedWon = 0 }) {
  return (
    bql * POINT_WEIGHTS.bql +
    sql * POINT_WEIGHTS.sql +
    activeTrial * POINT_WEIGHTS.activeTrial +
    closedWon * POINT_WEIGHTS.closedWon
  );
}

export function getPodStatsForQuarter(quarterId) {
  const raw = POD_STATS_RAW[quarterId] || [];
  return raw
    .map(s => ({
      ...s,
      team: TEAMS[s.teamId],
      points: calcPoints(s),
    }))
    .sort((a, b) => b.points - a.points)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function getSdrStatsForQuarter(quarterId) {
  const raw = SDR_STATS_RAW[quarterId] || [];
  return raw
    .map(s => {
      const person = PEOPLE.find(p => p.id === s.personId);
      const team = person ? TEAMS[person.teamId] : null;
      const ae = person ? PEOPLE.find(p => p.teamId === person.teamId && p.role === 'ae') : null;
      return {
        ...s,
        person,
        team,
        ae,
        points: calcPoints(s),
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

// ─── LOCAL STORAGE HELPERS (admin-uploaded photos) ──────────────────────────
export const STORAGE_KEY = 'guardz_podz_photos';

export function loadPhotos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

export function savePhoto(personId, dataUrl) {
  const photos = loadPhotos();
  photos[personId] = dataUrl;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

export function removePhoto(personId) {
  const photos = loadPhotos();
  delete photos[personId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

// ─── ADMIN PASSWORD (hashed simple) ─────────────────────────────────────────
export const ADMIN_PASS_KEY = 'guardz_admin_pass';
export const DEFAULT_ADMIN_HASH = 'guardz2026'; // plain for demo; swap with real hash in prod
