"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Users, IndianRupee, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState({
    activeMembersCount: 0,
    revenueThisMonth: 0,
    expiringMembersCount: 0,
    expiringMembers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/analytics');
        // API returns { success: true, data: { ... } }
        setData(res.data?.data ?? res.data ?? {});
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
            <Users size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Active Members</p>
            <p className="text-3xl font-bold text-white">{data.activeMembersCount}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-500/20 text-green-500 rounded-lg">
            <IndianRupee size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Revenue This Month</p>
            <p className="text-3xl font-bold text-white">₹{data.revenueThisMonth.toLocaleString()}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-lg">
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Expiring in 7 Days</p>
            <p className="text-3xl font-bold text-white">{data.expiringMembersCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Memberships Expiring Soon</h3>
        {data.expiringMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 px-4 text-slate-400 font-medium">Name</th>
                  <th className="py-3 px-4 text-slate-400 font-medium">Email</th>
                  <th className="py-3 px-4 text-slate-400 font-medium">Tier</th>
                  <th className="py-3 px-4 text-slate-400 font-medium">Expiration Date</th>
                </tr>
              </thead>
              <tbody>
                {data.expiringMembers.map((member: any) => (
                  <tr key={member._id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="py-3 px-4 text-white">{member.user.name}</td>
                    <td className="py-3 px-4 text-slate-300">{member.user.email}</td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="px-2 py-1 bg-slate-700 rounded text-xs">{member.membershipTier}</span>
                    </td>
                    <td className="py-3 px-4 text-red-400">{new Date(member.expirationDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No memberships expiring in the next 7 days.</p>
        )}
      </div>
    </div>
  );
}
