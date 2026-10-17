import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FolderGit2, 
  MapPin, 
  Upload, 
  FileCheck2, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Award,
  ExternalLink,
  ShieldAlert,
  Loader2,
  FileText,
  Eye
} from 'lucide-react';
import { parseDocumentCategory } from '../../utils/documentCategories';
import { SkeletonTableRows } from '../../components/common/Skeleton';
import adminApi from '../../services/adminApi';

export const AdvocateAssignedProjects = () => {
  const { advocate } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedDocsCase, setSelectedDocsCase] = useState(null);

  // Certificate Modal State
  const [certModal, setCertModal] = useState({
    open: false,
    project: null,
    certificateName: 'Legal_Verification_Certificate.pdf',
    certificateUrl: 'https://propertysuraksha.com/legal-cert/sample-clearance.pdf'
  });

  // Prepare Legal Report Modal State
  const [reportModal, setReportModal] = useState({
    open: false,
    project: null,
    reportTitle: '',
    summary: '',
    riskLevel: 'Low Risk',
    observations: '',
    advocateRecommendation: ''
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const fetchProjects = async () => {
    if (!advocate?.id) return;
    setLoading(true);
    try {
      const res = await adminApi.getAdvocateProjects(advocate.id);
      if (res.cases) setProjects(res.cases);
    } catch (err) {
      console.error('Error fetching advocate projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [advocate?.id]);

  // Handle direct status change button / select
  const handleStatusChange = async (caseId, newStatus, projectObj) => {
    // If advocate selects 'Completed', open the Certificate Upload modal
    if (newStatus === 'Completed') {
      const proj = projectObj || projects.find(p => p.id === caseId);
      setCertModal({
        open: true,
        project: proj,
        file: null,
        certificateName: `${proj?.case_reference || 'Legal'}_Verification_Certificate.pdf`,
        certificateUrl: 'https://propertysuraksha.com/legal-cert/sample-clearance.pdf'
      });
      return;
    }

    try {
      const res = await adminApi.updateCaseStatus(caseId, advocate.id, newStatus);
      if (res.success) {
        showNotification(`Case status updated to "${newStatus}". Visible to Client and Admin.`);
        fetchProjects();
      } else {
        showNotification(res.message || 'Failed to update status', 'error');
      }
    } catch (err) {
      showNotification('Error updating case status', 'error');
    }
  };

  // Submit Certificate Upload
  const handleUploadCertificate = async (e) => {
    e.preventDefault();
    if (!certModal.project) return;
    setSubmitting(true);
    try {
      let res;
      if (certModal.file) {
        const formData = new FormData();
        formData.append('certificateFile', certModal.file);
        formData.append('advocateId', advocate.id);
        formData.append('certificateName', certModal.certificateName || certModal.file.name);
        res = await adminApi.uploadCertificate(certModal.project.id, advocate.id, formData);
      } else {
        res = await adminApi.uploadCertificate(
          certModal.project.id,
          advocate.id,
          certModal.certificateName,
          certModal.certificateUrl || 'https://propertysuraksha.com/legal-cert/sample-clearance.pdf'
        );
      }

      if (res.success) {
        showNotification(`Legal Certificate successfully uploaded to Cloudinary! Project marked as "Completed".`);
        setCertModal({ open: false, project: null, file: null, certificateName: '', certificateUrl: '' });
        fetchProjects();
      } else {
        showNotification(res.message || 'Failed to upload certificate', 'error');
      }
    } catch (err) {
      showNotification('Error submitting certificate', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Prepared Legal Report (Sends to Admin Approvals)
  const handleSubmitLegalReport = async (e) => {
    e.preventDefault();
    if (!reportModal.project) return;
    setSubmitting(true);
    try {
      const res = await adminApi.submitAdvocateReport({
        caseId: reportModal.project.id,
        advocateId: advocate.id,
        reportTitle: reportModal.reportTitle,
        summary: reportModal.summary,
        riskLevel: reportModal.riskLevel,
        observations: reportModal.observations,
        advocateRecommendation: reportModal.advocateRecommendation,
        documentsInspected: ['Title Deed', '30-Yr Encumbrance Certificate', 'RERA Sanction Copy']
      });
      if (res.success) {
        showNotification(`Legal Report submitted! Sent to Admin Approvals for final clearance.`);
        setReportModal({ open: false, project: null, reportTitle: '', summary: '', riskLevel: 'Low Risk', observations: '', advocateRecommendation: '' });
        fetchProjects();
      } else {
        showNotification(res.message || 'Failed to submit report', 'error');
      }
    } catch (err) {
      showNotification('Error submitting legal report', 'error');
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
          <h2>Assigned Projects & Certificate Center</h2>
          <p>Inspect property records, update real-time progress status, prepare legal opinions, and issue verification certificates.</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-refresh-btn" onClick={fetchProjects} disabled={loading}>
            <RefreshCw size={17} className={loading ? 'spinning' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh Projects'}</span>
          </button>
        </div>
      </header>

      <div className="admin-card-block">
        <div className="card-block-header">
          <div>
            <h3>All Assigned Cases</h3>
            <p className="card-sub-p">Total cases under your supervision: {projects.length}</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Client Particulars</th>
                <th>Property Details</th>
                <th>Customer Documents</th>
                <th>Service Type</th>
                <th>Progress Status (Dynamic)</th>
                <th>Certificate of Clearance</th>
                <th>Legal Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTableRows rows={6} columns={8} />
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-row">No assigned projects found in Neon DB for your advocate account.</td>
                </tr>
              ) : (
                projects.map((p) => {
                  const docList = Array.isArray(p.uploaded_documents) 
                    ? p.uploaded_documents 
                    : (typeof p.uploaded_documents === 'string' ? JSON.parse(p.uploaded_documents || '[]') : []);
                  const docCount = docList.length > 0 ? docList.length : (p.documents_count || 1);

                  return (
                    <tr key={p.id}>
                      <td><strong className="case-ref-pill">{p.case_reference}</strong></td>
                      <td>
                        <strong>{p.client_name}</strong>
                        <div className="small-text">{p.client_email}</div>
                        <div className="small-text">{p.client_phone}</div>
                      </td>
                      <td>
                        <strong>{p.project_name}</strong>
                        <div className="small-text"><MapPin size={12} /> {p.city} • {p.property_type}</div>
                        <div className="small-text">Builder: {p.seller_or_builder}</div>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedDocsCase(p)}
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
                      <td>{p.service_type}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span className={`status-pill ${p.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {p.status}
                        </span>
                        {/* Dynamic Status Dropdown for Advocate */}
                        <select
                          className="status-changer-select"
                          value={p.status}
                          onChange={(e) => handleStatusChange(p.id, e.target.value, p)}
                        >
                          <option value="Assigned">Assigned</option>
                          <option value="In Review">In Review</option>
                          <option value="Pending Approval">Pending Approval</option>
                          <option value="Completed">Completed (Upload Certificate & Submit for Approval)</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      {p.certificate_url ? (
                        <div>
                          <span className="published-badge">
                            <Award size={13} /> Certificate Issued
                          </span>
                          <a 
                            href={p.certificate_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-view-cert"
                          >
                            <span>{p.certificate_name || 'Download'}</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      ) : (
                        <button
                          className="btn-upload-cert"
                          onClick={() => setCertModal({
                            open: true,
                            project: p,
                            certificateName: `${p.case_reference}_Clearance_Certificate.pdf`,
                            certificateUrl: 'https://propertysuraksha.com/legal-cert/sample-clearance.pdf'
                          })}
                        >
                          <Upload size={14} />
                          <span>Upload Certificate</span>
                        </button>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn-prepare-report"
                        onClick={() => setReportModal({
                          open: true,
                          project: p,
                          reportTitle: `Comprehensive Title Due Diligence — ${p.project_name}`,
                          summary: `30-year search conducted at Sub-Registrar Office (${p.city}). The property shows clear root of title with no prior encumbrances.`,
                          riskLevel: 'Low Risk',
                          observations: '1. Link documents verified from 1994 to present.\n2. RERA registration confirmed active.\n3. Mutation register reflects current seller as lawful pattadar.',
                          advocateRecommendation: 'Title is marketable and free from legal encumbrance. Transaction may proceed safely.'
                        })}
                      >
                        <FileText size={15} />
                        <span>Prepare Legal Letter</span>
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

      {/* Upload Certificate Modal */}
      {certModal.open && certModal.project && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>Upload Legal Clearance Certificate</h3>
              <button 
                className="modal-close-btn" 
                onClick={() => !submitting && setCertModal({ open: false, project: null, certificateName: '', certificateUrl: '' })}
                disabled={submitting}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUploadCertificate}>
              <div className="admin-modal-body">
                <div className="recommendation-box" style={{ marginBottom: '1.2rem' }}>
                  <p>Case Reference: <strong>{certModal.project.case_reference}</strong></p>
                  <p>Property: <strong>{certModal.project.project_name} ({certModal.project.city})</strong></p>
                  <p>Client: <strong>{certModal.project.client_name}</strong></p>
                </div>

                <div className="admin-form-group">
                  <label>Select Legal Certificate Document (PDF or Scanned Deed) *</label>
                  <input 
                    type="file" 
                    accept=".pdf,application/pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCertModal({ 
                          ...certModal, 
                          file, 
                          certificateName: file.name 
                        });
                      }
                    }}
                    style={{ padding: '0.6rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px dashed rgba(212, 175, 55, 0.4)' }}
                  />
                  <small style={{ color: '#94a3b8', fontSize: '0.74rem', marginTop: '0.3rem', display: 'block' }}>
                    Uploaded directly to secure Cloudinary storage via Multer buffer stream.
                  </small>
                </div>

                <div className="admin-form-group">
                  <label>Document Display Title *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Legal_Verification_Certificate.pdf"
                    value={certModal.certificateName}
                    onChange={(e) => setCertModal({ ...certModal, certificateName: e.target.value })}
                  />
                </div>

                <div className="intake-notice" style={{ marginTop: '1rem' }}>
                  <Award size={18} className="intake-shield" />
                  <p>Uploading the certificate to Cloudinary will immediately mark this case as <strong>Completed</strong> and render the document accessible to both Admin and Customer.</p>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setCertModal({ open: false, project: null, certificateName: '', certificateUrl: '' })}
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
                  <span>{submitting ? 'Uploading...' : 'Confirm & Issue Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prepare Legal Report Modal */}
      {reportModal.open && reportModal.project && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card wide">
            <div className="admin-modal-header">
              <div>
                <h3>Prepare Legal Report & Recommendation</h3>
                <span className="modal-subhead">Case: <strong>{reportModal.project.case_reference}</strong> • Client: {reportModal.project.client_name}</span>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => !submitting && setReportModal({ open: false, project: null, reportTitle: '', summary: '', riskLevel: 'Low Risk', observations: '', advocateRecommendation: '' })}
                disabled={submitting}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitLegalReport}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Legal Opinion Title *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Title Clearance & Encumbrance Scrutiny Report"
                    value={reportModal.reportTitle}
                    onChange={(e) => setReportModal({ ...reportModal, reportTitle: e.target.value })}
                  />
                </div>

                <div className="modal-form-grid-2">
                  <div className="admin-form-group">
                    <label>Assessed Risk Classification *</label>
                    <select
                      value={reportModal.riskLevel}
                      onChange={(e) => setReportModal({ ...reportModal, riskLevel: e.target.value })}
                    >
                      <option value="Low Risk">🟢 Low Risk (Clean Title)</option>
                      <option value="Moderate Caution">🟡 Moderate Caution (Minor Rectifications)</option>
                      <option value="Critical Defect">🔴 Critical Defect (Litigation or Defect)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Workflow Destination</label>
                    <input 
                      type="text" 
                      disabled 
                      value="Admin Approvals Queue (Withheld until Admin clearance)"
                      style={{ opacity: 0.8 }}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Executive Legal Summary *</label>
                  <textarea 
                    rows={3} 
                    required 
                    placeholder="Summary of 30-year revenue search and property ownership chain..."
                    value={reportModal.summary}
                    onChange={(e) => setReportModal({ ...reportModal, summary: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Detailed Findings & Observations *</label>
                  <textarea 
                    rows={4} 
                    required 
                    placeholder="List specific findings from link deeds, RERA sanctions, tax receipts, or encumbrance certificates..."
                    value={reportModal.observations}
                    onChange={(e) => setReportModal({ ...reportModal, observations: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Formal Legal Recommendation for Client *</label>
                  <textarea 
                    rows={3} 
                    required 
                    placeholder="Advocate's professional verdict: clear to purchase, conditional purchase, or do not proceed..."
                    value={reportModal.advocateRecommendation}
                    onChange={(e) => setReportModal({ ...reportModal, advocateRecommendation: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setReportModal({ open: false, project: null, reportTitle: '', summary: '', riskLevel: 'Low Risk', observations: '', advocateRecommendation: '' })}
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
                  <span>{submitting ? 'Submitting to Admin...' : 'Submit for Admin Approval'}</span>
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
                    Current Status: {selectedDocsCase.status}
                  </span>
                </div>
                <p>Client: <strong>{selectedDocsCase.client_name}</strong> ({selectedDocsCase.client_phone} • {selectedDocsCase.client_email})</p>
                <p>Property: <strong>{selectedDocsCase.project_name}</strong>, {selectedDocsCase.city}</p>
                {selectedDocsCase.client_notes && (
                  <p style={{ marginTop: '0.4rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                    Client Instructions: <em>"{selectedDocsCase.client_notes}"</em>
                  </p>
                )}
              </div>

              <h4 style={{ fontSize: '0.92rem', color: '#ebd37d', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Customer Submitted Paperwork & Deeds
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
                    {docs.map((doc, idx) => {
                      const catInfo = parseDocumentCategory(doc.name || '');
                      return (
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.55rem',
                                borderRadius: '4px',
                                background: catInfo.badgeBg,
                                color: catInfo.badgeColor,
                                border: `1px solid ${catInfo.badgeColor}40`
                              }}>
                                {catInfo.category}
                              </span>
                              {catInfo.telugu && (
                                <span style={{ fontSize: '0.72rem', color: '#d97706' }}>
                                  ({catInfo.telugu})
                                </span>
                              )}
                            </div>
                            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#f8fafc' }}>
                              {catInfo.cleanName || `Document_${idx + 1}.pdf`}
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
                    );
                  })}
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

export default AdvocateAssignedProjects;
