"use client";

import { useState } from 'react';
import api from '@/lib/api';
import { Lock, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await api.put('/auth/change-password', formData);
      setMessage({ text: 'Password updated successfully!', type: 'success' });
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.error?.message || 'Failed to update password. Please check your current password.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Admin Settings</h2>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-700 pb-4">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Lock className="text-orange-500" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">Change Admin Password</h3>
        </div>

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
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition-colors" 
              value={formData.currentPassword} 
              onChange={e => setFormData({...formData, currentPassword: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500 transition-colors" 
              value={formData.newPassword} 
              onChange={e => setFormData({...formData, newPassword: e.target.value})} 
            />
            <p className="text-xs text-slate-400 mt-2">Make sure it is at least 6 characters long for security.</p>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
            >
              {loading ? 'Saving...' : <><Save size={18} className="mr-2" /> Save New Password</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
