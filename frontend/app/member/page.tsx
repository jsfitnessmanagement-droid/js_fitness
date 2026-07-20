"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function MemberStatus() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await api.get('/members/profile');
        const payload = resp?.data?.data ?? resp?.data ?? null;
        setProfile(payload);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Profile Not Found</h3>
        <p className="text-slate-400 mb-6">Please contact the admin to set up your membership.</p>
        <a href="https://wa.me/918397940001" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all text-sm">
          Contact on WhatsApp
        </a>
      </div>
    );
  }

  const joinDate = profile?.joinDate ? new Date(profile.joinDate) : null;
  const expirationDate = profile?.expirationDate ? new Date(profile.expirationDate) : null;
  const today = new Date();
  
  const totalDays = (joinDate && expirationDate) ? Math.round((expirationDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const daysLeft = (expirationDate) ? Math.round((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  const percentUsed = Math.min(100, Math.max(0, ((totalDays - daysLeft) / totalDays) * 100));

  // TODO: Fetch pricing from API instead of hardcoding to ensure it stays up to date
  const pricingMap: Record<string, string> = { 
    '1 Month': '₹1,500', 
    '3 Months': '₹3,600', 
    '6 Months': '₹6,000', 
    '1 Year': '₹10,000' 
  };

  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
        Welcome back, <span className="gradient-text">{profile?.user?.name ?? 'Member'}</span>!
      </h2>

      {/* Expiry Warning */}
      {(isExpiringSoon || isExpired) && (
        <div className={`p-4 rounded-xl border ${isExpired ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-2 ${isExpired ? 'text-red-400' : 'text-yellow-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>
              <p className={`font-medium ${isExpired ? 'text-red-400' : 'text-yellow-400'}`}>
                {isExpired ? 'Your membership has expired!' : `Your membership expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`}
              </p>
            </div>
            <a 
              href="https://wa.me/918397940001?text=Hi%2C%20I%20want%20to%20renew%20my%20membership" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              Renew Now →
            </a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 sm:p-8 border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-5">Current Plan</h3>
          <div className="flex flex-wrap items-end gap-2 mb-4">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">{profile?.membershipTier ?? '—'}</span>
            <span className="text-lg sm:text-xl text-orange-500 font-bold mb-1">{pricingMap[profile?.membershipTier] || ''}</span>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            profile.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${profile.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`} />
            {profile.status}
          </div>
          
          <div className="mt-6 pt-5 border-t border-slate-700">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Joined: {joinDate ? joinDate.toLocaleDateString() : '—'}</span>
              <span className="text-slate-400">Expires: {expirationDate ? expirationDate.toLocaleDateString() : '—'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 sm:p-8 border border-slate-700 flex flex-col justify-center">
          <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-5">Time Remaining</h3>
          
          <div className="text-center mb-5">
            <span className={`text-5xl sm:text-6xl font-black ${daysLeft <= 7 ? 'text-red-500' : 'text-orange-500'}`}>
              {Math.max(0, daysLeft)}
            </span>
            <span className="text-lg sm:text-xl text-slate-400 ml-2">Days</span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-3 sm:h-4 overflow-hidden border border-slate-700">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${daysLeft <= 7 ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-orange-500 to-yellow-500'}`} 
              style={{ width: `${Math.max(2, 100 - percentUsed)}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-xs sm:text-sm text-slate-500">
            {percentUsed.toFixed(0)}% of your plan used
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/member/progress" className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-orange-500/30 transition-all group">
          <h4 className="text-white font-medium group-hover:text-orange-500 transition-colors">📊 Track Progress</h4>
          <p className="text-slate-500 text-sm mt-1">Log your weight and view trends</p>
        </Link>
        <Link href="/member/resources" className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-orange-500/30 transition-all group">
          <h4 className="text-white font-medium group-hover:text-orange-500 transition-colors">📋 Resources</h4>
          <p className="text-slate-500 text-sm mt-1">Download workout & diet plans</p>
        </Link>
        <a href="https://wa.me/918397940001" target="_blank" rel="noopener noreferrer" className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-green-500/30 transition-all group">
          <h4 className="text-white font-medium group-hover:text-green-500 transition-colors">💬 Need Help?</h4>
          <p className="text-slate-500 text-sm mt-1">Chat with us on WhatsApp</p>
        </a>
      </div>
    </div>
  );
}
