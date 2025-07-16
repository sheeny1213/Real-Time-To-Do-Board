import React, { useRef, useEffect, useState } from 'react';

export default function Modal({ show, onClose, onSubmit, form, onChange, error, users }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const titleRef = useRef(null);
  useEffect(() => {
    if (show && titleRef.current) {
      titleRef.current.focus();
    }
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (show) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);
  if (!show) return null;
  const safeForm = {
    title: form.title || '',
    description: form.description || '',
    priority: form.priority || 'Medium',
    assigned: form.assigned || (users && users.length > 0 ? users[0] : ''),
  };
  const handleSubmit = async (e) => {
    setSubmitting(true);
    const result = await onSubmit(e);
    setSubmitting(false);
    if (result !== false) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 900);
    }
  };
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.18)' }} aria-modal="true" role="dialog">
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 8px 40px 0 rgba(58,122,254,0.13)', padding: '38px 28px 28px 28px', minWidth: 280, maxWidth: '98vw', width: 370, display: 'flex', flexDirection: 'column', gap: 22, position: 'relative', border: '1.5px solid #eaf1ff' }}>
        <button type="button" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 26, color: '#b0b8c9', cursor: 'pointer', fontWeight: 700, transition: 'color 0.2s' }}>&times;</button>
        <h2 style={{ margin: '0 0 18px 0', textAlign: 'center', color: '#2556b8', fontWeight: 800, fontSize: 25, letterSpacing: '-1px' }}>Add Task</h2>
        {success ? (
          <div style={{ textAlign: 'center', color: '#4caf50', fontWeight: 700, fontSize: 20, padding: '24px 0 16px 0' }}>
            ✓ Task Added!
          </div>
        ) : <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontWeight: 700, marginBottom: 2, fontSize: 15, color: '#222' }}>Title <span style={{ color: '#d32f2f' }}>*</span></label>
          <input ref={titleRef} name="title" value={safeForm.title} onChange={onChange} required aria-label="Title" autoComplete="off" style={{ width: '100%', padding: '12px 10px', borderRadius: 8, border: error && !safeForm.title ? '2px solid #d32f2f' : '1.5px solid #b0b8c9', outline: 'none', fontSize: 16, background: '#f7f9fb', marginBottom: 2, fontWeight: 500, transition: 'border 0.2s' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontWeight: 700, marginBottom: 2, fontSize: 15, color: '#222' }}>Description</label>
          <textarea name="description" value={safeForm.description} onChange={onChange} required aria-label="Description" autoComplete="off" style={{ width: '100%', padding: '12px 10px', borderRadius: 8, border: '1.5px solid #b0b8c9', outline: 'none', fontSize: 15, minHeight: 60, resize: 'vertical', background: '#f7f9fb', marginBottom: 2, fontWeight: 500, transition: 'border 0.2s' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 2 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 700, marginBottom: 2, fontSize: 15, color: '#222' }}>Priority</label>
            <select name="priority" value={safeForm.priority} onChange={onChange} aria-label="Priority" style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1.5px solid #b0b8c9', fontSize: 15, background: '#f7f9fb', fontWeight: 500, transition: 'border 0.2s' }}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontWeight: 700, marginBottom: 2, fontSize: 15, color: '#222' }}>Assigned</label>
            <select name="assigned" value={safeForm.assigned} onChange={onChange} aria-label="Assigned" style={{ width: '100%', padding: '9px', borderRadius: 8, border: '1.5px solid #b0b8c9', fontSize: 15, background: '#f7f9fb', fontWeight: 500, transition: 'border 0.2s' }}>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        {error && <div style={{ color: '#d32f2f', fontSize: '1em', marginTop: 2, marginBottom: 2, textAlign: 'center', fontWeight: 700 }}>{error}</div>}
        <hr style={{ border: 'none', borderTop: '1.5px solid #eaf1ff', margin: '18px 0 0 0' }} />
        <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center' }}>
          <button type="submit" disabled={submitting} style={{ background: 'linear-gradient(90deg, #3a7afe 0%, #2556b8 100%)', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 32px', fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 17, opacity: submitting ? 0.7 : 1, boxShadow: '0 2px 8px 0 rgba(58,122,254,0.08)', letterSpacing: '0.5px', transition: 'opacity 0.2s, box-shadow 0.2s' }}>Add</button>
          <button type="button" onClick={onClose} style={{ background: '#f7f9fb', color: '#2556b8', border: '1.5px solid #eaf1ff', borderRadius: '8px', padding: '12px 32px', fontWeight: 700, cursor: 'pointer', fontSize: 17, boxShadow: '0 2px 8px 0 rgba(58,122,254,0.04)', letterSpacing: '0.5px', transition: 'background 0.18s, color 0.18s' }}>Cancel</button>
        </div>
        </>}
      </form>
      <style>{`
        @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
