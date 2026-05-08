"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRef } from 'react';

export default function PricingSection() {
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load Razorpay Script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Fetch membership plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/membership-plans');
        if (response.data.success) {
          const formattedPlans = response.data.data.map((plan: any) => ({
            name: plan.planName,
            price: `₹${plan.price.toLocaleString()}`,
            rawPrice: plan.price,
            duration: plan.displayDuration,
            features: plan.features,
            popular: plan.popular,
            highlight: plan.popular,
            savings: plan.savings,
            _id: plan._id
          }));
          setPlans(formattedPlans);
        }
      } catch (error) {
        console.error('Failed to fetch membership plans:', error);
        // Fallback to hardcoded plans if API fails
        setPlans([
          { 
            name: '1 Month', 
            price: '₹1,500', 
            rawPrice: 1500, 
            duration: '/month',
            features: ['Full Gym Access', 'All Equipment Use', 'Basic Guidance'],
            highlight: false
          },
          { 
            name: '3 Months', 
            price: '₹3,600', 
            rawPrice: 3600, 
            duration: '/3 months', 
            popular: true,
            features: ['Full Gym Access', 'All Equipment Use', 'Trainer Support'],
            highlight: true,
            savings: 'Save ₹900'
          },
          { 
            name: '6 Months', 
            price: '₹6,000', 
            rawPrice: 6000, 
            duration: '/6 months',
            features: ['Full Gym Access', 'All Equipment Use', 'Trainer Support'],
            highlight: false,
            savings: 'Save ₹3,000'
          },
          { 
            name: '1 Year', 
            price: '₹10,000', 
            rawPrice: 10000, 
            duration: '/year',
            features: ['Full Gym Access', 'All Equipment Use', 'Personal Training'],
            highlight: false,
            savings: 'Save ₹8,000'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleBuyNow = async (planName: string, amount: number) => {
    // Open contact capture modal first
    setPendingPlan({ planName, amount });
    setContactModalOpen(true);
  };

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<{ planName: string; amount: number } | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const modalRef = useRef<HTMLDivElement | null>(null);

  const validateContact = () => {
    if (!contactName || !contactEmail) return false;
    // basic email regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRe.test(contactEmail);
  };

  const proceedToPayment = async () => {
    if (!pendingPlan) return;
    if (!validateContact()) {
      alert('Please enter a valid name and email.');
      return;
    }

    setProcessingPlan(pendingPlan.planName);
    try {
      const { data: order } = await api.post('/payment/create-order', {
        amount: pendingPlan.amount,
        planName: pendingPlan.planName
      });

      // If using placeholder keys, simulate and close modal
      if (order.key_id === 'rzp_test_placeholder') {
        alert('Payment Gateway is currently in test mode. Simulating a successful purchase!');
        setContactModalOpen(false);
        setPendingPlan(null);
        return;
      }

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "JS Fitness",
        description: `${pendingPlan.planName} Membership`,
        image: "/images/gym-exterior.jpg",
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: contactName || "",
          email: contactEmail || "",
          contact: contactPhone || ""
        },
        theme: {
          color: "#f97316"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed. Reason: ${response.error.description}`);
      });
      rzp.open();
      setContactModalOpen(false);
      setPendingPlan(null);
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment gateway. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-slate-950 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-orange-500 text-sm font-bold tracking-widest uppercase">Gym Membership Plans in Sohna</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
            Choose Your <span className="gradient-text">Membership Plan</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">Affordable gym membership plans in Sohna, Gurugram. Flexible options from ₹1,500/month to ₹10,000/year.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl p-6 sm:p-8 border flex flex-col card-hover relative ${
                plan.popular 
                  ? 'border-orange-500 bg-gradient-to-b from-slate-800 to-slate-900 shadow-orange-500/20 shadow-2xl transform lg:-translate-y-4' 
                  : 'border-slate-700 bg-slate-900'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-lg">
                  Most Popular
                </span>
              )}
              {plan.savings && (
                <span className="inline-block mb-3 text-green-400 text-xs font-bold bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 w-fit">
                  {plan.savings}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-slate-400 ml-1 text-sm">{plan.duration}</span>
              </div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-grow">
                {plan.features.map((feature: string, fIdx: number) => (
                  <li key={fIdx} className="flex items-center text-slate-300 text-sm">
                    <svg className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleBuyNow(plan.name, plan.rawPrice)}
                disabled={processingPlan === plan.name}
                className={`w-full py-3 sm:py-4 rounded-lg font-bold transition-all transform hover:scale-[1.02] ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                } disabled:opacity-50 disabled:transform-none`}
              >
                {processingPlan === plan.name ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Buy Now'}
              </button>
            </div>
          ))}
          </div>
        )}

        {/* Trust note */}
        <p className="text-center text-slate-500 text-sm mt-8">
          💳 Secure payments powered by Razorpay. All prices inclusive of taxes.
        </p>
      </div>

      {/* Contact capture modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setContactModalOpen(false)} />
          <div ref={modalRef} className="relative z-50 w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Provide contact to continue</h3>
            <p className="text-sm text-slate-400 mb-4">We will use this information to send your invoice and booking details.</p>
            <div className="space-y-3">
              <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Full name" className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white" />
              <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white" />
              <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Phone (optional)" className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setContactModalOpen(false); setPendingPlan(null); }} className="flex-1 py-2 bg-slate-700 text-white rounded">Cancel</button>
              <button onClick={() => proceedToPayment()} className="flex-1 py-2 bg-orange-500 text-white rounded">Continue to Payment</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
