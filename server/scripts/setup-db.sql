-- Create database (run this separately as superuser if needed)
-- createdb parking_passes

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (admin and scanner accounts)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'scanner')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Passes table
CREATE TABLE IF NOT EXISTS passes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(255) NOT NULL,
  phone          VARCHAR(20) UNIQUE NOT NULL,
  department     VARCHAR(50) NOT NULL CHECK (department IN ('office', 'vendor', 'participants', 'cab_driver', 'tourist_guide')),
  status         VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'checked_in', 'expired', 'revoked')),
  valid_from     DATE NOT NULL,
  valid_until    DATE NOT NULL,
  checked_in_at  TIMESTAMPTZ,
  checked_out_at TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Scan logs table
CREATE TABLE IF NOT EXISTS scan_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pass_id    UUID NOT NULL REFERENCES passes(id),
  action     VARCHAR(20) NOT NULL CHECK (action IN ('check_in', 'check_out')),
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTPs table
CREATE TABLE IF NOT EXISTS otps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      VARCHAR(20) NOT NULL,
  code       VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_passes_phone      ON passes(phone);
CREATE INDEX IF NOT EXISTS idx_passes_status     ON passes(status);
CREATE INDEX IF NOT EXISTS idx_passes_department ON passes(department);
CREATE INDEX IF NOT EXISTS idx_scan_logs_pass_id ON scan_logs(pass_id);
CREATE INDEX IF NOT EXISTS idx_otps_phone        ON otps(phone);

-- Default users are seeded by: node src/db/setup.js
-- Credentials: admin/admin123  |  scanner/scanner123
