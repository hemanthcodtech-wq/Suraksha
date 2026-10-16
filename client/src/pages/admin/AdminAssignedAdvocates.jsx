import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react';
import adminApi from '../../services/adminApi';

export const AdminAssignedAdvocates = () => {
  const [assignedCases, setAssignedCases] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [reassignModal, setReassignModal] = useState({ open: false, caseItem: null, advocateId: '' });
  const [selectedDocsCase, setSelectedDocsCase] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assignedRes, advocatesRes] = await Promise.all([
        adminApi.getAssignedCases(),
        adminApi.getAdvocates()
      ]);
      if (assignedRes.assignedCases) setAssignedCases(assignedRes.assignedCases);
      if (advocatesRes.advocates) setAdvocates(advocatesRes.advocates);
    } catch (err) {
      console.error('Error fetching assigned cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReassign = async (e) => {
    e.preventDefault();
    if (!reassignModal.advocateId) return;
    try {
      const res = await adminApi.assignAdvocate(reassignModal.caseItem.id, reassignModal.advocateId);
      if (res.success) {
        showNotification(`Case ${reassignModal.caseItem.case_reference} successfully reassigned.`);
        setReassignModal({ open: false, caseItem: null, advocateId: '' });
        fetchData();
      }
    } catch (err) {
      showNotification('Failed to reassign advocate.', 'error');
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
          <h2>3. Advocates Assigned & Active Scrutiny</h2>
          <p>Monitor cases currently assigned to practicing panel attorneys</p>
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
            <h3>Active Advocate Engagements</h3>
            <p className="card-sub-p">Track progress as legal opinions and reports are being prepared.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Assigned Advocate</th>
                <th>Bar Council ID</th>
                <th>Client & Property</th>
                <th>Customer Docs</th>
                <th>Assigned Date</th>
                <th>Advocate Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignedCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-row">No active assigned cases in Neon database.</td>
                </tr>
              ) : (
                assignedCases.map((ac) => {
                  const docList = Array.isArray(ac.uploaded_documents) 
                    ? ac.uploaded_documents 
                    : (typeof ac.uploaded_documents === 'string' ? JSON.parse(ac.uploaded_documents || '[]') : []);
                  const docCount = docList.length > 0 ? docList.length : (ac.documents_count || 1);

                  return (
                    <tr key={ac.id}>
                      <td><strong className="case-ref-pill">{ac.case_reference}</strong></td>
                      <td>
                        <div>
                          <strong>{ac.advocate_name}</strong>
                          <div className="small-text">{ac.advocate_specialization}</div>
                          <div className="small-text">{ac.advocate_phone}</div>
                        </div>
                      </td>
                      <td><code>{ac.bar_council_id}</code></td>
                      <td>
                        <strong>{ac.client_name}</strong>
                        <div className="small-text">{ac.project_name}</div>
                        <div className="small-text"><MapPin size={12} /> {ac.city}</div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedDocsCase(ac)}
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
                          <span>{docCount} Doc(s)</span>
                        </button>
                      </td>
                      <td>{new Date(ac.assigned_at || ac.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span className={`status-pill ${ac.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {ac.status}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            Updated by advocate
                          </span>
                        </div>
                      </td>
                      <td>
                        <button 
                          className="btn-assign-action"
                          onClick={() => setReassignModal({ open: true, caseItem: ac, advocateId: ac.assigned_advocate_id })}
                        >
                          Reassign
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

      {/* Reassign Modal */}
      {reassignModal.open && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Reassign Advocate</h3>
              <button className="modal-close-btn" onClick={() => setReassignModal({ open: false, caseItem: null, advocateId: '' })}>
                ✕
              </button>
            </div>
            <form onSubmit={handleReassign}>
              <div className="admin-modal-body">
                <div className="recommendation-box" style={{ marginBottom: '1.2rem' }}>
                  <p>Case: <strong>{reassignModal.caseItem?.case_reference}</strong></p>
                  <p>Current Advocate: <strong>{reassignModal.caseItem?.advocate_name}</strong></p>
                </div>

                <div className="admin-form-group">
                  <label>Select New Advocate *</label>
                  <select 
                    required
                    value={reassignModal.advocateId}
                    onChange={(e) => setReassignModal({ ...reassignModal, advocateId: e.target.value })}
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
                <button type="button" className="btn-modal-cancel" onClick={() => setReassignModal({ open: false, caseItem: null, advocateId: '' })}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-gold">
                  Save Reassignment
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
                    Advocate Status: {selectedDocsCase.status}
                  </span>
                </div>
                <p>Client: <strong>{selectedDocsCase.client_name}</strong> ({selectedDocsCase.client_phone} • {selectedDocsCase.client_email})</p>
                <p>Assigned Advocate: <strong>{selectedDocsCase.advocate_name}</strong> ({selectedDocsCase.bar_council_id})</p>
                <p>Property: <strong>{selectedDocsCase.project_name}</strong>, {selectedDocsCase.city}</p>
              </div>

              <h4 style={{ fontSize: '0.92rem', color: '#ebd37d', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Deeds & Evidence Under Legal Examination
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
                      No digital file copies attached.
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

export default AdminAssignedAdvocates;
