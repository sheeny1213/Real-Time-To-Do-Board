import React from 'react';

const actionIcons = {
  created: '🟢',
  updated: '✏️',
  deleted: '🗑️',
  assigned: '👤',
  'drag-drop': '➡️',
};

function getActionIcon(action) {
  if (!action) return '';
  if (action.includes('created')) return actionIcons.created;
  if (action.includes('updated')) return actionIcons.updated;
  if (action.includes('deleted')) return actionIcons.deleted;
  if (action.includes('assigned')) return actionIcons.assigned;
  if (action.includes('drag-drop')) return actionIcons['drag-drop'];
  return '📝';
}

export default function ActivityLogPanel({ activityLog, className = '' }) {
  // Defensive: always use an array
  activityLog = Array.isArray(activityLog) ? activityLog : [];
  // Group repeated actions by user/action/task within 1 minute
  const grouped = [];
  let prev = null;
  activityLog.forEach((entry) => {
    const time = new Date(entry.createdAt);
    if (
      prev &&
      prev.user === entry.user &&
      prev.action === entry.action &&
      prev.taskTitle === entry.taskTitle &&
      Math.abs(new Date(prev.createdAt) - time) < 60000
    ) {
      prev.count = (prev.count || 1) + 1;
      prev.times = prev.times || [prev.createdAt];
      prev.times.push(entry.createdAt);
    } else {
      prev = { ...entry };
      grouped.push(prev);
    }
  });

  return (
    <aside className={`activity-log-panel${className ? ' ' + className : ''}`} style={{
      background: 'var(--card-bg)',
      borderRadius: 14,
      boxShadow: 'var(--shadow)',
      padding: '22px 18px 18px 18px',
      minWidth: 0,
      maxWidth: '100vw',
      width: '100%',
      maxHeight: 340,
      overflowY: 'auto',
      border: '1.5px solid var(--border)',
      marginLeft: 8,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      boxSizing: 'border-box',
      wordBreak: 'break-word',
    }}>
      <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 14, fontSize: '1.13em', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Activity Log</span>
        <span style={{ fontSize: '1.2em' }}>📝</span>
      </div>
      {grouped.length === 0 && <div style={{ color: 'var(--muted)' }}>No activity yet.</div>}
      <div style={{
        position: 'relative',
        paddingLeft: 22,
        borderLeft: '3px solid var(--primary)',
        minHeight: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        {grouped.map((entry, i) => (
          <div key={i} style={{
            position: 'relative',
            marginBottom: 18,
            paddingBottom: 2,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            {/* Timeline dot */}
            <span style={{
              position: 'absolute',
              left: -13,
              top: 7,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#fff',
              border: '3px solid var(--primary)',
              boxShadow: '0 1px 4px 0 rgba(58,122,254,0.10)',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9em',
            }}>{getActionIcon(entry.action)}</span>
            <div style={{
              background: '#f7f9fb',
              borderRadius: 8,
              padding: '8px 12px',
              boxShadow: '0 1px 4px 0 rgba(58,122,254,0.04)',
              minWidth: 0,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{entry.user}</span>
                <span style={{ color: '#555' }}>{entry.action}</span>
                <span style={{ color: '#b36b00', fontWeight: 500 }}>{entry.taskTitle}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.93em', marginLeft: 'auto' }}>{
                  entry.count ? `${entry.count}× ` : ''
                }{new Date(entry.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
