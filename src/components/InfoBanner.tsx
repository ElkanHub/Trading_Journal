import React, { useState } from 'react';

export const InfoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-emerald-900/20 border border-emerald-700/50 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔐</span>
            <h3 className="text-emerald-400 font-semibold">Secure Data, Easy Access</h3>
          </div>
          <p className="text-slate-300 text-sm">
            Your data is encrypted and stored securely. Only you have access to your information.
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
