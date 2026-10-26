import { ThemeStyle } from '../types/portfolio';

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  tagline: string;
  isDark: boolean;
  swatches: {
    canvas: string;
    surface: string;
    border: string;
    text: string;
    accent: string;
  };
  classes: {
    appBg: string;
    appText: string;
    selection: string;
    navBg: string;
    navBorder: string;
    navText: string;
    cardBg: string;
    cardHover: string;
    cardBorder: string;
    borderDivider: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    buttonPrimary: string;
    buttonSecondary: string;
    meterBg: string;
    meterFill: string;
    tagSep: string;
    kicker: string;
  };
}

export const THEMES: Record<ThemeStyle, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Minimalist',
    tagline: 'Deep jet black canvas, pure white typography, stark crisp contrast.',
    isDark: true,
    swatches: {
      canvas: '#0a0a0a',
      surface: '#171717',
      border: '#262626',
      text: '#ffffff',
      accent: '#f5f5f5',
    },
    classes: {
      appBg: 'bg-neutral-950',
      appText: 'text-neutral-100',
      selection: 'selection:bg-neutral-800 selection:text-white',
      navBg: 'bg-neutral-950/85',
      navBorder: 'border-neutral-800/80',
      navText: 'text-neutral-300',
      cardBg: 'bg-neutral-900/60',
      cardHover: 'hover:bg-neutral-900 hover:border-neutral-700',
      cardBorder: 'border-neutral-800/80',
      borderDivider: 'border-neutral-800/80',
      textPrimary: 'text-white',
      textSecondary: 'text-neutral-300',
      textMuted: 'text-neutral-400',
      buttonPrimary: 'bg-white text-neutral-950 hover:bg-neutral-200',
      buttonSecondary: 'bg-neutral-900 text-neutral-200 border-neutral-700 hover:bg-neutral-800',
      meterBg: 'bg-neutral-800',
      meterFill: 'bg-neutral-200',
      tagSep: 'text-neutral-600',
      kicker: 'text-neutral-400',
    },
  },
  slate: {
    id: 'slate',
    name: 'Slate Modernist',
    tagline: 'Deep cool charcoal navy tones, high legibility technical finish.',
    isDark: true,
    swatches: {
      canvas: '#020617',
      surface: '#0f172a',
      border: '#1e293b',
      text: '#f8fafc',
      accent: '#38bdf8',
    },
    classes: {
      appBg: 'bg-slate-950',
      appText: 'text-slate-100',
      selection: 'selection:bg-slate-800 selection:text-white',
      navBg: 'bg-slate-950/85',
      navBorder: 'border-slate-800/80',
      navText: 'text-slate-300',
      cardBg: 'bg-slate-900/70',
      cardHover: 'hover:bg-slate-900 hover:border-slate-700',
      cardBorder: 'border-slate-800/90',
      borderDivider: 'border-slate-800/80',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      buttonPrimary: 'bg-sky-400 text-slate-950 hover:bg-sky-300',
      buttonSecondary: 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800',
      meterBg: 'bg-slate-800',
      meterFill: 'bg-sky-400',
      tagSep: 'text-slate-600',
      kicker: 'text-sky-400/90',
    },
  },
  paper: {
    id: 'paper',
    name: 'Editorial Monograph',
    tagline: 'Zinc darkroom monochromatic depth, balanced editorial contrast.',
    isDark: true,
    swatches: {
      canvas: '#09090b',
      surface: '#18181b',
      border: '#27272a',
      text: '#fafafa',
      accent: '#e4e4e7',
    },
    classes: {
      appBg: 'bg-zinc-950',
      appText: 'text-zinc-100',
      selection: 'selection:bg-zinc-800 selection:text-white',
      navBg: 'bg-zinc-950/85',
      navBorder: 'border-zinc-800/80',
      navText: 'text-zinc-300',
      cardBg: 'bg-zinc-900/60',
      cardHover: 'hover:bg-zinc-900 hover:border-zinc-700',
      cardBorder: 'border-zinc-800/80',
      borderDivider: 'border-zinc-800/80',
      textPrimary: 'text-white',
      textSecondary: 'text-zinc-300',
      textMuted: 'text-zinc-400',
      buttonPrimary: 'bg-zinc-100 text-zinc-950 hover:bg-zinc-300',
      buttonSecondary: 'bg-zinc-900 text-zinc-200 border-zinc-700 hover:bg-zinc-800',
      meterBg: 'bg-zinc-800',
      meterFill: 'bg-zinc-300',
      tagSep: 'text-zinc-600',
      kicker: 'text-zinc-400',
    },
  },
  clean: {
    id: 'clean',
    name: 'Stone Architecture',
    tagline: 'Warm organic stone darkness, timeless architectural craft.',
    isDark: true,
    swatches: {
      canvas: '#0c0a09',
      surface: '#1c1917',
      border: '#292524',
      text: '#fafaf9',
      accent: '#e7e5e4',
    },
    classes: {
      appBg: 'bg-stone-950',
      appText: 'text-stone-100',
      selection: 'selection:bg-stone-800 selection:text-white',
      navBg: 'bg-stone-950/85',
      navBorder: 'border-stone-800/80',
      navText: 'text-stone-300',
      cardBg: 'bg-stone-900/60',
      cardHover: 'hover:bg-stone-900 hover:border-stone-700',
      cardBorder: 'border-stone-800/80',
      borderDivider: 'border-stone-800/80',
      textPrimary: 'text-white',
      textSecondary: 'text-stone-300',
      textMuted: 'text-stone-400',
      buttonPrimary: 'bg-stone-100 text-stone-950 hover:bg-stone-300',
      buttonSecondary: 'bg-stone-900 text-stone-200 border-stone-700 hover:bg-stone-800',
      meterBg: 'bg-stone-800',
      meterFill: 'bg-stone-300',
      tagSep: 'text-stone-600',
      kicker: 'text-stone-400',
    },
  },
  travertine: {
    id: 'travertine',
    name: 'Warm Travertine Paper',
    tagline: 'Refined editorial light gallery, warm linen canvas, luxury book print aesthetic.',
    isDark: false,
    swatches: {
      canvas: '#faf8f5',
      surface: '#ffffff',
      border: '#e7e5e4',
      text: '#1c1917',
      accent: '#0c0a09',
    },
    classes: {
      appBg: 'bg-[#faf8f5]',
      appText: 'text-stone-900',
      selection: 'selection:bg-stone-200 selection:text-stone-900',
      navBg: 'bg-[#faf8f5]/85',
      navBorder: 'border-stone-200',
      navText: 'text-stone-700',
      cardBg: 'bg-white',
      cardHover: 'hover:bg-stone-50 hover:border-stone-300',
      cardBorder: 'border-stone-200 shadow-sm',
      borderDivider: 'border-stone-200',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-700',
      textMuted: 'text-stone-500',
      buttonPrimary: 'bg-stone-900 text-stone-50 hover:bg-stone-800',
      buttonSecondary: 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200',
      meterBg: 'bg-stone-200',
      meterFill: 'bg-stone-800',
      tagSep: 'text-stone-400',
      kicker: 'text-stone-600',
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Midnight Emerald',
    tagline: 'Deep forest obsidian canvas with muted sage botanical accents.',
    isDark: true,
    swatches: {
      canvas: '#021e17',
      surface: '#062d23',
      border: '#0a3d30',
      text: '#ecfdf5',
      accent: '#34d399',
    },
    classes: {
      appBg: 'bg-[#021e17]',
      appText: 'text-emerald-50',
      selection: 'selection:bg-emerald-900 selection:text-white',
      navBg: 'bg-[#021e17]/85',
      navBorder: 'border-emerald-900/60',
      navText: 'text-emerald-200',
      cardBg: 'bg-[#05261e]/70',
      cardHover: 'hover:bg-[#073026] hover:border-emerald-800',
      cardBorder: 'border-emerald-900/80',
      borderDivider: 'border-emerald-900/60',
      textPrimary: 'text-emerald-50',
      textSecondary: 'text-emerald-200',
      textMuted: 'text-emerald-400/80',
      buttonPrimary: 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300',
      buttonSecondary: 'bg-[#062d23] text-emerald-200 border-emerald-800 hover:bg-[#09382c]',
      meterBg: 'bg-emerald-950',
      meterFill: 'bg-emerald-400',
      tagSep: 'text-emerald-700',
      kicker: 'text-emerald-400',
    },
  },
};
