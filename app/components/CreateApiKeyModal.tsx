import React, { useState } from 'react';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, value: string) => Promise<void>;
}

export const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [newKeyName, setNewKeyName] = useState("");
  const [newApiKeyValue, setNewApiKeyValue] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      setFormError("Key name is required.");
      return;
    }
    if (!newApiKeyValue.trim()) {
      setFormError("API key value is required.");
      return;
    }

    try {
      await onCreate(newKeyName, newApiKeyValue);
      setNewKeyName("");
      setNewApiKeyValue("");
      setFormError(null);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <h3 className="text-xl font-bold mb-2">Create a new API key</h3>
        <p className="text-gray-500 mb-4 text-sm">
          Enter a name and value for the new API key.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Key Name <span className="text-gray-400">— A unique name to identify this key</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Key Name"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            API Key <span className="text-gray-400">— The actual key value</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono"
            placeholder="Enter API Key"
            value={newApiKeyValue}
            onChange={e => setNewApiKeyValue(e.target.value)}
          />
        </div>
        {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={handleCreate}
          >
            Create
          </button>
          <button
            className="px-5 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}; 