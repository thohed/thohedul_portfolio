import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { portfolio } = usePortfolio();
  const testimonials = (portfolio.testimonials || []).filter((t) => t.published !== false);

  return (
    <section id="recommendations" className="py-20 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-2">
              Endorsements & Proof
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Words from Engineering Partners
            </h2>
            <p className="text-base text-neutral-400 mt-3 font-light">
              Reflections from engineering leaders and product collaborators on velocity, code quality, and technical communication.
            </p>
          </div>
        </div>

        {/* 3-in-a-row grid */}
        {testimonials.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 text-neutral-400 text-sm">
            No partner endorsements currently listed.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
              >
                <div className="mb-6">
                  <Quote className="w-6 h-6 text-neutral-600 mb-4" />
                  <p className="text-sm text-neutral-300 leading-relaxed font-light italic">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author & Relationship without pills */}
                <div className="pt-4 border-t border-neutral-800/70">
                  <div className="font-semibold text-sm text-white">
                    {item.author}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {item.role} · <span className="text-neutral-300">{item.company}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1 font-mono">
                    {item.relation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
