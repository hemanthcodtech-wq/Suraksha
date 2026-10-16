import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdvocatePolicy from './pages/AdvocatePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import CustomCursor from './components/animation/CustomCursor';
import SplashScreen from './components/animation/SplashScreen';
import { luxuryEasing } from './components/animation/motionVariants';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNewClients from './pages/admin/AdminNewClients';
import AdminAssignedAdvocates from './pages/admin/AdminAssignedAdvocates';
import AdminAdvocatesCreation from './pages/admin/AdminAdvocatesCreation';
import AdminApprovals from './pages/admin/AdminApprovals';
import AdvocateLayout from './pages/advocate/AdvocateLayout';
import AdvocateDashboard from './pages/advocate/AdvocateDashboard';
import AdvocateAssignedProjects from './pages/advocate/AdvocateAssignedProjects';
import AdvocateProfile from './pages/advocate/AdvocateProfile';
import AdvocateResetPassword from './pages/advocate/AdvocateResetPassword';
import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerHome from './pages/customer/CustomerHome';
import CustomerPastApplications from './pages/customer/CustomerPastApplications';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerAddProperty from './pages/customer/CustomerAddProperty';

// Scroll to top on route change or handle hash navigation
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

// Animated route transitions for Public Pages
const PublicAnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: luxuryEasing }}
        className="page-transition-wrapper"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Legal and Compliance Policies */}
          <Route path="/advocate-policy" element={<AdvocatePolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund" element={<RefundPolicy />} />
          
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdvocateRoute = location.pathname.startsWith('/advocate');
  const isCustomerRoute = location.pathname.startsWith('/customer');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="new-clients" element={<AdminNewClients />} />
          <Route path="assigned-advocates" element={<AdminAssignedAdvocates />} />
          <Route path="advocates-creation" element={<AdminAdvocatesCreation />} />
          <Route path="approvals" element={<AdminApprovals />} />
        </Route>
      </Routes>
    );
  }

  if (isAdvocateRoute) {
    return (
      <Routes>
        <Route path="/advocate" element={<AdvocateLayout />}>
          <Route index element={<AdvocateDashboard />} />
          <Route path="dashboard" element={<AdvocateDashboard />} />
          <Route path="projects" element={<AdvocateAssignedProjects />} />
          <Route path="profile" element={<AdvocateProfile />} />
          <Route path="reset-password" element={<AdvocateResetPassword />} />
        </Route>
      </Routes>
    );
  }

  if (isCustomerRoute) {
    return (
      <Routes>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="dashboard" element={<CustomerHome />} />
          <Route path="past-applications" element={<CustomerPastApplications />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="add-property" element={<CustomerAddProperty />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="site-container">
      <CustomCursor />
      <Header />
      <main className="main-content">
        <PublicAnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <SplashScreen />
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  );
}

export default App;
