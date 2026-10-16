import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Award, 
  Loader2 
} from 'lucide-react';
import adminApi from '../../services/adminApi';

export const AdvocateProfile = () => {
  const { advocate, setAdvocate } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    specialization: '',
    experience_years: 5,
    city: '',
    state: ''
  });

  useEffect(() => {
    if (advocate) {
      setForm({
        name: advocate.name || '',
        phone: advocate.phone || '',
        specialization: advocate.specialization || 'Land Revenue & 30-Yr Encumbrance',
        experience_years: advocate.experience_years || 5,
        city: advocate.city || 'Hyderabad',
        state: advocate.state || 'Telangana'
      });
    }
  }, [advocate]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!advocate?.id) return;
    setLoading(true);
    try {
      const res = await adminApi.updateAdvocateProfile(advocate.id, form);
      if (res.success) {
        showNotification('Profile information successfully updated in Neon DB!');
        const updatedAdv = { ...advocate, ...res.advocate };
        setAdvocate(updatedAdv);
        localStorage.setItem('suraksha_advocate', JSON.stringify(updatedAdv));
      } else {
        showNotification(res.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showNotification('Error updating profile information', 'error');
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
          <h2>Advocate Counsel Profile</h2>
          <p>Manage your professional credentials, legal specialization, and contact information visible across PropertySuraksha</p>
        </div>
      </header>

      <div className="admin-card-block" style={{ maxWidth: '820px' }}>
        <div className="card-block-header">
          <div>
            <h3>Practicing Credentials</h3>
            <p className="card-sub-p">Bar Council of India verified registration</p>
          </div>
          <span className="adv-bar-badge" style={{ fontSize: '0.82rem', padding: '0.3rem 0.8rem' }}>
            BCI Enrollment: {advocate?.bar_council_id || 'TS/8842/2012'}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0.5rem 0' }}>
          <div className="modal-form-grid-2">
            <div className="admin-form-group">
              <label>Full Legal Name *</label>
              <input 
                type="text" 
                required 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Registered Email Address (Locked)</label>
              <input 
                type="email" 
                disabled 
                value={advocate?.email || 'advocate@propertysuraksha.com'}
                style={{ opacity: 0.7 }}
              />
            </div>

            <div className="admin-form-group">
              <label>Phone / WhatsApp Number *</label>
              <input 
                type="tel" 
                required 
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>Practice Experience (Years) *</label>
              <input 
                type="number" 
                min="1" 
                max="50" 
                required 
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
              />
            </div>

            <div className="admin-form-group" style={{ gridColumn: '1/-1' }}>
              <label>Core Property Legal Specialization *</label>
              <select
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              >
                <option value="Land Revenue & 30-Yr Encumbrance">Land Revenue & 30-Yr Encumbrance</option>
                <option value="Builder RERA Sanctions & Master Deeds">Builder RERA Sanctions & Master Deeds</option>
                <option value="Apartment UDS & Civil Title Litigations">Apartment UDS & Civil Title Litigations</option>
                <option value="Agricultural Land Conversion & Title Deeds">Agricultural Land Conversion & Title Deeds</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Practicing City *</label>
              <input 
                type="text" 
                required 
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label>State *</label>
              <input 
                type="text" 
                required 
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="admin-btn-gold"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              {loading && <Loader2 size={16} className="spinning" />}
              <span>{loading ? 'Saving Changes...' : 'Update Advocate Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdvocateProfile;
