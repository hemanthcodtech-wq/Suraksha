import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileCheck, 
  Server, 
  UserCheck, 
  AlertCircle, 
  ArrowLeft,
  Mail,
  Phone,
  BookOpen
} from 'lucide-react';
import './PolicyPages.css';

export const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <section className="policy-hero-section">
        <div className="container">
          <div className="policy-hero-content">
            <Link to="/" className="policy-back-link">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <span className="policy-tag-badge">DATA GOVERNANCE</span>
            <h1 className="policy-title">Privacy & Data Protection Policy</h1>
            <p className="policy-meta">
              <strong>PROPERTY SURAKSHA</strong> • Last Updated: October 2026 • DPDP Act (India) Compliant
            </p>
          </div>
        </div>
      </section>

      <div className="container policy-body-container">
        <div className="policy-layout-grid">
          <main className="policy-article">
            <section id="p-1" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">01</div>
                <h2>Information We Collect</h2>
              </div>
              <p>
                To provide verified property due diligence, Property Suraksha collects information you provide directly during intake, including identity details (name, email, phone number) and property-related records (copies of sale deeds, parent title deeds, layout sanctions, encumbrance certificates, and mutation records).
              </p>
            </section>

            <section id="p-2" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">02</div>
                <h2>How We Use Your Documents</h2>
              </div>
              <p>
                Property documentation submitted via our platform is used solely for examining title continuity, revenue classification, municipal sanction validity, and preparing the formal Legal Verification Report.
              </p>
              <div className="policy-callout-note">
                <ShieldCheck size={20} className="callout-icon" />
                <p>
                  <strong>No Commercial Sale:</strong> We never sell, monetize, or license your private property records or personal data to builders, marketing agencies, or financial loan brokers.
                </p>
              </div>
            </section>

            <section id="p-3" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">03</div>
                <h2>256-Bit Cryptographic Storage</h2>
              </div>
              <p>
                All documents uploaded to the Property Suraksha platform are encrypted in transit using Transport Layer Security (TLS 1.3) and encrypted at rest with AES-256 standard encryption on ISO 27001-certified data centers.
              </p>
            </section>

            <section id="p-4" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">04</div>
                <h2>Your Rights</h2>
              </div>
              <p>
                Under the Digital Personal Data Protection Act, you maintain the right to access your submitted records, request data correction, and request permanent erasure of your archived files after completion of your verification review.
              </p>
            </section>

            <section className="policy-contact-card">
              <h3>Data Protection Officer (DPO) Contact</h3>
              <p>For inquiries regarding data privacy or erasure requests:</p>
              <div className="policy-contact-details">
                <div className="contact-detail-row">
                  <Mail size={18} className="detail-icon" />
                  <span>privacy@propertysuraksha.com / dpo@propertysuraksha.com</span>
                </div>
              </div>
            </section>
          </main>

          <aside className="policy-toc-sidebar">
            <div className="toc-sticky-card">
              <div className="toc-card-header">
                <BookOpen size={18} className="toc-icon" />
                <h4>Privacy Navigation</h4>
              </div>
              <ul className="toc-links">
                <li><a href="#p-1">1. Information We Collect</a></li>
                <li><a href="#p-2">2. Document Usage</a></li>
                <li><a href="#p-3">3. Encryption & Storage</a></li>
                <li><a href="#p-4">4. Your Data Rights</a></li>
              </ul>
              <div className="toc-cta-box">
                <p>Have questions on document privacy?</p>
                <Link to="/contact" className="btn-toc-contact">Contact Support</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
