"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function Sidebar({ role = 'member' }: { role?: 'member' | 'admin' }) {
  const pathname = usePathname();

  const memberLinks = [
    { name: 'Dashboard', href: '/member', icon: LayoutDashboard },
    { name: 'My Logs', href: '/member/logs', icon: Activity },
    { name: 'Settings', href: '/member/settings', icon: Settings }
  ];

  const adminLinks = [
    { name: 'Community Overview', href: '/admin', icon: LayoutDashboard }
  ];

  const links = role === 'admin' ? adminLinks : memberLinks;

  const [isAdmin, setIsAdmin] = useState(false);

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
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2 leading-tight">
          <Activity className="text-blue-500 shrink-0" />
          Metabolic Health Tracker
        </h1>
        <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider">{role} Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
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

      <div className="p-4 border-t border-slate-800 space-y-2">
        {isAdmin && (
          <Link 
            href={role === 'admin' ? '/member' : '/admin'} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all font-medium border border-indigo-500/20"
          >
            <Users size={20} />
            <span>Switch to {role === 'admin' ? 'Member' : 'Admin'}</span>
          </Link>
        )}
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
