"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Save, User } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [profile, setProfile] = useState({ first_name: '', last_name: '', gender: '' });

  useEffect(() => {
    const getProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            gender: data.gender || ''
          });
        }
      }
      setFetching(false);
    };
    getProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          first_name: profile.first_name,
          last_name: profile.last_name,
          gender: profile.gender
        });

      if (error) throw error;
      alert("Profile saved successfully!");
    } catch (error: unknown) {
      alert("Error saving profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar role="member" />
      
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full">
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h2>
          <p className="text-slate-500 mt-1">Manage your profile and personal preferences.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden max-w-2xl">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={20}/></div>
            <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input 
                  type="text" 
                  value={profile.first_name} 
                  onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={profile.last_name} 
                  onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Biological Sex (For accurate health ratios)</label>
              <select 
                value={profile.gender} 
                onChange={(e) => setProfile({...profile, gender: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="pt-4 mt-8 border-t border-slate-100">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
