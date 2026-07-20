"use client";

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage({ text: res.data?.data?.message || 'Reset link sent! Check your email.', type: 'success' });
      setEmail('');
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.error?.message || 'Something went wrong. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="absolute top-10 right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-extrabold text-white inline-block">
              JS <span className="text-orange-500">FITNESS</span>
            </h1>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-slate-300">Reset Your Password</h2>
          <p className="mt-2 text-slate-500 text-sm">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-sm py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-700">
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <input
                  type="email" required
                  placeholder="you@example.com"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-600 rounded-lg bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-slate-900 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg shadow-orange-500/20"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-slate-400 hover:text-orange-500 text-sm transition-colors inline-flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
