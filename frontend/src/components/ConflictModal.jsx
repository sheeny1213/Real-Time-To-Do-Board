import React from 'react';

export default function ConflictModal({ conflict, handleResolveConflict }) {
  if (!conflict) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow)', padding: 32, minWidth: 340 }}>
        <h3>Conflict Detected</h3>
        <p>Another user has updated this task. Choose how to resolve:</p>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Your Version</div>
            <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 6 }}>{JSON.stringify(conflict.local, null, 2)}</pre>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Server Version</div>
            <pre style={{ background: '#f7f7f7', padding: 8, borderRadius: 6 }}>{JSON.stringify(conflict.server, null, 2)}</pre>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => handleResolveConflict('overwrite')} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Overwrite</button>
          <button onClick={() => handleResolveConflict('merge')} style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Merge</button>
          <button onClick={() => handleResolveConflict('cancel')} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
