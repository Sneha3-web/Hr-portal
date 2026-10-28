import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Calendar, 
  Trash2, 
  Edit, 
  Eye, 
  Download,
  RefreshCw, 
  CheckCircle, 
  Building, 
  Phone, 
  Mail, 
  Search, 
  CheckCircle2, 
  Clock, 
  Filter, 
  FileText,
  UserCheck,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Briefcase
} from 'lucide-react';

export default function AdminDashboardModal({
  candidates,
  categories,
  onClose,
  onOpenUpload,
  onDeleteCandidate,
  onViewResume,
  onDownloadResume,
  onRefreshData
}) {
  const [activeTab, setActiveTab] = useState('inquiries'); // 'inquiries' | 'hrs' | 'candidates'
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [registeredHRs, setRegisteredHRs] = useState([]);
  const [loadingHRs, setLoadingHRs] = useState(false);
  const [hrSearchQuery, setHrSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState('');
  const [candidatesList, setCandidatesList] = useState(candidates || []);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [statusMessage, setStatusMessage] = useState('');

  // Sync with prop when prop changes
  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setCandidatesList(candidates);
    }
  }, [candidates]);

  // Fetch inquiries, HRs and candidates on mount
  useEffect(() => {
    fetchInquiries();
    fetchRegisteredHRs();
    fetchCandidatesList();
  }, []);

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const fetchRegisteredHRs = async () => {
    setLoadingHRs(true);
    try {
      const res = await fetch('/api/admin/hrs');
      const data = await res.json();
      setRegisteredHRs(Array.isArray(data.hrs) ? data.hrs : []);
    } catch (err) {
      console.error('Failed to load registered HRs:', err);
    } finally {
      setLoadingHRs(false);
    }
  };

  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2500);
  };

  const handleCopyAllEmails = () => {
    const emails = registeredHRs.map(h => h.email).filter(Boolean).join(', ');
    if (!emails) return;
    navigator.clipboard.writeText(emails);
    setCopiedEmail('__ALL__');
    setTimeout(() => setCopiedEmail(''), 2500);
  };

  const fetchCandidatesList = async () => {
    setLoadingCandidates(true);
    try {
      const res = await fetch('/api/candidates');
      const data = await res.json();
      setCandidatesList(data.candidates || []);
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === inquiryId ? { ...i, status: newStatus } : i))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Delete this callback request?')) return;
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== inquiryId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCandidateLocal = async (candidateId, candidateName) => {
    if (!window.confirm(`Delete candidate "${candidateName || 'profile'}" from Candidate Pool?`)) return;
    try {
      const res = await fetch(`/api/candidates/${candidateId}`, { method: 'DELETE' });
      if (res.ok) {
        setCandidatesList((prev) => prev.filter((c) => c.id !== candidateId));
        if (onDeleteCandidate) onDeleteCandidate(candidateId);
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHRs = (registeredHRs || []).filter((h) => {
    if (!h) return false;
    const q = (hrSearchQuery || '').toLowerCase().trim();
    if (!q) return true;
    const inEmail = (h.email || '').toLowerCase().includes(q);
    const inName = (h.name || '').toLowerCase().includes(q);
    const inComp = (h.companyName || '').toLowerCase().includes(q);
    const inPhone = (h.phone || '').toLowerCase().includes(q);
    const inDomain = Array.isArray(h.searchedDomains) && h.searchedDomains.some(d => d.toLowerCase().includes(q));
    return inEmail || inName || inComp || inPhone || inDomain;
  });

  const filteredCandidates = (candidatesList || []).filter((c) => {
    if (!c) return false;
    const q = (candidateSearch || '').toLowerCase().trim();
    const inName = c.name && c.name.toLowerCase().includes(q);
    const inCat = c.category && c.category.toLowerCase().includes(q);
    const inSkills = Array.isArray(c.skills)
      ? c.skills.some((s) => typeof s === 'string' && s.toLowerCase().includes(q))
      : (typeof c.skills === 'string' && c.skills.toLowerCase().includes(q));
    const inEdu = c.education && c.education.toLowerCase().includes(q);
    const inLoc = c.location && c.location.toLowerCase().includes(q);
    const matchesSearch = !q || inName || inCat || inSkills || inEdu || inLoc;

    const matchesCat =
      selectedCatFilter === 'all' ||
      (c.category && c.category.toLowerCase() === selectedCatFilter.toLowerCase());

    return matchesSearch && matchesCat;
  });

  const formatDate = (isoStr) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-xl" onClick={(e) => e.stopPropagation()} style={{ height: '90vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
        {/* Header */}
        <div className="modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🛡️ Placement Administration Portal • Mr. Navaneeth
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
              Global Minds Technologies — Mr. Navaneeth (+91 95974 37333 | connect@globalminds.com)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px',
          background: '#f8fafc',
          gap: '8px',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('inquiries')}
            style={{
              padding: '14px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'inquiries' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              color: activeTab === 'inquiries' ? '#2563eb' : '#64748b',
              fontWeight: activeTab === 'inquiries' ? 700 : 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Calendar size={17} />
            <span>Recruiter Callback Requests</span>
            <span style={{
              background: activeTab === 'inquiries' ? '#2563eb' : '#cbd5e1',
              color: 'white',
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hrs')}
            style={{
              padding: '14px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'hrs' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              color: activeTab === 'hrs' ? '#2563eb' : '#64748b',
              fontWeight: activeTab === 'hrs' ? 700 : 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <UserCheck size={17} />
            <span>Registered HR Contacts (Follow Up)</span>
            <span style={{
              background: activeTab === 'hrs' ? '#16a34a' : '#cbd5e1',
              color: 'white',
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {registeredHRs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            style={{
              padding: '14px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'candidates' ? '2.5px solid #2563eb' : '2.5px solid transparent',
              color: activeTab === 'candidates' ? '#2563eb' : '#64748b',
              fontWeight: activeTab === 'candidates' ? 700 : 600,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Users size={17} />
            <span>Candidate Pool</span>
            <span style={{
              background: activeTab === 'candidates' ? '#2563eb' : '#cbd5e1',
              color: 'white',
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {candidatesList.length}
            </span>
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
          {/* TAB 1: Recruiter Inquiries */}
          {activeTab === 'inquiries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h4 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>
                  Incoming Recruiter Callback Requests ({inquiries.length})
                </h4>
                <button className="btn btn-secondary btn-sm" onClick={fetchInquiries}>
                  <RefreshCw size={14} className={loadingInquiries ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>

              {inquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <Calendar size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>No callback requests yet</div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.86rem' }}>When recruiters submit the callback form, their details will appear here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: 'var(--radius-md)',
                        padding: '20px',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            🏢 {inq.companyName || inq.company || 'Company'}
                          </span>
                          <span style={{
                            fontSize: '0.74rem',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: inq.status === 'New' ? '#fef3c7' : inq.status === 'Completed' ? '#dcfce7' : '#eff6ff',
                            color: inq.status === 'New' ? '#b45309' : inq.status === 'Completed' ? '#15803d' : '#1d4ed8',
                            border: `1px solid ${inq.status === 'New' ? '#fde68a' : inq.status === 'Completed' ? '#bbf7d0' : '#bfdbfe'}`,
                            fontWeight: 700
                          }}>
                            {inq.status || 'New'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Status:</span>
                          <select
                            className="form-select form-select-sm"
                            style={{ padding: '6px 10px', fontSize: '0.82rem', background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1' }}
                            value={inq.status || 'New'}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted HR</option>
                            <option value="Completed">Completed</option>
                            <option value="Closed">Closed</option>
                          </select>

                          {(inq.recruiterPhone || inq.phone) && (
                            <a
                              href={`https://wa.me/${(inq.recruiterPhone || inq.phone).replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inq.recruiterName || 'there'}, Greetings from Mr. Navaneeth at Global Minds Technologies regarding your hiring request for ${inq.companyName || 'your company'}.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm"
                              style={{ background: '#22c55e', color: '#ffffff', border: 'none', padding: '6px 10px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={13} />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleDeleteInquiry(inq.id)}
                            title="Delete Request"
                            style={{ padding: '6px 9px', color: '#ef4444', borderColor: '#fecaca' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Recruiter Details Grid */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px'
                      }}>
                        <div>
                          <div style={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.03em' }}>Your Name</div>
                          <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>{inq.recruiterName || inq.name || '—'}</div>
                        </div>

                        <div>
                          <div style={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.03em' }}>Company Name</div>
                          <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>{inq.companyName || inq.company || '—'}</div>
                        </div>

                        <div>
                          <div style={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.03em' }}>Work Email</div>
                          <a href={`mailto:${inq.recruiterEmail || inq.email}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', wordBreak: 'break-all' }}>
                            {inq.recruiterEmail || inq.email || '—'}
                          </a>
                        </div>

                        <div>
                          <div style={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.03em' }}>Phone Number</div>
                          <a href={`tel:${inq.recruiterPhone || inq.phone}`} style={{ color: '#059669', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
                            {inq.recruiterPhone || inq.phone || '—'}
                          </a>
                        </div>

                        <div>
                          <div style={{ color: '#64748b', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.03em' }}>Domain / Role</div>
                          <span style={{
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            display: 'inline-block'
                          }}>
                            {inq.roleTitle || inq.domain || 'Full Stack Developer'}
                          </span>
                        </div>
                      </div>

                      {/* Additional Message / Hiring Requirements from Enquiry Card */}
                      {(inq.notes || inq.message) && (
                        <div style={{
                          marginTop: '12px',
                          background: '#eff6ff',
                          border: '1.5px solid #bfdbfe',
                          borderRadius: '8px',
                          padding: '12px 16px',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start'
                        }}>
                          <MessageCircle size={18} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              color: '#2563eb',
                              letterSpacing: '0.04em',
                              marginBottom: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '6px'
                            }}>
                              <span>Additional Message / Hiring Requirement</span>
                              <span style={{ fontSize: '0.72rem', color: '#1e40af', fontWeight: 600 }}>From Homepage Enquiry Card</span>
                            </div>
                            <div style={{
                              fontSize: '0.92rem',
                              color: '#1e293b',
                              fontWeight: 600,
                              lineHeight: 1.5,
                              whiteSpace: 'pre-wrap',
                              background: '#ffffff',
                              padding: '10px 14px',
                              borderRadius: '6px',
                              border: '1px solid #bfdbfe'
                            }}>
                              {inq.notes || inq.message}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Shortlisted Candidates (if any) */}
                      {Array.isArray(inq.candidates) && inq.candidates.length > 0 && (
                        <div style={{
                          marginTop: '12px',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '12px 14px'
                        }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Shortlisted Candidates ({inq.candidates.length})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {inq.candidates.map((cand, idx) => (
                              <div key={idx} style={{
                                background: '#ffffff',
                                border: '1px solid #cbd5e1',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '0.84rem',
                                color: '#1e293b',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '8px'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{
                                    background: '#eff6ff',
                                    color: '#2563eb',
                                    fontWeight: 800,
                                    fontSize: '0.72rem',
                                    padding: '2px 7px',
                                    borderRadius: '4px'
                                  }}>
                                    Slot #{idx + 1}
                                  </span>
                                  <span>👤 <strong>{cand.name || cand}</strong></span>
                                  <span style={{ color: '#64748b', fontSize: '0.78rem' }}>({cand.category || 'Candidate'})</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                  {cand.interviewDate && (
                                    <span style={{
                                      background: '#f8fafc',
                                      color: '#334155',
                                      border: '1px solid #e2e8f0',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.76rem',
                                      fontWeight: 600
                                    }}>
                                      📅 {cand.interviewDate}
                                    </span>
                                  )}
                                  {cand.timeSlot && (
                                    <span style={{
                                      background: '#eff6ff',
                                      color: '#1d4ed8',
                                      border: '1px solid #bfdbfe',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.76rem',
                                      fontWeight: 700
                                    }}>
                                      🕒 {cand.timeSlot}
                                    </span>
                                  )}
                                  {cand.interviewMode && (
                                    <span style={{
                                      background: '#f1f5f9',
                                      color: '#475569',
                                      border: '1px solid #cbd5e1',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.76rem',
                                      fontWeight: 600
                                    }}>
                                      💻 {cand.interviewMode.split('(')[0].trim()}
                                    </span>
                                  )}
                                  {cand.ctcBudget && (
                                    <span style={{
                                      background: '#f0fdf4',
                                      color: '#15803d',
                                      border: '1px solid #bbf7d0',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.76rem',
                                      fontWeight: 700
                                    }}>
                                      💰 {cand.ctcBudget}
                                    </span>
                                  )}
                                </div>
                                {cand.notes && (
                                  <div style={{ width: '100%', fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '4px 8px', borderRadius: '4px', marginTop: '2px' }}>
                                    📝 <em>{cand.notes}</em>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Registered HR Contacts (For Direct Follow-Up) */}
          {activeTab === 'hrs' && (
            <div>
              {/* Header & Quick Bulk Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👥 Registered Company HRs & Recruiter Leads</span>
                    <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: '12px', fontWeight: 700, border: '1px solid #bbf7d0' }}>
                      {registeredHRs.length} Total Registered
                    </span>
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Recruiters who registered with official email & phone to search candidates. Use the actions below for immediate follow-up.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCopyAllEmails}
                    disabled={registeredHRs.length === 0}
                    title="Copy all registered HR emails for bulk email follow-up"
                    style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {copiedEmail === '__ALL__' ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                    <span>{copiedEmail === '__ALL__' ? 'Copied All Emails!' : `Copy All Emails (${registeredHRs.length})`}</span>
                  </button>

                  <button className="btn btn-secondary btn-sm" onClick={fetchRegisteredHRs} title="Refresh HR List">
                    <RefreshCw size={14} className={loadingHRs ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '480px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input form-input-sm"
                    placeholder="Search by HR email, recruiter name, company, or domain..."
                    value={hrSearchQuery}
                    onChange={(e) => setHrSearchQuery(e.target.value)}
                    style={{ paddingLeft: '36px', background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1', width: '100%' }}
                  />
                </div>

                <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>
                  Showing <strong>{filteredHRs.length}</strong> of {registeredHRs.length} HR recruiters
                </div>
              </div>

              {/* HR List Content */}
              {registeredHRs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <UserCheck size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>No registered HRs recorded yet</div>
                  <p style={{ margin: '6px auto 0', fontSize: '0.86rem', maxWidth: '440px' }}>
                    When company recruiters sign in with their work email, company name, and phone to search candidates, their profiles and search history are automatically logged here for follow-up.
                  </p>
                </div>
              ) : filteredHRs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <Search size={36} color="#94a3b8" style={{ marginBottom: '10px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.96rem', color: '#0f172a' }}>No HRs match "{hrSearchQuery}"</div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.84rem' }}>Try clearing the search query to see all registered HRs.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredHRs.map((hr, idx) => {
                    const cleanPhone = (hr.phone || '').replace(/[^0-9]/g, '');
                    const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                    const waUrl = cleanPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(`Hi ${hr.name || 'there'}, Greetings from Mr. Navaneeth at Global Minds Technologies regarding your candidate search for ${hr.companyName || 'your company'}.`)}` : null;

                    const followUpSubject = encodeURIComponent(`Candidate Profiles Follow-Up - Global Minds Technologies (${hr.companyName || 'Hiring'})`);
                    const followUpBody = encodeURIComponent(
`Hi ${hr.name || 'there'},

Greetings from Global Minds Technologies!

Thank you for visiting our HR Placement Portal for ${hr.companyName || 'your organization'}. We noticed your interest in candidate profiles${hr.searchedDomains?.length > 0 ? ` for: ${hr.searchedDomains.join(', ')}` : ''}.

We have pre-vetted, immediate-joiner candidates ready for technical interviews who match these criteria. Would you like us to share shortlisted resumes or arrange direct candidate interviews for your team?

Feel free to reply to this email or call/WhatsApp me directly at +91 95974 37333.

Best regards,
Mr. Navaneeth
Placement & Talent Relations
Global Minds Technologies
Phone: +91 95974 37333
Email: connect@globalminds.com`
                    );
                    const mailtoUrl = `mailto:${hr.email}?subject=${followUpSubject}&body=${followUpBody}`;

                    return (
                      <div
                        key={hr.email || idx}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: 'var(--radius-md)',
                          padding: '20px',
                          boxShadow: 'var(--shadow-sm)',
                          transition: 'border-color 0.15s, box-shadow 0.15s'
                        }}
                      >
                        {/* Top Line: Company, HR Name, and Fast Follow-Up Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '1.22rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>🏢 {hr.companyName || 'Company'}</span>
                            </span>
                            <span style={{
                              fontSize: '0.8rem',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              fontWeight: 700,
                              border: '1px solid #bfdbfe'
                            }}>
                              👤 {hr.name || 'HR Recruiter'}
                            </span>
                            {hr.lastActiveDomain && (
                              <span style={{
                                fontSize: '0.76rem',
                                padding: '3px 9px',
                                borderRadius: '10px',
                                background: '#f8fafc',
                                color: '#475569',
                                border: '1px solid #e2e8f0',
                                fontWeight: 600
                              }}>
                                Focus: {hr.lastActiveDomain}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons for Mr. Navaneeth */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <a
                              href={mailtoUrl}
                              className="btn btn-primary btn-sm"
                              style={{
                                textDecoration: 'none',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '7px 14px',
                                fontSize: '0.84rem'
                              }}
                              title="Send pre-filled follow-up email"
                            >
                              <Mail size={14} />
                              <span>✉️ Follow-Up Email</span>
                            </a>

                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline btn-sm"
                                style={{
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '7px 12px',
                                  fontSize: '0.84rem',
                                  color: '#16a34a',
                                  borderColor: '#86efac'
                                }}
                                title="Open WhatsApp message"
                              >
                                <MessageCircle size={14} />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          padding: '16px 20px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px'
                        }}>
                          {/* HR Email (Primary) */}
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em' }}>
                              Official HR Email
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <a
                                href={`mailto:${hr.email}`}
                                style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 800, fontSize: '0.94rem', wordBreak: 'break-all' }}
                              >
                                {hr.email}
                              </a>
                              <button
                                onClick={() => handleCopyEmail(hr.email)}
                                title="Copy email address"
                                style={{
                                  background: 'none',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '4px',
                                  padding: '3px 6px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.72rem',
                                  color: copiedEmail === hr.email ? '#16a34a' : '#64748b'
                                }}
                              >
                                {copiedEmail === hr.email ? <Check size={12} /> : <Copy size={12} />}
                                <span>{copiedEmail === hr.email ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>

                          {/* HR Phone */}
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em' }}>
                              Phone Number
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {hr.phone ? (
                                <a href={`tel:${hr.phone}`} style={{ color: '#059669', textDecoration: 'none', fontWeight: 700, fontSize: '0.94rem' }}>
                                  📞 {hr.phone}
                                </a>
                              ) : (
                                <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Not provided</span>
                              )}
                            </div>
                          </div>

                          {/* Domains Searched */}
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em' }}>
                              Searched Domains ({hr.searchedDomains?.length || 0})
                            </div>
                            {hr.searchedDomains && hr.searchedDomains.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                {hr.searchedDomains.map((d, dIdx) => (
                                  <span
                                    key={dIdx}
                                    style={{
                                      fontSize: '0.74rem',
                                      padding: '2px 8px',
                                      borderRadius: '6px',
                                      background: '#eff6ff',
                                      color: '#1d4ed8',
                                      fontWeight: 600,
                                      border: '1px solid #bfdbfe'
                                    }}
                                  >
                                    {d}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No domain searches yet</span>
                            )}
                          </div>

                          {/* Activity & Last Login */}
                          <div>
                            <div style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '0.04em' }}>
                              Engagement & Last Active
                            </div>
                            <div style={{ fontSize: '0.86rem', color: '#0f172a', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={13} color="#64748b" />
                                <span>{formatDate(hr.lastLoginAt)}</span>
                              </span>
                              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                {hr.searchCount || 0} searches • {hr.viewedCount || 0} resumes opened • {hr.shortlistCount || 0} shortlisted
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Candidate Management Table */}
          {activeTab === 'candidates' && (
            <div>
              {/* Controls */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '18px', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', flex: '1 1 300px' }}>
                  <input
                    type="text"
                    className="form-input form-input-sm"
                    placeholder="Search candidate name or skill..."
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    style={{ background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1' }}
                  />
                  <select
                    className="form-select form-select-sm"
                    value={selectedCatFilter}
                    onChange={(e) => setSelectedCatFilter(e.target.value)}
                    style={{ background: '#ffffff', color: '#0f172a', borderColor: '#cbd5e1' }}
                  >
                    <option value="all">All Domains</option>
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
                  Showing <strong>{filteredCandidates.length}</strong> of {candidatesList.length} candidates
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '14px 18px', fontWeight: 700 }}>Student Name</th>
                      <th style={{ padding: '14px 18px', fontWeight: 700 }}>Category / Domain</th>
                      <th style={{ padding: '14px 18px', fontWeight: 700 }}>Experience</th>
                      <th style={{ padding: '14px 18px', fontWeight: 700 }}>Location</th>
                      <th style={{ padding: '14px 18px', fontWeight: 700 }}>Resume File</th>
                      <th style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                          No candidates found matching your filter.
                        </td>
                      </tr>
                    ) : (
                      filteredCandidates.map((c) => (
                        <tr 
                          key={c.id} 
                          style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                        >
                          <td style={{ padding: '14px 18px', fontWeight: 700, color: '#0f172a' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span>{c.name}</span>
                              {(c.status === 'Interview Scheduled' || c.interviewScheduled) && (
                                <span style={{
                                  fontSize: '0.68rem',
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  background: '#dcfce7',
                                  color: '#15803d',
                                  border: '1px solid #bbf7d0',
                                  fontWeight: 700
                                }}>
                                  Interview Scheduled
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{
                              fontSize: '0.78rem',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: '#eff6ff',
                              color: '#2563eb',
                              fontWeight: 600
                            }}>
                              {c.category}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', color: '#475569', fontWeight: 500 }}>
                            {c.experience || 'Fresher'}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#475569', fontWeight: 500 }}>
                            {c.location || 'Bangalore'}
                          </td>
                          <td style={{ padding: '14px 18px', color: '#64748b', fontSize: '0.82rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <FileText size={13} color="#64748b" />
                              <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {c.originalFilename || c.filename || 'Resume.pdf'}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                              {(c.status === 'Interview Scheduled' || c.interviewScheduled) && (
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={async () => {
                                    if (!window.confirm(`Reset ${c.name} back to Available status?`)) return;
                                    await fetch(`/api/candidates/${c.id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ status: 'Available', interviewScheduled: false })
                                    });
                                    setCandidatesList(prev => prev.map(item => item.id === c.id ? { ...item, status: 'Available', interviewScheduled: false } : item));
                                    if (onRefreshData) onRefreshData();
                                  }}
                                  title="Reset status back to Available"
                                  style={{ padding: '4px 8px', fontSize: '0.74rem', color: '#059669', borderColor: '#a7f3d0' }}
                                >
                                  Make Available
                                </button>
                              )}
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => onViewResume(c)}
                                title="Preview PDF Resume"
                                style={{ padding: '5px 8px' }}
                              >
                                <Eye size={14} />
                              </button>
                              {onDownloadResume && (
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => onDownloadResume(c)}
                                  title="Download Resume"
                                  style={{ padding: '5px 8px' }}
                                >
                                  <Download size={14} />
                                </button>
                              )}
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => handleDeleteCandidateLocal(c.id, c.name)}
                                title="Delete Candidate"
                                style={{ padding: '5px 8px', color: '#ef4444', borderColor: '#fecaca' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
