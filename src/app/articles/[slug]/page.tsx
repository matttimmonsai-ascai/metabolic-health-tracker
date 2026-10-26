import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { articles, getArticleBySlug } from "@/lib/articles";

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "Article Not Found | Metabolic Health Tracker" };
  }

  return {
    title: `${article.seoTitle} | Metabolic Health Tracker`,
    description: article.description,
    openGraph: {
      title: article.seoTitle,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Structured JSON-LD Schema for Google Rich Results & AI Search Engines (ChatGPT, Perplexity, Gemini)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: {
        "@type": "Organization",
        name: article.author.name,
      },
      publisher: {
        "@type": "Organization",
        name: "Metabolic Health Tracker",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  const otherArticles = articles.filter((a) => a.slug !== article.slug);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-lg">
            <div className="w-9 h-9 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/30">
              <Activity size={20} />
            </div>
            <span className="hidden sm:inline">Metabolic Health Tracker</span>
            <span className="sm:hidden">Metabolic Tracker</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/articles"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              All Guides
            </Link>
            <Link
              href="/"
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Free Lab Tracker →
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          <span>Back to All Metabolic Guides</span>
        </Link>

        {/* Article Header */}
        <article>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {article.readTime}
            </span>
            <span>•</span>
            <span>Reviewed by {article.author.name}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed mb-8">
            {article.description}
          </p>

          {/* Executive Summary / Key Takeaways Box (Optimized for AI Search Citations) */}
          <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 mb-12 shadow-lg">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wider mb-4">
              <Sparkles size={18} />
              <h2>Key Clinical Takeaways (TL;DR)</h2>
            </div>
            <ul className="space-y-3">
              {article.keyTakeaways.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-200 text-sm sm:text-base leading-relaxed">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-1" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Body Sections */}
          <div className="space-y-12">
            {article.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {section.heading}
                </h2>
                {section.body.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-slate-300 leading-relaxed text-base sm:text-lg">
                    {paragraph}
                  </p>
                ))}

                {section.callout && (
                  <div className="my-6 bg-indigo-950/40 border-l-4 border-indigo-400 p-5 rounded-r-2xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300 mb-1">
                      {section.callout.title}
                    </h3>
                    <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                      {section.callout.text}
                    </p>
                  </div>
                )}

                {section.formula && (
                  <div className="my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
                      {section.formula.label}
                    </p>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 font-mono text-sm sm:text-base text-emerald-300 font-semibold text-center">
                      {section.formula.equation}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {section.formula.targets.map((t, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80"
                        >
                          <span className="font-bold text-white text-sm sm:text-base">{t.range}</span>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              t.color === "emerald"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : t.color === "amber"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : t.color === "orange"
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Interactive Tracker Callout */}
          <div className="my-14 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-slate-900 border border-blue-500/30 rounded-3xl p-7 sm:p-10">
            <h2 className="text-2xl font-bold text-white mb-2">
              Track Your Biomarkers & Generate Your Custom Workout
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
              Stop guessing what your bloodwork means. Plug your Fasting Insulin, Fasting Glucose, Triglycerides, and HDL into our free Metabolic Health Tracker to automatically calculate your HOMA-IR and TG:HDL ratio—and generate an AI resistance training plan built for your numbers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-md"
              >
                <span>Calculate My Numbers Free</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://www.skool.com/reverse-metabolic-syndrome/about"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <span>Join the Reverse Metabolic Syndrome Skool</span>
              </a>
            </div>
          </div>

          {/* FAQ Section (Structured for Google & AI Search Snippets) */}
          <section className="pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2.5 mb-6">
              <HelpCircle className="text-blue-400" size={24} />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {article.faqs.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* Related Guides */}
        <section className="mt-16 pt-10 border-t border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6">Continue Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/articles/${rel.slug}`}
                className="group bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-6 transition-all"
              >
                <span className="text-xs font-semibold text-blue-400">{rel.category}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mt-1 mb-2">
                  {rel.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">{rel.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
