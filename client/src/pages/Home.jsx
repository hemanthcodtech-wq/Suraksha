import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Map, 
  Home as HomeIcon, 
  Scale, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Receipt, 
  FileSearch,
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  AlertTriangle, 
  HelpCircle, 
  Headphones, 
  UserCheck, 
  Check, 
  Clock, 
  ExternalLink, 
  Laptop 
} from 'lucide-react';
import heroVillaImg from '../assets/hero-villa.jpg';
import cityBannerImg from '../assets/city-banner.jpg';
import builderImg from '../assets/service-builder-hq.jpg';
import landImg from '../assets/service-land-layout.jpg';
import servicesHeroImg from '../assets/services-hero.jpg';
import legalImg from '../assets/about-legal-hero.jpg';
import { luxuryEasing, unravelContainer, unravelItem, fadeUpVariant, lineDrawVariant } from '../components/animation/motionVariants';
import ScrollReveal, { UnravelHeading } from '../components/animation/ScrollReveal';
import MagneticButton from '../components/animation/MagneticButton';
import './Home.css';

export const Home = () => {
  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "What documents are required?",
      a: "Requirements depend on your property type. Typically: Sale Deed / Title Deed copies, 30-year Encumbrance Certificate (EC), Latest Tax Receipts & Khata certificate, Sanctioned Plan & RERA Registration details (for apartments), and Link documents establishing clear 30-year lineage."
    },
    {
      q: "How much does verification cost?",
      a: "Our verification pricing is completely transparent with upfront quotes provided right after initial document intake. Rates start with affordable single-document review tiers up to full end-to-end legal due diligence. Zero hidden fees, zero surprise retainers."
    },
    {
      q: "How long does verification take?",
      a: "Standard verification is typically completed within 3 to 5 business days from receiving all required documents. For urgent registration deadlines, priority express turnaround (48 hours) is also available upon request."
    },
    {
      q: "Can I track my request online?",
      a: "Yes! Every verification request receives a dedicated secure customer dashboard tracking ID where you can inspect real-time progress, upload missing files, communicate directly with the legal coordinator, and download your final certified report."
    },
    {
      q: "Who reviews my property documents?",
      a: "Your property files are scrutinized by experienced, bar-certified property advocates specializing in regional real estate laws, sub-registrar revenue records, and municipal layout approvals."
    },
    {
      q: "Is the report a guarantee of legal ownership?",
      a: "No. While our senior advocates conduct rigorous scrutiny of historical title records, revenue documentation, court indexes, and regulatory approvals to reveal latent encumbrances, legal due diligence provides structured, informed risk assessments and findings. It does not replace court judgments or eliminate 100% of unforeseen statutory disputes."
    }
  ];

  return (
    <div className="home-page">
      {/* =========================================
          02. HERO BANNER
          ========================================= */}
      <section className="hero-section">
        <div className="hero-backdrop">
          <div className="hero-gradient-overlay"></div>
          <motion.img 
            src={heroVillaImg} 
            alt="Luxury Verified Real Estate" 
            className="hero-bg-image"
            initial={{ scale: 1.08, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: luxuryEasing }}
          />
        </div>

        <div className="container hero-container">
          <motion.div 
            className="hero-content"
            variants={unravelContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUpVariant}>
              <span className="section-badge section-badge-dark">Legal Due Diligence Platform</span>
            </motion.div>

            {/* Signature Line-by-Line Unravel Heading */}
            <div className="unravel-heading-container">
              <div className="unravel-line">
                <motion.h1 variants={unravelItem} className="hero-headline">
                  Verify Your Property.
                </motion.h1>
              </div>
              <div className="unravel-line">
                <motion.h1 variants={unravelItem} className="hero-headline">
                  Secure Your Future.
                </motion.h1>
              </div>
            </div>

            {/* Cinematic fine gold accent line */}
            <motion.div 
              variants={lineDrawVariant}
              style={{
                height: '2px',
                background: 'linear-gradient(90deg, #D4AF37 0%, rgba(212, 175, 55, 0.1) 100%)',
                margin: '1.2rem 0',
                maxWidth: '240px'
              }}
            />

            <motion.p variants={fadeUpVariant} className="hero-subtext">
              Comprehensive property legal verification, land title checks, and document scrutiny conducted by seasoned advocates before you buy or invest.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="hero-cta-group">
              <MagneticButton strength={15}>
                <Link to="/get-started" className="btn-gold">
                  <span>Start Verification</span>
                  <ArrowRight size={18} />
                </Link>
              </MagneticButton>
              <Link to="/services" className="btn-white-outline">
                <span>Explore Our Services</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero bottom quick-categories pill bar matching reference image */}
        <div className="hero-pill-bar-wrapper">
          <div className="container">
            <motion.div 
              className="hero-pill-bar"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: luxuryEasing }}
            >
              <Link to="/services#builder" className="pill-item">
                <div className="pill-icon-circle">
                  <Building2 size={20} />
                </div>
                <span className="pill-label">Builder Verification</span>
              </Link>
              <div className="pill-divider"></div>

              <Link to="/services#land" className="pill-item">
                <div className="pill-icon-circle">
                  <Map size={20} />
                </div>
                <span className="pill-label">Land & Plot Verification</span>
              </Link>
              <div className="pill-divider"></div>

              <Link to="/services#apartment" className="pill-item">
                <div className="pill-icon-circle">
                  <HomeIcon size={20} />
                </div>
                <span className="pill-label">Apartment & Villa Verification</span>
              </Link>
              <div className="pill-divider"></div>

              <Link to="/services#due-diligence" className="pill-item">
                <div className="pill-icon-circle">
                  <Scale size={20} />
                </div>
                <span className="pill-label">Legal Due Diligence</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          03. TRUST & CREDIBILITY STRIP
          ========================================= */}
      <section className="trust-strip-section">
        <div className="container">
          <div className="trust-strip-grid">
            <ScrollReveal animation="fadeUp" delay={0.05} className="trust-item">
              <div className="trust-icon-box">
                <Scale size={24} />
              </div>
              <div>
                <h4>Experienced Legal Professionals</h4>
                <p>Bar-certified senior advocates with deep real estate domain practice.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.12} className="trust-item">
              <div className="trust-icon-box">
                <Lock size={24} />
              </div>
              <div>
                <h4>Confidential Document Handling</h4>
                <p>256-bit SSL encrypted storage ensuring total buyer privacy.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.19} className="trust-item">
              <div className="trust-icon-box">
                <Receipt size={24} />
              </div>
              <div>
                <h4>Transparent Quotations</h4>
                <p>Clear, fixed fee upfront before any payment. Zero surprises.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.26} className="trust-item">
              <div className="trust-icon-box">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4>Structured Verification Process</h4>
                <p>Multi-step title verification checklist covering 30+ year records.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          04. OUR SERVICES
          ========================================= */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Verification Categories</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="section-title">
              Our Services
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="section-subtitle">
                Comprehensive legal verification for all your real estate needs.
              </p>
            </ScrollReveal>
          </div>

          <div className="services-grid">
            {/* Card 1: Builder */}
            <ScrollReveal animation="fadeUp" delay={0.05} className="service-card">
              <div className="service-card-media">
                <img src={builderImg} alt="Builder & Real-Estate Verification" className="service-card-img" />
                <div className="service-card-media-overlay"></div>
                <span className="service-card-num">01</span>
              </div>
              <div className="service-card-content">
                <div className="service-card-icon-pill">
                  <Building2 size={22} />
                </div>
                <h3 className="service-card-title">Builder & Real-Estate Verification</h3>
                <p className="service-card-desc">
                  Check company registration, past project track records, litigation history & RERA compliance.
                </p>
                <Link to="/services#builder" className="service-card-link">
                  <span>Learn More</span>
                  <ArrowRight size={14} className="arrow-icon" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 2: Land & Plot */}
            <ScrollReveal animation="fadeUp" delay={0.12} className="service-card">
              <div className="service-card-media">
                <img src={landImg} alt="Land & Plot Verification" className="service-card-img" />
                <div className="service-card-media-overlay"></div>
                <span className="service-card-num">02</span>
              </div>
              <div className="service-card-content">
                <div className="service-card-icon-pill">
                  <Map size={22} />
                </div>
                <h3 className="service-card-title">Land & Plot Verification</h3>
                <p className="service-card-desc">
                  Verify 30-year ownership lineage, revenue records, layout sanction & encumbrances.
                </p>
                <Link to="/services#land" className="service-card-link">
                  <span>Learn More</span>
                  <ArrowRight size={14} className="arrow-icon" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 3: Apartment & Villa */}
            <ScrollReveal animation="fadeUp" delay={0.19} className="service-card">
              <div className="service-card-media">
                <img src={heroVillaImg} alt="Apartment & Villa Verification" className="service-card-img" />
                <div className="service-card-media-overlay"></div>
                <span className="service-card-num">03</span>
              </div>
              <div className="service-card-content">
                <div className="service-card-icon-pill">
                  <HomeIcon size={22} />
                </div>
                <h3 className="service-card-title">Apartment & Villa Verification</h3>
                <p className="service-card-desc">
                  Review sanctioned plans, Occupancy Certificate (OC), Commencement Certificate & UDS.
                </p>
                <Link to="/services#apartment" className="service-card-link">
                  <span>Learn More</span>
                  <ArrowRight size={14} className="arrow-icon" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 4: Property Document Review */}
            <ScrollReveal animation="fadeUp" delay={0.26} className="service-card">
              <div className="service-card-media">
                <img src={legalImg} alt="Property Document Review" className="service-card-img" />
                <div className="service-card-media-overlay"></div>
                <span className="service-card-num">04</span>
              </div>
              <div className="service-card-content">
                <div className="service-card-icon-pill">
                  <FileText size={22} />
                </div>
                <h3 className="service-card-title">Property Document Review</h3>
                <p className="service-card-desc">
                  Scrutinize sale deeds, agreement of sale, mother deeds & identify one-sided penalty terms.
                </p>
                <Link to="/services#document" className="service-card-link">
                  <span>Learn More</span>
                  <ArrowRight size={14} className="arrow-icon" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Card 5: Legal Due Diligence */}
            <ScrollReveal animation="fadeUp" delay={0.33} className="service-card">
              <div className="service-card-media">
                <img src={cityBannerImg} alt="Legal Due Diligence" className="service-card-img" />
                <div className="service-card-media-overlay"></div>
                <span className="service-card-num">05</span>
              </div>
              <div className="service-card-content">
                <div className="service-card-icon-pill">
                  <Scale size={22} />
                </div>
                <h3 className="service-card-title">Legal Due Diligence</h3>
                <p className="service-card-desc">
                  Detailed 360° legal report, risk analysis scorecard & direct senior advocate consultation.
                </p>
                <Link to="/services#due-diligence" className="service-card-link">
                  <span>Learn More</span>
                  <ArrowRight size={14} className="arrow-icon" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          05. HOW IT WORKS
          ========================================= */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Step-by-Step Flow</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="section-title">
              How It Works
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="section-subtitle">
                Simple 4-step horizontal process. Timelines & requirements vary by case specifics.
              </p>
            </ScrollReveal>
          </div>

          <div className="steps-container">
            <div className="steps-timeline-line"></div>
            <div className="steps-grid">
              {/* Step 1 */}
              <ScrollReveal animation="fadeUp" delay={0.06} className="step-card">
                <div className="step-badge">
                  <span className="step-num">1</span>
                </div>
                <div className="step-content">
                  <h4 className="step-number-title">1. Submit Request</h4>
                  <p className="step-desc">
                    Provide basic property details, location, and the type of verification needed.
                  </p>
                </div>
              </ScrollReveal>

              {/* Step 2 */}
              <ScrollReveal animation="fadeUp" delay={0.14} className="step-card">
                <div className="step-badge">
                  <span className="step-num">2</span>
                </div>
                <div className="step-content">
                  <h4 className="step-number-title">2. Upload Documents</h4>
                  <p className="step-desc">
                    Securely upload available title deeds, EC, parent documents, or layout plans.
                  </p>
                </div>
              </ScrollReveal>

              {/* Step 3 */}
              <ScrollReveal animation="fadeUp" delay={0.22} className="step-card">
                <div className="step-badge">
                  <span className="step-num">3</span>
                </div>
                <div className="step-content">
                  <h4 className="step-number-title">3. Quotation & Payment</h4>
                  <p className="step-desc">
                    Receive clear fixed pricing based on case scope. Approve and pay securely.
                  </p>
                </div>
              </ScrollReveal>

              {/* Step 4 */}
              <ScrollReveal animation="fadeUp" delay={0.30} className="step-card">
                <div className="step-badge">
                  <span className="step-num">4</span>
                </div>
                <div className="step-content">
                  <h4 className="step-number-title">4. Track & Access Report</h4>
                  <p className="step-desc">
                    Follow advocate progress in real-time and download your final certified report.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="timeline-disclaimer">
            <Clock size={16} />
            <span>Note: Standard cases take 3–5 business days. Complex ancestral titles or high-volume builder projects may require additional records inspection.</span>
          </div>
        </div>
      </section>

      {/* =========================================
          06. WHY CHOOSE PROPERTY SURAKSHA?
          ========================================= */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Client Advantage</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="section-title">
              Why Choose Property Suraksha?
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="section-subtitle max-w-700">
                Unbiased legal analysis engineered to protect your capital and eliminate real-estate blindspots.
              </p>
            </ScrollReveal>
          </div>

          <div className="why-grid">
            <ScrollReveal animation="fadeUp" delay={0.05} className="why-card">
              <div className="why-icon-box">
                <Scale size={24} />
              </div>
              <h3 className="why-card-title">Advocate-Assisted Review</h3>
              <p className="why-card-desc">
                Every title document is reviewed by practicing high court & district real-estate legal specialists, not automated algorithms.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.10} className="why-card">
              <div className="why-icon-box">
                <FileSearch size={24} />
              </div>
              <h3 className="why-card-title">Case-Specific Verification</h3>
              <p className="why-card-desc">
                Checklists are tailored to your jurisdiction, whether purchasing agricultural land, RERA villa developments, or resale flats.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.15} className="why-card">
              <div className="why-icon-box">
                <Receipt size={24} />
              </div>
              <h3 className="why-card-title">Clear Pricing Before Payment</h3>
              <p className="why-card-desc">
                Transparent scope-based quotations delivered upfront. No surprise consult charges or hidden retainer costs.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.20} className="why-card">
              <div className="why-icon-box">
                <Lock size={24} />
              </div>
              <h3 className="why-card-title">Secure Document Access</h3>
              <p className="why-card-desc">
                End-to-end encrypted vault keeps your confidential property papers safe and accessible solely to assigned legal counsels.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.25} className="why-card">
              <div className="why-icon-box">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="why-card-title">Report Review & Approval</h3>
              <p className="why-card-desc">
                Multi-tier quality check where senior partners review findings before certifying and issuing the final report.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.30} className="why-card">
              <div className="why-icon-box">
                <Headphones size={24} />
              </div>
              <h3 className="why-card-title">Dedicated Support</h3>
              <p className="why-card-desc">
                Direct phone and email contact with your case legal coordinator to address questions whenever you need clarity.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          07. WHAT YOUR VERIFICATION REPORT COVERS
          ========================================= */}
      <section className="report-preview-section">
        <div className="container">
          <div className="section-header">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Clear Deliverable</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="section-title">
              What Your Verification Report Covers
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="section-subtitle">
                Structured insights tailored to the scope of your selected verification service.
              </p>
            </ScrollReveal>
          </div>

          <div className="report-container-grid">
            {/* Features coverage list */}
            <div className="report-scope-list">
              {[
                { num: "1", title: "Documents Reviewed", desc: "Comprehensive inventory of all deeds, encumbrance certificates, layout sanctions, and tax proofs scrutinized." },
                { num: "2", title: "Findings and Observations", desc: "Chronological chain of title titleholder transitions dating back up to 30 years with legal validity assessments." },
                { num: "3", title: "Potential Discrepancies Identified", desc: "Explicit callouts for boundary mismatch, revenue classification discrepancies, missing parent deeds, or unreleased mortgages." },
                { num: "4", title: "Missing Information & Recommended Checks", desc: "Specific follow-up documents to demand from the seller/builder prior to signing or payment of token money." },
                { num: "5", title: "Advocate’s Comments & Opinion", desc: "Executive legal advisory summary stating clear risk status (Low / Moderate / High) and final advocate recommendation." }
              ].map((item, idx) => (
                <ScrollReveal key={idx} animation="fadeUp" delay={idx * 0.08} className="scope-item">
                  <div className="scope-bullet">{item.num}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Fictional Sample Report Preview */}
            <ScrollReveal animation="scaleUp" delay={0.2} className="sample-report-mockup">
              <div className="sample-watermark-badge">FICTIONAL DATA — SAMPLE PREVIEW</div>
              <div className="sample-report-inner">
                <div className="sample-report-header">
                  <div>
                    <span className="sample-report-tag">LEGAL OPINION REPORT</span>
                    <h4 className="sample-report-title">Survey No. 182/B, Gachibowli</h4>
                    <p className="sample-report-meta">Case Ref: #PS-84920 • Property Suraksha Legal Board</p>
                  </div>
                  <div className="sample-score-badge">
                    <span className="score-label">RISK STATUS</span>
                    <span className="score-val score-green">CLEAR (LOW RISK)</span>
                  </div>
                </div>

                <div className="sample-report-table">
                  <div className="sample-row">
                    <span className="row-k">30-Year EC Status</span>
                    <span className="row-v text-success"><Check size={14} /> Clear from 1994 to present. No registered encumbrance.</span>
                  </div>
                  <div className="sample-row">
                    <span className="row-k">RERA Approval</span>
                    <span className="row-v text-success"><Check size={14} /> Validated (P02400004921) Active till Dec 2028</span>
                  </div>
                  <div className="sample-row">
                    <span className="row-k">Title Chain Discrepancy</span>
                    <span className="row-v text-warning"><AlertTriangle size={14} /> Rectification deed dated 2011 verified & intact</span>
                  </div>
                  <div className="sample-row">
                    <span className="row-k">Advocate Advisory</span>
                    <span className="row-v">Obtain latest original tax paid challan before final registration. Clear to proceed.</span>
                  </div>
                </div>

                <div className="sample-report-footer">
                  <div className="advocate-sign-box">
                    <div className="signature-mock">Adv. V. Sundaram (Bar Reg: AP/1892/2004)</div>
                    <span className="sign-label">Senior Real Estate Counsel</span>
                  </div>
                  <button className="btn-sample-download" onClick={() => alert("Downloading fictional sample report PDF...")}>
                    <Download size={14} />
                    <span>Download Sample PDF</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          08. CUSTOMER DASHBOARD PREVIEW
          ========================================= */}
      <section className="dashboard-preview-section">
        <div className="container">
          <ScrollReveal animation="fadeUp" className="dashboard-preview-card">
            <div className="dashboard-header-row">
              <div>
                <span className="section-badge section-badge-dark">Client Portal</span>
                <h2 className="dashboard-heading">Customer Dashboard Experience</h2>
                <p className="dashboard-subheading">
                  Track every milestone of your property check in real time from submission to certified delivery.
                </p>
              </div>
              <MagneticButton strength={14}>
                <Link to="/login" className="btn-gold">
                  <span>Access Portal</span>
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>
            </div>

            {/* Dashboard UI Mockup */}
            <div className="portal-mockup">
              <div className="portal-topbar">
                <div className="portal-dots">
                  <span className="dot-red"></span>
                  <span className="dot-yellow"></span>
                  <span className="dot-green"></span>
                </div>
                <div className="portal-title-bar">Property Suraksha — Case Management Portal</div>
              </div>

              <div className="portal-body">
                {/* Sidebar mock */}
                <div className="portal-sidebar">
                  <div className="portal-user-badge">
                    <div className="avatar-circle">JD</div>
                    <div>
                      <strong>John Doe</strong>
                      <span>Active Buyer</span>
                    </div>
                  </div>
                  <div className="portal-menu-item active">Active Cases (2)</div>
                  <div className="portal-menu-item">Upload Documents</div>
                  <div className="portal-menu-item">Quotations & Payments</div>
                  <div className="portal-menu-item">Approved Reports</div>
                  <div className="portal-menu-item">Legal Consultation</div>
                </div>

                {/* Main panel mock */}
                <div className="portal-main-panel">
                  <div className="portal-case-header">
                    <div>
                      <span className="portal-badge-in-progress">In Verification</span>
                      <h4 className="case-title">Case #PS-9021: 3BHK Flat, Prestige City Wing B</h4>
                      <p className="case-sub">Assigned Counsel: Adv. K. Raghavan • Estimated Delivery: 48 hrs</p>
                    </div>
                    <span className="case-quote-tag">Quotation Approved: ₹4,999</span>
                  </div>

                  {/* Progress milestones */}
                  <div className="progress-tracker">
                    <div className="progress-step completed">
                      <div className="p-circle"><Check size={14} /></div>
                      <span>Submitted</span>
                    </div>
                    <div className="p-line completed"></div>
                    <div className="progress-step completed">
                      <div className="p-circle"><Check size={14} /></div>
                      <span>Documents Uploaded</span>
                    </div>
                    <div className="p-line completed"></div>
                    <div className="progress-step current">
                      <div className="p-circle"><FileSearch size={14} /></div>
                      <span>Advocate Review</span>
                    </div>
                    <div className="p-line"></div>
                    <div className="progress-step">
                      <div className="p-circle">4</div>
                      <span>Approved Report</span>
                    </div>
                  </div>

                  {/* Actions preview */}
                  <div className="portal-actions-row">
                    <div className="portal-doc-item">
                      <FileText size={16} className="doc-icon" />
                      <span>Sale_Deed_Copy_1998.pdf (Verified)</span>
                    </div>
                    <button className="portal-btn-sm" onClick={() => alert("Upload dialog opened in prototype")}>
                      + Upload Additional Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          09. FREQUENTLY ASKED QUESTIONS (FAQS)
          ========================================= */}
      <section className="faq-section" id="faqs">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Got Questions?</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="section-title">
              Frequently Asked Questions
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="section-subtitle max-w-700">
                Clear answers regarding our verification process, advocate qualifications, and service boundaries.
              </p>
            </ScrollReveal>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openFaq === index ? 'faq-item-open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <motion.div 
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: luxuryEasing }}
                  >
                    <ChevronDown size={20} className="faq-toggle-icon" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: luxuryEasing }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Legal Boundary Note */}
          <ScrollReveal animation="fadeUp" className="legal-boundary-note">
            <AlertTriangle size={20} className="boundary-icon" />
            <p>
              <strong>Important Scope Note:</strong> Property Suraksha provides comprehensive professional legal opinions based upon presented records and sub-registrar revenue checks. This service supports informed investment decisions but does not guarantee the complete absence of every concealed civil dispute or unrecorded claim.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          10. FINAL CALL TO ACTION (CTA)
          ========================================= */}
      <section className="final-cta-section">
        <div className="container">
          <ScrollReveal animation="maskReveal" className="final-cta-card">
            <div className="final-cta-overlay"></div>
            <img 
              src={cityBannerImg} 
              alt="City Skyline Legal Verification" 
              className="final-cta-bg" 
            />
            <div className="final-cta-content">
              <span className="section-badge section-badge-dark">Get Started Today</span>
              <UnravelHeading as="h2" className="final-cta-title">
                Make Your Next Property Decision with Confidence.
              </UnravelHeading>
              <p className="final-cta-desc">
                Avoid costly legal litigation, disputes, and unapproved layouts. Submit your property particulars for a rapid, structured advocate verification.
              </p>
              <div className="final-cta-buttons">
                <MagneticButton strength={15}>
                  <Link to="/get-started" className="btn-gold">
                    <span>Start Verification</span>
                    <ArrowRight size={18} />
                  </Link>
                </MagneticButton>
                <Link to="/contact" className="btn-white-outline">
                  <span>Contact Our Team</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
