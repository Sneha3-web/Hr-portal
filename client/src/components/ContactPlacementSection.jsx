import React from 'react';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export default function ContactPlacementSection() {
  return (
    <section id="contact" className="tal-contact-section">
      <div className="container">
        <div className="tal-contact-grid tal-contact-grid-single">
          {/* Placement Head Desk Card */}
          <div className="tal-contact-info-card tal-contact-info-card-centered">
            <span className="tal-section-badge">CORPORATE PLACEMENT DESK</span>
            <h2 className="tal-serif-title" style={{ fontSize: '2.4rem', color: '#ffffff' }}>
              Connect directly with our hiring desk
            </h2>
            <p className="tal-contact-desc">
              Looking for custom hiring batches, on-campus drives, or niche domain skills? Our placement team provides immediate candidate dossiers and virtual interview scheduling within 24 hours.
            </p>

            <div className="tal-officer-pill">
              <div className="tal-officer-avatar">N</div>
              <div>
                <div className="tal-officer-name">Mr. Navaneeth</div>
                <div className="tal-officer-title">Head of Corporate Placements • Global Minds</div>
              </div>
            </div>

            <div className="tal-direct-links">
              <a 
                href="https://wa.me/919597437333?text=Hi%20Navaneeth,%20we%20want%20to%20hire%20candidates%20from%20Global%20Minds"
                target="_blank"
                rel="noreferrer"
                className="tal-btn-wa"
              >
                <MessageSquare size={16} />
                <span>Instant WhatsApp Desk (+91 95974 37333)</span>
              </a>

              <a href="tel:+919597437333" className="tal-link-contact">
                <Phone size={15} />
                <span>Call Placement Head: +91 95974 37333</span>
              </a>

              <a href="mailto:connect@globalminds.com" className="tal-link-contact">
                <Mail size={15} />
                <span>Email: connect@globalminds.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
