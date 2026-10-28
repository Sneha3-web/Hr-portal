import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryTabs from './components/CategoryTabs';
import DomainCards from './components/DomainCards';
import DomainGrid, { DOMAINS_LIST } from './components/DomainGrid';
import FilterBar from './components/FilterBar';
import CandidateCard from './components/CandidateCard';
import CandidateTableView from './components/CandidateTableView';
import ResumeViewerModal from './components/ResumeViewerModal';
import CandidateDetailModal from './components/CandidateDetailModal';
import ShortlistDrawer from './components/ShortlistDrawer';
import ScheduleInterviewModal from './components/ScheduleInterviewModal';
import UploadResumeModal from './components/UploadResumeModal';
import StudentUploadModal from './components/StudentUploadModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import AdminUploadView from './components/AdminUploadView';
import AuthModal from './components/AuthModal';
import HRAuthModal from './components/HRAuthModal';
import WhyHireUs from './components/WhyHireUs';
import ContactPlacementSection from './components/ContactPlacementSection';
import Footer from './components/Footer';
import TalentModeView from './components/TalentModeView';
import TalentJobFeed from './components/TalentJobFeed';
import PortalModeView from './components/PortalModeView';
import BossWorkspaceView from './components/BossWorkspaceView';
import { RefreshCw, Search, ArrowUpRight, ChevronDown, Lock, CheckCircle2, Building2, Eye, LogOut, Sparkles, Briefcase, ArrowRight, Calendar, Bookmark, Download } from 'lucide-react';

const PAGE_SIZE = 12;

export default function App() {
  // Data States
  const [candidates, setCandidates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Mode Selection: 'home' (public Global Minds landing) | 'boss' (Boss Mode) | 'talent' (Candidate Mode)
  const [appMode, setAppMode] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hr_portal_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        if (u && u.role === 'hr') return 'boss';
      }
      const saved = localStorage.getItem('hr_portal_app_mode');
      if (saved === 'boss' || saved === 'talent') return saved;
      return 'home';
    } catch (e) {
      return 'home';
    }
  });

  // Active sub-page / tab within Talent Mode: 'dossier' | 'bosses' | 'pipeline' | 'upload' | 'playbook'
  const [talentTab, setTalentTab] = useState(() => {
    try {
      return localStorage.getItem('hr_portal_talent_tab') || 'dossier';
    } catch (e) {
      return 'dossier';
    }
  });

  // Active Selected Domain / Filter States (Persisted for seamless return)
  const [activeDomain, setActiveDomain] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_portal_active_domain');
      if (saved) {
        const parsed = JSON.parse(saved);
        return DOMAINS_LIST.find((d) => d.name.toLowerCase() === (parsed.name || '').toLowerCase()) || parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('All Domains');
  const [search, setSearch] = useState(() => {
    try {
      return localStorage.getItem('hr_portal_search') || '';
    } catch (e) {
      return '';
    }
  });
  const [experience, setExperience] = useState(() => {
    try {
      return localStorage.getItem('hr_portal_experience') || 'all';
    } catch (e) {
      return 'all';
    }
  });
  const [location, setLocation] = useState(() => {
    try {
      return localStorage.getItem('hr_portal_location') || 'all';
    } catch (e) {
      return 'all';
    }
  });
  const [sort, setSort] = useState(() => {
    try {
      return localStorage.getItem('hr_portal_sort') || 'name_asc';
    } catch (e) {
      return 'name_asc';
    }
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showResumesPool, setShowResumesPool] = useState(false);

  // Per-HR Search History & Activity
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hr_portal_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        const savedHist = localStorage.getItem(`hr_portal_history_${u.email}`);
        return savedHist ? JSON.parse(savedHist) : [];
      }
      return [];
    } catch (e) {
      return [];
    }
  });
  const [viewedCandidates, setViewedCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_portal_boss_explored_resumes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hr_portal_boss_explored_resumes', JSON.stringify(viewedCandidates));
    } catch (e) {}
  }, [viewedCandidates]);

  const [relevantCandidates, setRelevantCandidates] = useState([]);
  const [historyTab, setHistoryTab] = useState('all'); // 'all' | 'relevant' | 'viewed'

  // Boss Activity & Console Tabs: 'domain' | 'explored' | 'scheduled' | 'shortlist'
  const [bossViewTab, setBossViewTab] = useState('domain');
  const [bossScheduledCandidates, setBossScheduledCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_portal_boss_scheduled_candidates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hr_portal_boss_scheduled_candidates', JSON.stringify(bossScheduledCandidates));
    } catch (e) {}
  }, [bossScheduledCandidates]);

  // User Session & Shortlist
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_portal_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [shortlist, setShortlist] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_portal_shortlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modals
  const [authModal, setAuthModal] = useState(null); // 'admin' | null
  const [hrModalOpen, setHrModalOpen] = useState(false);
  const [promptDomain, setPromptDomain] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [previewCandidate, setPreviewCandidate] = useState(null);
  const [detailCandidate, setDetailCandidate] = useState(null);
  const [shortlistDrawerOpen, setShortlistDrawerOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTargetCandidate, setScheduleTargetCandidate] = useState(null);

  const isCandidateFullyScheduled = (c) => Boolean(
    c && c.scheduleDetails && c.scheduleDetails.date && c.scheduleDetails.time
  );

  // Live shortlist resolved against candidate status (guarantees confirmed scheduled profiles are removed)
  const liveShortlist = useMemo(() => {
    return shortlist
      .map((s) => {
        const live = candidates.find(
          (c) => c.id === s.id || (c.name && s.name && c.name.toLowerCase().trim() === s.name.toLowerCase().trim())
        );
        return live ? { ...s, ...live } : s;
      })
      .filter((s) => !isCandidateFullyScheduled(s));
  }, [shortlist, candidates]);

  // Clean confirmed scheduled candidates out of saved shortlist in localStorage
  useEffect(() => {
    if (candidates.length > 0 && shortlist.length > 0) {
      const scheduledIds = new Set(
        candidates
          .filter((c) => isCandidateFullyScheduled(c))
          .map((c) => c.id)
      );
      const scheduledNames = new Set(
        candidates
          .filter((c) => isCandidateFullyScheduled(c))
          .map((c) => (c.name || '').toLowerCase().trim())
      );

      const hasScheduled = shortlist.some(
        (s) => scheduledIds.has(s.id) || scheduledNames.has((s.name || '').toLowerCase().trim())
      );

      if (hasScheduled) {
        setShortlist((prev) => {
          const cleaned = prev.filter(
            (s) => !scheduledIds.has(s.id) && !scheduledNames.has((s.name || '').toLowerCase().trim())
          );
          localStorage.setItem('hr_portal_shortlist', JSON.stringify(cleaned));
          return cleaned;
        });
      }
    }
  }, [candidates, shortlist]);

  useEffect(() => {
    try {
      localStorage.setItem('hr_portal_app_mode', appMode);
    } catch (e) {}
  }, [appMode]);

  useEffect(() => {
    try {
      localStorage.setItem('hr_portal_talent_tab', talentTab);
    } catch (e) {}
  }, [talentTab]);

  useEffect(() => {
    if (user) localStorage.setItem('hr_portal_user', JSON.stringify(user));
    else localStorage.removeItem('hr_portal_user');
  }, [user]);

  useEffect(() => {
    if (activeDomain) {
      localStorage.setItem('hr_portal_active_domain', JSON.stringify(activeDomain));
    } else {
      localStorage.removeItem('hr_portal_active_domain');
    }
  }, [activeDomain]);

  useEffect(() => {
    localStorage.setItem('hr_portal_search', search);
  }, [search]);

  useEffect(() => {
    localStorage.setItem('hr_portal_experience', experience);
  }, [experience]);

  useEffect(() => {
    localStorage.setItem('hr_portal_location', location);
  }, [location]);

  useEffect(() => {
    localStorage.setItem('hr_portal_sort', sort);
  }, [sort]);

  // Sync Search History to per-user localStorage
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`hr_portal_history_${user.email}`, JSON.stringify(searchHistory));
    }
  }, [searchHistory, user]);

  // Initial Data Fetch
  const fetchInitialData = async () => {
    try {
      const [catRes, statsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/stats')
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData || {});
      }
    } catch (err) {
      console.error('Error fetching initial stats/categories:', err);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All Domains') {
        params.append('category', selectedCategory);
      }
      if (search) params.append('search', search);
      if (experience && experience !== 'all') params.append('experience', experience);
      if (location && location !== 'all') params.append('location', location);
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/candidates?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const candList = data.candidates || [];
        setCandidates(candList);

        // Compute relevant recommendations for active user
        if (user && user.email) {
          computeRelevantCandidates(candList);
        }
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Boss Explored Resumes and Scheduled Interviews
  const fetchBossActivity = async (targetUser) => {
    const u = targetUser || user;
    if (!u || u.role !== 'hr' || !u.email) return;

    try {
      const [viewedRes, schedRes] = await Promise.all([
        fetch(`/api/boss/viewed?email=${encodeURIComponent(u.email)}`),
        fetch(`/api/boss/interviews?email=${encodeURIComponent(u.email)}&companyName=${encodeURIComponent(u.companyName || '')}`)
      ]);

      if (viewedRes.ok) {
        const data = await viewedRes.json();
        if (data && Array.isArray(data.candidates)) {
          setViewedCandidates(data.candidates);
        }
      }

      if (schedRes.ok) {
        const schedData = await schedRes.json();
        if (schedData && Array.isArray(schedData.candidates)) {
          setBossScheduledCandidates(schedData.candidates);
        }
      }
    } catch (err) {
      console.error('Failed to fetch boss activity:', err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'hr') {
      fetchBossActivity(user);
    }
  }, [user]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [selectedCategory, search, experience, location, sort]);

  // Compute recommendations based on past searches
  const computeRelevantCandidates = (allCandidates) => {
    if (!searchHistory.length) {
      setRelevantCandidates([]);
      return;
    }

    const pastQueries = searchHistory.map((h) => (h.query || '').toLowerCase()).filter(Boolean);
    const pastDomains = searchHistory.map((h) => (h.domainName || '').toLowerCase()).filter(Boolean);

    const scored = allCandidates.map((c) => {
      let score = 0;
      const skillsStr = (c.skills || []).join(' ').toLowerCase();
      const cat = (c.category || '').toLowerCase();
      const role = (c.roleTitle || '').toLowerCase();

      pastDomains.forEach((d) => {
        if (cat.includes(d) || d.includes(cat)) score += 3;
      });

      pastQueries.forEach((q) => {
        if (skillsStr.includes(q)) score += 2;
        if (role.includes(q)) score += 2;
      });

      return { candidate: c, relevanceScore: score };
    });

    const relevant = scored
      .filter((s) => s.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map((s) => s.candidate);

    setRelevantCandidates(relevant);
  };

  // Record a search event in the recruiter's history
  const recordSearch = (domainName, domainId, queryText, appliedFilters, resultCount) => {
    if (!user || user.role !== 'hr') return;

    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      domainName: domainName || 'All Domains',
      domainId: domainId || null,
      query: queryText || '',
      filters: appliedFilters || {},
      resultCount: resultCount || 0
    };

    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (h) =>
          !(
            (h.domainName || '').toLowerCase() === (newEntry.domainName || '').toLowerCase() &&
            (h.query || '').toLowerCase() === (newEntry.query || '').toLowerCase()
          )
      );
      return [newEntry, ...filtered].slice(0, 10);
    });

    // Sync to backend HR session
    if (user.email) {
      fetch('/api/hr-session/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, historyEntry: newEntry })
      }).catch((e) => console.error('Failed to sync search history:', e));
    }
  };

  // Restore past search
  const handleRestoreSearch = (entry) => {
    if (entry.domainName && entry.domainName !== 'All Domains') {
      const match = DOMAINS_LIST.find(
        (d) => d.name.toLowerCase() === entry.domainName.toLowerCase()
      );
      if (match) setActiveDomain(match);
      else setSelectedCategory(entry.domainName);
    } else {
      setActiveDomain(null);
      setSelectedCategory('All Domains');
    }

    setSearch(entry.query || '');
    if (entry.filters) {
      if (entry.filters.experience) setExperience(entry.filters.experience);
      if (entry.filters.location) setLocation(entry.filters.location);
      if (entry.filters.sort) setSort(entry.filters.sort);
    }
    setHistoryTab('all');
    scrollToResumes();
  };

  const handleDeleteHistoryItem = (id) => {
    setSearchHistory((prev) => prev.filter((h) => h.id !== id));
    if (user && user.email) {
      fetch('/api/hr-session/history/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, historyId: id })
      }).catch((e) => console.error('Failed to delete history item:', e));
    }
  };

  const handleClearAllHistory = () => {
    setSearchHistory([]);
    if (user && user.email) {
      fetch('/api/hr-session/history/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      }).catch((e) => console.error('Failed to clear history:', e));
    }
  };

  // Track candidate view in history
  const handleRecordCandidateView = (cand) => {
    if (!cand) return;
    const enriched = {
      ...cand,
      id: cand.id,
      candidateId: cand.id,
      viewedAt: new Date().toISOString()
    };
    setViewedCandidates((prev) => {
      const targetId = cand.id != null ? String(cand.id) : null;
      const targetName = (cand.name || '').toLowerCase().trim();
      const filtered = prev.filter((c) => {
        const cId = c.id != null ? String(c.id) : (c.candidateId != null ? String(c.candidateId) : null);
        const cName = (c.name || '').toLowerCase().trim();
        const sameId = targetId && cId && targetId === cId;
        const sameName = targetName && cName && targetName === cName;
        return !(sameId || sameName);
      });
      const updated = [enriched, ...filtered].slice(0, 100);
      try {
        localStorage.setItem('hr_portal_boss_explored_resumes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (user && user.email) {
      fetch('/api/hr-session/viewed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, candidate: cand })
      }).catch((e) => console.error('Failed to sync viewed candidate:', e));
    }
  };

  // Shortlist Handlers
  const handleToggleShortlist = (cand) => {
    if (!cand) return;
    if (!user) {
      handlePromptLogin(cand?.category);
      return;
    }
    setShortlist((prev) => {
      const exists = prev.some(
        (c) => c.id === cand.id || (c.name && cand.name && c.name.toLowerCase().trim() === cand.name.toLowerCase().trim())
      );
      let updated;
      if (exists) {
        updated = prev.filter(
          (c) => c.id !== cand.id && (!c.name || !cand.name || c.name.toLowerCase().trim() !== cand.name.toLowerCase().trim())
        );
      } else {
        updated = [...prev, cand];
      }
      localStorage.setItem('hr_portal_shortlist', JSON.stringify(updated));

      if (user && user.email) {
        fetch('/api/hr-session/shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, shortlist: updated })
        }).catch((e) => console.error('Failed to sync shortlist:', e));
      }
      return updated;
    });
  };

  const handleRemoveFromShortlist = (candId) => {
    setShortlist((prev) => {
      const updated = prev.filter((c) => c.id !== candId);
      localStorage.setItem('hr_portal_shortlist', JSON.stringify(updated));
      if (user && user.email) {
        fetch('/api/hr-session/shortlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, shortlist: updated })
        }).catch((e) => console.error('Failed to sync shortlist:', e));
      }
      return updated;
    });
  };

  const handleClearShortlist = () => {
    setShortlist([]);
    localStorage.removeItem('hr_portal_shortlist');
    if (user && user.email) {
      fetch('/api/hr-session/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, shortlist: [] })
      }).catch((e) => console.error('Failed to clear shortlist:', e));
    }
  };

  // Login Prompt helper when unauthenticated HR attempts protected actions
  const handlePromptLogin = (domainName) => {
    setPromptDomain(domainName || selectedCategory || 'All Domains');
    setHrModalOpen(true);
  };

  // Download Handlers
  const handleDownloadResume = (cand) => {
    if (!cand) return;
    if (!user) {
      handlePromptLogin(cand?.category);
      return;
    }
    handleRecordCandidateView(cand);
    const filename = cand.filename || cand.originalFilename || '';
    const safeName = (cand.name || 'Candidate').replace(/\s+/g, '_');
    const downloadUrl = `/api/candidates/${encodeURIComponent(cand.id || safeName)}/download?filename=${encodeURIComponent(filename)}&name=${encodeURIComponent(cand.name || 'Candidate')}&category=${encodeURIComponent(cand.category || '')}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename || `${safeName}_Resume.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBulk = () => {
    if (!user) {
      handlePromptLogin(selectedCategory);
      return;
    }
    if (!liveShortlist.length) return;
    const ids = liveShortlist.map((c) => c.id).join(',');
    window.open(`/api/candidates/bulk/download?ids=${ids}`, '_blank');
  };

  // Open Preview with tracking
  const handleOpenResumePreview = (cand) => {
    if (cand) {
      handleRecordCandidateView(cand);
    }
    if (!user) {
      handlePromptLogin(cand?.category);
      return;
    }
    setPreviewCandidate(cand);
  };

  const handleOpenCandidateDetail = (cand) => {
    if (cand) {
      handleRecordCandidateView(cand);
    }
    if (!user) {
      handlePromptLogin(cand?.category);
      return;
    }
    setDetailCandidate(cand);
  };

  const handleOpenScheduleForCandidate = (cand) => {
    if (!user) {
      handlePromptLogin(cand?.category);
      return;
    }
    // Add to shortlist if not already
    setShortlist((prev) => {
      const exists = prev.some((c) => c.id === cand.id);
      if (!exists) {
        const updated = [...prev, cand];
        localStorage.setItem('hr_portal_shortlist', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
    setScheduleTargetCandidate(cand);
    setScheduleModalOpen(true);
  };

  // Delete candidate (Admin only)
  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      const res = await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCandidates();
        fetchInitialData();
      }
    } catch (e) {
      console.error('Failed to delete candidate:', e);
    }
  };

  // Handle candidate profile created in Candidate Mode
  const handleCandidateCreated = (newCand) => {
    if (!newCand) return;
    setCandidates((prev) => [newCand, ...prev.filter((c) => c.id !== newCand.id)]);
    fetchInitialData();
  };

  // Handle return to Home from Candidate Mode to view their specific domain
  const handleGoHomeWithCategory = (cat) => {
    if (cat) {
      setSelectedCategory(cat);
      setActiveDomain(null);
    }
    setAppMode('home');
    setBossViewTab('domain');
    scrollToResumes();
  };

  // Handle successful HR Login/Registration
  const handleHRLoginSuccess = (loggedInUser, domainOrSession, sessionData) => {
    setUser(loggedInUser);
    setHrModalOpen(false);

    const session = sessionData || (typeof domainOrSession === 'object' ? domainOrSession : null);

    if (session) {
      if (session.searchHistory) setSearchHistory(session.searchHistory);
      if (session.viewedCandidates) setViewedCandidates(session.viewedCandidates);
      if (session.shortlist && session.shortlist.length > 0) {
        setShortlist(session.shortlist);
        localStorage.setItem('hr_portal_shortlist', JSON.stringify(session.shortlist));
      }
    }

    fetchBossActivity(loggedInUser);

    const targetDom = typeof domainOrSession === 'string' ? domainOrSession : promptDomain;
    if (targetDom && targetDom !== 'All Domains') {
      setSelectedCategory(targetDom);
    }
    setPromptDomain(null);
    setBossViewTab('domain');
    setAppMode('boss');
    try {
      localStorage.setItem('hr_portal_app_mode', 'boss');
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearch('');
    setExperience('all');
    setLocation('all');
    setSort('name_asc');
    setSelectedCategory('All Domains');
    setActiveDomain(null);
    setHistoryTab('all');
    localStorage.removeItem('hr_portal_active_domain');
    localStorage.removeItem('hr_portal_search');
    localStorage.removeItem('hr_portal_experience');
    localStorage.removeItem('hr_portal_location');
    localStorage.removeItem('hr_portal_sort');
  };

  const navigateToHomeSection = (sectionId, viewTab = null, category = null) => {
    if (viewTab) setBossViewTab(viewTab);
    if (category) setSelectedCategory(category);

    if (appMode !== 'home') {
      setAppMode('home');
    }

    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    let attempts = 0;
    const maxAttempts = 24; // 24 * 50ms = 1.2s polling to guarantee DOM ready
    const interval = setInterval(() => {
      attempts++;
      let el = document.getElementById(sectionId);
      if (!el && (sectionId === 'boss-console' || sectionId === 'resumes')) {
        el = document.getElementById('boss-console') || document.getElementById('network');
      }
      if (el) {
        clearInterval(interval);
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    }, 50);
  };

  const scrollToResumes = () => navigateToHomeSection('boss-console', 'domain');
  const scrollToMembers = () => navigateToHomeSection('network');
  const scrollToDomains = () => navigateToHomeSection('network');

  const handleLogout = () => {
    setUser(null);
    setActiveDomain(null);
    setSearchHistory([]);
    setViewedCandidates([]);
    setRelevantCandidates([]);
    setShortlist([]);
    setBossScheduledCandidates([]);
    setBossViewTab('domain');
    setAppMode('home');
    try {
      localStorage.removeItem('hr_portal_user');
      localStorage.removeItem('hr_portal_shortlist');
      localStorage.removeItem('hr_portal_active_domain');
      localStorage.setItem('hr_portal_app_mode', 'home');
      localStorage.removeItem('hr_portal_search');
      localStorage.removeItem('hr_portal_experience');
      localStorage.removeItem('hr_portal_location');
      localStorage.removeItem('hr_portal_sort');
    } catch (e) {
      console.error('Failed to clear storage on logout:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute final candidate pool for display
  let candidatePool = [...candidates];
  if (historyTab === 'viewed') {
    candidatePool = viewedCandidates;
  } else if (historyTab === 'relevant') {
    candidatePool = relevantCandidates.length > 0 ? relevantCandidates : candidates;
  } else if (selectedCategory && selectedCategory !== 'All Domains') {
    // If DomainCards selected a specific domain
    if (selectedCategory === 'Frontend Developer') {
      candidatePool = candidatePool.filter((c) => {
        const cat = (c.category || '').toLowerCase();
        return cat.includes('frontend') || cat.includes('react');
      });
    } else {
      candidatePool = candidatePool.filter((c) => {
        return (c.category || '').toLowerCase() === selectedCategory.toLowerCase();
      });
    }
  } else if (activeDomain && activeDomain.categoryMap && activeDomain.categoryMap.length > 0) {
    candidatePool = candidatePool.filter((c) =>
      activeDomain.categoryMap.some((m) => m.toLowerCase() === c.category.toLowerCase())
    );
  }

  const displayedCandidates = candidatePool.slice(0, visibleCount);
  const totalDomainCandidates = activeDomain && activeDomain.categoryMap
    ? candidates.filter((c) =>
        activeDomain.categoryMap.some((m) => m.toLowerCase() === c.category.toLowerCase())
      ).length
    : candidates.length;

  const hasActiveFilters = search || experience !== 'all' || location !== 'all' || selectedCategory !== 'All Domains' || activeDomain !== null || historyTab !== 'all';
  const showResumes = Boolean(user && user.role === 'hr');

  // Debounced search recording when keywords or filters change
  useEffect(() => {
    if (!user || user.role !== 'hr' || !user.email) return;
    if (!activeDomain && !search) return;

    const timer = setTimeout(() => {
      recordSearch(
        activeDomain?.name || 'All Domains',
        activeDomain?.id || null,
        search,
        { experience, location, sort },
        displayedCandidates.length
      );
    }, 850);

    return () => clearTimeout(timer);
  }, [search, experience, location, sort, activeDomain?.name]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--tal-light-bg)' }}>
      {/* Top Navbar with Mode Switcher (Hidden when viewing dedicated Boss Workspace matching the attached HTML template) */}
      {!(user && (user.role === 'hr' || user.role === 'admin')) && (
        <Navbar
          user={user}
          onOpenAuth={(role) => {
            setPromptDomain(null);
            setAuthModal(role);
          }}
          onLogout={handleLogout}
          onOpenUpload={() => setUploadModalOpen(true)}
          onOpenAdmin={() => setAdminModalOpen(true)}
          shortlistCount={user && user.role === 'hr' ? liveShortlist.length : 0}
          onOpenShortlist={() => {
            if (user && user.role === 'hr') {
              setAppMode('boss');
              setBossViewTab('shortlist');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              setShortlistDrawerOpen(true);
            }
          }}
          onScrollToCandidates={scrollToResumes}
          onNavigate={(target) => navigateToHomeSection(target)}
          onOpenHRLogin={() => handlePromptLogin(selectedCategory || 'All Domains')}
          appMode={appMode}
          onToggleMode={(mode) => {
            setAppMode(mode);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          talentTab={talentTab}
          onSelectTalentTab={(tab) => {
            setAppMode('talent');
            setTalentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          viewedCount={viewedCandidates.length}
          scheduledCount={bossScheduledCandidates.length}
          onOpenViewed={() => {
            setAppMode('boss');
            setBossViewTab('explored');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenScheduled={() => {
            setAppMode('boss');
            setBossViewTab('scheduled');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenBossDashboard={() => {
            setAppMode('boss');
            setBossViewTab('domain');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* If Admin is logged in, they ONLY view the dedicated Resume Upload Desk */}
      {user?.role === 'admin' ? (
        <main className="container" style={{ flex: 1, paddingTop: '30px', paddingBottom: '60px' }}>
          <AdminUploadView
            user={user}
            candidates={candidates}
            categories={categories}
            onOpenUpload={() => setUploadModalOpen(true)}
            onOpenAdmin={() => setAdminModalOpen(true)}
            onViewResume={(c) => setPreviewCandidate(c)}
            onDownloadResume={handleDownloadResume}
            onDeleteCandidate={handleDeleteCandidate}
            onRefreshData={() => {
              fetchInitialData();
              fetchCandidates();
            }}
            onLogout={handleLogout}
          />
        </main>
      ) : (user && user.role === 'hr') ? (
        /* DEDICATED BOSS WORKSPACE PAGE (NEVER SHOWS HOMEPAGE/HERO TO AUTHENTICATED HR) */
        <BossWorkspaceView
          user={user}
          candidates={candidates}
          categories={categories}
          shortlist={liveShortlist}
          onToggleShortlist={handleToggleShortlist}
          bossScheduledCandidates={bossScheduledCandidates}
          viewedCandidates={viewedCandidates}
          onClearExploredHistory={() => setViewedCandidates([])}
          activeTab={bossViewTab}
          onSelectTab={(tab) => setBossViewTab(tab)}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onViewResume={handleOpenResumePreview}
          onDownloadResume={handleDownloadResume}
          onScheduleInterview={(cand, scheduleDetails) => {
            if (!cand) return;
            const targetId = cand.id != null ? String(cand.id) : null;
            const targetName = (cand.name || '').toLowerCase().trim();

            setBossScheduledCandidates((prev) => {
              const exists = prev.some((c) => (targetId && c.id != null && String(c.id) === targetId) || (targetName && c.name && c.name.toLowerCase().trim() === targetName));
              let updated;
              if (exists) {
                updated = prev.map((c) =>
                  ((targetId && c.id != null && String(c.id) === targetId) || (targetName && c.name && c.name.toLowerCase().trim() === targetName))
                    ? { ...c, ...cand, scheduleDetails, interviewScheduled: true, status: 'Interview Scheduled' }
                    : c
                );
              } else {
                updated = [...prev, { ...cand, scheduleDetails, interviewScheduled: true, status: 'Interview Scheduled' }];
              }
              try {
                localStorage.setItem('hr_portal_boss_scheduled_candidates', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });

            // Update candidate in candidates state if present
            setCandidates((prev) =>
              prev.map((c) => {
                if ((targetId && c.id != null && String(c.id) === targetId) || (targetName && c.name && c.name.toLowerCase().trim() === targetName)) {
                  return { ...c, scheduleDetails, interviewScheduled: true, status: 'Interview Scheduled' };
                }
                return c;
              })
            );

            // Also ensure candidate is marked in shortlist state
            setShortlist((prev) =>
              prev.map((s) => {
                if ((targetId && s.id != null && String(s.id) === targetId) || (targetName && s.name && s.name.toLowerCase().trim() === targetName)) {
                  return { ...s, scheduleDetails, interviewScheduled: true, status: 'Interview Scheduled' };
                }
                return s;
              })
            );

            if (cand.id) {
              fetch(`/api/candidates/${cand.id}/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Interview Scheduled', interviewScheduled: true, scheduleDetails })
              }).catch(() => {});
            }
          }}
          onCancelInterview={(cand) => {
            if (!cand) return;
            const targetId = cand.id != null ? String(cand.id) : null;
            const targetName = (cand.name || '').toLowerCase().trim();

            // 1. Remove from bossScheduledCandidates
            setBossScheduledCandidates((prev) => {
              const updated = prev.filter((c) => {
                const sameId = targetId && c.id != null && String(c.id) === targetId;
                const sameName = targetName && c.name && c.name.toLowerCase().trim() === targetName;
                return !(sameId || sameName);
              });
              try {
                localStorage.setItem('hr_portal_boss_scheduled_candidates', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });

            // 2. Reset candidates state
            setCandidates((prev) =>
              prev.map((c) => {
                const sameId = targetId && c.id != null && String(c.id) === targetId;
                const sameName = targetName && c.name && c.name.toLowerCase().trim() === targetName;
                if (sameId || sameName) {
                  const copy = { ...c, interviewScheduled: false, status: 'Available' };
                  delete copy.scheduleDetails;
                  return copy;
                }
                return c;
              })
            );

            // 3. Keep candidate in shortlist so boss sees them in shortlist tab for rescheduling
            setShortlist((prev) => {
              const exists = prev.some((s) => (targetId && s.id != null && String(s.id) === targetId) || (targetName && s.name && s.name.toLowerCase().trim() === targetName));
              let updated;
              if (!exists) {
                const cleanCand = { ...cand, interviewScheduled: false, status: 'Available' };
                delete cleanCand.scheduleDetails;
                updated = [...prev, cleanCand];
              } else {
                updated = prev.map((s) => {
                  const sameId = targetId && s.id != null && String(s.id) === targetId;
                  const sameName = targetName && s.name && s.name.toLowerCase().trim() === targetName;
                  if (sameId || sameName) {
                    const copy = { ...s, interviewScheduled: false, status: 'Available' };
                    delete copy.scheduleDetails;
                    return copy;
                  }
                  return s;
                });
              }
              try {
                localStorage.setItem('hr_portal_shortlist', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });

            if (cand.id) {
              fetch(`/api/candidates/${cand.id}/schedule`, {
                method: 'DELETE'
              }).catch(() => {});
            }
          }}
          onClearShortlist={handleClearShortlist}
          onGoHome={() => {
            setBossViewTab('domain');
            setSelectedCategory('All Domains');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLogout={handleLogout}
          search={search}
          onSearchChange={setSearch}
          experience={experience}
          onExperienceChange={setExperience}
          location={location}
          onLocationChange={setLocation}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      ) : appMode === 'boss' ? (
        /* BOSS DIRECT HIRING DESK WIZARD (CANDIDATE SEARCH & MATCHING FLOW) */
        <PortalModeView
          mode="boss"
          onGoHome={() => navigateToHomeSection('top')}
          onGoHomeWithCategory={(cat) => navigateToHomeSection('boss-console', 'domain', cat)}
          onSwitchMode={(m) => setAppMode(m)}
          candidates={candidates}
          onCandidateCreated={handleCandidateCreated}
          user={user}
          shortlist={liveShortlist}
          onToggleShortlist={handleToggleShortlist}
          onPromptLogin={(cat) => handlePromptLogin(cat)}
        />
      ) : appMode === 'talent' ? (
        /* CANDIDATE / TALENT MODE VIEW: Uses the attached file with Talent Onboarding, Matched Jobs & Direct Chat */
        <PortalModeView
          mode="talent"
          onGoHome={(cat) => {
            if (cat) {
              setSelectedCategory(cat);
              setActiveDomain(null);
              navigateToHomeSection('network', 'domain', cat);
            } else {
              navigateToHomeSection('top');
            }
          }}
          onGoHomeWithCategory={(cat) => {
            setSelectedCategory(cat);
            setActiveDomain(null);
            navigateToHomeSection('network', 'domain', cat);
          }}
          onSwitchMode={(m) => setAppMode(m)}
          candidates={candidates}
          onCandidateCreated={handleCandidateCreated}
          user={user}
        />
      ) : (
        /* PRESERVED HOMEPAGE: Navbar, Hero, Browse Network (Domain Cards), Why Hire Us, Placement Desk, Footer */
        <>
          {/* 1. HERO SECTION (Renaissance hands, Mode pill, Title, Facts strip) */}
          <HeroSection
            stats={stats}
            appMode={appMode}
            onToggleMode={(mode) => setAppMode(mode)}
          />

          {/* 2. BROWSE THE GLOBAL MINDS NETWORK */}
          <section id="network" className="tal-network-section">
            <div className="container">
              <div className="tal-network-header">
                <div className="tal-network-title-row">
                  <h2 className="tal-serif-title">Browse the</h2>
                  <div className="tal-inline-boss-badge" style={{ padding: '2px', background: '#FFFFFF', borderRadius: '8px' }}>
                    <img src="/logo.jpg" alt="Global Minds" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
                  </div>
                  <h2 className="tal-serif-title">network</h2>
                </div>
                <p className="tal-section-lead">
                  Meet engineers, developers, product specialists, and pre-screened talent from Global Minds.
                </p>

                {/* Domain Category Cards matching the sleek card layout */}
                <DomainCards
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    if (!user || user.role !== 'hr') {
                      handlePromptLogin(cat);
                    } else {
                      setSelectedCategory(cat.name || cat);
                      setActiveDomain(null);
                      setBossViewTab('domain');
                      setAppMode('boss');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  totalCount={candidates.length}
                  isBossAuthenticated={Boolean(user && user.role === 'hr')}
                />
              </div>

            </div>
          </section>

          {/* 3. WHY COMPANIES HIRE FROM GLOBAL MINDS */}
          <WhyHireUs onScrollToCandidates={scrollToDomains} />

          {/* 4. CORPORATE PLACEMENT DESK */}
          <ContactPlacementSection />
        </>
      )}

      {/* Floating Shortlist Cart Bar (ONLY shown for logged-in Company HR recruiter when NOT on Boss workspace) */}
      {user && user.role === 'hr' && liveShortlist.length > 0 && appMode !== 'boss' && (
        <div
          className="shortlist-bar"
          onClick={() => {
            setAppMode('boss');
            setBossViewTab('shortlist');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Open Dedicated Shortlist Workspace"
        >
          <div className="shortlist-count-badge">
            {liveShortlist.length}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>
              Shortlisted Candidates ({liveShortlist.length})
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              Click to Open Dedicated Boss Shortlist Workspace
            </div>
          </div>
          <ArrowUpRight size={16} />
        </div>
      )}

      {/* Resume PDF Viewer Modal */}
      {previewCandidate && (
        <ResumeViewerModal
          candidate={previewCandidate}
          isShortlisted={Boolean(
            user && user.role === 'hr' &&
            liveShortlist.some((c) => c.id === previewCandidate.id || (c.name && previewCandidate.name && c.name.toLowerCase().trim() === previewCandidate.name.toLowerCase().trim()))
          )}
          onToggleShortlist={handleToggleShortlist}
          onDownloadResume={handleDownloadResume}
          onClose={() => setPreviewCandidate(null)}
        />
      )}

      {/* Candidate Dossier Detail Modal */}
      {detailCandidate && (
        <CandidateDetailModal
          candidate={detailCandidate}
          isShortlisted={Boolean(
            user && user.role === 'hr' &&
            liveShortlist.some((c) => c.id === detailCandidate.id || (c.name && detailCandidate.name && c.name.toLowerCase().trim() === detailCandidate.name.toLowerCase().trim()))
          )}
          onToggleShortlist={(cand) => {
            if (!user) handlePromptLogin(cand.category);
            else handleToggleShortlist(cand);
          }}
          onViewResume={(c) => {
            if (!user) handlePromptLogin(c.category);
            else {
              setDetailCandidate(null);
              setPreviewCandidate(c);
            }
          }}
          onDownloadResume={(c) => {
            if (!user) handlePromptLogin(c.category);
            else handleDownloadResume(c);
          }}
          onScheduleInterview={handleOpenScheduleForCandidate}
          onClose={() => setDetailCandidate(null)}
        />
      )}

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={shortlistDrawerOpen}
        onClose={() => setShortlistDrawerOpen(false)}
        shortlistedCandidates={liveShortlist}
        onRemoveFromShortlist={handleRemoveFromShortlist}
        onClearShortlist={handleClearShortlist}
        onDownloadBulk={handleDownloadBulk}
        onProceedToSchedule={() => {
          setShortlistDrawerOpen(false);
          setScheduleModalOpen(true);
        }}
        onViewResume={handleOpenResumePreview}
        onOpenFullShortlistPage={() => {
          setShortlistDrawerOpen(false);
          setAppMode('boss');
          setBossViewTab('shortlist');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Schedule Interview Modal */}
      {scheduleModalOpen && (
        <ScheduleInterviewModal
          user={user}
          shortlistedCandidates={liveShortlist}
          targetCandidate={scheduleTargetCandidate}
          onClose={() => {
            setScheduleModalOpen(false);
            setScheduleTargetCandidate(null);
          }}
          onSuccess={(scheduledIds) => {
            setShortlist((prev) => {
              if (!scheduledIds || !scheduledIds.length) return [];
              const updated = prev.filter((c) => !scheduledIds.includes(c.id));
              localStorage.setItem('hr_portal_shortlist', JSON.stringify(updated));
              return updated;
            });
            setScheduleTargetCandidate(null);
            fetchInitialData();
            fetchCandidates();
          }}
        />
      )}

      {/* Upload Resume Modal */}
      {uploadModalOpen && (
        <UploadResumeModal
          categories={categories}
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={() => {
            fetchInitialData();
            fetchCandidates();
          }}
          onTriggerDesktopSync={() => {
            fetchInitialData();
            fetchCandidates();
          }}
        />
      )}

      {/* Student Upload Modal */}
      {studentModalOpen && (
        <StudentUploadModal
          categories={categories}
          onClose={() => setStudentModalOpen(false)}
          onSuccess={() => {
            fetchInitialData();
            fetchCandidates();
          }}
        />
      )}

      {/* Admin Dashboard Modal */}
      {adminModalOpen && (
        <AdminDashboardModal
          candidates={candidates}
          categories={categories}
          onClose={() => setAdminModalOpen(false)}
          onOpenUpload={() => {
            setAdminModalOpen(false);
            setUploadModalOpen(true);
          }}
          onDeleteCandidate={async (id) => {
            if (!window.confirm('Delete candidate?')) return;
            await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
            fetchCandidates();
            fetchInitialData();
          }}
          onViewResume={(c) => setPreviewCandidate(c)}
          onDownloadResume={handleDownloadResume}
          onRefreshData={() => {
            fetchInitialData();
            fetchCandidates();
          }}
        />
      )}

      {/* Auth Modal (Admin Sign In) */}
      {authModal && (
        <AuthModal
          onClose={() => {
            setAuthModal(null);
            setPromptDomain(null);
          }}
          onLoginSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            setAuthModal(null);
            setPromptDomain(null);
            setShortlist([]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* HR Auth Modal (Recruiter Company Access) */}
      <HRAuthModal
        isOpen={hrModalOpen}
        promptDomain={promptDomain}
        onClose={() => {
          setHrModalOpen(false);
          setPromptDomain(null);
        }}
        onLoginSuccess={handleHRLoginSuccess}
      />

      {/* Global Minds Professional Footer (Hidden on dedicated Boss Workspace matching attached HTML) */}
      {!(user && (user.role === 'hr' || user.role === 'admin')) && (
        <Footer 
          onToggleMode={(mode) => setAppMode(mode)} 
        />
      )}
    </div>
  );
}
