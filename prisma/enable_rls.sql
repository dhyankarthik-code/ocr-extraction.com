-- Enable RLS on User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role (Prisma/Postgres user) to do everything
-- Note: 'postgres' or 'service_role' bypasses RLS by default on Supabase, 
-- but enabling RLS suppresses the dashboard warning.
-- We can add a policy for authenticated users later if we use Supabase Client on frontend.

CREATE POLICY "Enable all access for service role" ON "User"
AS PERMISSIVE FOR ALL
TO service_role, postgres
USING (true)
WITH CHECK (true);
