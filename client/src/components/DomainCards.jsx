import React from 'react';
import { 
  Code2, 
  Layers, 
  Cpu, 
  Cloud, 
  BarChart3, 
  Bot, 
  CheckSquare, 
  Layout, 
  Terminal, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

export const DOMAIN_DEFINITIONS = [
  {
    id: 'all',
    name: 'All Domains',
    label: 'All Talent Network',
    categories: [],
    icon: Sparkles,
    accent: '#101011',
    skills: 'DevOps, Full Stack, Java, Python, AI/ML, QA & Data'
  },
  {
    id: 'full-stack',
    name: 'Full Stack Developer',
    label: 'Full Stack Developer',
    categories: ['Full Stack Developer'],
    icon: Code2,
    accent: '#2563eb',
    skills: 'React.js, Node.js, Express, MongoDB, TypeScript, Git'
  },
  {
    id: 'devops',
    name: 'Devops',
    label: 'DevOps & Cloud',
    categories: ['Devops'],
    icon: Cpu,
    accent: '#7c3aed',
    skills: 'AWS, Docker, Kubernetes, CI/CD, Terraform, Linux'
  },
  {
    id: 'java',
    name: 'Java Developer',
    label: 'Java & Backend',
    categories: ['Java Developer'],
    icon: Terminal,
    accent: '#059669',
    skills: 'Core Java, Spring Boot, Microservices, Hibernate, Kafka'
  },
  {
    id: 'python',
    name: 'Python Developer',
    label: 'Python & AI Engineer',
    categories: ['Python Developer'],
    icon: Code2,
    accent: '#d97706',
    skills: 'Python, Django, FastAPI, Flask, PostgreSQL, AWS'
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    label: 'Data & Analytics',
    categories: ['Data Analyst'],
    icon: BarChart3,
    accent: '#0891b2',
    skills: 'SQL, Power BI, Python, Tableau, Advanced Excel'
  },
  {
    id: 'frontend',
    name: 'Frontend Developer',
    label: 'Frontend & UI/UX',
    categories: ['Frontend Developer', 'React.js Developer'],
    icon: Layout,
    accent: '#db2777',
    skills: 'React.js, Next.js, Redux, JavaScript, HTML5/CSS3'
  },
  {
    id: 'ai-ml',
    name: 'Machine Learning',
    label: 'Machine Learning & AI',
    categories: ['Machine Learning'],
    icon: Bot,
    accent: '#ea580c',
    skills: 'Python, TensorFlow, PyTorch, Deep Learning, NLP'
  },
  {
    id: 'testing',
    name: 'Testing Role',
    label: 'Software Testing & QA',
    categories: ['Testing Role'],
    icon: CheckSquare,
    accent: '#4f46e5',
    skills: 'Manual Testing, Selenium WebDriver, Postman, Jira, API'
  }
];

export default function DomainCards({
  categories = [],
  selectedCategory = 'All Domains',
  onSelectCategory,
  totalCount = 58,
  isBossAuthenticated = false
}) {
  // Compute count for each domain definition from live categories list
  const getCountForDomain = (dom) => {
    if (dom.id === 'all') return totalCount;
    return dom.categories.reduce((acc, catName) => {
      const match = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase());
      return acc + (match ? match.count : 0);
    }, 0);
  };

  return (
    <div className="gm-domains-container">
      <div className="gm-domains-grid">
        {DOMAIN_DEFINITIONS.map((domain) => {
          const count = getCountForDomain(domain);
          const isAll = domain.id === 'all';
          const isSelected = isAll 
            ? selectedCategory === 'All Domains' || !selectedCategory
            : domain.categories.some((cat) => cat.toLowerCase() === selectedCategory?.toLowerCase());

          const IconComp = domain.icon;

          return (
            <div
              key={domain.id}
              className={`gm-domain-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(isAll ? 'All Domains' : domain.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectCategory(isAll ? 'All Domains' : domain.name);
                }
              }}
            >
              <div>
                {/* Top Row: Icon + Badge */}
                <div className="gm-domain-card-header">
                  <div 
                    className="gm-domain-icon-box"
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.18)' : '#f4f4f5',
                      color: isSelected ? '#ffffff' : domain.accent
                    }}
                  >
                    <IconComp size={22} />
                  </div>

                  <span className="gm-domain-count-badge">
                    {count} {count === 1 ? 'Profile' : 'Profiles'}
                  </span>
                </div>

                {/* Domain Title */}
                <h3 className="gm-domain-card-title">
                  {domain.label}
                </h3>

                {/* Core Skills Preview */}
                <p className="gm-domain-card-skills">
                  {domain.skills}
                </p>
              </div>

              {/* Bottom Row: Action Status */}
              <div className="gm-domain-card-footer">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {isSelected && isBossAuthenticated ? (
                    <>
                      <Check size={14} color="#4ade80" />
                      <span>Active Domain</span>
                    </>
                  ) : !isBossAuthenticated ? (
                    <>
                      <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '12px' }}>🔒 Unlock Resumes (Boss Login)</span>
                    </>
                  ) : (
                    <span>Explore {domain.label}</span>
                  )}
                </span>
                <ArrowRight size={14} style={{ opacity: isSelected ? 1 : 0.6 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
