"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProgressTracker() {
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const profRes = await api.get('/members/profile');
      const prof = profRes.data?.data ?? profRes.data ?? null;
      setProfile(prof);
      const histRes = await api.get(`/progress/${prof._id}`);
      const hist = histRes.data?.data ?? histRes.data ?? [];
      
      // Format data for chart
      const chartData = hist.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString(),
        weight: item.weight
      }));
      setHistory(chartData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    try {
      await api.post('/progress', { date, weight: parseFloat(weight) });
      setWeight('');
      fetchData();
    } catch (err) {
      alert('Failed to log weight');
    }
  };

  if (loading) return <div className="text-white">Loading progress...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">Weight History</h3>
        
        {history.length > 0 ? (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#f97316', strokeWidth: 2, stroke: '#1e293b' }} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
            No weight data logged yet. Start tracking today!
          </div>
        )}
      </div>

      <div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 sticky top-8">
          <h3 className="text-xl font-bold text-white mb-4">Log New Weight</h3>
          <form onSubmit={handleLogWeight} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
              <input 
                type="date" required
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Weight (kg)</label>
              <input 
                type="number" step="0.1" required placeholder="e.g. 75.5"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors mt-4"
            >
              Log Progress
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
