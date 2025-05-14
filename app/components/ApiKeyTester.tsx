import React, { useState } from 'react';
import { apiKeyService } from '../services/apiKeyService';

export const ApiKeyTester: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [validationResult, setValidationResult] = useState<{ valid?: boolean; message?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    if (!apiKey.trim()) return;

    setIsLoading(true);
    setValidationResult(null);
    
    try {
      const result = await apiKeyService.validateApiKey(apiKey);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({ valid: false, message: 'Error occurred while validating key' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-8 mb-8">
      <h2 className="text-xl font-bold mb-2">Test API Key</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Check if an API key is valid by testing it here.
      </p>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter API key to test"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono"
        />
        <button
          onClick={handleTest}
          disabled={isLoading || !apiKey.trim()}
          className={`px-5 py-2 rounded font-semibold transition ${
            isLoading
              ? 'bg-gray-200 text-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Testing...' : 'Test Key'}
        </button>
      </div>

      {validationResult && (
        <div 
          className={`mt-4 p-4 rounded ${
            validationResult.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="font-semibold">
            {validationResult.valid ? '✅ Valid API Key' : '❌ Invalid API Key'}
          </div>
          <div className="text-sm mt-1">{validationResult.message}</div>
        </div>
      )}
    </div>
  );
}; 