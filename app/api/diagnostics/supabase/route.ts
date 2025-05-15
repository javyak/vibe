import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/app/services/userService";
import { supabase } from "@/app/lib/supabaseClient";
import { getSession } from "@/app/lib/auth";

// API endpoint for diagnosing Supabase connection and user data storage issues
export async function GET(request: NextRequest) {
  try {
    // Get current user (to check permissions)
    const session = await getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        status: "error", 
        message: "Authentication required" 
      }, { status: 401 });
    }
    
    // Restrict access to specific admin emails
    const adminEmails = ['admin@example.com']; // Replace with actual admin emails
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ 
        status: "error", 
        message: "Access denied: Admin privileges required" 
      }, { status: 403 });
    }
    
    // 1. Test Supabase connection
    const connectionInfo = await userService.checkConnection();
    
    // 2. Node.js environment info
    const nodeInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      env: process.env.NODE_ENV,
    };
    
    // 3. Generate a test user ID to see how it would be formatted
    const testUserId = '123456789012345678901';
    const formattedId = userService.formatUserId(testUserId);
    
    // 4. Get request headers (useful for debugging)
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    // Return diagnostic information
    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      userEmail: session?.user?.email || 'Not authenticated',
      nodeInfo,
      connectionInfo,
      idFormatting: {
        originalId: testUserId,
        formattedId: formattedId,
        isValidUuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formattedId),
      },
      configInfo: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKeyAvailable: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      },
      requestInfo: {
        method: request.method,
        url: request.url,
        headers,
      },
    });
  } catch (error) {
    console.error("Error in diagnostic endpoint:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
