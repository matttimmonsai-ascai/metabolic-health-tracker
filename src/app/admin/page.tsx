"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, AlertTriangle, TrendingUp, Search, Loader2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ totalMembers: 0, avgHoma: 0, highRisk: 0 });
  const [membersData, setMembersData] = useState<any[]>([]);
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [revealedUsers, setRevealedUsers] = useState<Set<string>>(new Set());
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // 1. Verify Admin Status
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!roleData || roleData.role !== 'admin') {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // 2. Fetch Secure Emails via our new Postgres Function
      const { data: emailData } = await supabase.rpc('get_member_emails');
      const emailMap: Record<string, string> = {};
      if (emailData) {
        emailData.forEach((row: any) => {
          emailMap[row.user_id] = row.email;
        });
      }
      setUserEmails(emailMap);

      // 3. Fetch Health Metrics
      const { data: allMetrics } = await supabase
        .from('health_metrics')
        .select('*')
        .order('date_recorded', { ascending: false });

      if (allMetrics && allMetrics.length > 0) {
        const latestPerUser = new Map();
        allMetrics.forEach(metric => {
          if (!latestPerUser.has(metric.user_id)) {
            latestPerUser.set(metric.user_id, metric);
          }
        });

        const uniqueMembers = Array.from(latestPerUser.values());
        
        const totalMembers = uniqueMembers.length;
        let totalHoma = 0;
        let homaCount = 0;
        let highRiskCount = 0;

        const processedMembers = uniqueMembers.map((m, index) => {
          if (m.homa_ir) {
            totalHoma += m.homa_ir;
            homaCount++;
            if (m.homa_ir >= 3.0) highRiskCount++; 
          }

          return {
            id: m.user_id,
            anonymizedName: `Community Member ${index + 1}`, 
            lastLog: new Date(m.date_recorded).toLocaleDateString(),
            homa: m.homa_ir || 'N/A',
            status: !m.homa_ir ? 'Unknown' : m.homa_ir >= 3.0 ? 'High Risk' : m.homa_ir >= 2.0 ? 'Moderate' : 'Optimal'
          };
        });

        // Sort so High Risk members appear at the top automatically
        processedMembers.sort((a, b) => {
          if (a.status === 'High Risk' && b.status !== 'High Risk') return -1;
          if (a.status !== 'High Risk' && b.status === 'High Risk') return 1;
          return 0;
        });

        setKpis({
          totalMembers,
          avgHoma: homaCount > 0 ? Number((totalHoma / homaCount).toFixed(2)) : 0,
          highRisk: highRiskCount
        });
        setMembersData(processedMembers);
      }
      
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  const toggleReveal = (userId: string) => {
    const newSet = new Set(revealedUsers);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setRevealedUsers(newSet);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar role="member" />
        <div className="flex-1 p-12 flex items-center justify-center">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-rose-100 text-center max-w-md">
             <AlertTriangle className="text-rose-500 w-16 h-16 mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
             <p className="text-slate-500">You do not have administrator privileges to view community data.</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar role="admin" />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Community Overview</h2>
          <p className="text-slate-500 mt-1">Monitor the metabolic health of your Skool community.</p>
        </header>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><Users size={28}/></div>
            <div>
              <p className="text-slate-500 font-medium text-sm">Active Members</p>
              <h3 className="text-3xl font-bold text-slate-900">{kpis.totalMembers}</h3>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full"><TrendingUp size={28}/></div>
            <div>
              <p className="text-slate-500 font-medium text-sm">Avg Community HOMA-IR</p>
              <h3 className="text-3xl font-bold text-slate-900">{kpis.avgHoma}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-rose-50 text-rose-600 rounded-full"><AlertTriangle size={28}/></div>
            <div>
              <p className="text-slate-500 font-medium text-sm">Requires Attention</p>
              <h3 className="text-3xl font-bold text-slate-900">{kpis.highRisk}</h3>
            </div>
          </div>
        </div>

        {/* Member Data Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-xl font-bold text-slate-900">Member Health Logs</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-100">
                <th className="py-4 px-6">Member ID / Contact</th>
                <th className="py-4 px-6">Last Logged</th>
                <th className="py-4 px-6">Current HOMA-IR</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Privacy</th>
              </tr>
            </thead>
            <tbody>
              {membersData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No community data available yet.</td>
                </tr>
              )}
              {membersData.map((member) => {
                const isRevealed = revealedUsers.has(member.id);
                return (
                  <tr key={member.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${member.status === 'High Risk' ? 'bg-rose-50/30' : ''}`}>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {isRevealed ? (
                        <a href={`mailto:${userEmails[member.id]}`} className="text-blue-600 hover:underline">
                          {userEmails[member.id] || 'Email not found'}
                        </a>
                      ) : (
                        member.anonymizedName
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm">{member.lastLog}</td>
                    <td className="py-4 px-6 font-semibold text-slate-700">{member.homa}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' :
                        member.status === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                        member.status === 'High Risk' ? 'bg-rose-100 text-rose-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => toggleReveal(member.id)}
                        className={`flex items-center justify-end gap-1.5 ml-auto text-sm font-medium transition-colors ${isRevealed ? 'text-slate-400 hover:text-slate-600' : 'text-blue-600 hover:text-blue-800'}`}
                      >
                        {isRevealed ? <><EyeOff size={16}/> Hide Contact</> : <><Eye size={16}/> Reveal Identity</>}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

      </main>
    </div>
  );
}
