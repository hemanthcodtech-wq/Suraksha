import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Receipt, 
  RotateCcw, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  Mail,
  BookOpen
} from 'lucide-react';
import './PolicyPages.css';

export const RefundPolicy = () => {
  return (
    <div className="policy-page">
      <section className="policy-hero-section">
        <div className="container">
          <div className="policy-hero-content">
            <Link to="/" className="policy-back-link">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <span className="policy-tag-badge">TRANSPARENT COMMERCE</span>
            <h1 className="policy-title">Refund & Cancellation Policy</h1>
            <p className="policy-meta">
              <strong>PROPERTY SURAKSHA</strong> • Last Updated: October 2026 • Fair Refund Framework
            </p>
          </div>
        </div>
      </section>

      <div className="container policy-body-container">
        <div className="policy-layout-grid">
          <main className="policy-article">
            <section id="r-1" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">01</div>
                <h2>Cancellation Before Advocate Assignment</h2>
              </div>
              <p>
                If you request case cancellation within <strong>24 hours</strong> of payment and before a designated advocate has commenced examination of the documents, you are eligible for a <strong>100% full refund</strong> (less gateway transaction processing charges).
              </p>
            </section>

            <section id="r-2" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">02</div>
                <h2>Cancellation Post Advocate Assignment</h2>
              </div>
              <p>
                Once an advocate has commenced formal scrutiny, encumbrance verification, or preliminary title searching, administrative and professional costs are incurred. In such scenarios, a prorated partial refund may be issued at platform discretion depending on work completed.
              </p>
            </section>

            <section id="r-3" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">03</div>
                <h2>Disagreement with Legal Findings</h2>
              </div>
              <p>
                Our advocates are legally bound to deliver unbiased, independent findings. If an advocate identifies a title defect, encumbrance, or RERA discrepancy that discourages you from buying a property, the verification service has fulfilled its legal due diligence mandate. Disagreement with the findings does not entitle the user to a refund.
              </p>
            </section>

            <section id="r-4" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">04</div>
                <h2>Refund Processing Timeline</h2>
              </div>
              <p>
                Approved refunds are processed to the original payment source (bank account, UPI, or card) within <strong>5 to 7 business days</strong>.
              </p>
            </section>

            <section className="policy-contact-card">
              <h3>Billing & Refund Desk</h3>
              <p>To submit a cancellation or refund request, quote your Case ID to:</p>
              <div className="policy-contact-details">
                <div className="contact-detail-row">
                  <Mail size={18} className="detail-icon" />
                  <span>billing@propertysuraksha.com</span>
                </div>
              </div>
            </section>
          </main>

          <aside className="policy-toc-sidebar">
            <div className="toc-sticky-card">
              <div className="toc-card-header">
                <BookOpen size={18} className="toc-icon" />
                <h4>Refund Sections</h4>
              </div>
              <ul className="toc-links">
                <li><a href="#r-1">1. Pre-Assignment Cancellation</a></li>
                <li><a href="#r-2">2. Post-Assignment Policy</a></li>
                <li><a href="#r-3">3. Legal Findings Scope</a></li>
                <li><a href="#r-4">4. Processing Timelines</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
