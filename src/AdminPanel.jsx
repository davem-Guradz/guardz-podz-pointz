import React, { useState, useRef } from 'react';
import Avatar from './Avatar';
import { PEOPLE, TEAMS, DEFAULT_ADMIN_HASH, savePhoto, removePhoto } from './data';

export default function AdminPanel({ photos, onPhotosChange, onClose }) {
  const [pass, setPass] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('photos');
  const [uploadingFor, setUploadingFor] = useState(null);
  const fileRef = useRef();

  function handleLogin(e) {
    e.preventDefault();
    if (pass === DEFAULT_ADMIN_HASH) { setAuthed(true); setError(''); }
    else setError('Incorrect password');
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      savePhoto(uploadingFor, ev.target.result);
      onPhotosChange(uploadingFor, ev.target.result);
      setUploadingFor(null);
    };
    reader.readAsDataURL(file);
  }

  const sdrs = PEOPLE.filter(p => p.role === 'sdr');
  const aes  = PEOPLE.filter(p => p.role === 'ae');

  const PersonRow = ({ person }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <Avatar person={person} photo={photos[person.id]} size={40} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, fontSize: 14, color: '#e6edf3' }}>{person.name}</div>
        <div style={{ fontSize: 12, color: '#8b949e' }}>
          {TEAMS[person.teamId]?.name} · {person.role.toUpperCase()}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => { setUploadingFor(person.id); fileRef.current.click(); }}
          style={{
            background: 'rgba(24,223,133,0.1)', border: '1px solid rgba(24,223,133,0.3)',
            color: '#18df85', fontSize: 12, padding: '4px 12px', borderRadius: 8,
          }}>
          {photos[person.id] ? 'Replace' : 'Upload'}
        </button>
        {photos[person.id] && (
          <button
            onClick={() => { removePhoto(person.id); onPhotosChange(person.id, null); }}
            style={{
              background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.2)',
              color: '#ff6464', fontSize: 12, padding: '4px 10px', borderRadius: 8,
            }}>✕</button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20,
    }}>
      <div style={{
        background: '#161b22', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20, width: '100%', maxWidth: 520,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#e6edf3' }}>
            ⚙ Admin Panel
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none',
              color: '#8b949e', fontSize: 20, cursor: 'pointer',
            }}>✕</button>
        </div>

        {!authed ? (
          <form onSubmit={handleLogin} style={{ padding: 32 }}>
            <div style={{ marginBottom: 8, fontSize: 14, color: '#8b949e' }}>Enter admin password</div>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Password"
              autoFocus
              style={{
                width: '100%', background: '#0d1117', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '10px 14px', color: '#e6edf3', fontSize: 14,
                outline: 'none', marginBottom: 12,
              }}
            />
            {error && <div style={{ color: '#ff6464', fontSize: 13, marginBottom: 12 }}>{error}</div>}
            <button
              type="submit"
              style={{
                width: '100%', background: '#18df85', color: '#0d1117',
                border: 'none', borderRadius: 10, padding: '10px 0',
                fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, cursor: 'pointer',
              }}>Login</button>
            <div style={{ fontSize: 12, color: '#8b949e', marginTop: 12, textAlign: 'center' }}>
              Default password: <code style={{ color: '#18df85' }}>guardz2026</code>
            </div>
          </form>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, padding: '16px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['photos', 'info'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: tab === t ? '2px solid #18df85' : '2px solid transparent',
                  color: tab === t ? '#18df85' : '#8b949e',
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 13,
                  padding: '8px 16px', cursor: 'pointer', textTransform: 'capitalize',
                }}>{t}</button>
              ))}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {tab === 'photos' && (
                <>
                  <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 16 }}>
                    Upload profile photos for SDRs and AEs. Photos are saved locally in the browser.
                  </div>
                  <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 12, color: '#8b949e', letterSpacing: 1, textTransform: 'uppercase' }}>SDRs</div>
                  {sdrs.map(p => <PersonRow key={p.id} person={p} />)}
                  <div style={{ marginTop: 20, marginBottom: 16, fontWeight: 500, fontSize: 12, color: '#8b949e', letterSpacing: 1, textTransform: 'uppercase' }}>AEs</div>
                  {aes.map(p => <PersonRow key={p.id} person={p} />)}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                </>
              )}
              {tab === 'info' && (
                <div style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.7 }}>
                  <div style={{ fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>Point System</div>
                  <div>• BQL = <strong style={{ color: '#18df85' }}>1 point</strong></div>
                  <div>• SQL = <strong style={{ color: '#18df85' }}>2 points</strong></div>
                  <div>• Active Trial = <strong style={{ color: '#18df85' }}>3 points</strong></div>
                  <div>• Closed Won = <strong style={{ color: '#18df85' }}>4 points</strong></div>
                  <div style={{ marginTop: 20, fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>Data</div>
                  <div>To update data for a new period, edit <code style={{ color: '#18df85' }}>src/data.js</code> and add entries to <code style={{ color: '#18df85' }}>POD_STATS_RAW</code> and <code style={{ color: '#18df85' }}>SDR_STATS_RAW</code>.</div>
                  <div style={{ marginTop: 20, fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>Security</div>
                  <div>Change the admin password by updating <code style={{ color: '#18df85' }}>DEFAULT_ADMIN_HASH</code> in <code style={{ color: '#18df85' }}>src/data.js</code>. For production, use a proper auth solution.</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
