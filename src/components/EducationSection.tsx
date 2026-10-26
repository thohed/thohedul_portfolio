import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react';
import { EducationItem } from '../types/portfolio';

export const EducationSection: React.FC = () => {
  const { portfolio } = usePortfolio();
  const educationList = (portfolio.education || []).filter((e) => e.published !== false);

  if (educationList.length === 0) return null;

  return (
    <section id="education" className="py-24 border-t border-neutral-800/60 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">Academic Background</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
              Education & Degrees
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Formal foundations in computer science theory, computer networks, distributed systems, and mathematical modeling.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-neutral-800 pl-6 md:pl-8 ml-4 md:ml-6 space-y-12">
          {educationList.map((edu: EducationItem, idx: number) => (
            <div key={edu.id || idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-neutral-900 border-2 border-emerald-500 group-hover:scale-125 transition-transform"></div>

              <div className="p-6 md:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                    <GraduationCap className="w-4 h-4" />
                    <span>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {edu.location}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-neutral-100 mb-3 group-hover:text-white transition-colors">
                  {edu.institution}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                  {edu.description}
                </p>

                {edu.honors && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{edu.honors}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
