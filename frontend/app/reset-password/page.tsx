"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage({ text: 'Invalid or missing reset token.', type: 'error' });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await api.post('/auth/reset-password', { token, newPassword: password });
      setMessage({ text: res.data?.data?.message || 'Password reset successfully!', type: 'success' });
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.error?.message || 'Failed to reset password. The token may be expired.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <Link href="/">
          <h1 className="text-3xl font-extrabold text-white inline-block">
            JS <span className="text-orange-500">FITNESS</span>
          </h1>
        </Link>
        <h2 className="mt-4 text-xl font-bold text-slate-300">Choose a New Password</h2>
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
            <label className="block text-sm font-medium text-slate-300 mb-1.5">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} required
                placeholder="••••••••"
                className="block w-full pl-4 pr-10 py-3 border border-slate-600 rounded-lg bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!token || message.type === 'success'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                disabled={!token || message.type === 'success'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading || !token || message.type === 'success'}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-slate-900 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg shadow-orange-500/20"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-slate-400 hover:text-orange-500 text-sm transition-colors inline-flex items-center">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="absolute top-10 right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
