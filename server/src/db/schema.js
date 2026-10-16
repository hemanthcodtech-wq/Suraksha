import { query } from './index.js';

export const initSchema = async () => {
  const sql = `
    -- 1. Users table (Admin, Advocates, Clients)
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'Customer', -- 'Administrator', 'Advocate', 'Customer'
      phone VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Advocates table
    CREATE TABLE IF NOT EXISTS advocates (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50) NOT NULL,
      bar_council_id VARCHAR(100) UNIQUE NOT NULL,
      specialization VARCHAR(255) NOT NULL,
      experience_years INTEGER NOT NULL DEFAULT 1,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      temporary_password VARCHAR(255) DEFAULT 'Advocate@123',
      rating NUMERIC(3, 1) DEFAULT 5.0,
      status VARCHAR(50) DEFAULT 'Active', -- 'Active', 'Inactive'
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Ensure temporary_password column exists if table was already created
    ALTER TABLE advocates ADD COLUMN IF NOT EXISTS temporary_password VARCHAR(255) DEFAULT 'Advocate@123';

    -- 3. Cases / Clients table
    CREATE TABLE IF NOT EXISTS cases (
      id SERIAL PRIMARY KEY,
      case_reference VARCHAR(50) UNIQUE NOT NULL,
      service_type VARCHAR(100) NOT NULL,
      property_type VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      seller_or_builder VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      client_email VARCHAR(255) NOT NULL,
      client_phone VARCHAR(50) NOT NULL,
      client_notes TEXT,
      documents_count INTEGER DEFAULT 1,
      assigned_advocate_id INTEGER REFERENCES advocates(id) ON DELETE SET NULL,
      assigned_at TIMESTAMP WITH TIME ZONE,
      status VARCHAR(50) DEFAULT 'New', -- 'New', 'Assigned', 'In Review', 'Pending Approval', 'Approved', 'Completed'
      certificate_url TEXT,
      certificate_name VARCHAR(255),
      certificate_uploaded_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Ensure certificate and uploaded document columns exist if table was already created
    ALTER TABLE cases ADD COLUMN IF NOT EXISTS certificate_url TEXT;
    ALTER TABLE cases ADD COLUMN IF NOT EXISTS certificate_name VARCHAR(255);
    ALTER TABLE cases ADD COLUMN IF NOT EXISTS certificate_uploaded_at TIMESTAMP WITH TIME ZONE;
    ALTER TABLE cases ADD COLUMN IF NOT EXISTS uploaded_documents JSONB DEFAULT '[]'::jsonb;

    -- 4. Prepared Reports (Advocate review awaiting Admin Approval for client portal)
    CREATE TABLE IF NOT EXISTS prepared_reports (
      id SERIAL PRIMARY KEY,
      case_id INTEGER REFERENCES cases(id) ON DELETE CASCADE,
      advocate_id INTEGER REFERENCES advocates(id) ON DELETE CASCADE,
      report_title VARCHAR(255) NOT NULL,
      summary TEXT NOT NULL,
      risk_level VARCHAR(50) NOT NULL DEFAULT 'Low Risk', -- 'Low Risk', 'Moderate Caution', 'Critical Defect'
      observations TEXT NOT NULL,
      documents_inspected TEXT[] DEFAULT '{}',
      advocate_recommendation TEXT NOT NULL,
      approval_status VARCHAR(50) DEFAULT 'Pending Approval', -- 'Pending Approval', 'Approved', 'Revision Requested'
      admin_feedback TEXT,
      approved_by_admin_id INTEGER REFERENCES users(id),
      approved_at TIMESTAMP WITH TIME ZONE,
      visible_to_client BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. Customer OTP Verifications table
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      otp_code VARCHAR(10) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(sql);
    console.log('✅ Neon DB Schema verified and active.');
  } catch (error) {
    console.error('❌ Failed to initialize schema in Neon DB:', error.message);
  }
};
