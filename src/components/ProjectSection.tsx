import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { Project, ProjectCategory } from '../types/portfolio';
import { ArrowUpRight, Plus, ExternalLink, Github, Lock, Trash2, Edit3, Shield } from 'lucide-react';

export const ProjectSection: React.FC = () => {
  const { portfolio, setActiveProject, setIsStudioOpen, deleteProject } = usePortfolio();
  const { isAuthenticated, setIsLoginModalOpen, setIsAdminDashboardOpen } = useAuth();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const categories: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: 'All Works' },
    { key: 'cloud', label: 'Cloud & Systems' },
    { key: 'ai', label: 'AI & Workflows' },
    { key: 'frontend', label: 'Frontend & Commerce' },
    { key: 'fullstack', label: 'Full Stack & WebAssembly' },
  ];

  const filteredProjects = portfolio.projects.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <section id="projects" className="py-20 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header with Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-2">
              Selected Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Engineered for Scale and Impact
            </h2>
          </div>

          {/* Interactive Filter Tabs (Segmented controls - functional buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800/90 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.key
                    ? 'bg-neutral-800 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Bento Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {filteredProjects.map((project, idx) => {
            // Bento sizing: first 2 projects get prominent spans if in 'all' view
            const isLarge = idx === 0 || (idx === 1 && filteredProjects.length > 2);
            const gridClass = isLarge
              ? 'lg:col-span-7'
              : idx === 1
              ? 'lg:col-span-5'
              : 'lg:col-span-6';

            return (
              <div
                key={project.id}
                onClick={() => setActiveProject(project)}
                className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 transition-all duration-200 cursor-pointer overflow-hidden ${gridClass}`}
              >
                {/* Upper Metadata & Direct Title */}
                <div>
                  {/* Clean unboxed metadata kicker (NO PILLS) */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.date}</span>
                    </div>
                    <span className="font-mono text-neutral-300 tabular-nums">
                      {project.impactMetric}
                    </span>
                  </div>

                  {/* Card Title leading directly */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 font-display group-hover:text-neutral-100 transition-colors flex items-center justify-between">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed font-light mb-6">
                    {project.tagline}
                  </p>
                </div>

                {/* Media Showcase container with fallback */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 mb-6 group-hover:border-neutral-700 transition-colors">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback gracefully
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-neutral-950/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Bottom Tech Metadata & Links */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60 text-xs text-neutral-400">
                  <div className="flex items-center gap-2 truncate max-w-[70%] font-mono">
                    {project.techStack.slice(0, 4).map((tech, i) => (
                      <span key={i} className="text-neutral-300">
                        {tech}
                        {i < Math.min(project.techStack.length, 4) - 1 && <span className="text-neutral-600 ml-2">/</span>}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAuthenticated ? (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setIsAdminDashboardOpen(true)}
                          className="px-2 py-1 text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          title="Edit this project in Admin Panel"
                        >
                          <Edit3 className="w-3 h-3 text-neutral-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete project "${project.title}"?`)) {
                              deleteProject(project.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-red-400 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors cursor-pointer"
                          title="Delete this project permanently"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 group-hover:text-white font-medium transition-colors">
                        Case Study →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Callout with Admin Protection */}
        <div className="mt-12 p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              {isAuthenticated ? (
                <Shield className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-4 h-4 text-amber-400" />
              )}
              <h4 className="text-sm font-semibold text-white">
                {isAuthenticated
                  ? 'Admin Control: Manage, Post & Update Projects'
                  : 'Project Management & Publishing Controls'}
              </h4>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isAuthenticated
                ? 'You are logged in as admin. You have full access to create new case studies, update live projects, or delete posts.'
                : 'Only the authenticated administrator can post new projects, update existing entries, or delete records.'}
            </p>
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdminDashboardOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Project</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Admin Login to Post / Edit</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
