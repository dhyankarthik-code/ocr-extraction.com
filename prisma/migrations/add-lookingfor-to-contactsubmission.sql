-- Migration: Add lookingFor to ContactSubmission
-- Ensures ContactSubmission records store selected service intent

ALTER TABLE IF EXISTS "ContactSubmission"
ADD COLUMN IF NOT EXISTS "lookingFor" TEXT;
