import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  UserPlus, 
  UserCheck, 
  FileCheck2, 
  ChevronRight, 
  CheckCircle, 
  RefreshCw 
} from 'lucide-react';
import { SkeletonKpiCard, SkeletonTableRows } from '../../components/common/Skeleton';
import adminApi from '../../services/adminApi';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_cases: 0,
    new_clients_count: 0,
    assigned_in_progress_count: 0,
    active_advocates_count: 0,
    pending_approvals_count: 0,
    approved_reports_count: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, approvalsRes] = await Promise.all([
        adminApi.getDashboardStats().catch(() => ({ stats: {}, recentActivity: [] })),
        adminApi.getApprovals().catch(() => ({ reports: [] }))
      ]);

      if (statsRes.stats) setStats(statsRes.stats);
      if (statsRes.recentActivity) setRecentActivity(statsRes.recentActivity);
      if (approvalsRes.reports) {
        setPendingApprovals(approvalsRes.reports.filter(r => r.approval_status === 'Pending Approval'));
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <h2>1. Executive Legal Operations Dashboard</h2>
          <p>Real-Time Aggregation • Neon PostgreSQL Connected</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-refresh-btn" onClick={fetchDashboardData}>
            <RefreshCw size={17} className={loading ? 'spinning' : ''} />
            <span>Refresh Neon DB</span>
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="admin-stats-grid">
        {loading ? (
          <>
            <SkeletonKpiCard />
            <SkeletonKpiCard />
            <SkeletonKpiCard />
            <SkeletonKpiCard />
          </>
        ) : (
          <>
            <div className="admin-kpi-card">
              <div className="kpi-icon-wrap gold">
                <Briefcase size={24} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Total Verification Cases</span>
                <h3 className="kpi-value">{stats.total_cases || 0}</h3>
                <span className="kpi-meta">All-time property cases in DB</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrap blue">
                <UserPlus size={24} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">New Clients Awaiting</span>
                <h3 className="kpi-value">{stats.new_clients_count || 0}</h3>
                <span className="kpi-meta highlight">Pending Advocate Assignment</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrap emerald">
                <UserCheck size={24} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Active Panel Advocates</span>
                <h3 className="kpi-value">{stats.active_advocates_count || 0}</h3>
                <span className="kpi-meta">Bar-council attorneys</span>
              </div>
            </div>

            <div className="admin-kpi-card highlight-gold">
              <div className="kpi-icon-wrap amber">
                <FileCheck2 size={24} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Pending Document Approvals</span>
                <h3 className="kpi-value">{stats.pending_approvals_count || 0}</h3>
                <span className="kpi-meta gold-text">Awaiting Client Portal Release</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Two Column Grid */}
      <div className="admin-dashboard-split">
        <div className="admin-card-block">
          <div className="card-block-header">
            <h3>Recent Verification Cases</h3>
            <Link to="/admin/new-clients" className="link-btn">
              View All Clients <ChevronRight size={16} />
            </Link>
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
                {loading ? (
                  <SkeletonTableRows rows={5} columns={5} />
                ) : recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-table-row">No cases found in Neon database.</td>
                  </tr>
                ) : (
                  recentActivity.map((item) => (
                    <tr key={item.id}>
                      <td><strong className="case-ref-pill">{item.case_reference}</strong></td>
                      <td>{item.client_name}</td>
                      <td>{item.project_name}</td>
                      <td>{item.advocate_name || <span className="unassigned-badge">Needs Advocate</span>}</td>
                      <td>
                        <span className={`status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card-block">
          <div className="card-block-header">
            <h3>Awaiting Admin Approvals</h3>
            <Link to="/admin/approvals" className="link-btn">
              Open Approvals Desk <ChevronRight size={16} />
            </Link>
          </div>

          <div className="approvals-mini-list">
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton-base skeleton-shimmer" style={{ height: '70px', borderRadius: '10px' }} />
                ))}
              </div>
            ) : pendingApprovals.length === 0 ? (
              <div className="empty-state-box">
                <CheckCircle size={36} className="empty-icon" />
                <p>All advocate reports are cleared. No pending approvals.</p>
              </div>
            ) : (
              pendingApprovals.slice(0, 4).map((report) => (
                <div key={report.id} className="approval-mini-item">
                  <div className="approval-mini-content">
                    <h4>{report.report_title}</h4>
                    <p>Case: <strong>{report.case_reference}</strong> • Adv. {report.advocate_name}</p>
                    <span className="risk-tag">{report.risk_level}</span>
                  </div>
                  <Link to="/admin/approvals" className="btn-review-action">
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
