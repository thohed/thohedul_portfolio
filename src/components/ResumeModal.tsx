import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  CheckCircle2,
  ExternalLink,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { CV_DATA } from '../data/cvData';
import { downloadCvPdf } from '../utils/generateCvPdf';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [paperMode, setPaperMode] = useState(false); // false = dark on-site preview, true = paper white

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      // 100% Vector PDF generated via jsPDF directly from CV_DATA
      downloadCvPdf(CV_DATA, 'Md-Thohedul-Islam-CV.pdf');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.warn('Direct jsPDF download failed, falling back to server endpoint:', err);
      try {
        const link = document.createElement('a');
        link.href = '/api/resume/download';
        link.download = 'Md-Thohedul-Islam-CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3500);
      } catch (e) {
        window.open('/api/resume/download', '_blank');
      }
    } finally {
      setDownloading(false);
    }
  };

  const { header, summary, skills, experience, projects, education, certifications, languages } =
    CV_DATA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-label="Dismiss resume backdrop" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[95vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-10 overflow-hidden">
        {/* Actions bar (hidden in print) */}
        <div className="no-print flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 bg-neutral-900 border-b border-neutral-800 gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <span className="font-semibold text-white font-display">Curriculum Vitae</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-mono text-[11px] hidden sm:inline">
              ATS Single-Column Standard (A4)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Paper preview toggle */}
            <button
              onClick={() => setPaperMode((prev) => !prev)}
              className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Toggle between dark site theme and white paper print view"
            >
              {paperMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Dark View</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Paper View</span>
                </>
              )}
            </button>

            {/* Print / Save via Browser */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Print via browser dialog"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Primary Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              title="Download ATS-compliant vector PDF file"
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-950 font-bold">Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-neutral-950" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer ml-1"
              aria-label="Close CV modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable CV Document View */}
        <div
          className={`overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center transition-colors duration-200 ${
            paperMode ? 'bg-neutral-200' : 'bg-neutral-950'
          }`}
        >
          <div
            id="cv-document-root"
            className={`w-full max-w-[820px] p-6 sm:p-10 md:p-12 rounded-lg shadow-xl font-sans text-sm transition-colors duration-200 cv-page-container ${
              paperMode
                ? 'bg-white text-neutral-900 border border-neutral-300'
                : 'bg-neutral-900 text-neutral-100 border border-neutral-800'
            }`}
          >
            {/* ========================================================= */}
            {/* 1. HEADER                                                 */}
            {/* ========================================================= */}
            <header className="cv-section border-b-2 pb-5 mb-6 border-neutral-800 data-[paper=true]:border-neutral-900">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h1
                  className={`text-2xl sm:text-3xl font-bold tracking-tight font-display ${
                    paperMode ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {header.name}
                </h1>
                <div
                  className={`text-xs font-mono flex items-center gap-1 ${
                    paperMode ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{header.location}</span>
                </div>
              </div>

              {/* Title */}
              <div
                className={`text-sm sm:text-base font-semibold mt-1 ${
                  paperMode ? 'text-blue-700' : 'text-blue-400'
                }`}
              >
                {header.title}
              </div>

              {/* Contact bar */}
              <div
                className={`flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs mt-3 font-mono ${
                  paperMode ? 'text-neutral-700' : 'text-neutral-300'
                }`}
              >
                <a
                  href={`mailto:${header.email}`}
                  className="hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3 h-3 text-neutral-400" />
                  <span>{header.email}</span>
                </a>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-neutral-400" />
                  <span>{header.phone}</span>
                </span>
                <span>·</span>
                <a
                  href={header.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <Globe className="w-3 h-3 text-neutral-400" />
                  <span>{header.portfolioUrl.replace(/^https?:\/\//, '')}</span>
                </a>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Github className="w-3 h-3 text-neutral-400" />
                  <span>{header.github}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Linkedin className="w-3 h-3 text-neutral-400" />
                  <span>{header.linkedin}</span>
                </span>
              </div>
            </header>

            {/* ========================================================= */}
            {/* 2. PROFESSIONAL SUMMARY                                   */}
            {/* ========================================================= */}
            <section className="cv-section mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 font-display border-b ${
                  paperMode
                    ? 'text-neutral-950 border-neutral-300'
                    : 'text-neutral-100 border-neutral-800'
                }`}
              >
                Professional Summary
              </h2>
              <p
                className={`text-xs sm:text-[13px] leading-relaxed font-light ${
                  paperMode ? 'text-neutral-700' : 'text-neutral-300'
                }`}
              >
                {summary}
              </p>
            </section>

            {/* ========================================================= */}
            {/* 3. CORE SKILLS (grouped by category)                      */}
            {/* ========================================================= */}
            <section className="cv-section mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 font-display border-b ${
                  paperMode
                    ? 'text-neutral-950 border-neutral-300'
                    : 'text-neutral-100 border-neutral-800'
                }`}
              >
                Core Technical Skills
              </h2>
              <div className="space-y-2 text-xs">
                {skills.map((cat, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:gap-2 leading-relaxed">
                    <span
                      className={`font-semibold shrink-0 sm:w-48 ${
                        paperMode ? 'text-neutral-950' : 'text-neutral-200'
                      }`}
                    >
                      {cat.category}:
                    </span>
                    <span className={paperMode ? 'text-neutral-700' : 'text-neutral-400 font-mono text-[11px]'}>
                      {cat.skills.join('  ·  ')}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* 4. WORK EXPERIENCE                                        */}
            {/* ========================================================= */}
            <section className="cv-section mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider pb-1 mb-3.5 font-display border-b ${
                  paperMode
                    ? 'text-neutral-950 border-neutral-300'
                    : 'text-neutral-100 border-neutral-800'
                }`}
              >
                Work Experience
              </h2>
              <div className="space-y-5">
                {experience.map((exp, idx) => (
                  <div key={idx} className="cv-item space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-xs sm:text-sm ${
                            paperMode ? 'text-neutral-950' : 'text-white'
                          }`}
                        >
                          {exp.role}
                        </span>
                        <span className="text-neutral-500">·</span>
                        <span
                          className={`font-semibold text-xs ${
                            paperMode ? 'text-blue-700' : 'text-blue-400'
                          }`}
                        >
                          {exp.company}
                        </span>
                      </div>
                      <div
                        className={`text-xs font-mono ${
                          paperMode ? 'text-neutral-600' : 'text-neutral-400'
                        }`}
                      >
                        {exp.period}
                      </div>
                    </div>

                    <div
                      className={`text-[11px] ${
                        paperMode ? 'text-neutral-500' : 'text-neutral-400'
                      }`}
                    >
                      {exp.location}
                    </div>

                    <ul
                      className={`list-disc list-inside text-xs space-y-1 pl-1 pt-0.5 leading-relaxed font-light ${
                        paperMode ? 'text-neutral-700' : 'text-neutral-300'
                      }`}
                    >
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* 5. SELECTED PROJECTS                                      */}
            {/* ========================================================= */}
            <section className="cv-section mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider pb-1 mb-3.5 font-display border-b ${
                  paperMode
                    ? 'text-neutral-950 border-neutral-300'
                    : 'text-neutral-100 border-neutral-800'
                }`}
              >
                Selected Engineering Projects
              </h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="cv-item space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-xs sm:text-sm ${
                            paperMode ? 'text-neutral-950' : 'text-white'
                          }`}
                        >
                          {proj.title}
                        </span>
                        <span className="text-neutral-500">·</span>
                        <span
                          className={`text-xs ${
                            paperMode ? 'text-neutral-600' : 'text-neutral-400'
                          }`}
                        >
                          {proj.role}
                        </span>
                      </div>
                      <div
                        className={`text-xs font-mono font-medium ${
                          paperMode ? 'text-blue-700' : 'text-blue-400'
                        }`}
                      >
                        {proj.impactMetric}
                      </div>
                    </div>

                    <div
                      className={`text-[11px] font-mono ${
                        paperMode ? 'text-neutral-500' : 'text-neutral-400'
                      }`}
                    >
                      Tech: {proj.techStack.join(', ')}
                    </div>

                    <ul
                      className={`list-disc list-inside text-xs space-y-1 pl-1 pt-0.5 leading-relaxed font-light ${
                        paperMode ? 'text-neutral-700' : 'text-neutral-300'
                      }`}
                    >
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* 6. EDUCATION                                              */}
            {/* ========================================================= */}
            <section className="cv-section mb-6">
              <h2
                className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 font-display border-b ${
                  paperMode
                    ? 'text-neutral-950 border-neutral-300'
                    : 'text-neutral-100 border-neutral-800'
                }`}
              >
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="cv-item text-xs space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span
                        className={`font-bold ${
                          paperMode ? 'text-neutral-950' : 'text-white'
                        }`}
                      >
                        {edu.institution}
                      </span>
                      <span
                        className={`font-mono ${
                          paperMode ? 'text-neutral-600' : 'text-neutral-400'
                        }`}
                      >
                        {edu.period}
                      </span>
                    </div>
                    <div
                      className={paperMode ? 'text-neutral-800 font-medium' : 'text-neutral-200'}
                    >
                      {edu.degree} · <span className="text-neutral-500">{edu.location}</span>
                    </div>
                    {edu.honors && (
                      <div
                        className={`italic text-[11px] ${
                          paperMode ? 'text-neutral-600' : 'text-neutral-400'
                        }`}
                      >
                        {edu.honors}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ========================================================= */}
            {/* 7. CERTIFICATIONS                                         */}
            {/* ========================================================= */}
            {certifications && certifications.length > 0 && (
              <section className="cv-section mb-6">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 font-display border-b ${
                    paperMode
                      ? 'text-neutral-950 border-neutral-300'
                      : 'text-neutral-100 border-neutral-800'
                  }`}
                >
                  Certifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {certifications.map((c, idx) => (
                    <div
                      key={idx}
                      className={`cv-item p-2.5 rounded border ${
                        paperMode
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-100'
                      }`}
                    >
                      <div className="font-semibold text-xs">{c.title}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          paperMode ? 'text-neutral-600' : 'text-neutral-400'
                        }`}
                      >
                        {c.issuer} · {c.year}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ========================================================= */}
            {/* 8. LANGUAGES                                              */}
            {/* ========================================================= */}
            {languages && languages.length > 0 && (
              <section className="cv-section">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 font-display border-b ${
                    paperMode
                      ? 'text-neutral-950 border-neutral-300'
                      : 'text-neutral-100 border-neutral-800'
                  }`}
                >
                  Languages
                </h2>
                <div
                  className={`flex flex-wrap gap-x-4 gap-y-1 text-xs ${
                    paperMode ? 'text-neutral-700' : 'text-neutral-300'
                  }`}
                >
                  {languages.map((l, idx) => (
                    <span key={idx}>
                      <strong className={paperMode ? 'text-neutral-950' : 'text-white'}>
                        {l.name}:
                      </strong>{' '}
                      <span className="text-neutral-400">{l.proficiency}</span>
                      {idx < languages.length - 1 && <span className="ml-4 text-neutral-600">·</span>}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
