# 🏁 InfyGalaxy Complete System Recovery Guide

This document contains the step-by-step instructions required to launch the **InfyGalaxy / OCR-Extraction.com** platform from scratch on any system.

## 1. Source Code & Environment

The entire source code is contained within this repository. To prepare for a fresh launch:

- **Dependencies**: Run `npm install` to install all React, Next.js, and Prisma libraries.
- **Environment Variables**: Copy `.env.example` to `.env` and fill in the production keys.

## 2. Database (PostgreSQL)

The platform uses Prisma ORM for database management.

- **Recreate Schema**: Once your `DATABASE_URL` is set in `.env`, run:

  ```bash
  npx prisma migrate deploy
  ```

- **Sync Client**: Generate the local Prisma client for the API:

  ```bash
  npx prisma generate
  ```

## 3. Deployment Details (Vercel)

The project is optimized for Vercel deployment.

- **Project Type**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Redirects**: Managed via `next.config.mjs` and `vercel.json`.

## 4. Key Properties & External APIs

To ensure full functionality, you will need active accounts for:

1. **Mistral AI**: Core AI and OCR extraction logic.
2. **Google Cloud**: Legacy OCR and Google Maps/IP geolocation.
3. **Google OAuth**: User authentication.
4. **Upstash Redis**: Global rate limiting and session management.
5. **Inngest**: Background workflow orchestration (Processing large files).
6. **Resend**: Automated email alerts for Contact/Lead forms.

## 5. Local Launch (Fresh)

To test the entire system locally:

1. Ensure a PostgreSQL instance is running.
2. Update `.env` with local DB credentials.
3. Run `npm run dev`.
4. The site will be accessible at `http://localhost:3000`.

## 6. Data Backup Recommendation

To take a complete "copy" of the existing live data:

- **DB Dump**: Run `pg_dump DATABASE_URL > full_db_backup.sql` from your terminal if using a self-hosted Postgres.
- **Media Assets**: All static assets are stored in the `/public` and `/services-images` directories within this repository.

---
**Architectural Note**: This repository contains 100% of the logic, styles, and assets required to run the site. No critical properties are stored outside of the code/DB environment except for the API keys themselves.
