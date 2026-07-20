"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, UserX, CheckCircle, Edit, Eye, EyeOff, Trash2, Search, Filter, Download } from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', membershipTier: '1 Month', durationMonths: 1
  });
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    id: '', name: '', email: '', phone: '', password: ''
  });
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');

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
      setFormData({ name: '', email: '', phone: '', password: '', membershipTier: '1 Month', durationMonths: 1 });
      setShowAddPassword(false);
      fetchMembers();
      const pw = res.data?.defaultPassword || formData.password || 'JSFitness@123';
      alert(`Member added successfully!\n\nTheir login credentials:\nEmail: ${formData.email}\nPassword: ${pw}`);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to add member. Please try again.';
      alert(msg);
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
      password: ''
    });
    setShowEditPassword(false);
    setShowEditModal(true);
  };

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/members/${editData.id}`, editData);
      setShowEditModal(false);
      fetchMembers();
      alert('Member updated successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to update member.';
      alert(msg);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently remove "${name}"? This will delete their account and all data.`)) return;
    try {
      await api.delete(`/members/${id}`);
      fetchMembers();
      alert('Member removed successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to remove member.';
      alert(msg);
    }
  };

  const filteredMembers = members.filter((m: any) => {
    const matchesSearch = 
      m.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesPlan = planFilter === 'All' || m.membershipTier === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Membership Plan', 'Join Date', 'Expiration Date', 'Status'];
    const rows = filteredMembers.map((m: any) => [
      m.user?.name || '',
      m.user?.email || '',
      m.phone || '',
      m.membershipTier || '',
      new Date(m.joinDate).toLocaleDateString(),
      new Date(m.expirationDate).toLocaleDateString(),
      m.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `jsfitness_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Member Management</h2>
        <div className="flex space-x-3 w-full sm:w-auto">
          <button 
            onClick={exportToCSV}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Download size={18} className="mr-2" /> Export CSV
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={18} className="mr-2" /> Add Member
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-500" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-2.5 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 appearance-none"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-500" />
          </div>
          <select
            className="block w-full pl-10 pr-10 py-2.5 border border-slate-700 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 appearance-none"
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value)}
          >
            <option value="All">All Plans</option>
            <option value="1 Month">1 Month</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
          </select>
        </div>
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
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-400">No members match your filters.</td></tr>
              ) : (
                filteredMembers.map((m: any) => (
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
                      <button 
                        onClick={() => handleDeleteMember(m._id, m.user?.name)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Remove Member"
                      >
                        <Trash2 size={18} />
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
                <label className="block text-sm font-medium text-slate-300 mb-1">Password (Optional)</label>
                <div className="relative">
                  <input 
                    type={showAddPassword ? 'text' : 'password'} 
                    placeholder="Default: JSFitness@123" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 pr-10 text-white focus:outline-none focus:border-orange-500 transition-colors" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowAddPassword(!showAddPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showAddPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">Leave blank to use default password: JSFitness@123</p>
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
                <button type="button" onClick={() => { setShowModal(false); setShowAddPassword(false); }} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Cancel</button>
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
                <div className="relative">
                  <input 
                    type={showEditPassword ? 'text' : 'password'} 
                    placeholder="Leave blank to keep current password" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2.5 pr-10 text-white focus:outline-none focus:border-orange-500 transition-colors" 
                    value={editData.password} 
                    onChange={e => setEditData({...editData, password: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowEditPassword(!showEditPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showEditPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">If you type a password here, it will overwrite their old password.</p>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => { setShowEditModal(false); setShowEditPassword(false); }} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
