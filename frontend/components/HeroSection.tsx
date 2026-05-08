import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pointer-events-auto">
      {/* Background Image with Overlay using Next/Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/hero-bg.jpg" alt="JS Fitness Gym interior" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl z-0 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center md:text-left pt-20 pointer-events-auto">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse" />
            <span className="text-orange-400 text-sm font-medium tracking-wide">PREMIUM FITNESS CENTER IN SOHNA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white animate-fade-in-up delay-100 leading-tight">
            <span className="sr-only">JS Fitness — Best Gym in Sohna, Gurugram | </span>
            FORGE YOUR{' '}
            <span className="gradient-text">LEGACY</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-8 max-w-2xl animate-fade-in-up delay-200 leading-relaxed">
            The <strong className="text-white font-semibold">best gym in Sohna</strong> with premium Nortus &amp; Fitline equipment, expert personal trainers, and a community that pushes you further. <strong className="text-white font-semibold">JS Fitness Sohna</strong> is your ultimate fitness destination in Gurugram.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up delay-300">
            <Link 
              href="#pricing" 
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/25 text-center"
            >
              View Memberships
            </Link>
            <Link 
              href="#bmi" 
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-slate-400/30 hover:border-orange-500 hover:text-orange-500 text-white font-bold rounded-lg transition-all text-center"
            >
              Free BMI Calculator
            </Link>
          </div>

          {/* Stats Strip */}
          <div className="flex flex-wrap gap-8 mt-12 justify-center md:justify-start animate-fade-in-up delay-500">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-orange-500">500+</p>
              <p className="text-slate-400 text-sm">Active Members</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-orange-500">5+</p>
              <p className="text-slate-400 text-sm">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-orange-500">50+</p>
              <p className="text-slate-400 text-sm">Equipment Pieces</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float z-10 pointer-events-auto">
        <a href="#gallery" className="flex flex-col items-center text-slate-400 hover:text-orange-500 transition-colors pointer-events-auto">
          <span className="text-xs tracking-widest uppercase mb-2">Explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
