import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import './AuthModal.css';

export const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Account created successfully for ${formData.name}! Please sign in.`);
    navigate('/login');
  };

  return (
    <div className="dark-portal-auth-page">
      <div className="portal-auth-glow-bg"></div>

      <div className="portal-auth-card">
        {/* Top Logo & Portal Badge */}
        <div className="portal-auth-topbar">
          <div className="portal-logo-wrap">
            <Logo size="normal" />
          </div>
          <div className="portal-jwt-badge">
            <ShieldCheck size={12} className="badge-lock-icon" />
            <span>256-BIT ENCRYPTED</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="portal-auth-heading">
          Create <span className="gold-gradient-text">Account</span>
        </h1>
        <p className="portal-auth-subheading">
          Register to submit verification requests and access advocate-certified reports.
        </p>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="portal-auth-form">
          <div className="portal-form-group">
            <label className="portal-form-label">Full Legal Name *</label>
            <div className="portal-input-container">
              <User size={18} className="portal-field-icon" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Ramesh Sharma"
                className="portal-input-field"
              />
            </div>
          </div>

          <div className="portal-form-group">
            <label className="portal-form-label">Email Address *</label>
            <div className="portal-input-container">
              <Mail size={18} className="portal-field-icon" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@example.com"
                className="portal-input-field"
              />
            </div>
          </div>

          <div className="portal-form-group">
            <label className="portal-form-label">Phone Number *</label>
            <div className="portal-input-container">
              <Phone size={18} className="portal-field-icon" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 98765 43210"
                className="portal-input-field"
              />
            </div>
          </div>

          <div className="portal-form-group">
            <label className="portal-form-label">Password *</label>
            <div className="portal-input-container">
              <Lock size={18} className="portal-field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Minimum 8 characters"
                className="portal-input-field"
              />
              <button
                type="button"
                className="portal-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="portal-submit-btn">
            <span>Register Account</span>
            <ArrowRight size={18} />
          </button>

          <div className="portal-auth-footer-links">
            <Link to="/" className="portal-return-link">
              <ArrowLeft size={14} />
              <span>Return to Public Homepage</span>
            </Link>
            <div className="portal-switch-signup">
              <span>Already registered?</span>
              <Link to="/login" className="gold-link">Sign In</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
