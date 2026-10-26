import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SectionConfig } from '../../types/portfolio';
import {
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
} from 'lucide-react';
import { DEFAULT_PORTFOLIO } from '../../data/defaultPortfolio';

export const SectionsManager: React.FC = () => {
  const { portfolio, toggleSection, reorderSections } = usePortfolio();
  const sections = portfolio.sections || DEFAULT_PORTFOLIO.sections;
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Recalculate order indices
    const updated = list.map((s, idx) => ({ ...s, order: idx + 1 }));
    await reorderSections(updated);
    setFeedback('Section order updated.');
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleToggle = async (id: SectionConfig['id']) => {
    await toggleSection(id);
    setFeedback('Visibility setting saved.');
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleResetSections = async () => {
    if (window.confirm('Reset section order and visibility back to standard defaults?')) {
      await reorderSections(DEFAULT_PORTFOLIO.sections);
      setFeedback('Sections reset to defaults.');
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  const visibleCount = sections.filter((s) => s.enabled !== false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <span>Section Order & Visibility Layout</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Reorder sections or toggle them on/off. Visible: <strong className="text-white">{visibleCount}</strong> of {sections.length} sections.
          </p>
        </div>

        <button
          onClick={handleResetSections}
          className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Order to Defaults</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              sec.enabled !== false
                ? 'bg-neutral-900/80 border-neutral-800'
                : 'bg-neutral-950/50 border-neutral-900 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-neutral-500 w-8">
                0{idx + 1}
              </span>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{sec.name}</span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    (#{sec.id})
                  </span>
                </h3>
                <span className="text-[11px] text-neutral-400">
                  Status: {sec.enabled !== false ? 'Active on Public Site' : 'Hidden from Public Site'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => handleToggle(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  sec.enabled !== false
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900/80'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                {sec.enabled !== false ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Hidden</span>
                  </>
                )}
              </button>

              {/* Up Down */}
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMove(idx, 'up')}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors disabled:opacity-20 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={idx === sections.length - 1}
                onClick={() => handleMove(idx, 'down')}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors disabled:opacity-20 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
