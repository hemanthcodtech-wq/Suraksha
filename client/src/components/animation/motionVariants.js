// Premium easing curves & motion variants for PROPERTY SURAKSHA
// Tailored for luxury real-estate legal tech (#0B2D52 Navy & #D4AF37 Gold)

export const luxuryEasing = [0.22, 1, 0.36, 1]; // Smooth cinematic ease-out
export const luxurySpring = { type: 'spring', damping: 25, stiffness: 200 };

// 1. Text Line Unmask / Unravel Animation
export const unravelContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const unravelItem = {
  hidden: { 
    y: '115%', 
    opacity: 0 
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.85,
      ease: luxuryEasing,
    },
  },
};

// 2. Subtle Fade Up for subtexts and buttons
export const fadeUpVariant = {
  hidden: { 
    opacity: 0, 
    y: 28 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.75,
      ease: luxuryEasing,
    }
  },
};

// 3. Image Mask / Clip-path reveal (signature unravel)
export const maskRevealVariant = {
  hidden: { 
    clipPath: 'inset(10% 10% 10% 10% round 12px)',
    scale: 1.06,
    opacity: 0.3,
  },
  visible: {
    clipPath: 'inset(0% 0% 0% 0% round 0px)',
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1.1,
      ease: luxuryEasing,
    },
  },
};

// 4. Staggered Container for Grids and Cards
export const staggerContainer = (staggerDelay = 0.08, initialDelay = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    },
  },
});

export const cardStaggerItem = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: luxuryEasing,
    }
  },
};

// 5. Gold Accent Line Drawing
export const lineDrawVariant = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: '100%',
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: luxuryEasing,
      delay: 0.25,
    },
  },
};
