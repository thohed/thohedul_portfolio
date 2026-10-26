import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { portfolio } = usePortfolio();

  return (
    <section id="experience" className="py-20 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-2">
            Career Timeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Track Record in High-Growth Engineering
          </h2>
          <p className="text-base text-neutral-400 mt-3 font-light">
            A chronological progression of senior individual contributor and lead engineering roles across distributed platforms.
          </p>
        </div>

        {/* Experience Timeline Rows */}
        <div className="space-y-8">
          {portfolio.experience.map((exp, index) => (
            <div
              key={exp.id}
              className="p-6 sm:p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
            >
              {/* Header Row: Role & Period */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight font-display">
                    {exp.role}
                  </h3>
                  <div className="text-base font-medium text-neutral-300 mt-0.5">
                    {exp.company}
                  </div>
                </div>

                {/* Clean unboxed metadata with separators (NO PILLS) */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-mono">
                  <span>{exp.period}</span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span>{exp.location}</span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span>{exp.type}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed font-light mb-6">
                {exp.description}
              </p>

              {/* Concrete Key Achievements */}
              <div className="space-y-2.5 mb-6">
                {exp.achievements.map((ach, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-light">{ach}</span>
                  </div>
                ))}
              </div>

              {/* Technologies strip */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 font-mono pt-4 border-t border-neutral-800/60">
                <span className="text-neutral-400 font-medium">Stack:</span>
                {exp.technologies.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="text-neutral-300">{tech}</span>
                    {idx < exp.technologies.length - 1 && (
                      <span aria-hidden="true" className="text-neutral-600">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
