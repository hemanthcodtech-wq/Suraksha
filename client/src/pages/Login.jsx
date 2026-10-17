import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone,
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserCheck, 
  Scale, 
  User, 
  ArrowLeft,
  KeyRound,
  CheckCircle,
  Loader2,
  FileCheck
} from 'lucide-react';
import { API_BASE_URL } from '../services/adminApi';
import './AuthModal.css';

export const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Customer'); // Default to Customer
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Customer OTP Flow states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setAuthError('');
    setOtpSent(false);
    setOtpCode('');
    setOtpSuccessMessage('');

    if (selectedRole === 'Administrator') {
      setEmail('admin@propertysuraksha.com');
      setPassword('admin123');
    } else if (selectedRole === 'Advocate') {
      setEmail('kancharlahemanth89@gmail.com');
      setPassword('Advocate@123');
    } else {
      setEmail('');
      setPhone('');
      setPassword('');
    }
  };

  // Step 1: Request Email OTP for Customer
  const handleRequestCustomerOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/customer/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone })
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpSuccessMessage(data.message || `A 6-digit OTP has been sent to ${email}`);
      } else {
        setAuthError(data.message || 'Verification failed. Please check your email and phone.');
      }
    } catch (err) {
      setAuthError('Unable to connect to verification server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Verify Customer OTP & Login
  const handleVerifyCustomerOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/customer/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('suraksha_customer', JSON.stringify(data.customer));
        localStorage.setItem('suraksha_customer_cases', JSON.stringify(data.cases || []));
        navigate('/customer/dashboard');
      } else {
        setAuthError(data.message || 'Invalid or expired OTP. Please try again.');
      }
    } catch (err) {
      setAuthError('Failed to verify OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Admin & Advocate Login Submission
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (role === 'Administrator') {
      navigate('/admin/dashboard');
      return;
    }

    if (role === 'Advocate') {
      setSubmitting(true);
      try {
        const res = await fetch(`${API_BASE_URL}/admin/advocate/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.advocate) {
          localStorage.setItem('suraksha_advocate', JSON.stringify(data.advocate));
          navigate('/advocate/dashboard');
        } else {
          setAuthError(data.message || 'Invalid advocate credentials. Check your email & password.');
        }
      } catch (err) {
        setAuthError('Connection error during advocate authentication.');
      } finally {
        setSubmitting(false);
      }
    }
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
            <Lock size={12} className="badge-lock-icon" />
            <span>PORTAL • GMAIL OTP SECURED</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="portal-auth-heading">
          {role === 'Customer' ? 'Client' : 'Internal'} <span className="gold-gradient-text">Sign In</span>
        </h1>
        <p className="portal-auth-subheading">
          {role === 'Customer'
            ? 'Enter your registered email and mobile number to receive a secure Email OTP'
            : role === 'Advocate'
            ? 'Authorized console for Bar-Admitted Property Advocates'
            : 'Authorized console for Administrators and Legal Operations'}
        </p>

        {/* 3-Way Role Switcher Pill */}
        <div className="portal-role-tabs">
          <button
            type="button"
            className={`portal-role-tab ${role === 'Customer' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('Customer')}
          >
            <User size={16} />
            <span>Customer</span>
          </button>
          <button
            type="button"
            className={`portal-role-tab ${role === 'Advocate' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('Advocate')}
          >
            <Scale size={16} />
            <span>Advocate</span>
          </button>
          <button
            type="button"
            className={`portal-role-tab ${role === 'Administrator' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('Administrator')}
          >
            <ShieldCheck size={16} />
            <span>Administrator</span>
          </button>
        </div>

        {/* CUSTOMER OTP LOGIN FLOW */}
        {role === 'Customer' ? (
          !otpSent ? (
            /* STEP 1: Enter Registered Email & Mobile Number */
            <form onSubmit={handleRequestCustomerOtp} className="portal-auth-form">
              <div className="portal-form-group">
                <label className="portal-form-label">Registered Email Address (From /get-started) *</label>
                <div className="portal-input-container">
                  <Mail size={18} className="portal-field-icon" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="portal-input-field"
                  />
                </div>
              </div>

              <div className="portal-form-group">
                <label className="portal-form-label">Registered Mobile Number (From /get-started) *</label>
                <div className="portal-input-container">
                  <Phone size={18} className="portal-field-icon" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="portal-input-field"
                  />
                </div>
              </div>

              {authError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                  {authError}
                </div>
              )}

              <button type="submit" className="portal-submit-btn" disabled={submitting}>
                {submitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Loader2 size={16} className="spinning" />
                    <span>Verifying & Sending OTP...</span>
                  </span>
                ) : (
                  <>
                    <span>Send Verification OTP</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="portal-auth-footer-links" style={{ justifyContent: 'center' }}>
                <Link to="/get-started" className="portal-return-link" style={{ color: '#ebd37d' }}>
                  <span>Haven't submitted a property yet? Start Here</span>
                </Link>
              </div>
            </form>
          ) : (
            /* STEP 2: Enter 6-digit OTP received in Email */
            <form onSubmit={handleVerifyCustomerOtp} className="portal-auth-form">
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', padding: '0.85rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.4rem' }}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                <span>{otpSuccessMessage}</span>
              </div>

              <div className="portal-form-group">
                <label className="portal-form-label">Enter 6-Digit Email Verification Code *</label>
                <div className="portal-input-container">
                  <KeyRound size={18} className="portal-field-icon" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••••"
                    style={{ letterSpacing: '0.35em', fontSize: '1.2rem', fontWeight: '800' }}
                    className="portal-input-field"
                  />
                </div>
              </div>

              {authError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                  {authError}
                </div>
              )}

              <button type="submit" className="portal-submit-btn" disabled={submitting}>
                {submitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Loader2 size={16} className="spinning" />
                    <span>Verifying Code...</span>
                  </span>
                ) : (
                  <>
                    <span>Verify OTP & Enter Customer Portal</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="portal-auth-footer-links" style={{ justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Change Email or Mobile
                </button>
                <button
                  type="button"
                  onClick={handleRequestCustomerOtp}
                  style={{ background: 'transparent', border: 'none', color: '#ebd37d', fontSize: '0.82rem', cursor: 'pointer', fontWeight: '700' }}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )
        ) : (
          /* ADMINISTRATOR & ADVOCATE LOGIN FORM */
          <form onSubmit={handleStaffSubmit} className="portal-auth-form">
            <div className="portal-form-group">
              <label className="portal-form-label">
                {role === 'Advocate' ? 'Registered Advocate Email Address' : 'Administrator Email Address'}
              </label>
              <div className="portal-input-container">
                <Mail size={18} className="portal-field-icon" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'Advocate' ? "advocate@propertysuraksha.com" : "admin@propertysuraksha.com"}
                  className="portal-input-field"
                />
              </div>
            </div>

            <div className="portal-form-group">
              <div className="portal-label-row">
                <label className="portal-form-label">
                  {role === 'Advocate' ? 'Temporary / Permanent Password' : 'Administrator Password'}
                </label>
                {/* <span className="demo-hint-text">
                  Default: {role === 'Administrator' ? 'admin123' : 'Advocate@123'}
                </span> */}
              </div>
              <div className="portal-input-container">
                <Lock size={18} className="portal-field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {authError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#fca5a5', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                {authError}
              </div>
            )}

            <button type="submit" className="portal-submit-btn" disabled={submitting}>
              {submitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Loader2 size={16} className="spinning" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <>
                  <span>Sign In as {role}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="portal-auth-footer-links" style={{ justifyContent: 'center' }}>
              <Link to="/" className="portal-return-link">
                <ArrowLeft size={14} />
                <span>Return to Public Homepage</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
