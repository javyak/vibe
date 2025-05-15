"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex items-center mb-8 px-2">
        <div className="h-8 w-8 rounded-full mr-2 bg-gray-200 animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center mb-8 px-2">
        <Link 
          href="/auth/signin"
          className="text-sm text-blue-600 hover:underline"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-8 px-2 relative">
      <button 
        className="flex items-center w-full"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <img
          src={session?.user?.image || "/avatar.png"}
          alt={session?.user?.name || "User"}
          className="h-8 w-8 rounded-full mr-2 border border-gray-200"
        />
        <span className="text-sm text-gray-700 font-medium truncate flex-1">
          {session?.user?.name || "User"}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-100">
          <div className="px-4 py-2 text-xs text-gray-500">
            {session?.user?.email}
          </div>
          <div className="border-t border-gray-100"></div>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signout" })}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
