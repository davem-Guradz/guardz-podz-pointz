import React from 'react';
import Avatar from './Avatar';

export default function TopPerformers({ sdrs, photos }) {
  if (!sdrs || sdrs.length < 3) return null;

  const [first, second, third] = sdrs;

  const Card = ({ sdr, medal, glow }) => (
    <div style={{
      background: 'linear-gradient(145deg, #161b22, #1c2230)',
      border: `1px solid ${glow ? 'rgba(24,223,133,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 20,
      padding: '28px 24px',
      textAlign: 'center',
      position: 'relative',
      boxShadow: glow ? '0 0 40px rgba(24,223,133,0.08)' : 'none',
      transition: 'transform 0.2s',
    }}>
      <div style={{
        position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
        fontSize: 24,
      }}>{medal}</div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{ position: 'relative' }}>
          <Avatar person={sdr.person} photo={photos[sdr.personId]} size={64} />
          {glow && (
            <div style={{
              position: 'absolute', inset: -3, borderRadius: '50%',
              border: '2px solid rgba(24,223,133,0.5)',
              animation: 'pulse-green 2s infinite',
            }} />
          )}
        </div>
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#e6edf3', marginBottom: 4 }}>
        {sdr.person?.name}
      </div>
      <div style={{ fontSize: 11, color: sdr.team?.color || '#8b949e', marginBottom: 16, fontWeight: 500 }}>
        {sdr.team?.name}
      </div>

      <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#18df85', lineHeight: 1 }}>{sdr.points}</div>
          <div style={{ fontSize: 10, color: '#8b949e', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>Points</div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#e6edf3', lineHeight: 1 }}>{sdr.sql}</div>
          <div style={{ fontSize: 10, color: '#8b949e', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>SQLs</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#e6edf3',
      }}>
        🏆 Top <span style={{ color: '#18df85' }}>SDR Performers</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 16 }}>
        <div style={{ paddingTop: 24 }}>
          <Card sdr={second} medal="🥈" glow={false} />
        </div>
        <Card sdr={first} medal="🥇" glow={true} />
        <div style={{ paddingTop: 24 }}>
          <Card sdr={third} medal="🥉" glow={false} />
        </div>
      </div>
    </div>
  );
}
