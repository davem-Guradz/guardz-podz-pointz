import React from 'react';
import Avatar from './Avatar';
import { PEOPLE } from './data';

export default function TopPerformers({ pods, photos }) {
  if (!pods || pods.length < 3) return null;

  const [first, second, third] = pods;

  const Card = ({ pod, medal, glow }) => {
    const ae = PEOPLE.find(p => p.teamId === pod.teamId && p.role === 'ae');

    return (
      <div style={{
        background: '#ffffff',
        border: `1px solid ${glow ? 'rgba(24,223,133,0.4)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 20,
        padding: '28px 24px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: glow ? '0 4px 24px rgba(24,223,133,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
          fontSize: 24,
        }}>{medal}</div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <Avatar person={ae} photo={ae ? photos[ae.id] : null} size={64} />
            {glow && (
              <div style={{
                position: 'absolute', inset: -3, borderRadius: '50%',
                border: '2px solid rgba(24,223,133,0.5)',
                animation: 'pulse-green 2s infinite',
              }} />
            )}
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 2 }}>
          {ae?.name || 'AE'}
        </div>
        <div style={{ fontSize: 11, color: pod.team?.color || '#6b7280', marginBottom: 16, fontWeight: 500 }}>
          {pod.team?.name}
        </div>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#18df85', lineHeight: 1 }}>{pod.points}</div>
            <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>Points</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#1a1a2e', lineHeight: 1 }}>{pod.sql}</div>
            <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>SQLs</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#1a1a2e', lineHeight: 1 }}>{pod.closedWon}</div>
            <div style={{ fontSize: 10, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>Won</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#1a1a2e',
      }}>
        🏆 Top <span style={{ color: '#18df85' }}>Teams by AE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 16 }}>
        <div style={{ paddingTop: 24 }}>
          <Card pod={second} medal="🥈" glow={false} />
        </div>
        <Card pod={first} medal="🥇" glow={true} />
        <div style={{ paddingTop: 24 }}>
          <Card pod={third} medal="🥉" glow={false} />
        </div>
      </div>
    </div>
  );
}
