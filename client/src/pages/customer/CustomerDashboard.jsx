import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  FileCheck2, 
  MapPin, 
  Award, 
  ExternalLink, 
  User, 
  LogOut,
  RefreshCw,
  AlertTriangle,
  Lock,
  ChevronRight
} from 'lucide-react';
import '../advocate/Advocate.css';
import '../admin/Admin.css';

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedCust = localStorage.getItem('suraksha_customer');
    const storedCases = localStorage.getItem('suraksha_customer_cases');

    if (storedCust) {
      try {
        setCustomer(JSON.parse(storedCust));
      } catch (e) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }

    if (storedCases) {
      try {
        const parsed = JSON.parse(storedCases);
        setCases(parsed);
        if (parsed.length > 0) setSelectedCase(parsed[0]);
      } catch (e) {
        setCases([]);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('suraksha_customer');
    localStorage.removeItem('suraksha_customer_cases');
    navigate('/login');
  };

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
    <div className="site-container" style={{ background: '#030812', minHeight: '100vh', color: '#f8fafc', padding: '2.5rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Navbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.8rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <Logo size="normal" />
            <span className="advocate-console-tag" style={{ margin: 0 }}>
              <ShieldCheck size={13} />
              <span>Customer Verification Portal</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#ffffff' }}>{customer?.name || 'Valued Client'}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{customer?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.5rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem' }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Welcome Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(11, 45, 82, 0.6) 0%, rgba(5, 20, 38, 0.9) 100%)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '16px', padding: '2rem 2.5rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#ffffff', margin: '0 0 0.5rem' }}>
              Your Real-Time <span style={{ color: '#ebd37d' }}>Verification Tracker</span>
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0, maxWidth: '650px' }}>
              Track the progress of your title scrutiny, assigned bar-admitted advocate, and official clearance certificate approved by Property Suraksha Administrator.
            </p>
          </div>
          <Link to="/get-started" className="admin-btn-gold" style={{ padding: '0.75rem 1.4rem' }}>
            <span>+ Submit Another Property</span>
          </Link>
        </div>

        {/* Case Selector Tabs if multiple properties */}
        {cases.length > 1 && (
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem' }}>
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

            {/* Advocate Details Card */}
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

                {selectedCase.certificate_url && (
                  <a 
                    href={selectedCase.certificate_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="admin-btn-gold"
                    style={{ padding: '0.65rem 1.2rem' }}
                  >
                    <Award size={16} />
                    <span>Download Official Clearance Certificate</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ) : (
              <div className="intake-notice" style={{ marginBottom: '2.5rem' }}>
                <Clock size={20} className="intake-shield" />
                <p>Our senior legal desk has received your records. An advocate from our verified legal panel is being assigned to your case.</p>
              </div>
            )}

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
            No verification cases found for this account.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
