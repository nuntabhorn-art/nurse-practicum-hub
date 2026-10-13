# Nurse Practicum Hub: Supabase migration

## Current safe state

The existing Google Apps Script API remains active. The new Supabase layer is deliberately disabled until a project is configured, so the current site can continue to work during migration.

## Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. Copy `supabase-config.example.js` to `supabase-config.js`.
4. Fill in the project URL and the browser-safe `anon` key.
5. Add Supabase JS CDN and `supabase-config.js` before `supabase-client.js` on each page.
6. Do not commit `supabase-config.js` if the project uses a private deployment configuration. The anon key is not a secret, but the service-role key must never be exposed.

## Migration order

1. Create/import profiles and verify roles.
2. Replace login/session handling.
3. Replace dashboard reads.
4. Replace daily work submission and grading.
5. Replace teams and skill evaluations.
6. Replace attendance and file uploads.
7. Replace exams, pet progress, and reports.
8. Keep Apps Script read-only as a rollback/reporting path, then retire it after verification.

## Required verification before cutover

- Student cannot read another student's private data.
- Student cannot grade work or award points.
- Teacher can only access authorized course/team data.
- Admin actions are logged.
- Attendance uses server time and validates location server-side.
- Uploaded files have size/type restrictions and private storage policies.
- A rollback export exists before disabling Apps Script writes.

## Legacy Apps Script bridge

`apps-script/otp-api-patch.gs` contains the safe bridge patch needed before
cutting over to Supabase. It fixes the current mismatch where the OTP endpoint
returns success without a session token, and combines OTP actions with the
existing `handlePost` API actions. Merge it into the same Apps Script project;
do not deploy it as a separate web app.
