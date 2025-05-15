"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SupabaseDiagnostics() {
  const { data: session } = useSession();
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [testUserData, setTestUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [testUserIdInput, setTestUserIdInput] = useState<string>('test-user-123');

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/diagnostics/supabase');
      const data = await response.json();
      setDiagnosticData(data);
    } catch (error) {
      console.error("Error running diagnostics:", error);
      setDiagnosticData({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testUserCreation = async () => {
    if (!testUserIdInput) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/diagnostics/test-user-creation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testUserId: testUserIdInput,
        }),
      });
      
      const data = await response.json();
      setTestUserData(data);
    } catch (error) {
      console.error("Error testing user creation:", error);
      setTestUserData({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Supabase Diagnostics</h1>
        <p>You need to be signed in to access this page.</p>
      </div>
    );
  }
  
  // Restrict access to specific admin emails
  const adminEmails = ['admin@example.com']; // Replace with actual admin emails
  const isAdmin = session.user?.email && adminEmails.includes(session.user.email);
  
  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Supabase Diagnostics</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Connection Test</h2>
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Supabase Connection'}
          </button>
          
          {diagnosticData && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Results:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(diagnosticData, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Test User Creation</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={testUserIdInput}
              onChange={(e) => setTestUserIdInput(e.target.value)}
              placeholder="Enter a test user ID"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={testUserCreation}
              disabled={loading || !testUserIdInput}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test User Creation'}
            </button>
          </div>
          
          {testUserData && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Results:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(testUserData, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Current Session Info</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
