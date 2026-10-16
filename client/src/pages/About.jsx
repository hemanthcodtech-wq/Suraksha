import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Lock, 
  Scale, 
  FileCheck2, 
  Workflow, 
  Receipt, 
  UserCheck, 
  FileText, 
  Home, 
  TrendingUp, 
  Map, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Award 
} from 'lucide-react';
import aboutLegalImg from '../assets/about-legal-hero.jpg';
import cityBannerImg from '../assets/city-banner.jpg';
import { luxuryEasing, unravelContainer, unravelItem, fadeUpVariant } from '../components/animation/motionVariants';
import ScrollReveal, { UnravelHeading } from '../components/animation/ScrollReveal';
import MagneticButton from '../components/animation/MagneticButton';
import './About.css';

export const About = () => {
  return (
    <div className="about-page">
      {/* =========================================
          1. HERO SECTION
          ========================================= */}
      <section className="about-hero-section">
        <div className="about-hero-backdrop">
          <div className="about-hero-overlay"></div>
          <motion.img 
            src={aboutLegalImg} 
            alt="Property Suraksha Legal Scale & Property" 
            className="about-hero-bg"
            initial={{ scale: 1.06, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: luxuryEasing }}
          />
        </div>

        <div className="container about-hero-container">
          <motion.div 
            className="about-hero-content"
            variants={unravelContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeUpVariant} className="section-badge section-badge-dark">
              ABOUT PROPERTY SURAKSHA
            </motion.span>
            
            <div style={{ overflow: 'hidden', margin: '0.9rem 0 1.2rem' }}>
              <motion.h1 variants={unravelItem} className="about-hero-title">
                Building Trust.<br />
                Protecting Property Investments.
              </motion.h1>
            </div>

            <motion.p variants={fadeUpVariant} className="about-hero-desc">
              Property Suraksha helps individuals make more informed real-estate decisions through structured property document verification, legal review, and a transparent verification process.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="about-hero-buttons">
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
      </section>

      {/* =========================================
          2. WHO WE ARE (OUR STORY)
          ========================================= */}
      <section className="who-we-are-section">
        <div className="container">
          <div className="who-we-are-grid">
            <ScrollReveal animation="fadeUp" className="who-text-col">
              <span className="section-badge">Who We Are</span>
              <UnravelHeading as="h2" className="about-section-heading">
                A More Confident Way to Verify Property
              </UnravelHeading>
              <p>
                Property Suraksha is a property verification platform designed to help buyers, investors, and property owners approach real-estate transactions with greater clarity and confidence.
              </p>
              <p>
                Property-related decisions often involve complex documents, multiple checks, and significant financial commitments. Understanding the available records and identifying potential discrepancies before proceeding can make an important difference.
              </p>
              <p>
                Our platform provides a structured process for submitting property details, sharing relevant documents, receiving case-specific quotations, and accessing verification reports prepared through the applicable review process.
              </p>
              <p className="highlight-text">
                Our goal is to make property verification more organised, transparent, and accessible.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="maskReveal" delay={0.2} className="who-visual-col">
              <div className="who-image-frame">
                <img 
                  src={aboutLegalImg} 
                  alt="Legal Due Diligence Scale and House" 
                  className="who-inset-img" 
                />
                <div className="who-badge-overlay">
                  <ShieldCheck size={28} className="who-badge-icon" />
                  <div>
                    <strong>Organised & Transparent</strong>
                    <span>Independent Advocate Verification</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          3. OUR MISSION, VISION & VALUES
          ========================================= */}
      <section className="mission-vision-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Our Guiding Principles</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="about-section-heading">
              Our Mission, Vision & Core Values
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="about-section-sub max-w-700">
                Foundational principles built to safeguard your property decisions and protect legal rights.
              </p>
            </ScrollReveal>
          </div>

          <div className="mission-vision-grid">
            <ScrollReveal animation="fadeUp" delay={0.06} className="mv-card">
              <div className="mv-icon-box">
                <Target size={28} />
              </div>
              <h3 className="mv-title">Our Mission</h3>
              <p className="mv-desc">
                To simplify property verification by connecting customers with an organised process for document review, legal assessment, and informed decision-making.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.12} className="mv-card">
              <div className="mv-icon-box">
                <Eye size={28} />
              </div>
              <h3 className="mv-title">Our Vision</h3>
              <p className="mv-desc">
                To become a trusted platform for accessible, transparent, and responsible property verification across India.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.18} className="mv-card">
              <div className="mv-icon-box">
                <Scale size={28} />
              </div>
              <h3 className="mv-title">Integrity</h3>
              <p className="mv-desc">
                We value honest communication, clear service boundaries, and responsible handling of verification findings with zero bias.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.24} className="mv-card">
              <div className="mv-icon-box">
                <Lock size={28} />
              </div>
              <h3 className="mv-title">Confidentiality</h3>
              <p className="mv-desc">
                We aim to protect customer information and property documents through appropriate access controls and rigorous data-handling practices.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          4. WHY PROPERTY VERIFICATION MATTERS
          ========================================= */}
      <section className="why-matters-section">
        <div className="container">
          <ScrollReveal animation="fadeUp" className="why-matters-box">
            <div className="why-matters-header">
              <span className="section-badge section-badge-dark">Critical Due Diligence</span>
              <h2 className="why-matters-title">
                Every Property Has a Story.<br />Understand It Before You Invest.
              </h2>
              <p className="why-matters-desc">
                A property's appearance is only one part of the decision. Relevant records, ownership documents, approvals, and other legal considerations may also need to be examined.
              </p>
            </div>

            <div className="benefits-checklist-grid">
              <div className="benefit-item">
                <div className="benefit-dot">
                  <CheckCircle2 size={18} />
                </div>
                <p>Understand the documents provided for review and verify their chronological lineage.</p>
              </div>

              <div className="benefit-item">
                <div className="benefit-dot">
                  <CheckCircle2 size={18} />
                </div>
                <p>Identify inconsistencies, boundary errors, or missing parent link documents early.</p>
              </div>

              <div className="benefit-item">
                <div className="benefit-dot">
                  <CheckCircle2 size={18} />
                </div>
                <p>Determine whether additional revenue records or municipal checks may be required.</p>
              </div>

              <div className="benefit-item">
                <div className="benefit-dot">
                  <CheckCircle2 size={18} />
                </div>
                <p>Better understand potential legal, encumbrance, or documentation concerns.</p>
              </div>

              <div className="benefit-item benefit-span-full">
                <div className="benefit-dot">
                  <CheckCircle2 size={18} />
                </div>
                <p><strong>Make more informed decisions</strong> with peace of mind before proceeding with any financial commitment or registration.</p>
              </div>
            </div>

            <div className="matters-boundary-note">
              <AlertTriangle size={18} className="boundary-amber-icon" />
              <span>
                Property verification has defined limitations. Findings depend on the documents available, the checks performed, and the scope of the engagement.
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          5. WHAT MAKES US DIFFERENT?
          ========================================= */}
      <section className="different-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Our Advantage</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="about-section-heading">
              Designed Around Clarity, Transparency and Trust
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="about-section-sub max-w-700">
                Modern digital convenience backed by verified legal rigor.
              </p>
            </ScrollReveal>
          </div>

          <div className="different-grid">
            <ScrollReveal animation="fadeUp" delay={0.06} className="diff-card">
              <div className="diff-icon-box">
                <Workflow size={24} />
              </div>
              <h3 className="diff-card-title">Structured Verification Process</h3>
              <p className="diff-card-desc">
                Every request follows a defined workflow, from initial submission and document collection to review and report delivery.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.12} className="diff-card">
              <div className="diff-icon-box">
                <Receipt size={24} />
              </div>
              <h3 className="diff-card-title">Case-Specific Quotations</h3>
              <p className="diff-card-desc">
                Customers receive a quotation based on their property's requirements and the scope of verification before proceeding with payment.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.18} className="diff-card">
              <div className="diff-icon-box">
                <UserCheck size={24} />
              </div>
              <h3 className="diff-card-title">Professional Legal Review</h3>
              <p className="diff-card-desc">
                Where included in the selected service, cases can be assigned to advocates for the relevant document review and legal assessment.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.24} className="diff-card">
              <div className="diff-icon-box">
                <FileCheck2 size={24} />
              </div>
              <h3 className="diff-card-title">Organised Digital Reports</h3>
              <p className="diff-card-desc">
                Customers can access reports and case updates through the platform, subject to the review and approval workflow.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          6. OUR VERIFICATION JOURNEY
          ========================================= */}
      <section className="journey-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Verification Journey</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="about-section-heading">
              Simple Steps. Better-Informed Decisions.
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="about-section-sub max-w-700">
                A transparent 5-step journey to full document clarity.
              </p>
            </ScrollReveal>
          </div>

          <div className="journey-grid">
            {[
              { num: 1, title: 'Submit Your Request', desc: 'Share the property type, location, and verification requirements.' },
              { num: 2, title: 'Upload Your Documents', desc: 'Provide the relevant records required for the requested service.' },
              { num: 3, title: 'Review Your Quotation', desc: 'Receive a case-specific quotation and confirm the service before payment.' },
              { num: 4, title: 'Verification & Legal Review', desc: 'The case proceeds through the applicable document checks and professional review.' },
              { num: 5, title: 'Receive Your Report', desc: 'Access the completed report after the required review and approval steps.' }
            ].map((step, idx) => (
              <ScrollReveal key={step.num} animation="fadeUp" delay={idx * 0.08} className="journey-step">
                <div className="journey-num-badge">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          7. WHO WE SERVE
          ========================================= */}
      <section className="who-serve-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Client Profiles</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="about-section-heading">
              Who We Serve
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="about-section-sub max-w-700">
                Specialized legal verification tailored for every real estate stakeholder.
              </p>
            </ScrollReveal>
          </div>

          <div className="who-serve-grid">
            <ScrollReveal animation="fadeUp" delay={0.06} className="serve-card">
              <div className="serve-icon-box">
                <Home size={26} />
              </div>
              <h3 className="serve-title">Home Buyers</h3>
              <p className="serve-desc">
                Understand relevant property documents, sanctions, and clearances before purchasing your home.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.12} className="serve-card">
              <div className="serve-icon-box">
                <TrendingUp size={26} />
              </div>
              <h3 className="serve-title">Property Investors</h3>
              <p className="serve-desc">
                Assess documentation, commercial titles, and potential concerns before making investment decisions.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.18} className="serve-card">
              <div className="serve-icon-box">
                <Map size={26} />
              </div>
              <h3 className="serve-title">Land and Plot Buyers</h3>
              <p className="serve-desc">
                Request relevant checks for land records, revenue classifications, and layout approvals.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.24} className="serve-card">
              <div className="serve-icon-box">
                <FileText size={26} />
              </div>
              <h3 className="serve-title">Property Owners</h3>
              <p className="serve-desc">
                Organise and review relevant property documents to ensure clean records for your specific requirements.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          8. OUR COMMITMENT TO CUSTOMERS
          ========================================= */}
      <section className="commitment-section">
        <div className="container">
          <ScrollReveal animation="scaleUp" className="commitment-card">
            <div className="commitment-inner">
              <span className="section-badge section-badge-dark">Client Promise</span>
              <h2 className="commitment-title">
                Your Property. Your Confidence. Our Commitment.
              </h2>
              <p className="commitment-desc">
                We believe customers deserve a clear understanding of the service they request, the documents being reviewed, the applicable charges, and the findings provided.
              </p>
              <p className="commitment-sub">
                Property Suraksha is committed to building a transparent customer experience through clear communication, organised case management, responsible document handling, and access to reports within the agreed scope of work.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          9. FINAL CALL TO ACTION (CTA)
          ========================================= */}
      <section className="about-cta-section">
        <div className="container">
          <ScrollReveal animation="maskReveal" className="about-cta-banner">
            <div className="about-cta-overlay"></div>
            <img 
              src={cityBannerImg} 
              alt="City Skyline Verification" 
              className="about-cta-bg" 
            />
            <div className="about-cta-content">
              <UnravelHeading as="h2" className="about-cta-title">
                Take the First Step Towards a More Informed Property Decision.
              </UnravelHeading>
              <p className="about-cta-desc">
                Start your verification request and understand the checks relevant to your property.
              </p>
              <div className="about-cta-buttons">
                <MagneticButton strength={15}>
                  <Link to="/get-started" className="btn-gold">
                    <span>Start Verification</span>
                    <ArrowRight size={18} />
                  </Link>
                </MagneticButton>
                <Link to="/contact" className="btn-white-outline">
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          10. LEGAL DISCLAIMER
          ========================================= */}
      <section className="about-disclaimer-section">
        <div className="container">
          <div className="about-disclaimer-box">
            <AlertTriangle size={20} className="disclaimer-alert-icon" />
            <p>
              <strong>Legal Disclaimer:</strong> Property Suraksha facilitates property verification and related review services according to the scope agreed for each case. Verification is based on the documents, information, records, and checks available or accessible for the engagement. It does not guarantee title, ownership, legal compliance, or the absence of undiscovered disputes, liabilities, fraud, or other risks. Customers should obtain independent professional advice where appropriate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
