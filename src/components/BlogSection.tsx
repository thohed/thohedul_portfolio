import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { BookOpen, Clock, Calendar, ArrowRight, X } from 'lucide-react';
import { BlogPost } from '../types/portfolio';

export const BlogSection: React.FC = () => {
  const { portfolio, activePost, setActivePost } = usePortfolio();
  const posts = (portfolio.posts || []).filter((p) => p.published !== false);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 border-t border-neutral-800/60 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-500"></span>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">Written Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
              Technical Articles & Engineering Notes
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Architectural case studies, deep dives into distributed systems, and real-time frontend engineering explorations.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post: BlogPost, idx: number) => (
            <article
              key={post.id || idx}
              onClick={() => setActivePost(post)}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:bg-neutral-900/70"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-4 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    {post.publishedDate}
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-100 mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-neutral-400 line-clamp-3 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-800/80 border border-neutral-700/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-cyan-300">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setActivePost(null)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mb-4">
              <span>{activePost.publishedDate}</span>
              <span>·</span>
              <span className="text-cyan-400">{activePost.readTime}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pr-8">
              {activePost.title}
            </h2>

            {activePost.tags && activePost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activePost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono text-cyan-400 px-2 py-1 rounded bg-neutral-800 border border-neutral-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-invert max-w-none text-neutral-300 text-sm md:text-base leading-relaxed space-y-4 pt-4 border-t border-neutral-800">
              <p className="text-neutral-200 font-medium italic text-base">
                {activePost.excerpt}
              </p>
              <div className="whitespace-pre-line text-neutral-300">
                {activePost.content}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setActivePost(null)}
                className="px-5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
