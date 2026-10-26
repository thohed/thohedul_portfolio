import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { User, FileText, CheckCircle2, MapPin, Globe, Sparkles, Terminal } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { portfolio, setIsResumeOpen } = usePortfolio();
  const { profile } = portfolio;

  return (
    <section id="about" className="py-24 border-t border-neutral-800/60 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">Engineering Philosophy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
              About & Architectural Principles
            </h2>
          </div>
          <button
            onClick={() => setIsResumeOpen(true)}
            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors inline-flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Download Full Resume PDF</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Bio Text */}
          <div className="lg:col-span-7 space-y-6 text-neutral-300 text-base leading-relaxed">
            <p className="text-lg text-neutral-100 font-light leading-relaxed">
              {profile.bio}
            </p>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Throughout 5+ years of shipping software in production, I have specialized in bridging high-throughput backend runtimes (Go, Node.js, PostgreSQL) with highly reactive and accessible frontend architectures (React 19, TypeScript, Tailwind).
            </p>

            <div className="pt-6 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
                <Terminal className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-1 font-mono">Performance First</h4>
                  <p className="text-xs text-neutral-400">Strict sub-millisecond budgets, sub-second LCP, zero layout shifts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-1 font-mono">Pragmatic AI</h4>
                  <p className="text-xs text-neutral-400">Deterministic fallbacks, structured tool calling, and token streaming.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Facts Sidebar */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-mono">
              // At a Glance
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-neutral-800/60">
                <span className="text-neutral-500 font-mono">Current Focus</span>
                <span className="text-neutral-200 font-medium">Distributed Systems & AI</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800/60">
                <span className="text-neutral-500 font-mono">Location</span>
                <span className="text-neutral-200 font-medium">{profile.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800/60">
                <span className="text-neutral-500 font-mono">Availability</span>
                <span className="text-emerald-400 font-medium">Available Worldwide</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800/60">
                <span className="text-neutral-500 font-mono">Languages</span>
                <span className="text-neutral-200 font-medium">English (Fluent), Bengali (Native)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-neutral-500 font-mono">Direct Email</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-blue-400 hover:text-blue-300 font-mono underline underline-offset-4"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
