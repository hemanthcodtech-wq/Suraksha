import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  Scale, 
  AlertTriangle, 
  Receipt, 
  ShieldAlert, 
  ArrowLeft,
  Mail,
  BookOpen
} from 'lucide-react';
import './PolicyPages.css';

export const TermsOfService = () => {
  return (
    <div className="policy-page">
      <section className="policy-hero-section">
        <div className="container">
          <div className="policy-hero-content">
            <Link to="/" className="policy-back-link">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <span className="policy-tag-badge">USER AGREEMENT</span>
            <h1 className="policy-title">Terms & Conditions of Service</h1>
            <p className="policy-meta">
              <strong>PROPERTY SURAKSHA</strong> • Last Updated: October 2026 • Governing Law: India
            </p>
          </div>
        </div>
      </section>

      <div className="container policy-body-container">
        <div className="policy-layout-grid">
          <main className="policy-article">
            <section id="t-1" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">01</div>
                <h2>Acceptance of Terms</h2>
              </div>
              <p>
                By visiting, accessing, or placing a verification order on <strong>PROPERTY SURAKSHA</strong>, you acknowledge and agree to be bound by these Terms & Conditions. If you disagree with any provision, you must discontinue platform use.
              </p>
            </section>

            <section id="t-2" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">02</div>
                <h2>Scope of Legal Due Diligence</h2>
              </div>
              <p>
                Property Suraksha provides technology and administrative coordination enabling property verification and advocate legal scrutiny. The analysis is performed strictly within the agreed case scope based on records made accessible by the customer and available in statutory public registries.
              </p>
              <div className="policy-callout-note">
                <AlertTriangle size={20} className="callout-icon" />
                <p>
                  <strong>Non-Guarantee of Title:</strong> Verification findings support informed decisions but do not represent title insurance, an absolute guarantee of ownership, or indemnity against concealed litigation.
                </p>
              </div>
            </section>

            <section id="t-3" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">03</div>
                <h2>Customer Responsibilities</h2>
              </div>
              <p>
                You represent that all documentation submitted is genuine, unaltered, and submitted with legitimate intent. Submitting falsified documents, forged stamps, or misrepresenting survey boundaries is strictly prohibited.
              </p>
            </section>

            <section id="t-4" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">04</div>
                <h2>Jurisdiction & Dispute Resolution</h2>
              </div>
              <p>
                These terms are governed by the laws of India. Any disputes arising out of or related to this platform shall be subject to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana.
              </p>
            </section>

            <section className="policy-contact-card">
              <h3>Legal Grievance Officer</h3>
              <p>For formal legal correspondence:</p>
              <div className="policy-contact-details">
                <div className="contact-detail-row">
                  <Mail size={18} className="detail-icon" />
                  <span>grievance@propertysuraksha.com</span>
                </div>
              </div>
            </section>
          </main>

          <aside className="policy-toc-sidebar">
            <div className="toc-sticky-card">
              <div className="toc-card-header">
                <BookOpen size={18} className="toc-icon" />
                <h4>Terms Navigation</h4>
              </div>
              <ul className="toc-links">
                <li><a href="#t-1">1. Acceptance of Terms</a></li>
                <li><a href="#t-2">2. Scope of Service</a></li>
                <li><a href="#t-3">3. Customer Obligations</a></li>
                <li><a href="#t-4">4. Governing Law</a></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
