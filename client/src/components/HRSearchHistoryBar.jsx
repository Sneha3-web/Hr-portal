import React from 'react';
import { 
  History, 
  Search, 
  RotateCcw, 
  Trash2, 
  X, 
  Sparkles, 
  Eye, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowRight,
  Filter,
  Users
} from 'lucide-react';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function HRSearchHistoryBar({
  user,
  activeDomain,
  searchHistory = [],
  viewedCandidates = [],
  relevantCandidates = [],
  activeTab = 'all', // 'all' | 'relevant' | 'viewed'
  onSelectTab,
  onRestoreSearch,
  onDeleteHistoryItem,
  onClearAllHistory,
  onQuickKeywordClick,
  onResetToDomainList,
  onSwitchHR,
  totalDomainCandidates = 0
}) {
  if (!user || user.role === 'admin') return null;

  // Extract unique previous keywords from history
  const uniqueKeywords = [...new Set(
    searchHistory
      .map((item) => (item.query || '').trim())
      .filter((q) => q.length > 1)
  )].slice(0, 6);

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      padding: '20px 24px',
      margin: '20px 0 28px',
      position: 'relative'
    }}>
      {/* 1. HR Session & Welcome Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        paddingBottom: '16px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)'
          }}>
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {user.companyName || user.name} HR Portal
              </span>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: '#dcfce7',
                color: '#166534',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={12} color="#16a34a" />
                Session Saved • Logged in as {user.email}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
              Welcome back, <strong>{user.name}</strong> • Your previous searches and viewed candidate resumes are automatically remembered.
            </div>
          </div>
        </div>

        {/* Status / Active Domain summary */}
        {/* Status / Active Domain summary & Switch HR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {activeDomain ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              color: '#1e40af',
              fontWeight: 600
            }}>
              <span>Active: <strong>{activeDomain.name}</strong></span>
              <button
                type="button"
                onClick={onResetToDomainList}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  textDecoration: 'underline',
                  fontWeight: 700,
                  marginLeft: '4px'
                }}
              >
                Change
              </button>
            </div>
          ) : (
            <span style={{
              fontSize: '0.82rem',
              color: '#2563eb',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '5px 10px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600
            }}>
              Select a domain below to browse
            </span>
          )}
        </div>
      </div>

      {/* 2. Previous Search History Strip */}
      <div style={{ paddingTop: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <History size={16} color="#2563eb" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              Your Previous Search History ({searchHistory.length})
            </span>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
              — Click any past search to restore results instantly
            </span>
          </div>

          {searchHistory.length > 0 && (
            <button
              type="button"
              onClick={onClearAllHistory}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              title="Clear all saved searches for this account"
            >
              <Trash2 size={12} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {searchHistory.length === 0 ? (
          <div style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '0.82rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} color="#3b82f6" />
            <span>
              No previous searches recorded yet. Click any domain below or enter keywords in the search bar. Your search activity will be saved automatically for your email.
            </span>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'thin'
          }}>
            {searchHistory.map((item) => {
              const isDomainMatch = activeDomain && item.domain && item.domain.toLowerCase() === activeDomain.name.toLowerCase();
              return (
                <div
                  key={item.id}
                  style={{
                    background: isDomainMatch ? '#eff6ff' : '#f8fafc',
                    border: isDomainMatch ? '1.5px solid #3b82f6' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                  onClick={() => onRestoreSearch(item)}
                  title={`Restore: ${item.domain}${item.query ? ` - "${item.query}"` : ''}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDomainMatch ? '#3b82f6' : '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Search size={13} color="#2563eb" />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span>{item.domain || 'Domain'}</span>
                        {item.query && (
                          <span style={{ color: '#2563eb', fontWeight: 800 }}>
                            "{item.query}"
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        {item.resultsCount > 0 && (
                          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            {item.resultsCount} resumes
                          </span>
                        )}
                        {item.filters?.location && item.filters.location !== 'all' && (
                          <span>📍 {item.filters.location}</span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#94a3b8' }}>
                          <Clock size={10} />
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Item Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(item.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: '2px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                    title="Remove this search"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Keywords from Previous Searches */}
        {uniqueKeywords.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
              Your Frequent Keywords:
            </span>
            {uniqueKeywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onQuickKeywordClick(kw)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '3px 9px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#eff6ff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.color = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#1e293b';
                }}
              >
                + {kw}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Searched Relevant Content Tabs (Switch between All in domain, Searched Relevance, and Recently Viewed) */}
      {activeDomain && (
        <div style={{
          marginTop: '18px',
          paddingTop: '14px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {/* Tab 1: Current Domain Resumes */}
            <button
              type="button"
              onClick={() => onSelectTab('all')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === 'all' ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                background: activeTab === 'all' ? '#eff6ff' : '#ffffff',
                color: activeTab === 'all' ? '#1d4ed8' : '#475569',
                transition: 'all 0.18s ease'
              }}
            >
              <Layers size={14} />
              <span>{activeDomain.name} Profiles</span>
              <span style={{
                background: activeTab === 'all' ? '#2563eb' : '#e2e8f0',
                color: activeTab === 'all' ? '#ffffff' : '#475569',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.72rem'
              }}>
                {totalDomainCandidates}
              </span>
            </button>

            {/* Tab 2: Relevant to Previous Searches */}
            <button
              type="button"
              onClick={() => onSelectTab('relevant')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === 'relevant' ? '1.5px solid #10b981' : '1px solid #cbd5e1',
                background: activeTab === 'relevant' ? '#ecfdf5' : '#ffffff',
                color: activeTab === 'relevant' ? '#047857' : '#475569',
                transition: 'all 0.18s ease'
              }}
            >
              <Sparkles size={14} color={activeTab === 'relevant' ? '#059669' : '#10b981'} />
              <span>Relevant to Your Searches</span>
              <span style={{
                background: activeTab === 'relevant' ? '#10b981' : '#e2e8f0',
                color: activeTab === 'relevant' ? '#ffffff' : '#475569',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.72rem'
              }}>
                {relevantCandidates.length}
              </span>
            </button>

            {/* Tab 3: Recently Viewed Resumes */}
            <button
              type="button"
              onClick={() => onSelectTab('viewed')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === 'viewed' ? '1.5px solid #8b5cf6' : '1px solid #cbd5e1',
                background: activeTab === 'viewed' ? '#f5f3ff' : '#ffffff',
                color: activeTab === 'viewed' ? '#6d28d9' : '#475569',
                transition: 'all 0.18s ease'
              }}
            >
              <Eye size={14} color={activeTab === 'viewed' ? '#7c3aed' : '#8b5cf6'} />
              <span>Recently Viewed Resumes</span>
              <span style={{
                background: activeTab === 'viewed' ? '#8b5cf6' : '#e2e8f0',
                color: activeTab === 'viewed' ? '#ffffff' : '#475569',
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '0.72rem'
              }}>
                {viewedCandidates.length}
              </span>
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
            {activeTab === 'relevant' && 'Showing curated candidates matching your search topics & skills'}
            {activeTab === 'viewed' && 'Showing resumes you previously previewed'}
            {activeTab === 'all' && `Showing verified candidate pool for ${activeDomain.name}`}
          </div>
        </div>
      )}
    </div>
  );
}
