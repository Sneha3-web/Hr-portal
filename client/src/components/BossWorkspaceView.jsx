import React, { useState, useMemo, useEffect } from 'react';
import BossScheduleCandidatePage from './BossScheduleCandidatePage';

// Exact candidates dataset from the attached HTML snippet
const DEFAULT_HTML_CANDIDATES = [
  { id: 'gm-c-1', name: 'Aswini Vemuluri', location: 'Bangalore', experience: '1-2 Years', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'Spring Boot', 'MySQL'] },
  { id: 'gm-c-2', name: 'Kali Rishi K', location: 'Bangalore', experience: 'Fresher', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'Hibernate', 'REST'] },
  { id: 'gm-c-3', name: 'Lokesh Vishwakarma', location: 'Bangalore', experience: '1-2 Years', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'Microservices', 'Kafka'] },
  { id: 'gm-c-4', name: 'Meera Iyer', location: 'Chennai', experience: '2-4 Years', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'Spring', 'AWS'] },
  { id: 'gm-c-5', name: 'Rahul Menon', location: 'Hyderabad', experience: '1-2 Years', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'JUnit', 'Docker'] },
  { id: 'gm-c-6', name: 'Sneha Patil', location: 'Pune', experience: 'Fresher', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'SQL', 'Maven'] },
  { id: 'gm-c-7', name: 'Karthik Raj', location: 'Chennai', experience: '2-4 Years', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'Redis', 'Jenkins'] },
  { id: 'gm-c-8', name: 'Divya Nair', location: 'Bangalore', experience: 'Fresher', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'Spring Boot', 'Git'] },
  { id: 'gm-c-9', name: 'Arjun Rao', location: 'Hyderabad', experience: '1-2 Years', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'MongoDB', 'REST'] },
  { id: 'gm-c-10', name: 'Pooja Sharma', location: 'Pune', experience: '2-4 Years', role: 'Java & Backend Engineer', category: 'Java Developer', skills: ['Java', 'Kubernetes', 'Kafka'] }
];

const DEFAULT_DOMAINS_TEMPLATE = [
  ["All Domains", 10],
  ["Full Stack Developer", 17],
  ["Java Developer", 10],
  ["Devops", 12],
  ["Python Developer", 7],
  ["Frontend Developer", 5],
  ["React.js Developer", 3],
  ["Data Analyst", 4],
  ["Machine Learning", 1],
  ["Testing Role", 1]
];

export default function BossWorkspaceView({
  user,
  candidates = [],
  categories = [],
  shortlist = [],
  onToggleShortlist,
  bossScheduledCandidates = [],
  viewedCandidates = [],
  onClearExploredHistory,
  activeTab = 'domain',
  onSelectTab,
  selectedCategory = 'All Domains',
  onSelectCategory,
  onViewResume,
  onDownloadResume,
  onDownloadBulk,
  onViewDetails,
  onScheduleInterview,
  onCancelInterview,
  onProceedToSchedule,
  onClearShortlist,
  onGoHome,
  onLogout
}) {
  // S.view: "pool" | "short" | "sched" | "explored" | "schedule_candidate"
  const [view, setView] = useState(() => {
    if (activeTab === 'shortlist') return 'short';
    if (activeTab === 'scheduled') return 'sched';
    if (activeTab === 'explored') return 'explored';
    return 'pool';
  });

  // Sync external activeTab prop to internal view state
  useEffect(() => {
    if (activeTab === 'shortlist') setView('short');
    else if (activeTab === 'scheduled') setView('sched');
    else if (activeTab === 'explored') setView('explored');
    else if (activeTab === 'domain' || activeTab === 'pool') setView('pool');
  }, [activeTab]);

  // Unified view selector that notifies parent onSelectTab
  const handleSelectView = (nextView) => {
    setView(nextView);
    if (onSelectTab) {
      if (nextView === 'short') onSelectTab('shortlist');
      else if (nextView === 'sched') onSelectTab('scheduled');
      else if (nextView === 'explored') onSelectTab('explored');
      else if (nextView === 'pool') onSelectTab('domain');
    }
  };

  // Track candidate currently being scheduled on the dedicated schedule page
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);
  const [previousView, setPreviousView] = useState('pool');

  // Detailed schedule records (timing, mode, meet link, round, etc.)
  const [localSchedDetails, setLocalSchedDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_portal_boss_schedules');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Scheduled view filter mode
  const [schedFilterMode, setSchedFilterMode] = useState('all');

  const resolveDomainIndex = (catName) => {
    if (!catName || catName === 'All Domains') return 0;
    const lower = catName.toLowerCase().trim();
    const idx = DEFAULT_DOMAINS_TEMPLATE.findIndex(
      ([name]) => {
        const n = name.toLowerCase().trim();
        return n === lower || lower.includes(n) || n.includes(lower);
      }
    );
    return idx !== -1 ? idx : 0;
  };

  const [domIndex, setDomIndex] = useState(() => resolveDomainIndex(selectedCategory));

  useEffect(() => {
    setDomIndex(resolveDomainIndex(selectedCategory));
  }, [selectedCategory]);
  const [q, setQ] = useState('');
  const [exp, setExp] = useState('');
  const [loc, setLoc] = useState('');
  const [sort, setSort] = useState('n');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [toastMsg, setToastMsg] = useState('');

  // Local short, scheduled, and explored maps for responsive instant state updates
  const [localShort, setLocalShort] = useState({});
  const [localSched, setLocalSched] = useState({});
  const [localExplored, setLocalExplored] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_portal_boss_explored_resumes');
      const list = saved ? JSON.parse(saved) : [];
      const map = {};
      if (Array.isArray(list)) {
        list.forEach((c) => {
          if (c.id != null) map[String(c.id)] = true;
          if (c.candidateId != null) map[String(c.candidateId)] = true;
          if (c.name) map[c.name.toLowerCase().trim()] = true;
        });
      }
      return map;
    } catch (e) {
      return {};
    }
  });

  // Sync prop shortlist to local map
  useEffect(() => {
    const map = {};
    if (Array.isArray(shortlist)) {
      shortlist.forEach((c) => {
        if (c.id != null) {
          map[c.id] = true;
          map[String(c.id)] = true;
        }
        if (c.name) map[c.name.toLowerCase().trim()] = true;
      });
    }
    setLocalShort(map);
  }, [shortlist]);

  // Sync prop viewedCandidates to local explored map
  useEffect(() => {
    if (Array.isArray(viewedCandidates)) {
      setLocalExplored((prev) => {
        const next = { ...prev };
        viewedCandidates.forEach((c) => {
          if (c.id != null) next[String(c.id)] = true;
          if (c.candidateId != null) next[String(c.candidateId)] = true;
          if (c.name) next[c.name.toLowerCase().trim()] = true;
        });
        return next;
      });
    }
  }, [viewedCandidates]);

  // Sync scheduled candidates to local map and details
  useEffect(() => {
    const map = {};
    const detailsMap = {};
    if (Array.isArray(bossScheduledCandidates)) {
      bossScheduledCandidates.forEach((c) => {
        const cId = c.id != null ? String(c.id) : null;
        const cName = c.name ? c.name.toLowerCase().trim() : null;
        if (cId) {
          map[cId] = true;
          if (c.scheduleDetails) detailsMap[cId] = c.scheduleDetails;
        }
        if (cName) {
          map[cName] = true;
          if (c.scheduleDetails) detailsMap[cName] = c.scheduleDetails;
        }
      });
    }
    setLocalSched(map);
    setLocalSchedDetails(detailsMap);
    try {
      localStorage.setItem('hr_portal_boss_schedules', JSON.stringify(detailsMap));
    } catch (e) {}
  }, [bossScheduledCandidates]);

  const toast = (text) => {
    setToastMsg(text);
    clearTimeout(toast.t);
    toast.t = setTimeout(() => {
      setToastMsg('');
    }, 1800);
  };

  const ini = (name = '') => {
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'GM';
  };

  // Combine default 10 candidates with any server candidates, shortlisted candidates, and scheduled candidates
  const allCandidates = useMemo(() => {
    const list = [...DEFAULT_HTML_CANDIDATES];
    const appendCandidate = (cand) => {
      if (!cand) return;
      const candId = cand.id != null ? String(cand.id) : null;
      const candName = cand.name ? cand.name.toLowerCase().trim() : null;
      const exists = list.some(
        (c) => (c.id != null && candId && String(c.id) === candId) || (c.name && candName && c.name.toLowerCase().trim() === candName)
      );
      if (!exists) {
        list.push({
          id: cand.id || `gm-cand-${Math.random()}`,
          name: cand.name || 'Candidate',
          location: cand.location || 'Bangalore',
          experience: cand.experience || '1-2 Years',
          role: cand.role || `${cand.category || 'Software'} Engineer`,
          category: cand.category || 'Java Developer',
          skills: Array.isArray(cand.skills) && cand.skills.length > 0 ? cand.skills : ['Java', 'Spring Boot', 'SQL'],
          ...cand
        });
      }
    };

    if (Array.isArray(candidates) && candidates.length > 0) {
      candidates.forEach(appendCandidate);
    }
    if (Array.isArray(shortlist) && shortlist.length > 0) {
      shortlist.forEach(appendCandidate);
    }
    if (Array.isArray(bossScheduledCandidates) && bossScheduledCandidates.length > 0) {
      bossScheduledCandidates.forEach(appendCandidate);
    }
    if (Array.isArray(viewedCandidates) && viewedCandidates.length > 0) {
      viewedCandidates.forEach(appendCandidate);
    }
    try {
      const saved = localStorage.getItem('hr_portal_boss_explored_resumes');
      const savedList = saved ? JSON.parse(saved) : [];
      if (Array.isArray(savedList)) {
        savedList.forEach(appendCandidate);
      }
    } catch (e) {}
    return list;
  }, [candidates, shortlist, bossScheduledCandidates, viewedCandidates]);

  // Helper to check if candidate is actively scheduled
  const isCandidateSched = (cand) => {
    if (!cand) return false;
    const cId = cand.id != null ? String(cand.id) : null;
    const cName = cand.name ? cand.name.toLowerCase().trim() : null;

    if (cId && localSched[cId]) return true;
    if (cName && localSched[cName]) return true;
    if (cId && localSchedDetails[cId]) return true;
    if (cName && localSchedDetails[cName]) return true;
    if (Array.isArray(bossScheduledCandidates) && bossScheduledCandidates.some((b) => {
      const bId = b.id != null ? String(b.id) : null;
      const bName = b.name ? b.name.toLowerCase().trim() : null;
      return (bId && cId && bId === cId) || (bName && cName && bName === cName);
    })) {
      return true;
    }
    // Only if candidate explicitly has confirmed schedule details with date and time
    if (cand.scheduleDetails && cand.scheduleDetails.date && cand.interviewScheduled === true) {
      return true;
    }
    return false;
  };

  // Helper to check if candidate has been explored/viewed
  const isCandidateExplored = (cand) => {
    if (!cand) return false;
    const cId = cand.id != null ? String(cand.id) : null;
    const cCandId = cand.candidateId != null ? String(cand.candidateId) : null;
    const cName = cand.name ? cand.name.toLowerCase().trim() : null;

    if (cId && localExplored[cId]) return true;
    if (cCandId && localExplored[cCandId]) return true;
    if (cName && localExplored[cName]) return true;

    if (Array.isArray(viewedCandidates) && viewedCandidates.some((v) => {
      const vId = v.id != null ? String(v.id) : (v.candidateId != null ? String(v.candidateId) : null);
      const vName = v.name ? v.name.toLowerCase().trim() : null;
      const sameId = (cId && vId && cId === vId) || (cCandId && vId && cCandId === vId);
      const sameName = cName && vName && cName === vName;
      return sameId || sameName;
    })) {
      return true;
    }
    return false;
  };

  // Helper to retrieve detailed interview schedule specs
  const getCandidateScheduleDetails = (cand) => {
    if (!cand) return null;
    const cId = cand.id != null ? String(cand.id) : null;
    const cName = cand.name ? cand.name.toLowerCase().trim() : null;

    if (cId && localSchedDetails[cId]) return localSchedDetails[cId];
    if (cName && localSchedDetails[cName]) return localSchedDetails[cName];
    if (Array.isArray(bossScheduledCandidates)) {
      const found = bossScheduledCandidates.find((b) => {
        const bId = b.id != null ? String(b.id) : null;
        const bName = b.name ? b.name.toLowerCase().trim() : null;
        return (bId && cId && bId === cId) || (bName && cName && bName === cName);
      });
      if (found && found.scheduleDetails) return found.scheduleDetails;
    }
    if (cand.scheduleDetails) return cand.scheduleDetails;
    return null;
  };

  // Unique sorted locations
  const locs = useMemo(() => {
    const set = new Set();
    allCandidates.forEach((c) => {
      if (c.location) {
        const clean = c.location.split(/[,/]/)[0].trim();
        if (clean) set.add(clean);
      }
    });
    return Array.from(set).sort();
  }, [allCandidates]);

  // Filter candidates list matching attached HTML algorithm
  const filteredList = useMemo(() => {
    const query = q.toLowerCase().trim();

    return allCandidates
      .filter((c) => {
        const isShort = Boolean(
          (c.id && localShort[c.id]) ||
          (c.name && localShort[c.name.toLowerCase().trim()]) ||
          (Array.isArray(shortlist) && shortlist.some((s) => (s.id && c.id && s.id === c.id) || (s.name && c.name && s.name.toLowerCase().trim() === c.name.toLowerCase().trim())))
        );
        const isSched = isCandidateSched(c);

        if (view === 'short' && !isShort) return false;
        if (view === 'sched') {
          if (!isSched) return false;
          if (schedFilterMode !== 'all') {
            const details = getCandidateScheduleDetails(c);
            const modeName = (details?.mode || '').toLowerCase();
            if (schedFilterMode === 'google-meet' && !modeName.includes('meet')) return false;
            if (schedFilterMode === 'zoom' && !modeName.includes('zoom')) return false;
            if (schedFilterMode === 'in-person' && !modeName.includes('person') && !modeName.includes('office')) return false;
            if (schedFilterMode === 'telephonic' && !modeName.includes('phone') && !modeName.includes('tele')) return false;
            if (schedFilterMode === 'microsoft-teams' && !modeName.includes('teams')) return false;
          }
        }
        if (view === 'explored') {
          if (!isCandidateExplored(c)) return false;
        }

        // Domain filter in pool view
        if (view === 'pool') {
          if (domIndex === 1) {
            // "Java Developer" -> match Java candidates
            const cCat = (c.category || '').toLowerCase();
            const hasJava = (c.skills || []).some((s) => s.toLowerCase().includes('java')) || cCat.includes('java');
            if (!hasJava) return false;
          } else if (domIndex > 1) {
            const targetDom = DEFAULT_DOMAINS_TEMPLATE[domIndex][0].toLowerCase();
            const cCat = (c.category || '').toLowerCase();
            const skillMatch = (c.skills || []).some((s) => targetDom.includes(s.toLowerCase()));
            if (!cCat.includes(targetDom) && !skillMatch && !targetDom.includes(cCat)) {
              return false;
            }
          }
        }

        // Search filter
        if (query) {
          const hay = `${c.name} ${(c.skills || []).join(' ')} ${c.category || ''} ${c.location || ''}`.toLowerCase();
          if (hay.indexOf(query) === -1) return false;
        }

        // Experience filter
        if (exp) {
          if ((c.experience || '').indexOf(exp) !== 0) return false;
        }

        // Location filter
        if (loc) {
          if ((c.location || '').toLowerCase() !== loc.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const r = (a.name || '').localeCompare(b.name || '');
        return sort === 'z' ? -r : r;
      });
  }, [allCandidates, view, domIndex, q, exp, loc, sort, localShort, localSched, localSchedDetails, localExplored, viewedCandidates, bossScheduledCandidates, schedFilterMode, shortlist]);

  const shortCount = useMemo(() => {
    if (Array.isArray(shortlist)) {
      return shortlist.length;
    }
    return Object.values(localShort).filter(Boolean).length;
  }, [shortlist, localShort]);

  const schedCount = useMemo(() => {
    return allCandidates.filter((c) => isCandidateSched(c)).length;
  }, [allCandidates, localSched, localSchedDetails, bossScheduledCandidates]);

  const exploredCount = useMemo(() => {
    const fromPool = allCandidates.filter((c) => isCandidateExplored(c)).length;
    const directViewed = Array.isArray(viewedCandidates) ? viewedCandidates.length : 0;
    return Math.max(fromPool, directViewed);
  }, [allCandidates, localExplored, viewedCandidates]);

  // Dynamic live domain counts reflecting all verified candidates and created profiles
  const domainChips = useMemo(() => {
    return DEFAULT_DOMAINS_TEMPLATE.map(([domainName], i) => {
      if (i === 0) return [domainName, allCandidates.length];
      if (i === 1) {
        const count = allCandidates.filter((c) => {
          const cCat = (c.category || '').toLowerCase();
          return (c.skills || []).some((s) => s.toLowerCase().includes('java')) || cCat.includes('java');
        }).length;
        return [domainName, count];
      }
      const targetDom = domainName.toLowerCase();
      const count = allCandidates.filter((c) => {
        const cCat = (c.category || '').toLowerCase();
        const skillMatch = (c.skills || []).some((s) => targetDom.includes(s.toLowerCase()));
        return cCat.includes(targetDom) || skillMatch || targetDom.includes(cCat);
      }).length;
      return [domainName, count];
    });
  }, [allCandidates]);

  const title =
    view === 'schedule_candidate'
      ? `schedule interview with ${schedulingCandidate?.name || 'candidate'}`
      : view === 'pool'
      ? DEFAULT_DOMAINS_TEMPLATE[domIndex]
        ? DEFAULT_DOMAINS_TEMPLATE[domIndex][0]
        : 'Java Developer'
      : view === 'short'
      ? 'your shortlist'
      : view === 'sched'
      ? 'scheduled interviews'
      : 'explored resumes';

  const companyName = user?.companyName || 'TCS';
  const recruiterName = user?.name || 'sharma';
  const recruiterEmail = user?.email || 'gyavgva@gmail.com';

  const handleToggleShort = (candidate) => {
    const id = candidate.id != null ? String(candidate.id) : null;
    const nameKey = (candidate.name || '').toLowerCase().trim();
    const isCurrentlyShort = Boolean(
      (id && localShort[id]) ||
      (nameKey && localShort[nameKey]) ||
      (Array.isArray(shortlist) && shortlist.some((s) => (s.id != null && id && String(s.id) === id) || (s.name && candidate.name && s.name.toLowerCase().trim() === nameKey)))
    );

    setLocalShort((prev) => {
      const next = { ...prev };
      if (isCurrentlyShort) {
        if (id) delete next[id];
        if (nameKey) delete next[nameKey];
      } else {
        if (id) next[id] = true;
        if (nameKey) next[nameKey] = true;
      }
      return next;
    });

    if (onToggleShortlist) {
      onToggleShortlist(candidate);
    }
    toast(isCurrentlyShort ? 'Removed from shortlist' : 'Added to shortlist');
  };

  // Records candidate resume inspection into explored history
  const handleExploreCandidate = (candidate) => {
    if (!candidate) return;
    const id = candidate.id != null ? String(candidate.id) : null;
    const nameKey = (candidate.name || '').toLowerCase().trim();

    setLocalExplored((prev) => {
      const next = { ...prev };
      if (id) next[id] = true;
      if (nameKey) next[nameKey] = true;
      return next;
    });

    try {
      const saved = localStorage.getItem('hr_portal_boss_explored_resumes');
      let list = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];
      const exists = list.some((c) => {
        const cId = c.id != null ? String(c.id) : (c.candidateId != null ? String(c.candidateId) : null);
        const cName = (c.name || '').toLowerCase().trim();
        return (id && cId && id === cId) || (nameKey && cName && nameKey === cName);
      });
      if (!exists) {
        const enriched = {
          ...candidate,
          id: candidate.id,
          candidateId: candidate.id,
          viewedAt: new Date().toISOString()
        };
        list.unshift(enriched);
        localStorage.setItem('hr_portal_boss_explored_resumes', JSON.stringify(list.slice(0, 100)));
      }
    } catch (e) {}

    if (onViewResume) {
      onViewResume(candidate);
    } else if (onViewDetails) {
      onViewDetails(candidate);
    }
  };

  // Clears explored resume session history
  const handleClearExplored = () => {
    setLocalExplored({});
    try {
      localStorage.removeItem('hr_portal_boss_explored_resumes');
    } catch (e) {}
    if (onClearExploredHistory) {
      onClearExploredHistory();
    }
    toast('Explored resume history cleared');
  };

  // Navigates directly to the dedicated interview scheduling page
  const handleStartScheduling = (candidate) => {
    if (!candidate) return;
    setSchedulingCandidate(candidate);
    setPreviousView(view === 'schedule_candidate' ? 'pool' : view);
    setView('schedule_candidate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirms individual candidate schedule with timing, mode, etc.
  const handleConfirmSchedule = (candidate, scheduleDetails) => {
    if (!candidate) return;
    const id = candidate.id != null ? String(candidate.id) : null;
    const nameKey = (candidate.name || '').toLowerCase().trim();

    setLocalSched((prev) => {
      const next = { ...prev };
      if (id) next[id] = true;
      if (nameKey) next[nameKey] = true;
      return next;
    });

    setLocalSchedDetails((prev) => {
      const next = { ...prev };
      if (id) next[id] = scheduleDetails;
      if (nameKey) next[nameKey] = scheduleDetails;
      try {
        localStorage.setItem('hr_portal_boss_schedules', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    candidate.interviewScheduled = true;
    candidate.status = 'Interview Scheduled';
    candidate.scheduleDetails = scheduleDetails;

    if (onScheduleInterview) {
      onScheduleInterview(candidate, scheduleDetails);
    }

    toast(`Interview scheduled with ${candidate.name} on ${scheduleDetails.date}`);
    setSchedulingCandidate(null);
    setView('sched');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancels an existing candidate schedule
  const handleCancelSchedule = (candidate) => {
    if (!candidate) return;
    const id = candidate.id != null ? String(candidate.id) : null;
    const rawId = candidate.id;
    const nameKey = (candidate.name || '').toLowerCase().trim();

    setLocalSched((prev) => {
      const next = { ...prev };
      if (id) delete next[id];
      if (rawId != null) delete next[rawId];
      if (nameKey) delete next[nameKey];
      return next;
    });

    setLocalSchedDetails((prev) => {
      const next = { ...prev };
      if (id) delete next[id];
      if (rawId != null) delete next[rawId];
      if (nameKey) delete next[nameKey];
      try {
        localStorage.setItem('hr_portal_boss_schedules', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Reset flags on candidate object
    candidate.interviewScheduled = false;
    candidate.status = 'Shortlisted';
    delete candidate.scheduleDetails;

    if (onCancelInterview) {
      onCancelInterview(candidate);
    }

    toast(`Interview cancelled for ${candidate.name}`);
  };

  return (
    <div className="boss-page-root">
      {/* Exact CSS from the user's attached HTML file */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=Figtree:wght@400;500;600&display=swap');

        .boss-page-root {
          --hero: #000;
          --hero2: #0d0d0d;
          --bg: #fff;
          --card: #fff;
          --ink: #000;
          --mute: #595959;
          --line: #d4d4d4;
          --em: #fff;
          --emd: #000;
          --sf: #000;
          --co: #fff;
          --chip: #f0f0f0;
          --on: #000;
          box-sizing: border-box;
          margin: 0;
          background: var(--bg);
          color: var(--ink);
          font: 400 15px/1.5 Figtree, system-ui, sans-serif;
          min-height: 100vh;
        }

        .boss-page-root * {
          box-sizing: border-box;
        }

        .boss-page-root h1,
        .boss-page-root h2,
        .boss-page-root h3,
        .boss-page-root .disp {
          font-family: 'Bricolage Grotesque', Figtree, system-ui, sans-serif;
          letter-spacing: -0.02em;
        }

        .boss-page-root button,
        .boss-page-root select,
        .boss-page-root input {
          font: inherit;
          color: inherit;
        }

        .boss-page-root :focus-visible {
          outline: 2px solid var(--sf);
          outline-offset: 2px;
        }

        .boss-page-root .top {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid #2a2a2a;
          color: #fff;
        }

        .boss-page-root .top-in {
          max-width: 1240px;
          margin: auto;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .boss-page-root .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 20px;
          white-space: nowrap;
          cursor: pointer;
        }

        .boss-page-root .logo i {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #fff;
          display: grid;
          place-items: center;
          color: #000;
          font-style: normal;
          font-size: 16px;
        }

        .boss-page-root .logo small {
          display: block;
          font: 400 11px Figtree;
          color: #a3a3a3;
          letter-spacing: 0;
        }

        .boss-page-root .pill {
          display: flex;
          background: #1f1f1f;
          border-radius: 999px;
          padding: 3px;
          margin-left: auto;
        }

        .boss-page-root .pill button {
          border: 0;
          background: none;
          padding: 6px 14px;
          border-radius: 999px;
          color: #d4d4d4;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.15s, color 0.15s;
        }

        .boss-page-root .pill .on {
          background: #fff;
          color: #000;
        }

        .boss-page-root .out {
          border: 1px solid #fff;
          background: transparent;
          color: #fff;
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.15s, color 0.15s;
        }

        .boss-page-root .out:hover {
          background: #fff;
          color: #000;
        }

        .boss-page-root .hero {
          background: radial-gradient(900px 300px at 85% -20%, rgba(255, 255, 255, 0.16), transparent 70%),
                      radial-gradient(600px 260px at 0% 110%, rgba(255, 255, 255, 0.08), transparent 70%),
                      var(--hero);
          color: #fff;
          padding: 28px 20px 0;
        }

        .boss-page-root .wrap {
          max-width: 1240px;
          margin: auto;
        }

        .boss-page-root .crumb {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 14px;
          color: #a3a3a3;
          margin-bottom: 20px;
          align-items: center;
        }

        .boss-page-root .crumb a,
        .boss-page-root .crumb button {
          color: #fff;
          text-decoration: none;
          border: 1px solid #444;
          background: transparent;
          padding: 7px 14px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 500;
          transition: border-color 0.15s;
        }

        .boss-page-root .crumb a:hover,
        .boss-page-root .crumb button:hover {
          border-color: #fff;
        }

        .boss-page-root .ws {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          background: linear-gradient(160deg, var(--hero2), #050505);
          border: 1px solid #2e2e2e;
          border-radius: 22px;
          padding: 22px;
        }

        .boss-page-root .ws .ic {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: #fff;
          color: #000;
          display: grid;
          place-items: center;
          font-size: 28px;
          box-shadow: 0 10px 30px -8px rgba(255, 255, 255, 0.4);
        }

        .boss-page-root .ws h1 {
          margin: 0;
          font-size: clamp(24px, 4vw, 34px);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          color: #fff;
        }

        .boss-page-root .ver {
          font: 600 12px Figtree;
          letter-spacing: 0;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.5);
          padding: 4px 10px;
          border-radius: 999px;
        }

        .boss-page-root .ws p {
          margin: 4px 0 0;
          color: #a3a3a3;
        }

        .boss-page-root .ws .grow {
          flex: 1;
          min-width: 220px;
        }

        .boss-page-root .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 18px;
          transform: translateY(50%);
        }

        .boss-page-root .stat {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          background: var(--card);
          color: var(--ink);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 14px 18px;
          cursor: pointer;
          text-align: left;
          box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.6);
          transition: transform 0.15s, background 0.15s, color 0.15s, border-color 0.15s;
        }

        .boss-page-root .stat:hover {
          transform: translateY(-2px);
        }

        .boss-page-root .stat b {
          font: 800 26px 'Bricolage Grotesque';
          min-width: 34px;
          text-align: center;
          border-radius: 10px;
          padding: 0 8px;
          background: var(--chip);
        }

        .boss-page-root .stat span {
          font-weight: 600;
        }

        .boss-page-root .stat.act {
          background: var(--ink);
          color: var(--bg);
          border-color: var(--ink);
        }

        .boss-page-root .stat.act b {
          background: rgba(128, 128, 128, 0.35);
        }

        .boss-page-root main {
          max-width: 1240px;
          margin: auto;
          padding: 90px 20px 60px;
        }

        .boss-page-root .chips {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 2px 12px;
          scrollbar-width: none;
          mask-image: linear-gradient(90deg, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, #000 92%, transparent);
        }

        .boss-page-root .chip {
          flex: none;
          border: 1px solid var(--line);
          background: var(--card);
          padding: 9px 16px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
          color: var(--ink);
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }

        .boss-page-root .chip:hover {
          border-color: var(--emd);
        }

        .boss-page-root .chip.on {
          background: var(--ink);
          color: var(--bg);
          border-color: var(--ink);
        }

        .boss-page-root .bar {
          display: grid;
          grid-template-columns: 1fr auto auto auto auto;
          gap: 10px;
          margin: 14px 0 18px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 12px;
        }

        .boss-page-root .bar input,
        .boss-page-root .bar select {
          border: 1px solid var(--line);
          background: var(--bg);
          border-radius: 12px;
          padding: 11px 14px;
          min-width: 0;
          color: var(--ink);
          outline: none;
        }

        .boss-page-root .bar input:focus,
        .boss-page-root .bar select:focus {
          border-color: var(--emd);
          outline: 2px solid var(--sf);
          outline-offset: 1px;
        }

        .boss-page-root .tog {
          display: flex;
          background: var(--chip);
          border-radius: 12px;
          padding: 3px;
        }

        .boss-page-root .tog button {
          border: 0;
          background: none;
          padding: 8px 12px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 600;
          color: var(--mute);
          transition: background 0.15s, color 0.15s;
        }

        .boss-page-root .tog .on {
          background: var(--card);
          color: var(--ink);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }

        .boss-page-root .count {
          color: var(--mute);
          margin: 0 0 14px;
          font-size: 15px;
        }

        .boss-page-root .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 18px;
        }

        .boss-page-root .card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }

        .boss-page-root .card:hover {
          transform: translateY(-4px);
          border-color: var(--emd);
          box-shadow: 0 24px 40px -22px rgba(128, 128, 128, 0.7);
        }

        .boss-page-root .card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 4px;
          background: var(--ink);
        }

        .boss-page-root .head {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .boss-page-root .av {
          position: relative;
          width: 56px;
          height: 56px;
          flex: none;
          border-radius: 16px;
          background: var(--hero);
          color: #fff;
          display: grid;
          place-items: center;
          font: 800 19px 'Bricolage Grotesque';
          cursor: pointer;
        }

        .boss-page-root .av::after {
          content: "";
          position: absolute;
          right: -3px;
          bottom: -3px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #000;
        }

        .boss-page-root .head h3 {
          margin: 0;
          font-size: 19px;
          cursor: pointer;
        }

        .boss-page-root .head h3:hover {
          text-decoration: underline;
        }

        .boss-page-root .role {
          color: var(--emd);
          font-weight: 600;
          font-size: 14px;
        }

        .boss-page-root .meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          color: var(--mute);
          font-size: 14px;
        }

        .boss-page-root .tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .boss-page-root .tags span {
          background: var(--chip);
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--ink);
        }

        .boss-page-root .act {
          display: flex;
          gap: 8px;
          margin-top: auto;
          align-items: center;
        }

        .boss-page-root .btn {
          flex: 1;
          border: 1px solid var(--line);
          background: none;
          border-radius: 12px;
          padding: 10px;
          cursor: pointer;
          font-weight: 600;
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }

        .boss-page-root .btn:hover {
          border-color: var(--ink);
        }

        .boss-page-root .btn.p {
          background: var(--ink);
          color: var(--bg);
          border-color: var(--ink);
        }

        .boss-page-root .btn.p:hover {
          background: var(--bg);
          border-color: var(--ink);
          color: var(--ink);
        }

        .boss-page-root .btn.sv {
          background: var(--ink);
          border-color: var(--ink);
          color: var(--bg);
        }

        .boss-page-root .btn.eye-btn {
          flex: 0 0 46px;
          padding: 10px 0;
          font-size: 15px;
          background: var(--chip);
          border: 1px solid var(--line);
        }

        .boss-page-root .btn.eye-btn:hover {
          background: var(--ink);
          color: var(--bg);
          border-color: var(--ink);
        }

        .boss-page-root .grid.list {
          grid-template-columns: 1fr;
        }

        .boss-page-root .list .card {
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
        }

        .boss-page-root .list .head {
          flex: 1 1 260px;
        }

        .boss-page-root .list .tags {
          flex: 1 1 200px;
        }

        .boss-page-root .list .act {
          margin: 0;
          flex: 0 1 300px;
        }

        .boss-page-root .empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 50px 10px;
          color: var(--mute);
          border: 1px dashed var(--line);
          border-radius: 20px;
        }

        .boss-page-root .sched-desk-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--chip);
          border: 1px solid var(--line);
          border-radius: 18px;
          padding: 18px 24px;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .boss-page-root .sched-desk-info h3 {
          margin: 0 0 4px;
          font-family: 'Bricolage Grotesque', Figtree, sans-serif;
          font-size: 20px;
          font-weight: 700;
        }

        .boss-page-root .sched-desk-info p {
          margin: 0;
          color: var(--mute);
          font-size: 14px;
        }

        .boss-page-root .sched-card-item {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 18px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 20px;
          flex-wrap: wrap;
        }

        .boss-page-root .sched-card-main {
          flex: 1 1 500px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .boss-page-root .sched-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .boss-page-root .sched-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .boss-page-root .sched-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          background: var(--chip);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 14px;
        }

        .boss-page-root .sched-detail-box {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .boss-page-root .sched-detail-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--mute);
        }

        .boss-page-root .sched-detail-val {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
        }

        .boss-page-root .sched-action-link {
          font-size: 11px;
          font-weight: 700;
          color: var(--ink);
          text-decoration: underline;
          padding: 2px 6px;
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 6px;
        }

        .boss-page-root .sched-copy-btn {
          font-size: 11px;
          font-weight: 600;
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 2px 8px;
          cursor: pointer;
          color: var(--ink);
        }

        .boss-page-root .sched-copy-btn:hover {
          background: var(--ink);
          color: var(--bg);
        }

        .boss-page-root .sched-notes-box {
          font-size: 13px;
          color: #404040;
          background: var(--bg);
          border-left: 3px solid var(--ink);
          padding: 8px 12px;
          border-radius: 0 8px 8px 0;
        }

        .boss-page-root .sched-card-actions {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          min-width: 180px;
        }

        @media (max-width: 768px) {
          .boss-page-root .sched-card-actions {
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
          }
        }

        .boss-page-root .toast {
          position: fixed;
          left: 50%;
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          transform: translate(-50%, 120px);
          background: var(--ink);
          color: var(--bg);
          padding: 12px 20px;
          border-radius: 14px;
          font-weight: 600;
          transition: transform 0.3s;
          z-index: 40;
          pointer-events: none;
        }

        .boss-page-root .toast.show {
          transform: translate(-50%, 0);
        }

        @media (max-width: 980px) {
          .boss-page-root .stats {
            grid-template-columns: repeat(2, 1fr);
            transform: translateY(40%);
          }
          .boss-page-root main {
            padding-top: 150px;
          }
          .boss-page-root .bar {
            grid-template-columns: 1fr 1fr;
          }
          .boss-page-root .bar input {
            grid-column: 1 / -1;
          }
          .boss-page-root .tog {
            justify-self: end;
          }
        }

        @media (max-width: 560px) {
          .boss-page-root .stats {
            grid-template-columns: 1fr;
          }
          .boss-page-root main {
            padding-top: 260px;
          }
          .boss-page-root .bar {
            grid-template-columns: 1fr;
          }
          .boss-page-root .ws .out:hover {
            background: #fff;
            color: #000;
          }
          .boss-page-root .out {
            width: 100%;
          }
          .boss-page-root .logo small {
            display: none;
          }
          .boss-page-root .top-in {
            justify-content: space-between;
          }
          .boss-page-root .out.t {
            margin-left: auto;
          }
          .boss-page-root .list .act {
            flex: 1 1 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .boss-page-root * {
            transition: none !important;
          }
        }
      `}</style>

      {/* TOP HEADER */}
      <header className="top">
        <div className="top-in">
          <div className="logo" onClick={onGoHome} title="Global Minds Direct Hiring">
            <i>✦</i>
            <div>
              Global Minds<small>Direct Hiring</small>
            </div>
          </div>
          <div className="pill" role="group" aria-label="Role">
            <button className="on">Boss Hiring Portal</button>
          </div>
          <button className="out t" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="wrap">
          <div className="crumb">
            <span style={{ color: 'var(--mute)' }}>
              🏢 Global Minds Hire Portal / <b style={{ color: '#fff' }}>Boss Direct Hiring Desk</b>
              {view === 'sched' && ' / Scheduled Interviews'}
              {view === 'short' && ' / Shortlisted Candidates'}
              {view === 'explored' && ' / Explored Resumes'}
              {view === 'schedule_candidate' && ' / Schedule Interview'}
            </span>
          </div>

          <div className="ws">
            <div className="ic">🏢</div>
            <div className="grow">
              <h1>
                {companyName} Hiring Workspace <span className="ver">✓ Verified boss credentials</span>
              </h1>
              <p>
                Signed in as <b style={{ color: '#fff' }}>{recruiterName}</b> ({recruiterEmail}) · Direct interview access unlocked
              </p>
            </div>
            <button className="out" onClick={onLogout}>Sign out</button>
          </div>

          {/* STATS BUTTONS (Instant Navigation) */}
          <div className="stats" id="stats">
            <button
              className={`stat ${view === 'pool' ? 'act' : ''}`}
              onClick={() => handleSelectView('pool')}
              data-v="pool"
              title="Click to view candidate pool"
            >
              <span>Browse candidate pool</span>
              <b>{allCandidates.length}</b>
            </button>

            <button
              className={`stat ${view === 'short' ? 'act' : ''}`}
              onClick={() => handleSelectView('short')}
              data-v="short"
              title="Click to navigate to shortlisted candidates"
            >
              <span>Shortlisted</span>
              <b>{shortCount}</b>
            </button>

            <button
              className={`stat ${view === 'sched' ? 'act' : ''}`}
              onClick={() => handleSelectView('sched')}
              data-v="sched"
              title="Click to navigate to scheduled interviews"
            >
              <span>Scheduled interviews</span>
              <b>{schedCount}</b>
            </button>

            <button
              className={`stat ${view === 'explored' ? 'act' : ''}`}
              onClick={() => handleSelectView('explored')}
              data-v="explored"
              title="Click to navigate to explored resumes"
            >
              <span>Explored resumes</span>
              <b>{exploredCount}</b>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main>
        {view === 'schedule_candidate' && schedulingCandidate ? (
          <BossScheduleCandidatePage
            candidate={schedulingCandidate}
            existingSchedule={getCandidateScheduleDetails(schedulingCandidate)}
            companyName={companyName}
            recruiterName={recruiterName}
            recruiterEmail={recruiterEmail}
            onConfirmSchedule={handleConfirmSchedule}
            onCancel={() => {
              setSchedulingCandidate(null);
              setView(previousView || 'pool');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewResume={(cand) => handleExploreCandidate(cand)}
          />
        ) : view === 'sched' ? (
          /* DEDICATED SCHEDULED INTERVIEWS DESK */
          <div>
            <div className="sched-desk-banner">
              <div className="sched-desk-info">
                <h3>📅 Scheduled Interviews Desk ({filteredList.length})</h3>
                <p>Individual candidate interview sessions scheduled with customized timing, mode, and parameters.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleSelectView('short')}
                  style={{
                    background: 'var(--card)',
                    color: 'var(--ink)',
                    borderRadius: '999px',
                    padding: '7px 16px',
                    fontWeight: 600,
                    border: '1px solid var(--line)'
                  }}
                >
                  ★ Shortlist ({shortCount})
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleSelectView('pool')}
                  style={{
                    background: 'var(--ink)',
                    color: 'var(--bg)',
                    borderRadius: '999px',
                    padding: '7px 16px',
                    fontWeight: 600,
                    border: '1px solid var(--ink)'
                  }}
                >
                  + Schedule Another Candidate
                </button>
              </div>
            </div>

            {/* Filter mode chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0 16px', margin: '4px 0 14px' }}>
              {['All', 'Google Meet', 'Zoom', 'In-Person', 'Telephonic', 'Microsoft Teams'].map((fMode) => {
                const modeKey = fMode.toLowerCase().replace(/[\s/]/g, '-');
                const active = (fMode === 'All' && schedFilterMode === 'all') || (schedFilterMode === modeKey);
                return (
                  <button
                    key={fMode}
                    className={`chip ${active ? 'on' : ''}`}
                    onClick={() => setSchedFilterMode(fMode === 'All' ? 'all' : modeKey)}
                  >
                    {fMode}
                  </button>
                );
              })}
            </div>

            {filteredList.length > 0 ? (
              filteredList.map((c) => {
                const s = getCandidateScheduleDetails(c) || {};
                return (
                  <article className="sched-card-item" key={c.id}>
                    <div className="sched-card-main">
                      <div className="sched-card-header">
                        <div
                          className="av"
                          onClick={() => handleExploreCandidate(c)}
                          style={{ cursor: 'pointer' }}
                          title="Preview full resume document"
                        >
                          {ini(c.name)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <h3
                              onClick={() => handleExploreCandidate(c)}
                              style={{ margin: 0, cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
                            >
                              {c.name}
                            </h3>
                            <span className="sched-status-badge">● Confirmed Interview</span>
                          </div>
                          <div className="role" style={{ color: 'var(--mute)', fontSize: '13px', marginTop: '2px' }}>
                            {c.role || c.category || 'Software Engineer'}
                          </div>
                          <div className="meta" style={{ marginTop: '4px', fontSize: '12px', display: 'flex', gap: '12px' }}>
                            <span>📍 {c.location || 'Bangalore'}</span>
                            <span>💼 {c.experience || 'Fresher'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="sched-details-grid">
                        <div className="sched-detail-box">
                          <span className="sched-detail-label">📅 Interview Timing</span>
                          <span className="sched-detail-val">
                            {s.date || 'Scheduled'} · {s.timeSlot || '10:30 AM - 11:15 AM'} ({s.duration || '45 mins'})
                          </span>
                        </div>

                        <div className="sched-detail-box">
                          <span className="sched-detail-label">
                            {s.mode === 'In-Person'
                              ? '🏢 In-Person Office'
                              : s.mode === 'Telephonic'
                              ? '📞 Direct Phone'
                              : `🌐 ${s.mode || 'Meeting Channel'}`}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span className="sched-detail-val" style={{ wordBreak: 'break-all' }}>
                              {s.meetingDetails || 'Virtual Link'}
                            </span>
                            {s.meetingDetails && s.meetingDetails.startsWith('http') && (
                              <a
                                href={s.meetingDetails}
                                target="_blank"
                                rel="noreferrer"
                                className="sched-action-link"
                                title="Open meeting link"
                              >
                                Join ↗
                              </a>
                            )}
                            {s.meetingDetails && (
                              <button
                                type="button"
                                className="sched-copy-btn"
                                onClick={() => {
                                  navigator.clipboard.writeText(s.meetingDetails);
                                  toast('Meeting info copied');
                                }}
                                title="Copy details"
                              >
                                Copy
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="sched-detail-box">
                          <span className="sched-detail-label">🎯 Evaluation Round</span>
                          <span className="sched-detail-val">{s.round || 'Technical Round 1'}</span>
                        </div>

                        <div className="sched-detail-box">
                          <span className="sched-detail-label">👤 Interview Host</span>
                          <span className="sched-detail-val">{s.interviewerName || recruiterName} ({s.companyName || companyName})</span>
                        </div>

                        {s.ctc && (
                          <div className="sched-detail-box">
                            <span className="sched-detail-label">💼 Proposed Budget</span>
                            <span className="sched-detail-val">{s.ctc}</span>
                          </div>
                        )}
                      </div>

                      {s.notes && (
                        <div className="sched-notes-box">
                          <strong>Candidate Instructions:</strong> {s.notes}
                        </div>
                      )}
                    </div>

                    <div className="sched-card-actions">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleExploreCandidate(c)}
                        style={{
                          background: 'var(--chip)',
                          color: 'var(--ink)',
                          border: '1px solid var(--line)',
                          borderRadius: '999px',
                          padding: '9px 18px',
                          fontWeight: 600
                        }}
                        title="Preview resume document"
                      >
                        👁️ Preview Resume
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleStartScheduling(c)}
                        style={{
                          background: 'var(--card)',
                          color: 'var(--ink)',
                          border: '1px solid var(--line)',
                          borderRadius: '999px',
                          padding: '9px 18px',
                          fontWeight: 600
                        }}
                        title="Edit timing or mode"
                      >
                        ✏️ Reschedule / Edit
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleCancelSchedule(c)}
                        style={{
                          background: 'var(--chip)',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '999px',
                          padding: '9px 16px',
                          fontWeight: 600
                        }}
                        title="Cancel interview"
                      >
                        ✕ Cancel Interview
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="empty">
                <b>No scheduled interviews match current filter.</b>
                <p style={{ margin: '8px 0 16px', color: 'var(--mute)' }}>
                  Browse your shortlist or the candidate pool and click "Schedule interview" on individual candidates to configure their timing and mode.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleSelectView('short')}
                    style={{ background: 'var(--card)', color: 'var(--ink)', borderRadius: '999px', padding: '8px 18px', fontWeight: 600, border: '1px solid var(--line)' }}
                  >
                    ★ Shortlist ({shortCount})
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleSelectView('pool')}
                    style={{ background: 'var(--ink)', color: 'var(--bg)', borderRadius: '999px', padding: '8px 18px', fontWeight: 600, border: '1px solid var(--ink)' }}
                  >
                    Browse Candidate Pool
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* REGULAR POOL / SHORTLIST / EXPLORED VIEW */
          <div>
            {/* Shortlist Active View Navigation Banner */}
            {view === 'short' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--chip)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '14px 20px',
                marginBottom: '16px',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '16px' }}>
                    <span>★</span>
                    <span>Shortlisted Candidates ({filteredList.length} profiles)</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '2px' }}>
                    Review shortlisted profiles and schedule individual interviews with custom timing and mode below.
                  </div>
                </div>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleSelectView('pool')}
                  style={{
                    flex: '0 0 auto',
                    background: 'var(--card)',
                    color: 'var(--ink)',
                    borderRadius: '999px',
                    padding: '7px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: '1px solid var(--line)'
                  }}
                >
                  ← Browse candidate pool
                </button>
              </div>
            )}

            {/* Explored Resumes Active View Navigation Banner */}
            {view === 'explored' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--chip)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '14px 20px',
                marginBottom: '16px',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '16px' }}>
                    <span>👁️</span>
                    <span>Explored Resumes ({filteredList.length} profiles)</span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '2px' }}>
                    Candidate resumes and verified credentials you have opened and inspected during this session.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleSelectView('pool')}
                    style={{
                      flex: '0 0 auto',
                      background: 'var(--card)',
                      color: 'var(--ink)',
                      borderRadius: '999px',
                      padding: '7px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: '1px solid var(--line)'
                    }}
                  >
                    ← Browse candidate pool
                  </button>
                  {filteredList.length > 0 && (
                    <button
                      type="button"
                      className="btn"
                      onClick={handleClearExplored}
                      style={{
                        flex: '0 0 auto',
                        background: 'transparent',
                        color: 'var(--mute)',
                        borderRadius: '999px',
                        padding: '7px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: '1px solid var(--line)'
                      }}
                      title="Clear explored resume session history"
                    >
                      Clear history
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* DOMAIN CHIPS (Shown in candidate pool view) */}
            {view === 'pool' && (
              <div className="chips" id="chips">
                {domainChips.map((d, i) => (
                  <button
                    key={d[0]}
                    className={`chip ${i === domIndex ? 'on' : ''}`}
                    onClick={() => {
                      setDomIndex(i);
                      if (onSelectCategory) onSelectCategory(d[0]);
                    }}
                    data-i={i}
                  >
                    {d[0]} ({d[1]})
                  </button>
                ))}
              </div>
            )}

            {/* FILTER BAR */}
            <div className="bar">
              <input
                id="q"
                type="search"
                placeholder="Search by candidate name, skills, tools…"
                aria-label="Search candidates"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                id="exp"
                aria-label="Experience"
                value={exp}
                onChange={(e) => setExp(e.target.value)}
              >
                <option value="">All experience</option>
                <option value="Fresher">Fresher</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="2-4 Years">2-4 Years</option>
              </select>

              <select
                id="loc"
                aria-label="Location"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
              >
                <option value="">All locations</option>
                {locs.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>

              <select
                id="sort"
                aria-label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="n">Name (A–Z)</option>
                <option value="z">Name (Z–A)</option>
              </select>

              <div className="tog">
                <button
                  id="g"
                  className={viewMode === 'grid' ? 'on' : ''}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  ▦
                </button>
                <button
                  id="l"
                  className={viewMode === 'list' ? 'on' : ''}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  ☰
                </button>
              </div>
            </div>

            {/* COUNT INDICATOR */}
            <p className="count" id="count">
              Showing <b>{filteredList.length}</b> verified candidates in <b>{title}</b>
            </p>

            {/* CANDIDATES GRID / LIST */}
            <div className={`grid ${viewMode === 'list' ? 'list' : ''}`} id="grid">
              {filteredList.length > 0 ? (
                filteredList.map((c) => {
                  const isShort = Boolean(
                    (c.id && localShort[c.id]) ||
                    (c.name && localShort[c.name.toLowerCase().trim()]) ||
                    (Array.isArray(shortlist) && shortlist.some((s) => (s.id && c.id && s.id === c.id) || (s.name && c.name && s.name.toLowerCase().trim() === c.name.toLowerCase().trim())))
                  );
                  const isSched = isCandidateSched(c);
                  const isExplored = isCandidateExplored(c);

                  return (
                    <article className="card" key={c.id}>
                      <div className="head">
                        <div 
                          className="av" 
                          onClick={() => handleExploreCandidate(c)}
                          title="Click avatar to preview resume"
                        >
                          {ini(c.name)}
                        </div>
                        <div>
                          <h3
                            onClick={() => handleExploreCandidate(c)}
                            title="Click name to view candidate resume"
                          >
                            {c.name}
                          </h3>
                          <div className="role" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>{c.role || 'Java & Backend Engineer'}</span>
                            {isExplored && (
                              <span 
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  background: '#f4f4f5',
                                  border: '1px solid #d4d4d8',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  color: '#3f3f46'
                                }}
                                title="Resume previously explored"
                              >
                                👁️ Explored
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="meta">
                        <span>📍 {c.location || 'Bangalore'}</span>
                        <span>💼 {c.experience === 'Fresher' ? 'Fresher (2024 batch)' : c.experience}</span>
                      </div>

                      <div className="tags">
                        {(Array.isArray(c.skills) ? c.skills : []).map((t, idx) => (
                          <span key={idx}>{t}</span>
                        ))}
                      </div>

                      <div className="act">
                        {/* Dedicated Eye Icon for full resume viewing */}
                        <button
                          type="button"
                          className={`btn eye-btn ${isExplored ? 'explored-active' : ''}`}
                          onClick={() => handleExploreCandidate(c)}
                          title="Preview full resume document"
                          style={{
                            background: isExplored ? '#09090b' : 'transparent',
                            color: isExplored ? '#ffffff' : 'inherit',
                            borderColor: isExplored ? '#09090b' : 'var(--line)'
                          }}
                        >
                          👁️
                        </button>

                        <button
                          className={`btn ${isShort ? 'sv' : ''}`}
                          onClick={() => handleToggleShort(c)}
                        >
                          {isShort ? '★ Shortlisted' : '☆ Shortlist'}
                        </button>

                        <button
                          className="btn p"
                          onClick={() => handleStartScheduling(c)}
                          title="Click to schedule interview with timing and mode"
                        >
                          Schedule interview
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="empty">
                  {view === 'explored' ? (
                    <div>
                      <div style={{ fontSize: '36px', marginBottom: '10px' }}>👁️</div>
                      <b style={{ fontSize: '18px' }}>No resumes explored yet.</b>
                      <p style={{ color: 'var(--mute)', maxWidth: '460px', margin: '8px auto 16px', fontSize: '14px', lineHeight: 1.5 }}>
                        Click the <b>👁️</b> eye icon, avatar, or candidate name on any profile in the pool to preview their resume. Explored resumes are saved here for instant review.
                      </p>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleSelectView('pool')}
                        style={{
                          display: 'inline-block',
                          background: 'var(--ink)',
                          color: 'var(--bg)',
                          borderRadius: '999px',
                          padding: '9px 22px',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}
                      >
                        Browse Candidate Pool
                      </button>
                    </div>
                  ) : (
                    <>
                      <b>No candidates match in {title}.</b>
                      <br />
                      {view !== 'pool' ? (
                        <button
                          type="button"
                          className="btn"
                          onClick={() => handleSelectView('pool')}
                          style={{
                            marginTop: '12px',
                            display: 'inline-block',
                            background: 'var(--ink)',
                            color: 'var(--bg)',
                            borderRadius: '999px',
                            padding: '8px 18px',
                            fontWeight: 600
                          }}
                        >
                          Browse Candidate Pool
                        </button>
                      ) : (
                        'Clear a filter or shortlist someone from the pool.'
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FLOATING TOAST NOTIFICATION */}
      <div className={`toast ${toastMsg ? 'show' : ''}`} id="toast" role="status">
        {toastMsg}
      </div>
    </div>
  );
}
