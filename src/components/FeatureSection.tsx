import React from 'react';

export const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: '📊',
      title: 'Comprehensive Analytics',
      description: 'Track win rates, profit/loss, and performance metrics across all your trades.'
    },
    {
      icon: '🧠',
      title: 'Psychology Tracking',
      description: 'Monitor your emotional state and confidence levels to identify patterns in your trading behavior.'
    },
    {
      icon: '🎯',
      title: 'Strategy Analysis',
      description: 'Compare different trading strategies and discover which ones work best for you.'
    },
    {
      icon: '📈',
      title: 'Performance Charts',
      description: 'Visualize your equity curve and trading performance over time with detailed charts.'
    },
    {
      icon: '🔍',
      title: 'Advanced Filtering',
      description: 'Filter trades by pair, strategy, date range, and outcome to find exactly what you need.'
    },
    {
      icon: '💾',
      title: 'Data Export',
      description: 'Export your trading data for backup or analysis in external tools (Firebase ready).'
    }
  ];

  return (
    <div className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything You Need to <span className="text-emerald-400">Improve Your Trading</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Professional-grade features designed specifically for serious Forex traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-emerald-600 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
