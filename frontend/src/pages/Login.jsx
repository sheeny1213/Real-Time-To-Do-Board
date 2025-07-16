

import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import bg from '../assets/forest.avif'; // ✅ import background image

export default function Login({ onSuccess }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) return setError('All fields required');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || 'Login failed');
      login(data.token, data.username);
      onSuccess();
    } catch {
      setError('Network error');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          width: 360,
          background: 'rgba(255,255,255,0.9)',
          padding: 32,
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
        }}
      >
        <h2 style={{ marginBottom: 18, textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', width: '94%' }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: 14,
                color: '#333'
              }}
            >
            
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
          {error && <div style={{ color: 'red', fontSize: '0.95em' }}>{error}</div>}
          <button
            type="submit"
            style={{
              background: '#4f8cff',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 0',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
