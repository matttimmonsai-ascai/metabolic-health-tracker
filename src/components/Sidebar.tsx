"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ role = 'member' }: { role?: 'member' | 'admin' }) {
  const pathname = usePathname();

  const memberLinks = [
    { name: 'Dashboard', href: '/member', icon: LayoutDashboard },
    { name: 'My Logs', href: '/member/logs', icon: Activity }
  ];

  const adminLinks = [
    { name: 'Community Overview', href: '/admin', icon: LayoutDashboard }
  ];

  const links = role === 'admin' ? adminLinks : memberLinks;

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

      <div className="p-4 border-t border-slate-800">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
