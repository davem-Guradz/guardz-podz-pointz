import React, { useState, useEffect, useCallback } from 'react';
import {
  QUARTERS, TEAMS,
  getPodStatsForQuarter, getSdrStatsForQuarter,
  loadPhotos, loadAllPhotos, calcPoints,
} from './data';
import { fetchPodStats, fetchPointTotals, fetchFYPodStats, fetchFYPointTotals, QUARTER_TABS } from './fetchSheet';
import PodLeaderboard from './PodLeaderboard';
import TopPerformers from './TopPerformers';
import SdrTable from './SdrTable';
import StatsChart from './StatsChart';
import AdminPanel from './AdminPanel';

// ─── Logo ────────────────────────────────────────────────────────────────────
function GuardzLogo({ height = 28 }) {
  return (
    <img
      src="/Guardz.png"
      alt="Guardz"
      style={{
        height,
        width: 'auto',
        display: 'block',
      }}
    />
  );
}


// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [quarterId, setQuarterId] = useState('q2-2026');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [photos, setPhotos] = useState(loadPhotos()); // localStorage seed; merged with photos.json below

  // Load committed photos.json (visible to all) merged with any localStorage overrides
  useEffect(() => {
    loadAllPhotos().then(setPhotos);
  }, []);
  const [livePods, setLivePods] = useState(null);
  const [livePointTotals, setLivePointTotals] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // Fetch live data from Google Sheet for selected quarter
  const refreshData = useCallback(() => {
    const isFY = quarterId === 'fy-2026';
    const podFetch = isFY ? fetchFYPodStats() : fetchPodStats(quarterId);
    const ptFetch = isFY ? fetchFYPointTotals() : fetchPointTotals(quarterId);

    podFetch
      .then(data => {
        if (data.length > 0) {
          const enriched = data
            .map(s => ({ ...s, team: TEAMS[s.teamId], points: calcPoints(s) }))
            .sort((a, b) => b.points - a.points)
            .map((s, i) => ({ ...s, rank: i + 1 }));
          setLivePods(enriched);
          setLastSync(new Date());
        } else {
          setLivePods(null);
        }
      })
      .catch(err => { console.warn('Sheet fetch failed, using fallback data:', err); setLivePods(null); });

    ptFetch
      .then(data => { setLivePointTotals(data.length > 0 ? data : null); })
      .catch(err => { console.warn('Point totals fetch failed:', err); setLivePointTotals(null); });
  }, [quarterId]);

  // Auto-refresh every 30 minutes + on quarter change
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Use live data if available, otherwise fall back to hardcoded
  const hasTab = quarterId === 'fy-2026' || !!QUARTER_TABS[quarterId];
  const pods = (hasTab && livePods) ? livePods : getPodStatsForQuarter(quarterId);
  const sdrs = getSdrStatsForQuarter(quarterId);

  const leader       = pods[0];
  const quarterLabel = QUARTERS.find(q => q.id === quarterId)?.label || '';

  function handlePhotoChange(personId, dataUrl) {
    setPhotos(prev => {
      const next = { ...prev };
      if (dataUrl) next[personId] = dataUrl;
      else delete next[personId];
      return next;
    });
  }

  return (
    <>
      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px', height: 60,
      }}>
        {/* Left: logo + subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <GuardzLogo height={26} />
          <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.1)' }} />
          <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, letterSpacing: 0.3 }}>
            Podz Pointz
          </span>
          <div style={{
            background: 'rgba(24,223,133,0.1)', border: '1px solid rgba(24,223,133,0.3)',
            color: '#0fb86d', fontSize: 10, fontWeight: 700,
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
              background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.1)',
              color: '#1a1a2e', fontSize: 13, padding: '6px 12px',
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

        {/* LEADER BANNER */}
        {leader && (
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(24,223,133,0.06) 100%)',
            border: '1px solid rgba(24,223,133,0.3)',
            borderRadius: 20, padding: '24px 32px',
            display: 'flex', alignItems: 'center', gap: 20,
            marginBottom: 40,
            flexWrap: 'wrap', rowGap: 16,
            animation: 'fadeInUp 0.5s ease 0.1s both',
            boxShadow: '0 2px 8px rgba(24,223,133,0.06)',
          }}>
            <div style={{ fontSize: 36 }}>🏆</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#1a1a2e' }}>
                {leader.team.name}
              </div>
              <div style={{ fontSize: 13, color: '#0fb86d', marginTop: 2 }}>
                {quarterLabel} Leaders · {leader.points} points
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { label: 'Points', value: leader.points, color: '#0fb86d' },
                { label: 'Meetings', value: leader.bql,    color: '#1a1a2e' },
                { label: 'SQLs',   value: leader.sql,    color: '#1a1a2e' },
                { label: 'Trials', value: leader.activeTrial, color: '#1a1a2e' },
                { label: 'Won',    value: leader.closedWon,   color: '#d4a017' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 800,
                    fontSize: 26, lineHeight: 1, color,
                  }}>{value}</div>
                  <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2, letterSpacing: 0.5, textTransform: 'uppercase' }}>
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

        {/* TOP TEAMS BY AE */}
        <TopPerformers pods={pods.slice(0, 3)} photos={photos} />

        {/* SDR TABLE */}
        <SdrTable pointTotals={livePointTotals} sdrs={sdrs} photos={photos} filterTeamId={selectedTeam} />

        {/* Footer */}
        <div style={{
          marginTop: 48, paddingTop: 24,
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GuardzLogo height={18} />
            <span style={{ fontSize: 12, color: '#6b7280' }}>Podz Pointz · {quarterLabel}</span>
          </div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            Scoring: BQL×1 · SQL×2 · Active Trial×3 · Closed Won×4
            {lastSync && <span style={{ marginLeft: 12, color: '#0fb86d' }}>● Live · synced {lastSync.toLocaleTimeString()}</span>}
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
