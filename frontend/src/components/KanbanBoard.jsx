import React from 'react';
import TaskCard from './TaskCard';

export default function KanbanBoard({ columns, tasks, onDragStart, onDrop, handleSmartAssign, dragOverColumn, setDragOverColumn }) {
  return (
    <div className="kanban-board">
      {columns.map(col => (
        <div
          className={`kanban-column${dragOverColumn === col.key ? ' drag-over' : ''}`}
          key={col.key}
          onDragOver={e => { e.preventDefault(); setDragOverColumn(col.key); }}
          onDragLeave={e => { if (dragOverColumn === col.key) setDragOverColumn(null); }}
          onDrop={() => { onDrop(col.key); setDragOverColumn(null); }}
        >
          <div className="kanban-column-title">{col.label}</div>
          {Array.isArray(tasks) && tasks.filter(t => t.status === col.key && t._id && t.title).map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onDragStart={onDragStart}
              onSmartAssign={handleSmartAssign}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
