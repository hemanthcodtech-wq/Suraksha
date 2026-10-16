import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Map, 
  Home as HomeIcon, 
  FileText, 
  Scale, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Receipt,
  Search,
  UserCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import servicesHeroImg from '../assets/services-hero.jpg';
import builderImg from '../assets/service-builder.jpg';
import landImg from '../assets/service-land.jpg';
import villaImg from '../assets/hero-villa.jpg';
import legalImg from '../assets/about-legal-hero.jpg';
import cityBannerImg from '../assets/city-banner.jpg';
import { luxuryEasing, unravelContainer, unravelItem, fadeUpVariant } from '../components/animation/motionVariants';
import ScrollReveal, { UnravelHeading } from '../components/animation/ScrollReveal';
import MagneticButton from '../components/animation/MagneticButton';
import './Services.css';

export const Services = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const servicesData = [
    {
      id: 'builder',
      num: '01',
      title: 'Builder & Real Estate Company Verification',
      tagline: 'Review relevant company and project documentation to help you understand the available records before making a property-related commitment.',
      image: builderImg,
      points: [
        'Company and registration documents',
        'Relevant project approvals and records',
        'Available supporting documentation',
        'Identification of missing information for further review'
      ],
      ctaText: 'Request Builder Verification →'
    },
    {
      id: 'land',
      num: '02',
      title: 'Land & Plot Verification',
      tagline: 'Request checks relating to land documentation and relevant records to help assess potential discrepancies or issues requiring further investigation.',
      image: landImg,
      points: [
        'Available title and ownership documents',
        'Relevant land and survey records',
        'Encumbrance-related records, where accessible',
        'Supporting approvals and documentation'
      ],
      ctaText: 'Request Land Verification →'
    },
    {
      id: 'apartment',
      num: '03',
      title: 'Apartment & Villa Verification',
      tagline: 'Review relevant property documents for apartments, villas, and residential units before purchase or investment.',
      image: villaImg,
      points: [
        'Available ownership and title documents',
        'Relevant building and project approvals',
        'Sale deed and agreement review',
        'Applicable property and registration records'
      ],
      ctaText: 'Request Residential Verification →'
    },
    {
      id: 'document',
      num: '04',
      title: 'Property Document Review',
      tagline: 'Get relevant property documents reviewed to understand their contents, consistency, and any apparent gaps within the agreed scope.',
      image: legalImg,
      points: [
        'Sale deeds and sale agreements',
        'Ownership-related records',
        'Property tax receipts and supporting papers',
        'Document consistency and missing-record observations'
      ],
      ctaText: 'Request Document Review →'
    },
    {
      id: 'due-diligence',
      num: '05',
      title: 'Full Legal Due Diligence',
      tagline: 'Request a broader property review based on your transaction, property type, available records, and specific concerns.',
      image: cityBannerImg,
      points: [
        'Review of relevant property documentation',
        'Assessment of identified legal or documentation concerns',
        'Identification of further checks that may be necessary',
        'Written findings and recommendations within the agreed scope'
      ],
      ctaText: 'Request Legal Due Diligence →'
    }
  ];

  const serviceFaqs = [
    {
      q: "What documents do I need to provide?",
      a: "The requirements depend on your property type and selected service. After reviewing your request, the team can identify the relevant documents needed to proceed."
    },
    {
      q: "How much does property verification cost?",
      a: "Pricing is case-specific. You receive a quotation based on your requirements and the proposed scope before payment."
    },
    {
      q: "How long does verification take?",
      a: "The timeline depends on the complexity of the case, document completeness, and availability of relevant records. An estimated timeline should be provided when the scope is confirmed."
    },
    {
      q: "Can I track my verification request?",
      a: "Yes, the planned customer portal allows you to view your request status and access available case updates."
    },
    {
      q: "Does a verification report guarantee that a property is legally safe?",
      a: "No. A report reflects the checks performed and findings identified within its scope. It cannot guarantee that every risk, dispute, defect, or unrecorded claim has been discovered."
    }
  ];

  return (
    <div className="services-page">
      {/* =========================================
          1. HERO SECTION
          ========================================= */}
      <section className="services-hero-section">
        <div className="services-hero-backdrop">
          <div className="services-hero-overlay"></div>
          <motion.img 
            src={servicesHeroImg} 
            alt="Modern Residential Real Estate" 
            className="services-hero-bg"
            initial={{ scale: 1.06, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: luxuryEasing }}
          />
        </div>

        <div className="container services-hero-container">
          <motion.div 
            className="services-hero-content"
            variants={unravelContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeUpVariant} className="section-badge section-badge-dark">
              OUR SERVICES
            </motion.span>
            
            <div style={{ overflow: 'hidden', margin: '0.9rem 0 1.2rem' }}>
              <motion.h1 variants={unravelItem} className="services-hero-title">
                Property Verification.<br />
                Clarity Before Commitment.
              </motion.h1>
            </div>

            <motion.p variants={fadeUpVariant} className="services-hero-desc">
              Make your property decisions with greater confidence. Property Suraksha helps you request relevant document checks and legal review services based on your property's requirements.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="services-hero-buttons">
              <MagneticButton strength={15}>
                <Link to="/get-started" className="btn-gold">
                  <span>Start Verification</span>
                  <ArrowRight size={18} />
                </Link>
              </MagneticButton>
              <Link to="/contact" className="btn-white-outline">
                <span>Contact Our Team</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. EXPLORE OUR SERVICES (5 Visual Cards)
          ========================================= */}
      <section className="services-explore-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Choose the Right Verification Service</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="services-section-heading">
              Verification Solutions for Every Property Journey
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="services-section-sub max-w-700">
                Every property is different. Select the service that best matches your needs, and our team will help identify the relevant documents, checks, and review requirements.
              </p>
            </ScrollReveal>
          </div>

          <div className="services-card-grid">
            {servicesData.map((svc, idx) => (
              <ScrollReveal 
                key={svc.id} 
                id={svc.id} 
                animation="fadeUp" 
                delay={idx * 0.08}
                className="service-visual-card"
              >
                <div className="service-visual-img-wrap">
                  <img src={svc.image} alt={svc.title} className="service-visual-img" />
                  <span className="service-card-num-badge">{svc.num}</span>
                </div>
                
                <div className="service-visual-body">
                  <h3 className="service-visual-title">{svc.title}</h3>
                  <p className="service-visual-desc">{svc.tagline}</p>
                  
                  <ul className="service-points-list">
                    {svc.points.map((pt, i) => (
                      <li key={i}>
                        <Check size={16} className="point-check-icon" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    to={`/get-started?service=${svc.id}`} 
                    className="service-card-action-btn"
                  >
                    <span>{svc.ctaText}</span>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fadeUp" delay={0.2} className="scope-notice-banner">
            <AlertTriangle size={18} className="scope-notice-icon" />
            <p>
              The exact checks available for each service depend on the property, jurisdiction, source records, document availability, and scope agreed for the case.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          3. WHAT IS INCLUDED IN YOUR VERIFICATION?
          ========================================= */}
      <section className="included-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Service Inclusions</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="services-section-heading">
              Clear Scope. Organised Review. Documented Findings.
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="services-section-sub max-w-700">
                Depending on the service selected, your verification process may include:
              </p>
            </ScrollReveal>
          </div>

          <div className="included-grid">
            <ScrollReveal animation="fadeUp" delay={0.06} className="included-card">
              <div className="included-icon-box">
                <FileText size={28} />
              </div>
              <h3 className="included-title">Document Collection</h3>
              <p className="included-desc">
                Upload and organise the documents needed for the requested checks in our secure, encrypted digital vault.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.12} className="included-card">
              <div className="included-icon-box">
                <Search size={28} />
              </div>
              <h3 className="included-title">Document Review</h3>
              <p className="included-desc">
                Examine available records, titles, and layout approvals within the agreed verification scope.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.18} className="included-card">
              <div className="included-icon-box">
                <Scale size={28} />
              </div>
              <h3 className="included-title">Legal Assessment</h3>
              <p className="included-desc">
                Obtain advocate review where included in the selected service, checking for encumbrances and boundary risks.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.24} className="included-card">
              <div className="included-icon-box">
                <ShieldCheck size={28} />
              </div>
              <h3 className="included-title">Verification Report</h3>
              <p className="included-desc">
                Receive documented findings and identified follow-up requirements, subject to the agreed scope.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          4. HOW OUR SERVICE WORKS (5 Steps)
          ========================================= */}
      <section className="service-steps-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Frictionless Workflow</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="services-section-heading">
              From Request to Report in Five Steps
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="services-section-sub max-w-700">
                A structured and transparent process designed for complete legal peace of mind.
              </p>
            </ScrollReveal>
          </div>

          <div className="service-steps-grid">
            {[
              { num: 1, title: 'Choose Your Service', desc: 'Select the property type and verification requirements.' },
              { num: 2, title: 'Submit Property Details', desc: 'Provide the location, property information, and relevant documents.' },
              { num: 3, title: 'Receive Custom Quotation', desc: 'Our team reviews your request and shares the applicable price and scope before payment.' },
              { num: 4, title: 'Verification Begins', desc: 'Once confirmed, the case is assigned for the applicable document checks and legal review.' },
              { num: 5, title: 'Access Your Report', desc: 'Track the case and access the completed report after the required review and approval.' }
            ].map((step, idx) => (
              <ScrollReveal key={step.num} animation="fadeUp" delay={idx * 0.08} className="service-step-item">
                <div className="service-step-number">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          5. TRANSPARENT, CASE-SPECIFIC PRICING
          ========================================= */}
      <section className="pricing-info-section">
        <div className="container">
          <ScrollReveal animation="scaleUp" className="pricing-card-banner">
            <div className="pricing-header">
              <span className="section-badge section-badge-dark">No Hidden Retainers</span>
              <h2 className="pricing-title">
                Every Property Is Different.<br />So Is Every Verification.
              </h2>
              <p className="pricing-desc">
                The cost of verification depends on the property type, complexity, documents available, checks required, and professional review involved.
              </p>
            </div>

            <div className="pricing-steps-checklist">
              <div className="pricing-step-box">
                <span className="pricing-step-badge">Step 1</span>
                <h4>Submit Request</h4>
                <p>Submit your verification request and property details online.</p>
              </div>

              <div className="pricing-step-box">
                <span className="pricing-step-badge">Step 2</span>
                <h4>Receive Custom Quote</h4>
                <p>Receive a custom quotation with the proposed scope and milestones.</p>
              </div>

              <div className="pricing-step-box">
                <span className="pricing-step-badge">Step 3</span>
                <h4>Approve & Confirm</h4>
                <p>Review and approve the quotation before making payment.</p>
              </div>
            </div>

            <p className="pricing-footer-disclaimer">
              Any additional professional fees, government charges, or third-party costs should be disclosed according to the agreed service terms.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          6. WHY CHOOSE PROPERTY SURAKSHA?
          ========================================= */}
      <section className="why-services-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Client Assurance</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="services-section-heading">
              Why Choose Property Suraksha?
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="services-section-sub max-w-700">
                Clear scope, transparent communications, and expert advocate assessment.
              </p>
            </ScrollReveal>
          </div>

          <div className="why-services-grid">
            <ScrollReveal animation="fadeUp" delay={0.05} className="why-svc-card">
              <div className="why-svc-icon"><Scale size={24} /></div>
              <h4>A Structured Process</h4>
              <p>A clear workflow from request submission to report delivery.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.10} className="why-svc-card">
              <div className="why-svc-icon"><Receipt size={24} /></div>
              <h4>Pricing Before Payment</h4>
              <p>Review the quotation and scope before confirming the service.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.15} className="why-svc-card">
              <div className="why-svc-icon"><UserCheck size={24} /></div>
              <h4>Professional Review</h4>
              <p>Advocate involvement where applicable to your chosen service.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.20} className="why-svc-card">
              <div className="why-svc-icon"><ShieldCheck size={24} /></div>
              <h4>Digital Case Tracking</h4>
              <p>Follow case progress and access available reports through your account.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          7. FREQUENTLY ASKED QUESTIONS
          ========================================= */}
      <section className="services-faq-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Common Questions</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="services-section-heading">
              Frequently Asked Questions
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="services-section-sub max-w-700">
                Everything you need to know about our service scopes, pricing models, and report deliverables.
              </p>
            </ScrollReveal>
          </div>

          <div className="services-faq-list">
            {serviceFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`services-faq-item ${openFaq === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="services-faq-q">
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
                      className="services-faq-a"
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
      <section className="services-cta-section">
        <div className="container">
          <ScrollReveal animation="maskReveal" className="services-cta-card">
            <div className="services-cta-overlay"></div>
            <img 
              src={cityBannerImg} 
              alt="City Skyline Property Legal Verification" 
              className="services-cta-bg" 
            />
            <div className="services-cta-content">
              <span className="section-badge section-badge-dark">Get Started</span>
              <UnravelHeading as="h2" className="services-cta-title">
                Before You Invest, Verify.
              </UnravelHeading>
              <p className="services-cta-desc">
                Make your next property decision with better information and a clearer understanding of the relevant documentation.
              </p>
              <div className="services-cta-buttons">
                <MagneticButton strength={15}>
                  <Link to="/get-started" className="btn-gold">
                    <span>Start Verification</span>
                    <ArrowRight size={18} />
                  </Link>
                </MagneticButton>
                <Link to="/contact" className="btn-white-outline">
                  <span>Talk to Our Team</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER DISCLAIMER */}
      <section className="services-disclaimer-strip">
        <div className="container">
          <div className="disclaimer-strip-inner">
            <AlertTriangle size={18} className="strip-alert-icon" />
            <p>
              <strong>Footer Disclaimer:</strong> Property Suraksha provides verification and review services within the scope agreed for each case. Findings depend on available information, accessible records, and checks performed. The service is not a guarantee of ownership, title validity, legal compliance, or the absence of all risks. Advocate services and any applicable third-party or government charges should be explained in the relevant quotation and terms.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
