'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from '../components/Notification';
import Sidebar from '../components/sidebar';
import { apiKeyService } from '../services/apiKeyService';

export default function ProtectedPage() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationProps, setNotificationProps] = useState<{
    message: string;
    color: 'green' | 'red';
  }>({ message: '', color: 'green' });
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const validateApiKey = async () => {
      const apiKey = localStorage.getItem('apiKey');
      
      if (!apiKey) {
        router.push('/playground');
        return;
      }

      try {
        const result = await apiKeyService.validateApiKey(apiKey);
        
        if (result.valid) {
          setNotificationProps({
            message: 'Valid API key, /protected can be accessed',
            color: 'green'
          });
        } else {
          setNotificationProps({
            message: result.message || 'Invalid API Key',
            color: 'red'
          });
          // Redirect back to playground after 2 seconds
          setTimeout(() => {
            router.push('/playground');
          }, 2000);
        }
      } catch (error) {
        console.error('Error validating API key:', error);
        setNotificationProps({
          message: 'Error validating API key',
          color: 'red'
        });
        // Redirect back to playground after 2 seconds
        setTimeout(() => {
          router.push('/playground');
        }, 2000);
      }
      
      setShowNotification(true);
    };

    validateApiKey();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Protected Content
          </h2>
          <p className="text-center text-gray-600">
            This is a protected page that requires a valid API key.
          </p>
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