import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  UserCheck, 
  Mail, 
  Phone, 
  CheckCircle, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

export const CustomerProfile = () => {
  const { customer, setCustomer } = useOutletContext();
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const updated = { ...customer, name, phone };
      setCustomer(updated);
      localStorage.setItem('suraksha_customer', JSON.stringify(updated));
      setLoading(false);
      showNotification('Profile details updated successfully!');
    }, 600);
  };

  return (
    <>
      {notification && (
        <div className="admin-toast-alert success">
          <CheckCircle size={18} />
          <span>{notification}</span>
        </div>
      )}

      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <h2>3. Customer Account & Contact Profile</h2>
          <p>Manage your registered legal name and contact coordinates for verification notifications</p>
        </div>
      </header>

      <div className="admin-card-block" style={{ maxWidth: '680px' }}>
        <div className="card-block-header">
          <div>
            <h3>Personal Information</h3>
            <p className="card-sub-p">Used for official title reports and SMS/email notifications</p>
          </div>
          <UserCheck size={22} color="#D4AF37" />
        </div>

        <form onSubmit={handleUpdate} style={{ padding: '0.5rem 0' }}>
          <div className="admin-form-group">
            <label>Full Legal Name *</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Registered Email Address (Locked to OTP Identity)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                disabled 
                value={customer?.email || ''}
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Registered Mobile Number (for SMS & WhatsApp) *</label>
            <input 
              type="tel" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="intake-notice" style={{ marginTop: '1.2rem' }}>
            <ShieldCheck size={20} className="intake-shield" />
            <p>Your contact details are encrypted and only accessible to Property Suraksha administrators and assigned property advocates.</p>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="admin-btn-gold"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              {loading && <Loader2 size={16} className="spinning" />}
              <span>{loading ? 'Saving Changes...' : 'Update Account Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomerProfile;
