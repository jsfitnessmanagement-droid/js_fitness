"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, TrendingUp, Download, LogOut, Menu, X, Settings } from 'lucide-react';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'member') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Status', path: '/member', icon: <LayoutDashboard size={20} /> },
    { label: 'Progress', path: '/member/progress', icon: <TrendingUp size={20} /> },
    { label: 'Resources', path: '/member/resources', icon: <Download size={20} /> },
    { label: 'Settings', path: '/member/settings', icon: <Settings size={20} /> },
  ];

  const getPageTitle = () => {
    const segment = pathname.split('/').pop();
    if (segment === 'member') return 'My Status';
    return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : 'Status';
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-950 border-r border-slate-800 flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">JS <span className="text-orange-500">FITNESS</span></h2>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider font-bold">Member Portal</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-orange-500/10 text-orange-500 border-l-2 border-orange-500' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors mb-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span className="font-medium">Home</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-4 sm:px-8 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="lg:hidden mr-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-white">{getPageTitle()}</h1>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-slate-900">
          {children}
        </div>
      </main>
    </div>
  );
}
