import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUpRight, Menu, X, FileText, BookOpen } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { portfolio, setIsResumeOpen } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
        scrolled
          ? 'bg-neutral-950/85 backdrop-blur-md border-neutral-800/80 shadow-sm'
          : 'bg-neutral-950/40 backdrop-blur-sm border-neutral-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <a
          href="#home"
          className="text-lg font-semibold tracking-tight text-white hover:text-neutral-300 transition-colors whitespace-nowrap shrink-0 font-display"
        >
          {portfolio.profile.name}
        </a>

        {/* Zone 2: Navigation Links with Blog */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <a
            href="#projects"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Projects
          </a>
          <a
            href="#services"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Services
          </a>
          <a
            href="#experience"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Experience
          </a>
          <a
            href="#skills"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Skills
          </a>
          <a
            href="#blog"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5"
          >
            <span>Blog</span>
          </a>
          <a
            href="#recommendations"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1"
          >
            Endorsements
          </a>
          <button
            onClick={() => setIsResumeOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 text-neutral-300 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>
        </nav>

        {/* Zone 3: Direct Action Contact & Mobile Toggle (No admin / studio buttons on frontend) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-6 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm text-neutral-300">
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Projects
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Services
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Experience
            </a>
            <a
              href="#skills"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Skills
            </a>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors font-medium text-cyan-400"
            >
              Blog & Articles
            </a>
            <a
              href="#recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white transition-colors"
            >
              Endorsements
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsResumeOpen(true);
              }}
              className="py-1.5 text-left flex items-center gap-2 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>View & Print Resume</span>
            </button>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 text-white font-medium flex items-center justify-between pt-2 border-t border-neutral-800"
            >
              <span>Contact</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
