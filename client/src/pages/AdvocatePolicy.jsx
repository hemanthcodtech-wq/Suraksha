import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  Lock, 
  UserCheck, 
  Receipt, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  ArrowLeft,
  Mail,
  Phone,
  BookOpen
} from 'lucide-react';
import './PolicyPages.css';

export const AdvocatePolicy = () => {
  return (
    <div className="policy-page">
      {/* Policy Hero Header */}
      <section className="policy-hero-section">
        <div className="container">
          <div className="policy-hero-content">
            <Link to="/" className="policy-back-link">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <span className="policy-tag-badge">LEGAL COMPLIANCE</span>
            <h1 className="policy-title">Advocate and Professional Engagement Policy</h1>
            <p className="policy-meta">
              <strong>PROPERTY SURAKSHA</strong> • Last Updated: October 2026 • Bar Council Compliant
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Table of Contents Sidebar */}
      <div className="container policy-body-container">
        <div className="policy-layout-grid">
          {/* Main Legal Clauses */}
          <main className="policy-article">
            {/* Clause 1 */}
            <section id="section-1" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">01</div>
                <h2>Purpose</h2>
              </div>
              <p>
                This policy describes the general process for assigning property verification cases to advocates or other authorized professionals through <strong>PROPERTY SURAKSHA</strong>.
              </p>
              <p>
                The specific responsibilities of each professional are governed by the applicable engagement terms, agreed scope, and professional rules under the Advocates Act, 1961 and relevant Bar Council guidelines.
              </p>
            </section>

            {/* Clause 2 */}
            <section id="section-2" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">02</div>
                <h2>Case Assignment</h2>
              </div>
              <p>
                Cases may be assigned based on the property location, type of verification, professional availability, relevant experience in regional sub-registrar records, and other reasonable operational factors.
              </p>
              <div className="policy-callout-note">
                <AlertCircle size={20} className="callout-icon" />
                <p>
                  <strong>Operational Notice:</strong> An assignment does not guarantee that a professional will be able to complete the case if a conflict of interest, missing documentation, or other professional impediment arises during examination.
                </p>
              </div>
            </section>

            {/* Clause 3 */}
            <section id="section-3" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">03</div>
                <h2>Document Access</h2>
              </div>
              <p>
                Assigned professionals may access customer property records, sale agreements, encumbrance certificates, and case information reasonably necessary to perform the assigned verification work.
              </p>
              <div className="policy-checklist">
                <div className="checklist-item">
                  <CheckCircle2 size={18} className="check-gold" />
                  <span>Use property information strictly for authorized case-related assessment.</span>
                </div>
                <div className="checklist-item">
                  <CheckCircle2 size={18} className="check-gold" />
                  <span>Prohibition on disclosure to unauthorized third parties or commercial entities.</span>
                </div>
                <div className="checklist-item">
                  <CheckCircle2 size={18} className="check-gold" />
                  <span>Strict restriction against downloading or retaining customer files beyond permitted legal review duration.</span>
                </div>
              </div>
            </section>

            {/* Clause 4 */}
            <section id="section-4" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">04</div>
                <h2>Review and Report Submission</h2>
              </div>
              <p>
                The assigned professional is expected to review the documents within the agreed scope, identify relevant findings, title chains, and legal limitations, and submit the report through the designated platform or approved review process.
              </p>
              <p>
                Where required by the platform workflow, reports may be reviewed by an authorized administrator before being released to the customer. Administrative approval should not be represented as a statutory guarantee that every legal risk has been identified.
              </p>
            </section>

            {/* Clause 5 */}
            <section id="section-5" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">05</div>
                <h2>Independence and Conflicts of Interest</h2>
              </div>
              <p>
                Professionals must disclose relevant conflicts of interest and should not knowingly participate in a case where applicable professional rules or prior representation prohibit the engagement.
              </p>
              <div className="policy-highlight-box">
                <Scale size={24} className="box-icon" />
                <div>
                  <strong>Customer Conduct Requirement</strong>
                  <p>
                    Customers must not attempt to influence advocate findings through improper payments, undue pressure, or requests to omit material title defects or encumbrance observations.
                  </p>
                </div>
              </div>
            </section>

            {/* Clause 6 */}
            <section id="section-6" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">06</div>
                <h2>Fees and Payments</h2>
              </div>
              <p>
                Professional fees and the platform's service charges should be communicated transparently through the applicable quotation or engagement terms prior to payment confirmation.
              </p>
              <p>
                Any applicable advocate fee arrangements must comply with the professional rules governing the legal fraternity and the nature of the engagement. The platform does not promise specific legal outcomes or court judgments in exchange for fees.
              </p>
            </section>

            {/* Clause 7 */}
            <section id="section-7" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">07</div>
                <h2>Confidentiality and Security</h2>
              </div>
              <p>
                Professionals must protect customer information and follow applicable confidentiality, privacy, data-security, and professional obligations under the Digital Personal Data Protection (DPDP) standards.
              </p>
              <p>
                Any suspected unauthorized disclosure or security incident relating to a case must be reported promptly to our compliance team at <code>security@propertysuraksha.com</code>.
              </p>
            </section>

            {/* Clause 8 */}
            <section id="section-8" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">08</div>
                <h2>Customer Communication</h2>
              </div>
              <p>
                Case-related communication should take place through approved platform channels where practical, so that requests, document submissions, and case updates can be recorded accurately.
              </p>
              <div className="policy-security-warning">
                <Lock size={20} className="lock-icon" />
                <span>
                  <strong>Security Reminder:</strong> Customers should never share passwords, bank OTPs, or financial credentials with advocates, administrators, or customer support personnel.
                </span>
              </div>
            </section>

            {/* Clause 9 */}
            <section id="section-9" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">09</div>
                <h2>Quality and Complaints</h2>
              </div>
              <p>
                Customers may raise concerns regarding turnaround delays, communication, or the scope of an issued report through our grievance desk at <code>1ticket0308@gmail.com</code>.
              </p>
              <p>
                Complaints will be reviewed according to the circumstances, engagement terms, and applicable law. A disagreement with an advocate's unbiased legal findings does not, by itself, establish professional misconduct or guarantee a refund.
              </p>
            </section>

            {/* Clause 10 & 11 */}
            <section id="section-10" className="policy-section-card">
              <div className="policy-section-header">
                <div className="clause-num-badge">10</div>
                <h2>Compliance & Governance</h2>
              </div>
              <p>
                All parties must comply with applicable Indian law, relevant Bar Council regulations, and the platform's Terms of Service. If a provision of this policy conflicts with mandatory law or professional requirements, those requirements will prevail.
              </p>
            </section>

            <section id="section-11" className="policy-contact-card">
              <h3>Legal & Policy Inquiries</h3>
              <p>For questions or notices regarding this Advocate and Professional Engagement Policy:</p>
              <div className="policy-contact-details">
                <div className="contact-detail-row">
                  <Mail size={18} className="detail-icon" />
                  <span>Email: 1ticket0308@gmail.com</span>
                </div>
                <div className="contact-detail-row">
                  <Phone size={18} className="detail-icon" />
                  <span>Phone: +91 79899 38718</span>
                </div>
              </div>
            </section>
          </main>

          {/* Quick Sticky Table of Contents Navigation */}
          <aside className="policy-toc-sidebar">
            <div className="toc-sticky-card">
              <div className="toc-card-header">
                <BookOpen size={18} className="toc-icon" />
                <h4>Policy Sections</h4>
              </div>
              <ul className="toc-links">
                <li><a href="#section-1">1. Purpose</a></li>
                <li><a href="#section-2">2. Case Assignment</a></li>
                <li><a href="#section-3">3. Document Access</a></li>
                <li><a href="#section-4">4. Review & Report Submission</a></li>
                <li><a href="#section-5">5. Independence & Conflicts</a></li>
                <li><a href="#section-6">6. Fees and Payments</a></li>
                <li><a href="#section-7">7. Confidentiality & Security</a></li>
                <li><a href="#section-8">8. Customer Communication</a></li>
                <li><a href="#section-9">9. Quality and Complaints</a></li>
                <li><a href="#section-10">10. Compliance</a></li>
                <li><a href="#section-11">11. Contact Details</a></li>
              </ul>

              <div className="toc-cta-box">
                <p>Have questions on advocate engagement?</p>
                <Link to="/contact" className="btn-toc-contact">Contact Legal Desk</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdvocatePolicy;
