import Link from "next/link";
import type { Metadata } from "next";
import { Activity, ArrowRight, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Metabolic Health Knowledge Base & Clinical Guides | Metabolic Health Tracker",
  description:
    "Evidence-based guides on calculating your HOMA-IR score, understanding your Triglyceride-to-HDL ratio, and reversing insulin resistance with strength training.",
};

export default function ArticlesIndexPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-lg">
            <div className="w-9 h-9 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30">
              <Activity size={20} />
            </div>
            <span>Metabolic Health Tracker</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Launch Free Tracker →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <BookOpen size={14} />
            <span>Metabolic Syndrome Science & Lab Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Understand Your Bloodwork. <br className="hidden sm:inline" />
            <span className="text-blue-400">Reverse Insulin Resistance.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Actionable, plain-English clinical guides on the exact biomarkers, lipid ratios, and strength protocols that reverse metabolic syndrome.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-7 flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-blue-950/30"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-3">
                  {article.title}
                </h2>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {article.description}
                </p>

                <div className="space-y-2 border-t border-slate-800/80 pt-4 mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Key Clinical Takeaways:
                  </p>
                  {article.keyTakeaways.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Read Full Clinical Guide</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Calculate Your Own HOMA-IR & TG:HDL Ratio?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base">
            Create your free account to log your fasting insulin, glucose, triglycerides, and HDL—plus generate a personalized AI resistance workout tailored to your lab numbers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg transition-colors"
            >
              Create Free Tracker Account
            </Link>
            <a
              href="https://www.skool.com/reverse-metabolic-syndrome/about"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Join Our Free Skool Community
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
