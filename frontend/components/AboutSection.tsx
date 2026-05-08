"use client";

import { Dumbbell, Users, Apple, Trophy } from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      icon: <Dumbbell className="w-7 h-7" />,
      title: 'Premium Equipment',
      description: 'Nortus & Fitline machines, free weights, cardio zone with latest treadmills and spin bikes.',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Expert Training',
      description: 'Certified personal trainers who create customized workout plans for your goals.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: <Apple className="w-7 h-7" />,
      title: 'Diet Guidance',
      description: 'Personalized nutrition plans and diet counseling to maximize your results.',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      icon: <Trophy className="w-7 h-7" />,
      title: 'Proven Results',
      description: 'Hundreds of transformations. Join the community that builds champions.',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-orange-500 text-sm font-bold tracking-widest uppercase">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
            Why <span className="gradient-text">JS Fitness</span> is the Best Gym in Sohna
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Sohna&apos;s premier fitness destination with world-class gym equipment, certified personal trainers, vibrant LED-lit training floors, and a results-driven fitness community in Gurugram.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 card-hover group"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bg} ${feature.color} mb-5 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Trainer Spotlight */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
            {/* Trainer Avatar */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/20">
                <span className="text-4xl sm:text-5xl font-black text-white">JJ</span>
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Head Trainer</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-3">Jai</h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                With years of experience in strength training and body transformation, Jai leads our team with passion and expertise. Specializing in personalized fitness programs, weight management, and muscle building.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 font-medium">Strength Training</span>
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 font-medium">Body Transformation</span>
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 font-medium">Nutrition Planning</span>
                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300 font-medium">Weight Management</span>
              </div>
              <a 
                href="https://wa.me/918397940001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center mt-5 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat with Jai
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
