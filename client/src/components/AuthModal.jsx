import React, { useState } from 'react';
import { X, ShieldCheck, LogIn } from 'lucide-react';

export default function AuthModal({ 
  onClose, 
  onLoginSuccess 
}) {
  const [email, setEmail] = useState('connect@globalminds.com');
  const [password, setPassword] = useState('Globalminds@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      try {
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: 'admin',
            email,
            password
          })
        });
      } catch (networkErr) {
        const isLocal = typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        if (isLocal && window.location.port !== '5000') {
          res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              role: 'admin',
              email,
              password
            })
          });
        } else {
          throw networkErr;
        }
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Admin login failed');

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      const isLocal = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
        setError(isLocal 
          ? 'Unable to reach the server. Please ensure the backend is running on http://localhost:5000' 
          : 'Unable to reach the server. Please check your network connection or try again.');
      } else {
        setError(err.message || 'Admin login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setEmail('connect@globalminds.com');
    setPassword('Globalminds@123');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/logo.jpg"
              alt="Global Minds Technologies"
              style={{
                height: '40px',
                width: 'auto',
                borderRadius: '6px',
                background: '#ffffff',
                padding: '3px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
              }}
            />
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#000000" />
                <span>Placement Admin Sign In</span>
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Sign in with administrator credentials (connect@globalminds.com)
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ paddingTop: '18px' }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '0.85rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Admin 1-Click Quick Fill */}
          <div style={{ marginBottom: '16px' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleDemoAdmin}
              style={{ fontSize: '0.82rem', padding: '9px 14px', width: '100%', justifyContent: 'center', borderColor: '#d4d4d4', color: '#000000', background: '#f8fafc' }}
            >
              🛡️ 1-Click Fill Admin Credentials (Mr. Navaneeth)
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="connect@globalminds.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderColor: '#d4d4d4' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter admin password (Globalminds@123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderColor: '#d4d4d4' }}
              />
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                Default password: <strong style={{ color: '#000000' }}>Globalminds@123</strong>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '11px',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                background: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              <LogIn size={15} />
              <span>{loading ? 'Signing in...' : 'Sign In as Admin'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
