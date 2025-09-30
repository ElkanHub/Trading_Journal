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

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold mb-1 ${trend ? trendColors[trend] : 'text-white'}`}>
            {value}
          </p>
          {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
        </div>
        {icon && <div className="text-slate-600 ml-4">{icon}</div>}
      </div>
    </div>
  );
};
