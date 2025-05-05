import { useState, useEffect } from 'react';
import { ApiKey } from '../types/apiKey';
import { apiKeyService } from '../services/apiKeyService';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [notification, setNotification] = useState<{ message: string; color: "green" | "red" } | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<{ [id: string]: boolean }>({});

  const fetchApiKeys = async () => {
    try {
      const keys = await apiKeyService.fetchApiKeys();
      setApiKeys(keys);
    } catch (error) {
      setNotification({ message: "Failed to fetch API keys", color: "red" });
    }
  };

  const createApiKey = async (name: string, value: string) => {
    try {
      await apiKeyService.createApiKey(name, value);
      await fetchApiKeys();
      setNotification({ message: "API key created successfully", color: "green" });
    } catch (error) {
      setNotification({ message: "Failed to create API key", color: "red" });
      throw error;
    }
  };

  const updateApiKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      const updatedKey = await apiKeyService.updateApiKey(id, updates);
      setApiKeys(apiKeys.map((k) => (k.id === id ? updatedKey : k)));
      setNotification({ message: "API key updated successfully", color: "green" });
    } catch (error) {
      setNotification({ message: "Failed to update API key", color: "red" });
      throw error;
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      await apiKeyService.deleteApiKey(id);
      setApiKeys(apiKeys.filter((k) => k.id !== id));
      setNotification({ message: "API key deleted", color: "red" });
    } catch (error) {
      setNotification({ message: "Failed to delete API key", color: "red" });
      throw error;
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyKeyToClipboard = (value: string) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      navigator.clipboard.writeText(value)
        .then(() => setNotification({ message: "API Key copied!", color: "green" }))
        .catch(() => fallbackCopyTextToClipboard(value));
    } else {
      fallbackCopyTextToClipboard(value);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setNotification({ message: "API Key copied!", color: "green" });
      } else {
        setNotification({ message: "Failed to copy API Key!", color: "red" });
      }
    } catch (err) {
      setNotification({ message: "Failed to copy API Key!", color: "red" });
    }

    document.body.removeChild(textArea);
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return {
    apiKeys,
    notification,
    visibleKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    toggleKeyVisibility,
    copyKeyToClipboard,
    setNotification,
  };
}; 