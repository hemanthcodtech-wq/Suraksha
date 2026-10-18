import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const BASE_FRONTEND_URL = (process.env.CLIENT_URL || process.env.FRONTEND_URL || 'https://www.propertysuraksha.in').replace(/\/$/, '');

// Create reusable transporter object using Gmail SMTP
export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'kancharlahemanth89@gmail.com',
    pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, '') // remove spaces from Gmail App Password
  }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ SMTP Connection Notice:', error.message);
  } else {
    console.log('📬 Property Suraksha Gmail SMTP Transporter ready to send emails.');
  }
});

/**
 * 1. Beautiful Luxury Email Template Wrapper
 */
const getLuxuryEmailHtml = ({ preheader, headline, bodyContent, actionBtnText, actionBtnUrl, badgeText = 'OFFICIAL LEGAL UPDATE' }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Suraksha</title>
    <style>
      body { margin: 0; padding: 0; background-color: #030812; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
      table { border-collapse: collapse; }
      .email-wrapper { width: 100%; background-color: #030812; padding: 40px 10px; }
      .email-card { max-width: 600px; margin: 0 auto; background: #051426; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.7); }
      .header-bar { padding: 35px 30px 25px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background: radial-gradient(circle at top, #0e3764 0%, #051426 100%); }
      .brand-title { font-size: 22px; font-weight: 900; letter-spacing: 0.14em; color: #ffffff; margin: 8px 0 0; text-transform: uppercase; }
      .brand-gold { color: #D4AF37; }
      .badge-pill { display: inline-block; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); color: #ebd37d; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
      .content-body { padding: 35px 35px 30px; color: #cbd5e1; line-height: 1.7; font-size: 15px; }
      .headline { color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.35; margin: 0 0 20px; letter-spacing: -0.01em; }
      .info-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(212, 175, 55, 0.25); border-left: 4px solid #D4AF37; border-radius: 8px; padding: 18px 22px; margin: 24px 0; }
      .info-row { margin: 6px 0; font-size: 14px; }
      .info-label { color: #94a3b8; font-weight: 600; }
      .info-value { color: #ffffff; font-weight: 700; }
      .otp-display-box { background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(11, 45, 82, 0.4) 100%); border: 2px dashed #D4AF37; border-radius: 12px; padding: 22px; text-align: center; margin: 25px 0; }
      .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 0.28em; color: #ebd37d; font-family: 'Courier New', Courier, monospace; margin: 5px 0; text-shadow: 0 0 20px rgba(212, 175, 55, 0.6); }
      .cta-button { display: inline-block; background: linear-gradient(135deg, #e2c053 0%, #D4AF37 100%); color: #051426 !important; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 34px; border-radius: 8px; box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35); text-align: center; margin: 20px 0 10px; }
      .footer-bar { padding: 25px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06); background: #030812; font-size: 12px; color: #64748b; line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="email-card">
        <div class="header-bar">
          <div class="badge-pill">${badgeText}</div>
          <div class="brand-title">PROPERTY <span class="brand-gold">SURAKSHA</span></div>
          <div style="font-size: 11px; letter-spacing: 0.2em; color: #94a3b8; margin-top: 4px;">VERIFY • PROTECT • INVEST</div>
        </div>
        <div class="content-body">
          <h2 class="headline">${headline}</h2>
          ${bodyContent}
          ${actionBtnText && actionBtnUrl ? `
            <div style="text-align: center; margin-top: 25px;">
              <a href="${actionBtnUrl}" class="cta-button">${actionBtnText}</a>
            </div>
          ` : ''}
        </div>
        <div class="footer-bar">
          <p style="margin: 0 0 6px;">PropertySuraksha Legal Operations • Encrypted 256-bit Title Diligence</p>
          <p style="margin: 0;">Securing land, apartment, and villa transactions with bar-admitted property advocates.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};

/**
 * 2. Send Customer Login OTP Email
 */
export const sendCustomerOtpEmail = async (customerEmail, customerName, otpCode) => {
  const mailOptions = {
    from: `"Property Suraksha Verification" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `🔐 Your Property Suraksha Verification OTP: ${otpCode}`,
    html: getLuxuryEmailHtml({
      badgeText: 'SECURITY AUTHENTICATION',
      headline: `Your One-Time Passcode (OTP)`,
      bodyContent: `
        <p>Dear <strong>${customerName || 'Valued Client'}</strong>,</p>
        <p>We received an authentication request to access your Property Suraksha Customer Portal.</p>
        <div class="otp-display-box">
          <div style="font-size: 12px; font-weight: 700; color: #cbd5e1; letter-spacing: 0.1em; text-transform: uppercase;">One-Time Passcode</div>
          <div class="otp-code">${otpCode}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Valid for 10 minutes • Never share your OTP with anyone</div>
        </div>
        <p style="font-size: 13px; color: #94a3b8;">If you did not request this OTP, please contact our legal operations team immediately.</p>
      `,
      actionBtnText: 'Access Customer Portal',
      actionBtnUrl: `${BASE_FRONTEND_URL}/login`
    })
  };

  return transporter.sendMail(mailOptions);
};

/**
 * 3. Send Admin Notification: New Client Intake Submitted
 */
export const sendAdminNewClientNotification = async (clientCase) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Property Suraksha Alert" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🔔 New Client Verification Case Received: ${clientCase.case_reference} (${clientCase.client_name})`,
    html: getLuxuryEmailHtml({
      badgeText: 'ADMIN ACTION REQUIRED',
      headline: `New Verification Request Submitted`,
      bodyContent: `
        <p>A new client has completed the <strong>/get-started</strong> intake portal on Property Suraksha.</p>
        
        <div class="info-box">
          <div class="info-row"><span class="info-label">Case Reference:</span> <span class="info-value" style="color: #ebd37d;">${clientCase.case_reference}</span></div>
          <div class="info-row"><span class="info-label">Client Name:</span> <span class="info-value">${clientCase.client_name}</span></div>
          <div class="info-row"><span class="info-label">Contact Email:</span> <span class="info-value">${clientCase.client_email}</span></div>
          <div class="info-row"><span class="info-label">Phone:</span> <span class="info-value">${clientCase.client_phone}</span></div>
          <div class="info-row"><span class="info-label">Service Tier:</span> <span class="info-value">${clientCase.service_type}</span></div>
          <div class="info-row"><span class="info-label">Property / Project:</span> <span class="info-value">${clientCase.project_name}</span></div>
          <div class="info-row"><span class="info-label">Location:</span> <span class="info-value">${clientCase.city} (${clientCase.property_type})</span></div>
          <div class="info-row"><span class="info-label">Builder / Seller:</span> <span class="info-value">${clientCase.seller_or_builder}</span></div>
          <div class="info-row"><span class="info-label">Uploaded Documents:</span> <span class="info-value">${clientCase.documents_count || 1} file(s) attached</span></div>
        </div>

        <p>Please log in to the Administrator Panel to assign a practicing property advocate from your verified panel.</p>
      `,
      actionBtnText: 'Assign Advocate in Admin Panel',
      actionBtnUrl: `${BASE_FRONTEND_URL}/admin/new-clients`
    })
  };

  return transporter.sendMail(mailOptions);
};

/**
 * 4. Send Email: Advocate Assigned (Sent to Client, Advocate, and Admin)
 */
export const sendAdvocateAssignedNotification = async (clientCase, advocate) => {
  // 4A. Email to Customer
  const customerEmailPromise = transporter.sendMail({
    from: `"Property Suraksha Legal Operations" <${process.env.EMAIL_USER}>`,
    to: clientCase.client_email,
    subject: `⚖️ Legal Counsel Assigned: Case ${clientCase.case_reference} is Under Scrutiny`,
    html: getLuxuryEmailHtml({
      badgeText: 'ADVOCATE ASSIGNMENT',
      headline: `Advocate Assigned to Your Verification Case`,
      bodyContent: `
        <p>Dear <strong>${clientCase.client_name}</strong>,</p>
        <p>We are pleased to inform you that a dedicated property advocate has been assigned to conduct full title scrutiny and municipal record checks for your property.</p>
        
        <div class="info-box">
          <div class="info-row"><span class="info-label">Case Reference:</span> <span class="info-value" style="color: #ebd37d;">${clientCase.case_reference}</span></div>
          <div class="info-row"><span class="info-label">Property:</span> <span class="info-value">${clientCase.project_name} (${clientCase.city})</span></div>
          <div class="info-row"><span class="info-label">Assigned Counsel:</span> <span class="info-value">${advocate.name}</span></div>
          <div class="info-row"><span class="info-label">Bar Council ID:</span> <span class="info-value">${advocate.bar_council_id}</span></div>
          <div class="info-row"><span class="info-label">Specialization:</span> <span class="info-value">${advocate.specialization}</span></div>
          <div class="info-row"><span class="info-label">Experience:</span> <span class="info-value">${advocate.experience_years} Years Practicing</span></div>
        </div>

        <p>Your advocate has begun inspecting the link deeds, encumbrance history, and statutory approvals. You will receive real-time notifications as findings are prepared.</p>
      `,
      actionBtnText: 'Track Verification Status',
      actionBtnUrl: `${BASE_FRONTEND_URL}/login`
    })
  });

  // 4B. Email to Assigned Advocate
  const advocateEmailPromise = transporter.sendMail({
    from: `"Property Suraksha Admin" <${process.env.EMAIL_USER}>`,
    to: advocate.email,
    subject: `📂 New Verification Case Assigned to You: ${clientCase.case_reference}`,
    html: getLuxuryEmailHtml({
      badgeText: 'CASE ASSIGNMENT',
      headline: `New Case Assigned for Legal Scrutiny`,
      bodyContent: `
        <p>Dear <strong>${advocate.name}</strong>,</p>
        <p>The Legal Operations desk has assigned a property title verification case to your console.</p>
        
        <div class="info-box">
          <div class="info-row"><span class="info-label">Case Ref:</span> <span class="info-value" style="color: #ebd37d;">${clientCase.case_reference}</span></div>
          <div class="info-row"><span class="info-label">Client Name:</span> <span class="info-value">${clientCase.client_name}</span></div>
          <div class="info-row"><span class="info-label">Property:</span> <span class="info-value">${clientCase.project_name}</span></div>
          <div class="info-row"><span class="info-label">Location:</span> <span class="info-value">${clientCase.city}</span></div>
          <div class="info-row"><span class="info-label">Service:</span> <span class="info-value">${clientCase.service_type}</span></div>
          <div class="info-row"><span class="info-label">Client Notes:</span> <span class="info-value">${clientCase.client_notes || 'Standard scrutiny requested'}</span></div>
        </div>

        <p>Please log in to your Advocate Console to review document uploads, update case progress, and prepare the legal letter.</p>
      `,
      actionBtnText: 'Open Advocate Console',
      actionBtnUrl: `${BASE_FRONTEND_URL}/advocate/projects`
    })
  });

  return Promise.allSettled([customerEmailPromise, advocateEmailPromise]);
};

/**
 * 5. Send Email: Admin Approved Report & Released to Customer Portal
 */
export const sendReportApprovedNotification = async (clientCase, report, advocate) => {
  const mailOptions = {
    from: `"Property Suraksha Quality Desk" <${process.env.EMAIL_USER}>`,
    to: clientCase.client_email,
    subject: `🎉 Final Legal Opinion Approved & Released: Case ${clientCase.case_reference}`,
    html: getLuxuryEmailHtml({
      badgeText: 'CERTIFIED LEGAL OPINION RELEASED',
      headline: `Your Legal Verification Report is Ready!`,
      bodyContent: `
        <p>Dear <strong>${clientCase.client_name}</strong>,</p>
        <p>We are delighted to inform you that your property verification has undergone senior administrator quality clearance and the formal legal opinion is now <strong>LIVE</strong> in your Customer Portal.</p>
        
        <div class="info-box">
          <div class="info-row"><span class="info-label">Case Reference:</span> <span class="info-value" style="color: #ebd37d;">${clientCase.case_reference}</span></div>
          <div class="info-row"><span class="info-label">Report Title:</span> <span class="info-value">${report.report_title}</span></div>
          <div class="info-row"><span class="info-label">Risk Evaluation:</span> <span class="info-value" style="color: #34d399; font-weight: 800;">${report.risk_level}</span></div>
          <div class="info-row"><span class="info-label">Inspected By:</span> <span class="info-value">${advocate?.name || 'Practicing Property Advocate'}</span></div>
          <div class="info-row"><span class="info-label">Executive Finding:</span> <span class="info-value">${report.summary}</span></div>
        </div>

        <p>Log in with your registered phone number or email to view the complete observations, legal recommendation, and download your verified certification.</p>
      `,
      actionBtnText: 'View Legal Report & Certificate',
      actionBtnUrl: `${BASE_FRONTEND_URL}/login`
    })
  };

  return transporter.sendMail(mailOptions);
};

export default {
  sendCustomerOtpEmail,
  sendAdminNewClientNotification,
  sendAdvocateAssignedNotification,
  sendReportApprovedNotification
};
