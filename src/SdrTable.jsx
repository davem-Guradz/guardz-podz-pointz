import React, { useState } from 'react';
import Avatar from './Avatar';

function MetricBar({ value, max, color }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ minWidth: 20, fontSize: 13, color: '#e6edf3' }}>{value}</span>
      <div style={{ width: 56, height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, flexShrink: 0 }}>
        <div style={{ height: '100%', borderRadius: 2, background: color, width: `${pct}%` }} />
      </div>
    </div>
  );
}

const SORT_KEYS = ['points', 'bql', 'sql', 'activeTrial', 'closedWon'];

export default function SdrTable({ sdrs, photos, filterTeamId }) {
  const [sort, setSort] = useState('points');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = filterTeamId
    ? sdrs.filter(s => s.person?.teamId === filterTeamId)
    : sdrs;

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sort] ?? 0, bv = b[sort] ?? 0;
    return sortDir === 'desc' ? bv - av : av - bv;
  });

  const maxBql = Math.max(...sdrs.map(s => s.bql), 1);
  const maxSql = Math.max(...sdrs.map(s => s.sql), 1);
  const maxTrial = Math.max(...sdrs.map(s => s.activeTrial), 1);

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
        fontSize: 10, fontWeight: 600, color: sort === sortKey ? '#18df85' : '#8b949e',
        letterSpacing: 1, textTransform: 'uppercase',
        cursor: sortKey ? 'pointer' : 'default',
        userSelect: 'none', whiteSpace: 'nowrap',
      }}>
      {label} {sortKey && sort === sortKey ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );

  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
        color: '#e6edf3', marginBottom: 20,
      }}>
        SDR <span style={{ color: '#18df85' }}>Individual Breakdown</span>
        {filterTeamId && (
          <span style={{ fontSize: 13, fontWeight: 400, color: '#8b949e', marginLeft: 12, fontFamily: 'var(--font-body)' }}>
            — filtered by pod
          </span>
        )}
      </div>
      <div style={{
        background: '#161b22', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.025)' }}>
                <TH label="SDR" />
                <TH label="Pod" />
                <TH label="BQL" sortKey="bql" />
                <TH label="SQL" sortKey="sql" />
                <TH label="Active Trials" sortKey="activeTrial" />
                <TH label="Closed Won" sortKey="closedWon" />
                <TH label="Points" sortKey="points" right />
              </tr>
            </thead>
            <tbody>
              {sorted.map((sdr, i) => (
                <tr
                  key={sdr.personId}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ position: 'relative' }}>
                        <Avatar person={sdr.person} photo={photos[sdr.personId]} size={36} />
                        {i < 3 && (
                          <div style={{
                            position: 'absolute', bottom: -2, right: -2,
                            fontSize: 10, lineHeight: 1,
                          }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14, color: '#e6edf3' }}>{sdr.person?.name}</div>
                        <div style={{ fontSize: 12, color: '#8b949e' }}>AE: {sdr.ae?.name || '—'}</div>
                      </div>
                    </div>
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
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#e6edf3' }}>
                    {sdr.closedWon > 0
                      ? <span style={{ color: '#18df85', fontWeight: 600 }}>🏆 {sdr.closedWon}</span>
                      : <span style={{ color: '#8b949e' }}>0</span>
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
