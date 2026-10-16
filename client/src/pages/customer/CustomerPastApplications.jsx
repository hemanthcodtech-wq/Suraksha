import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  History, 
  MapPin, 
  Award, 
  ExternalLink, 
  Plus, 
  FileCheck2,
  Calendar,
  CheckCircle2,
  FileText,
  Eye
} from 'lucide-react';

export const CustomerPastApplications = () => {
  const { customer, cases } = useOutletContext();
  const [selectedDocsCase, setSelectedDocsCase] = useState(null);

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <h2>2. Past Applications & Verification History</h2>
          <p>Review all properties, plots, and apartments submitted under your registered contact details</p>
        </div>
        <div className="admin-topbar-actions">
          <Link to="/customer/add-property" className="admin-btn-gold">
            <Plus size={16} />
            <span>Submit New Property</span>
          </Link>
        </div>
      </header>

      <div className="admin-card-block">
        <div className="card-block-header">
          <div>
            <h3>Your Property Verification Records</h3>
            <p className="card-sub-p">Total verification requests: {cases?.length || 0}</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case Ref</th>
                <th>Project / Property</th>
                <th>Category & City</th>
                <th>Uploaded Documents</th>
                <th>Assigned Advocate</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th>Certificate & Opinion</th>
              </tr>
            </thead>
            <tbody>
              {!cases || cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-row">No past applications found.</td>
                </tr>
              ) : (
                cases.map((c) => {
                  const docList = Array.isArray(c.uploaded_documents) 
                    ? c.uploaded_documents 
                    : (typeof c.uploaded_documents === 'string' ? JSON.parse(c.uploaded_documents || '[]') : []);
                  const docCount = docList.length > 0 ? docList.length : (c.documents_count || 1);

                  return (
                    <tr key={c.id}>
                      <td><strong className="case-ref-pill">{c.case_reference}</strong></td>
                      <td>
                        <strong>{c.project_name}</strong>
                        <div className="small-text">Builder: {c.seller_or_builder}</div>
                      </td>
                      <td>
                        <div>{c.property_type}</div>
                        <div className="small-text"><MapPin size={12} /> {c.city}</div>
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
                          <span>{docCount} Doc(s)</span>
                        </button>
                      </td>
                      <td>
                        {c.advocate_name ? (
                          <div>
                            <strong>{c.advocate_name}</strong>
                            <div className="small-text">{c.bar_council_id}</div>
                          </div>
                        ) : (
                          <span className="unassigned-badge">Assigning Counsel</span>
                        )}
                      </td>
                      <td>{new Date(c.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-pill ${c.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        {c.certificate_url && (c.status === 'Approved' || c.visible_to_client) ? (
                          <a 
                            href={c.certificate_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-view-cert"
                          >
                            <Award size={13} />
                            <span>Download Certificate</span>
                            <ExternalLink size={11} />
                          </a>
                        ) : c.visible_to_client ? (
                          <span className="published-badge">
                            <CheckCircle2 size={13} /> Opinion Live
                          </span>
                        ) : c.status === 'Pending Approval' ? (
                          <span className="withheld-badge" style={{ background: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.4)', color: '#fde047' }}>
                            Awaiting Admin Approval
                          </span>
                        ) : (
                          <span className="withheld-badge">In Verification</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Uploaded Documents Inspection Modal */}
      {selectedDocsCase && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card" style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={20} color="#D4AF37" />
                <h3>Your Submitted Property Documents</h3>
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
                    {selectedDocsCase.status}
                  </span>
                </div>
                <p>Property: <strong>{selectedDocsCase.project_name}</strong> ({selectedDocsCase.city})</p>
                <p>Assigned Counsel: <strong>{selectedDocsCase.advocate_name || 'Legal Desk Scrutiny'}</strong></p>
              </div>

              <h4 style={{ fontSize: '0.92rem', color: '#ebd37d', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Uploaded File Copies
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

export default CustomerPastApplications;
