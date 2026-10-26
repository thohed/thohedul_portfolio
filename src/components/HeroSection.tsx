import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowDown, Github, Linkedin, Twitter, Download, Mail, Check, Copy, FileText } from 'lucide-react';
import { CV_DATA } from '../data/cvData';
import { downloadCvPdf } from '../utils/generateCvPdf';

export const HeroSection: React.FC = () => {
  const { portfolio, setIsResumeOpen } = usePortfolio();
  const { profile } = portfolio;
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleDownloadPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloadingPdf(true);
    try {
      downloadCvPdf(CV_DATA, 'Md-Thohedul-Islam-CV.pdf');
    } catch (err) {
      window.location.href = '/api/resume/download';
    } finally {
      setTimeout(() => setDownloadingPdf(false), 1200);
    }
  };

  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Split Screen 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Quiet unboxed metadata kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-neutral-400 mb-6 font-medium">
              <span>{profile.title}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{profile.location}</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1] font-display max-w-2xl text-balance">
              Building resilient systems and refined digital products.
            </h1>

            {/* Balanced Lead Body */}
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 max-w-2xl text-pretty font-light">
              {profile.tagline}
            </p>

            {/* Availability Note */}
            <div className="text-xs sm:text-sm text-neutral-400 mb-8 border-l border-neutral-700/80 pl-3">
              {profile.status}
            </div>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <a
                href="#projects"
                className="px-5 py-2.5 text-sm font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span>View Selected Works</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsResumeOpen(true)}
                className="px-4 py-2.5 text-sm font-medium text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
                title="Open interactive CV preview"
              >
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Resume / CV</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="px-3.5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Download ATS-compliant vector PDF"
              >
                {downloadingPdf ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Preparing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-neutral-400" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyEmail}
                className="px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
                title="Copy email address"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-400" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Links as quiet typography with icons */}
            <div className="flex items-center gap-6 text-sm text-neutral-400">
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Connect</span>
              <a
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href={profile.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Twitter className="w-4 h-4" />
                <span>X / Twitter</span>
              </a>
            </div>
          </div>

          {/* Right Column: High-Fidelity Visual Anchor */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-md lg:max-w-none aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 shadow-2xl">
              {!imageError ? (
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.name} - Portrait`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-center filter contrast-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-neutral-900 to-neutral-950 text-neutral-400">
                  <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-4 text-2xl font-bold text-white">
                    {profile.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{profile.name}</h3>
                  <p className="text-xs text-neutral-400">{profile.title}</p>
                </div>
              )}

              {/* Scrim overlay at bottom for legible quiet credit */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-neutral-950/90 via-neutral-950/50 to-transparent flex items-center justify-between text-xs text-neutral-300">
                <span className="font-medium text-white">{profile.name}</span>
                <span className="text-neutral-400 text-[11px]">{profile.location.split('·')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Quantitative Proof Strip below the hero split (as required by frontend-design Section 2.B) */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-neutral-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {profile.metrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono tabular-nums">
                  {metric.value}
                </div>
                <div className="text-xs font-semibold text-neutral-300 tracking-tight">
                  {metric.label}
                </div>
                <div className="text-xs text-neutral-400 font-normal">
                  {metric.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
