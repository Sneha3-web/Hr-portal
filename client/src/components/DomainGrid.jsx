import React from 'react';
import { Code2, Palette, Cpu, Cloud, CheckSquare, BarChart3, Bot } from 'lucide-react';

export const DOMAINS_LIST = [
  {
    id: 'software-developer',
    name: 'Software Developer',
    categoryMap: ['Software Developer', 'Full Stack Developer', 'Java Developer', 'Python Developer'],
    icon: Code2,
    iconColor: '#0f5c4d',
    iconBg: '#e6f1ec',
    accentColor: '#0f5c4d',
    desc: 'Java, Python, Full Stack & Backend Developers'
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    categoryMap: ['Frontend Developer', 'React.js Developer'],
    icon: Palette,
    iconColor: '#d1507a',
    iconBg: '#fdf2f8',
    accentColor: '#d1507a',
    desc: 'React.js, Modern UI/UX & Responsive Web'
  },
  {
    id: 'devops',
    name: 'DevOps',
    categoryMap: ['Devops'],
    icon: Cpu,
    iconColor: '#7a4fd1',
    iconBg: '#f5f3ff',
    accentColor: '#7a4fd1',
    desc: 'CI/CD, Docker, Kubernetes, Jenkins & Linux'
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    categoryMap: ['Devops'],
    icon: Cloud,
    iconColor: '#2f7fd1',
    iconBg: '#eff6ff',
    accentColor: '#2f7fd1',
    desc: 'AWS Solutions, Cloud Architecture & Terraform'
  },
  {
    id: 'software-test-engineer',
    name: 'Software Test Engineer',
    categoryMap: ['Testing Role'],
    icon: CheckSquare,
    iconColor: '#d18a2f',
    iconBg: '#fef3c7',
    accentColor: '#d18a2f',
    desc: 'Manual Testing, Regression & Bug Tracking'
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    categoryMap: ['Data Analyst'],
    icon: BarChart3,
    iconColor: '#2fa3a3',
    iconBg: '#e6f7f7',
    accentColor: '#2fa3a3',
    desc: 'Power BI, Advanced SQL, Tableau & Excel'
  },
  {
    id: 'ai-ml',
    name: 'AI/ML',
    categoryMap: ['Machine Learning'],
    icon: Bot,
    iconColor: '#8a5a3c',
    iconBg: '#f7f0eb',
    accentColor: '#8a5a3c',
    desc: 'Deep Learning, NLP, Computer Vision & PyTorch'
  }
];

export default function DomainGrid({
  user,
  categories,
  onSelectDomain,
  onPromptLogin,
  activeDomain,
  searchedDomainNames = []
}) {
  // Calculate dynamic candidate counts per domain
  const getDomainCount = (domain) => {
    let total = 0;
    domain.categoryMap.forEach((catName) => {
      const found = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
      if (found) total += found.count;
    });
    return total;
  };

  const handleCardClick = (domain) => {
    if (!user) {
      onPromptLogin(domain.name);
    } else {
      onSelectDomain(domain);
    }
  };

  return (
    <section id="domains" style={{ padding: '48px 0 24px' }}>
      <div style={{ textAlign: 'left', marginBottom: '28px' }}>
        <h2 style={{
          fontSize: 'clamp(26px, 3.6vw, 36px)',
          fontWeight: 800,
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
          marginBottom: '8px',
          fontFamily: 'var(--font-heading)'
        }}>
          Find talent by domain
        </h2>
        <p style={{ color: 'var(--mute)', fontSize: '1rem', maxWidth: '620px', margin: 0 }}>
          {user 
            ? 'Select a domain to view verified candidate resumes, preview portfolios, and schedule interviews.' 
            : 'Pick a domain, sign in as company HR and view verified resumes.'}
        </p>
      </div>

      {/* Grid of Domains matching Template - Exactly 3 columns on desktop */}
      <div className="domain-cards-grid">
        {DOMAINS_LIST.map((domain) => {
          const count = getDomainCount(domain);
          const isSelected = activeDomain?.name === domain.name;

          return (
            <div
              key={domain.id}
              onClick={() => handleCardClick(domain)}
              style={{
                background: '#ffffff',
                border: isSelected ? '1.5px solid var(--brand)' : '1px solid #dfe5e0',
                borderLeft: `6px solid ${domain.accentColor}`,
                borderRadius: '16px',
                padding: '24px 26px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                boxShadow: isSelected 
                  ? '0 10px 24px -6px rgba(15, 92, 77, 0.18)' 
                  : '0 2px 6px rgba(0,0,0,0.02)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '148px',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isSelected 
                  ? '0 10px 24px -6px rgba(15, 92, 77, 0.18)' 
                  : '0 2px 6px rgba(0,0,0,0.02)';
              }}
            >
              <div>
                {/* Domain Title */}
                <h3 style={{
                  fontSize: '21px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  margin: '0 0 6px 0',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1.2
                }}>
                  {domain.name}
                </h3>

                {/* Resume Count */}
                <div style={{ color: 'var(--mute)', fontSize: '15px', fontWeight: 500 }}>
                  {count} {count === 1 ? 'resume' : 'resumes'} available
                </div>
              </div>

              {/* Action Text matching Template */}
              <div style={{
                marginTop: '24px',
                color: 'var(--brand)',
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: 1
              }}>
                {!user ? 'Login to view resumes' : isSelected ? 'Viewing resumes' : 'View resumes'}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
