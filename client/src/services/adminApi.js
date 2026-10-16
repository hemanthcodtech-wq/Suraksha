const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const adminApi = {
  // 1. Dashboard
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`);
    return res.json();
  },

  // 2. New Clients & Cases
  getClients: async (status = '') => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_BASE_URL}/admin/clients${query}`);
    return res.json();
  },

  createClient: async (clientData) => {
    const isFormData = clientData instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/admin/clients`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? clientData : JSON.stringify(clientData)
    });
    return res.json();
  },

  // 3. Advocates Assigned
  getAssignedCases: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/assigned-cases`);
    return res.json();
  },

  assignAdvocate: async (caseId, advocateId) => {
    const res = await fetch(`${API_BASE_URL}/admin/assign-advocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, advocateId })
    });
    return res.json();
  },

  // 4. Advocates Directory & Creation
  getAdvocates: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/advocates`);
    return res.json();
  },

  createAdvocate: async (advocateData) => {
    const res = await fetch(`${API_BASE_URL}/admin/advocates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(advocateData)
    });
    return res.json();
  },

  updateAdvocate: async (id, advocateData) => {
    const res = await fetch(`${API_BASE_URL}/admin/advocates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(advocateData)
    });
    return res.json();
  },

  // 4B. Advocate Portal APIs
  advocateLogin: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/admin/advocate/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  getAdvocateProjects: async (advocateId) => {
    const res = await fetch(`${API_BASE_URL}/admin/advocate/projects/${advocateId}`);
    return res.json();
  },

  updateCaseStatus: async (caseId, advocateId, status) => {
    const res = await fetch(`${API_BASE_URL}/admin/advocate/case-status/${caseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ advocateId, status })
    });
    return res.json();
  },

  uploadCertificate: async (caseId, advocateId, fileOrData, certificateUrl = '') => {
    // If uploading via FormData (real PDF file to Cloudinary)
    if (fileOrData instanceof FormData) {
      const res = await fetch(`${API_BASE_URL}/admin/advocate/upload-certificate/${caseId}`, {
        method: 'POST',
        body: fileOrData
      });
      return res.json();
    }

    const res = await fetch(`${API_BASE_URL}/admin/advocate/upload-certificate/${caseId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ advocateId, certificateName: fileOrData, certificateUrl })
    });
    return res.json();
  },

  updateAdvocateProfile: async (advocateId, profileData) => {
    const res = await fetch(`${API_BASE_URL}/admin/advocate/profile/${advocateId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return res.json();
  },

  resetAdvocatePassword: async (advocateId, currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/admin/advocate/reset-password/${advocateId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return res.json();
  },

  submitAdvocateReport: async (reportData) => {
    const res = await fetch(`${API_BASE_URL}/admin/submit-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    return res.json();
  },

  // 5. Approvals (Advocate Report -> Admin Approval -> Client Portal)
  getApprovals: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/approvals`);
    return res.json();
  },

  handleApprovalAction: async (reportId, action, adminFeedback = '') => {
    const res = await fetch(`${API_BASE_URL}/admin/approvals/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminFeedback })
    });
    return res.json();
  },

  // 6. Customer live sync
  getCustomerCases: async (email) => {
    const res = await fetch(`${API_BASE_URL}/admin/customer/cases/${encodeURIComponent(email)}`);
    return res.json();
  }
};

export default adminApi;
