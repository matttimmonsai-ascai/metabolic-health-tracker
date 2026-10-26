"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Loader2, AlertCircle, BookOpen, ArrowRight, Clock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { articles } from '@/lib/articles';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        // Switch back to login mode after successful signup
        alert("Account created successfully! Please log in.");
        setIsSignUp(false);
        setPassword('');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        // Redirect to dashboard on success
        router.push('/member');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between">
      {/* Main Hero & Auth Portal */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-12 pb-16">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
          
          <div className="p-8 pb-6 text-center border-b border-slate-100">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">Metabolic Health Tracker</h1>
            <p className="text-slate-500 mt-3 text-sm">
              {isSignUp ? 'Create your secure account.' : 'Sign in to track your HOMA-IR, TG:HDL ratio, and health progress.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="p-8 space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 mt-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Create Account' : 'Log In')}
            </button>
          </form>

          <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
            <p className="text-sm text-slate-600">
              {isSignUp ? 'Already have an account?' : 'Need an account?'}
              <button 
                onClick={() => { setIsSignUp(!isSignUp); setError(null); }} 
                className="ml-2 font-medium text-blue-600 hover:text-blue-500"
              >
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* SEO & AI Search Knowledge Base Section */}
      <section className="w-full bg-slate-950 border-t border-slate-800 py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <BookOpen size={14} />
                <span>Clinical Knowledge Base</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Metabolic Syndrome & Biomarker Guides
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Evidence-based protocols for decoding your bloodwork and reversing insulin resistance.
              </p>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View All Guides</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="text-blue-400 font-semibold">{article.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {article.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
