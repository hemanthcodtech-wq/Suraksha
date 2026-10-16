import React from 'react';
import logoImg from '../assets/logo.png';

export const Logo = ({ size = 'normal', inverted = false }) => {
  return (
    <div className={`logo-wrapper logo-${size} ${inverted ? 'logo-inverted' : ''}`}>
      <img 
        src={logoImg} 
        alt="Property Suraksha Logo" 
        className="logo-img" 
      />
    </div>
  );
};

export default Logo;
