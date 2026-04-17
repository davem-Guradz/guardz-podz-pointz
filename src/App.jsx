import React, { useState, useEffect } from 'react';
import {
  QUARTERS, TEAMS,
  getPodStatsForQuarter, getSdrStatsForQuarter,
  loadPhotos,
} from './data';
import PodLeaderboard from './PodLeaderboard';
import TopPerformers from './TopPerformers';
import SdrTable from './SdrTable';
import StatsChart from './StatsChart';
import AdminPanel from './AdminPanel';

// ─── Logo SVG ────────────────────────────────────────────────────────────────
function GuardzLogo({ size = 28 }) {
  return (
    <svg width={size * 4.2} height={size} viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="22" fontFamily="'Syne',sans-serif" fontWeight="800" fontSize="24" fill="white">Guardz</text>
      <circle cx="116" cy="22" r="5" fill="#18df85" />
    </svg>
  );
}

// ─── Hero stat card ──────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: '#161b22',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: '20px 24px',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeInUp 0.4s ease both',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent || '#18df85'}, transparent)`,
        opacity: 0.6,
      }} />
      <div style={{ fontSize: 10, fontWeight: 600, color: '#8b949e', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, lineHeight: 1, color: '#e6edf3' }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#8b949e', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [quarterId, setQuarterId] = useState('q2-2026');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [photos, setPhotos] = useState(loadPhotos());

  const pods = getPodStatsForQuarter(quarterId);
  const sdrs = getSdrStatsForQuarter(quarterId);

  const totalBql      = pods.reduce((s, p) => s + p.bql, 0);
  const totalSql      = pods.reduce((s, p) => s + p.sql, 0);
  const totalTrials   = pods.reduce((s, p) => s + p.activeTrial, 0);
  const totalWon      = pods.reduce((s, p) => s + p.closedWon, 0);
  const leader        = pods[0];

  const quarterLabel  = QUARTERS.find(q => q.id === quarterId)?.label || '';

  // Group quarters by year for the selector
  const years = [...new Set(QUARTERS.map(q => q.year))];

  function handlePhotoChange(personId, dataUrl) {
    setPhotos(prev => {
      const next = { ...prev };
      if (dataUrl) next[personId] = dataUrl;
      else delete next[personId];
      return next;
    });
  }

  // Animated counter
  function AnimNum({ n }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      let start = 0;
      const step = Math.ceil(n / 20);
      const iv = setInterval(() => {
        start += step;
        if (start >= n) { setDisplay(n); clearInterval(iv); }
        else setDisplay(start);
      }, 30);
      return () => clearInterval(iv);
    }, [n]);
    return display;
  }

  return (
    <>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 40% at 75% 5%, rgba(24,223,133,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 10% 90%, rgba(24,223,133,0.03) 0%, transparent 50%)
        `,
      }} />

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(13,17,23,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 60,
      }}>
        {/* Left: logo + subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <GuardzLogo size={26} />
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 13, color: '#8b949e', fontWeight: 500, letterSpacing: 0.3 }}>
            Podz Pointz
          </span>
          <div style={{
            background: 'rgba(24,223,133,0.12)', border: '1px solid rgba(24,223,133,0.25)',
            color: '#18df85', fontSize: 10, fontWeight: 700,
            padding: '2px 9px', borderRadius: 20, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>
            {quarterLabel}
          </div>
        </div>

        {/* Right: quarter selector + admin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <select
            value={quarterId}
            onChange={e => { setQuarterId(e.target.value); setSelectedTeam(null); }}
            style={{
              background: '#1c2230', border: '1px solid rgba(255,255,255,0.1)',
              color: '#c9d1d9', fontSize: 13, padding: '6px 12px',
              borderRadius: 8, cursor: 'pointer', outline: 'none',
            }}
          >
            {QUARTERS.map(q => (
              <option key={q.id} value={q.id}>{q.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAdmin(true)}
            style={{
              background: '#18df85', color: '#0d1117',
              border: 'none', borderRadius: 8, padding: '7px 16px',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
            ⚙ Admin
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ position: 'relative', zIndex: 1, padding: '32px 28px', maxWidth: 1360, margin: '0 auto' }}>

        {/* HERO STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          <StatCard label="Total BQLs" value={totalBql} sub={`Across ${pods.length} pods`} />
          <StatCard label="Total SQLs" value={totalSql} sub="Q target: 40" accent="#64b4ff" />
          <StatCard label="Active Trials" value={totalTrials} sub="↑ pipeline health" accent="#ffb432" />
          <StatCard label="Closed Won" value={totalWon} sub={`Leader: ${leader?.team?.name}`} accent="#f4c542" />
        </div>

        {/* LEADER BANNER */}
        {leader && (
          <div style={{
            background: 'linear-gradient(135deg, #161b22 0%, rgba(24,223,133,0.06) 100%)',
            border: '1px solid rgba(24,223,133,0.3)',
            borderRadius: 20, padding: '24px 32px',
            display: 'flex', alignItems: 'center', gap: 20,
            marginBottom: 40,
            flexWrap: 'wrap', rowGap: 16,
            animation: 'fadeInUp 0.5s ease 0.1s both',
          }}>
            <div style={{ fontSize: 36 }}>🏆</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#e6edf3' }}>
                {leader.team.name}
              </div>
              <div style={{ fontSize: 13, color: '#18df85', marginTop: 2 }}>
                {quarterLabel} Leaders · {leader.points} points
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { label: 'Points', value: leader.points, color: '#18df85' },
                { label: 'BQLs',   value: leader.bql,    color: '#c9d1d9' },
                { label: 'SQLs',   value: leader.sql,    color: '#c9d1d9' },
                { label: 'Trials', value: leader.activeTrial, color: '#c9d1d9' },
                { label: 'Won',    value: leader.closedWon,   color: '#f4c542' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: 26, lineHeight: 1, color,
                  }}>{value}</div>
                  <div style={{ fontSize: 10, color: '#8b949e', marginTop: 2, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POD LEADERBOARD */}
        <PodLeaderboard
          pods={pods}
          selectedTeam={selectedTeam}
          onSelectTeam={id => setSelectedTeam(id === selectedTeam ? null : id)}
        />

        {/* CHARTS */}
        <StatsChart pods={pods} />

        {/* TOP SDR PERFORMERS */}
        <TopPerformers sdrs={sdrs.slice(0, 3)} photos={photos} />

        {/* SDR TABLE */}
        <SdrTable sdrs={sdrs} photos={photos} filterTeamId={selectedTeam} />

        {/* Footer */}
        <div style={{
          marginTop: 48, paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GuardzLogo size={18} />
            <span style={{ fontSize: 12, color: '#8b949e' }}>Podz Pointz · {quarterLabel}</span>
          </div>
          <div style={{ fontSize: 11, color: '#8b949e' }}>
            Scoring: BQL×1 · SQL×2 · Active Trial×2 · Closed Won×5
          </div>
        </div>
      </main>

      {/* ADMIN PANEL */}
      {showAdmin && (
        <AdminPanel
          photos={photos}
          onPhotosChange={handlePhotoChange}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </>
  );
}
