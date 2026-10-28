import React, { useState, useEffect } from 'react';
import { X, Building2, ArrowRight } from 'lucide-react';
import { DOMAINS_LIST } from './DomainGrid';

export default function HRAuthModal({
  isOpen,
  promptDomain = null,
  initialCompanyName = '',
  onClose,
  onLoginSuccess
}) {
  const [companyName, setCompanyName] = useState(initialCompanyName || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(
    promptDomain || (DOMAINS_LIST[0] ? DOMAINS_LIST[0].name : 'Software Developer')
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promptDomain) {
      setSelectedDomain(promptDomain);
    }
  }, [promptDomain]);

  if (!isOpen) return null;

  const currentDomain = promptDomain || selectedDomain;

  const handleDemoFill = () => {
    setCompanyName('TCS');
    setName('sharma');
    setEmail('gyavgva@gmail.com');
    setPhone('+91 98765 43210');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim() || !name.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your Company Name, HR Name, Work Email, and Mobile Number.');
      return;
    }

    setLoading(true);

    try {
      let res;
      const payload = {
        role: 'hr',
        companyName: companyName.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      };

      try {
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (networkErr) {
        const isLocal = typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        if (isLocal && window.location.port !== '5000') {
          res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          throw networkErr;
        }
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to sign in');

      const domainToUnlock = currentDomain || data.lastActiveDomain;
      onLoginSuccess(data.user, domainToUnlock, data);
      onClose();
    } catch (err) {
      const isLocal = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (err.message && err.message.toLowerCase().includes('failed to fetch')) {
        setError(isLocal 
          ? 'Unable to reach the server. Please ensure the backend server is running on http://localhost:5000' 
          : 'Unable to reach the server. Please check your network connection or try again.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2200,
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0d0d0d',
          color: '#ffffff',
          border: '1px solid #2e2e2e',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '460px',
          padding: '28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          fontFamily: "'Figtree', system-ui, sans-serif"
        }}
      >
        {/* Force zero blue styling across all inputs, states, and autofills */}
        <style>{`
          .hr-dark-input::placeholder {
            color: #737373 !important;
            opacity: 1 !important;
          }
          .hr-dark-input:focus {
            border-color: #ffffff !important;
            outline: 2px solid #ffffff !important;
            outline-offset: 1px !important;
            box-shadow: none !important;
          }
          .hr-dark-input:-webkit-autofill,
          .hr-dark-input:-webkit-autofill:hover,
          .hr-dark-input:-webkit-autofill:focus {
            -webkit-text-fill-color: #ffffff !important;
            -webkit-box-shadow: 0 0 0px 1000px #161616 inset !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          .hr-submit-btn:hover {
            background: #e5e5e5 !important;
            color: #000000 !important;
          }
          .hr-close-btn:hover {
            background: #333333 !important;
            color: #ffffff !important;
          }
        `}</style>

        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            paddingBottom: '16px',
            borderBottom: '1px solid #222222'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: '#ffffff',
                color: '#000000',
                display: 'grid',
                placeItems: 'center',
                fontSize: '18px',
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)'
              }}
            >
              🏢
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontFamily: "'Bricolage Grotesque', Figtree, sans-serif",
                  letterSpacing: '-0.02em'
                }}
              >
                Boss &amp; Recruiter Sign In
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#a3a3a3' }}>
                Direct interview access &amp; candidate pool
              </p>
            </div>
          </div>
          <button
            type="button"
            className="hr-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1f1f1f',
              border: '1px solid #333333',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Domain to Unlock Card (Monochrome Black & White - ZERO BLUE) */}
        <div
          style={{
            background: '#161616',
            border: '1px solid #2e2e2e',
            borderLeft: '4px solid #ffffff',
            borderRadius: '14px',
            padding: '12px 16px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#a3a3a3',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '2px'
              }}
            >
              Domain to unlock
            </div>
            <div
              style={{
                fontSize: '19px',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: "'Bricolage Grotesque', sans-serif"
              }}
            >
              {currentDomain}
            </div>
          </div>

          {!promptDomain && (
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid #333333',
                background: '#1f1f1f',
                fontWeight: 600,
                color: '#ffffff',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {DOMAINS_LIST.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 1-Click Quick Fill Button */}
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={handleDemoFill}
            style={{
              fontSize: '12.5px',
              padding: '8px 14px',
              width: '100%',
              borderRadius: '999px',
              border: '1px dashed #404040',
              background: '#1a1a1a',
              color: '#ffffff',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.15s, border-color 0.15s'
            }}
          >
            🏢 1-Click Fill Demo Credentials (TCS Recruiter)
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: '#331111',
              border: '1px solid #772222',
              borderRadius: '10px',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '16px'
            }}
          >
            {error}
          </div>
        )}

        {/* Form Fields (Zero Blue - Pure Monochrome) */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#d4d4d4',
                marginBottom: '5px'
              }}
            >
              Company name <span style={{ color: '#ffffff' }}>*</span>
            </label>
            <input
              type="text"
              className="hr-dark-input"
              placeholder="e.g. Infosys, TCS, Tech Startup"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                border: '1px solid #2e2e2e',
                borderRadius: '12px',
                background: '#141414',
                fontSize: '14px',
                color: '#ffffff',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#d4d4d4',
                marginBottom: '5px'
              }}
            >
              HR / recruiter full name <span style={{ color: '#ffffff' }}>*</span>
            </label>
            <input
              type="text"
              className="hr-dark-input"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                border: '1px solid #2e2e2e',
                borderRadius: '12px',
                background: '#141414',
                fontSize: '14px',
                color: '#ffffff',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#d4d4d4',
                marginBottom: '5px'
              }}
            >
              Official work email <span style={{ color: '#ffffff' }}>*</span>
            </label>
            <input
              type="email"
              className="hr-dark-input"
              placeholder="recruiter@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                border: '1px solid #2e2e2e',
                borderRadius: '12px',
                background: '#141414',
                fontSize: '14px',
                color: '#ffffff',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#d4d4d4',
                marginBottom: '5px'
              }}
            >
              Contact / mobile number <span style={{ color: '#ffffff' }}>*</span>
            </label>
            <input
              type="tel"
              className="hr-dark-input"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '11px 14px',
                border: '1px solid #2e2e2e',
                borderRadius: '12px',
                background: '#141414',
                fontSize: '14px',
                color: '#ffffff',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Submit Button (Pure Solid White matching the attached HTML's pill/action button - ZERO BLUE) */}
          <div style={{ marginTop: '8px' }}>
            <button
              type="submit"
              disabled={loading}
              className="hr-submit-btn"
              style={{
                width: '100%',
                background: '#ffffff',
                color: '#000000',
                border: '1px solid #ffffff',
                borderRadius: '999px',
                height: '46px',
                fontSize: '15px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)',
                transition: 'background 0.15s ease, color 0.15s ease'
              }}
            >
              <span>{loading ? 'Signing in...' : 'Login to view resumes'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
