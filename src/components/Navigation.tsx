'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChartBig, PenToolIcon, LineChartIcon } from 'lucide-react';
import { useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Navigation: React.FC = () => {
  const { user } = useAuth();
  const [signOut] = useSignOut(auth);
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <BarChartBig /> },
    { href: '/trades', label: 'All Trades', icon: <PenToolIcon /> },
    { href: '/analytics', label: 'Analytics', icon: <LineChartIcon /> }
  ];

  // Preparing for Beta Testing 
  
  return (
    <nav className="bg-card border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="mr-2 md:m-0 flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground">
                Forex<span className="text-emerald-400">Pencil</span>
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {user && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`items-center flex justify-center md:flex p-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-emerald-600 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => signOut()}
                className=" p-1 md:px-4 md:py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-500"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className=" p-1 md:px-4 md:py-2 rounded-lg font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Login
              </Link>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};