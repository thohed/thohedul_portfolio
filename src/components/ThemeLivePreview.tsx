import React, { useState } from 'react';
import { ThemeStyle } from '../types/portfolio';
import { THEMES, ThemeConfig } from '../data/themes';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Check,
  Eye,
  RotateCcw,
  Save,
  Sparkles,
  Layers,
  ArrowUpRight,
  Code2,
  Terminal,
  Laptop,
} from 'lucide-react';

interface ThemeLivePreviewProps {
  selectedTheme: ThemeStyle;
  onApply: (theme: ThemeStyle) => void;
}

export const ThemeLivePreview: React.FC<ThemeLivePreviewProps> = ({ selectedTheme, onApply }) => {
  const { portfolio, previewTheme, setPreviewTheme } = usePortfolio();
  const themeConfig: ThemeConfig = THEMES[selectedTheme] || THEMES.obsidian;
  const currentSavedTheme = portfolio.theme;
  const isCurrentlySaved = currentSavedTheme === selectedTheme;
  const isLiveOnSite = previewTheme === selectedTheme;

  const [previewTab, setPreviewTab] = useState<'components' | 'swatches'>('components');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleSitePreview = () => {
    if (isLiveOnSite) {
      setPreviewTheme(null);
    } else {
      setPreviewTheme(selectedTheme);
    }
  };

  const handleSave = () => {
    onApply(selectedTheme);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleRevert = () => {
    setPreviewTheme(null);
  };

  const { swatches, classes } = themeConfig;

  return (
    <div className="space-y-4 pt-2">
      {/* Live Preview Control Header */}
      <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0"
            style={{ backgroundColor: swatches.accent }}
          />
          <div>
            <div className="font-semibold text-white flex items-center gap-1.5">
              <span>{themeConfig.name}</span>
              {isCurrentlySaved && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-mono">
                  ACTIVE
                </span>
              )}
              {isLiveOnSite && !isCurrentlySaved && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/80 font-mono animate-pulse">
                  PREVIEWING LIVE
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-400 font-light mt-0.5 line-clamp-1">
              {themeConfig.tagline}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleToggleSitePreview}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer text-xs ${
              isLiveOnSite
                ? 'bg-amber-400 text-neutral-950 font-semibold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
            }`}
            title="Toggle preview on the actual full website page"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isLiveOnSite ? 'Stop Site Preview' : 'Preview on Site'}</span>
          </button>

          {!isCurrentlySaved && (
            <button
              type="button"
              onClick={handleSave}
              className="px-3.5 py-1.5 rounded-lg font-semibold bg-white text-neutral-950 hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            >
              {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saveSuccess ? 'Saved!' : 'Save Theme'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs: Component Sandbox vs Color Swatches */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPreviewTab('components')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              previewTab === 'components'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Component Sandbox
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab('swatches')}
            className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
              previewTab === 'swatches'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Color Palette & Contrast
          </button>
        </div>

        <span className="text-[11px] text-neutral-400">
          Live simulation
        </span>
      </div>

      {/* TAB 1: COMPONENT SANDBOX */}
      {previewTab === 'components' && (
        <div
          className="rounded-xl border p-4 space-y-4 overflow-hidden transition-all duration-300 font-sans shadow-inner"
          style={{
            backgroundColor: swatches.canvas,
            borderColor: swatches.border,
            color: swatches.text,
          }}
        >
          {/* Simulated Top Navigation Bar */}
          <div
            className="p-3 rounded-lg border flex items-center justify-between gap-4 transition-colors text-xs"
            style={{
              backgroundColor: swatches.surface,
              borderColor: swatches.border,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight font-display text-sm" style={{ color: swatches.text }}>
                {portfolio.profile.name}
              </span>
              <span className="text-[10px] opacity-60">· Portfolio</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] opacity-80">
              <span>Projects</span>
              <span>Experience</span>
              <span>Skills</span>
            </div>

            <button
              type="button"
              className="px-2.5 py-1 rounded text-[11px] font-semibold transition-transform"
              style={{
                backgroundColor: swatches.accent,
                color: themeConfig.isDark ? '#000000' : '#ffffff',
              }}
            >
              Get in Touch
            </button>
          </div>

          {/* Simulated Hero Section Snippet */}
          <div className="p-4 rounded-lg space-y-2.5 border" style={{ borderColor: `${swatches.border}80` }}>
            <div className="text-[11px] font-medium opacity-70">
              {portfolio.profile.title} · {portfolio.profile.location.split('·')[0]}
            </div>

            <h4 className="text-base sm:text-lg font-bold font-display leading-tight" style={{ color: swatches.text }}>
              Building resilient systems and refined digital products.
            </h4>

            <p className="text-xs opacity-75 font-light leading-relaxed line-clamp-2">
              {portfolio.profile.tagline}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                className="px-3 py-1.5 rounded text-xs font-semibold"
                style={{
                  backgroundColor: swatches.accent,
                  color: themeConfig.isDark ? '#000000' : '#ffffff',
                }}
              >
                View Works →
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded text-xs border font-medium opacity-85"
                style={{
                  backgroundColor: swatches.surface,
                  borderColor: swatches.border,
                  color: swatches.text,
                }}
              >
                Download CV
              </button>
            </div>
          </div>

          {/* Simulated Bento Project Card Snippet */}
          <div
            className="p-4 rounded-xl border transition-colors space-y-3"
            style={{
              backgroundColor: swatches.surface,
              borderColor: swatches.border,
            }}
          >
            <div className="flex items-center justify-between text-[11px] opacity-75 font-mono">
              <span>Cloud & Systems · 2026</span>
              <span className="font-semibold">3.8ms P99 · 45k rps</span>
            </div>

            <div className="flex items-baseline justify-between">
              <h5 className="font-bold text-sm font-display" style={{ color: swatches.text }}>
                Nebula Cloud Orchestrator
              </h5>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </div>

            <p className="text-xs opacity-75 font-light line-clamp-1">
              Global multi-cluster Kubernetes monitoring and automated service mesh scheduler.
            </p>

            {/* Thumbnail simulator */}
            <div
              className="w-full h-20 rounded-lg overflow-hidden border relative flex items-center justify-center text-[11px] opacity-90"
              style={{
                backgroundColor: swatches.canvas,
                borderColor: swatches.border,
              }}
            >
              <img
                src="/src/assets/images/project_nexus_cloud_1792818814330.jpg"
                alt="Simulated Project"
                className="w-full h-full object-cover opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white">
                Live Screenshot
              </span>
            </div>

            {/* Tech stack chips unboxed */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono opacity-80 pt-1">
              <span>Go</span>
              <span>/</span>
              <span>TypeScript</span>
              <span>/</span>
              <span>Kubernetes</span>
              <span>/</span>
              <span>Tailwind</span>
            </div>
          </div>

          {/* Simulated Skill Meter & Tabular Metric */}
          <div
            className="p-3.5 rounded-xl border space-y-2 text-xs"
            style={{
              backgroundColor: swatches.surface,
              borderColor: swatches.border,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">React 19 & Distributed Systems</span>
              <span className="font-mono text-[11px] font-bold">96%</span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: `${swatches.border}` }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: '96%',
                  backgroundColor: swatches.accent,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PALETTE & CONTRAST SWATCHES */}
      {previewTab === 'swatches' && (
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="text-xs text-neutral-400">
            Hexadecimal tokens and structural color hierarchy for <strong className="text-white">{themeConfig.name}</strong>:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-neutral-800 space-y-2 bg-neutral-900">
              <div
                className="w-full h-8 rounded border border-white/10"
                style={{ backgroundColor: swatches.canvas }}
              />
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">CANVAS BG</span>
                <span className="font-mono text-white text-[11px]">{swatches.canvas}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-800 space-y-2 bg-neutral-900">
              <div
                className="w-full h-8 rounded border border-white/10"
                style={{ backgroundColor: swatches.surface }}
              />
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">SURFACE / CARDS</span>
                <span className="font-mono text-white text-[11px]">{swatches.surface}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-800 space-y-2 bg-neutral-900">
              <div
                className="w-full h-8 rounded border border-white/10"
                style={{ backgroundColor: swatches.border }}
              />
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">HAIRLINE BORDER</span>
                <span className="font-mono text-white text-[11px]">{swatches.border}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-800 space-y-2 bg-neutral-900">
              <div
                className="w-full h-8 rounded border border-white/10"
                style={{ backgroundColor: swatches.text }}
              />
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">PRIMARY TEXT</span>
                <span className="font-mono text-white text-[11px]">{swatches.text}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-800 space-y-2 bg-neutral-900">
              <div
                className="w-full h-8 rounded border border-white/10"
                style={{ backgroundColor: swatches.accent }}
              />
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">ACCENT ACTION</span>
                <span className="font-mono text-white text-[11px]">{swatches.accent}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-800 space-y-2 bg-neutral-900 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">MODE CLASSIFICATION</span>
                <span className="text-white font-semibold text-[11px]">
                  {themeConfig.isDark ? 'Dark Surface (OLED/Jet)' : 'Editorial Light (Travertine)'}
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">WCAG 2.2 Compliant</div>
            </div>
          </div>
        </div>
      )}

      {/* Floating or Footer Revert Bar when previewing on site */}
      {isLiveOnSite && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Currently previewing on the live page background!</span>
          </div>
          <button
            type="button"
            onClick={handleRevert}
            className="text-xs underline hover:text-white cursor-pointer"
          >
            Revert Site Preview
          </button>
        </div>
      )}
    </div>
  );
};
