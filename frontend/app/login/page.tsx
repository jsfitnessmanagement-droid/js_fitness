"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await api.post('/auth/login', { email, password });
      // API returns { success: true, data: { ...user, token } }
      const payload = resp?.data?.data ?? resp?.data ?? {};

      // Save token and user info
      if (payload.token) localStorage.setItem('token', payload.token);
      if (payload.role) localStorage.setItem('userRole', payload.role);
      if (payload.name) localStorage.setItem('userName', payload.name);

      // Redirect based on role
      if (payload.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/member');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || err.response?.data?.message || 'Failed to login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex relative overflow-hidden">
      {/* Background Image Side */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-slate-900" />
        </div>
        <div className="relative z-10 flex flex-col justify-end h-full p-12">
          <h2 className="text-4xl font-black text-white mb-4">
            Welcome to <span className="gradient-text">JS Fitness</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-md">
            Access your membership, track progress, and download your personalized workout plans.
          </p>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12">
        {/* Decorative blobs */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <Link href="/" className="block text-center mb-2">
            <h1 className="text-3xl font-extrabold text-white inline-block">
              JS <span className="text-orange-500">FITNESS</span>
            </h1>
          </Link>
          <h2 className="mt-4 text-center text-xl sm:text-2xl font-bold text-slate-300">Sign in to your account</h2>
          <p className="mt-2 text-center text-slate-500 text-sm">
            Admin or member — enter your credentials below
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-slate-800/80 backdrop-blur-sm py-8 px-6 sm:px-10 shadow-2xl sm:rounded-2xl border border-slate-700">
            <form className="space-y-5" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center animate-fade-in">
                  {error}
                </div>
              )}
              
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

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 border border-slate-600 rounded-lg bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit" disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-slate-900 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg shadow-orange-500/20"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign in'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/" className="text-slate-400 hover:text-orange-500 text-sm transition-colors inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
