import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  FolderGit2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck2, 
  ArrowRight,
  RefreshCw,
  Award,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import adminApi from '../../services/adminApi';

export const AdvocateDashboard = () => {
  const { advocate } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const totalAssigned = projects.length;
  const inReviewCount = projects.filter(p => p.status === 'In Review' || p.status === 'Assigned').length;
  const pendingAdminApproval = projects.filter(p => p.status === 'Pending Approval').length;
  const completedCount = projects.filter(p => p.status === 'Completed' || p.status === 'Approved').length;

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-title">
          <h2>Advocate Legal Dashboard</h2>
          <p>Welcome back, <strong>{advocate?.name || 'Advocate'}</strong>. Review case papers, update progress, and issue legal verification certificates.</p>
        </div>
        <div className="admin-topbar-actions">
          <button className="admin-refresh-btn" onClick={fetchProjects} disabled={loading}>
            <RefreshCw size={17} className={loading ? 'spinning' : ''} />
            <span>{loading ? 'Refreshing...' : 'Refresh Projects'}</span>
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <div className="advocate-metrics-grid">
        <div className="advocate-stat-card">
          <div className="advocate-stat-icon-wrap blue">
            <FolderGit2 size={24} />
          </div>
          <div className="advocate-stat-data">
            <h4>Assigned Projects</h4>
            <div className="advocate-stat-number">{totalAssigned}</div>
          </div>
        </div>

        <div className="advocate-stat-card">
          <div className="advocate-stat-icon-wrap amber">
            <Clock size={24} />
          </div>
          <div className="advocate-stat-data">
            <h4>Under Scrutiny</h4>
            <div className="advocate-stat-number">{inReviewCount}</div>
          </div>
        </div>

        <div className="advocate-stat-card">
          <div className="advocate-stat-icon-wrap gold">
            <AlertCircle size={24} />
          </div>
          <div className="advocate-stat-data">
            <h4>Awaiting Admin Approval</h4>
            <div className="advocate-stat-number">{pendingAdminApproval}</div>
          </div>
        </div>

        <div className="advocate-stat-card">
          <div className="advocate-stat-icon-wrap emerald">
            <CheckCircle2 size={24} />
          </div>
          <div className="advocate-stat-data">
            <h4>Completed & Approved</h4>
            <div className="advocate-stat-number">{completedCount}</div>
          </div>
        </div>
      </div>

      {/* Recent Assigned Projects Table */}
      <div className="admin-card-block">
        <div className="card-block-header">
          <div>
            <h3>Active Project Assignments</h3>
            <p className="card-sub-p">Cases assigned to your legal desk requiring title verification and certificate issuance.</p>
          </div>
          <Link to="/advocate/projects" className="admin-btn-gold" style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
            <span>Manage All Projects</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Case Reference</th>
                <th>Client Name</th>
                <th>Property & Location</th>
                <th>Service Required</th>
                <th>Current Status</th>
                <th>Certificate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-table-row">No projects currently assigned to your advocate desk.</td>
                </tr>
              ) : (
                projects.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td><strong className="case-ref-pill">{p.case_reference}</strong></td>
                    <td>
                      <strong>{p.client_name}</strong>
                      <div className="small-text">{p.client_phone}</div>
                    </td>
                    <td>
                      <div>{p.project_name}</div>
                      <div className="small-text"><MapPin size={12} /> {p.city} • {p.property_type}</div>
                    </td>
                    <td>{p.service_type}</td>
                    <td>
                      <span className={`status-pill ${p.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {p.certificate_url ? (
                        <span className="published-badge" style={{ fontSize: '0.72rem' }}>
                          <Award size={13} /> {p.certificate_name || 'Uploaded'}
                        </span>
                      ) : (
                        <span className="withheld-badge" style={{ fontSize: '0.72rem' }}>
                          Pending Upload
                        </span>
                      )}
                    </td>
                    <td>
                      <Link to="/advocate/projects" className="btn-assign-action">
                        Open Project
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdvocateDashboard;
