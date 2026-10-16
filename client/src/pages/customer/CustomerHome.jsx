import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  FileCheck2,
  Lock,
  Plus,
  FileText,
  Eye
} from 'lucide-react';

export const CustomerHome = () => {
  const { customer, cases } = useOutletContext();
  const [selectedCase, setSelectedCase] = useState(cases?.[0] || null);

  // Auto-sync selectedCase whenever cases update (e.g. fresh DB fetch)
  React.useEffect(() => {
    if (cases && cases.length > 0) {
      if (selectedCase) {
        const fresh = cases.find(c => c.id === selectedCase.id || c.case_reference === selectedCase.case_reference);
        setSelectedCase(fresh || cases[0]);
      } else {
        setSelectedCase(cases[0]);
      }
    }
  }, [cases]);

  const getWorkflowStep = (status) => {
    switch (status) {
      case 'New': return 1;
      case 'Assigned': return 2;
      case 'In Review': return 2;
      case 'Pending Approval': return 3;
      case 'Approved': return 4;
      case 'Completed': return 4;
      default: return 1;
    }
  };

  const currentStep = selectedCase ? getWorkflowStep(selectedCase.status) : 1;

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <h2>1. Customer Verification Dashboard</h2>
          <p>Welcome, <strong>{customer?.name || 'Valued Client'}</strong>. Track your property verification progress and legal opinion letter.</p>
        </div>
        <div className="admin-topbar-actions">
          <button 
            type="button" 
            className="admin-refresh-btn"
            onClick={async () => {
              if (customer?.email) {
                const res = await adminApi.getCustomerCases(customer.email);
                if (res.success && res.cases) {
                  localStorage.setItem('suraksha_customer_cases', JSON.stringify(res.cases));
                  window.location.reload();
                }
              }
            }}
            style={{ marginRight: '0.8rem' }}
          >
            <Clock size={16} />
            <span>Sync Live DB</span>
          </button>
          <Link to="/customer/add-property" className="admin-btn-gold">
            <Plus size={16} />
            <span>Add New Property</span>
          </Link>
        </div>
      </header>

      {/* Case Selector Tabs */}
      {cases?.length > 1 && (
        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', marginBottom: '2rem' }}>
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c)}
              style={{
                background: selectedCase?.id === c.id ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${selectedCase?.id === c.id ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)'}`,
                color: selectedCase?.id === c.id ? '#ebd37d' : '#94a3b8',
                padding: '0.65rem 1.2rem',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.86rem',
                cursor: 'pointer'
              }}
            >
              {c.case_reference} — {c.project_name}
            </button>
          ))}
        </div>
      )}

      {selectedCase ? (
        <>
          {/* 4-Stage Verification Stepper */}
          <div style={{ background: '#051426', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '2.2rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="case-ref-pill" style={{ fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>{selectedCase.case_reference}</span>
                <h3 style={{ margin: '0.6rem 0 0.2rem', fontSize: '1.35rem', color: '#ffffff' }}>{selectedCase.project_name}</h3>
                <div style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
                  <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  {selectedCase.city} • {selectedCase.property_type} • Service: {selectedCase.service_type}
                </div>
              </div>
              <span className={`status-pill ${selectedCase.status?.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
                {selectedCase.status}
              </span>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', position: 'relative' }}>
              <div style={{ background: currentStep >= 1 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)', border: `1px solid ${currentStep >= 1 ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`, borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 1 ? '#10b981' : 'rgba(255, 255, 255, 0.1)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem', fontWeight: '800' }}>1</div>
                <strong style={{ fontSize: '0.88rem', color: currentStep >= 1 ? '#ffffff' : '#64748b' }}>Case Submitted</strong>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.2rem' }}>Intake documents logged</div>
              </div>

              <div style={{ background: currentStep >= 2 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)', border: `1px solid ${currentStep >= 2 ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`, borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 2 ? '#10b981' : 'rgba(255, 255, 255, 0.1)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem', fontWeight: '800' }}>2</div>
                <strong style={{ fontSize: '0.88rem', color: currentStep >= 2 ? '#ffffff' : '#64748b' }}>Advocate Assigned</strong>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.2rem' }}>Title search in progress</div>
              </div>

              <div style={{ background: currentStep >= 3 ? 'rgba(234, 179, 8, 0.18)' : 'rgba(255, 255, 255, 0.03)', border: `1px solid ${currentStep >= 3 ? '#eab308' : 'rgba(255, 255, 255, 0.08)'}`, borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 3 ? '#eab308' : 'rgba(255, 255, 255, 0.1)', color: '#051426', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem', fontWeight: '800' }}>3</div>
                <strong style={{ fontSize: '0.88rem', color: currentStep >= 3 ? '#ffffff' : '#64748b' }}>Admin Clearance</strong>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.2rem' }}>Quality check by Senior Admin</div>
              </div>

              <div style={{ background: currentStep >= 4 ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.03)', border: `1px solid ${currentStep >= 4 ? '#D4AF37' : 'rgba(255, 255, 255, 0.08)'}`, borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: currentStep >= 4 ? '#D4AF37' : 'rgba(255, 255, 255, 0.1)', color: '#051426', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.6rem', fontWeight: '800' }}>4</div>
                <strong style={{ fontSize: '0.88rem', color: currentStep >= 4 ? '#ebd37d' : '#64748b' }}>Report Approved</strong>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.2rem' }}>Published & live in portal</div>
              </div>
            </div>
          </div>

          {/* Assigned Advocate Section */}
          {selectedCase.advocate_name ? (
            <div style={{ background: '#051426', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.8rem 2.2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div className="advocate-avatar" style={{ width: '52px', height: '52px', fontSize: '1.2rem' }}>
                  {selectedCase.advocate_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.76rem', color: '#ebd37d', textTransform: 'uppercase', fontWeight: '700' }}>Assigned Legal Counsel</div>
                  <h3 style={{ margin: '0.2rem 0', color: '#ffffff', fontSize: '1.2rem' }}>{selectedCase.advocate_name}</h3>
                  <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                    BCI ID: <code>{selectedCase.bar_council_id}</code> • {selectedCase.advocate_specialization || 'Property Advocate'}
                  </div>
                </div>
              </div>

              {selectedCase.certificate_url && (selectedCase.status === 'Approved' || selectedCase.visible_to_client) && (
                <a 
                  href={selectedCase.certificate_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="admin-btn-gold"
                  style={{ padding: '0.65rem 1.2rem' }}
                >
                  <Award size={16} />
                  <span>Download Clearance Certificate</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ) : (
            <div className="intake-notice" style={{ marginBottom: '2.5rem' }}>
              <Clock size={20} className="intake-shield" />
              <p>Our senior legal desk has received your property particulars. An advocate from our verified legal panel is being assigned to your case.</p>
            </div>
          )}

          {/* Your Uploaded Documents Section */}
          <div style={{ background: '#051426', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.8rem 2.2rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={20} color="#D4AF37" />
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.15rem' }}>Your Uploaded Property Documents</h3>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Being scrutinized by advocate {selectedCase.advocate_name ? `(${selectedCase.advocate_name})` : ''}
              </span>
            </div>

            {(() => {
              const docs = Array.isArray(selectedCase.uploaded_documents)
                ? selectedCase.uploaded_documents
                : (typeof selectedCase.uploaded_documents === 'string'
                    ? JSON.parse(selectedCase.uploaded_documents || '[]')
                    : []);

              if (docs.length === 0) {
                return (
                  <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', color: '#94a3b8', fontSize: '0.88rem' }}>
                    Standard property intake paperwork logged with registration desk.
                  </div>
                );
              }

              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {docs.map((doc, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.9rem 1.1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        borderRadius: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                        <FileText size={18} color="#60a5fa" style={{ flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden' }}>
                          <strong style={{ display: 'block', fontSize: '0.88rem', color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {doc.name || `Document_${idx + 1}.pdf`}
                          </strong>
                          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                            {doc.size ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB` : 'Verified Copy'}
                          </span>
                        </div>
                      </div>

                      <a 
                        href={doc.url || 'https://res.cloudinary.com/demo/image/upload/sample.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'rgba(212, 175, 55, 0.12)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                          color: '#ebd37d',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          textDecoration: 'none',
                          flexShrink: 0
                        }}
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </a>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Approved Legal Report Section (Rendered when Admin Approves) */}
          {selectedCase.visible_to_client ? (
            <div style={{ background: '#051426', border: '1.5px solid rgba(212, 175, 55, 0.45)', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.4rem', marginBottom: '1.8rem' }}>
                <div>
                  <span className="published-badge" style={{ marginBottom: '0.6rem' }}>
                    <CheckCircle size={14} /> Certified by Property Suraksha Legal Board
                  </span>
                  <h2 style={{ color: '#ffffff', margin: '0.3rem 0 0', fontSize: '1.5rem' }}>{selectedCase.report_title}</h2>
                </div>
                <span className={`risk-tag risk-${selectedCase.risk_level?.toLowerCase().replace(/\s+/g, '-')}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                  {selectedCase.risk_level}
                </span>
              </div>

              <div className="report-inspection-box" style={{ background: 'transparent', padding: 0 }}>
                <div className="inspection-row">
                  <span className="label">Executive Summary:</span>
                  <p className="inspection-text">{selectedCase.report_summary}</p>
                </div>

                <div className="inspection-row">
                  <span className="label">Title Observations:</span>
                  <p className="inspection-text">{selectedCase.observations}</p>
                </div>

                <div className="inspection-row">
                  <span className="label">Formal Legal Recommendation:</span>
                  <div className="recommendation-box" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                    {selectedCase.advocate_recommendation}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.12)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center' }}>
              <Lock size={36} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
              <h3 style={{ color: '#ffffff', margin: '0 0 0.5rem', fontSize: '1.2rem' }}>Legal Report Under Administrator Clearance</h3>
              <p style={{ color: '#94a3b8', maxWidth: '580px', margin: '0 auto', fontSize: '0.92rem' }}>
                The advocate's legal findings and verification report are currently undergoing mandatory quality checks by our Senior Administrator. As soon as admin clearance is granted, the full report and certificate will immediately display here.
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
          No verification cases found for this account. Click "Add New Property" to start.
        </div>
      )}
    </>
  );
};

export default CustomerHome;
