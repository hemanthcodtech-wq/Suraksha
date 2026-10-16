import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../components/Logo';
import { 
  LayoutDashboard, 
  FolderGit2, 
  UserCheck, 
  KeyRound, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  Scale
} from 'lucide-react';
import './Advocate.css';
import '../admin/Admin.css';

export const AdvocateLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [advocate, setAdvocate] = useState(null);

  useEffect(() => {
    // Read logged-in advocate from localStorage or demo defaults
    const stored = localStorage.getItem('suraksha_advocate');
    if (stored) {
      try {
        setAdvocate(JSON.parse(stored));
      } catch (e) {
        // Fallback demo advocate
        setAdvocate({ id: 1, name: 'Adv. Ramesh Sharma', email: 'advocate.sharma@propertysuraksha.com', bar_council_id: 'TS/8842/2012' });
      }
    } else {
      // Default fallback advocate for testing
      setAdvocate({ id: 1, name: 'Adv. Ramesh Sharma', email: 'advocate.sharma@propertysuraksha.com', bar_council_id: 'TS/8842/2012' });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('suraksha_advocate');
    navigate('/login');
  };

  const navLinks = [
    { to: '/advocate/dashboard', icon: LayoutDashboard, label: 'Advocate Dashboard' },
    { to: '/advocate/projects', icon: FolderGit2, label: 'Assigned Projects & Certificates' },
    { to: '/advocate/profile', icon: UserCheck, label: 'Advocate Profile' },
    { to: '/advocate/reset-password', icon: KeyRound, label: 'Password Reset' },
  ];

  return (
    <div className="advocate-portal-wrapper">
      {/* Mobile Top Bar */}
      <header className="advocate-mobile-header">
        <div className="admin-mobile-logo">
          <Logo size="small" />
        </div>
        <button 
          className="advocate-mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Drawer"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div className="admin-mobile-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Persistent Sidebar */}
      <aside className={`advocate-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="advocate-sidebar-header">
          <div className="admin-logo-box">
            <Logo size="normal" />
          </div>
          <span className="advocate-console-tag">
            <Scale size={13} />
            <span>Advocate Legal Console</span>
          </span>
        </div>

        <nav className="advocate-nav-menu">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to === '/advocate/dashboard' && location.pathname === '/advocate');
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`advocate-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="advocate-sidebar-footer">
          <div className="advocate-user-pill">
            <div className="advocate-avatar">
              {advocate?.name?.slice(4, 6)?.toUpperCase() || 'AD'}
            </div>
            <div className="advocate-user-details">
              <strong>{advocate?.name || 'Advocate Counsel'}</strong>
              <span>{advocate?.bar_council_id || 'BCI Verified'}</span>
            </div>
          </div>

          <button 
            type="button" 
            className="admin-logout-btn"
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.65rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport Content Area */}
      <main className="advocate-main-viewport">
        <Outlet context={{ advocate, setAdvocate }} />
      </main>
    </div>
  );
};

export default AdvocateLayout;
