import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, trend, icon }) => {
  const trendColors = {
    up: 'text-emerald-500',
    down: 'text-red-500',
    neutral: 'text-slate-400'
  };

  const getFontSizeClass = (val: string | number) => {
    const len = String(val).length;
    if (len > 12) return 'text-lg md:text-xl';
    if (len > 9) return 'text-xl md:text-2xl';
    if (len > 6) return 'text-2xl md:text-3xl';
    return 'text-3xl md:text-4xl';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className={`font-bold mb-1 ${getFontSizeClass(value)} ${trend ? trendColors[trend] : 'text-white'}`}>
            {value}
          </p>
          {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
        </div>
        {icon && <div className="text-slate-600 ml-4">{icon}</div>}
      </div>
    </div>
  );
};
