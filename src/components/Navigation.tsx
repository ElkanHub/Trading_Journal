import React from 'react';
import {BarChartBig, PenToolIcon,LineChartIcon} from 'lucide-react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

interface NavigationProps {
  currentView: 'dashboard' | 'trades' | 'analytics';
  onViewChange: (view: 'dashboard' | 'trades' | 'analytics') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const [signOut] = useSignOut(auth);
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChartBig /> },
    { id: 'trades', label: 'All Trades', icon: <PenToolIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <LineChartIcon /> }
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="mr-2 md:m-0 flex items-center">
            <h1 className="text-2xl font-bold text-white">
              Forex<span className="text-emerald-400">Journal</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as any)}
                className={`items-center flex justify-center md:flex p-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => signOut()}
              className=" p-1 md:px-4 md:py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
