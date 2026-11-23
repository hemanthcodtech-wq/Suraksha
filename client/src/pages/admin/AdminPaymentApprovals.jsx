import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  MapPin, 
  Clock, 
  User, 
  FileText,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { SkeletonTableRows } from '../../components/common/Skeleton';
import adminApi from '../../services/adminApi';

export const AdminPaymentApprovals = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [screenshotModal, setScreenshotModal] = useState({ open: false, url: '', caseRef: '', clientName: '' });
  const [rejectModal, setRejectModal] = useState({ open: false, caseItem: null, reason: '' });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingPayments();
      if (res.success && res.cases) {
        setCases(res.cases);
      }
    } catch (err) {
      console.error('Error fetching pending payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const handleApprove = async (caseItem) => {
    setActioningId(caseItem.id);
    try {
      const res = await adminApi.handlePaymentApproval(caseItem.id, 'APPROVE');
      if (res.success) {
        showNotification(`Payment approved for Case ${caseItem.case_reference}! It has now moved into New Clients.`);
        fetchPendingPayments();
      } else {
        showNotification(res.message || 'Failed to approve payment', 'error');
      }
    } catch (err) {
      showNotification('Error approving payment.', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModal.caseItem) return;
    setActioningId(rejectModal.caseItem.id);
    try {
      const res = await adminApi.handlePaymentApproval(rejectModal.caseItem.id, 'REJECT', rejectModal.reason);
      if (res.success) {
        showNotification(`Payment rejected for Case ${rejectModal.caseItem.case_reference}.`, 'warning');
        setRejectModal({ open: false, caseItem: null, reason: '' });
        fetchPendingPayments();
      } else {
        showNotification(res.message || 'Failed to reject payment', 'error');
      }
    } catch (err) {
      showNotification('Error rejecting payment.', 'error');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <>
      {notification && (
        <div className={`admin-toast-alert ${notification.type}`}>
          {notification.type === 'success' && <CheckCircle size={18} />}
          {notification.type === 'error' && <XCircle size={18} />}
          {notification.type === 'warning' && <AlertTriangle size={18} />}
          <span>{notification.msg}</span>
        </div>
      )}

      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <h2>Payment Screenshot Approvals</h2>
          <p>Scrutinize customer scanner / UPI payment screenshots before releasing leads into "New Clients" for advocate assignment.</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-refresh-btn" onClick={fetchPendingPayments}>
            <RefreshCw size={17} className={loading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <div className="admin-card-block">
        <div className="card-block-header">
          <div>
            <h3>Pending Payment Screenshot Submissions ({cases.length})</h3>
            <p className="card-sub-p">
              Rule: Verify the transaction screenshot matches the registration fee. Once approved, the lead will appear in the New Clients queue.
            </p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Client Particulars</th>
                <th>Property & Service</th>
                <th>Transaction ID</th>
                <th>Payment Screenshot</th>
                <th>Submitted At</th>
                <th>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableRows rows={4} columns={7} />
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-table-row" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 0.6rem', display: 'block' }} />
                    <strong>No pending payment approvals!</strong>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                      All customer scanner payments have been reviewed and approved.
                    </div>
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong className="case-ref-pill">{c.case_reference}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{c.client_name}</strong>
                        <div className="small-text">{c.client_phone}</div>
                        <div className="email-sub">{c.client_email}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{c.project_name}</strong>
                        <div className="small-text">{c.service_type} • <MapPin size={11} style={{ display: 'inline' }} /> {c.city}</div>
                      </div>
                    </td>
                    <td>
                      {c.payment_transaction_id ? (
                        <code style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#ebd37d', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                          {c.payment_transaction_id}
                        </code>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>None Provided</span>
                      )}
                    </td>
                    <td>
                      {(() => {
                        // Check direct screenshot URL or any uploaded documents tagged as screenshot
                        let docUrl = c.payment_screenshot_url;
                        if (!docUrl && c.uploaded_documents) {
                          const docList = Array.isArray(c.uploaded_documents) 
                            ? c.uploaded_documents 
                            : (typeof c.uploaded_documents === 'string' ? JSON.parse(c.uploaded_documents || '[]') : []);
                          
                          const foundScreenshot = docList.find(d => 
                            d.isPaymentScreenshot || 
                            d.name?.toLowerCase().includes('payment') || 
                            d.name?.toLowerCase().includes('screenshot') ||
                            d.name?.toLowerCase().includes('upi')
                          ) || docList[docList.length - 1]; // or latest attached file

                          if (foundScreenshot) {
                            docUrl = foundScreenshot.url;
                          }
                        }

                        if (docUrl) {
                          return (
                            <button
                              type="button"
                              onClick={() => setScreenshotModal({
                                open: true,
                                url: docUrl,
                                caseRef: c.case_reference,
                                clientName: c.client_name
                              })}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid #10b981',
                                color: '#6ee7b7',
                                padding: '0.4rem 0.75rem',
                                borderRadius: '6px',
                                fontWeight: '600',
                                fontSize: '0.82rem',
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={13} />
                              <span>View Screenshot</span>
                            </button>
                          );
                        }

                        return (
                          <span style={{ color: '#ef4444', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            Legacy / No Image
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      <div className="small-text" style={{ color: '#94a3b8' }}>
                        <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                        {c.payment_submitted_at ? new Date(c.payment_submitted_at).toLocaleString() : new Date(c.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          disabled={actioningId === c.id}
                          onClick={() => handleApprove(c)}
                          style={{
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.45rem 0.85rem',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          {actioningId === c.id ? <Loader2 size={13} className="spinning" /> : <CheckCircle size={13} />}
                          <span>Approve Lead</span>
                        </button>

                        <button
                          type="button"
                          disabled={actioningId === c.id}
                          onClick={() => setRejectModal({ open: true, caseItem: c, reason: '' })}
                          style={{
                            background: 'transparent',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            padding: '0.45rem 0.7rem',
                            borderRadius: '6px',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {screenshotModal.open && (
        <div className="admin-modal-backdrop" onClick={() => setScreenshotModal({ open: false, url: '', caseRef: '', clientName: '' })}>
          <div className="admin-modal-card" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CreditCard size={20} color="#D4AF37" />
                <h3>Payment Proof — {screenshotModal.caseRef}</h3>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setScreenshotModal({ open: false, url: '', caseRef: '', clientName: '' })}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body" style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 1rem', color: '#94a3b8', fontSize: '0.88rem' }}>
                Submitted by <strong>{screenshotModal.clientName}</strong>
              </p>
              <div style={{ background: '#020617', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <img 
                  src={screenshotModal.url} 
                  alt="Customer Payment Screenshot" 
                  style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '6px' }} 
                />
              </div>
              <div style={{ marginTop: '0.8rem' }}>
                <a 
                  href={screenshotModal.url} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#D4AF37', fontSize: '0.85rem', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>Open full size in new tab</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="btn-modal-cancel"
                onClick={() => setScreenshotModal({ open: false, url: '', caseRef: '', clientName: '' })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card" style={{ maxWidth: '500px' }}>
            <div className="admin-modal-header">
              <h3>Reject Payment for {rejectModal.caseItem?.case_reference}</h3>
              <button className="modal-close-btn" onClick={() => setRejectModal({ open: false, caseItem: null, reason: '' })}>
                ✕
              </button>
            </div>
            <form onSubmit={handleRejectSubmit}>
              <div className="admin-modal-body">
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1rem' }}>
                  Please enter the reason for rejection (e.g. invalid amount, fake screenshot, transaction ID mismatch).
                </p>
                <div className="admin-form-group">
                  <label>Rejection Reason *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter reason..."
                    value={rejectModal.reason}
                    onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel"
                  onClick={() => setRejectModal({ open: false, caseItem: null, reason: '' })}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.65rem 1.2rem',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPaymentApprovals;
