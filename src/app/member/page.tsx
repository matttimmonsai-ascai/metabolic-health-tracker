"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDown, Droplet, Activity, Heart, ArrowUp, Footprints, Timer, Flame, Loader2 } from 'lucide-react';
import LogMetricsModal from '@/components/LogMetricsModal';
import { createClient } from '@/utils/supabase/client';

export default function MemberDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch all metrics for this user, ordered by date
        const { data } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('date_recorded', { ascending: true });
          
        if (data) {
          setMetrics(data);
        }
      }
      setLoading(false);
    };

    fetchRealData();
  }, []);

  // Format data for the chart
  const chartData = metrics.map(m => ({
    date: new Date(m.date_recorded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    homa: m.homa_ir,
    insulin: m.fasting_insulin
  }));

  // Get the most recently logged data
  const latest = metrics.length > 0 ? metrics[metrics.length - 1] : null;

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
        <header className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Progress</h2>
            <p className="text-slate-500 mt-1">
              {metrics.length > 0 ? `You have logged ${metrics.length} entries.` : 'Welcome! Log your first metrics to get started.'}
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-sm shadow-blue-200 transition-all"
          >
            + Log Today's Metrics
          </button>
        </header>

        <LogMetricsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Clinical Highlight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Activity size={24}/></div>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">HOMA-IR Score</h3>
            <p className="text-4xl font-bold text-slate-900">
              {latest?.homa_ir || '--'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Droplet size={24}/></div>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Fasting Insulin</h3>
            <p className="text-4xl font-bold text-slate-900">
              {latest?.fasting_insulin || '--'} <span className="text-lg font-normal text-slate-400">mIU/L</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Heart size={24}/></div>
            </div>
            <h3 className="text-slate-500 font-medium mb-1">Fasting Glucose</h3>
            <p className="text-4xl font-bold text-slate-900">
               {latest?.fasting_glucose || '--'} <span className="text-lg font-normal text-slate-400">mg/dL</span>
            </p>
          </div>
        </div>

        {/* Daily Physical Activity Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Latest Physical Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Steps */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Footprints size={20}/></div>
                <h4 className="text-slate-600 font-medium">Steps</h4>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-slate-900">{latest?.steps || '--'}</span>
              </div>
            </div>

            {/* Active Minutes */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Timer size={20}/></div>
                <h4 className="text-slate-600 font-medium">Active Minutes</h4>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-slate-900">{latest?.active_minutes || '--'}</span>
                <span className="text-sm text-slate-400 mb-1">mins</span>
              </div>
            </div>

            {/* Energy Burned */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Flame size={20}/></div>
                <h4 className="text-slate-600 font-medium">Active Energy</h4>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-slate-900">{latest?.active_energy || '--'}</span>
                <span className="text-sm text-slate-400 mb-1">kcal</span>
              </div>
            </div>

          </div>
        </div>

        {/* Charts Area */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Insulin Resistance Trend</h3>
            <p className="text-slate-500 text-sm">Tracking your real HOMA-IR and Fasting Insulin history.</p>
          </div>
          <div className="h-80 w-full">
            {metrics.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line yAxisId="left" type="monotone" dataKey="homa" name="HOMA-IR" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  <Line yAxisId="right" type="monotone" dataKey="insulin" name="Insulin" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Log your first entry to see your trend chart!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
