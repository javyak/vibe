import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Use this function to get the session on the server side
export async function getSession() {
  return await getServerSession();
}

// Middleware to protect server actions and API routes
export async function authMiddleware(req: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized: Please sign in to access this resource" },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
}
