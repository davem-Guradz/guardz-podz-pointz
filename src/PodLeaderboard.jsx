import React from 'react';

const rankColors = {
  1: { badge: '#f4c542', badgeText: '#1a0f00', border: 'rgba(244,197,66,0.4)', glow: 'rgba(244,197,66,0.06)' },
  2: { badge: '#adb5bd', badgeText: '#0d0d0d', border: 'rgba(173,181,189,0.3)', glow: 'none' },
  3: { badge: '#cd7f32', badgeText: '#ffffff', border: 'rgba(205,127,50,0.3)', glow: 'none' },
  4: { badge: '#e9ecef', badgeText: '#6b7280', border: 'rgba(0,0,0,0.08)', glow: 'none' },
  5: { badge: '#e9ecef', badgeText: '#6b7280', border: 'rgba(0,0,0,0.08)', glow: 'none' },
};

function PodCard({ pod, onSelect, selected }) {
  const rc = rankColors[pod.rank] || rankColors[5];
  const maxPts = 150;
  const pct = Math.min(100, Math.round((pod.points / maxPts) * 100));

  return (
    <div
      onClick={() => onSelect && onSelect(pod.teamId)}
      style={{
        background: selected
          ? `linear-gradient(145deg, #ffffff, rgba(24,223,133,0.04))`
          : '#ffffff',
        border: `1px solid ${selected ? pod.team.color + '66' : rc.border}`,
        borderRadius: 20,
        padding: '28px 20px 20px',
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: selected ? `0 8px 32px ${pod.team.color}14` : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* rank badge */}
      <div style={{
        position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
        width: 26, height: 26, borderRadius: '50%',
        background: rc.badge, color: rc.badgeText,
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{pod.rank}</div>

      {/* team color dot */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: pod.team.color }} />
      </div>

      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
        color: '#1a1a2e', marginBottom: 14, minHeight: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{pod.team.name}</div>

      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 44, lineHeight: 1, color: pod.team.color,
        marginBottom: 2,
      }}>{pod.points}</div>
      <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
        points
      </div>

      {/* progress bar */}
      <div style={{ height: 3, background: 'rgba(0,0,0,0.06)', borderRadius: 2, marginBottom: 16 }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: pod.team.color,
          width: `${pct}%`,
          transition: 'width 0.6s ease',
        }} />
      </div>

      {/* chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {[
          { l: 'BQL', v: pod.bql },
          { l: 'SQL', v: pod.sql },
          { l: 'Trial', v: pod.activeTrial },
          { l: 'Won', v: pod.closedWon },
        ].map(({ l, v }) => (
          <div key={l} style={{
            background: '#f3f4f6',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 8, padding: '3px 8px',
            fontSize: 11, color: '#6b7280',
          }}>
            <span style={{ color: '#1a1a2e', fontWeight: 600 }}>{v}</span> {l}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PodLeaderboard({ pods, selectedTeam, onSelectTeam }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>
          Pod <span style={{ color: '#18df85' }}>Leaderboard</span>
        </div>
        {selectedTeam && (
          <button
            onClick={() => onSelectTeam(null)}
            style={{
              background: 'transparent', border: '1px solid rgba(0,0,0,0.1)',
              color: '#6b7280', fontSize: 12, padding: '4px 12px', borderRadius: 8,
            }}>
            Clear filter ✕
          </button>
        )}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16,
      }}>
        {pods.map(pod => (
          <PodCard
            key={pod.teamId}
            pod={pod}
            selected={selectedTeam === pod.teamId}
            onSelect={onSelectTeam}
          />
        ))}
      </div>
    </div>
  );
}
