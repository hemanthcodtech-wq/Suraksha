import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  KeyRound, 
  Lock, 
  CheckCircle, 
  XCircle, 
  ShieldCheck, 
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import adminApi from '../../services/adminApi';

export const AdvocateResetPassword = () => {
  const { advocate, setAdvocate } = useOutletContext();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!advocate?.id) return;

    if (newPassword.length < 6) {
      showNotification('New password must be at least 6 characters long.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('New password and confirmation password do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.resetAdvocatePassword(advocate.id, currentPassword, newPassword);
      if (res.success) {
        showNotification('Password successfully updated! Your account is now secured.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        if (advocate) {
          const updated = { ...advocate, temporary_password: newPassword };
          setAdvocate(updated);
          localStorage.setItem('suraksha_advocate', JSON.stringify(updated));
        }
      } else {
        showNotification(res.message || 'Failed to update password', 'error');
      }
    } catch (err) {
      showNotification('Error updating password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <div className={`admin-toast-alert ${notification.type}`}>
          {notification.type === 'success' && <CheckCircle size={18} />}
          {notification.type === 'error' && <XCircle size={18} />}
          <span>{notification.msg}</span>
        </div>
      )}

      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <h2>Security & Password Reset</h2>
          <p>Replace your temporary administrator-issued password with your own secure credentials</p>
        </div>
      </header>

      <div className="admin-card-block" style={{ maxWidth: '650px' }}>
        <div className="card-block-header">
          <div>
            <h3>Update Advocate Portal Password</h3>
            <p className="card-sub-p">Use a strong password with letters, numbers, and symbols</p>
          </div>
          <KeyRound size={22} color="#D4AF37" />
        </div>

        <form onSubmit={handlePasswordReset} style={{ padding: '0.5rem 0' }}>
          <div className="admin-form-group">
            <label>Current / Temporary Password *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showCurrent ? 'text' : 'password'}
                required
                placeholder="Enter your current or temporary password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button 
                type="button" 
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="admin-form-group">
            <label>New Secure Password *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showNew ? 'text' : 'password'}
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button 
                type="button" 
                onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Confirm New Password *</label>
            <input 
              type="password" 
              required
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="intake-notice" style={{ marginTop: '1.2rem' }}>
            <ShieldCheck size={20} className="intake-shield" />
            <p>Once updated, you must use this new password on the <strong>Advocate Sign In</strong> portal. The temporary password will no longer work.</p>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="admin-btn-gold"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              {loading && <Loader2 size={16} className="spinning" />}
              <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdvocateResetPassword;
