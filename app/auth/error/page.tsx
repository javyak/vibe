"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have access to this resource.",
    Verification: "The verification link may have been used or is invalid.",
    Default: "An unexpected authentication error occurred."
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Image
          className="dark:invert"
          src="/vibe_project_logo.png"
          alt="vibe logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h2>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          
          <div className="flex flex-col gap-4">
            <Link
              href="/auth/signin"
              className="rounded-full border border-solid border-transparent bg-blue-600 text-white px-5 py-2 hover:bg-blue-700 transition-colors"
            >
              Try signing in again
            </Link>
            <Link
              href="/"
              className="text-blue-600 hover:underline"
            >
              Return to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// Define a fallback component for the Suspense boundary
function AuthErrorFallback() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-gray-700">Please wait while we load your authentication information.</p>
        </div>
      </main>
    </div>
  );
}

// Export the main component with Suspense
export default function AuthError() {
  return (
    <Suspense fallback={<AuthErrorFallback />}>
      <AuthErrorContent />
    </Suspense>
  );
}
