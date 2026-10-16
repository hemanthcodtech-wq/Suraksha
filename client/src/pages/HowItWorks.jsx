import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Receipt, 
  CreditCard, 
  FileSearch, 
  CheckCircle2, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Scale,
  UserCheck,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import howItWorksHeroImg from '../assets/how-it-works-hero.jpg';
import cityBannerImg from '../assets/city-banner.jpg';
import { luxuryEasing, unravelContainer, unravelItem, fadeUpVariant } from '../components/animation/motionVariants';
import ScrollReveal, { UnravelHeading } from '../components/animation/ScrollReveal';
import MagneticButton from '../components/animation/MagneticButton';
import './HowItWorks.css';

export const HowItWorks = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      num: '01',
      title: 'Submit Your Verification Request',
      subtitle: 'Tell us what property you want to verify and which service you need.',
      icon: FileText,
      pointsHeader: 'Information you provide:',
      points: [
        'Property type: land, plot, apartment, villa, or other',
        'Property location and available details',
        'Your verification requirements',
        'Contact information for updates'
      ],
      outcome: 'Your request is submitted for initial review.'
    },
    {
      num: '02',
      title: 'Upload Your Property Documents',
      subtitle: 'Provide the documents relevant to your requested verification. The team may request additional records depending on the case.',
      icon: Upload,
      pointsHeader: 'Documents may include:',
      points: [
        'Sale deed or title documents',
        'Encumbrance Certificate (EC), where relevant',
        'Approved plans and project approvals, where applicable',
        'Property tax receipts and survey records',
        'Other supporting documents'
      ],
      outcome: 'Your submitted documents are organised for assessment.'
    },
    {
      num: '03',
      title: 'Receive Your Custom Quotation',
      subtitle: 'Our admin team reviews your requirements and prepares a quotation based on the proposed scope of work.',
      icon: Receipt,
      pointsHeader: 'Your quotation should explain:',
      points: [
        'Services and checks included',
        'Applicable professional fees',
        'Additional charges, if any',
        'Estimated completion timeline',
        'Important scope limitations'
      ],
      extraNote: 'Review and accept the quotation before proceeding to payment.',
      outcome: 'You understand the proposed service and cost before confirming.'
    },
    {
      num: '04',
      title: 'Confirm Your Service and Payment',
      subtitle: 'Once you approve the quotation, complete the applicable platform payment through the available payment gateway.',
      icon: CreditCard,
      pointsHeader: 'Payment confirmation process:',
      points: [
        'Review the final amount before paying',
        'Receive a payment confirmation or receipt',
        'View the payment status in your customer dashboard'
      ],
      outcome: 'Your case can proceed according to the confirmed service terms and payment status.'
    },
    {
      num: '05',
      title: 'Property Document Verification',
      subtitle: 'Your case moves into the verification workflow. Depending on the service, it may be assigned to an advocate for professional review.',
      icon: FileSearch,
      pointsHeader: 'The review may involve:',
      points: [
        'Examining the submitted documents',
        'Reviewing relevant records where accessible',
        'Identifying inconsistencies or missing information',
        'Requesting clarification or additional documents'
      ],
      outcome: 'Findings are prepared within the agreed scope of verification.'
    },
    {
      num: '06',
      title: 'Report Review and Approval',
      subtitle: 'The completed report goes through the applicable review and approval process before it is released to you.',
      icon: CheckCircle2,
      pointsHeader: 'Depending on your service, it may include:',
      points: [
        'Documents examined',
        'Findings and observations',
        'Identified discrepancies or outstanding checks',
        'Recommendations for further review, where appropriate'
      ],
      outcome: 'The report becomes available after the required approval.'
    },
    {
      num: '07',
      title: 'Access Your Verification Report',
      subtitle: 'Log in to your account to view the latest case status and access your approved report.',
      icon: Download,
      pointsHeader: 'Deliverable steps:',
      points: [
        'Download the available report',
        'Review the findings and limitations',
        'Contact support if you need clarification about the process'
      ],
      outcome: 'You receive the documented findings for your property verification request.'
    }
  ];

  const docTable = [
    {
      type: 'Land or plot',
      docs: 'Title or sale deeds, EC, survey records, land records'
    },
    {
      type: 'Apartment or villa',
      docs: 'Sale deed, allotment or sale agreement, applicable approvals'
    },
    {
      type: 'Builder or project',
      docs: 'Company details, project approvals and available registration records'
    },
    {
      type: 'General document review',
      docs: 'The specific deeds, agreements, receipts or records you want reviewed'
    }
  ];

  const faqs = [
    {
      q: 'Can I submit a request without having every document?',
      a: 'You can submit an initial request with the information you have. The team can then identify which additional documents may be needed before confirming the scope.'
    },
    {
      q: 'When will I know the price?',
      a: 'After the admin team assesses your request, you will receive a custom quotation for review before payment.'
    },
    {
      q: 'Can I track the progress of my case?',
      a: 'The planned customer dashboard will display available case updates, such as quotation, payment, review, and report status.'
    },
    {
      q: 'What happens if additional documents are required?',
      a: 'You may be asked to provide further information or records. The impact on cost or timeline should be communicated where it changes the agreed scope.'
    },
    {
      q: 'Will the report guarantee that the property has no legal issues?',
      a: 'No. The report records findings from the checks performed within the agreed scope. Some risks may not be discoverable from available records or documents.'
    }
  ];

  return (
    <div className="how-it-works-page">
      {/* =========================================
          1. HERO SECTION
          ========================================= */}
      <section className="how-hero-section">
        <div className="how-hero-backdrop">
          <div className="how-hero-overlay"></div>
          <motion.img 
            src={howItWorksHeroImg} 
            alt="Legal Real Estate Verification Desk" 
            className="how-hero-bg"
            initial={{ scale: 1.06, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: luxuryEasing }}
          />
        </div>

        <div className="container how-hero-container">
          <motion.div 
            className="how-hero-content"
            variants={unravelContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeUpVariant} className="section-badge section-badge-dark">
              HOW IT WORKS
            </motion.span>
            
            <div style={{ overflow: 'hidden', margin: '0.9rem 0 1.2rem' }}>
              <motion.h1 variants={unravelItem} className="how-hero-title">
                Property Verification, Made Simple.
              </motion.h1>
            </div>

            <motion.p variants={fadeUpVariant} className="how-hero-desc">
              Buying land, an apartment, or a house is a significant decision. Property Suraksha helps you follow a clear process to submit your property details, arrange relevant document checks, and receive a verification report based on the agreed scope.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="how-hero-buttons">
              <MagneticButton strength={15}>
                <Link to="/get-started" className="btn-gold">
                  <span>Start Verification</span>
                  <ArrowRight size={18} />
                </Link>
              </MagneticButton>
              <Link to="/services" className="btn-white-outline">
                <span>Explore Services</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. THE COMPLETE 7-STEP VERIFICATION PROCESS (Vertical Timeline)
          ========================================= */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Step-by-Step Flow</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="how-section-heading">
              From Your First Request to Your Final Report
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="how-section-sub max-w-700">
                Our step-by-step workflow helps you understand what happens at every stage, from submitting your property information to accessing your completed report.
              </p>
            </ScrollReveal>
          </div>

          <div className="vertical-timeline">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal 
                  key={index} 
                  animation="fadeUp" 
                  delay={index * 0.08}
                  className="timeline-node"
                >
                  {/* Left Column: Number & Icon */}
                  <div className="timeline-indicator">
                    <motion.div 
                      className="timeline-num-circle"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>{step.num}</span>
                    </motion.div>
                    {index < steps.length - 1 && <div className="timeline-connector-line"></div>}
                  </div>

                  {/* Right Column: Card Content */}
                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <div className="timeline-card-icon-box">
                        <Icon size={22} />
                      </div>
                      <div>
                        <span className="timeline-step-label">STEP {step.num}</span>
                        <h3 className="timeline-step-title">{step.title}</h3>
                      </div>
                    </div>

                    <p className="timeline-step-desc">{step.subtitle}</p>

                    <div className="timeline-points-box">
                      <strong>{step.pointsHeader}</strong>
                      <ul>
                        {step.points.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                      {step.extraNote && (
                        <p className="timeline-extra-note">{step.extraNote}</p>
                      )}
                    </div>

                    <div className="timeline-outcome-badge">
                      <CheckCircle2 size={16} className="outcome-icon" />
                      <span><strong>Outcome:</strong> {step.outcome}</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          3. TRACK YOUR REQUEST ONLINE
          ========================================= */}
      <section className="track-online-section">
        <div className="container">
          <ScrollReveal animation="fadeUp" className="track-online-card">
            <div className="track-online-text">
              <span className="section-badge section-badge-dark">Client Portal</span>
              <h2 className="track-online-heading">Stay Informed at Every Stage</h2>
              <p className="track-online-desc">
                Your customer dashboard is designed to give you a central place to follow your request without having to manage every update manually.
              </p>
              
              <div className="track-features-list">
                <div className="track-feature">
                  <Monitor size={18} className="track-feat-icon" />
                  <span>View your submitted requests.</span>
                </div>
                <div className="track-feature">
                  <Receipt size={18} className="track-feat-icon" />
                  <span>Check quotation and payment status.</span>
                </div>
                <div className="track-feature">
                  <FileSearch size={18} className="track-feat-icon" />
                  <span>See case progress and requests for additional documents.</span>
                </div>
                <div className="track-feature">
                  <Download size={18} className="track-feat-icon" />
                  <span>Access completed reports when approved.</span>
                </div>
                <div className="track-feature">
                  <UserCheck size={18} className="track-feat-icon" />
                  <span>Contact the support team when assistance is needed.</span>
                </div>
              </div>

              <MagneticButton strength={12}>
                <Link to="/login" className="btn-gold track-cta-btn">
                  <span>Access Customer Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              </MagneticButton>
            </div>

            <div className="track-online-preview">
              <div className="dashboard-mini-window">
                <div className="mini-window-bar">
                  <span className="window-dot dot-red"></span>
                  <span className="window-dot dot-yellow"></span>
                  <span className="window-dot dot-green"></span>
                  <span className="window-title">Property Suraksha Case Tracker</span>
                </div>
                <div className="mini-window-body">
                  <div className="mini-case-pill">Case #PS-7104 • Apartment Verification</div>
                  <div className="mini-status-row">
                    <span className="mini-status-text">Status: Advocate Scrutiny in Progress</span>
                    <span className="mini-progress-pct">75% Complete</span>
                  </div>
                  <div className="mini-progress-bar">
                    <motion.div 
                      className="mini-progress-fill"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '75%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: luxuryEasing }}
                    />
                  </div>
                  <div className="mini-file-tag">
                    <FolderOpen size={14} />
                    <span>3 Documents Reviewed & Cleared</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          4. DOCUMENTS YOU MAY NEED
          ========================================= */}
      <section className="docs-needed-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Checklist Guidance</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="how-section-heading">
              Prepare Your Documents Before You Begin
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="how-section-sub max-w-700">
                The documents required depend on the property type, location, transaction, and scope of verification.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fadeUp" delay={0.1} className="docs-table-wrapper">
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Property Type</th>
                  <th>Examples of Relevant Documents</th>
                </tr>
              </thead>
              <tbody>
                {docTable.map((row, idx) => (
                  <tr key={idx}>
                    <td className="doc-type-cell">
                      <strong>{row.type}</strong>
                    </td>
                    <td className="doc-names-cell">{row.docs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollReveal>

          <p className="table-bottom-disclaimer">
            These are examples, not a universal checklist. The team should confirm the requirements for your specific case.
          </p>
        </div>
      </section>

      {/* =========================================
          5. HOW LONG DOES IT TAKE?
          ========================================= */}
      <section className="timeline-info-section">
        <div className="container">
          <ScrollReveal animation="fadeUp" className="timeline-info-box">
            <Clock size={40} className="timeline-clock-icon" />
            <div>
              <h3 className="timeline-info-title">A Clear Timeline Based on Your Case</h3>
              <p className="timeline-info-desc">
                Verification timelines depend on document completeness, property complexity, access to relevant records, and the extent of professional review required.
              </p>
              <p className="timeline-info-sub">
                Once your request has been assessed, your quotation should include an estimated timeline where possible. If additional documents or checks are needed, the expected completion date may change.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          6. WHY CHOOSE PROPERTY SURAKSHA?
          ========================================= */}
      <section className="why-how-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Core Advantages</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="how-section-heading">
              Why Choose Property Suraksha?
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="how-section-sub max-w-700">
                Engineered to eliminate uncertainty with predictable, professional workflows.
              </p>
            </ScrollReveal>
          </div>

          <div className="why-how-grid">
            <ScrollReveal animation="fadeUp" delay={0.05} className="why-how-card">
              <div className="why-how-icon"><ShieldCheck size={26} /></div>
              <h4>Defined Workflow</h4>
              <p>Follow a clear process from request to report.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.10} className="why-how-card">
              <div className="why-how-icon"><Receipt size={26} /></div>
              <h4>Custom Quotations</h4>
              <p>Understand the proposed scope and charges before paying.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.15} className="why-how-card">
              <div className="why-how-icon"><Scale size={26} /></div>
              <h4>Professional Review</h4>
              <p>Advocate involvement when included in your selected service.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.20} className="why-how-card">
              <div className="why-how-icon"><Monitor size={26} /></div>
              <h4>Digital Access</h4>
              <p>Manage your requests and access available reports through your account.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          7. FREQUENTLY ASKED QUESTIONS
          ========================================= */}
      <section className="how-faq-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Helpful Answers</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="how-section-heading">
              Frequently Asked Questions
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="how-section-sub max-w-700">
                Answers regarding requests, quotations, progress monitoring, and report scopes.
              </p>
            </ScrollReveal>
          </div>

          <div className="how-faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`how-faq-item ${openFaq === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="how-faq-q">
                  <span>{faq.q}</span>
                  <motion.div 
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: luxuryEasing }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      className="how-faq-a"
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
        </div>
      </section>

      {/* =========================================
          8. FINAL CALL TO ACTION (CTA)
          ========================================= */}
      <section className="how-cta-section">
        <div className="container">
          <ScrollReveal animation="maskReveal" className="how-cta-card">
            <div className="how-cta-overlay"></div>
            <img 
              src={cityBannerImg} 
              alt="City Skyline Verification" 
              className="how-cta-bg" 
            />
            <div className="how-cta-content">
              <span className="section-badge section-badge-dark">Start Today</span>
              <UnravelHeading as="h2" className="how-cta-title">
                Your Property Journey Starts with Verification.
              </UnravelHeading>
              <p className="how-cta-desc">
                Tell us about your property, receive a tailored quotation, and understand the relevant checks before you commit.
              </p>
              <div className="how-cta-buttons">
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

      {/* IMPORTANT DISCLAIMER */}
      <section className="how-disclaimer-section">
        <div className="container">
          <div className="how-disclaimer-box">
            <AlertTriangle size={20} className="how-alert-icon" />
            <p>
              <strong>Important Disclaimer:</strong> Property verification supports informed decision-making but does not guarantee legal ownership, clear title, regulatory compliance, or the absence of every dispute or risk. The scope, findings, and limitations of each service should be clearly stated in the quotation and final report.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
