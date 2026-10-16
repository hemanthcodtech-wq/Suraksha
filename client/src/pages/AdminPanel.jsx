import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Briefcase, 
  UserCheck, 
  FileCheck2, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Plus, 
  ExternalLink,
  Shield, 
  FileText, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  RefreshCw,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import adminApi from '../services/adminApi';
import Logo from '../components/Logo';
import './AdminPanel.css';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'new-clients' | 'assigned-cases' | 'advocates' | 'approvals'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Dynamic State directly from Neon DB
  const [stats, setStats] = useState({
    total_cases: 0,
    new_clients_count: 0,
    assigned_in_progress_count: 0,
    active_advocates_count: 0,
    pending_approvals_count: 0,
    approved_reports_count: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [clients, setClients] = useState([]);
  const [assignedCases, setAssignedCases] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [approvals, setApprovals] = useState([]);

  // Modals & Active Action States
  const [assignModal, setAssignModal] = useState({ open: false, caseItem: null, advocateId: '' });
  const [newAdvocateModal, setNewAdvocateModal] = useState(false);
  const [reviewModal, setReviewModal] = useState({ open: false, report: null, feedback: '' });

  // New Advocate Form
  const [advocateForm, setAdvocateForm] = useState({
    name: '',
    email: '',
    phone: '',
    bar_council_id: '',
    specialization: 'Land Revenue & 30-Yr Encumbrance',
    experience_years: 5,
    city: 'Hyderabad',
    state: 'Telangana'
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch all live data dynamically from Express + Neon DB
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, clientsRes, assignedRes, advocatesRes, approvalsRes] = await Promise.all([
        adminApi.getDashboardStats().catch(() => ({ stats: {}, recentActivity: [] })),
        adminApi.getClients().catch(() => ({ clients: [] })),
        adminApi.getAssignedCases().catch(() => ({ assignedCases: [] })),
        adminApi.getAdvocates().catch(() => ({ advocates: [] })),
        adminApi.getApprovals().catch(() => ({ reports: [] }))
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (statsRes.recentActivity) setRecentActivity(statsRes.recentActivity);
      if (clientsRes.clients) setClients(clientsRes.clients);
      if (assignedRes.assignedCases) setAssignedCases(assignedRes.assignedCases);
      if (advocatesRes.advocates) setAdvocates(advocatesRes.advocates);
      if (approvalsRes.reports) setApprovals(approvalsRes.reports);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle assigning an advocate to a case
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignModal.advocateId) return;
    try {
      const res = await adminApi.assignAdvocate(assignModal.caseItem.id, assignModal.advocateId);
      if (res.success) {
        showNotification(`Advocate successfully assigned to Case ${assignModal.caseItem.case_reference}`);
        setAssignModal({ open: false, caseItem: null, advocateId: '' });
        fetchAllData();
      }
    } catch (err) {
      showNotification('Failed to assign advocate. Please try again.', 'error');
    }
  };

  // Handle creating a new advocate dynamically
  const handleCreateAdvocate = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.createAdvocate(advocateForm);
      if (res.success) {
        showNotification(`Advocate ${advocateForm.name} added to verification panel`);
        setNewAdvocateModal(false);
        setAdvocateForm({
          name: '',
          email: '',
          phone: '',
          bar_council_id: '',
          specialization: 'Land Revenue & 30-Yr Encumbrance',
          experience_years: 5,
          city: 'Hyderabad',
          state: 'Telangana'
        });
        fetchAllData();
      } else {
        showNotification(res.message || 'Error creating advocate', 'error');
      }
    } catch (err) {
      showNotification('Server error creating advocate', 'error');
    }
  };

  // Handle Admin Approval or Revision Request
  const handleApprovalSubmit = async (action) => {
    if (!reviewModal.report) return;
    try {
      const res = await adminApi.handleApprovalAction(
        reviewModal.report.id, 
        action, 
        reviewModal.feedback
      );
      if (res.success) {
        if (action === 'APPROVE') {
          showNotification(`Document Approved! Report is now live and published to the Client Portal.`);
        } else {
          showNotification(`Revision requested from advocate. Report remains withheld from Client Portal.`, 'warning');
        }
        setReviewModal({ open: false, report: null, feedback: '' });
        fetchAllData();
      }
    } catch (err) {
      showNotification('Failed to process approval action.', 'error');
    }
  };

  return (
    <div className="admin-portal-wrapper">
      {/* Toast Notification */}
      {notification && (
        <div className={`admin-toast-alert ${notification.type}`}>
          {notification.type === 'success' && <CheckCircle size={18} />}
          {notification.type === 'error' && <XCircle size={18} />}
          {notification.type === 'warning' && <AlertTriangle size={18} />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-box">
            <Logo size="normal" />
          </div>
          <span className="admin-console-tag">Admin Legal Operations</span>
        </div>

        <nav className="admin-nav-menu">
          <button 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>1. Dashboard</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'new-clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('new-clients')}
          >
            <UserPlus size={20} />
            <span>2. New Clients</span>
            {Number(stats.new_clients_count) > 0 && (
              <span className="nav-badge-pill">{stats.new_clients_count}</span>
            )}
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'assigned-cases' ? 'active' : ''}`}
            onClick={() => setActiveTab('assigned-cases')}
          >
            <Briefcase size={20} />
            <span>3. Advocates Assigned</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'advocates' ? 'active' : ''}`}
            onClick={() => setActiveTab('advocates')}
          >
            <UserCheck size={20} />
            <span>4. Advocates Creation</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            <FileCheck2 size={20} />
            <span>5. Approvals</span>
            {Number(stats.pending_approvals_count) > 0 && (
              <span className="nav-badge-pill gold">{stats.pending_approvals_count}</span>
            )}
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-avatar">AD</div>
            <div className="admin-user-details">
              <strong>Admin Legal Officer</strong>
              <span>admin@propertysuraksha.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-viewport">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <h2>
              {activeTab === 'dashboard' && 'Executive Legal Operations Dashboard'}
              {activeTab === 'new-clients' && 'New Client Verification Requests'}
              {activeTab === 'assigned-cases' && 'Assigned Cases & Workflow Tracking'}
              {activeTab === 'advocates' && 'Advocate Directory & Registration'}
              {activeTab === 'approvals' && 'Advocate Document Approvals for Client Portal'}
            </h2>
            <p>Property Suraksha Central Intelligence • Neon PostgreSQL Powered</p>
          </div>

          <div className="admin-topbar-actions">
            <button 
              className="admin-refresh-btn" 
              onClick={fetchAllData}
              title="Refresh live Neon DB data"
            >
              <RefreshCw size={17} className={loading ? 'spinning' : ''} />
              <span>Refresh</span>
            </button>

            {activeTab === 'advocates' && (
              <button 
                className="admin-btn-gold"
                onClick={() => setNewAdvocateModal(true)}
              >
                <Plus size={18} />
                <span>Add Advocate</span>
              </button>
            )}
          </div>
        </header>

        {/* ==============================================================
            TAB 1: DASHBOARD
            ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="admin-tab-content fade-in">
            {/* KPI Metrics Cards */}
            <div className="admin-stats-grid">
              <div className="admin-kpi-card">
                <div className="kpi-icon-wrap gold">
                  <Briefcase size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Verification Cases</span>
                  <h3 className="kpi-value">{stats.total_cases || 0}</h3>
                  <span className="kpi-meta">All-time property cases</span>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-icon-wrap blue">
                  <UserPlus size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">New Clients Awaiting</span>
                  <h3 className="kpi-value">{stats.new_clients_count || 0}</h3>
                  <span className="kpi-meta highlight">Pending Advocate assignment</span>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="kpi-icon-wrap emerald">
                  <UserCheck size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Active Panel Advocates</span>
                  <h3 className="kpi-value">{stats.active_advocates_count || 0}</h3>
                  <span className="kpi-meta">Bar-admitted legal specialists</span>
                </div>
              </div>

              <div className="admin-kpi-card highlight-gold">
                <div className="kpi-icon-wrap amber">
                  <FileCheck2 size={24} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Pending Admin Approvals</span>
                  <h3 className="kpi-value">{stats.pending_approvals_count || 0}</h3>
                  <span className="kpi-meta gold-text">Awaiting Client Portal Release</span>
                </div>
              </div>
            </div>

            {/* Quick Overview Tables */}
            <div className="admin-dashboard-split">
              <div className="admin-card-block">
                <div className="card-block-header">
                  <h3>Recent Verification Activity</h3>
                  <button className="link-btn" onClick={() => setActiveTab('new-clients')}>
                    View All Clients <ChevronRight size={16} />
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Case Ref</th>
                        <th>Client</th>
                        <th>Property</th>
                        <th>Assigned To</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="empty-table-row">No cases found in database.</td>
                        </tr>
                      ) : (
                        recentActivity.map((item) => (
                          <tr key={item.id}>
                            <td><strong className="case-ref-pill">{item.case_reference}</strong></td>
                            <td>{item.client_name}</td>
                            <td>{item.project_name}</td>
                            <td>{item.advocate_name || <span className="unassigned-text">Unassigned</span>}</td>
                            <td><span className={`status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-card-block">
                <div className="card-block-header">
                  <h3>Pending Advocate Approvals</h3>
                  <button className="link-btn" onClick={() => setActiveTab('approvals')}>
                    Open Approvals Desk <ChevronRight size={16} />
                  </button>
                </div>

                <div className="approvals-mini-list">
                  {approvals.filter(r => r.approval_status === 'Pending Approval').length === 0 ? (
                    <div className="empty-state-box">
                      <CheckCircle size={36} className="empty-icon" />
                      <p>All advocate reports are cleared. No pending approvals.</p>
                    </div>
                  ) : (
                    approvals
                      .filter(r => r.approval_status === 'Pending Approval')
                      .slice(0, 4)
                      .map((report) => (
                        <div key={report.id} className="approval-mini-item">
                          <div className="approval-mini-content">
                            <h4>{report.report_title}</h4>
                            <p>Case: <strong>{report.case_reference}</strong> • Adv. {report.advocate_name}</p>
                            <span className="risk-tag">{report.risk_level}</span>
                          </div>
                          <button 
                            className="btn-review-mini"
                            onClick={() => {
                              setReviewModal({ open: true, report, feedback: '' });
                            }}
                          >
                            Review & Approve
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 2: NEW CLIENTS
            ============================================================== */}
        {activeTab === 'new-clients' && (
          <div className="admin-tab-content fade-in">
            <div className="admin-card-block">
              <div className="card-block-header">
                <div>
                  <h3>Client Verification Cases</h3>
                  <p className="card-sub-p">All incoming verification requests submitted via the customer intake portal.</p>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Case Ref</th>
                      <th>Client Name & Contact</th>
                      <th>Service Type</th>
                      <th>Property & Builder</th>
                      <th>Documents</th>
                      <th>Assigned Advocate</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty-table-row">No client cases registered yet.</td>
                      </tr>
                    ) : (
                      clients.map((c) => (
                        <tr key={c.id}>
                          <td><strong className="case-ref-pill">{c.case_reference}</strong></td>
                          <td>
                            <div className="client-meta-cell">
                              <strong>{c.client_name}</strong>
                              <span>{c.client_phone}</span>
                              <span className="email-sub">{c.client_email}</span>
                            </div>
                          </td>
                          <td><span className="service-category-tag">{c.service_type}</span></td>
                          <td>
                            <div className="property-meta-cell">
                              <strong>{c.project_name}</strong>
                              <span>{c.seller_or_builder}</span>
                              <span className="city-sub"><MapPin size={12} /> {c.city}</span>
                            </div>
                          </td>
                          <td>
                            <span className="docs-badge">{c.documents_count || 1} files</span>
                          </td>
                          <td>
                            {c.advocate_name ? (
                              <div className="advocate-cell-info">
                                <Award size={14} className="gold-icon" />
                                <span>{c.advocate_name}</span>
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 3: ADVOCATES ASSIGNED
            ============================================================== */}
        {activeTab === 'assigned-cases' && (
          <div className="admin-tab-content fade-in">
            <div className="admin-card-block">
              <div className="card-block-header">
                <div>
                  <h3>Assigned Cases & Active Legal Due Diligence</h3>
                  <p className="card-sub-p">Track properties currently under legal inspection by bar-council advocates.</p>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Assigned Advocate</th>
                      <th>Bar Council ID</th>
                      <th>Client & Property</th>
                      <th>Assigned Date</th>
                      <th>Investigation Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedCases.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty-table-row">No active assigned cases found.</td>
                      </tr>
                    ) : (
                      assignedCases.map((ac) => (
                        <tr key={ac.id}>
                          <td><strong className="case-ref-pill">{ac.case_reference}</strong></td>
                          <td>
                            <div className="advocate-cell-info">
                              <strong>{ac.advocate_name}</strong>
                              <span>{ac.advocate_specialization}</span>
                            </div>
                          </td>
                          <td><code>{ac.bar_council_id}</code></td>
                          <td>
                            <strong>{ac.client_name}</strong>
                            <div className="small-text">{ac.project_name} ({ac.city})</div>
                          </td>
                          <td>{new Date(ac.assigned_at || ac.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-pill ${ac.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {ac.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-assign-action"
                              onClick={() => setAssignModal({ open: true, caseItem: ac, advocateId: ac.assigned_advocate_id })}
                            >
                              Reassign
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 4: ADVOCATES CREATION & DIRECTORY
            ============================================================== */}
        {activeTab === 'advocates' && (
          <div className="admin-tab-content fade-in">
            <div className="admin-card-block">
              <div className="card-block-header">
                <div>
                  <h3>Panel Advocates Registry</h3>
                  <p className="card-sub-p">Bar-admitted property verification attorneys on the Property Suraksha panel.</p>
                </div>
                <button 
                  className="admin-btn-gold"
                  onClick={() => setNewAdvocateModal(true)}
                >
                  <Plus size={18} />
                  <span>Register New Advocate</span>
                </button>
              </div>

              <div className="advocates-cards-grid">
                {advocates.length === 0 ? (
                  <div className="empty-table-row" style={{ gridColumn: '1/-1' }}>
                    No advocates registered. Click "Register New Advocate" to add legal counsel.
                  </div>
                ) : (
                  advocates.map((adv) => (
                    <div key={adv.id} className="advocate-profile-card">
                      <div className="adv-card-header">
                        <div className="adv-avatar-circle">
                          {adv.name.replace('Adv. ', '').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4>{adv.name}</h4>
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
                          <strong>{adv.experience_years} Years</strong>
                        </div>
                        <div>
                          <span>Rating</span>
                          <strong>★ {adv.rating || '5.0'}</strong>
                        </div>
                        <div>
                          <span>Jurisdiction</span>
                          <strong>{adv.city}</strong>
                        </div>
                      </div>

                      <div className="adv-contact-strip">
                        <span><Phone size={13} /> {adv.phone}</span>
                        <span><Mail size={13} /> {adv.email}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 5: APPROVALS (Advocate checks -> Admin approval -> Client Portal)
            ============================================================== */}
        {activeTab === 'approvals' && (
          <div className="admin-tab-content fade-in">
            <div className="admin-card-block">
              <div className="card-block-header">
                <div>
                  <h3>Document Approvals & Client Portal Release Desk</h3>
                  <p className="card-sub-p">
                    Advocates submit legal opinion reports here. Once approved by the Administrator, 
                    the report is officially published and made accessible in the client's portal.
                  </p>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Case & Client</th>
                      <th>Report Title</th>
                      <th>Prepared By (Advocate)</th>
                      <th>Risk Assessment</th>
                      <th>Client Portal Visibility</th>
                      <th>Status</th>
                      <th>Review & Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvals.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty-table-row">No legal reports submitted by advocates yet.</td>
                      </tr>
                    ) : (
                      approvals.map((rep) => (
                        <tr key={rep.id}>
                          <td>
                            <strong className="case-ref-pill">{rep.case_reference}</strong>
                            <div className="small-text">{rep.client_name} ({rep.project_name})</div>
                          </td>
                          <td>
                            <strong>{rep.report_title}</strong>
                            <div className="report-summary-truncate">{rep.summary}</div>
                          </td>
                          <td>
                            <div className="advocate-cell-info">
                              <strong>Adv. {rep.advocate_name}</strong>
                              <span>{rep.bar_council_id}</span>
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
                                <Eye size={13} /> Visible in Client Portal
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
                              <span>Inspect Document</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==============================================================
          MODAL 1: ASSIGN ADVOCATE
          ============================================================== */}
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
                <div className="modal-info-box">
                  <p>Case Reference: <strong>{assignModal.caseItem?.case_reference}</strong></p>
                  <p>Client: <strong>{assignModal.caseItem?.client_name}</strong></p>
                  <p>Property: <strong>{assignModal.caseItem?.project_name} ({assignModal.caseItem?.city})</strong></p>
                  <p>Service Required: <strong>{assignModal.caseItem?.service_type}</strong></p>
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
                <button type="button" className="btn-modal-cancel" onClick={() => setAssignModal({ open: false, caseItem: null, advocateId: '' })}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-gold">
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL 2: REGISTER NEW ADVOCATE
          ============================================================== */}
      {newAdvocateModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card wide">
            <div className="admin-modal-header">
              <h3>Register New Panel Advocate</h3>
              <button className="modal-close-btn" onClick={() => setNewAdvocateModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAdvocate}>
              <div className="admin-modal-body">
                <div className="modal-form-grid-2">
                  <div className="admin-form-group">
                    <label>Advocate Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Adv. Arvind Swaminathan"
                      value={advocateForm.name}
                      onChange={(e) => setAdvocateForm({ ...advocateForm, name: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Bar Council Enrollment ID *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. TS/1042/2016"
                      value={advocateForm.bar_council_id}
                      onChange={(e) => setAdvocateForm({ ...advocateForm, bar_council_id: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="advocate@propertysuraksha.com"
                      value={advocateForm.email}
                      onChange={(e) => setAdvocateForm({ ...advocateForm, email: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="+91 98765 00000"
                      value={advocateForm.phone}
                      onChange={(e) => setAdvocateForm({ ...advocateForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Primary Specialization *</label>
                    <select 
                      value={advocateForm.specialization}
                      onChange={(e) => setAdvocateForm({ ...advocateForm, specialization: e.target.value })}
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
                      value={advocateForm.experience_years}
                      onChange={(e) => setAdvocateForm({ ...advocateForm, experience_years: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Practicing City *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Hyderabad"
                      value={advocateForm.city}
                      onChange={(e) => setAdvocateForm({ ...advocateForm, city: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>State *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Telangana"
                      value={advocateForm.state}
                      onChange={(e) => setAdvocateForm({ ...advocateForm, state: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setNewAdvocateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn-gold">
                  Register Advocate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL 3: INSPECT & APPROVE ADVOCATE REPORT FOR CLIENT PORTAL
          ============================================================== */}
      {reviewModal.open && reviewModal.report && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card wide">
            <div className="admin-modal-header">
              <div>
                <h3>Admin Document Inspection & Client Portal Approval</h3>
                <span className="modal-subhead">
                  Case: <strong>{reviewModal.report.case_reference}</strong> • Prepared by Adv. {reviewModal.report.advocate_name}
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
                  <span className="label">Detailed Legal Observations:</span>
                  <p className="inspection-text">{reviewModal.report.observations}</p>
                </div>

                <div className="inspection-row">
                  <span className="label">Advocate's Formal Recommendation:</span>
                  <div className="recommendation-box">
                    {reviewModal.report.advocate_recommendation}
                  </div>
                </div>

                <div className="inspection-row">
                  <span className="label">Current Status:</span>
                  <div className="status-indicator-box">
                    <strong>{reviewModal.report.approval_status}</strong>
                    <span>
                      {reviewModal.report.visible_to_client 
                        ? '🟢 Currently LIVE and visible in Client Portal' 
                        : '🔒 Currently WITHHELD from Client Portal until you approve'}
                    </span>
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginTop: '1.2rem' }}>
                  <label>Administrator Remarks / Release Instructions (Optional):</label>
                  <textarea 
                    rows={3} 
                    placeholder="Enter approval notes or revision instructions for the advocate..."
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
                onClick={() => handleApprovalSubmit('REQUEST_REVISION')}
              >
                <XCircle size={17} />
                <span>Request Revision (Withhold from Client)</span>
              </button>

              <div className="action-buttons-group">
                <button type="button" className="btn-modal-cancel" onClick={() => setReviewModal({ open: false, report: null, feedback: '' })}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="admin-btn-gold"
                  onClick={() => handleApprovalSubmit('APPROVE')}
                >
                  <CheckCircle size={17} />
                  <span>Approve & Publish to Client Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
