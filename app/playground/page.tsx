'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from '../components/Notification';
import Sidebar from '../components/sidebar';
import { apiKeyService } from '../services/apiKeyService';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProps, setNotificationProps] = useState<{
    message: string;
    color: 'green' | 'red';
  }>({ message: '', color: 'green' });
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await apiKeyService.validateApiKey(apiKey);
      
      if (result.valid) {
        // Store the API key in localStorage for the protected page to access
        localStorage.setItem('apiKey', apiKey);
        // Redirect to protected page
        router.push('/protected');
      } else {
        setNotificationProps({
          message: result.message || 'Invalid API Key',
          color: 'red'
        });
        setShowNotification(true);
      }
    } catch (error) {
      setNotificationProps({
        message: 'Error validating API key',
        color: 'red'
      });
      setShowNotification(true);
    }
  };

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
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Enter your API Key
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="apiKey" className="sr-only">
                API Key
              </label>
              <input
                id="apiKey"
                name="apiKey"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
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