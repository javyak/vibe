# Admin Diagnostic Tools

This document explains the diagnostic tools that have been added to help troubleshoot Supabase database connections and user authentication.

## Available Tools

1. **Diagnostics Page**
   - URL: `/diagnostics`
   - Purpose: Provides a UI for testing Supabase connection and user creation
   - Access: Restricted to admin users only (see configuration below)

2. **Supabase Connection Test API**
   - URL: `/api/diagnostics/supabase`
   - Purpose: Tests database connection and returns detailed information
   - Access: Restricted to admin users only

3. **User Creation Test API**
   - URL: `/api/diagnostics/test-user-creation`
   - Purpose: Tests the creation of users in the Supabase database
   - Access: Restricted to admin users only

4. **SQL Debug Script**
   - File: `/app/lib/debug-users-table.sql`
   - Purpose: SQL queries to check table structure and RLS policies
   - Usage: Run in Supabase SQL Editor

## Configuration

### Admin Access

These tools are restricted to admin users. To configure which users have admin access:

1. Edit the list of admin emails in:
   - `/app/diagnostics/page.tsx`
   - `/app/api/diagnostics/supabase/route.ts`
   - `/app/api/diagnostics/test-user-creation/route.ts`

Replace the example admin email with actual admin emails:

```typescript
const adminEmails = ['admin@example.com']; // Replace with actual admin emails
```

### Security Considerations

- These diagnostic tools should only be accessible by trusted administrators
- Consider removing these tools completely in production if they're not needed
- Review the SQL debug script before running it in production environments

## Usage

1. Log in with an admin account
2. Navigate to `/diagnostics`
3. Use the UI to test Supabase connection and user creation
4. Check console logs for detailed error messages

## Troubleshooting Common Issues

1. **Connection Issues**
   - Verify Supabase URL and anon key in environment variables
   - Check network access to Supabase host

2. **User Creation Issues**
   - Verify table structure in Supabase
   - Check RLS policies using the SQL debug script
   - Ensure UUID formatting is correct

3. **Authentication Flow Issues**
   - Review NextAuth callbacks in `/app/api/auth/[...nextauth]/route.ts`
   - Check for errors in the session and JWT callbacks
