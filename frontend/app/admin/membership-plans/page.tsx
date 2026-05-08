"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Edit, Trash2, TrendingUp, IndianRupee } from 'lucide-react';

export default function MembershipPlansManager() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    planName: '',
    durationInDays: '',
    displayDuration: '',
    price: '',
    features: '',
    savings: '',
    order: '',
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/membership-plans/admin/all');
      if (res.data.success) {
        setPlans(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        order: Number(formData.order),
        features: formData.features.split(',').map(f => f.trim())
      };

      if (editingPlan) {
        await api.put(`/membership-plans/${editingPlan._id}`, payload);
      } else {
        await api.post('/membership-plans', payload);
      }

      setShowModal(false);
      setEditingPlan(null);
      setFormData({
        planName: '',
        durationInDays: '',
        displayDuration: '',
        price: '',
        features: '',
        savings: '',
        order: '',
        isActive: true
      });
      fetchPlans();
    } catch (error) {
      console.error('Failed to save plan:', error);
      alert('Failed to save plan. Please try again.');
    }
  };

  const handleEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      planName: plan.planName,
      durationInDays: plan.durationInDays?.toString() || '',
      displayDuration: plan.displayDuration,
      price: plan.price.toString(),
      features: plan.features.join(', '),
      savings: plan.savings || '',
      order: plan.order?.toString() || '',
      isActive: plan.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.delete(`/membership-plans/${id}`);
      fetchPlans();
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      planName: '',
      durationInDays: '',
      displayDuration: '',
      price: '',
      features: '',
      savings: '',
      order: '',
      isActive: true
    });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Membership Plans</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Plan
        </button>
      </div>

      {/* Sales Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/20 text-green-500 rounded-lg">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Sales</p>
              <p className="text-3xl font-bold text-white">{plans.reduce((sum, p) => sum + (p.salesCount || 0), 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
              <IndianRupee size={32} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-white">
                ₹{plans.reduce((sum, p) => sum + ((p.salesCount || 0) * p.price), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="py-4 px-6 text-left text-slate-300 font-medium">Plan Name</th>
              <th className="py-4 px-6 text-left text-slate-300 font-medium">Price</th>
              <th className="py-4 px-6 text-left text-slate-300 font-medium">Duration</th>
              <th className="py-4 px-6 text-left text-slate-300 font-medium">Sales</th>
              <th className="py-4 px-6 text-left text-slate-300 font-medium">Revenue</th>
              <th className="py-4 px-6 text-left text-slate-300 font-medium">Status</th>
              <th className="py-4 px-6 text-left text-slate-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id} className="border-t border-slate-700/50 hover:bg-slate-700/20">
                <td className="py-4 px-6">
                  <div className="text-white font-medium">{plan.planName}</div>
                  <div className="text-slate-400 text-sm">{plan.savings || '-'}</div>
                </td>
                <td className="py-4 px-6 text-white">₹{plan.price.toLocaleString()}</td>
                <td className="py-4 px-6 text-slate-300">{plan.displayDuration} ({plan.durationInDays} days)</td>
                <td className="py-4 px-6 text-white font-medium">{plan.salesCount || 0}</td>
                <td className="py-4 px-6 text-green-400 font-medium">
                  ₹{((plan.salesCount || 0) * plan.price).toLocaleString()}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    plan.isActive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 hover:bg-slate-600 rounded-lg text-blue-400 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 hover:bg-slate-600 rounded-lg text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={handleCloseModal} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingPlan ? 'Edit Plan' : 'Add New Plan'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Plan Name</label>
                <input
                  type="text"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Duration in Days</label>
                <input
                  type="number"
                  value={formData.durationInDays}
                  onChange={(e) => setFormData({ ...formData, durationInDays: e.target.value })}
                  placeholder="e.g., 30, 90, 180, 365"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Display Duration</label>
                <input
                  type="text"
                  value={formData.displayDuration}
                  onChange={(e) => setFormData({ ...formData, displayDuration: e.target.value })}
                  placeholder="e.g., /month, /3 months"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Features (comma-separated)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="e.g., Full Gym Access, All Equipment Use, Trainer Support"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Savings Text (optional)</label>
                <input
                  type="text"
                  value={formData.savings}
                  onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                  placeholder="e.g., Save ₹900"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-slate-300 text-sm">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  {editingPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
