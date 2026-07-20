"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, UserX, CheckCircle, Edit } from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', membershipTier: '1 Month', durationMonths: 1
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: '', name: '', email: '', phone: '', password: ''
  });

  const tierDurations: Record<string, number> = {
    '1 Month': 1,
    '3 Months': 3,
    '6 Months': 6,
    '1 Year': 12,
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setMembers(res.data?.data ?? res.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleTierChange = (tier: string) => {
    setFormData({
      ...formData,
      membershipTier: tier,
      durationMonths: tierDurations[tier] || 1
    });
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/members', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', membershipTier: '1 Month', durationMonths: 1 });
      fetchMembers();
      if (res.data?.defaultPassword) {
        alert(`Member added! Give them this default password to log in: ${res.data.defaultPassword}`);
      }
    } catch (err) {
      alert('Failed to add member. Please try again.');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      await api.patch(`/members/${id}/status`, { status: newStatus });
      fetchMembers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const openEditModal = (m: any) => {
    setEditData({
      id: m._id,
      name: m.user?.name || '',
      email: m.user?.email || '',
      phone: m.phone || '',
      password: '' // leave blank unless changing
    });
    setShowEditModal(true);
  };

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/members/${editData.id}`, editData);
      setShowEditModal(false);
      fetchMembers();
      alert('Member updated successfully!');
    } catch (err) {
      alert('Failed to update member.');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Member Management</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus size={18} className="mr-2" /> Add Member
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700">
                <th className="py-3 sm:py-4 px-4 sm:px-6 text-slate-400 font-medium text-sm">Name & Email</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6 text-slate-400 font-medium text-sm">Phone</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6 text-slate-400 font-medium text-sm">Tier</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6 text-slate-400 font-medium text-sm">Join Date</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6 text-slate-400 font-medium text-sm">Expiration</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6 text-slate-400 font-medium text-sm">Status</th>
                <th className="py-3 sm:py-4 px-4 sm:px-6 text-slate-400 font-medium text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400">Loading...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400">No members found. Click &quot;Add Member&quot; to get started.</td></tr>
              ) : (
                members.map((m: any) => (
                  <tr key={m._id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <p className="font-medium text-white text-sm">{m.user?.name}</p>
                      <p className="text-xs text-slate-400">{m.user?.email}</p>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-slate-300 text-sm">{m.phone || '—'}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <span className="px-2.5 py-1 bg-slate-900 border border-slate-600 rounded-full text-xs text-slate-300">
                        {m.membershipTier}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-slate-300 text-sm">{new Date(m.joinDate).toLocaleDateString()}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-slate-300 text-sm">{new Date(m.expirationDate).toLocaleDateString()}</td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        m.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-right space-x-2">
                      <button 
                        onClick={() => openEditModal(m)}
                        className="text-slate-400 hover:text-orange-500 transition-colors p-1"
                        title="Edit Member"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => toggleStatus(m._id, m.status)}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        title={m.status === 'Active' ? 'Disable Member' : 'Activate Member'}
                      >
                        {m.status === 'Active' ? <UserX size={18} /> : <CheckCircle size={18} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-4">Add New Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input required type="email" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Membership Plan</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" 
                  value={formData.membershipTier} 
                  onChange={e => handleTierChange(e.target.value)}
                >
                  <option value="1 Month">1 Month — ₹1,500</option>
                  <option value="3 Months">3 Months — ₹3,600</option>
                  <option value="6 Months">6 Months — ₹6,000</option>
                  <option value="1 Year">1 Year — ₹10,000</option>
                </select>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700 shadow-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-4">Edit Member Credentials</h3>
            <form onSubmit={handleEditMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input required type="email" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">New Password (Optional)</label>
                <input type="password" placeholder="Leave blank to keep current password" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors" value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})} />
                <p className="text-xs text-slate-400 mt-1">If you type a password here, it will overwrite their old password.</p>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
