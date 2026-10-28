import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  FileText, 
  User, 
  Mail, 
  Sparkles, 
  Check, 
  Layers, 
  Send, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck,
  ChevronRight,
  Info,
  CalendarCheck
} from 'lucide-react';

// Helper date formatters
const getTodayStr = () => new Date().toISOString().split('T')[0];

const getTomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const getInTwoDaysStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
};

const getNextMondayStr = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
};

const formatDateLabel = (isoDateStr) => {
  try {
    const [y, m, d] = (isoDateStr || '').split('-').map(Number);
    if (!y || !m || !d) return isoDateStr;
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return isoDateStr;
  }
};

const formatFullDate = (isoDateStr) => {
  try {
    const [y, m, d] = (isoDateStr || '').split('-').map(Number);
    if (!y || !m || !d) return isoDateStr;
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return isoDateStr;
  }
};

const TIME_SLOTS_BY_PERIOD = {
  morning: [
    { label: '09:30 AM - 10:15 AM', tag: 'Fast-Track' },
    { label: '10:30 AM - 11:15 AM', tag: 'Most Popular' },
    { label: '11:30 AM - 12:15 PM', tag: 'Available' }
  ],
  afternoon: [
    { label: '02:00 PM - 02:45 PM', tag: 'Available' },
    { label: '03:00 PM - 03:45 PM', tag: 'Recommended' },
    { label: '04:00 PM - 04:45 PM', tag: 'Available' }
  ],
  evening: [
    { label: '05:00 PM - 05:45 PM', tag: 'Available' },
    { label: '06:00 PM - 06:45 PM', tag: 'After Hours' }
  ]
};

const INTERVIEW_MODES = [
  {
    id: 'Google Meet',
    label: 'Google Meet',
    tag: 'Recommended · Virtual',
    badge: '1-Click Room',
    desc: 'Automated video conference with interactive screen sharing & recording'
  },
  {
    id: 'Zoom',
    label: 'Zoom Meeting',
    tag: 'Enterprise Virtual',
    badge: 'HD Video',
    desc: 'Interactive video session with interactive whiteboard & live annotation'
  },
  {
    id: 'Microsoft Teams',
    label: 'Microsoft Teams',
    tag: 'Corporate Tenant',
    badge: 'MS Cloud',
    desc: 'Secure enterprise virtual meeting room with tenant compliance'
  },
  {
    id: 'In-Person',
    label: 'In-Person / Office',
    tag: 'On-Site Evaluation',
    badge: 'Campus',
    desc: 'Face-to-face technical walkthrough at your corporate office boardroom'
  },
  {
    id: 'Telephonic',
    label: 'Telephonic Discussion',
    tag: 'Direct Phone',
    badge: 'Audio Call',
    desc: 'Direct mobile conversation for initial screening or quick alignment'
  }
];

const INTERVIEW_ROUNDS = [
  {
    round: 'Round 1: Technical Screening & Fundamentals',
    short: 'R1: Technical Screening',
    focus: 'Core concepts, syntax, project portfolio, fundamentals review'
  },
  {
    round: 'Round 2: Problem Solving & Live Coding',
    short: 'R2: Live Coding',
    focus: 'Hands-on problem solving, algorithm design, live pair coding'
  },
  {
    round: 'Round 3: System Architecture & Design',
    short: 'R3: System Architecture',
    focus: 'Microservices, database design, API scalability & code organization'
  },
  {
    round: 'Round 4: Techno-Managerial & Leadership Fit',
    short: 'R4: Techno-Managerial',
    focus: 'Product mindset, engineering execution, delivery governance'
  },
  {
    round: 'Final Round: HR & Compensation Discussion',
    short: 'Final: HR & Offer',
    focus: 'Culture fit, immediate joining date, CTC & offer finalization'
  }
];

const QUICK_NOTE_TEMPLATES = [
  {
    label: '💻 Live Coding Session',
    text: 'Please join 5 minutes early in a quiet workspace. Have your favorite code editor/IDE ready with screen sharing enabled. We will complete a collaborative technical walkthrough.'
  },
  {
    label: '🎯 Architecture & Fundamentals',
    text: 'This round focuses on system design, database modeling, and portfolio discussions. Please be prepared to discuss past projects from your resume in detail.'
  },
  {
    label: '🤝 Managerial & Culture Fit',
    text: 'An interactive discussion on problem solving, team collaboration, career goals, and immediate availability with the engineering leadership.'
  },
  {
    label: '📝 Final Offer & Compensation',
    text: 'Final round to discuss role expectations, compensation benchmarks, joining formalities, and immediate deployment timeline.'
  }
];

const CTC_BANDS = [
  '3.5 - 6.5 LPA',
  '6.5 - 10.0 LPA',
  '10.0 - 15.0 LPA',
  '15.0 - 25.0 LPA',
  'Custom Discussion'
];

export default function BossScheduleCandidatePage({
  candidate,
  existingSchedule = null,
  companyName = 'TCS',
  recruiterName = 'Sharma',
  recruiterEmail = 'recruiter@company.com',
  onConfirmSchedule,
  onCancel,
  onViewResume
}) {
  if (!candidate) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#71717a' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#18181b', marginBottom: '8px' }}>
          No candidate selected for interview scheduling.
        </h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
          Please select a candidate from your shortlist or candidate pool to schedule their interview.
        </p>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: '#09090b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 24px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          ← Return to Candidate Pool
        </button>
      </div>
    );
  }

  const defaultDate = existingSchedule?.date || getTomorrowStr();
  const defaultSlot = existingSchedule?.timeSlot || '10:30 AM - 11:15 AM';
  const defaultMode = existingSchedule?.mode || 'Google Meet';

  const [date, setDate] = useState(defaultDate);
  const [datePreset, setDatePreset] = useState('tomorrow');
  const [timeSlot, setTimeSlot] = useState(defaultSlot);
  const [isCustomSlot, setIsCustomSlot] = useState(false);
  const [customStartTime, setCustomStartTime] = useState('10:30');
  const [customEndTime, setCustomEndTime] = useState('11:15');
  const [duration, setDuration] = useState(existingSchedule?.duration || '45 mins');
  const [mode, setMode] = useState(defaultMode);

  // Generate clean default meeting details per mode
  const getDefaultMeetingDetail = (m) => {
    const slug = (candidate.id || 'hire').toString().replace(/[^a-zA-Z0-9]/g, '').slice(0, 6) || 'boss';
    if (m === 'Google Meet') return `https://meet.google.com/gm-${slug}-desk`;
    if (m === 'Zoom') return `https://zoom.us/j/8492048${slug.slice(0, 3)}?pwd=gmDirect`;
    if (m === 'Microsoft Teams') return `https://teams.microsoft.com/l/meetup-join/gm-${slug}`;
    if (m === 'In-Person') return `${companyName} Corporate Headquarters, Executive Boardroom 402`;
    if (m === 'Telephonic') return candidate.phone || '+91 98765 43210';
    return '';
  };

  const [meetingDetails, setMeetingDetails] = useState(
    existingSchedule?.meetingDetails || getDefaultMeetingDetail(defaultMode)
  );

  const [round, setRound] = useState(
    existingSchedule?.round || 'Round 1: Technical Screening & Fundamentals'
  );
  const [interviewerNameInput, setInterviewerNameInput] = useState(
    existingSchedule?.interviewerName || recruiterName
  );
  const [interviewerEmailInput, setInterviewerEmailInput] = useState(
    existingSchedule?.interviewerEmail || recruiterEmail
  );
  const [ctc, setCtc] = useState(existingSchedule?.ctc || '6.5 - 10.0 LPA');
  const [notes, setNotes] = useState(
    existingSchedule?.notes ||
      'Please join the interview 5 minutes in advance with a quiet environment and camera enabled. Have your portfolio and code editor ready.'
  );

  const [copiedLink, setCopiedLink] = useState(false);

  // Handle Preset Date selection
  const handleSelectDatePreset = (presetKey) => {
    setDatePreset(presetKey);
    if (presetKey === 'today') setDate(getTodayStr());
    else if (presetKey === 'tomorrow') setDate(getTomorrowStr());
    else if (presetKey === 'in2days') setDate(getInTwoDaysStr());
    else if (presetKey === 'nextmonday') setDate(getNextMondayStr());
  };

  // Handle Mode Change
  const handleSelectMode = (newMode) => {
    setMode(newMode);
    setMeetingDetails(getDefaultMeetingDetail(newMode));
  };

  const handleCopyLink = () => {
    if (!meetingDetails) return;
    navigator.clipboard.writeText(meetingDetails);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleApplyNoteTemplate = (tpl) => {
    setNotes(tpl.text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalSlot = isCustomSlot
      ? `${customStartTime} - ${customEndTime}`
      : timeSlot;

    const payload = {
      date,
      timeSlot: finalSlot,
      duration,
      mode,
      meetingDetails: meetingDetails.trim(),
      round,
      interviewerName: interviewerNameInput.trim() || recruiterName,
      interviewerEmail: interviewerEmailInput.trim() || recruiterEmail,
      companyName,
      ctc,
      notes: notes.trim(),
      scheduledAt: new Date().toISOString()
    };

    onConfirmSchedule(candidate, payload);
  };

  const initials =
    candidate.name
      ?.split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'CD';

  const datePresets = [
    { key: 'today', title: 'Today', dateStr: getTodayStr(), badge: null },
    { key: 'tomorrow', title: 'Tomorrow', dateStr: getTomorrowStr(), badge: 'Popular' },
    { key: 'in2days', title: 'In 2 Days', dateStr: getInTwoDaysStr(), badge: null },
    { key: 'nextmonday', title: 'Next Monday', dateStr: getNextMondayStr(), badge: 'Fast-Track' }
  ];

  const currentRoundObj = useMemo(() => {
    return INTERVIEW_ROUNDS.find((r) => r.round === round) || INTERVIEW_ROUNDS[0];
  }, [round]);

  return (
    <div className="boss-sched-modern-root">
      <style>{`
        .boss-sched-modern-root {
          max-width: 1240px;
          margin: 0 auto;
          padding: 8px 12px 60px;
          color: #09090b;
          font-family: 'Figtree', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .boss-sched-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .boss-sched-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 9999px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 700;
          color: #27272a;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .boss-sched-back-btn:hover {
          background: #09090b;
          color: #ffffff;
          border-color: #09090b;
          transform: translateX(-2px);
        }

        .boss-sched-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 9999px;
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        /* Hero Banner Card */
        .boss-sched-candidate-hero {
          background: linear-gradient(135deg, #09090b 0%, #18181b 100%);
          border-radius: 20px;
          padding: 24px 28px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 28px;
          box-shadow: 0 12px 36px -12px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
        }

        .boss-sched-candidate-hero::after {
          content: '';
          position: absolute;
          top: -60px;
          right: -40px;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .boss-sched-hero-profile {
          display: flex;
          align-items: center;
          gap: 18px;
          z-index: 1;
        }

        .boss-sched-hero-avatar {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: #ffffff;
          color: #09090b;
          display: grid;
          place-items: center;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          font-size: 24px;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .boss-sched-hero-details h1 {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 800;
          margin: 0 0 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.02em;
        }

        .boss-sched-hero-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          color: #a1a1aa;
          font-size: 13.5px;
        }

        .boss-sched-hero-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .boss-sched-hero-skills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .boss-sched-hero-skill-chip {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 3px 10px;
          border-radius: 9999px;
          font-size: 11.5px;
          font-weight: 600;
          color: #f4f4f5;
        }

        .boss-sched-hero-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1;
        }

        .boss-sched-btn-hero-preview {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 9999px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .boss-sched-btn-hero-preview:hover {
          background: #ffffff;
          color: #09090b;
        }

        /* 2-Column Responsive Workspace Grid */
        .boss-sched-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: start;
        }

        @media (max-width: 1040px) {
          .boss-sched-workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Left Column: Form Sections */
        .boss-sched-section-card {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 20px;
          padding: 24px 26px;
          margin-bottom: 22px;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .boss-sched-section-card:focus-within {
          border-color: #a1a1aa;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .boss-sched-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #f4f4f5;
        }

        .boss-sched-section-head-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .boss-sched-step-num {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: #09090b;
          color: #ffffff;
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 800;
          font-family: 'Bricolage Grotesque', sans-serif;
        }

        .boss-sched-section-title {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 18px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .boss-sched-section-tag {
          font-size: 12px;
          color: #71717a;
          font-weight: 500;
        }

        /* Preset Day Tiles */
        .boss-sched-date-presets {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }

        @media (max-width: 680px) {
          .boss-sched-date-presets {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .boss-sched-date-tile {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 14px;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .boss-sched-date-tile:hover {
          border-color: #09090b;
          transform: translateY(-2px);
          background: #ffffff;
        }

        .boss-sched-date-tile.active {
          background: #09090b;
          color: #ffffff;
          border-color: #09090b;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
        }

        .boss-sched-date-tile-label {
          font-size: 13.5px;
          font-weight: 800;
        }

        .boss-sched-date-tile-date {
          font-size: 12px;
          color: inherit;
          opacity: 0.75;
        }

        .boss-sched-date-tile-badge {
          position: absolute;
          top: -8px;
          right: 8px;
          background: #10b981;
          color: #ffffff;
          font-size: 9.5px;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* Date input & duration picker */
        .boss-sched-datetime-subgrid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          margin-bottom: 20px;
          background: #fbfbfe;
          border: 1px solid #f1f1f4;
          border-radius: 14px;
          padding: 14px 16px;
        }

        .boss-sched-field-label {
          font-size: 12px;
          font-weight: 700;
          color: #52525b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
          display: block;
        }

        .boss-sched-date-input {
          height: 42px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid #d4d4d8;
          font-size: 14px;
          font-weight: 600;
          color: #09090b;
          background: #ffffff;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }

        .boss-sched-date-input:focus {
          border-color: #09090b;
        }

        .boss-sched-duration-pills {
          display: flex;
          gap: 6px;
        }

        .boss-sched-duration-btn {
          height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1px solid #d4d4d8;
          background: #ffffff;
          color: #27272a;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .boss-sched-duration-btn:hover {
          border-color: #09090b;
        }

        .boss-sched-duration-btn.active {
          background: #09090b;
          color: #ffffff;
          border-color: #09090b;
        }

        /* Time slots grouping */
        .boss-sched-slot-group {
          margin-bottom: 14px;
        }

        .boss-sched-slot-group-header {
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717a;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .boss-sched-slot-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .boss-sched-slot-chip {
          background: #ffffff;
          border: 1px solid #e4e4e7;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #27272a;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .boss-sched-slot-chip:hover {
          border-color: #09090b;
          background: #fafafa;
        }

        .boss-sched-slot-chip.active {
          background: #09090b;
          color: #ffffff;
          border-color: #09090b;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        }

        .boss-sched-slot-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 9999px;
          background: #f4f4f5;
          color: #52525b;
        }

        .boss-sched-slot-chip.active .boss-sched-slot-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        /* Mode Selection Cards */
        .boss-sched-mode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .boss-sched-mode-card {
          border: 1.5px solid #e4e4e7;
          background: #ffffff;
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
        }

        .boss-sched-mode-card:hover {
          border-color: #09090b;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
        }

        .boss-sched-mode-card.active {
          border-color: #09090b;
          background: #fafafa;
          box-shadow: 0 0 0 2px #09090b;
        }

        .boss-sched-mode-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .boss-sched-mode-title {
          font-size: 14px;
          font-weight: 800;
          color: #09090b;
        }

        .boss-sched-mode-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 7px;
          border-radius: 9999px;
          background: #f4f4f5;
          color: #52525b;
        }

        .boss-sched-mode-card.active .boss-sched-mode-badge {
          background: #09090b;
          color: #ffffff;
        }

        .boss-sched-mode-desc {
          font-size: 11.5px;
          color: #71717a;
          line-height: 1.4;
        }

        /* Room Details input with quick copy */
        .boss-sched-room-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 4px 6px 4px 14px;
        }

        .boss-sched-room-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 13.5px;
          font-weight: 600;
          color: #09090b;
          outline: none;
          padding: 8px 0;
        }

        .boss-sched-btn-copy {
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #09090b;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .boss-sched-btn-copy:hover {
          background: #09090b;
          color: #ffffff;
          border-color: #09090b;
        }

        /* Round Selection Cards */
        .boss-sched-rounds-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .boss-sched-round-item {
          border: 1px solid #e4e4e7;
          background: #ffffff;
          border-radius: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .boss-sched-round-item:hover {
          border-color: #09090b;
          background: #fafafa;
        }

        .boss-sched-round-item.active {
          border-color: #09090b;
          background: #09090b;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
        }

        .boss-sched-round-item-title {
          font-size: 13.5px;
          font-weight: 800;
          display: block;
        }

        .boss-sched-round-item-desc {
          font-size: 12px;
          color: #71717a;
          margin-top: 2px;
          display: block;
        }

        .boss-sched-round-item.active .boss-sched-round-item-desc {
          color: #d4d4d8;
        }

        /* CTC Band Chips */
        .boss-sched-ctc-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .boss-sched-ctc-chip {
          border: 1px solid #e4e4e7;
          background: #ffffff;
          border-radius: 9999px;
          padding: 7px 16px;
          font-size: 12.5px;
          font-weight: 700;
          color: #27272a;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .boss-sched-ctc-chip:hover {
          border-color: #09090b;
        }

        .boss-sched-ctc-chip.active {
          background: #09090b;
          color: #ffffff;
          border-color: #09090b;
        }

        /* Textarea and quick templates */
        .boss-sched-tpl-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .boss-sched-tpl-chip {
          background: #f4f4f5;
          border: 1px solid #e4e4e7;
          border-radius: 9999px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          color: #3f3f46;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .boss-sched-tpl-chip:hover {
          background: #09090b;
          color: #ffffff;
          border-color: #09090b;
        }

        .boss-sched-textarea {
          width: 100%;
          min-height: 90px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #d4d4d8;
          font-size: 13.5px;
          font-family: inherit;
          color: #09090b;
          background: #ffffff;
          outline: none;
          box-sizing: border-box;
          line-height: 1.5;
          resize: vertical;
        }

        .boss-sched-textarea:focus {
          border-color: #09090b;
        }

        /* RIGHT COLUMN: Sticky Confirmation Ticket Pass */
        .boss-sched-ticket-panel {
          position: sticky;
          top: 86px;
        }

        .boss-sched-ticket-card {
          background: #ffffff;
          border: 1.5px solid #09090b;
          border-radius: 22px;
          box-shadow: 0 16px 48px -12px rgba(0, 0, 0, 0.18);
          overflow: hidden;
          position: relative;
        }

        .boss-sched-ticket-header {
          background: #09090b;
          color: #ffffff;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .boss-sched-ticket-brand {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #a1a1aa;
        }

        .boss-sched-ticket-brand span {
          color: #ffffff;
        }

        .boss-sched-ticket-pulse {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #34d399;
          background: rgba(16, 185, 129, 0.15);
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .boss-sched-ticket-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }

        .boss-sched-ticket-body {
          padding: 22px;
        }

        .boss-sched-ticket-cand-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px dashed #e4e4e7;
          margin-bottom: 18px;
        }

        .boss-sched-ticket-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #09090b;
          color: #ffffff;
          display: grid;
          place-items: center;
          font-family: 'Bricolage Grotesque', sans-serif;
          font-weight: 800;
          font-size: 18px;
          flex-shrink: 0;
        }

        .boss-sched-ticket-cand-name {
          font-size: 17px;
          font-weight: 800;
          margin: 0 0 3px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .boss-sched-ticket-cand-role {
          font-size: 12.5px;
          color: #71717a;
          margin: 0;
        }

        /* Large scheduled timing block */
        .boss-sched-ticket-time-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 18px;
        }

        .boss-sched-ticket-time-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .boss-sched-ticket-time-main {
          font-family: 'Bricolage Grotesque', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #09090b;
          letter-spacing: -0.01em;
          margin-bottom: 4px;
        }

        .boss-sched-ticket-time-sub {
          font-size: 13px;
          font-weight: 600;
          color: #059669;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Ticket details row */
        .boss-sched-ticket-specs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 22px;
          font-size: 13px;
        }

        .boss-sched-ticket-spec-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .boss-sched-ticket-spec-label {
          color: #71717a;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .boss-sched-ticket-spec-val {
          color: #09090b;
          font-weight: 700;
          text-align: right;
          word-break: break-word;
        }

        .boss-page-root .boss-sched-ticket-cta-btn,
        .boss-sched-modern-root .boss-sched-ticket-cta-btn,
        button.boss-sched-ticket-cta-btn {
          width: 100%;
          background: #09090b !important;
          color: #ffffff !important;
          border: 1px solid #27272a !important;
          border-radius: 14px;
          padding: 14px 20px;
          font-size: 14.5px;
          font-weight: 800;
          cursor: pointer;
          display: flex !important;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: all 0.15s ease;
          box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.4);
          letter-spacing: -0.01em;
        }

        .boss-page-root .boss-sched-ticket-cta-btn:hover,
        .boss-sched-modern-root .boss-sched-ticket-cta-btn:hover,
        button.boss-sched-ticket-cta-btn:hover {
          background: #27272a !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.5);
        }

        .boss-page-root .boss-sched-ticket-cta-btn *,
        .boss-sched-modern-root .boss-sched-ticket-cta-btn * {
          color: #ffffff !important;
          stroke: #ffffff !important;
        }

        /* Ensure active date presets and slot chips always have bright white text */
        .boss-page-root .boss-sched-date-tile.active,
        .boss-page-root .boss-sched-date-tile.active *,
        .boss-sched-modern-root .boss-sched-date-tile.active,
        .boss-sched-modern-root .boss-sched-date-tile.active * {
          color: #ffffff !important;
        }

        .boss-page-root .boss-sched-slot-chip.active,
        .boss-page-root .boss-sched-slot-chip.active *,
        .boss-sched-modern-root .boss-sched-slot-chip.active,
        .boss-sched-modern-root .boss-sched-slot-chip.active * {
          color: #ffffff !important;
        }

        .boss-page-root .boss-sched-btn-hero-preview,
        .boss-page-root .boss-sched-btn-hero-preview *,
        .boss-sched-modern-root .boss-sched-btn-hero-preview,
        .boss-sched-modern-root .boss-sched-btn-hero-preview * {
          color: #ffffff !important;
        }

        .boss-sched-ticket-cancel-btn {
          width: 100%;
          background: transparent;
          color: #71717a;
          border: none;
          padding: 10px 0 0;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-align: center;
          transition: color 0.15s ease;
        }

        .boss-sched-ticket-cancel-btn:hover {
          color: #09090b;
          text-decoration: underline;
        }

        .boss-sched-ticket-foot-note {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: #71717a;
          margin-top: 16px;
          line-height: 1.4;
          padding-top: 14px;
          border-top: 1px solid #f4f4f5;
        }
      `}</style>

      {/* Top Bar with Navigation & Status */}
      <div className="boss-sched-topbar">
        <button type="button" className="boss-sched-back-btn" onClick={onCancel}>
          <ArrowLeft size={15} />
          <span>Back to Workspace</span>
        </button>

        <div className="boss-sched-status-badge">
          <ShieldCheck size={14} />
          <span>Direct Interview Desk · Guaranteed 48-Hour Availability</span>
        </div>
      </div>

      {/* Candidate Hero Card */}
      <div className="boss-sched-candidate-hero">
        <div className="boss-sched-hero-profile">
          <div className="boss-sched-hero-avatar">{initials}</div>
          <div className="boss-sched-hero-details">
            <h1>
              <span>{candidate.name}</span>
              <CheckCircle2 size={20} color="#10b981" />
            </h1>
            <div className="boss-sched-hero-meta">
              <span className="boss-sched-hero-meta-item">
                <Briefcase size={14} />
                <span>{candidate.role || `${candidate.category || 'Software'} Engineer`}</span>
              </span>
              <span>•</span>
              <span className="boss-sched-hero-meta-item">
                <MapPin size={14} />
                <span>{candidate.location || 'Bengaluru'}</span>
              </span>
              <span>•</span>
              <span className="boss-sched-hero-meta-item">
                <GraduationCap size={14} />
                <span>{candidate.education || 'Degree in Engineering'}</span>
              </span>
            </div>

            <div className="boss-sched-hero-skills">
              {(candidate.skills || ['Core Development', 'Problem Solving']).slice(0, 5).map((sk) => (
                <span key={sk} className="boss-sched-hero-skill-chip">{sk}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="boss-sched-hero-actions">
          {onViewResume && (
            <button
              type="button"
              className="boss-sched-btn-hero-preview"
              onClick={() => onViewResume(candidate)}
              title="Preview verified resume document"
            >
              <FileText size={15} />
              <span>Preview Resume</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="boss-sched-workspace-grid">
          
          {/* =================================================================
              LEFT COLUMN: FORM CONTROLS
              ================================================================= */}
          <div className="boss-sched-controls-col">
            
            {/* SECTION 1: TIMING & DATE */}
            <div className="boss-sched-section-card">
              <div className="boss-sched-section-head">
                <div className="boss-sched-section-head-left">
                  <div className="boss-sched-step-num">1</div>
                  <div>
                    <h2 className="boss-sched-section-title">Interview Timing & Date</h2>
                    <span className="boss-sched-section-tag">Choose preferred date preset or select custom date & duration</span>
                  </div>
                </div>
              </div>

              {/* Date Presets */}
              <div className="boss-sched-date-presets">
                {datePresets.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    className={`boss-sched-date-tile ${datePreset === preset.key && date === preset.dateStr ? 'active' : ''}`}
                    onClick={() => handleSelectDatePreset(preset.key)}
                  >
                    {preset.badge && <span className="boss-sched-date-tile-badge">{preset.badge}</span>}
                    <span className="boss-sched-date-tile-label">{preset.title}</span>
                    <span className="boss-sched-date-tile-date">{formatDateLabel(preset.dateStr)}</span>
                  </button>
                ))}
              </div>

              {/* Custom Date Input & Duration Selector */}
              <div className="boss-sched-datetime-subgrid">
                <div>
                  <label className="boss-sched-field-label">Interview Date (Calendar Pick)</label>
                  <input
                    type="date"
                    className="boss-sched-date-input"
                    value={date}
                    min={getTodayStr()}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setDatePreset('custom');
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="boss-sched-field-label">Session Duration</label>
                  <div className="boss-sched-duration-pills">
                    {['30 mins', '45 mins', '60 mins'].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        className={`boss-sched-duration-btn ${duration === dur ? 'active' : ''}`}
                        onClick={() => setDuration(dur)}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Standard Time Slot Groups */}
              <label className="boss-sched-field-label" style={{ marginBottom: '10px' }}>
                Select Confirmed Time Slot (IST)
              </label>

              {/* Morning */}
              <div className="boss-sched-slot-group">
                <div className="boss-sched-slot-group-header">
                  <span>🌅 Morning Slots</span>
                </div>
                <div className="boss-sched-slot-chips">
                  {TIME_SLOTS_BY_PERIOD.morning.map((slot) => (
                    <button
                      key={slot.label}
                      type="button"
                      className={`boss-sched-slot-chip ${!isCustomSlot && timeSlot === slot.label ? 'active' : ''}`}
                      onClick={() => {
                        setIsCustomSlot(false);
                        setTimeSlot(slot.label);
                      }}
                    >
                      <Clock size={13} />
                      <span>{slot.label}</span>
                      <span className="boss-sched-slot-badge">{slot.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div className="boss-sched-slot-group">
                <div className="boss-sched-slot-group-header">
                  <span>☀️ Afternoon Slots</span>
                </div>
                <div className="boss-sched-slot-chips">
                  {TIME_SLOTS_BY_PERIOD.afternoon.map((slot) => (
                    <button
                      key={slot.label}
                      type="button"
                      className={`boss-sched-slot-chip ${!isCustomSlot && timeSlot === slot.label ? 'active' : ''}`}
                      onClick={() => {
                        setIsCustomSlot(false);
                        setTimeSlot(slot.label);
                      }}
                    >
                      <Clock size={13} />
                      <span>{slot.label}</span>
                      <span className="boss-sched-slot-badge">{slot.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evening */}
              <div className="boss-sched-slot-group">
                <div className="boss-sched-slot-group-header">
                  <span>🌆 Evening Slots</span>
                </div>
                <div className="boss-sched-slot-chips">
                  {TIME_SLOTS_BY_PERIOD.evening.map((slot) => (
                    <button
                      key={slot.label}
                      type="button"
                      className={`boss-sched-slot-chip ${!isCustomSlot && timeSlot === slot.label ? 'active' : ''}`}
                      onClick={() => {
                        setIsCustomSlot(false);
                        setTimeSlot(slot.label);
                      }}
                    >
                      <Clock size={13} />
                      <span>{slot.label}</span>
                      <span className="boss-sched-slot-badge">{slot.tag}</span>
                    </button>
                  ))}
                  
                  {/* Custom Slot Toggle */}
                  <button
                    type="button"
                    className={`boss-sched-slot-chip ${isCustomSlot ? 'active' : ''}`}
                    onClick={() => setIsCustomSlot(true)}
                  >
                    <span>⏱ Custom Slot</span>
                  </button>
                </div>
              </div>

              {/* Custom Time Range Picker */}
              {isCustomSlot && (
                <div style={{
                  marginTop: '14px',
                  padding: '14px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div>
                    <label className="boss-sched-field-label">Start Time</label>
                    <input
                      type="time"
                      value={customStartTime}
                      onChange={(e) => setCustomStartTime(e.target.value)}
                      className="boss-sched-date-input"
                      style={{ width: '130px' }}
                    />
                  </div>
                  <div>
                    <label className="boss-sched-field-label">End Time</label>
                    <input
                      type="time"
                      value={customEndTime}
                      onChange={(e) => setCustomEndTime(e.target.value)}
                      className="boss-sched-date-input"
                      style={{ width: '130px' }}
                    />
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginTop: '16px' }}>
                    Custom slot will be issued as: <b>{customStartTime} - {customEndTime}</b>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: MODE & LINK */}
            <div className="boss-sched-section-card">
              <div className="boss-sched-section-head">
                <div className="boss-sched-section-head-left">
                  <div className="boss-sched-step-num">2</div>
                  <div>
                    <h2 className="boss-sched-section-title">Interview Mode & Communication Channel</h2>
                    <span className="boss-sched-section-tag">Pick your preferred meeting software or physical location</span>
                  </div>
                </div>
              </div>

              <div className="boss-sched-mode-grid">
                {INTERVIEW_MODES.map((m) => (
                  <div
                    key={m.id}
                    className={`boss-sched-mode-card ${mode === m.id ? 'active' : ''}`}
                    onClick={() => handleSelectMode(m.id)}
                  >
                    <div className="boss-sched-mode-card-top">
                      <span className="boss-sched-mode-title">{m.label}</span>
                      <span className="boss-sched-mode-badge">{m.badge}</span>
                    </div>
                    <span className="boss-sched-mode-desc">{m.desc}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="boss-sched-field-label">
                  {mode === 'In-Person'
                    ? '🏢 Boardroom Office Facility & Address *'
                    : mode === 'Telephonic'
                    ? '📞 Direct Candidate Mobile Contact *'
                    : `🌐 ${mode} Meeting URL / Room Link *`}
                </label>
                <div className="boss-sched-room-input-wrap">
                  <input
                    type="text"
                    className="boss-sched-room-input"
                    value={meetingDetails}
                    onChange={(e) => setMeetingDetails(e.target.value)}
                    placeholder={
                      mode === 'In-Person'
                        ? 'e.g. TCS Innovation Campus, Tower 3, Floor 4, Room 402'
                        : mode === 'Telephonic'
                        ? '+91 98765 43210'
                        : 'https://meet.google.com/...'
                    }
                    required
                  />
                  {meetingDetails && (
                    <button
                      type="button"
                      className="boss-sched-btn-copy"
                      onClick={handleCopyLink}
                      title="Copy meeting link or address"
                    >
                      {copiedLink ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 3: HOST DETAILS & CANDIDATE NOTES */}
            <div className="boss-sched-section-card">
              <div className="boss-sched-section-head">
                <div className="boss-sched-section-head-left">
                  <div className="boss-sched-step-num">3</div>
                  <div>
                    <h2 className="boss-sched-section-title">Interviewer & Candidate Notes</h2>
                    <span className="boss-sched-section-tag">Host contacts and preparatory guidelines for candidate</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label className="boss-sched-field-label">Lead Interviewer / Host Name</label>
                  <input
                    type="text"
                    className="boss-sched-date-input"
                    value={interviewerNameInput}
                    onChange={(e) => setInterviewerNameInput(e.target.value)}
                    placeholder="e.g. Sharma (Technical Lead)"
                    required
                  />
                </div>
                <div>
                  <label className="boss-sched-field-label">Host Corporate Email</label>
                  <input
                    type="email"
                    className="boss-sched-date-input"
                    value={interviewerEmailInput}
                    onChange={(e) => setInterviewerEmailInput(e.target.value)}
                    placeholder="interviewer@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="boss-sched-field-label">Quick Template Notes for Candidate</label>
                <div className="boss-sched-tpl-chips">
                  {QUICK_NOTE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      className="boss-sched-tpl-chip"
                      onClick={() => handleApplyNoteTemplate(tpl)}
                    >
                      <span>{tpl.label}</span>
                    </button>
                  ))}
                </div>

                <textarea
                  className="boss-sched-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions or guidelines for the candidate..."
                />
              </div>

              {/* Bottom Actions Bar in Form */}
              <div style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid #e4e4e7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    background: 'transparent',
                    border: '1px solid #d4d4d8',
                    color: '#52525b',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ✕ Cancel & Return
                </button>

                <button
                  type="submit"
                  style={{
                    background: '#09090b',
                    color: '#ffffff',
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    fontWeight: 800,
                    fontSize: '14.5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '9px',
                    boxShadow: '0 6px 20px -4px rgba(0, 0, 0, 0.35)'
                  }}
                >
                  <CheckCircle2 size={18} color="#10b981" style={{ stroke: '#10b981', flexShrink: 0 }} />
                  <span style={{ color: '#ffffff', fontWeight: 800 }}>Confirm & Issue Schedule</span>
                </button>
              </div>
            </div>

          </div>

          {/* =================================================================
              RIGHT COLUMN: STICKY CONFIRMATION TICKET PASS
              ================================================================= */}
          <div className="boss-sched-ticket-panel">
            <div className="boss-sched-ticket-card">
              
              {/* Ticket Top Banner */}
              <div className="boss-sched-ticket-header">
                <div className="boss-sched-ticket-brand">
                  <Sparkles size={14} color="#ffffff" />
                  <span>INTERVIEW PASS</span>
                </div>
                <div className="boss-sched-ticket-pulse">
                  <div className="boss-sched-ticket-pulse-dot" />
                  <span>READY TO ISSUE</span>
                </div>
              </div>

              {/* Ticket Content */}
              <div className="boss-sched-ticket-body">
                
                {/* Candidate Info */}
                <div className="boss-sched-ticket-cand-row">
                  <div className="boss-sched-ticket-avatar">{initials}</div>
                  <div>
                    <h3 className="boss-sched-ticket-cand-name">
                      <span>{candidate.name}</span>
                      <CheckCircle2 size={16} color="#10b981" />
                    </h3>
                    <p className="boss-sched-ticket-cand-role">
                      {candidate.role || `${candidate.category || 'Software'} Engineer`}
                    </p>
                  </div>
                </div>

                {/* Scheduled Time Banner Box */}
                <div className="boss-sched-ticket-time-box">
                  <div className="boss-sched-ticket-time-label">
                    <CalendarCheck size={13} />
                    <span>CONFIRMED TIME SLOT</span>
                  </div>
                  <div className="boss-sched-ticket-time-main">
                    {isCustomSlot ? `${customStartTime} - ${customEndTime}` : timeSlot}
                  </div>
                  <div className="boss-sched-ticket-time-sub">
                    <CalendarIcon size={13} />
                    <span>{formatFullDate(date)} ({duration})</span>
                  </div>
                </div>

                {/* Verified Specs List */}
                <div className="boss-sched-ticket-specs">
                  <div className="boss-sched-ticket-spec-item">
                    <span className="boss-sched-ticket-spec-label">Interview Mode:</span>
                    <span className="boss-sched-ticket-spec-val">{mode}</span>
                  </div>
                  <div className="boss-sched-ticket-spec-item">
                    <span className="boss-sched-ticket-spec-label">Meeting Room / Link:</span>
                    <span className="boss-sched-ticket-spec-val" style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {meetingDetails || 'Auto-generated room'}
                    </span>
                  </div>
                  <div className="boss-sched-ticket-spec-item">
                    <span className="boss-sched-ticket-spec-label">Lead Interviewer:</span>
                    <span className="boss-sched-ticket-spec-val">{interviewerNameInput || recruiterName}</span>
                  </div>
                  <div className="boss-sched-ticket-spec-item">
                    <span className="boss-sched-ticket-spec-label">Hiring Company:</span>
                    <span className="boss-sched-ticket-spec-val">{companyName}</span>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="boss-sched-ticket-cta-btn"
                  style={{
                    width: '100%',
                    background: '#09090b',
                    color: '#ffffff',
                    border: '1px solid #27272a',
                    borderRadius: '14px',
                    padding: '14px 20px',
                    fontSize: '15px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <CheckCircle2 size={19} color="#10b981" style={{ stroke: '#10b981', flexShrink: 0 }} />
                  <span style={{ color: '#ffffff', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.01em' }}>
                    Confirm & Issue Schedule
                  </span>
                </button>

                {/* Cancel Action */}
                <button type="button" className="boss-sched-ticket-cancel-btn" onClick={onCancel}>
                  Cancel & Return to Workspace
                </button>

                {/* Footnote reassurance */}
                <div className="boss-sched-ticket-foot-note">
                  <Info size={14} color="#71717a" style={{ flexShrink: 0 }} />
                  <span>
                    Auto-sends Google Calendar invite, meeting room credentials, and SMS notification to {candidate.name}.
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
