import React, { useEffect, useState } from 'react';
import { Project } from '../types/portfolio';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ExternalLink, Github, CheckCircle2, Terminal, Layers, ArrowUpRight, Lock, Trash2, Edit3, Shield } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { isAuthenticated, setIsLoginModalOpen, setIsAdminDashboardOpen } = useAuth();
  const { deleteProject } = usePortfolio();
  const [copiedCode, setCopiedCode] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const copyCode = () => {
    if (project.codeSnippet?.code) {
      navigator.clipboard.writeText(project.codeSnippet.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${project.title}" from the portfolio?`)) {
      await deleteProject(project.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onClose();
    setIsAdminDashboardOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background dismissal backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-label="Close modal backdrop" />

      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-10 flex flex-col">
        {/* Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="capitalize">{project.category} Engineering</span>
            <span aria-hidden="true">·</span>
            <span>{project.date}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-neutral-300 font-medium">{project.impactMetric}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 font-display">
              {project.title}
            </h2>
            <p className="text-base text-neutral-300 leading-relaxed font-light">
              {project.tagline}
            </p>
          </div>

          {/* Project Media Showcase */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
            {!imageFailed ? (
              <img
                src={project.image}
                alt={project.title}
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-neutral-950 text-neutral-400">
                <Layers className="w-12 h-12 mb-3 text-neutral-600" />
                <span className="text-sm font-medium text-neutral-300">{project.title} Interface</span>
              </div>
            )}
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-neutral-950/80 backdrop-blur-sm rounded-md border border-neutral-800 text-xs font-mono text-neutral-300">
              {project.impactMetric}
            </div>
          </div>

          {/* Architecture & Engineering Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                The Engineering Challenge
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                {project.challenge}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                Architectural Solution
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Key Deliverables & Features */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Key Capabilities & System Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.keyFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Unboxed Metadata */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
              Technologies & Infrastructure
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-neutral-300 font-mono">
              {project.techStack.map((tech, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-neutral-200">{tech}</span>
                  {idx < project.techStack.length - 1 && (
                    <span aria-hidden="true" className="text-neutral-600">/</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Code Snippet Spotlight */}
          {project.codeSnippet && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-2 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{project.codeSnippet.filename}</span>
                </div>
                <button
                  onClick={copyCode}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {copiedCode ? 'Copied to clipboard' : 'Copy snippet'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 overflow-x-auto font-mono leading-relaxed">
                <code>{project.codeSnippet.code}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-neutral-900/90 backdrop-blur-md border-t border-neutral-800">
          <div className="flex flex-wrap items-center gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Deployment</span>
              </a>
            )}

            {/* Admin Controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-2.5 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Open Admin Dashboard to edit this project"
                >
                  <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Edit Project</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2.5 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-neutral-950 hover:bg-red-950/40 border border-neutral-800 hover:border-red-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Permanently delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsLoginModalOpen(true);
                }}
                className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Admin login required to edit or delete"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login to Edit / Delete</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
