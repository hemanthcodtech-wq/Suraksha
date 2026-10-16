import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../components/Logo';
import { 
  LayoutDashboard, 
  History, 
  UserCheck, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import './Customer.css';
import '../admin/Admin.css';

export const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const storedCust = localStorage.getItem('suraksha_customer');
    const storedCases = localStorage.getItem('suraksha_customer_cases');

    let parsedCust = null;
    if (storedCust) {
      try {
        parsedCust = JSON.parse(storedCust);
        setCustomer(parsedCust);
      } catch (e) {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }

    if (storedCases) {
      try {
        setCases(JSON.parse(storedCases));
      } catch (e) {
        setCases([]);
      }
    }

    // Live Sync: Fetch fresh live data from Neon DB so Admin Approvals and Certificates reflect in real time
    if (parsedCust?.email) {
      adminApi.getCustomerCases(parsedCust.email).then((res) => {
        if (res.success && res.cases) {
          setCases(res.cases);
          localStorage.setItem('suraksha_customer_cases', JSON.stringify(res.cases));
        }
      }).catch(err => {
        console.error('Failed to sync live customer cases:', err);
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('suraksha_customer');
    localStorage.removeItem('suraksha_customer_cases');
    navigate('/login');
  };

  const navLinks = [
    { to: '/customer/dashboard', icon: LayoutDashboard, label: '1. Customer Dashboard' },
    { to: '/customer/past-applications', icon: History, label: '2. Past Applications' },
    { to: '/customer/profile', icon: UserCheck, label: '3. Profile' },
    { to: '/customer/add-property', icon: PlusCircle, label: '4. Add New Property', highlight: true }
  ];

  return (
    <div className="customer-portal-wrapper">
      {/* Mobile Header */}
      <header className="customer-mobile-header">
        <div className="admin-mobile-logo">
          <Logo size="small" />
        </div>
        <button 
          className="customer-mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Drawer"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div className="admin-mobile-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* Persistent Sidebar */}
      <aside className={`customer-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="customer-sidebar-header">
          <div className="admin-logo-box">
            <Logo size="normal" />
          </div>
          <span className="customer-console-tag">
            <ShieldCheck size={13} />
            <span>Customer Portal</span>
          </span>
        </div>

        <nav className="customer-nav-menu">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to === '/customer/dashboard' && location.pathname === '/customer');
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`customer-nav-item ${isActive ? 'active' : ''} ${item.highlight ? 'highlight-add' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="customer-sidebar-footer">
          <div className="customer-user-pill">
            <div className="customer-avatar">
              {customer?.name?.slice(0, 2)?.toUpperCase() || 'CU'}
            </div>
            <div className="customer-user-details">
              <strong>{customer?.name || 'Valued Client'}</strong>
              <span>{customer?.phone || customer?.email}</span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '0.65rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fca5a5', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
          >
            <LogOut size={16} />
            <span>5. Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="customer-main-viewport">
        <Outlet context={{ customer, setCustomer, cases, setCases }} />
      </main>
    </div>
  );
};

export default CustomerLayout;
