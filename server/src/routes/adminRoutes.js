import express from 'express';
import { uploadMiddleware } from '../utils/cloudinary.js';
import {
  getDashboardStats,
  getNewClients,
  createClientCase,
  getAssignedCases,
  assignAdvocateToCase,
  getAllAdvocates,
  createAdvocate,
  updateAdvocate,
  adminLogin,
  advocateLogin,
  getAdvocateAssignedProjects,
  updateCaseProgressStatus,
  uploadCaseCertificate,
  updateAdvocateSelfProfile,
  resetAdvocatePassword,
  getPendingApprovals,
  submitAdvocateReport,
  handleAdminApproval,
  sendCustomerOtp,
  verifyCustomerOtp,
  getClientCaseDetails,
  getCustomerCasesByEmail
} from '../controllers/adminController.js';

const router = express.Router();

// 1. Dashboard Metrics
router.get('/dashboard-stats', getDashboardStats);

// 0. Admin Login (dynamic, DB-backed)
router.post('/login', adminLogin);

// 2. New Clients & Case Creation (supports document file uploads to Cloudinary)
router.get('/clients', getNewClients);
router.post('/clients', uploadMiddleware.array('documents', 30), createClientCase);

// 3. Advocates Assigned
router.get('/assigned-cases', getAssignedCases);
router.post('/assign-advocate', assignAdvocateToCase);

// 4. Advocates Creation, Directory & Management
router.get('/advocates', getAllAdvocates);
router.post('/advocates', createAdvocate);
router.put('/advocates/:id', updateAdvocate);

// 4B. Advocate Portal API
router.post('/advocate/login', advocateLogin);
router.get('/advocate/projects/:advocateId', getAdvocateAssignedProjects);
router.patch('/advocate/case-status/:caseId', updateCaseProgressStatus);
router.post('/advocate/upload-certificate/:caseId', uploadMiddleware.single('certificateFile'), uploadCaseCertificate);
router.put('/advocate/profile/:advocateId', updateAdvocateSelfProfile);
router.post('/advocate/reset-password/:advocateId', resetAdvocatePassword);

// 5. Approvals Workflow (Advocate preparation -> Admin approval -> Client portal release)
router.get('/approvals', getPendingApprovals);
router.post('/submit-report', submitAdvocateReport);
router.patch('/approvals/:reportId', handleAdminApproval);

// 6. Customer Authentication & Case Portal
router.post('/customer/send-otp', sendCustomerOtp);
router.post('/customer/verify-otp', verifyCustomerOtp);
router.get('/customer/case/:caseReference', getClientCaseDetails);
router.get('/customer/cases/:email', getCustomerCasesByEmail);

export default router;
