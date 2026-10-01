"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Calendar } from 'lucide-react';

export default function MyLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('date_recorded', { ascending: false }); // Newest first
          
        if (data) {
          setLogs(data);
        }
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="member" />
      
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">My Historical Logs</h2>
          <p className="text-slate-500 mt-1">A complete record of your metabolic health journey.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={20}/></div>
            <h3 className="text-xl font-bold text-slate-900">All Entries</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm font-medium border-b border-slate-100">
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Fasting Insulin</th>
                  <th className="py-4 px-6">Fasting Glucose</th>
                  <th className="py-4 px-6 font-bold text-blue-600">HOMA-IR</th>
                  <th className="py-4 px-6">Waist</th>
                  <th className="py-4 px-6">Abdomen</th>
                  <th className="py-4 px-6">Hips</th>
                  <th className="py-4 px-6">Blood Pressure</th>
                  <th className="py-4 px-6">Steps</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">No logs recorded yet.</td>
                  </tr>
                )}
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {new Date(log.date_recorded).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'})}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{log.fasting_insulin || '--'} mIU/L</td>
                    <td className="py-4 px-6 text-slate-600">{log.fasting_glucose || '--'} mg/dL</td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      <span className={`px-2 py-1 rounded-md ${
                        !log.homa_ir ? '' :
                        log.homa_ir >= 3.0 ? 'bg-rose-100 text-rose-700' : 
                        log.homa_ir >= 2.0 ? 'bg-amber-100 text-amber-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.homa_ir || '--'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{log.waist_circumference ? `${log.waist_circumference}"` : '--'}</td>
                    <td className="py-4 px-6 text-slate-600">{log.abdomen ? `${log.abdomen}"` : '--'}</td>
                    <td className="py-4 px-6 text-slate-600">{log.hips ? `${log.hips}"` : '--'}</td>
                    <td className="py-4 px-6 text-slate-600">
                      {log.blood_pressure_sys && log.blood_pressure_dia ? `${log.blood_pressure_sys}/${log.blood_pressure_dia}` : '--'}
                    </td>
                    <td className="py-4 px-6 text-slate-600">{log.steps ? log.steps.toLocaleString() : '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
