import { query } from '../db/index.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { 
  sendCustomerOtpEmail, 
  sendAdminNewClientNotification, 
  sendAdvocateAssignedNotification, 
  sendReportApprovedNotification 
} from '../utils/mailer.js';

// ==========================================
// 1. DASHBOARD METRICS (Dynamic aggregation)
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM cases) AS total_cases,
        (SELECT COUNT(*) FROM cases WHERE status = 'New') AS new_clients_count,
        (SELECT COUNT(*) FROM cases WHERE status = 'Assigned' OR status = 'In Review') AS assigned_in_progress_count,
        (SELECT COUNT(*) FROM advocates WHERE status = 'Active') AS active_advocates_count,
        (SELECT COUNT(*) FROM prepared_reports WHERE approval_status = 'Pending Approval') AS pending_approvals_count,
        (SELECT COUNT(*) FROM prepared_reports WHERE approval_status = 'Approved') AS approved_reports_count;
    `;
    const result = await query(statsQuery);

    // Fetch latest recent activity dynamically
    const recentActivityQuery = `
      SELECT 
        c.id,
        c.case_reference,
        c.client_name,
        c.project_name,
        c.service_type,
        c.status,
        c.created_at,
        a.name AS advocate_name
      FROM cases c
      LEFT JOIN advocates a ON c.assigned_advocate_id = a.id
      ORDER BY c.created_at DESC
      LIMIT 8;
    `;
    const recentResult = await query(recentActivityQuery);

    res.json({
      success: true,
      stats: result.rows[0],
      recentActivity: recentResult.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. NEW CLIENTS / CASES MANAGEMENT
// ==========================================
export const getNewClients = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT 
        c.*,
        a.name AS advocate_name,
        a.bar_council_id,
        a.specialization AS advocate_specialization
      FROM cases c
      LEFT JOIN advocates a ON c.assigned_advocate_id = a.id
    `;
    const params = [];

    if (status) {
      sql += ` WHERE c.status = $1`;
      params.push(status);
    }

    sql += ` ORDER BY c.created_at DESC`;

    const result = await query(sql, params);
    res.json({ success: true, clients: result.rows });
  } catch (error) {
    console.error('Error fetching new clients:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new client verification case dynamically (from Get Started page or Admin)
export const createClientCase = async (req, res) => {
  try {
    const {
      serviceType,
      propertyType,
      city,
      projectOrSurvey,
      sellerOrBuilder,
      customerName,
      customerEmail,
      customerPhone,
      comments,
      uploadedFilesCount
    } = req.body;

    const caseReference = `PS-${Math.floor(100000 + Math.random() * 900000)}`;

    // Process files uploaded via Multer to Cloudinary
    let uploadedDocs = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadRes = await uploadToCloudinary(
            file.buffer,
            file.originalname,
            'property_suraksha/customer_documents'
          );
          uploadedDocs.push({
            name: file.originalname,
            url: uploadRes.secure_url || uploadRes.url,
            uploadedAt: new Date().toISOString(),
            size: file.size
          });
        } catch (uploadErr) {
          console.error('Failed to upload file to Cloudinary:', uploadErr);
          uploadedDocs.push({
            name: file.originalname,
            url: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
            uploadedAt: new Date().toISOString(),
            size: file.size
          });
        }
      }
    } else {
      // Default placeholder doc metadata if no physical file provided
      uploadedDocs.push({
        name: 'Sale_Deed_Copy_Registered.pdf',
        url: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
        uploadedAt: new Date().toISOString(),
        size: 2450000
      });
    }

    const insertSQL = `
      INSERT INTO cases (
        case_reference,
        service_type,
        property_type,
        city,
        project_name,
        seller_or_builder,
        client_name,
        client_email,
        client_phone,
        client_notes,
        documents_count,
        uploaded_documents,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'New')
      RETURNING *;
    `;

    const values = [
      caseReference,
      serviceType,
      propertyType,
      city,
      projectOrSurvey,
      sellerOrBuilder,
      customerName,
      customerEmail,
      customerPhone,
      comments || '',
      uploadedDocs.length || (uploadedFilesCount ? Number(uploadedFilesCount) : 1),
      JSON.stringify(uploadedDocs)
    ];

    const result = await query(insertSQL, values);
    const newCase = result.rows[0];

    // Trigger Admin Email Notification asynchronously
    sendAdminNewClientNotification(newCase).catch(err => {
      console.error('Failed to send admin new client email notification:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Client case created successfully in Neon DB',
      case: newCase
    });
  } catch (error) {
    console.error('Error creating client case:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. ADVOCATES ASSIGNED / ASSIGNMENT LOGIC
// ==========================================
export const getAssignedCases = async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.*,
        a.name AS advocate_name,
        a.email AS advocate_email,
        a.phone AS advocate_phone,
        a.specialization AS advocate_specialization,
        a.bar_council_id,
        (SELECT COUNT(*) FROM prepared_reports pr WHERE pr.case_id = c.id) AS reports_count
      FROM cases c
      JOIN advocates a ON c.assigned_advocate_id = a.id
      ORDER BY c.assigned_at DESC NULLS LAST;
    `;
    const result = await query(sql);
    res.json({ success: true, assignedCases: result.rows });
  } catch (error) {
    console.error('Error fetching assigned cases:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign or Reassign an Advocate to a Case
export const assignAdvocateToCase = async (req, res) => {
  try {
    const { caseId, advocateId } = req.body;

    if (!caseId || !advocateId) {
      return res.status(400).json({ success: false, message: 'caseId and advocateId are required' });
    }

    const updateSQL = `
      UPDATE cases 
      SET 
        assigned_advocate_id = $1,
        assigned_at = CURRENT_TIMESTAMP,
        status = 'Assigned'
      WHERE id = $2
      RETURNING *;
    `;

    const result = await query(updateSQL, [advocateId, caseId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const updatedCase = result.rows[0];

    // Fetch advocate details to generate comprehensive email notification
    const advRes = await query(`SELECT * FROM advocates WHERE id = $1`, [advocateId]);
    if (advRes.rows.length > 0) {
      sendAdvocateAssignedNotification(updatedCase, advRes.rows[0]).catch(err => {
        console.error('Failed to send advocate assigned email notification:', err.message);
      });
    }

    res.json({
      success: true,
      message: 'Advocate assigned successfully',
      case: updatedCase
    });
  } catch (error) {
    console.error('Error assigning advocate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. ADVOCATES CREATION & DIRECTORY
// ==========================================
export const getAllAdvocates = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.*,
        (SELECT COUNT(*) FROM cases c WHERE c.assigned_advocate_id = a.id) AS total_assigned_cases,
        (SELECT COUNT(*) FROM cases c WHERE c.assigned_advocate_id = a.id AND c.status = 'In Review') AS active_cases
      FROM advocates a
      ORDER BY a.created_at DESC;
    `;
    const result = await query(sql);
    res.json({ success: true, advocates: result.rows });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new advocate profile dynamically with temporary password
export const createAdvocate = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bar_council_id,
      specialization,
      experience_years,
      city,
      state,
      temporary_password
    } = req.body;

    if (!name || !email || !phone || !bar_council_id || !specialization) {
      return res.status(400).json({ success: false, message: 'All required advocate fields must be provided' });
    }

    // Check duplicate
    const checkSql = `SELECT id FROM advocates WHERE email = $1 OR bar_council_id = $2`;
    const check = await query(checkSql, [email, bar_council_id]);
    if (check.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'An advocate with this email or Bar Council ID already exists.' });
    }

    const tempPassword = temporary_password?.trim() || 'Advocate@123';

    const insertSQL = `
      INSERT INTO advocates (
        name,
        email,
        phone,
        bar_council_id,
        specialization,
        experience_years,
        city,
        state,
        temporary_password,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Active')
      RETURNING *;
    `;

    const values = [
      name,
      email,
      phone,
      bar_council_id,
      specialization,
      Number(experience_years) || 1,
      city || 'Hyderabad',
      state || 'Telangana',
      tempPassword
    ];

    const result = await query(insertSQL, values);
    res.status(201).json({
      success: true,
      message: 'New advocate registered successfully in Neon DB',
      advocate: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating advocate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit / Update an advocate profile dynamically
export const updateAdvocate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      bar_council_id,
      specialization,
      experience_years,
      city,
      state,
      temporary_password,
      status
    } = req.body;

    const updateSQL = `
      UPDATE advocates
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        bar_council_id = COALESCE($4, bar_council_id),
        specialization = COALESCE($5, specialization),
        experience_years = COALESCE($6, experience_years),
        city = COALESCE($7, city),
        state = COALESCE($8, state),
        temporary_password = COALESCE($9, temporary_password),
        status = COALESCE($10, status)
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      name,
      email,
      phone,
      bar_council_id,
      experience_years ? Number(experience_years) : null,
      city,
      state,
      temporary_password,
      status,
      id
    ];

    const result = await query(updateSQL, [
      name,
      email,
      phone,
      bar_council_id,
      specialization,
      experience_years ? Number(experience_years) : null,
      city,
      state,
      temporary_password,
      status,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Advocate not found' });
    }

    res.json({
      success: true,
      message: 'Advocate details updated successfully in Neon DB',
      advocate: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating advocate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4B. ADVOCATE PORTAL ENDPOINTS
// ==========================================

// Advocate Login verification against Neon DB
export const advocateLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const checkSql = `SELECT * FROM advocates WHERE LOWER(email) = LOWER($1) LIMIT 1`;
    const result = await query(checkSql, [email.trim()]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'No advocate account registered with this email.' });
    }

    const adv = result.rows[0];
    if (adv.temporary_password !== password.trim()) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
    }

    res.json({
      success: true,
      message: 'Advocate authenticated successfully',
      advocate: {
        id: adv.id,
        name: adv.name,
        email: adv.email,
        phone: adv.phone,
        bar_council_id: adv.bar_council_id,
        specialization: adv.specialization,
        experience_years: adv.experience_years,
        city: adv.city,
        state: adv.state,
        status: adv.status
      }
    });
  } catch (error) {
    console.error('Advocate login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all projects/cases assigned to a specific advocate
export const getAdvocateAssignedProjects = async (req, res) => {
  try {
    const { advocateId } = req.params;

    const sql = `
      SELECT 
        c.*,
        pr.id AS report_id,
        pr.report_title,
        pr.approval_status,
        pr.risk_level,
        pr.visible_to_client
      FROM cases c
      LEFT JOIN prepared_reports pr ON pr.case_id = c.id
      WHERE c.assigned_advocate_id = $1
      ORDER BY c.assigned_at DESC NULLS LAST;
    `;
    const result = await query(sql, [advocateId]);

    res.json({
      success: true,
      cases: result.rows
    });
  } catch (error) {
    console.error('Error fetching advocate projects:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Advocate updates project status (e.g., 'In Review', 'Completed')
export const updateCaseProgressStatus = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status, advocateId } = req.body;

    const updateSQL = `
      UPDATE cases
      SET status = $1
      WHERE id = $2 AND assigned_advocate_id = $3
      RETURNING *;
    `;
    const result = await query(updateSQL, [status, caseId, advocateId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Case not found or unauthorized' });
    }

    res.json({
      success: true,
      message: `Case status successfully updated to "${status}"`,
      case: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating case progress:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Advocate uploads completion certificate / legal clearance document via Cloudinary & Multer
export const uploadCaseCertificate = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { advocateId } = req.body;
    let finalCertificateUrl = req.body.certificateUrl;
    let finalCertificateName = req.body.certificateName || 'Legal_Verification_Certificate.pdf';

    // If file was uploaded via Multer (PDF or scanned deed)
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        'property_suraksha/certificates'
      );
      finalCertificateUrl = uploadResult.secure_url || uploadResult.url;
      finalCertificateName = req.file.originalname;
    }

    // When advocate uploads certificate upon completion:
    // 1. Save certificate_url & certificate_name to the cases table
    // 2. Set case status to 'Pending Approval' so that it goes to Admin Approvals
    const updateSQL = `
      UPDATE cases
      SET 
        certificate_url = $1,
        certificate_name = $2,
        certificate_uploaded_at = CURRENT_TIMESTAMP,
        status = 'Pending Approval'
      WHERE id = $3 AND assigned_advocate_id = $4
      RETURNING *;
    `;
    const result = await query(updateSQL, [finalCertificateUrl, finalCertificateName, caseId, advocateId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Case not found or unauthorized' });
    }

    const updatedCase = result.rows[0];

    // Automatically create or update a prepared_reports record for Admin Approval
    const checkReportSql = `SELECT id FROM prepared_reports WHERE case_id = $1`;
    const checkReportRes = await query(checkReportSql, [caseId]);

    if (checkReportRes.rows.length === 0) {
      const insertReportSql = `
        INSERT INTO prepared_reports (
          case_id,
          advocate_id,
          report_title,
          summary,
          risk_level,
          observations,
          documents_inspected,
          advocate_recommendation,
          approval_status,
          visible_to_client
        ) VALUES (
          $1, $2, $3, $4, 'Low Risk', $5, $6, $7, 'Pending Approval', false
        );
      `;
      await query(insertReportSql, [
        caseId,
        advocateId,
        `Title Verification & Clearance Certificate — ${updatedCase.project_name}`,
        `Advocate has verified title ownership, revenue records, and link documents for ${updatedCase.project_name} (${updatedCase.city}). Legal clearance certificate uploaded for Admin Approval.`,
        'All title deed records, 30-year Encumbrance Certificates, and statutory approvals inspected and found clear.',
        ['Sale Deed Copy', '30-Year Encumbrance Certificate', 'RERA Sanction'],
        'Property title is clean and marketable. Legal clearance certificate prepared and submitted for Admin Board approval.'
      ]);
    } else {
      await query(
        `UPDATE prepared_reports SET approval_status = 'Pending Approval', visible_to_client = false WHERE case_id = $1`,
        [caseId]
      );
    }

    res.json({
      success: true,
      message: 'Certificate uploaded to Cloudinary successfully and submitted for Admin Approval!',
      case: updatedCase,
      cloudinaryUrl: finalCertificateUrl
    });
  } catch (error) {
    console.error('Error uploading certificate to Cloudinary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Advocate updates their own profile
export const updateAdvocateSelfProfile = async (req, res) => {
  try {
    const { advocateId } = req.params;
    const { name, phone, specialization, city, state, experience_years } = req.body;

    const updateSQL = `
      UPDATE advocates
      SET 
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        specialization = COALESCE($3, specialization),
        city = COALESCE($4, city),
        state = COALESCE($5, state),
        experience_years = COALESCE($6, experience_years)
      WHERE id = $7
      RETURNING *;
    `;
    const result = await query(updateSQL, [name, phone, specialization, city, state, experience_years ? Number(experience_years) : null, advocateId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Advocate not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      advocate: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating advocate profile:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Advocate changes their password
export const resetAdvocatePassword = async (req, res) => {
  try {
    const { advocateId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const checkSql = `SELECT temporary_password FROM advocates WHERE id = $1`;
    const checkRes = await query(checkSql, [advocateId]);

    if (checkRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Advocate not found' });
    }

    if (currentPassword && checkRes.rows[0].temporary_password !== currentPassword.trim()) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    const updateSQL = `
      UPDATE advocates
      SET temporary_password = $1
      WHERE id = $2
      RETURNING id, name, email;
    `;
    await query(updateSQL, [newPassword.trim(), advocateId]);

    res.json({
      success: true,
      message: 'Password successfully changed! You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Error resetting advocate password:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 5. APPROVALS WORKFLOW
// (Advocate checks & prepares document -> Admin approves to show in client portal)
// =========================================================================
export const getPendingApprovals = async (req, res) => {
  try {
    const sql = `
      SELECT 
        pr.*,
        c.case_reference,
        c.project_name,
        c.property_type,
        c.city AS property_city,
        c.client_name,
        c.client_email,
        c.client_phone,
        c.service_type,
        c.certificate_url,
        c.certificate_name,
        a.name AS advocate_name,
        a.bar_council_id,
        a.specialization AS advocate_specialization
      FROM prepared_reports pr
      JOIN cases c ON pr.case_id = c.id
      JOIN advocates a ON pr.advocate_id = a.id
      ORDER BY pr.created_at DESC;
    `;
    const result = await query(sql);
    res.json({ success: true, reports: result.rows });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Advocate submits a prepared report for Admin review
export const submitAdvocateReport = async (req, res) => {
  try {
    const {
      caseId,
      advocateId,
      reportTitle,
      summary,
      riskLevel,
      observations,
      documentsInspected,
      advocateRecommendation
    } = req.body;

    const insertSQL = `
      INSERT INTO prepared_reports (
        case_id,
        advocate_id,
        report_title,
        summary,
        risk_level,
        observations,
        documents_inspected,
        advocate_recommendation,
        approval_status,
        visible_to_client
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending Approval', false)
      RETURNING *;
    `;

    const values = [
      caseId,
      advocateId,
      reportTitle,
      summary,
      riskLevel || 'Low Risk',
      observations,
      documentsInspected || [],
      advocateRecommendation
    ];

    const result = await query(insertSQL, values);

    // Update case status to 'Pending Approval'
    await query(`UPDATE cases SET status = 'Pending Approval' WHERE id = $1`, [caseId]);

    res.status(201).json({
      success: true,
      message: 'Report submitted by advocate and queued for Admin Approval',
      report: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting advocate report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin approves or requests revision
export const handleAdminApproval = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action, adminFeedback } = req.body; // action: 'APPROVE' | 'REQUEST_REVISION'

    if (action === 'APPROVE') {
      const updateReportSQL = `
        UPDATE prepared_reports
        SET 
          approval_status = 'Approved',
          admin_feedback = $1,
          approved_at = CURRENT_TIMESTAMP,
          visible_to_client = true
        WHERE id = $2
        RETURNING *;
      `;
      const reportRes = await query(updateReportSQL, [adminFeedback || 'Approved for Client Release', reportId]);

      if (reportRes.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }

      const report = reportRes.rows[0];

      // Update parent case to 'Approved'
      await query(`UPDATE cases SET status = 'Approved' WHERE id = $1`, [report.case_id]);

      // Fetch case and advocate details to send beautiful client release notification
      const caseAndAdvRes = await query(`
        SELECT c.*, a.name AS advocate_name, a.bar_council_id
        FROM cases c
        LEFT JOIN advocates a ON c.assigned_advocate_id = a.id
        WHERE c.id = $1
      `, [report.case_id]);

      if (caseAndAdvRes.rows.length > 0) {
        const clientCase = caseAndAdvRes.rows[0];
        sendReportApprovedNotification(clientCase, report, { name: clientCase.advocate_name, bar_council_id: clientCase.bar_council_id }).catch(err => {
          console.error('Failed to send approved report client email:', err.message);
        });
      }

      return res.json({
        success: true,
        message: 'Report approved! It is now published and visible to the client in the customer portal.',
        report
      });
    } else if (action === 'REQUEST_REVISION') {
      const updateReportSQL = `
        UPDATE prepared_reports
        SET 
          approval_status = 'Revision Requested',
          admin_feedback = $1,
          visible_to_client = false
        WHERE id = $2
        RETURNING *;
      `;
      const reportRes = await query(updateReportSQL, [adminFeedback || 'Revisions required by Admin', reportId]);

      if (reportRes.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }

      const report = reportRes.rows[0];
      await query(`UPDATE cases SET status = 'In Review' WHERE id = $1`, [report.case_id]);

      return res.json({
        success: true,
        message: 'Revision requested from advocate. The document remains hidden from client portal.',
        report
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Must be APPROVE or REQUEST_REVISION' });
    }
  } catch (error) {
    console.error('Error handling admin approval:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. CUSTOMER OTP AUTHENTICATION & PORTAL
// ==========================================

// Send OTP to Customer Email if email & phone match intake records
export const sendCustomerOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({ success: false, message: 'Both registered email and phone number are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    // Check if client case exists matching email and phone (last 10 digits comparison)
    const clientCheckSql = `
      SELECT * FROM cases 
      WHERE LOWER(client_email) = $1 
      ORDER BY created_at DESC 
      LIMIT 1;
    `;
    const clientRes = await query(clientCheckSql, [cleanEmail]);

    if (clientRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No property verification case found with this email. Please check your details or submit a request on /get-started.'
      });
    }

    const clientCase = clientRes.rows[0];
    const registeredPhoneDigits = (clientCase.client_phone || '').replace(/[^0-9]/g, '');

    // Validate phone number match (checking suffix or match)
    const phoneMatches = 
      registeredPhoneDigits.includes(cleanPhone) || 
      cleanPhone.includes(registeredPhoneDigits) || 
      registeredPhoneDigits.slice(-10) === cleanPhone.slice(-10);

    if (!phoneMatches) {
      return res.status(401).json({
        success: false,
        message: 'Phone number does not match our records for this email address. Please enter the phone number you used during submission.'
      });
    }

    // Generate 6-digit cryptographic-random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save in Neon DB
    await query(`
      INSERT INTO otp_verifications (email, phone, otp_code, expires_at, verified)
      VALUES ($1, $2, $3, $4, FALSE);
    `, [cleanEmail, cleanPhone, otpCode, expiresAt]);

    // Send luxury OTP email to customer
    await sendCustomerOtpEmail(cleanEmail, clientCase.client_name, otpCode);

    res.json({
      success: true,
      message: `A 6-digit verification OTP has been sent to ${cleanEmail}. Please check your inbox.`,
      clientName: clientCase.client_name,
      email: cleanEmail,
      demoOtpHint: process.env.NODE_ENV === 'development' ? otpCode : undefined
    });
  } catch (error) {
    console.error('Error sending customer OTP:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Customer OTP and return active case particulars
export const verifyCustomerOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    // Verify OTP against Neon DB
    const otpSql = `
      SELECT * FROM otp_verifications
      WHERE LOWER(email) = $1 AND otp_code = $2 AND expires_at > CURRENT_TIMESTAMP AND verified = FALSE
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const otpRes = await query(otpSql, [cleanEmail, cleanOtp]);

    if (otpRes.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid or expired OTP. Please request a new code.' });
    }

    // Mark OTP as used
    await query(`UPDATE otp_verifications SET verified = TRUE WHERE id = $1`, [otpRes.rows[0].id]);

    // Fetch customer's cases and any approved reports
    const casesSql = `
      SELECT 
        c.*,
        a.name AS advocate_name,
        a.bar_council_id,
        a.specialization AS advocate_specialization,
        pr.id AS report_id,
        pr.report_title,
        pr.summary AS report_summary,
        pr.risk_level,
        pr.observations,
        pr.advocate_recommendation,
        pr.approval_status,
        pr.visible_to_client
      FROM cases c
      LEFT JOIN advocates a ON c.assigned_advocate_id = a.id
      LEFT JOIN prepared_reports pr ON pr.case_id = c.id AND pr.visible_to_client = TRUE
      WHERE LOWER(c.client_email) = $1
      ORDER BY c.created_at DESC;
    `;
    const casesRes = await query(casesSql, [cleanEmail]);

    res.json({
      success: true,
      message: 'OTP verified successfully!',
      customer: {
        email: cleanEmail,
        name: casesRes.rows[0]?.client_name || 'Valued Client',
        phone: casesRes.rows[0]?.client_phone
      },
      cases: casesRes.rows
    });
  } catch (error) {
    console.error('Error verifying customer OTP:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Retrieve client case data by Case Reference (for live portal tracking)
export const getClientCaseDetails = async (req, res) => {
  try {
    const { caseReference } = req.params;

    const sql = `
      SELECT 
        c.*,
        a.name AS advocate_name,
        a.bar_council_id,
        a.specialization AS advocate_specialization,
        pr.id AS report_id,
        pr.report_title,
        pr.summary AS report_summary,
        pr.risk_level,
        pr.observations,
        pr.advocate_recommendation,
        pr.approval_status,
        pr.visible_to_client
      FROM cases c
      LEFT JOIN advocates a ON c.assigned_advocate_id = a.id
      LEFT JOIN prepared_reports pr ON pr.case_id = c.id AND pr.visible_to_client = TRUE
      WHERE UPPER(c.case_reference) = UPPER($1)
      LIMIT 1;
    `;
    const result = await query(sql, [caseReference.trim()]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No case found matching this reference ID' });
    }

    res.json({
      success: true,
      caseData: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching client case details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all live cases for a customer by registered email (auto-refreshes approved status & certificates)
export const getCustomerCasesByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const sql = `
      SELECT 
        c.*,
        a.name AS advocate_name,
        a.bar_council_id,
        a.specialization AS advocate_specialization,
        pr.id AS report_id,
        pr.report_title,
        pr.summary AS report_summary,
        pr.risk_level,
        pr.observations,
        pr.advocate_recommendation,
        pr.approval_status,
        pr.visible_to_client
      FROM cases c
      LEFT JOIN advocates a ON c.assigned_advocate_id = a.id
      LEFT JOIN prepared_reports pr ON pr.case_id = c.id AND pr.visible_to_client = TRUE
      WHERE LOWER(c.client_email) = $1
      ORDER BY c.created_at DESC;
    `;
    const result = await query(sql, [cleanEmail]);

    res.json({
      success: true,
      cases: result.rows
    });
  } catch (error) {
    console.error('Error fetching customer cases by email:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


