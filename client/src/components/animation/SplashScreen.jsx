import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../../assets/logo.png';
import './SplashScreen.css';

export const SplashScreen = ({ onComplete }) => {
  // Only show splash screen once per session / browser opening
  const [visible, setVisible] = useState(() => {
    try {
      const alreadyShown = sessionStorage.getItem('suraksha_splash_shown');
      return !alreadyShown;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!visible) {
      if (onComplete) onComplete();
      return;
    }

    try {
      sessionStorage.setItem('suraksha_splash_shown', 'true');
    } catch {
      // ignore
    }

    // Play splash with smooth duration on first opening only
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="splash-screen-overlay"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: -20,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
          }}
        >
          <div className="splash-content">
            <motion.div 
              className="splash-logo-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Booming / Blooming Golden Aura & Shockwave Rings */}
              <div className="splash-boom-core"></div>
              <div className="splash-boom-pulse"></div>
              <div className="splash-boom-wave-1"></div>
              <div className="splash-boom-wave-2"></div>

              <img src={logoImg} alt="PROPERTY SURAKSHA" className="splash-logo-img" />
              <div className="splash-gold-ring"></div>
            </motion.div>

            <motion.div
              className="splash-text-box"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <h2 className="splash-brand-title">PROPERTY SURAKSHA</h2>
              <p className="splash-tagline">VERIFY • PROTECT • INVEST</p>
            </motion.div>

            <div className="splash-progress-track">
              <motion.div 
                className="splash-progress-bar"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
