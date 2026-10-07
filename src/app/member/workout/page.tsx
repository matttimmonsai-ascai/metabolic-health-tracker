"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/utils/supabase/client';
import { Dumbbell, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function WorkoutPage() {
  const [loading, setLoading] = useState(false);
  const [homaIr, setHomaIr] = useState<number | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    ability: 'Beginner',
    equipment: 'Bodyweight only',
    finances: 'Free / At home'
  });

  useEffect(() => {
    const fetchLatestHoma = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('health_metrics')
          .select('homa_ir')
          .eq('user_id', user.id)
          .not('homa_ir', 'is', null)
          .order('date_recorded', { ascending: false })
          .limit(1)
          .single();
          
        if (data) setHomaIr(data.homa_ir);
      }
    };
    fetchLatestHoma();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setWorkoutPlan(null);
    
    try {
      const response = await fetch('/api/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, homa_ir: homaIr })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate workout');
      
      setWorkoutPlan(data.workout);
    } catch (error: unknown) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar role="member" />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Dumbbell className="text-blue-600" size={32} />
            Custom Workout Generator
          </h2>
          <p className="text-slate-500 mt-1">Powered by AI to sensitize your insulin based on your specific profile.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                  <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 45" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Weight (lbs)</label>
                  <input type="number" required value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 210" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fitness Ability</label>
                  <select value={formData.ability} onChange={e => setFormData({...formData, ability: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Complete Beginner</option>
                    <option>Beginner (Some experience)</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Available Equipment</label>
                  <select value={formData.equipment} onChange={e => setFormData({...formData, equipment: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Bodyweight only</option>
                    <option>Dumbbells / Resistance Bands</option>
                    <option>Full Commercial Gym</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Finances / Budget</label>
                  <select value={formData.finances} onChange={e => setFormData({...formData, finances: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Free / At home</option>
                    <option>Low budget (Basic home tools)</option>
                    <option>Gym membership available</option>
                  </select>
                </div>

                {homaIr !== null && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-800 font-medium flex justify-between">
                      Latest HOMA-IR: <span>{homaIr}</span>
                    </p>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  {loading ? "Generating Plan..." : "Generate Routine"}
                </button>
              </form>
            </div>
          </div>

          {/* AI Result Area */}
          <div className="xl:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10 min-h-[500px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 min-h-[400px]">
                  <Loader2 className="animate-spin text-blue-600" size={48} />
                  <p>Analyzing profile and building a custom metabolic routine...</p>
                </div>
              ) : workoutPlan ? (
                <div className="prose prose-blue max-w-none prose-h2:text-2xl prose-h3:text-xl prose-li:text-slate-600">
                  <ReactMarkdown>{workoutPlan}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[400px] text-center">
                  <Dumbbell size={64} className="mb-4 text-slate-200" />
                  <h3 className="text-xl font-medium text-slate-700">Ready to build muscle and sensitize insulin?</h3>
                  <p className="mt-2 max-w-sm">Fill out your profile on the left and the AI will generate a custom resistance plan tailored entirely to you.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
