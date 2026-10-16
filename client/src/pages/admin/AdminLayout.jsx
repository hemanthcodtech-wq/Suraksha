import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Briefcase, 
  UserCheck, 
  FileCheck2,
  ArrowLeft,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import Logo from '../../components/Logo';
import adminApi from '../../services/adminApi';
import './Admin.css';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [badgeCounts, setBadgeCounts] = useState({
    newClients: 0,
    pendingApprovals: 0
  });

  const handleLogout = () => {
    localStorage.removeItem('suraksha_admin');
    navigate('/login');
  };

  // Fetch live badge counts across admin routes without reloading layout
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const statsRes = await adminApi.getDashboardStats().catch(() => ({ stats: {} }));
        if (statsRes.stats) {
          setBadgeCounts({
            newClients: Number(statsRes.stats.new_clients_count) || 0,
            pendingApprovals: Number(statsRes.stats.pending_approvals_count) || 0
          });
        }
      } catch (err) {
        // silent catch
      }
    };
    fetchBadges();
  }, []);

  return (
    <div className="admin-portal-wrapper">
      {/* Mobile Top App Bar */}
      <div className="admin-mobile-header">
        <div className="admin-mobile-logo">
          <Logo size="normal" />
        </div>
        <button 
          className="admin-mobile-toggle-btn"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle Admin Navigation"
        >
          {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileNavOpen && (
        <div 
          className="admin-mobile-backdrop" 
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Persistent Sidebar (NEVER unmounts when switching admin pages) */}
      <aside className={`admin-sidebar ${mobileNavOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-box">
            <Logo size="normal" />
          </div>
          <span className="admin-console-tag">Legal Operations Admin</span>
        </div>

        <nav className="admin-nav-menu">
          <NavLink 
            to="/admin/dashboard" 
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>1. Dashboard</span>
          </NavLink>

          <NavLink 
            to="/admin/new-clients" 
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <UserPlus size={20} />
            <span>2. New Clients</span>
            {badgeCounts.newClients > 0 && (
              <span className="nav-badge-pill">{badgeCounts.newClients}</span>
            )}
          </NavLink>

          <NavLink 
            to="/admin/assigned-advocates" 
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Briefcase size={20} />
            <span>3. Advocates Assigned</span>
          </NavLink>

          <NavLink 
            to="/admin/advocates-creation" 
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <UserCheck size={20} />
            <span>4. Advocates Creation</span>
          </NavLink>

          <NavLink 
            to="/admin/approvals" 
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <FileCheck2 size={20} />
            <span>5. Approvals</span>
            {badgeCounts.pendingApprovals > 0 && (
              <span className="nav-badge-pill gold">{badgeCounts.pendingApprovals}</span>
            )}
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-return-home-link">
            <ArrowLeft size={16} />
            <span>Back to Public Website</span>
          </NavLink>

          <div className="admin-user-pill">
            <div className="admin-avatar">AD</div>
            <div className="admin-user-details">
              <strong>Admin Legal Officer</strong>
              <span>admin@propertysuraksha.com</span>
            </div>
          </div>

          <button 
            type="button" 
            className="admin-logout-btn"
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.6rem', 
              padding: '0.65rem', 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.25)', 
              color: '#fca5a5', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '600',
              marginTop: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport rendered via React Router Outlet */}
      <main className="admin-main-viewport">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
