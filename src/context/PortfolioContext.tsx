import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PortfolioState,
  Project,
  ThemeStyle,
  ProfileData,
  SkillCategory,
  ExperienceItem,
  Testimonial,
  ServiceItem,
  EducationItem,
  CertificationItem,
  BlogPost,
  SectionConfig,
  SiteSettings,
} from '../types/portfolio';
import { DEFAULT_PORTFOLIO } from '../data/defaultPortfolio';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface PortfolioContextType {
  portfolio: PortfolioState;
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  activePost: BlogPost | null;
  setActivePost: (p: BlogPost | null) => void;
  isStudioOpen: boolean;
  setIsStudioOpen: (open: boolean) => void;
  isResumeOpen: boolean;
  setIsResumeOpen: (open: boolean) => void;
  previewTheme: ThemeStyle | null;
  setPreviewTheme: (theme: ThemeStyle | null) => void;
  effectiveTheme: ThemeStyle;

  // Profile & Theme
  updateProfile: (profile: Partial<ProfileData>) => Promise<void>;
  updateTheme: (theme: ThemeStyle) => Promise<void>;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;

  // Projects CRUD & Reorder
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (projects: Project[]) => Promise<void>;

  // Skills
  updateSkills: (skills: SkillCategory[]) => Promise<void>;

  // Services CRUD & Reorder
  addService: (service: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: string, updates: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  reorderServices: (services: ServiceItem[]) => Promise<void>;

  // Experience CRUD & Reorder
  updateExperience: (experience: ExperienceItem[]) => Promise<void>;
  addExperience: (exp: Omit<ExperienceItem, 'id'>) => Promise<void>;
  updateExperienceItem: (id: string, updates: Partial<ExperienceItem>) => Promise<void>;
  deleteExperienceItem: (id: string) => Promise<void>;

  // Education CRUD & Reorder
  addEducation: (edu: Omit<EducationItem, 'id'>) => Promise<void>;
  updateEducation: (id: string, updates: Partial<EducationItem>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  reorderEducation: (education: EducationItem[]) => Promise<void>;

  // Certifications CRUD & Reorder
  addCertification: (cert: Omit<CertificationItem, 'id'>) => Promise<void>;
  updateCertification: (id: string, updates: Partial<CertificationItem>) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;
  reorderCertifications: (certs: CertificationItem[]) => Promise<void>;

  // Testimonials CRUD & Reorder
  updateTestimonials: (testimonials: Testimonial[]) => Promise<void>;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Blog Posts CRUD & Reorder
  addPost: (post: Omit<BlogPost, 'id'>) => Promise<void>;
  updatePost: (id: string, updates: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  reorderPosts: (posts: BlogPost[]) => Promise<void>;

  // Sections ordering & visibility
  toggleSection: (id: SectionConfig['id']) => Promise<void>;
  reorderSections: (sections: SectionConfig[]) => Promise<void>;

  // Import / Export / Defaults
  resetToDefaults: () => Promise<void>;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;

  // Contact messages
  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => Promise<boolean>;
  markMessageRead: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  clearMessages: () => Promise<void>;
  refreshBackendData: () => Promise<void>;
}

const STORAGE_KEY = 'emon_islam_portfolio_state_v2';
const MESSAGES_KEY = 'emon_islam_portfolio_messages_v2';
const TOKEN_KEY = 'emon_portfolio_admin_token';

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PORTFOLIO,
          ...parsed,
          services: parsed.services || DEFAULT_PORTFOLIO.services,
          education: parsed.education || DEFAULT_PORTFOLIO.education,
          certifications: parsed.certifications || DEFAULT_PORTFOLIO.certifications,
          posts: parsed.posts || DEFAULT_PORTFOLIO.posts,
          sections: parsed.sections || DEFAULT_PORTFOLIO.sections,
          settings: parsed.settings || DEFAULT_PORTFOLIO.settings,
        };
      }
    } catch (e) {
      console.error('Failed to load local portfolio state', e);
    }
    return DEFAULT_PORTFOLIO;
  });

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<ThemeStyle | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const effectiveTheme: ThemeStyle = previewTheme || portfolio.theme;

  // Function to sync state with backend
  const syncWithBackend = async (newState: PortfolioState) => {
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newState),
      });
    } catch (e) {
      console.warn('Backend sync failed, state preserved locally:', e);
    }
  };

  // Fetch initial portfolio from backend
  const refreshBackendData = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        if (data && data.profile) {
          const merged: PortfolioState = {
            ...DEFAULT_PORTFOLIO,
            ...data,
            services: data.services || DEFAULT_PORTFOLIO.services,
            education: data.education || DEFAULT_PORTFOLIO.education,
            certifications: data.certifications || DEFAULT_PORTFOLIO.certifications,
            posts: data.posts || DEFAULT_PORTFOLIO.posts,
            sections: data.sections || DEFAULT_PORTFOLIO.sections,
            settings: data.settings || DEFAULT_PORTFOLIO.settings,
          };
          setPortfolio(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      }
    } catch (e) {
      console.warn('Could not fetch portfolio from /api/portfolio, using cached version.');
    }

    // Also fetch messages if admin token is present
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const msgRes = await fetch('/api/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (msgRes.ok) {
          const msgList = await msgRes.json();
          setMessages(msgList);
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgList));
        }
      } catch (e) {
        console.warn('Could not fetch messages from backend:', e);
      }
    }
  }, []);

  useEffect(() => {
    refreshBackendData();

    // Register visit
    try {
      fetch('/api/stats/visit', { method: 'POST' }).catch(() => {});
    } catch (e) {}
  }, [refreshBackendData]);

  // Persist locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    } catch (e) {
      console.error('Failed to save portfolio state locally', e);
    }
  }, [portfolio]);

  // Profile & Theme & Settings
  const updateProfile = async (profileUpdates: Partial<ProfileData>) => {
    const updated = {
      ...portfolio,
      profile: {
        ...portfolio.profile,
        ...profileUpdates,
      },
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updateTheme = async (theme: ThemeStyle) => {
    setPreviewTheme(null);
    const updated = { ...portfolio, theme };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updateSettings = async (settingsUpdates: Partial<SiteSettings>) => {
    const updated = {
      ...portfolio,
      settings: {
        ...(portfolio.settings || DEFAULT_PORTFOLIO.settings),
        ...settingsUpdates,
      },
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Projects CRUD
  const addProject = async (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      published: projectData.published !== undefined ? projectData.published : true,
      order: portfolio.projects.length + 1,
    };
    const updated = {
      ...portfolio,
      projects: [newProject, ...portfolio.projects],
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const updated = {
      ...portfolio,
      projects: portfolio.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const deleteProject = async (id: string) => {
    const updated = {
      ...portfolio,
      projects: portfolio.projects.filter((p) => p.id !== id),
    };
    setPortfolio(updated);
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
    await syncWithBackend(updated);
  };

  const reorderProjects = async (projects: Project[]) => {
    const updated = { ...portfolio, projects };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Skills
  const updateSkills = async (skills: SkillCategory[]) => {
    const updated = { ...portfolio, skills };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Services CRUD
  const addService = async (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order: (portfolio.services || []).length + 1,
      published: serviceData.published !== undefined ? serviceData.published : true,
    };
    const updated = {
      ...portfolio,
      services: [...(portfolio.services || []), newService],
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updateService = async (id: string, updates: Partial<ServiceItem>) => {
    const updated = {
      ...portfolio,
      services: (portfolio.services || []).map((s) => (s.id === id ? { ...s, ...updates } : s)),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const deleteService = async (id: string) => {
    const updated = {
      ...portfolio,
      services: (portfolio.services || []).filter((s) => s.id !== id),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const reorderServices = async (services: ServiceItem[]) => {
    const updated = { ...portfolio, services };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Experience CRUD
  const updateExperience = async (experience: ExperienceItem[]) => {
    const updated = { ...portfolio, experience };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const addExperience = async (expData: Omit<ExperienceItem, 'id'>) => {
    const newExp: ExperienceItem = {
      ...expData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      published: expData.published !== undefined ? expData.published : true,
      order: (portfolio.experience || []).length + 1,
    };
    const updated = {
      ...portfolio,
      experience: [newExp, ...(portfolio.experience || [])],
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updateExperienceItem = async (id: string, updates: Partial<ExperienceItem>) => {
    const updated = {
      ...portfolio,
      experience: (portfolio.experience || []).map((e) => (e.id === id ? { ...e, ...updates } : e)),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const deleteExperienceItem = async (id: string) => {
    const updated = {
      ...portfolio,
      experience: (portfolio.experience || []).filter((e) => e.id !== id),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Education CRUD
  const addEducation = async (eduData: Omit<EducationItem, 'id'>) => {
    const newEdu: EducationItem = {
      ...eduData,
      id: `edu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order: (portfolio.education || []).length + 1,
      published: eduData.published !== undefined ? eduData.published : true,
    };
    const updated = {
      ...portfolio,
      education: [...(portfolio.education || []), newEdu],
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updateEducation = async (id: string, updates: Partial<EducationItem>) => {
    const updated = {
      ...portfolio,
      education: (portfolio.education || []).map((e) => (e.id === id ? { ...e, ...updates } : e)),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const deleteEducation = async (id: string) => {
    const updated = {
      ...portfolio,
      education: (portfolio.education || []).filter((e) => e.id !== id),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const reorderEducation = async (education: EducationItem[]) => {
    const updated = { ...portfolio, education };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Certifications CRUD
  const addCertification = async (certData: Omit<CertificationItem, 'id'>) => {
    const newCert: CertificationItem = {
      ...certData,
      id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order: (portfolio.certifications || []).length + 1,
      published: certData.published !== undefined ? certData.published : true,
    };
    const updated = {
      ...portfolio,
      certifications: [...(portfolio.certifications || []), newCert],
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updateCertification = async (id: string, updates: Partial<CertificationItem>) => {
    const updated = {
      ...portfolio,
      certifications: (portfolio.certifications || []).map((c) => (c.id === id ? { ...c, ...updates } : c)),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const deleteCertification = async (id: string) => {
    const updated = {
      ...portfolio,
      certifications: (portfolio.certifications || []).filter((c) => c.id !== id),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const reorderCertifications = async (certifications: CertificationItem[]) => {
    const updated = { ...portfolio, certifications };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Testimonials CRUD
  const updateTestimonials = async (testimonials: Testimonial[]) => {
    const updated = { ...portfolio, testimonials };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const addTestimonial = async (testimonialData: Omit<Testimonial, 'id'>) => {
    const newTestimonial: Testimonial = {
      ...testimonialData,
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      order: (portfolio.testimonials || []).length + 1,
      published: testimonialData.published !== undefined ? testimonialData.published : true,
    };
    const updated = {
      ...portfolio,
      testimonials: [...(portfolio.testimonials || []), newTestimonial],
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    const updated = {
      ...portfolio,
      testimonials: (portfolio.testimonials || []).map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const deleteTestimonial = async (id: string) => {
    const updated = {
      ...portfolio,
      testimonials: (portfolio.testimonials || []).filter((t) => t.id !== id),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Blog Posts CRUD
  const addPost = async (postData: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      order: (portfolio.posts || []).length + 1,
      published: postData.published !== undefined ? postData.published : true,
    };
    const updated = {
      ...portfolio,
      posts: [newPost, ...(portfolio.posts || [])],
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    const updated = {
      ...portfolio,
      posts: (portfolio.posts || []).map((p) => (p.id === id ? { ...p, ...updates } : p)),
    };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const deletePost = async (id: string) => {
    const updated = {
      ...portfolio,
      posts: (portfolio.posts || []).filter((p) => p.id !== id),
    };
    setPortfolio(updated);
    if (activePost?.id === id) {
      setActivePost(null);
    }
    await syncWithBackend(updated);
  };

  const reorderPosts = async (posts: BlogPost[]) => {
    const updated = { ...portfolio, posts };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  // Sections
  const toggleSection = async (id: SectionConfig['id']) => {
    const updatedSections = (portfolio.sections || DEFAULT_PORTFOLIO.sections).map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    const updated = { ...portfolio, sections: updatedSections };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const reorderSections = async (sections: SectionConfig[]) => {
    const updated = { ...portfolio, sections };
    setPortfolio(updated);
    await syncWithBackend(updated);
  };

  const resetToDefaults = async () => {
    setPortfolio(DEFAULT_PORTFOLIO);
    localStorage.removeItem(STORAGE_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await fetch('/api/portfolio/reset', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.warn('Backend reset failed', e);
      }
    }
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolio, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${portfolio.profile.name.toLowerCase().replace(/\s+/g, '_')}_portfolio.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile && parsed.projects) {
        const validated: PortfolioState = {
          ...DEFAULT_PORTFOLIO,
          ...parsed,
          services: parsed.services || DEFAULT_PORTFOLIO.services,
          education: parsed.education || DEFAULT_PORTFOLIO.education,
          certifications: parsed.certifications || DEFAULT_PORTFOLIO.certifications,
          posts: parsed.posts || DEFAULT_PORTFOLIO.posts,
          sections: parsed.sections || DEFAULT_PORTFOLIO.sections,
          settings: parsed.settings || DEFAULT_PORTFOLIO.settings,
        };
        setPortfolio(validated);
        syncWithBackend(validated);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON', e);
    }
    return false;
  };

  // Contact form submission to /api/messages
  const addMessage = async (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [data.message, ...prev]);
        return true;
      }
    } catch (e) {
      console.warn('Could not reach backend /api/messages, saving locally:', e);
    }

    // Local fallback
    const fallbackMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [fallbackMsg, ...prev]);
    return true;
  };

  const markMessageRead = async (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await fetch(`/api/messages/${id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {}
    }
  };

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await fetch(`/api/messages/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {}
    }
  };

  const clearMessages = async () => {
    setMessages([]);
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        activeProject,
        setActiveProject,
        activePost,
        setActivePost,
        isStudioOpen,
        setIsStudioOpen,
        isResumeOpen,
        setIsResumeOpen,
        previewTheme,
        setPreviewTheme,
        effectiveTheme,
        updateProfile,
        updateTheme,
        updateSettings,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        updateSkills,
        addService,
        updateService,
        deleteService,
        reorderServices,
        updateExperience,
        addExperience,
        updateExperienceItem,
        deleteExperienceItem,
        addEducation,
        updateEducation,
        deleteEducation,
        reorderEducation,
        addCertification,
        updateCertification,
        deleteCertification,
        reorderCertifications,
        updateTestimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addPost,
        updatePost,
        deletePost,
        reorderPosts,
        toggleSection,
        reorderSections,
        resetToDefaults,
        exportJSON,
        importJSON,
        messages,
        addMessage,
        markMessageRead,
        deleteMessage,
        clearMessages,
        refreshBackendData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
