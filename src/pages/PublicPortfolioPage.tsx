import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { THEMES } from '../data/themes';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { SkillsSection } from '../components/SkillsSection';
import { ProjectSection } from '../components/ProjectSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { EducationSection } from '../components/EducationSection';
import { CertificationsSection } from '../components/CertificationsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { BlogSection } from '../components/BlogSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import { ProjectModal } from '../components/ProjectModal';
import { ResumeModal } from '../components/ResumeModal';
import { Save, X, Sparkles } from 'lucide-react';

export const PublicPortfolioPage: React.FC = () => {
  const {
    portfolio,
    activeProject,
    setActiveProject,
    isResumeOpen,
    setIsResumeOpen,
    effectiveTheme,
    previewTheme,
    setPreviewTheme,
    updateTheme,
  } = usePortfolio();

  const themeConfig = THEMES[effectiveTheme] || THEMES.obsidian;
  const isPreviewing = !!previewTheme;

  // Render components according to section visibility and ordering
  const sectionsConfig = [...(portfolio.sections || [])].sort((a, b) => a.order - b.order);

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero':
        return <HeroSection key="hero" />;
      case 'about':
        return <AboutSection key="about" />;
      case 'skills':
        return <SkillsSection key="skills" />;
      case 'services':
        return <ServicesSection key="services" />;
      case 'projects':
        return <ProjectSection key="projects" />;
      case 'experience':
        return <ExperienceSection key="experience" />;
      case 'education':
        return <EducationSection key="education" />;
      case 'certifications':
        return <CertificationsSection key="certifications" />;
      case 'testimonials':
        return <TestimonialsSection key="testimonials" />;
      case 'blog':
        return <BlogSection key="blog" />;
      case 'contact':
        return <ContactSection key="contact" />;
      default:
        return null;
    }
  };

  return (
    <div
      data-theme={effectiveTheme}
      className={`min-h-screen ${themeConfig.classes.appBg} ${themeConfig.classes.appText} ${themeConfig.classes.selection} transition-colors duration-300 font-sans relative`}
      style={{
        backgroundColor: themeConfig.swatches.canvas,
        color: themeConfig.swatches.text,
      }}
    >
      {/* Live Preview Persistent Banner when active */}
      {isPreviewing && (
        <aside
          aria-label="Theme live preview banner"
          className="sticky top-0 z-50 bg-amber-500 text-neutral-950 px-4 py-2 shadow-lg flex items-center justify-between gap-4 text-xs font-medium animate-in slide-in-from-top duration-200"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-neutral-950" />
            <span>
              <strong>Live Theme Preview:</strong> Showing <em>{themeConfig.name}</em> across components. (Unsaved)
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => updateTheme(previewTheme)}
              className="px-2.5 py-1 rounded bg-neutral-950 text-white font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3 h-3" />
              <span>Save Scheme</span>
            </button>
            <button
              onClick={() => setPreviewTheme(null)}
              className="p-1 rounded hover:bg-amber-600 transition-colors text-neutral-950 cursor-pointer"
              title="Exit preview without saving"
              aria-label="Exit preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      <Navbar />

      <main>
        {sectionsConfig.map((sec) => {
          if (sec.enabled === false) return null;
          return renderSection(sec.id);
        })}
      </main>

      <Footer />

      {/* Case Study Deep Dive Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />

      {/* Resume View & PDF Export Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
};
