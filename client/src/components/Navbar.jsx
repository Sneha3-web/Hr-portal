import React from 'react';
import { FileText, Building2, ShieldCheck, LogOut, Bookmark, User, ChevronRight } from 'lucide-react';

export default function Navbar({
  user,
  onOpenAuth,
  onLogout,
  onOpenUpload,
  onOpenAdmin,
  shortlistCount,
  onOpenShortlist,
  onNavigate,
  onOpenHRLogin,
  appMode = 'boss',
  onToggleMode,
  talentTab = 'dossier',
  onSelectTalentTab,
  viewedCount = 0,
  scheduledCount = 0,
  onOpenViewed,
  onOpenScheduled,
  onOpenBossDashboard
}) {
  const handleNavClick = (e, target) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(target);
    } else {
      if (onToggleMode) onToggleMode('home');
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="tal-navbar" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="tal-navbar-inner">
        {/* Left: Brand Mark */}
        <div 
          className="tal-brand-group" 
          onClick={(e) => handleNavClick(e, 'top')}
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer' }}
        >
          <div className="tal-brand-icon-box" style={{ background: '#ffffff', padding: '3px' }}>
            <img
              src="/logo.jpg"
              alt="Global Minds"
              className="tal-brand-icon-img"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="tal-brand-text">
            <span className="tal-brand-name">global<span className="tal-brand-tag">MINDS</span></span>
            <span className="tal-brand-sub">Direct Hiring • Global Minds</span>
          </div>
        </div>

        {/* Center: Sleek Navigation Links */}
        <nav className="tal-nav-links">
          <a
            href="#top"
            className="tal-nav-link"
            onClick={(e) => handleNavClick(e, 'top')}
          >
            Home
          </a>
          <a
            href="#network"
            className="tal-nav-link"
            onClick={(e) => handleNavClick(e, 'network')}
          >
            Browse Network
          </a>
          <a
            href="#why"
            className="tal-nav-link"
            onClick={(e) => handleNavClick(e, 'why')}
          >
            Why Global Minds
          </a>
          <a
            href="#contact"
            className="tal-nav-link"
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Placement Desk
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="tal-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* Mode Switcher Pill */}
          <div style={{
            display: 'inline-flex',
            padding: '3px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            marginRight: '4px'
          }}>
            <button
              type="button"
              onClick={() => onToggleMode && onToggleMode('boss')}
              style={{
                height: '30px',
                padding: '0 14px',
                borderRadius: '9999px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                background: appMode === 'boss' ? '#ffffff' : 'transparent',
                color: appMode === 'boss' ? '#09090b' : '#a1a1aa',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Boss
            </button>
            <button
              type="button"
              onClick={() => onToggleMode && onToggleMode('talent')}
              style={{
                height: '30px',
                padding: '0 14px',
                borderRadius: '9999px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: 'none',
                background: appMode === 'talent' ? '#ffffff' : 'transparent',
                color: appMode === 'talent' ? '#09090b' : '#a1a1aa',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Candidate
            </button>
          </div>

          {/* Admin shortcuts if logged in */}
          {user?.role === 'admin' && (
            <button 
              className="tal-btn-admin" 
              onClick={onOpenAdmin}
            >
              <ShieldCheck size={14} />
              <span>Admin Desk</span>
            </button>
          )}

          {/* Shortlist Cart (Boss Mode or Logged In Boss) */}
          {shortlistCount > 0 && (
            <button className="tal-btn-shortlist" onClick={onOpenShortlist}>
              <Bookmark size={14} fill="currentColor" />
              <span>Shortlist ({shortlistCount})</span>
            </button>
          )}

          {/* User Session or Boss Sign In CTA */}
          {user ? (
            <div className="tal-user-session" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user.role === 'hr' && (
                <>
                  <button 
                    type="button"
                    onClick={onOpenViewed}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#f3f4f7',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="View Resumes You Explored"
                  >
                    <span>👁️ Explored</span>
                    {typeof viewedCount === 'number' && viewedCount > 0 && (
                      <span style={{ background: '#ffffff', color: '#000000', padding: '1px 6px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                        {viewedCount}
                      </span>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={onOpenShortlist}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="View Shortlisted Resumes"
                  >
                    <span>★ Shortlist</span>
                    {typeof shortlistCount === 'number' && shortlistCount > 0 && (
                      <span style={{ background: '#ffffff', color: '#000000', padding: '1px 6px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800 }}>
                        {shortlistCount}
                      </span>
                    )}
                  </button>

                  <button 
                    type="button"
                    onClick={onOpenScheduled}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="View Selected & Scheduled Interviews"
                  >
                    <span>📅 Scheduled</span>
                    {typeof scheduledCount === 'number' && scheduledCount > 0 && (
                      <span style={{ background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '9999px', fontSize: '11px' }}>
                        {scheduledCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {user.role === 'admin' ? (
                <div className="tal-user-pill">
                  <ShieldCheck size={14} color="#10b981" />
                  <span>Admin Navaneeth</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenBossDashboard}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#ffffff',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Open Dedicated Boss Workspace"
                >
                  <Building2 size={14} color="#ffffff" />
                  <span>{user.companyName || user.name}</span>
                  <span style={{ fontSize: '10.5px', background: '#ffffff', color: '#000000', padding: '1px 6px', borderRadius: '9999px', fontWeight: 800 }}>
                    Workspace ↗
                  </span>
                </button>
              )}

              <button
                type="button"
                className="tal-btn-logout"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onLogout) onLogout();
                }}
                title="Sign out of your account"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '32px',
                  padding: '0 12px',
                  borderRadius: '9999px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                  e.currentTarget.style.color = '#f87171';
                }}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="tal-auth-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                className="tal-btn-ghost-admin" 
                onClick={() => onOpenAuth('admin')}
                title="Placement Admin Login"
              >
                <ShieldCheck size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
