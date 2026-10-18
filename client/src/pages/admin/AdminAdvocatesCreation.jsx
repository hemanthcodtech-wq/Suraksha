import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Plus, 
  Phone, 
  Mail, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Edit3,
  Lock,
  Loader2,
  Key
} from 'lucide-react';
import { Skeleton } from '../../components/common/Skeleton';
import adminApi from '../../services/adminApi';

export const AdminAdvocatesCreation = () => {
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Modal states (Create or Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    bar_council_id: '',
    specialization: 'Land Revenue & 30-Yr Encumbrance',
    experience_years: 5,
    city: 'Hyderabad',
    state: 'Telangana',
    temporary_password: ''
  };

  const [form, setForm] = useState(initialFormState);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchAdvocates = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAdvocates();
      if (res.advocates) setAdvocates(res.advocates);
    } catch (err) {
      console.error('Error fetching advocates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm(initialFormState);
    setModalOpen(true);
  };

  const openEditModal = (adv) => {
    setIsEditing(true);
    setEditingId(adv.id);
    setForm({
      name: adv.name || '',
      email: adv.email || '',
      phone: adv.phone || '',
      bar_council_id: adv.bar_council_id || '',
      specialization: adv.specialization || 'Land Revenue & 30-Yr Encumbrance',
      experience_years: adv.experience_years || 5,
      city: adv.city || 'Hyderabad',
      state: adv.state || 'Telangana',
      temporary_password: adv.temporary_password || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        const res = await adminApi.updateAdvocate(editingId, form);
        if (res.success) {
          showNotification(`Advocate ${form.name} updated successfully in Neon DB.`);
          setModalOpen(false);
          fetchAdvocates();
        } else {
          showNotification(res.message || 'Error updating advocate.', 'error');
        }
      } else {
        const res = await adminApi.createAdvocate(form);
        if (res.success) {
          showNotification(`Advocate ${form.name} registered with temporary password.`);
          setModalOpen(false);
          setForm(initialFormState);
          fetchAdvocates();
        } else {
          showNotification(res.message || 'Error registering advocate.', 'error');
        }
      }
    } catch (err) {
      showNotification('Failed to save advocate details.', 'error');
    } finally {
      setSubmitting(false);
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
          <h2>4. Advocate Registration & Management</h2>
          <p>Register and manage bar-council verified property attorneys with secure login credentials</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-refresh-btn" onClick={fetchAdvocates} disabled={loading}>
            <RefreshCw size={17} className={loading ? 'spinning' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button className="admin-btn-gold" onClick={openCreateModal}>
            <Plus size={18} />
            <span>Register New Advocate</span>
          </button>
        </div>
      </header>

      <div className="admin-card-block">
        <div className="card-block-header">
          <div>
            <h3>Active Verification Panel</h3>
            <p className="card-sub-p">Total registered lawyers: {advocates.length}</p>
          </div>
        </div>

        <div className="advocates-cards-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="advocate-profile-card" style={{ opacity: 0.85 }}>
                <div className="adv-card-header" style={{ marginBottom: '1rem' }}>
                  <div className="skeleton-base skeleton-shimmer" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-base skeleton-shimmer" style={{ height: '18px', width: '70%', marginBottom: '8px' }} />
                    <div className="skeleton-base skeleton-shimmer" style={{ height: '14px', width: '45%' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div className="skeleton-base skeleton-shimmer" style={{ height: '14px', width: '85%' }} />
                  <div className="skeleton-base skeleton-shimmer" style={{ height: '14px', width: '65%' }} />
                  <div className="skeleton-base skeleton-shimmer" style={{ height: '24px', width: '40%', marginTop: '6px' }} />
                </div>
              </div>
            ))
          ) : advocates.length === 0 ? (
            <div className="empty-table-row" style={{ gridColumn: '1/-1' }}>
              No advocates found in database. Click "Register New Advocate" to add counsel.
            </div>
          ) : (
            advocates.map((adv) => (
              <div key={adv.id} className="advocate-profile-card">
                <div className="adv-card-header">
                  <div className="adv-avatar-circle">
                    {adv.name.replace('Adv. ', '').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <h4 style={{ margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {adv.name}
                      </h4>
                      <button 
                        className="btn-edit-advocate"
                        title="Edit Advocate Credentials & Profile"
                        onClick={() => openEditModal(adv)}
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                    </div>
                    <span className="adv-bar-badge">BCI: {adv.bar_council_id}</span>
                  </div>
                </div>

                <div className="adv-spec-box">
                  <label>Specialization:</label>
                  <p>{adv.specialization}</p>
                </div>

                <div className="adv-meta-row">
                  <div>
                    <span>Experience</span>
                    <strong>{adv.experience_years} Yrs</strong>
                  </div>
                  <div>
                    <span>Rating</span>
                    <strong>★ {adv.rating || '5.0'}</strong>
                  </div>
                  <div>
                    <span>Location</span>
                    <strong>{adv.city}</strong>
                  </div>
                </div>

                {/* Login Credentials Pill */}
                <div className="adv-creds-preview">
                  <div className="adv-cred-item">
                    <Mail size={12} />
                    <span className="cred-val">{adv.email}</span>
                  </div>
                  <div className="adv-cred-item">
                    <Key size={12} />
                    <span className="cred-label">Temp Pwd:</span>
                    <span className="cred-val gold">{adv.temporary_password || '—'}</span>
                  </div>
                </div>

                <div className="adv-contact-strip">
                  <span><Phone size={13} /> {adv.phone}</span>
                  <span className="active-tag">{adv.status || 'Active'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Creation & Editing Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card wide">
            <div className="admin-modal-header">
              <h3>{isEditing ? `Edit Profile & Password: ${form.name}` : 'Register New Panel Advocate'}</h3>
              <button 
                className="modal-close-btn" 
                onClick={() => !submitting && setModalOpen(false)}
                disabled={submitting}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="modal-form-grid-2">
                  <div className="admin-form-group">
                    <label>Advocate Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Adv. Arvind Swaminathan"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Bar Council Enrollment ID *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. TS/1042/2016"
                      value={form.bar_council_id}
                      onChange={(e) => setForm({ ...form, bar_council_id: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Email Address (For Advocate Login) *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="advocate@propertysuraksha.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Temporary Password (For Initial Sign In) *</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        required 
                        placeholder="Set initial sign-in password"
                        value={form.temporary_password}
                        onChange={(e) => setForm({ ...form, temporary_password: e.target.value })}
                        style={{ paddingLeft: '2.4rem' }}
                      />
                      <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#D4AF37' }} />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 98765 00000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Primary Specialization *</label>
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
                    <label>Experience (Years) *</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="50"
                      required 
                      value={form.experience_years}
                      onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Practicing City *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Hyderabad"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>State *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Telangana"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn-gold" 
                  disabled={submitting}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
                >
                  {submitting && <Loader2 size={16} className="spinning" />}
                  <span>{submitting ? (isEditing ? 'Saving...' : 'Registering...') : (isEditing ? 'Save Changes' : 'Register Advocate in Neon DB')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminAdvocatesCreation;
