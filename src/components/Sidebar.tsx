"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Settings, LogOut, Menu, X, Dumbbell } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Sidebar({ role = 'member' }: { role?: 'member' | 'admin' }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const memberLinks = [
    { name: 'Dashboard', href: '/member', icon: LayoutDashboard },
    { name: 'My Logs', href: '/member/logs', icon: Activity },
    { name: 'My Workout', href: '/member/workout', icon: Dumbbell },
    { name: 'Settings', href: '/member/settings', icon: Settings }
  ];

  const adminLinks = [
    { name: 'Community Overview', href: '/admin', icon: LayoutDashboard }
  ];

  const links = role === 'admin' ? adminLinks : memberLinks;

  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        if (data && data.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkAdminStatus();
  }, []);

  return (
    <>
      {/* Mobile Top Header (Hidden on Desktop) */}
      <div className="md:hidden w-full bg-slate-900 text-white p-4 flex items-center justify-between shrink-0 shadow-md relative z-30">
        <div className="flex items-center gap-2 font-bold">
          <Activity className="text-blue-500" size={20} />
          <span>Health Tracker</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Main Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-slate-900 text-slate-300 flex flex-col h-[100dvh] transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl md:shadow-none`}>
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-start shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2 leading-tight">
              <Activity className="text-blue-500 shrink-0" />
              Metabolic Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider">{role} Portal</p>
          </div>
          <button 
            className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors" 
            onClick={() => setIsOpen(false)}
          >
            <X size={24}/>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
          {isAdmin && (
            <Link 
              href={role === 'admin' ? '/member' : '/admin'} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all font-medium border border-indigo-500/20"
            >
              <Users size={20} />
              <span>Switch to {role === 'admin' ? 'Member' : 'Admin'}</span>
            </Link>
          )}
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </div>
    </>
  );
}
