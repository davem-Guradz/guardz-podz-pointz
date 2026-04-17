import React from 'react';

const COLORS = [
  ['rgba(24,223,133,0.18)',  '#18df85'],
  ['rgba(100,180,255,0.18)', '#64b4ff'],
  ['rgba(255,180,50,0.18)',  '#ffb432'],
  ['rgba(180,100,255,0.18)', '#b464ff'],
  ['rgba(255,100,100,0.18)', '#ff6464'],
  ['rgba(255,150,80,0.18)',  '#ff9650'],
  ['rgba(80,200,220,0.18)',  '#50c8dc'],
];

function colorForInitials(initials) {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) hash += initials.charCodeAt(i);
  return COLORS[hash % COLORS.length];
}

export default function Avatar({ person, photo, size = 40, className = '' }) {
  const initials = person?.initials || '??';
  const [bg, fg] = colorForInitials(initials);

  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: Math.round(size * 0.32),
    fontWeight: 700,
    fontFamily: 'var(--font-body)',
    overflow: 'hidden',
    border: '2px solid rgba(0,0,0,0.06)',
  };

  if (photo) {
    return (
      <div style={{ ...style, background: bg }} className={className}>
        <img src={photo} alt={person?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={{ ...style, background: bg, color: fg }} className={className}>
      {initials}
    </div>
  );
}
