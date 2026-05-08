"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const returnFocusToToggle = useCallback(() => {
    if (btnRef.current) btnRef.current.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const firstFocusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const menu = menuRef.current;
    const focusable = menu ? Array.from(menu.querySelectorAll(firstFocusableSelector)) as HTMLElement[] : [];

    if (focusable.length) focusable[0].focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        returnFocusToToggle();
      }

      if (e.key === 'Tab' && menu) {
        const focusable = Array.from(menu.querySelectorAll(firstFocusableSelector)) as HTMLElement[];
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, returnFocusToToggle]);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Facility', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Calculator', href: '#bmi' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-xl shadow-lg shadow-black/20 py-3'
            : 'bg-gradient-to-b from-slate-950/80 to-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-black text-white tracking-tighter">
              JS <span className="text-orange-500">FITNESS</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-orange-500 transition-colors font-medium text-sm lg:text-base relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Link
              href="/login"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20 text-sm"
            >
              Login
            </Link>
          </nav>

          <button
            ref={btnRef}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-[70] w-10 h-10 flex flex-col items-center justify-center space-y-1.5 focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden"
            onClick={() => { setIsOpen(false); returnFocusToToggle(); }}
          />

          <div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal={isOpen}
            tabIndex={-1}
            className="fixed top-0 right-0 h-full max-w-[80vw] w-full sm:w-72 bg-slate-950 border-l border-slate-800 z-[50] md:hidden"
          >
            <div className="pt-24 px-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="block py-3 px-4 text-slate-300 hover:text-orange-500 hover:bg-slate-800/50 rounded-lg transition-all font-medium text-lg"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-800 mt-4">
                <Link
                  href="/login"
                  onClick={handleNavClick}
                  className="block text-center py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all text-lg"
                >
                  Login / Sign Up
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
