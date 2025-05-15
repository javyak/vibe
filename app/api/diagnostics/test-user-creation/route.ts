import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/app/services/userService";
import { getSession } from "@/app/lib/auth";

// API endpoint to test user creation functionality
export async function POST(request: NextRequest) {
  try {
    // Get current session to verify admin status
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
    
    // Get request body
    const body = await request.json();
    
    if (!body.testUserId) {
      return NextResponse.json({
        status: "error",
        message: "testUserId is required"
      }, { status: 400 });
    }
    
    // Test user ID creation with formatting
    const formattedTestUserId = await userService.formatUserId(body.testUserId);
    
    // Check if test user exists
    const userExists = await userService.checkUserExists(body.testUserId);
    
    // Try to create a test user
    const result = await userService.upsertUser({
      id: body.testUserId,
      email: `test-${Date.now()}@example.com`,
      name: "Test User",
      image: null,
    });
    
    return NextResponse.json({
      status: "success",
      testUserId: body.testUserId,
      formattedUserId: formattedTestUserId,
      userExisted: userExists,
      result,
    });
  } catch (error) {
    console.error("Error testing user creation:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
