import React from 'react';
import { Zap, ShieldCheck, Users, Clock, Award, ArrowUpRight } from 'lucide-react';

export default function WhyHireUs({ onScrollToCandidates }) {
  const pillars = [
    {
      number: '01',
      title: 'Bosses Hire Directly',
      desc: 'No recruiter middleman or automated ATS rejections. Connect directly with hiring managers, CTOs, and founders on Global Minds.'
    },
    {
      number: '02',
      title: '500+ Hours Real Hands-on Code',
      desc: 'Every candidate undergoes rigorous full-stack development, real production deployments, live mock interviews, and code reviews.'
    },
    {
      number: '03',
      title: '₹0 Recruitment Fees & Markups',
      desc: 'Zero placement commission, zero agency fees. Direct sourcing desk supported by Global Minds Technologies.'
    },
    {
      number: '04',
      title: '48-Hour Interview Scheduling',
      desc: 'Instant profile access, one-click profile verification, and immediate interview slots confirmed directly with our placement desk.'
    }
  ];

  return (
    <section className="tal-why-section" id="why">
      <div className="container">
        <div className="tal-why-header">
          <span className="tal-section-badge">GLOBAL MINDS ADVANTAGE</span>
          <h2 className="tal-serif-title">Why companies hire from Global Minds</h2>
          <p className="tal-section-lead">
            Startup founders, product leaders, and engineering bosses meet engineers directly without recruiter chains or job-board applications.
          </p>
        </div>

        <div className="tal-why-grid">
          {pillars.map((item, idx) => (
            <div key={idx} className="tal-why-card">
              <div className="tal-why-num">{item.number}</div>
              <h3 className="tal-why-card-title">{item.title}</h3>
              <p className="tal-why-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
