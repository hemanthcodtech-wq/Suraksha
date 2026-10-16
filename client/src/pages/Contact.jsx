import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  FileSearch, 
  Receipt, 
  Headphones, 
  Laptop, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight 
} from 'lucide-react';
import contactHeroImg from '../assets/contact-hero.jpg';
import cityBannerImg from '../assets/city-banner.jpg';
import { luxuryEasing, unravelContainer, unravelItem, fadeUpVariant } from '../components/animation/motionVariants';
import ScrollReveal, { UnravelHeading } from '../components/animation/ScrollReveal';
import MagneticButton from '../components/animation/MagneticButton';
import './Contact.css';

export const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enquiryType: 'Property Verification',
    propertyType: 'Apartment / Villa',
    message: ''
  });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const contactFaqs = [
    {
      q: 'How do I request property verification?',
      a: 'Select a service, submit your property details, and upload the required documents through the designated request process. The team will review your requirements and provide a quotation.'
    },
    {
      q: 'Can I ask for a quotation before making payment?',
      a: 'Yes. The intended process is to provide a case-specific quotation for your review before payment.'
    },
    {
      q: 'How can I check the status of my request?',
      a: 'Log in to your customer dashboard to view available case updates. For additional assistance, contact the team and provide your request reference number.'
    },
    {
      q: 'Can I send my property documents through the contact form?',
      a: 'For your privacy, do not attach sensitive documents through a general enquiry form. Use the designated document-upload feature in the secure customer portal once available.'
    },
    {
      q: 'When will I receive a response?',
      a: 'Our legal support team typically responds within 2 to 4 business hours during working days. Response times may vary based on enquiry volume and the complexity of your request.'
    }
  ];

  return (
    <div className="contact-page">
      {/* =========================================
          1. HERO SECTION
          ========================================= */}
      <section className="contact-hero-section">
        <div className="contact-hero-backdrop">
          <div className="contact-hero-overlay"></div>
          <motion.img 
            src={contactHeroImg} 
            alt="City Skyline Twilight Contact Us" 
            className="contact-hero-bg"
            initial={{ scale: 1.06, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: luxuryEasing }}
          />
        </div>

        <div className="container contact-hero-container">
          <motion.div 
            className="contact-hero-content"
            variants={unravelContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeUpVariant} className="section-badge section-badge-dark">
              CONTACT PROPERTY SURAKSHA
            </motion.span>
            
            <div style={{ overflow: 'hidden', margin: '0.9rem 0 1.2rem' }}>
              <motion.h1 variants={unravelItem} className="contact-hero-title">
                We're Here to Help You Make Informed Property Decisions.
              </motion.h1>
            </div>

            <motion.p variants={fadeUpVariant} className="contact-hero-desc">
              Have questions about property verification, document requirements, quotations, or an existing request? Our team is here to guide you through the process.
            </motion.p>
            <motion.p variants={fadeUpVariant} className="contact-hero-sub-prompt">
              Connect with us to understand the next steps for your property verification.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2 & 3. TWO-COLUMN LAYOUT: CONTACT INFO + ENQUIRY FORM
          ========================================= */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-two-col-grid">
            {/* Left Column: Contact Information */}
            <div className="contact-info-col">
              <ScrollReveal animation="fadeUp">
                <span className="section-badge">Get in Touch</span>
              </ScrollReveal>
              <UnravelHeading as="h2" className="contact-section-heading">
                Let's Start a Conversation
              </UnravelHeading>
              <ScrollReveal animation="fadeUp" delay={0.15}>
                <p className="contact-section-desc">
                  Choose the most convenient way to reach us. Whether you're planning a property purchase or need an update on an existing case, we're happy to assist.
                </p>
              </ScrollReveal>

              <div className="contact-channels-list">
                {/* Call Us */}
                <ScrollReveal animation="fadeUp" delay={0.06} className="contact-channel-card">
                  <div className="channel-icon-box">
                    <Phone size={22} />
                  </div>
                  <div className="channel-text">
                    <h4>Call Us</h4>
                    <p>Speak to our team about your verification requirements.</p>
                    <a href="tel:+919876543210" className="channel-link">+91 98765 43210 / 1800-SURAKSHA</a>
                  </div>
                </ScrollReveal>

                {/* Email Us */}
                <ScrollReveal animation="fadeUp" delay={0.12} className="contact-channel-card">
                  <div className="channel-icon-box">
                    <Mail size={22} />
                  </div>
                  <div className="channel-text">
                    <h4>Email Us</h4>
                    <p>Send your enquiries, questions, or service requests.</p>
                    <a href="mailto:support@propertysuraksha.com" className="channel-link">support@propertysuraksha.com</a>
                  </div>
                </ScrollReveal>

                {/* WhatsApp Support */}
                <ScrollReveal animation="fadeUp" delay={0.18} className="contact-channel-card">
                  <div className="channel-icon-box">
                    <MessageSquare size={22} />
                  </div>
                  <div className="channel-text">
                    <h4>WhatsApp Support</h4>
                    <p>Reach out for general enquiries and assistance with your request.</p>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="channel-link">+91 98765 43210 (WhatsApp)</a>
                  </div>
                </ScrollReveal>

                {/* Support Hours */}
                <ScrollReveal animation="fadeUp" delay={0.24} className="contact-channel-card">
                  <div className="channel-icon-box">
                    <Clock size={22} />
                  </div>
                  <div className="channel-text">
                    <h4>Support Hours</h4>
                    <p>Our team will assist you during the published business hours.</p>
                    <span className="channel-time-highlight">Monday – Saturday: 9:00 AM – 7:00 PM IST</span>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact-form-col">
              <ScrollReveal animation="scaleUp" className="contact-form-card">
                {formSubmitted ? (
                  <motion.div 
                    className="form-success-box"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: luxuryEasing }}
                  >
                    <CheckCircle2 size={54} className="form-success-icon" />
                    <h3>Enquiry Submitted Successfully!</h3>
                    <p>
                      Thank you for contacting Property Suraksha. Our legal support coordinator will review your request and get in touch with you shortly.
                    </p>
                    <button 
                      onClick={() => setFormSubmitted(false)} 
                      className="btn-gold"
                    >
                      Submit Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-enquiry-form">
                    <h3 className="form-card-title">Send Us an Enquiry</h3>
                    <p className="form-card-subtitle">
                      Fill in the details below and our team can follow up regarding your enquiry.
                    </p>

                    <div className="form-field">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="Enter your full name" 
                        required 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-field">
                        <label>Email Address *</label>
                        <input 
                          type="email" 
                          placeholder="name@example.com" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>

                      <div className="form-field">
                        <label>Phone Number *</label>
                        <input 
                          type="tel" 
                          placeholder="+91 98765 43210" 
                          required 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-field">
                        <label>Enquiry Type</label>
                        <select 
                          value={formData.enquiryType}
                          onChange={(e) => setFormData({...formData, enquiryType: e.target.value})}
                        >
                          <option value="Property Verification">Property Verification</option>
                          <option value="Quotation and Pricing">Quotation and Pricing</option>
                          <option value="Existing Case Status">Existing Case Status</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Other Enquiry">Other Enquiry</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Property Type</label>
                        <select 
                          value={formData.propertyType}
                          onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                        >
                          <option value="Land / Plot">Land / Plot</option>
                          <option value="Apartment / Villa">Apartment / Villa</option>
                          <option value="Commercial Property">Commercial Property</option>
                          <option value="Other / Not Applicable">Other / Not Applicable</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Your Message *</label>
                      <textarea 
                        rows={4} 
                        placeholder="How can we assist you with your property verification enquiry?" 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                    </div>

                    <div className="form-preview-notice">
                      <AlertTriangle size={16} className="notice-icon" />
                      <span>Avoid submitting sensitive property documents through a general contact form. Use the customer dashboard for file uploads.</span>
                    </div>

                    <MagneticButton strength={12}>
                      <button type="submit" className="btn-gold form-submit-btn">
                        <span>Prepare Enquiry</span>
                        <Send size={16} />
                      </button>
                    </MagneticButton>
                  </form>
                )}
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          4. HOW CAN WE HELP YOU?
          ========================================= */}
      <section className="how-help-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Service Channels</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="contact-section-heading">
              The Right Support for Your Needs
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="contact-section-sub max-w-700">
                Direct assistance across every stage of your property verification lifecycle.
              </p>
            </ScrollReveal>
          </div>

          <div className="how-help-grid">
            <ScrollReveal animation="fadeUp" delay={0.06} className="how-help-card">
              <div className="help-icon-box"><FileSearch size={24} /></div>
              <h4>New Verification Enquiries</h4>
              <p>Tell us about your property and the type of verification you need. We'll guide you through the request process.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.12} className="how-help-card">
              <div className="help-icon-box"><Receipt size={24} /></div>
              <h4>Quotation and Payments</h4>
              <p>Get clarification about your quotation, payment status, receipts, or applicable charges.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.18} className="how-help-card">
              <div className="help-icon-box"><Headphones size={24} /></div>
              <h4>Existing Verification Requests</h4>
              <p>Contact us about your case progress, additional document requests, or report availability.</p>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.24} className="how-help-card">
              <div className="help-icon-box"><Laptop size={24} /></div>
              <h4>Technical Support</h4>
              <p>Need help accessing your account or using the customer dashboard? Tell us what issue you're experiencing.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================
          5. FREQUENTLY ASKED QUESTIONS
          ========================================= */}
      <section className="contact-faq-section">
        <div className="container">
          <div className="section-header text-center">
            <ScrollReveal animation="fadeUp">
              <span className="section-badge">Quick Answers</span>
            </ScrollReveal>
            <UnravelHeading as="h2" className="contact-section-heading">
              Frequently Asked Questions
            </UnravelHeading>
            <ScrollReveal animation="fadeUp" delay={0.15}>
              <p className="contact-section-sub max-w-700">
                Common questions regarding submissions, quotations, report statuses, and privacy.
              </p>
            </ScrollReveal>
          </div>

          <div className="contact-faq-list">
            {contactFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`contact-faq-item ${openFaq === index ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="contact-faq-q">
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
                      className="contact-faq-a"
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
          6. LOCATION SECTION
          ========================================= */}
      <section className="location-section">
        <div className="container">
          <ScrollReveal animation="scaleUp" className="location-card">
            <div className="location-text">
              <span className="section-badge section-badge-dark">Office & Service Location</span>
              <h2 className="location-title">Connect With Property Suraksha</h2>
              <p className="location-desc">
                We aim to make property verification more accessible through a clear digital process and responsive customer support.
              </p>
              
              <div className="location-detail-box">
                <MapPin size={24} className="location-pin-icon" />
                <div>
                  <strong>Our Office / Service Location</strong>
                  <p>Level 4, Legal Tech Tower, Financial District, Nanakramguda, Hyderabad, Telangana — 500032, India</p>
                </div>
              </div>
            </div>

            <div className="location-map-visual">
              <div className="map-embed-mock">
                <div className="map-header-tag">
                  <MapPin size={16} />
                  <span>Property Suraksha Headquarters — Hyderabad</span>
                </div>
                <div className="map-bg-pattern">
                  <div className="radar-circle"></div>
                  <div className="pin-marker">
                    <MapPin size={28} className="pin-gold" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================
          7. FINAL CALL TO ACTION (CTA)
          ========================================= */}
      <section className="contact-cta-section">
        <div className="container">
          <ScrollReveal animation="maskReveal" className="contact-cta-card">
            <div className="contact-cta-overlay"></div>
            <img 
              src={cityBannerImg} 
              alt="City Skyline Property Suraksha" 
              className="contact-cta-bg" 
            />
            <div className="contact-cta-content">
              <span className="section-badge section-badge-dark">Clarity First</span>
              <UnravelHeading as="h2" className="contact-cta-title">
                Every Property Question Deserves Clarity.
              </UnravelHeading>
              <p className="contact-cta-desc">
                Reach out to Property Suraksha and take the next step towards a more informed property decision.
              </p>
              <div className="contact-cta-buttons">
                <MagneticButton strength={15}>
                  <Link to="/get-started" className="btn-gold">
                    <span>Start Verification</span>
                    <ArrowRight size={18} />
                  </Link>
                </MagneticButton>
                <Link to="/services" className="btn-white-outline">
                  <span>Explore Services</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Contact;
