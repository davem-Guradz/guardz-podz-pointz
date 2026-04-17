import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, CartesianGrid,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1c2230', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, color: '#e6edf3', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || '#18df85', marginBottom: 2 }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function StatsChart({ pods }) {
  const data = pods.map(p => ({
    name: p.team.name.length > 12 ? p.team.name.slice(0, 11) + '…' : p.team.name,
    fullName: p.team.name,
    BQL: p.bql,
    SQL: p.sql,
    Trials: p.activeTrial,
    Won: p.closedWon,
    color: p.team.color,
  }));

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#e6edf3', marginBottom: 24 }}>
        Pod <span style={{ color: '#18df85' }}>Activity Breakdown</span>
      </div>
      <div style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 16px' }}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barCategoryGap="30%" barGap={4}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#8b949e', fontSize: 11, fontFamily: 'DM Sans' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: '#8b949e', fontSize: 11, fontFamily: 'DM Sans' }}
              axisLine={false} tickLine={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="BQL" radius={[4,4,0,0]}>
              {data.map((d, i) => <Cell key={i} fill={d.color + 'cc'} />)}
            </Bar>
            <Bar dataKey="SQL" radius={[4,4,0,0]}>
              {data.map((d, i) => <Cell key={i} fill={d.color + '88'} />)}
            </Bar>
            <Bar dataKey="Trials" radius={[4,4,0,0]}>
              {data.map((d, i) => <Cell key={i} fill={d.color + '55'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 8 }}>
          {[['BQL', 'cc'], ['SQL', '88'], ['Trials', '55']].map(([l, a]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8b949e' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#18df85' + a }} />
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
