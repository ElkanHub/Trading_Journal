import React from 'react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-slate-900"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(https://d64gsuwffb70l.cloudfront.net/68db8ed0c2c2328e1706360d_1759219492061_51f2f0be.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Master Your Trading <span className="text-emerald-400">Psychology</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Track every trade, analyze your performance, and transform your trading from guesswork into a data-driven business.
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
          >
            Start Journaling Now
          </button>
        </div>
      </div>
    </div>
  );
};
