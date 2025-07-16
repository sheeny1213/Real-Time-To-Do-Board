import React, { useContext, useState, useEffect } from 'react';
import { AuthContext, AuthProvider } from './AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { socket } from './utils/socket';
import KanbanBoard from './components/KanbanBoard';
import ActivityLogPanel from './components/ActivityLogPanel';
import Modal from './components/Modal';
import ConflictModal from './components/ConflictModal';

function AppRoutes() {
  const { user, logout } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);
  const [tasks, setTasks] = useState([]);
  // Defensive: always use an array for tasks
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', assigned: '' });
  const [modalError, setModalError] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [showActivityLog, setShowActivityLog] = useState(true);

  // Proper form change handler (removed duplicate)

  // Kanban columns and users
  const columns = [
    { key: 'Todo', label: 'Todo' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Done', label: 'Done' },
  ];
  const users = Array.from(new Set(safeTasks.map(t => t.assigned).concat(user ? user.username : [])));
    
  // Fetch tasks and activity log on mount
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch('/api/tasks', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(async res => {
        if (res.status === 401) {
          logout();
          return [];
        }
        return res.json();
      })
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setTasks([]));
    fetch('/api/tasks/actions/log', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(async res => {
        if (res.status === 401) {
          logout();
          return [];
        }
        return res.json();
      })
      .then(data => setActivityLog(Array.isArray(data) ? data : []))
      .catch(() => setActivityLog([]));
    setLoading(false);
  }, [user, logout]);

  // Real-time updates (Socket.IO)
  useEffect(() => {
    if (!user) return;
    socket.connect();
    socket.on('tasks:update', (serverTasks) => {
      setTasks(serverTasks);
    });
    return () => {
      socket.disconnect();
    };
  }, [user]);

  if (!user) {
    return showRegister ? (
      <Register onSuccess={() => setShowRegister(false)} />
    ) : (
      <div>
        <Login onSuccess={() => window.location.reload()} />
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button onClick={() => setShowRegister(true)} style={{ background: 'none', color: 'var(--primary)', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>No account? Register</button>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;

  
  
  // Only reset form when opening or closing modal, never during typing
  const openModal = () => {
    if (!showModal) {
      const initialAssigned = users && users.length > 0 ? users[0] : '';
      setForm({ title: '', description: '', priority: 'Medium', assigned: initialAssigned });
      setModalError('');
    }
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      const initialAssigned = users && users.length > 0 ? users[0] : '';
      setForm({ title: '', description: '', priority: 'Medium', assigned: initialAssigned });
      setModalError('');
    }, 300);
  };

  // Robust onChange handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setModalError('');
  };

  // Add Task
  const handleAddTask = async e => {
    e.preventDefault();
    if (!form.title.trim()) return setModalError('Title required');
    if (columns.some(c => c.key.toLowerCase() === form.title.trim().toLowerCase())) return setModalError('Title cannot match column name');
    if (tasks.some(t => t.title.trim().toLowerCase() === form.title.trim().toLowerCase())) return setModalError('Title must be unique');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ ...form, status: 'Todo' })
      });
      if (!res.ok) {
        const data = await res.json();
        return setModalError(data.message || 'Failed to add task');
      }
      const newTask = await res.json();
      setTasks([...safeTasks, newTask]);
      setShowModal(false);
    } catch {
      setModalError('Network error');
    }
  };

    const onDragStart = (task) => setDraggedTask(task);
  const onDrop = async (colKey) => {
    if (draggedTask) {
      try {
        const res = await fetch(`/api/tasks/${draggedTask._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify({ ...draggedTask, status: colKey, version: draggedTask.version })
        });
        if (res.status === 409) {
          const data = await res.json();
          setConflict({ local: { ...draggedTask, status: colKey }, server: data.serverTask });
          return;
        }
        if (!res.ok) return;
        const updated = await res.json();
        setTasks(tasks => Array.isArray(tasks) ? tasks.map(t => t._id === updated._id ? updated : t) : []);
      } catch {}
      setDraggedTask(null);
    }
  };

  // Smart Assign
  const handleSmartAssign = async (taskId) => {
    const task = safeTasks.find(t => t._id === taskId);
    const activeCounts = users.reduce((acc, user) => {
      acc[user] = safeTasks.filter(t => t.assigned === user && t.status !== 'Done').length;
      return acc;
    }, {});
    const minUser = Object.entries(activeCounts).sort((a, b) => a[1] - b[1])[0][0];
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ ...task, assigned: minUser, version: task.version })
      });
      if (res.status === 409) {
        const data = await res.json();
        setConflict({ local: { ...task, assigned: minUser }, server: data.serverTask });
        return;
      }
      if (!res.ok) return;
      const updated = await res.json();
      setTasks(tasks => Array.isArray(tasks) ? tasks.map(t => t._id === updated._id ? updated : t) : []);
    } catch {}
  };

  // Conflict resolution
  const handleResolveConflict = async (action) => {
    if (!conflict) return;
    if (action === 'overwrite') {
      try {
        const res = await fetch(`/api/tasks/${conflict.local._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify({ ...conflict.local, version: conflict.server.version })
        });
        if (!res.ok) return;
        const updated = await res.json();
        setTasks(tasks => tasks.map(t => t._id === updated._id ? updated : t));
        setConflict(null);
      } catch {}
    } else if (action === 'merge') {
      // Simple merge: prefer local changes, but keep server's version
      try {
        const merged = { ...conflict.server, ...conflict.local, version: conflict.server.version };
        const res = await fetch(`/api/tasks/${conflict.local._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
          body: JSON.stringify(merged)
        });
        if (!res.ok) return;
        const updated = await res.json();
        setTasks(tasks => tasks.map(t => t._id === updated._id ? updated : t));
        setConflict(null);
      } catch {}
    } else {
      setConflict(null);
    }
  };

  
  return (
    <div className="app-container">
      <header className="header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'linear-gradient(90deg, #eaf1ff 0%, #f7f9fb 100%)',
        boxShadow: '0 2px 8px 0 rgba(58,122,254,0.04)',
        borderBottom: '1px solid var(--border)',
        padding: '22px 4vw 14px 4vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 32, marginRight: 8 }}>📝</span>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, letterSpacing: '-1px', color: 'var(--primary)' }}>
            Real-Time Collaborative To-Do Board
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 16 }}>Hi, {user.username}</span>
          <button
            onClick={logout}
            style={{
              background: '#fff',
              color: 'var(--primary)',
              border: '1.5px solid var(--primary)',
              borderRadius: '8px',
              padding: '10px 18px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
              marginLeft: 0,
              marginRight: 2,
              transition: 'background 0.18s, color 0.18s',
            }}
            onMouseOver={e => { e.target.style.background = 'var(--primary)'; e.target.style.color = '#fff'; }}
            onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.color = 'var(--primary)'; }}
          >
            Logout
          </button>
          <button
            onClick={openModal}
            style={{
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow)',
              marginLeft: 6,
              fontSize: 16,
              transition: 'background 0.18s',
            }}
            onMouseOver={e => { e.target.style.background = '#2556b8'; }}
            onMouseOut={e => { e.target.style.background = 'var(--primary)'; }}
          >
            + Add Task
          </button>
        </div>
      </header>
      <main style={{
        width: '100%',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr minmax(260px, 320px)',
        alignItems: 'flex-start',
        background: 'linear-gradient(135deg, #f7f9fb 0%, #eaf1ff 100%)',
        minHeight: 'calc(100vh - 80px)',
        padding: '32px 2vw 32px 2vw',
        gap: 36,
        boxSizing: 'border-box',
        position: 'relative',
      }}>
        <div style={{
          background: 'var(--card-bg)',
          borderRadius: 18,
          boxShadow: '0 4px 24px 0 rgba(58,122,254,0.07)',
          padding: '28px 18px 28px 18px',
          minHeight: 420,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <KanbanBoard
            columns={columns}
            tasks={tasks}
            onDragStart={onDragStart}
            onDrop={onDrop}
            handleSmartAssign={handleSmartAssign}
            dragOverColumn={dragOverColumn}
            setDragOverColumn={setDragOverColumn}
          />
        </div>
          {/* Collapsible Activity Log for mobile */}
          <ActivityLogPanel activityLog={activityLog} className={showActivityLog ? 'show' : ''} />
      </main>
      {/* Floating Action Buttons for mobile */}
      <button
        className="fab-add-task"
        aria-label="Add Task"
        onClick={openModal}
      >
        +
      </button>
      <button
        className="activity-log-toggle"
        aria-label="Toggle Activity Log"
        onClick={() => setShowActivityLog(v => !v)}
      >
        📝
      </button>
      <Modal
        show={showModal}
        onClose={closeModal}
        onSubmit={handleAddTask}
        form={form}
        onChange={handleFormChange}
        error={modalError}
        users={users}
      />
      <ConflictModal conflict={conflict} handleResolveConflict={handleResolveConflict} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
