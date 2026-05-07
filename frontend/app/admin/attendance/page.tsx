"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AttendancePage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeIn, setTimeIn] = useState('');
  const [timeOut, setTimeOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/members');
        const allMembers = res.data?.data ?? res.data ?? [];
        // Only active members
        setMembers(allMembers.filter((m: any) => m.status === 'Active'));
      } catch (err) {
        console.error('Failed to fetch members');
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !date || !timeIn) return;

    setLoading(true);
    setSuccess(false);

    try {
      await api.post('/attendance', {
        memberId: selectedMember,
        date,
        timeIn,
        timeOut
      });
      setSuccess(true);
      // Reset form
      setSelectedMember('');
      setTimeIn('');
      setTimeOut('');
    } catch (err) {
      alert('Failed to log attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Log Attendance</h2>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sm:p-8">
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
            Attendance logged successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Member</label>
            <select 
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">-- Choose Member --</option>
              {members.map((m: any) => (
                <option key={m._id} value={m._id}>
                  {m.user?.name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
            <input 
              type="date" required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Time In</label>
              <input 
                type="time" required
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Time Out (Optional)</label>
              <input 
                type="time"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : 'Log Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
