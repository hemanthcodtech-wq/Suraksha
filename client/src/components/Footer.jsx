import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top-accent"></div>
      
      <div className="container footer-container">
        {/* Brand Col: Logo and short brand description */}
        <div className="footer-col footer-col-brand">
          <Link to="/" className="footer-logo-link">
            <Logo size="normal" />
          </Link>
          <p className="footer-brand-desc">
            PROPERTY SURAKSHA is India's premier property legal verification platform. We empower buyers and investors with expert advocate due diligence, 30-year title checks, and structured risk assessment reports.
          </p>
          <div className="footer-trust-badge">
            <ShieldCheck size={18} className="trust-icon" />
            <span>Advocate-Assisted Legal Scrutiny</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/advocate-policy">Advocate Engagement Policy</Link></li>
            <li><Link to="/login">Client Portal Login</Link></li>
          </ul>
        </div>

        {/* Verification Services */}
        <div className="footer-col">
          <h4 className="footer-title">Verification Services</h4>
          <ul className="footer-links">
            <li><Link to="/services#builder">Builder & Real-Estate Verification</Link></li>
            <li><Link to="/services#land">Land & Plot Verification</Link></li>
            <li><Link to="/services#apartment">Apartment & Villa Verification</Link></li>
            <li><Link to="/services#document">Property Document Review</Link></li>
            <li><Link to="/services#due-diligence">Legal Due Diligence</Link></li>
          </ul>
        </div>

        {/* Contact details and support */}
        <div className="footer-col">
          <h4 className="footer-title">Contact & Support</h4>
          <ul className="footer-contact-list">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Legal Tech Park, Financial District, Hyderabad, India</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+91 98765 43210 / Toll-Free: 1800-SURAKSHA</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>support@propertysuraksha.com</span>
            </li>
          </ul>
          <div style={{ marginTop: '0.8rem' }}>
            <Link to="/get-started" className="footer-cta-btn">
              <span>Start Verification</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Policies, Disclaimer and Copyright */}
      <div className="footer-middle-disclaimer">
        <div className="container">
          <div className="disclaimer-content">
            <AlertTriangle size={16} className="disclaimer-icon" />
            <p>
              <strong>Legal Disclaimer:</strong> Property Suraksha provides legal opinion reports and documentation verification conducted by independent advocates. Verification findings support informed decisions but do not constitute an absolute guarantee of title or indemnity against future undisclosed third-party statutory disputes.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} PROPERTY SURAKSHA. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="dot">•</span>
            <Link to="/terms">Terms & Conditions</Link>
            <span className="dot">•</span>
            <Link to="/refund">Refund & Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
