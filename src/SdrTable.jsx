import React, { useState } from 'react';
import { TEAMS } from './data';

function MetricBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ minWidth: 20, fontSize: 13, color: '#1a1a2e' }}>{value}</span>
      <div style={{ width: 56, height: 3, background: 'rgba(0,0,0,0.06)', borderRadius: 2, flexShrink: 0 }}>
        <div style={{ height: '100%', borderRadius: 2, background: color, width: `${pct}%` }} />
      </div>
    </div>
  );
}

const SORT_KEYS = ['total', 'bqlPts', 'sqlPts', 'activeTrialPts', 'closedWonPts'];

export default function SdrTable({ pointTotals, sdrs, photos, filterTeamId }) {
  const [sort, setSort] = useState('total');
  const [sortDir, setSortDir] = useState('desc');

  const useLive = pointTotals && pointTotals.length > 0;

  function toggleSort(key) {
    if (sort === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSort(key); setSortDir('desc'); }
  }

  const TH = ({ label, sortKey, right }) => (
    <th
      onClick={() => sortKey && toggleSort(sortKey)}
      style={{
        padding: '12px 16px',
        textAlign: right ? 'right' : 'left',
        fontSize: 10, fontWeight: 600, color: sort === sortKey ? '#0fb86d' : '#6b7280',
        letterSpacing: 1, textTransform: 'uppercase',
        cursor: sortKey ? 'pointer' : 'default',
        userSelect: 'none', whiteSpace: 'nowrap',
      }}>
      {label} {sortKey && sort === sortKey ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );

  if (useLive) {
    const filtered = filterTeamId
      ? pointTotals.filter(r => r.teamId === filterTeamId)
      : pointTotals;

    const sorted = [...filtered].sort((a, b) => {
      const av = a[sort] ?? 0, bv = b[sort] ?? 0;
      return sortDir === 'desc' ? bv - av : av - bv;
    });

    const maxBql = Math.max(...pointTotals.map(r => r.bqlPts), 1);
    const maxSql = Math.max(...pointTotals.map(r => r.sqlPts), 1);
    const maxTrial = Math.max(...pointTotals.map(r => r.activeTrialPts), 1);

    return (
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
          color: '#1a1a2e', marginBottom: 20,
        }}>
          Pod <span style={{ color: '#18df85' }}>Point Totals</span>
          {filterTeamId && (
            <span style={{ fontSize: 13, fontWeight: 400, color: '#6b7280', marginLeft: 12, fontFamily: 'var(--font-body)' }}>
              — filtered by pod
            </span>
          )}
        </div>
        <div style={{
          background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <TH label="AE" />
                  <TH label="SDR" />
                  <TH label="SDR" />
                  <TH label="Team" />
                  <TH label="Completed Meeting Count" sortKey="bqlPts" />
                  <TH label="SQL" sortKey="sqlPts" />
                  <TH label="Active Trial" sortKey="activeTrialPts" />
                  <TH label="Closed Won" sortKey="closedWonPts" />
                  <TH label="Total" sortKey="total" right />
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => {
                  const team = TEAMS[row.teamId];
                  const color = team?.color || '#18df85';
                  return (
                    <tr
                      key={row.teamId}
                      style={{ borderTop: '1px solid rgba(0,0,0,0.06)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#1a1a2e', fontWeight: 500 }}>{row.ae}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#4a5568' }}>{row.sdr1}</td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: '#4a5568' }}>{row.sdr2}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                          background: color + '18', color,
                          border: `1px solid ${color}33`,
                          whiteSpace: 'nowrap',
                        }}>{row.teamName}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <MetricBar value={row.bqlPts} max={maxBql} color={color} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <MetricBar value={row.sqlPts} max={maxSql} color={color} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <MetricBar value={row.activeTrialPts} max={maxTrial} color={color} />
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#1a1a2e' }}>
                        {row.closedWonPts > 0
                          ? <span style={{ color: '#0fb86d', fontWeight: 600 }}>🏆 {row.closedWonPts}</span>
                          : <span style={{ color: '#6b7280' }}>0</span>
                        }
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <span style={{
                          fontFamily: 'var(--font-display)', fontWeight: 800,
                          fontSize: 20, color,
                        }}>{row.total}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Fallback: original SDR individual view (hardcoded data)
  const filtered = filterTeamId
    ? sdrs.filter(s => s.person?.teamId === filterTeamId)
    : sdrs;

  const sorted = [...filtered].sort((a, b) => {
    const key = sort === 'total' ? 'points' : sort.replace('Pts', '');
    const av = a[key] ?? 0, bv = b[key] ?? 0;
    return sortDir === 'desc' ? bv - av : av - bv;
  });

  const maxBql = Math.max(...sdrs.map(s => s.bql), 1);
  const maxSql = Math.max(...sdrs.map(s => s.sql), 1);
  const maxTrial = Math.max(...sdrs.map(s => s.activeTrial), 1);

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
        color: '#1a1a2e', marginBottom: 20,
      }}>
        SDR <span style={{ color: '#18df85' }}>Individual Breakdown</span>
      </div>
      <div style={{
        background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <TH label="SDR" />
                <TH label="Pod" />
                <TH label="Completed Meeting Count" sortKey="bqlPts" />
                <TH label="SQL" sortKey="sqlPts" />
                <TH label="Active Trials" sortKey="activeTrialPts" />
                <TH label="Closed Won" sortKey="closedWonPts" />
                <TH label="Points" sortKey="total" right />
              </tr>
            </thead>
            <tbody>
              {sorted.map((sdr) => (
                <tr
                  key={sdr.personId}
                  style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: '#1a1a2e' }}>{sdr.person?.name}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500,
                      background: (sdr.team?.color || '#18df85') + '18',
                      color: sdr.team?.color || '#18df85',
                      border: `1px solid ${(sdr.team?.color || '#18df85')}33`,
                      whiteSpace: 'nowrap',
                    }}>{sdr.team?.name}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <MetricBar value={sdr.bql} max={maxBql} color={sdr.team?.color || '#18df85'} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <MetricBar value={sdr.sql} max={maxSql} color={sdr.team?.color || '#18df85'} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <MetricBar value={sdr.activeTrial} max={maxTrial} color={sdr.team?.color || '#18df85'} />
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#1a1a2e' }}>
                    {sdr.closedWon > 0
                      ? <span style={{ color: '#0fb86d', fontWeight: 600 }}>🏆 {sdr.closedWon}</span>
                      : <span style={{ color: '#6b7280' }}>0</span>
                    }
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: 20, color: sdr.team?.color || '#18df85',
                    }}>{sdr.points}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
