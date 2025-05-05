"use client";
import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import { ApiKeyTable } from "../components/ApiKeyTable";
import { Notification } from "../components/Notification";
import { CreateApiKeyModal } from "../components/CreateApiKeyModal";
import { useApiKeys } from "../hooks/useApiKeys";

export default function ApiKeyManagement() {
  const [showModal, setShowModal] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const {
    apiKeys,
    notification,
    visibleKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleKeyVisibility,
    copyKeyToClipboard,
    setNotification,
  } = useApiKeys();

  const handleCreateApiKey = () => {
    setShowModal(true);
  };

  const handleEditApiKey = async (id: string, name: string, value: string) => {
    await updateApiKey(id, { name, value });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
      <div className="flex-1 relative bg-[#f7fafd]">
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

        {/* Notification */}
        {notification && (
          <Notification
            message={notification.message}
            color={notification.color}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Main dashboard content */}
        <div className="w-full max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-2xl shadow p-8 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">API Keys</h2>
              <button
                onClick={handleCreateApiKey}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 text-2xl"
                title="Create New API Key"
              >
                +
              </button>
            </div>
            <p className="text-gray-500 mb-6 text-sm">
              The key is used to authenticate your requests to the Research API. To learn more, see the <a href="#" className="text-blue-600 underline">documentation</a> page.
            </p>
            
            <ApiKeyTable
              apiKeys={apiKeys}
              visibleKeys={visibleKeys}
              onToggleVisibility={toggleKeyVisibility}
              onCopyKey={copyKeyToClipboard}
              onEdit={handleEditApiKey}
              onDelete={deleteApiKey}
            />
          </div>
        </div>

        {/* Create API Key Modal */}
        <CreateApiKeyModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={createApiKey}
        />
      </div>
    </div>
  );
}
