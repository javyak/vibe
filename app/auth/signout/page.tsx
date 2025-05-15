"use client";

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignOut() {
  const [isSigningOut, setIsSigningOut] = useState(true);

  useEffect(() => {
    // Auto sign out when page loads
    const signOutUser = async () => {
      await signOut({ redirect: false });
      setIsSigningOut(false);
    };

    signOutUser();
  }, []);

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
          {isSigningOut ? (
            <p className="text-lg mb-4">Signing out...</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">You've been signed out</h2>
              <p className="text-gray-600 mb-6">Thanks for using Vibe!</p>
              <Link
                href="/"
                className="inline-block rounded-full border border-solid border-transparent bg-blue-600 text-white px-5 py-2 hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
