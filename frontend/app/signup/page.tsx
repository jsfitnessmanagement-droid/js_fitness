"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import SEO from '@/components/SEO';

export default function Signup() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    confirmPassword: ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/membership-plans');
        if (response.data.success) {
          setPlans(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!selectedPlan) {
      setError('Please select a membership plan');
      return;
    }

    setProcessing(true);

    try {
      // Register user
      const registerResponse = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'member'
      });

      if (registerResponse.data.success) {
        // Get the selected plan details
        const plan = plans.find(p => p._id === selectedPlan);
        
        // Create Razorpay order
        const orderResponse = await api.post('/payment/create-order', {
          amount: plan.price,
          planName: plan.planName
        });

        const order = orderResponse.data.data;

        // Check if using placeholder keys (test mode)
        if (order.key_id === 'rzp_test_placeholder') {
          alert('Payment Gateway is in test mode. Simulating a successful purchase!');
          
          // Create member record directly
          await api.post('/members', {
            phone: formData.phone,
            membershipPlan: selectedPlan
          });

          // Trigger n8n webhook for welcome email
          try {
            const { sendGymEmail } = await import('@/lib/api');
            await sendGymEmail({ name: formData.name, email: formData.email }, 'welcome');
          } catch (webErr) {
            console.error('Webhook failed:', webErr);
          }

          localStorage.setItem('token', registerResponse.data.data.token);
          localStorage.setItem('userRole', 'member');
          localStorage.setItem('userName', formData.name);
          router.push('/member');
          return;
        }

        // Open Razorpay
        const options = {
          key: order.key_id,
          amount: order.amount,
          currency: order.currency,
          name: "JS Fitness",
          description: `${plan.planName} Membership`,
          order_id: order.id,
          handler: async function (response: any) {
            // Create member record after successful payment
            await api.post('/members', {
              phone: formData.phone,
              membershipPlan: selectedPlan
            });

            // Record sale for the plan
            await api.post(`/membership-plans/${selectedPlan}/sale`);

            // Trigger n8n webhook for welcome email and receipt
            try {
              const { sendGymEmail } = await import('@/lib/api');
              await sendGymEmail({ name: formData.name, email: formData.email }, 'welcome');
            } catch (webErr) {
              console.error('Webhook failed:', webErr);
            }

            localStorage.setItem('token', registerResponse.data.data.token);
            localStorage.setItem('userRole', 'member');
            localStorage.setItem('userName', formData.name);
            router.push('/member');
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#f97316"
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.response?.data?.error?.message || 'Signup failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Sign Up - JS Fitness Membership"
        description="Join JS Fitness Sohna today. Choose from our flexible membership plans and start your fitness journey with premium equipment and certified trainers."
        canonical="https://jsfitness.com/signup"
      />
      <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-black text-white tracking-tighter">
            JS <span className="text-orange-500">FITNESS</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-6 mb-2">Join JS Fitness Today</h1>
          <p className="text-slate-400">Select your membership plan and start your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Plan Selection */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Select Your Plan</h2>
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  onClick={() => setSelectedPlan(plan._id)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === plan._id
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.planName}</h3>
                      <p className="text-slate-400 text-sm">{plan.displayDuration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">₹{plan.price.toLocaleString()}</p>
                      {plan.savings && (
                        <p className="text-green-400 text-sm">{plan.savings}</p>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="text-slate-300 text-sm flex items-center">
                        <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right: User Details */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Your Details</h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing || !selectedPlan}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                >
                  {processing ? 'Processing...' : 'Complete Registration'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  Already a member?{' '}
                  <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
