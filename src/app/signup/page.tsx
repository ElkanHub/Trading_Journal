'use client';

import React, { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [createUserWithEmailAndPassword, , , error] = useCreateUserWithEmailAndPassword(auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');
    const success = await createUserWithEmailAndPassword(email, password);
    if (success) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              required
            />
          </div>
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded font-semibold transition-colors"
          >
            Sign Up
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4">{error.message}</p>
        )}

        <p className="text-center text-slate-400 mt-6">
          Already have an account? <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
