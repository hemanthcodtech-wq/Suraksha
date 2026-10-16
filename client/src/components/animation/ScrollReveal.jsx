import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { luxuryEasing } from './motionVariants';

export const ScrollReveal = ({
  children,
  animation = 'fadeUp', // 'fadeUp' | 'fadeDown' | 'slideLeft' | 'slideRight' | 'maskReveal' | 'scaleUp' | 'fade'
  delay = 0,
  duration = 0.8,
  className = '',
  threshold = 0.18,
  once = true,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  const getVariants = () => {
    switch (animation) {
      case 'fadeUp':
        return {
          hidden: { opacity: 0, y: 32 },
          visible: { opacity: 1, y: 0, transition: { duration, ease: luxuryEasing, delay } }
        };
      case 'fadeDown':
        return {
          hidden: { opacity: 0, y: -32 },
          visible: { opacity: 1, y: 0, transition: { duration, ease: luxuryEasing, delay } }
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0, transition: { duration, ease: luxuryEasing, delay } }
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0, transition: { duration, ease: luxuryEasing, delay } }
        };
      case 'scaleUp':
        return {
          hidden: { opacity: 0, scale: 0.94 },
          visible: { opacity: 1, scale: 1, transition: { duration, ease: luxuryEasing, delay } }
        };
      case 'maskReveal':
        return {
          hidden: { clipPath: 'inset(10% 10% 10% 10% round 12px)', opacity: 0.3, scale: 1.05 },
          visible: { clipPath: 'inset(0% 0% 0% 0% round 0px)', opacity: 1, scale: 1, transition: { duration: 1.0, ease: luxuryEasing, delay } }
        };
      case 'fade':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration, ease: luxuryEasing, delay } }
        };
    }
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Signature Unravel Heading reveal: lines unmask from overflow hidden
export const UnravelHeading = ({ 
  children, 
  as = 'h2', 
  className = '', 
  delay = 0 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const Tag = motion[as] || motion.h2;

  if (shouldReduceMotion) {
    const RawTag = as;
    return <RawTag className={className}>{children}</RawTag>;
  }

  return (
    <div className="unravel-heading-wrap" style={{ overflow: 'hidden' }}>
      <Tag
        initial={{ y: '60%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px -40px 0px" }}
        transition={{ duration: 0.7, ease: luxuryEasing, delay }}
        className={className}
      >
        {children}
      </Tag>
    </div>
  );
};

export default ScrollReveal;
