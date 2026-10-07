"use client";

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface LogMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogMetricsModal({ isOpen, onClose }: LogMetricsModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fasting_insulin: '',
    fasting_glucose: '',
    triglycerides: '',
    hdl: '',
    waist_circumference: '',
    abdomen: '',
    hips: '',
    blood_pressure_sys: '',
    blood_pressure_dia: '',
    steps: '',
    active_minutes: '',
    active_energy: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const supabase = createClient();
    
    try {
      // 1. Get the securely logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Could not find logged in user. Please log in again.");

      // 2. Automatically Calculate HOMA-IR (Glucose * Insulin / 405)
      let homa_ir = null;
      if (formData.fasting_glucose && formData.fasting_insulin) {
        homa_ir = (Number(formData.fasting_glucose) * Number(formData.fasting_insulin)) / 405;
      }

      // 3. Save to Supabase
      const { error } = await supabase.from('health_metrics').insert({
        user_id: user.id,
        fasting_insulin: formData.fasting_insulin ? Number(formData.fasting_insulin) : null,
        fasting_glucose: formData.fasting_glucose ? Number(formData.fasting_glucose) : null,
        triglycerides: formData.triglycerides ? Number(formData.triglycerides) : null,
        hdl: formData.hdl ? Number(formData.hdl) : null,
        homa_ir: homa_ir ? Number(homa_ir.toFixed(2)) : null,
        waist_circumference: formData.waist_circumference ? Number(formData.waist_circumference) : null,
        abdomen: formData.abdomen ? Number(formData.abdomen) : null,
        hips: formData.hips ? Number(formData.hips) : null,
        blood_pressure_sys: formData.blood_pressure_sys ? Number(formData.blood_pressure_sys) : null,
        blood_pressure_dia: formData.blood_pressure_dia ? Number(formData.blood_pressure_dia) : null,
        steps: formData.steps ? Number(formData.steps) : null,
        active_minutes: formData.active_minutes ? Number(formData.active_minutes) : null,
        active_energy: formData.active_energy ? Number(formData.active_energy) : null,
      });

      if (error) throw error;
      
      alert("Metrics saved successfully!");
      onClose();
      
      // In a real app, we would refresh the data on the page here
      window.location.reload(); 
      
    } catch (error: any) {
      alert("Error saving data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-900">Log Today's Metrics</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Clinical Section */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Clinical Markers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fasting Insulin (mIU/L)</label>
                <input type="number" step="0.1" name="fasting_insulin" value={formData.fasting_insulin} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fasting Glucose (mg/dL)</label>
                <input type="number" step="1" name="fasting_glucose" value={formData.fasting_glucose} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Triglycerides (mg/dL)</label>
                <input type="number" step="1" name="triglycerides" value={formData.triglycerides} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">HDL Cholesterol (mg/dL)</label>
                <input type="number" step="1" name="hdl" value={formData.hdl} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            {(formData.fasting_glucose && formData.fasting_insulin) && (
              <p className="text-sm text-emerald-600 mt-2 bg-emerald-50 p-2 rounded-lg">
                HOMA-IR will be automatically calculated as: {((Number(formData.fasting_glucose) * Number(formData.fasting_insulin)) / 405).toFixed(2)}
              </p>
            )}
            {(formData.triglycerides && formData.hdl) && (
              <p className="text-sm text-blue-600 mt-2 bg-blue-50 p-2 rounded-lg">
                TG/HDL Ratio: {(Number(formData.triglycerides) / Number(formData.hdl)).toFixed(2)}
              </p>
            )}
          </div>

          {/* Body Measurements Section */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Body Measurements (in)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Waist</label>
                <input type="number" step="0.1" name="waist_circumference" value={formData.waist_circumference} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Abdomen</label>
                <input type="number" step="0.1" name="abdomen" value={formData.abdomen} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hips</label>
                <input type="number" step="0.1" name="hips" value={formData.hips} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          {/* Blood Pressure Section */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Blood Pressure</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Systolic (Top)</label>
                <input type="number" name="blood_pressure_sys" value={formData.blood_pressure_sys} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="120" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Diastolic (Bottom)</label>
                <input type="number" name="blood_pressure_dia" value={formData.blood_pressure_dia} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="80" />
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Daily Activity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Steps</label>
                <input type="number" name="steps" value={formData.steps} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Active Mins</label>
                <input type="number" name="active_minutes" value={formData.active_minutes} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kcal Burned</label>
                <input type="number" name="active_energy" value={formData.active_energy} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save Metrics to Database"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
