import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { Menu, X, Phone } from 'lucide-react';
import MagneticButton from './animation/MagneticButton';
import './Header.css';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.header 
      className="navbar-header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container header-container">
        {/* 1. Logo: PROPERTY SURAKSHA */}
        <Link to="/" className="header-brand" aria-label="PROPERTY SURAKSHA">
          <Logo size="normal" />
        </Link>

        {/* 2. Navigation items (Desktop) */}
        <nav className="header-nav" aria-label="Main Navigation">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            About Us
          </NavLink>
          <NavLink 
            to="/services" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            Services
          </NavLink>
          <NavLink 
            to="/how-it-works" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            How It Works
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            Contact Us
          </NavLink>
        </nav>

        {/* 3. Actions: Desktop Helpline + Login + CTA */}
        <div className="header-actions">
          {/* Official Helpline Phone Number (Desktop) */}
          <a href="tel:+917989938718" className="header-phone-link">
            <div className="header-phone-icon-box">
              <Phone size={14} />
            </div>
            <div className="header-phone-text">
              <span className="phone-label">Helpline</span>
              <span className="phone-val">+91 79899 38718</span>
            </div>
          </a>

          {/* Quick Phone Call Pill on Mobile & Tablet */}
          <a href="tel:+917989938718" className="mobile-quick-call-btn" aria-label="Call Helpline">
            <Phone size={15} />
            <span>Call</span>
          </a>

          <Link to="/login" className="btn-header-login-pill">
            Login
          </Link>

          <MagneticButton strength={12} className="header-cta-desktop-only">
            <Link to="/get-started" className="btn-header-gold">
              <span>Start Verification</span>
            </Link>
          </MagneticButton>

          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with smooth backdrop and slide-down animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Dimmer */}
            <motion.div 
              className="mobile-backdrop-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div 
              className="mobile-drawer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="mobile-nav">
                <div className="mobile-nav-links-grid">
                  <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <span>Home</span>
                  </NavLink>
                  <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <span>About Us</span>
                  </NavLink>
                  <NavLink to="/services" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <span>Services</span>
                  </NavLink>
                  <NavLink to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <span>How It Works</span>
                  </NavLink>
                  <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                    <span>Contact Us</span>
                  </NavLink>
                </div>

                <div className="mobile-nav-divider"></div>

                {/* Mobile Direct Helpline Card */}
                <a href="tel:+917989938718" className="mobile-phone-link">
                  <div className="mobile-phone-icon-box">
                    <Phone size={18} />
                  </div>
                  <div className="mobile-phone-info">
                    <span className="mobile-phone-label">Toll-Free Legal Helpline</span>
                    <span className="mobile-phone-num">+91 79899 38718</span>
                  </div>
                </a>

                {/* Mobile Action Buttons */}
                <div className="mobile-cta-group">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-btn-text">
                    Portal Login
                  </Link>
                  
                  <Link to="/get-started" onClick={() => setMobileMenuOpen(false)} className="mobile-btn-gold">
                    <span>Start Verification</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
