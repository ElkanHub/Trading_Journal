import React, { useState } from 'react';

export const InfoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔐</span>
            <h3 className="text-primary font-semibold">Secure Data, Easy Access</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Your data is encrypted and stored securely. Only you have access to your information.
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
