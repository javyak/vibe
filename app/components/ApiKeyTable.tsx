import React, { useState } from 'react';
import { ApiKey } from '../types/apiKey';

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
  visibleKeys: { [id: string]: boolean };
  onToggleVisibility: (id: string) => void;
  onCopyKey: (value: string) => void;
  onEdit: (id: string, name: string, value: string) => void;
  onDelete: (id: string) => void;
}

export const ApiKeyTable: React.FC<ApiKeyTableProps> = ({
  apiKeys,
  visibleKeys,
  onToggleVisibility,
  onCopyKey,
  onEdit,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editValue, setEditValue] = useState<string>("");

  const handleStartEdit = (id: string, currentName: string, currentValue: string) => {
    setEditingId(id);
    setEditName(currentName);
    setEditValue(currentValue);
  };

  const handleConfirmEdit = (id: string) => {
    if (!editName.trim() || !editValue.trim()) return;
    onEdit(id, editName, editValue);
    setEditingId(null);
    setEditName("");
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditValue("");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-left border-b">
            <th className="py-2 px-3 font-semibold">NAME</th>
            <th className="py-2 px-3 font-semibold">USAGE</th>
            <th className="py-2 px-3 font-semibold">KEY</th>
            <th className="py-2 px-3 font-semibold">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.filter(Boolean).map((keyObj) => (
            <tr key={keyObj.id} className="border-b last:border-0">
              <td className="py-2 px-3 align-top">
                {editingId === keyObj.id ? (
                  <input
                    className="rounded px-2 py-1 border border-gray-300 bg-white text-black w-28"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    placeholder="Name"
                  />
                ) : (
                  keyObj.name
                )}
              </td>
              <td className="py-2 px-3 align-top">{keyObj.usage}</td>
              <td className="py-2 px-3 align-top">
                {editingId === keyObj.id ? (
                  <input
                    className="rounded px-2 py-1 border border-gray-300 bg-white text-black w-48 font-mono"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="API Key"
                  />
                ) : (
                  <span className="bg-gray-100 rounded px-2 py-1 font-mono">
                    {visibleKeys[keyObj.id]
                      ? keyObj.value
                      : keyObj.value.slice(0, 8) + "********************"}
                  </span>
                )}
              </td>
              <td className="py-2 px-3 align-top">
                <div className="flex gap-2">
                  {editingId === keyObj.id ? (
                    <>
                      <button
                        className="text-green-600 hover:underline text-xs"
                        onClick={() => handleConfirmEdit(keyObj.id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-500 hover:underline text-xs"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="hover:bg-gray-200 rounded p-1"
                        title={visibleKeys[keyObj.id] ? "Hide Key" : "Show Key"}
                        onClick={() => onToggleVisibility(keyObj.id)}
                      >
                        {visibleKeys[keyObj.id] ? "🙈" : "👁️"}
                      </button>
                      <button
                        className="hover:bg-gray-200 rounded p-1"
                        title="Copy Key"
                        onClick={() => onCopyKey(keyObj.value)}
                      >
                        📋
                      </button>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleStartEdit(keyObj.id, keyObj.name, keyObj.value)}
                      >
                        Edit
                      </button>
                      <button
                        className="hover:bg-gray-200 rounded p-1"
                        title="Delete"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
                            onDelete(keyObj.id);
                          }
                        }}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {apiKeys.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-6">
                No API keys yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}; 