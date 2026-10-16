import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  AlertTriangle,
  Award,
  ExternalLink,
  FileText
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import AdminLayout from './AdminLayout';

export const AdminApprovals = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [reviewModal, setReviewModal] = useState({ open: false, report: null, feedback: '' });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getApprovals();
      if (res.reports) setReports(res.reports);
    } catch (err) {
      console.error('Error fetching approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (action) => {
    if (!reviewModal.report) return;
    try {
      const res = await adminApi.handleApprovalAction(
        reviewModal.report.id, 
        action, 
        reviewModal.feedback
      );
      if (res.success) {
        if (action === 'APPROVE') {
          showNotification(`Document Approved! The verification report is now LIVE in the Client Portal.`);
        } else {
          showNotification(`Revision requested from advocate. The document remains withheld from Client Portal.`, 'warning');
        }
        setReviewModal({ open: false, report: null, feedback: '' });
        fetchReports();
      }
    } catch (err) {
      showNotification('Failed to update approval status.', 'error');
    }
  };

  const pendingCount = reports.filter(r => r.approval_status === 'Pending Approval').length;

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
          <h2>5. Document Approvals & Client Portal Release</h2>
          <p>Scrutinize reports prepared by advocates before granting clearance to display in customer portal</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-refresh-btn" onClick={fetchReports}>
            <RefreshCw size={17} className={loading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <div className="admin-card-block">
        <div className="card-block-header">
          <div>
            <h3>Advocate Submissions Awaiting Admin Sign-off</h3>
            <p className="card-sub-p">
              Security Rule: Reports remain withheld until the Administrator reviews legal findings and clicks "Approve & Publish to Client Portal".
            </p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case & Property</th>
                <th>Report Title & Summary</th>
                <th>Prepared By Advocate</th>
                <th>Risk Evaluation</th>
                <th>Client Portal Status</th>
                <th>Approval Decision</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-table-row">No legal reports submitted by advocates yet.</td>
                </tr>
              ) : (
                reports.map((rep) => (
                  <tr key={rep.id}>
                    <td>
                      <strong className="case-ref-pill">{rep.case_reference}</strong>
                      <div className="small-text">{rep.client_name}</div>
                      <div className="small-text">{rep.project_name}</div>
                    </td>
                    <td>
                      <strong>{rep.report_title}</strong>
                      <div className="report-summary-truncate">{rep.summary}</div>
                    </td>
                    <td>
                      <div>
                        <strong>Adv. {rep.advocate_name}</strong>
                        <div className="small-text">{rep.bar_council_id}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`risk-tag risk-${rep.risk_level.toLowerCase().replace(/\s+/g, '-')}`}>
                        {rep.risk_level}
                      </span>
                    </td>
                    <td>
                      {rep.visible_to_client ? (
                        <span className="published-badge">
                          <Eye size={13} /> Live in Client Portal
                        </span>
                      ) : (
                        <span className="withheld-badge">
                          Withheld from Client
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${rep.approval_status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {rep.approval_status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-review-action"
                        onClick={() => setReviewModal({ open: true, report: rep, feedback: rep.admin_feedback || '' })}
                      >
                        <FileCheck2 size={16} />
                        <span>Inspect & Decide</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Approve Modal */}
      {reviewModal.open && reviewModal.report && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card wide">
            <div className="admin-modal-header">
              <div>
                <h3>Admin Document Inspection & Portal Clearance</h3>
                <span className="modal-subhead">
                  Case: <strong>{reviewModal.report.case_reference}</strong> • Adv. {reviewModal.report.advocate_name}
                </span>
              </div>
              <button className="modal-close-btn" onClick={() => setReviewModal({ open: false, report: null, feedback: '' })}>
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="report-inspection-box">
                <div className="inspection-row">
                  <span className="label">Report Title:</span>
                  <h4>{reviewModal.report.report_title}</h4>
                </div>

                <div className="inspection-row">
                  <span className="label">Risk Evaluation:</span>
                  <span className={`risk-tag risk-${reviewModal.report.risk_level.toLowerCase().replace(/\s+/g, '-')}`}>
                    {reviewModal.report.risk_level}
                  </span>
                </div>

                <div className="inspection-row">
                  <span className="label">Executive Summary:</span>
                  <p className="inspection-text">{reviewModal.report.summary}</p>
                </div>

                <div className="inspection-row">
                  <span className="label">Detailed Observations:</span>
                  <p className="inspection-text">{reviewModal.report.observations}</p>
                </div>

                <div className="inspection-row">
                  <span className="label">Advocate's Formal Legal Recommendation:</span>
                  <div className="recommendation-box">
                    {reviewModal.report.advocate_recommendation}
                  </div>
                </div>

                {reviewModal.report.certificate_url && (
                  <div className="inspection-row">
                    <span className="label">Uploaded Clearance Certificate:</span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.2rem', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Award size={22} color="#D4AF37" />
                        <div>
                          <strong style={{ color: '#ffffff', display: 'block', fontSize: '0.92rem' }}>
                            {reviewModal.report.certificate_name || 'Legal_Verification_Certificate.pdf'}
                          </strong>
                          <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                            Attached by Adv. {reviewModal.report.advocate_name} • Pending your release to client
                          </span>
                        </div>
                      </div>

                      <a 
                        href={reviewModal.report.certificate_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="admin-btn-gold"
                        style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Eye size={13} />
                        <span>Inspect Certificate</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                )}

                <div className="inspection-row">
                  <span className="label">Portal Visibility State:</span>
                  <div className="status-indicator-box">
                    <strong>{reviewModal.report.approval_status}</strong>
                    <span>
                      {reviewModal.report.visible_to_client 
                        ? '🟢 Currently published in Client Portal' 
                        : '🔒 Currently withheld from Client Portal (Awaiting Admin Clearance)'}
                    </span>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: '1.2rem' }}>
                  <label>Administrator Remarks / Release Notes:</label>
                  <textarea 
                    rows={3} 
                    placeholder="Enter approval comments or revision directives for advocate..."
                    value={reviewModal.feedback}
                    onChange={(e) => setReviewModal({ ...reviewModal, feedback: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="admin-modal-footer space-between">
              <button 
                type="button" 
                className="btn-request-revision"
                onClick={() => handleAction('REQUEST_REVISION')}
              >
                <XCircle size={17} />
                <span>Request Revision (Keep Withheld)</span>
              </button>

              <div className="action-buttons-group">
                <button type="button" className="btn-modal-cancel" onClick={() => setReviewModal({ open: false, report: null, feedback: '' })}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="admin-btn-gold"
                  onClick={() => handleAction('APPROVE')}
                >
                  <CheckCircle size={17} />
                  <span>Approve & Release to Client Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminApprovals;
