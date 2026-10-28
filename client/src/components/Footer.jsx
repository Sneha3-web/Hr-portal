import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export default function Footer({ onToggleMode }) {
  return (
    <footer className="tal-pro-footer">
      {/* Main Multi-Column Footer Content */}
      <div className="container tal-footer-main">
        <div className="tal-footer-grid tal-footer-grid-4col">
          {/* Column 1: Global Minds Brand & Direct Hiring Network with Logo */}
          <div className="tal-footer-col tal-footer-brand-col">
            <div className="tal-brand-group" style={{ marginBottom: '14px', cursor: 'default', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ffffff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3px', border: '1px solid rgba(255, 255, 255, 0.2)', flexShrink: 0 }}>
                <img
                  src="/logo.jpg"
                  alt="Global Minds"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
              <div className="tal-brand-text">
                <span className="tal-brand-name" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
                  global<span style={{ color: '#ffffff' }}>MINDS</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Direct Hiring Network
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '0.88rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              margin: '0 0 16px',
              maxWidth: '320px'
            }}>
              The direct hiring platform where startup bosses, tech founders, and CTOs hire pre-screened engineering talent directly within 48 hours. Zero agency commission, 100% verified proof of work.
            </p>
          </div>

          {/* Column 2: Direct Hiring Modes */}
          <div className="tal-footer-col">
            <h4 className="tal-footer-heading">Direct Hiring Modes</h4>
            <ul className="tal-footer-list">
              <li>
                <button
                  type="button"
                  className="tal-footer-link-btn"
                  onClick={() => {
                    if (onToggleMode) onToggleMode('boss');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>💼 Boss Mode (Hiring)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="tal-footer-link-btn"
                  onClick={() => {
                    if (onToggleMode) onToggleMode('talent');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>⚡ Candidate Mode (Talent)</span>
                </button>
              </li>
              <li>
                <a href="#network" className="tal-footer-link">
                  Browse Engineering Network
                </a>
              </li>
              <li>
                <a href="#why" className="tal-footer-link">
                  Why Global Minds
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Talent Domains */}
          <div className="tal-footer-col">
            <h4 className="tal-footer-heading">Talent Domains</h4>
            <ul className="tal-footer-list">
              <li>
                <a href="#network" className="tal-footer-link">
                  Full Stack Developers (React, Node)
                </a>
              </li>
              <li>
                <a href="#network" className="tal-footer-link">
                  Python &amp; AI / LLM Engineers
                </a>
              </li>
              <li>
                <a href="#network" className="tal-footer-link">
                  Java Backend (Spring Boot, Kafka)
                </a>
              </li>
              <li>
                <a href="#network" className="tal-footer-link">
                  DevOps, Cloud &amp; Kubernetes
                </a>
              </li>
              <li>
                <a href="#network" className="tal-footer-link">
                  Data Analysts &amp; BI Engineers
                </a>
              </li>
              <li>
                <a href="#network" className="tal-footer-link">
                  QA Automation &amp; Testing (Selenium)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Placement Desk & Direct Contact */}
          <div className="tal-footer-col">
            <h4 className="tal-footer-heading">Placement Desk</h4>
            <div className="tal-footer-officer-info">
              <span className="tal-footer-officer-title">Head of Corporate Placements</span>
              <span className="tal-footer-officer-name">Mr. Navaneeth</span>
            </div>
            <ul className="tal-footer-contact-list">
              <li>
                <a 
                  href="mailto:connect@globalminds.com" 
                  className="tal-footer-contact-item"
                  title="Send email to Global Minds Placement Desk"
                >
                  <Mail size={15} color="#60a5fa" />
                  <span>connect@globalminds.com</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919597437333" 
                  className="tal-footer-contact-item"
                  title="Call Placement Head"
                >
                  <Phone size={15} color="#34d399" />
                  <span>+91 95974 37333</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919597437333?text=Hi%20Navaneeth,%20we%20want%20to%20hire%20candidates%20from%20Global%20Minds"
                  target="_blank"
                  rel="noreferrer"
                  className="tal-footer-contact-item tal-footer-wa"
                  title="Instant WhatsApp Desk"
                >
                  <MessageSquare size={15} color="#10b981" />
                  <span>WhatsApp: +91 95974 37333</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="tal-footer-divider" />

        {/* Bottom Bar */}
        <div className="tal-footer-bottom">
          <div className="tal-footer-copy">
            © {new Date().getFullYear()} Global Minds Technologies. All Rights Reserved.
          </div>

          <div className="tal-footer-status">
            <span className="tal-status-indicator" />
            <span>All Direct Hiring Systems Operational</span>
          </div>

          <div className="tal-footer-legal-links">
            <span className="tal-legal-link">Privacy Policy</span>
            <span className="tal-legal-dot">•</span>
            <span className="tal-legal-link">Terms of Service</span>
            <span className="tal-legal-dot">•</span>
            <span className="tal-legal-link">Candidate Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
