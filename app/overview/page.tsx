"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/sidebar';
import { apiKeyService } from '../services/apiKeyService';
import dynamic from 'next/dynamic';
import { ApiKey } from '../types/apiKey';

// Import the chart component with SSR disabled
const UsageChart = dynamic(() => import('../components/UsageChart'), {
  ssr: false,
});

const QUOTA_LIMIT = 50; // Maximum number of API keys allowed

export default function OverviewPage() {
  const [stats, setStats] = useState<{ count: number; totalUsage: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const fetchData = async () => {
    try {
      const [newStats, keys] = await Promise.all([
        apiKeyService.fetchApiKeyStats(),
        apiKeyService.fetchApiKeys()
      ]);
      setStats(newStats);
      setApiKeys(keys);
      setError(null);
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up polling to update stats every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate progress percentage
  const progressPercentage = stats ? (stats.count / QUOTA_LIMIT) * 100 : 0;

  // Transform API keys data for the chart
  const chartData = apiKeys.map(key => ({
    name: key.name,
    usage: key.usage || 0
  }));

  return (
    <div className="flex min-h-screen">
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="flex-1 relative bg-[#fafbfc]">
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
        <div className="w-full max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-8">Overview</h1>
          
          {/* Quota Card */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-lg text-gray-600 mb-6">API Keys Quota</h2>
            
            {/* Current Usage Display */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">{loading ? '...' : stats?.count ?? 0}</span>
              <span className="text-gray-500">/ {QUOTA_LIMIT}</span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {progressPercentage.toFixed(1)}% Used
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className={`
                    shadow-none flex flex-col text-center whitespace-nowrap
                    text-white justify-center
                    ${progressPercentage >= 90 ? 'bg-red-500' : 
                      progressPercentage >= 75 ? 'bg-yellow-500' : 
                      'bg-blue-600'
                    }
                    transition-all duration-500
                  `}
                />
              </div>
            </div>
          </div>

          {/* Usage Graph Card */}
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg text-gray-600">API Key Usage</h2>
            </div>
            <UsageChart data={chartData} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Total Usage Card */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm mb-2">Total API Key Usage</span>
                <span className="text-3xl font-bold text-blue-600">
                  {loading ? '...' : stats?.totalUsage ?? 0}
                </span>
              </div>
            </div>
            
            {/* Active Keys Card */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex flex-col items-center">
                <span className="text-gray-500 text-sm mb-2">Active API Keys</span>
                <span className="text-3xl font-bold text-blue-600">
                  {loading ? '...' : stats?.count ?? 0}
                </span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-600 font-semibold">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 