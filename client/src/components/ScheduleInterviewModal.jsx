import React, { useState } from 'react';
import { 
  X, Calendar, CheckCircle2, Building, Mail, Phone, Clock, FileText, 
  Send, Sparkles, User, Wand2, ArrowRight, ShieldCheck, Check, DollarSign, Laptop
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TIME_SLOT_OPTIONS = [
  '09:30 AM - 10:15 AM',
  '10:00 AM - 10:45 AM',
  '10:45 AM - 11:30 AM',
  '11:00 AM - 11:45 AM',
  '11:45 AM - 12:30 PM',
  '02:00 PM - 02:45 PM',
  '02:45 PM - 03:30 PM',
  '03:00 PM - 03:45 PM',
  '04:00 PM - 04:45 PM',
  '05:00 PM - 05:45 PM',
  'Custom Time'
];

export default function ScheduleInterviewModal({
  user,
  targetCandidate = null,
  shortlistedCandidates = [],
  onClose,
  onSuccess
}) {
  // Candidate pool: either single candidate or shortlisted list
  const rawCandidates = targetCandidate ? [targetCandidate] : (shortlistedCandidates || []);

  // Only valid candidates without existing interview schedule can proceed
  const availableCandidates = rawCandidates.filter(
    (c) => !(c.interviewScheduled === true || c.status === 'Interview Scheduled')
  );

  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    recruiterName: user?.name || '',
    recruiterEmail: user?.email || '',
    recruiterPhone: user?.phone || '',
    globalDate: defaultDateStr
  });

  // Separate, complete interview schedule & budget settings per specific candidate profile
  const [candidateSchedules, setCandidateSchedules] = useState(() => {
    const standardSlots = [
      '10:00 AM - 10:45 AM',
      '11:00 AM - 11:45 AM',
      '02:00 PM - 02:45 PM',
      '03:00 PM - 03:45 PM',
      '04:00 PM - 04:45 PM',
      '05:00 PM - 05:45 PM'
    ];

    return availableCandidates.map((c, idx) => ({
      candidateId: c.id,
      name: c.name,
      category: c.category,
      experience: c.experience,
      interviewDate: defaultDateStr,
      timeSlot: standardSlots[idx % standardSlots.length] || '10:00 AM - 10:45 AM',
      isCustomTime: false,
      interviewMode: 'Virtual (Google Meet / Microsoft Teams)',
      ctcBudget: '4.5 - 7.5 LPA',
      roundType: 'Round 1 (Technical & Coding)',
      notes: ''
    }));
  });

  // Keep user profile in sync
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        companyName: user.companyName || prev.companyName,
        recruiterName: user.name || prev.recruiterName,
        recruiterEmail: user.email || prev.recruiterEmail,
        recruiterPhone: user.phone || prev.recruiterPhone
      }));
    }
  }, [user]);

  // Keep schedules synchronized whenever available candidates change
  useEffect(() => {
    const standardSlots = [
      '10:00 AM - 10:45 AM',
      '11:00 AM - 11:45 AM',
      '02:00 PM - 02:45 PM',
      '03:00 PM - 03:45 PM',
      '04:00 PM - 04:45 PM',
      '05:00 PM - 05:45 PM'
    ];

    setCandidateSchedules((prev) => {
      return availableCandidates.map((c, idx) => {
        const existing = prev.find((s) => s.candidateId === c.id);
        if (existing) return existing;
        return {
          candidateId: c.id,
          name: c.name,
          category: c.category,
          experience: c.experience,
          interviewDate: formData.globalDate || defaultDateStr,
          timeSlot: standardSlots[idx % standardSlots.length] || '10:00 AM - 10:45 AM',
          isCustomTime: false,
          interviewMode: 'Virtual (Google Meet / Microsoft Teams)',
          ctcBudget: '4.5 - 7.5 LPA',
          roundType: 'Round 1 (Technical & Coding)',
          notes: ''
        };
      });
    });
  }, [targetCandidate, shortlistedCandidates]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update schedule or settings for an individual specific candidate
  const handleCandidateScheduleChange = (candId, field, value) => {
    setCandidateSchedules((prev) =>
      prev.map((s) => {
        if (s.candidateId === candId) {
          if (field === 'timeSlot' && value === 'Custom Time') {
            return { ...s, isCustomTime: true, timeSlot: '' };
          }
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  // Bulk Apply: set the same base date to all candidates
  const handleApplyDateToAll = (newDate) => {
    setFormData((prev) => ({ ...prev, globalDate: newDate }));
    setCandidateSchedules((prev) =>
      prev.map((s) => ({ ...s, interviewDate: newDate }))
    );
  };

  // Auto-distribute sequential time slots (e.g. 10:00, 11:00, 02:00 PM)
  const handleAutoAssignSequentialSlots = () => {
    const defaultSequential = [
      '10:00 AM - 10:45 AM',
      '11:00 AM - 11:45 AM',
      '12:00 PM - 12:45 PM',
      '02:00 PM - 02:45 PM',
      '03:00 PM - 03:45 PM',
      '04:00 PM - 04:45 PM',
      '05:00 PM - 05:45 PM'
    ];

    setCandidateSchedules((prev) =>
      prev.map((s, idx) => ({
        ...s,
        interviewDate: formData.globalDate || s.interviewDate,
        timeSlot: defaultSequential[idx % defaultSequential.length],
        isCustomTime: false
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.recruiterName || !formData.recruiterEmail || !formData.recruiterPhone) {
      setError('Please fill in Company Name, Your Name, Official Email, and Phone number.');
      return;
    }

    if (availableCandidates.length === 0) {
      setError('No available candidates to schedule. Already scheduled candidates cannot be re-scheduled.');
      return;
    }

    // Verify none of the candidates are already scheduled
    const alreadyScheduled = shortlistedCandidates.filter(
      (c) => c.interviewScheduled || c.status === 'Interview Scheduled'
    );
    if (alreadyScheduled.length > 0) {
      setError(`Interview is already scheduled for: ${alreadyScheduled.map((c) => c.name).join(', ')}. Already scheduled candidates cannot be re-scheduled.`);
      return;
    }

    // Verify all candidates have a non-empty time slot
    for (const s of candidateSchedules) {
      if (!s.timeSlot || !s.timeSlot.trim()) {
        setError(`Please specify an interview time slot for ${s.name}.`);
        return;
      }
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: formData.companyName,
          recruiterName: formData.recruiterName,
          recruiterEmail: formData.recruiterEmail,
          recruiterPhone: formData.recruiterPhone,
          candidateIds: availableCandidates.map((c) => c.id),
          candidateSchedules: candidateSchedules
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit interview request');

      // Trigger Celebration Confetti
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSuccessResponse(data.inquiry);
      if (onSuccess) onSuccess(availableCandidates.map((c) => c.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-lg" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '860px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ position: 'sticky', top: 0, background: '#ffffff', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              padding: '8px',
              borderRadius: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>
                {successResponse ? 'Interview Schedule Confirmed!' : 'Schedule Interviews for Shortlisted Candidates'}
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Individual time slot, interview mode, CTC budget & instructions per candidate
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ paddingTop: '16px' }}>
          {successResponse ? (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                border: '2px solid #bfdbfe'
              }}>
                <CheckCircle2 size={40} />
              </div>

              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#0f172a', fontWeight: 800 }}>
                Hiring Itinerary Confirmed!
              </h3>
              <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto 20px', fontSize: '0.94rem', lineHeight: 1.5 }}>
                Your request has been routed directly to Global Minds Technologies Head of Placements 
                (<strong>Mr. Navaneeth</strong> • +91 95974 37333). Each candidate has been booked with their separate designated time slot and budget.
              </p>

              {/* Reference ID Banner */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #bfdbfe',
                borderRadius: '10px',
                padding: '16px 20px',
                maxWidth: '560px',
                margin: '0 auto 22px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Booking Reference ID:</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563eb' }}>
                      {successResponse.referenceId}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Company:</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                      {successResponse.companyName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmed Candidate Specific Details List */}
              <div style={{ maxWidth: '720px', margin: '0 auto 24px', textAlign: 'left' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.03em' }}>
                  Specific Candidate Schedules & Packages ({candidateSchedules.length}):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {candidateSchedules.map((cand, idx) => (
                    <div key={idx} style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontWeight: 800,
                            fontSize: '0.74rem',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            Slot #{idx + 1}
                          </span>
                          <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{cand.name}</strong>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>({cand.category})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '3px 10px',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700
                          }}>
                            🕒 {cand.timeSlot}
                          </span>
                          <span style={{
                            background: '#f8fafc',
                            color: '#334155',
                            border: '1px solid #cbd5e1',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}>
                            📅 {cand.interviewDate}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
                        <div><strong>Mode:</strong> {cand.interviewMode}</div>
                        <div><strong>Offered CTC:</strong> <span style={{ color: '#15803d', fontWeight: 700 }}>{cand.ctcBudget}</span></div>
                        <div><strong>Round:</strong> {cand.roundType}</div>
                        {cand.notes && (
                          <div style={{ width: '100%', marginTop: '4px' }}>
                            <strong>Instructions:</strong> {cand.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" onClick={onClose} style={{ padding: '10px 24px', fontWeight: 700 }}>
                Done & Return to Portal
              </button>
            </div>
          ) : availableCandidates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '10px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '1.5px solid #fecaca'
              }}>
                <Calendar size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#0f172a', fontWeight: 800 }}>
                Candidate Already Scheduled
              </h3>
              <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 22px', fontSize: '0.92rem', lineHeight: 1.5 }}>
                An interview has already been scheduled for the selected candidate. To maintain placement integrity, duplicate interview bookings are strictly prohibited.
              </p>
              <button className="btn btn-primary" onClick={onClose} style={{ padding: '10px 26px', fontWeight: 700 }}>
                Return to Talent Desk
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  padding: '12px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '18px'
                }}>
                  {error}
                </div>
              )}

              {/* SECTION 1: Recruiter Contact Details */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 18px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.04em' }}>
                  1. Company & Recruiter Details
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      className="form-input"
                      placeholder="e.g. Infosys, Wipro, Accenture, Tech Startup Ltd."
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '10px' }}>
                    <label className="form-label">HR / Recruiter Full Name *</label>
                    <input
                      type="text"
                      name="recruiterName"
                      className="form-input"
                      placeholder="e.g. Priya Sharma"
                      value={formData.recruiterName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Official Work Email *</label>
                    <input
                      type="email"
                      name="recruiterEmail"
                      className="form-input"
                      placeholder="recruiter@company.com"
                      value={formData.recruiterEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">HR Contact / Mobile Number *</label>
                    <input
                      type="tel"
                      name="recruiterPhone"
                      className="form-input"
                      placeholder="+91 98765 43210"
                      value={formData.recruiterPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: SPECIFIC PROFILE INTERVIEW SETTINGS */}
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #bfdbfe',
                borderRadius: '12px',
                padding: '18px 20px',
                marginBottom: '20px',
                boxShadow: '0 2px 10px rgba(37, 99, 235, 0.05)'
              }}>
                {/* Section Header with Quick Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '14px',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '12px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        2. Interview Schedule & Details Per Shortlisted Candidate
                      </span>
                      <span style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #bfdbfe',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 800
                      }}>
                        {candidateSchedules.length} Candidates
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                      Configure separate interview timing, mode, budget, and specific guidelines for each profile below.
                    </div>
                  </div>

                  {/* Auto Sequential Distribute Button */}
                  {candidateSchedules.length > 1 && (
                    <button
                      type="button"
                      onClick={handleAutoAssignSequentialSlots}
                      style={{
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: '1px solid #93c5fd',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                      title="Automatically sequence non-overlapping 45-min slots starting from 10:00 AM"
                    >
                      <Wand2 size={13} />
                      <span>Auto-Space Time Slots (10 AM onwards)</span>
                    </button>
                  )}
                </div>

                {/* Optional Quick Date Applicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  marginBottom: '14px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                    Quick Date Apply to All:
                  </span>
                  <input
                    type="date"
                    value={formData.globalDate}
                    onChange={(e) => handleApplyDateToAll(e.target.value)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a'
                    }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    (Or choose separate dates per candidate card below)
                  </span>
                </div>

                {/* Specific Candidate Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {candidateSchedules.map((cand, idx) => (
                    <div 
                      key={cand.candidateId}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        padding: '16px 18px',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Candidate Title & Badge Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '14px',
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: '10px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: '#2563eb',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            Candidate #{idx + 1}
                          </span>
                          <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                            {cand.name}
                          </strong>
                          <span style={{
                            background: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {cand.category}
                          </span>
                          {cand.experience && (
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              • {cand.experience}
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: '4px' }}>
                          ✓ Individual Schedule & Budget
                        </div>
                      </div>

                      {/* Row 1: Date, Time Slot, Mode, CTC Budget */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '12px',
                        marginBottom: '12px'
                      }}>
                        {/* 1. Date */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                            📅 Interview Date *
                          </label>
                          <input
                            type="date"
                            value={cand.interviewDate}
                            onChange={(e) => handleCandidateScheduleChange(cand.candidateId, 'interviewDate', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              background: '#ffffff'
                            }}
                            required
                          />
                        </div>

                        {/* 2. Time Slot */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                            🕒 Time Slot *
                          </label>
                          {cand.isCustomTime ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input
                                type="text"
                                placeholder="e.g. 10:15 AM - 11:00 AM"
                                value={cand.timeSlot}
                                onChange={(e) => handleCandidateScheduleChange(cand.candidateId, 'timeSlot', e.target.value)}
                                style={{
                                  flex: 1,
                                  padding: '7px 10px',
                                  fontSize: '0.84rem',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '6px',
                                  background: '#ffffff'
                                }}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => handleCandidateScheduleChange(cand.candidateId, 'isCustomTime', false)}
                                style={{
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  color: '#64748b'
                                }}
                              >
                                Presets
                              </button>
                            </div>
                          ) : (
                            <select
                              value={cand.timeSlot}
                              onChange={(e) => handleCandidateScheduleChange(cand.candidateId, 'timeSlot', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '7px 10px',
                                fontSize: '0.84rem',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                background: '#ffffff',
                                color: '#1e293b',
                                fontWeight: 600
                              }}
                              required
                            >
                              {TIME_SLOT_OPTIONS.map((slot) => (
                                <option key={slot} value={slot}>
                                  {slot}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* 3. Interview Mode (Specific to this profile) */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                            💻 Interview Mode
                          </label>
                          <select
                            value={cand.interviewMode}
                            onChange={(e) => handleCandidateScheduleChange(cand.candidateId, 'interviewMode', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              background: '#ffffff',
                              color: '#1e293b'
                            }}
                          >
                            <option value="Virtual (Google Meet / Microsoft Teams)">Virtual (Google Meet / MS Teams)</option>
                            <option value="Campus / In-Person at Global Minds Center">Campus / In-Person at Global Minds Center</option>
                            <option value="At Recruiter Office (Client Location)">At Recruiter Office (Client Location)</option>
                            <option value="Telephonic Round 1">Telephonic Round 1</option>
                          </select>
                        </div>

                        {/* 4. Offered CTC / Budget (Specific to this profile) */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                            💰 Offered CTC / Budget
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 5.0 - 7.5 LPA"
                            value={cand.ctcBudget}
                            onChange={(e) => handleCandidateScheduleChange(cand.candidateId, 'ctcBudget', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              background: '#ffffff',
                              fontWeight: 600,
                              color: '#166534'
                            }}
                          />
                        </div>
                      </div>

                      {/* Row 2: Round Format & Specific Instructions for this candidate */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '12px'
                      }}>
                        {/* 5. Round Format */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                            🎯 Round / Format
                          </label>
                          <select
                            value={cand.roundType}
                            onChange={(e) => handleCandidateScheduleChange(cand.candidateId, 'roundType', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              background: '#ffffff',
                              color: '#334155'
                            }}
                          >
                            <option value="Round 1 (Technical & Coding)">Round 1 (Technical & Coding)</option>
                            <option value="Round 1 (Problem Solving & Logic)">Round 1 (Problem Solving & Logic)</option>
                            <option value="Round 2 (System Design / Project Review)">Round 2 (System Design / Project Review)</option>
                            <option value="Final Managerial & HR Round">Final Managerial & HR Round</option>
                            <option value="Direct Technical Interview">Direct Technical Interview</option>
                          </select>
                        </div>

                        {/* 6. Specific Instructions / Meeting Link for this candidate */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                            📝 Instructions & Meeting Details for {cand.name.split(' ')[0]}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Google Meet link, HackerRank link, or role prerequisites..."
                            value={cand.notes}
                            onChange={(e) => handleCandidateScheduleChange(cand.candidateId, 'notes', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              fontSize: '0.84rem',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              background: '#ffffff'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isSubmitting}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontWeight: 700 }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? 'Scheduling Itinerary...' : `Confirm Schedule for ${candidateSchedules.length} Candidates`}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
