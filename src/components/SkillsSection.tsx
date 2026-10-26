import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const SkillsSection: React.FC = () => {
  const { portfolio } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  return (
    <section id="skills" className="py-20 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-2">
            Technical Competencies
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Deep Core Craft, Modern Toolchains
          </h2>
          <p className="text-base text-neutral-400 mt-3 font-light">
            Engineered systems require both broad architectural perspective and obsessive attention to compiler, runtime, and network primitives.
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left Category Selector, Right Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Category Navigation (Clean list with active indicators) */}
          <div className="lg:col-span-4 space-y-2">
            {portfolio.skills.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                  selectedCategory === idx
                    ? 'bg-neutral-900 border-neutral-700 text-white'
                    : 'bg-neutral-900/30 border-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700/60'
                }`}
              >
                <div className="font-semibold text-sm tracking-tight mb-1 text-white">
                  {cat.category}
                </div>
                <div className="text-xs text-neutral-400 font-light line-clamp-2">
                  {cat.description}
                </div>
              </button>
            ))}
          </div>

          {/* Active Category Skills Matrix */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="mb-6 pb-4 border-b border-neutral-800 flex items-baseline justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {portfolio.skills[selectedCategory]?.category}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {portfolio.skills[selectedCategory]?.description}
                </p>
              </div>
              <div className="text-xs text-neutral-400 font-mono">
                {portfolio.skills[selectedCategory]?.skills.length} core proficiencies
              </div>
            </div>

            <div className="space-y-6">
              {portfolio.skills[selectedCategory]?.skills.map((skill, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{skill.name}</span>
                      {skill.highlight && (
                        <span className="text-neutral-400 text-xs hidden sm:inline">
                          · {skill.highlight}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs tabular-nums text-neutral-400">
                      <span>{skill.years} yrs</span>
                      <span className="text-neutral-600">/</span>
                      <span className="text-neutral-200 font-medium">{skill.level}%</span>
                    </div>
                  </div>

                  {/* Clean Hairline Progress Meter */}
                  <div className="w-full h-1.5 bg-neutral-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-300 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
