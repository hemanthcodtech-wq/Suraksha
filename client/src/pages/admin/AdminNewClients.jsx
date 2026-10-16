import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  MapPin, 
  Award, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  FileText,
  ExternalLink,
  Download,
  Eye
} from 'lucide-react';
import adminApi from '../../services/adminApi';

export const AdminNewClients = () => {
  const [clients, setClients] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [notification, setNotification] = useState(null);
  const [assignModal, setAssignModal] = useState({ open: false, caseItem: null, advocateId: '' });
  const [selectedDocsCase, setSelectedDocsCase] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, advocatesRes] = await Promise.all([
        adminApi.getClients(),
        adminApi.getAdvocates()
      ]);
      if (clientsRes.clients) setClients(clientsRes.clients);
      if (advocatesRes.advocates) setAdvocates(advocatesRes.advocates);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignModal.advocateId) return;
    try {
      const res = await adminApi.assignAdvocate(assignModal.caseItem.id, assignModal.advocateId);
      if (res.success) {
        showNotification(`Advocate assigned to Case ${assignModal.caseItem.case_reference}`);
        setAssignModal({ open: false, caseItem: null, advocateId: '' });
        fetchData();
      }
    } catch (err) {
      showNotification('Failed to assign advocate.', 'error');
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
          <h2>2. New Clients & Verification Intake</h2>
          <p>Incoming property cases registered dynamically from customer intake forms</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-refresh-btn" onClick={fetchData}>
            <RefreshCw size={17} className={loading ? 'spinning' : ''} />
            <span>Refresh Neon DB</span>
          </button>
        </div>
      </header>

      <div className="admin-card-block">
        <div className="card-block-header">
          <div>
            <h3>All Registered Verification Clients</h3>
            <p className="card-sub-p">Assign practicing advocates to initiate document checks.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Client Particulars</th>
                <th>Service Required</th>
                <th>Property & Builder</th>
                <th>Status</th>
                <th>Customer Documents</th>
                <th>Assigned Advocate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-row">No clients found in Neon database.</td>
                </tr>
              ) : (
                clients.map((c) => {
                  const docList = Array.isArray(c.uploaded_documents) 
                    ? c.uploaded_documents 
                    : (typeof c.uploaded_documents === 'string' ? JSON.parse(c.uploaded_documents || '[]') : []);
                  const docCount = docList.length > 0 ? docList.length : (c.documents_count || 1);

                  return (
                    <tr key={c.id}>
                      <td><strong className="case-ref-pill">{c.case_reference}</strong></td>
                      <td>
                        <div>
                          <strong>{c.client_name}</strong>
                          <div className="small-text">{c.client_phone}</div>
                          <div className="email-sub">{c.client_email}</div>
                        </div>
                      </td>
                      <td><span className="case-ref-pill">{c.service_type}</span></td>
                      <td>
                        <div>
                          <strong>{c.project_name}</strong>
                          <div className="small-text">{c.seller_or_builder}</div>
                          <div className="small-text"><MapPin size={12} /> {c.city}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${c.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedDocsCase(c)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            background: 'rgba(212, 175, 55, 0.12)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            color: '#ebd37d',
                            borderRadius: '6px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <FileText size={13} />
                          <span>{docCount} Document(s)</span>
                        </button>
                      </td>
                      <td>
                        {c.advocate_name ? (
                          <div className="advocate-cell-info">
                            <Award size={14} className="gold-icon" />
                            <div>
                              <span>{c.advocate_name}</span>
                              <div className="small-text" style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                {c.advocate_specialization || 'Panel Advocate'}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="unassigned-badge">Needs Advocate</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn-assign-action"
                          onClick={() => setAssignModal({ open: true, caseItem: c, advocateId: c.assigned_advocate_id || '' })}
                        >
                          {c.advocate_name ? 'Reassign' : 'Assign Advocate'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModal.open && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Assign Advocate to Case</h3>
              <button className="modal-close-btn" onClick={() => setAssignModal({ open: false, caseItem: null, advocateId: '' })}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAssignSubmit}>
              <div className="admin-modal-body">
                <div className="recommendation-box" style={{ marginBottom: '1.2rem' }}>
                  <p>Case: <strong>{assignModal.caseItem?.case_reference}</strong></p>
                  <p>Client: <strong>{assignModal.caseItem?.client_name}</strong></p>
                  <p>Property: <strong>{assignModal.caseItem?.project_name} ({assignModal.caseItem?.city})</strong></p>
                </div>

                <div className="admin-form-group">
                  <label>Select Practicing Advocate from Panel *</label>
                  <select 
                    required
                    value={assignModal.advocateId}
                    onChange={(e) => setAssignModal({ ...assignModal, advocateId: e.target.value })}
                  >
                    <option value="">-- Choose verified Advocate --</option>
                    {advocates.map((adv) => (
                      <option key={adv.id} value={adv.id}>
                        {adv.name} — {adv.specialization} ({adv.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-modal-cancel" disabled={assigning} onClick={() => setAssignModal({ open: false, caseItem: null, advocateId: '' })}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-gold" disabled={assigning} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                  {assigning && <Loader2 size={16} className="spinning" />}
                  <span>{assigning ? 'Assigning...' : 'Confirm Assignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Uploaded Documents Inspection Modal */}
      {selectedDocsCase && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card" style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={20} color="#D4AF37" />
                <h3>Customer Uploaded Documents</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedDocsCase(null)}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="recommendation-box" style={{ marginBottom: '1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className="case-ref-pill">{selectedDocsCase.case_reference}</span>
                  <span className={`status-pill ${selectedDocsCase.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    Status: {selectedDocsCase.status}
                  </span>
                </div>
                <p>Client: <strong>{selectedDocsCase.client_name}</strong> ({selectedDocsCase.client_phone} • {selectedDocsCase.client_email})</p>
                <p>Property: <strong>{selectedDocsCase.project_name}</strong>, {selectedDocsCase.city}</p>
                {selectedDocsCase.client_notes && (
                  <p style={{ marginTop: '0.4rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                    Notes: <em>"{selectedDocsCase.client_notes}"</em>
                  </p>
                )}
              </div>

              <h4 style={{ fontSize: '0.92rem', color: '#ebd37d', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Attached Verification Files & Deeds
              </h4>

              {(() => {
                const docs = Array.isArray(selectedDocsCase.uploaded_documents)
                  ? selectedDocsCase.uploaded_documents
                  : (typeof selectedDocsCase.uploaded_documents === 'string'
                      ? JSON.parse(selectedDocsCase.uploaded_documents || '[]')
                      : []);

                if (docs.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: '#94a3b8' }}>
                      No digital file copies attached. Physical copies submitted at desk.
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {docs.map((doc, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1.1rem',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <FileText size={20} color="#60a5fa" />
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#f8fafc' }}>
                              {doc.name || `Document_${idx + 1}.pdf`}
                            </strong>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Initial Submission'}
                              {doc.size ? ` • ${(doc.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                            </span>
                          </div>
                        </div>

                        <a 
                          href={doc.url || 'https://res.cloudinary.com/demo/image/upload/sample.pdf'}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-assign-action"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            textDecoration: 'none',
                            padding: '0.45rem 0.9rem',
                            background: 'rgba(212, 175, 55, 0.15)',
                            borderColor: '#D4AF37',
                            color: '#ebd37d'
                          }}
                        >
                          <Eye size={13} />
                          <span>View Doc</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="btn-modal-cancel" 
                onClick={() => setSelectedDocsCase(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNewClients;
