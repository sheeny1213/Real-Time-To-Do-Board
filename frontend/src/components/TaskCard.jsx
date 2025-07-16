import React from 'react';

export default function TaskCard({ task, onDragStart, onSmartAssign }) {
  return (
    <div
      className="task-card animate"
      draggable
      onDragStart={() => onDragStart(task)}
      tabIndex={0}
      aria-label={`Task: ${task.title}, assigned to ${task.assigned}, priority ${task.priority}`}
      style={{ transition: 'box-shadow 0.2s, transform 0.2s' }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{task.title}</div>
      <div style={{ fontSize: '0.95em', color: 'var(--muted)', marginBottom: 6 }}>{task.description}</div>
      <div style={{ fontSize: '0.85em', color: 'var(--primary)' }}>Assigned: {task.assigned}</div>
      <div style={{ fontSize: '0.85em', color: '#b36b00' }}>Priority: {task.priority}</div>
      <button
        onClick={() => onSmartAssign(task._id)}
        style={{ marginTop: 8, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontWeight: 500, cursor: 'pointer' }}
        aria-label="Smart Assign"
      >
        Smart Assign
      </button>
    </div>
  );
}
