'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Notification } from '../components/Notification';
import Sidebar from '../components/sidebar';

export default function ProtectedPage() {
  const { data: session } = useSession();
  const [showNotification, setShowNotification] = useState(true);
  const [notificationProps, setNotificationProps] = useState<{
    message: string;
    color: 'green' | 'red';
  }>({ 
    message: 'You have successfully accessed the protected page!', 
    color: 'green' 
  });
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Hamburger button: only show when sidebar is hidden */}
      {!sidebarVisible && (
        <button
          className="fixed top-4 left-4 z-50 bg-white rounded-full shadow p-2 text-2xl"
          onClick={() => setSidebarVisible(true)}
          aria-label="Open sidebar"
        >
          ☰
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Protected Content
          </h2>
          
          {session ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center flex-col space-y-4">
                <img 
                  src={session.user.image || "/avatar.png"} 
                  alt={session.user.name || "User"}
                  className="h-20 w-20 rounded-full border-2 border-blue-500" 
                />
                <h3 className="text-xl font-bold">{session.user.name}</h3>
                <p className="text-gray-600">{session.user.email}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">User Session Info</h4>
                <pre className="text-xs overflow-auto p-2 bg-white rounded border border-blue-100">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Loading user information...
            </p>
          )}
        </div>
      </div>
      
      {showNotification && (
        <Notification
          message={notificationProps.message}
          color={notificationProps.color}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
} 