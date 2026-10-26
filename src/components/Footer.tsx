import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUp, BookOpen, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  const { portfolio, setIsResumeOpen } = usePortfolio();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Rights */}
          <div className="text-center md:text-left space-y-1">
            <div className="text-sm font-bold text-white font-display">
              {portfolio.profile.name}
            </div>
            <div className="text-xs text-neutral-400">
              © {currentYear} {portfolio.profile.name}. All rights reserved. Full-stack Node.js & React architecture.
            </div>
          </div>

          {/* Clean Public Navigation Links (No admin/studio buttons on frontend) */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <a href="#projects" className="hover:text-white transition-colors">
              Projects
            </a>
            <a href="#services" className="hover:text-white transition-colors">
              Services
            </a>
            <a href="#experience" className="hover:text-white transition-colors">
              Experience
            </a>
            <a href="#skills" className="hover:text-white transition-colors">
              Skills
            </a>
            <a href="#blog" className="hover:text-white transition-colors text-cyan-400 font-medium">
              Blog
            </a>
            <a href="#recommendations" className="hover:text-white transition-colors">
              Endorsements
            </a>
            <button
              onClick={() => setIsResumeOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Resume
            </button>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
            aria-label="Scroll back to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
