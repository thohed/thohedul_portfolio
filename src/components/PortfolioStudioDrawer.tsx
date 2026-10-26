import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { ThemeStyle, Project, SkillCategory, SkillItem, Testimonial } from '../types/portfolio';
import { THEMES } from '../data/themes';
import { ThemeLivePreview } from './ThemeLivePreview';
import {
  X,
  User,
  FolderGit2,
  Cpu,
  Palette,
  Inbox,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Save,
  ExternalLink,
  Code2,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Lock,
  Key,
  ShieldCheck,
  AlertCircle,
  Shield,
  ArrowRight,
  Pencil,
  CheckCircle2,
  Quote,
} from 'lucide-react';

export const PortfolioStudioDrawer: React.FC = () => {
  const {
    portfolio,
    isStudioOpen,
    setIsStudioOpen,
    updateProfile,
    updateTheme,
    previewTheme,
    setPreviewTheme,
    addProject,
    deleteProject,
    updateSkills,
    updateTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    resetToDefaults,
    exportJSON,
    importJSON,
    messages,
    markMessageRead,
    clearMessages,
  } = usePortfolio();

  const { isAuthenticated, login, error: authError, logout } = useAuth();
  const [inlineUsername, setInlineUsername] = useState('admin');
  const [inlinePassword, setInlinePassword] = useState('123456');
  const [inlineLoading, setInlineLoading] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'testimonials' | 'theme' | 'inbox' | 'data'>('profile');
  const [profileForm, setProfileForm] = useState(portfolio.profile);
  const [selectedThemeForPreview, setSelectedThemeForPreview] = useState<ThemeStyle>(() => portfolio.theme);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineLoading(true);
    setInlineError(null);
    const success = await login(inlineUsername, inlinePassword);
    if (!success) {
      setInlineError('Invalid administrator credentials.');
    }
    setInlineLoading(false);
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setAvatarError('Image is larger than 8MB. Please choose a smaller file.');
      return;
    }

    setAvatarError(null);
    setUploadingAvatar(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const token = localStorage.getItem('emon_portfolio_admin_token');

      try {
        const res = await fetch('/api/upload-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ dataUrl }),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.url) {
            setProfileForm((prev) => ({ ...prev, avatarUrl: result.url }));
            setUploadingAvatar(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Server upload error, falling back to direct dataUrl:', err);
      }

      setProfileForm((prev) => ({ ...prev, avatarUrl: dataUrl }));
      setUploadingAvatar(false);
    };

    reader.onerror = () => {
      setAvatarError('Failed to read image file.');
      setUploadingAvatar(false);
    };

    reader.readAsDataURL(file);
  };

  // New Project Form State
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    tagline: '',
    category: 'fullstack' as 'fullstack' | 'ai' | 'cloud' | 'frontend',
    featured: false,
    image: '/src/assets/images/project_nexus_cloud_1792818814330.jpg',
    date: '2026',
    liveUrl: '',
    githubUrl: '',
    impactMetric: '',
    challenge: '',
    solution: '',
    techStack: 'React, TypeScript, Tailwind CSS, Node.js',
    keyFeatures: 'High throughput pipeline, Automated observability',
  });

  if (!isStudioOpen) return null;

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;

    addProject({
      title: newProject.title,
      tagline: newProject.tagline || 'Engineered scalable solution.',
      category: newProject.category,
      featured: newProject.featured,
      image: newProject.image,
      date: newProject.date,
      liveUrl: newProject.liveUrl || undefined,
      githubUrl: newProject.githubUrl || undefined,
      impactMetric: newProject.impactMetric || 'Production Grade',
      challenge: newProject.challenge || 'High concurrency latency under distributed load.',
      solution: newProject.solution || 'Modular architecture with optimized client caching.',
      techStack: newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      keyFeatures: newProject.keyFeatures.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setIsAddingProject(false);
    setNewProject({
      title: '',
      tagline: '',
      category: 'fullstack',
      featured: false,
      image: '/src/assets/images/project_nexus_cloud_1792818814330.jpg',
      date: '2026',
      liveUrl: '',
      githubUrl: '',
      impactMetric: '',
      challenge: '',
      solution: '',
      techStack: 'React, TypeScript, Tailwind CSS, Node.js',
      keyFeatures: 'High throughput pipeline, Automated observability',
    });
  };

  const handleImportSubmit = () => {
    if (!importText) return;
    const ok = importJSON(importText);
    if (ok) {
      setImportStatus('Successfully imported portfolio data!');
      setImportText('');
    } else {
      setImportStatus('Failed to parse JSON. Please check format.');
    }
    setTimeout(() => setImportStatus(null), 3000);
  };

  // Skills state in Drawer
  const [editingDrawerSkillLoc, setEditingDrawerSkillLoc] = useState<{ catIdx: number; skillIdx: number } | null>(null);
  const [editingDrawerSkillForm, setEditingDrawerSkillForm] = useState<SkillItem>({
    name: '',
    level: 85,
    years: 3,
    highlight: '',
  });
  const [addingDrawerSkillToCatIdx, setAddingDrawerSkillToCatIdx] = useState<number | null>(null);
  const [newDrawerSkillForm, setNewDrawerSkillForm] = useState<SkillItem>({
    name: '',
    level: 80,
    years: 2,
    highlight: '',
  });
  const [isAddingDrawerCat, setIsAddingDrawerCat] = useState(false);
  const [newDrawerCatForm, setNewDrawerCatForm] = useState<{ category: string; description: string }>({
    category: '',
    description: '',
  });
  const [skillsDrawerFeedback, setSkillsDrawerFeedback] = useState<string | null>(null);

  const handleDrawerDeleteSkill = async (catIdx: number, skillIdx: number) => {
    const updated = portfolio.skills.map((c, i) => {
      if (i !== catIdx) return c;
      return {
        ...c,
        skills: c.skills.filter((_, si) => si !== skillIdx),
      };
    });
    await updateSkills(updated);
    setSkillsDrawerFeedback('Skill deleted.');
    setTimeout(() => setSkillsDrawerFeedback(null), 2000);
  };

  const handleDrawerSaveSkillEdit = async () => {
    if (!editingDrawerSkillLoc || !editingDrawerSkillForm.name.trim()) return;
    const { catIdx, skillIdx } = editingDrawerSkillLoc;
    const updated = portfolio.skills.map((c, i) => {
      if (i !== catIdx) return c;
      return {
        ...c,
        skills: c.skills.map((s, si) => (si === skillIdx ? editingDrawerSkillForm : s)),
      };
    });
    await updateSkills(updated);
    setEditingDrawerSkillLoc(null);
    setSkillsDrawerFeedback('Skill updated.');
    setTimeout(() => setSkillsDrawerFeedback(null), 2000);
  };

  const handleDrawerAddSkill = async (catIdx: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrawerSkillForm.name.trim()) return;
    const updated = portfolio.skills.map((c, i) => {
      if (i !== catIdx) return c;
      return {
        ...c,
        skills: [
          ...c.skills,
          {
            name: newDrawerSkillForm.name.trim(),
            level: Number(newDrawerSkillForm.level) || 50,
            years: Number(newDrawerSkillForm.years) || 1,
            highlight: newDrawerSkillForm.highlight?.trim() || '',
          },
        ],
      };
    });
    await updateSkills(updated);
    setAddingDrawerSkillToCatIdx(null);
    setNewDrawerSkillForm({ name: '', level: 80, years: 2, highlight: '' });
    setSkillsDrawerFeedback('Skill added.');
    setTimeout(() => setSkillsDrawerFeedback(null), 2000);
  };

  const handleDrawerAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrawerCatForm.category.trim()) return;
    const newCat: SkillCategory = {
      category: newDrawerCatForm.category.trim(),
      description: newDrawerCatForm.description.trim(),
      skills: [],
    };
    await updateSkills([...portfolio.skills, newCat]);
    setIsAddingDrawerCat(false);
    setNewDrawerCatForm({ category: '', description: '' });
    setSkillsDrawerFeedback('Category added.');
    setTimeout(() => setSkillsDrawerFeedback(null), 2000);
  };

  const handleDrawerDeleteCategory = async (catIdx: number) => {
    const updated = portfolio.skills.filter((_, i) => i !== catIdx);
    await updateSkills(updated);
    setSkillsDrawerFeedback('Category deleted.');
    setTimeout(() => setSkillsDrawerFeedback(null), 2000);
  };

  // Drawer Testimonials state & handlers
  const [isAddingDrawerTestimonial, setIsAddingDrawerTestimonial] = useState(false);
  const [newDrawerTestimonialForm, setNewDrawerTestimonialForm] = useState<Omit<Testimonial, 'id'>>({
    author: '',
    role: '',
    company: '',
    quote: '',
    relation: '',
  });
  const [editingDrawerTestimonialId, setEditingDrawerTestimonialId] = useState<string | null>(null);
  const [editingDrawerTestimonialForm, setEditingDrawerTestimonialForm] = useState<Partial<Testimonial>>({});
  const [testimonialDrawerFeedback, setTestimonialDrawerFeedback] = useState<string | null>(null);

  const handleDrawerAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrawerTestimonialForm.author.trim() || !newDrawerTestimonialForm.quote.trim()) return;
    await addTestimonial({
      author: newDrawerTestimonialForm.author.trim(),
      role: newDrawerTestimonialForm.role.trim() || 'Engineering Collaborator',
      company: newDrawerTestimonialForm.company.trim() || 'Partner',
      quote: newDrawerTestimonialForm.quote.trim(),
      relation: newDrawerTestimonialForm.relation.trim() || 'Engineering collaborator',
    });
    setIsAddingDrawerTestimonial(false);
    setNewDrawerTestimonialForm({ author: '', role: '', company: '', quote: '', relation: '' });
    setTestimonialDrawerFeedback('Endorsement created.');
    setTimeout(() => setTestimonialDrawerFeedback(null), 2500);
  };

  const handleDrawerSaveTestimonialEdit = async (id: string) => {
    if (!editingDrawerTestimonialForm.author?.trim() || !editingDrawerTestimonialForm.quote?.trim()) return;
    await updateTestimonial(id, {
      author: editingDrawerTestimonialForm.author.trim(),
      role: editingDrawerTestimonialForm.role?.trim() || '',
      company: editingDrawerTestimonialForm.company?.trim() || '',
      quote: editingDrawerTestimonialForm.quote.trim(),
      relation: editingDrawerTestimonialForm.relation?.trim() || '',
    });
    setEditingDrawerTestimonialId(null);
    setTestimonialDrawerFeedback('Endorsement updated.');
    setTimeout(() => setTestimonialDrawerFeedback(null), 2500);
  };

  const handleDrawerDeleteTestimonial = async (id: string) => {
    if (window.confirm('Delete this endorsement?')) {
      await deleteTestimonial(id);
      if (editingDrawerTestimonialId === id) setEditingDrawerTestimonialId(null);
      setTestimonialDrawerFeedback('Endorsement deleted.');
      setTimeout(() => setTestimonialDrawerFeedback(null), 2500);
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsStudioOpen(false)} aria-label="Dismiss studio backdrop" />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xl h-full bg-neutral-900 border-l border-neutral-800 shadow-2xl z-10 flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-display text-lg">Portfolio Studio</span>
            {isAuthenticated ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>Admin Logged In</span>
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Login Required</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={logout}
                className="px-2.5 py-1 text-xs text-neutral-400 hover:text-red-400 bg-neutral-950 border border-neutral-800 rounded transition-colors cursor-pointer"
                title="Sign out of administrator session"
              >
                Log Out
              </button>
            )}
            <button
              onClick={() => setIsStudioOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          /* GUEST / LOCKED STATE: Admin Authentication Required */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-amber-400 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-bold text-white font-display">
                Administrator Login Required
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Only the authorized administrator can post new projects, update existing content, modify photos, or delete records. Other users cannot make changes without logging in.
              </p>
            </div>

            {/* Credential Helper */}
            <div className="w-full max-w-sm p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-left space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Credentials:</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInlineUsername('admin');
                    setInlinePassword('123456');
                  }}
                  className="text-[11px] font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  Auto Fill
                </button>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                User: <strong className="text-white">admin</strong> · Pass: <strong className="text-white">123456</strong>
              </div>
            </div>

            {/* Inline Login Form */}
            <form onSubmit={handleInlineLogin} className="w-full max-w-sm space-y-3 text-left">
              {inlineError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/60 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{inlineError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={inlineUsername}
                    onChange={(e) => setInlineUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={inlinePassword}
                    onChange={(e) => setInlinePassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={inlineLoading}
                className="w-full mt-2 py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{inlineLoading ? 'Verifying...' : 'Sign In as Admin to Edit'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => setIsStudioOpen(false)}
              className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Continue Browsing as Guest
            </button>
          </div>
        ) : (
          <>
            {/* Studio Sub-Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 py-2.5 border-b border-neutral-800 bg-neutral-950/60 overflow-x-auto text-xs font-medium">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  activeTab === 'profile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  activeTab === 'projects' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({portfolio.projects.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  activeTab === 'skills' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Skills ({portfolio.skills.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  activeTab === 'testimonials' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Endorsements ({(portfolio.testimonials || []).length})</span>
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  activeTab === 'theme' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Themes</span>
              </button>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  activeTab === 'inbox' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Inbox</span>
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
                  activeTab === 'data' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Data / Export</span>
              </button>
            </div>
          </>
        )}

        {/* Tab Contents */}
        {isAuthenticated && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="text-xs text-neutral-400 mb-2">
                Update your personal name, profile picture, headline, contact email, and active availability status.
              </div>

              {/* Profile Picture Upload & Customizer */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Camera className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Profile Picture</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Square 1:1</span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 shrink-0 shadow-sm">
                    <img
                      src={profileForm.avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-neutral-950/80 flex items-center justify-center text-[9px] text-white font-mono">
                        ...
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarFileSelect}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          setProfileForm({
                            ...profileForm,
                            avatarUrl: '/src/assets/images/portfolio_hero_portrait_1792818813307.jpg',
                          })
                        }
                        className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
                      >
                        Reset Default
                      </button>
                    </div>

                    <div className="relative">
                      <ImageIcon className="w-3 h-3 text-neutral-500 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                        placeholder="Image URL or local file path"
                        className="w-full pl-7 pr-2.5 py-1.5 text-[11px] rounded bg-neutral-900 border border-neutral-800 text-white font-mono"
                      />
                    </div>

                    {avatarError && (
                      <div className="text-[11px] text-red-400">{avatarError}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Professional Title</label>
                <input
                  type="text"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Headline / Tagline</label>
                <textarea
                  rows={2}
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Bio Narrative</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-300">Availability Note</label>
                <input
                  type="text"
                  value={profileForm.status}
                  onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setProfileForm(portfolio.profile)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{saveSuccess ? 'Changes Applied!' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  {portfolio.projects.length} Projects in Showcase
                </span>
                <button
                  onClick={() => setIsAddingProject(!isAddingProject)}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingProject ? 'Cancel' : 'Add Project'}</span>
                </button>
              </div>

              {/* Add Project Form */}
              {isAddingProject && (
                <form
                  onSubmit={handleCreateProject}
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3"
                >
                  <div className="text-xs font-semibold text-white">Create New Project Entry</div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300">Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex High-Frequency Ingress"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-300">Category</label>
                      <select
                        value={newProject.category}
                        onChange={(e) =>
                          setNewProject({ ...newProject, category: e.target.value as any })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-700 text-white"
                      >
                        <option value="cloud">Cloud & Systems</option>
                        <option value="ai">AI & Workflows</option>
                        <option value="frontend">Frontend & Commerce</option>
                        <option value="fullstack">Full Stack & Wasm</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-neutral-300">Impact Metric</label>
                      <input
                        type="text"
                        placeholder="e.g. -45% Memory Usage"
                        value={newProject.impactMetric}
                        onChange={(e) => setNewProject({ ...newProject, impactMetric: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-700 text-white"
                      >
                      </input>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300">Tagline / Brief</label>
                    <input
                      type="text"
                      placeholder="e.g. Real-time distributed stream manager"
                      value={newProject.tagline}
                      onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-300">Technologies (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Go, TypeScript, Kubernetes, Tailwind CSS"
                      value={newProject.techStack}
                      onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-300">Live URL (optional)</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-300">GitHub URL (optional)</label>
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-700 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded transition-colors cursor-pointer"
                  >
                    Publish to Portfolio
                  </button>
                </form>
              )}

              {/* Existing Projects List */}
              <div className="space-y-3">
                {portfolio.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-white truncate">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        {proj.category} · {proj.impactMetric}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS TAB IN DRAWER */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Skills Matrix & Proficiencies</div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Add new skills, adjust levels, edit highlights, or delete items.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingDrawerCat(!isAddingDrawerCat)}
                  className="px-2.5 py-1 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingDrawerCat ? 'Cancel' : 'New Category'}</span>
                </button>
              </div>

              {skillsDrawerFeedback && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{skillsDrawerFeedback}</span>
                </div>
              )}

              {/* Add category form */}
              {isAddingDrawerCat && (
                <form
                  onSubmit={handleDrawerAddCategory}
                  className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-700 space-y-2.5"
                >
                  <div className="text-xs font-semibold text-white">Add Skill Category</div>
                  <input
                    type="text"
                    required
                    placeholder="Category title (e.g. Cloud & DevOps)"
                    value={newDrawerCatForm.category}
                    onChange={(e) =>
                      setNewDrawerCatForm({ ...newDrawerCatForm, category: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Brief description"
                    value={newDrawerCatForm.description}
                    onChange={(e) =>
                      setNewDrawerCatForm({ ...newDrawerCatForm, description: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingDrawerCat(false)}
                      className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold text-neutral-950 bg-white rounded"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              )}

              {/* Categories & skills */}
              <div className="space-y-4">
                {portfolio.skills.map((cat, catIdx) => {
                  const isAddingSkill = addingDrawerSkillToCatIdx === catIdx;

                  return (
                    <div
                      key={catIdx}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                        <div>
                          <div className="font-semibold text-xs text-white flex items-center gap-2">
                            <span>{cat.category}</span>
                            <span className="text-[10px] font-mono text-neutral-500">
                              ({cat.skills.length})
                            </span>
                          </div>
                          {cat.description && (
                            <div className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
                              {cat.description}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setAddingDrawerSkillToCatIdx(isAddingSkill ? null : catIdx)
                            }
                            className="px-2 py-0.5 text-[11px] font-medium bg-neutral-850 hover:bg-neutral-800 text-neutral-200 rounded border border-neutral-750 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isAddingSkill ? 'Cancel' : 'Add'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete "${cat.category}" category?`)) {
                                handleDrawerDeleteCategory(catIdx);
                              }
                            }}
                            className="p-1 text-neutral-500 hover:text-red-400 rounded"
                            title="Delete category"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Add skill form */}
                      {isAddingSkill && (
                        <form
                          onSubmit={(e) => handleDrawerAddSkill(catIdx, e)}
                          className="p-3 rounded-lg bg-neutral-900 border border-neutral-700 space-y-2 text-xs"
                        >
                          <div className="text-[11px] font-semibold text-white">
                            New Skill in {cat.category}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Skill name"
                              value={newDrawerSkillForm.name}
                              onChange={(e) =>
                                setNewDrawerSkillForm({ ...newDrawerSkillForm, name: e.target.value })
                              }
                              className="px-2.5 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max="100"
                                placeholder="Level %"
                                value={newDrawerSkillForm.level}
                                onChange={(e) =>
                                  setNewDrawerSkillForm({
                                    ...newDrawerSkillForm,
                                    level: Number(e.target.value),
                                  })
                                }
                                className="w-16 px-2 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                              />
                              <input
                                type="number"
                                min="0"
                                max="30"
                                placeholder="Yrs"
                                value={newDrawerSkillForm.years}
                                onChange={(e) =>
                                  setNewDrawerSkillForm({
                                    ...newDrawerSkillForm,
                                    years: Number(e.target.value),
                                  })
                                }
                                className="w-14 px-2 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Highlight / subtitle (optional)"
                            value={newDrawerSkillForm.highlight || ''}
                            onChange={(e) =>
                              setNewDrawerSkillForm({
                                ...newDrawerSkillForm,
                                highlight: e.target.value,
                              })
                            }
                            className="w-full px-2.5 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                          />
                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setAddingDrawerSkillToCatIdx(null)}
                              className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-0.5 text-xs font-semibold text-neutral-950 bg-white rounded"
                            >
                              Add
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Skills in category */}
                      <div className="space-y-1.5">
                        {cat.skills.map((s, sIdx) => {
                          const isEditing =
                            editingDrawerSkillLoc?.catIdx === catIdx &&
                            editingDrawerSkillLoc?.skillIdx === sIdx;

                          if (isEditing) {
                            return (
                              <div
                                key={sIdx}
                                className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 space-y-2 text-xs"
                              >
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={editingDrawerSkillForm.name}
                                    onChange={(e) =>
                                      setEditingDrawerSkillForm({
                                        ...editingDrawerSkillForm,
                                        name: e.target.value,
                                      })
                                    }
                                    className="px-2 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                                  />
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min="1"
                                      max="100"
                                      value={editingDrawerSkillForm.level}
                                      onChange={(e) =>
                                        setEditingDrawerSkillForm({
                                          ...editingDrawerSkillForm,
                                          level: Number(e.target.value),
                                        })
                                      }
                                      className="w-14 px-1.5 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                                    />
                                    <input
                                      type="number"
                                      min="0"
                                      max="30"
                                      value={editingDrawerSkillForm.years}
                                      onChange={(e) =>
                                        setEditingDrawerSkillForm({
                                          ...editingDrawerSkillForm,
                                          years: Number(e.target.value),
                                        })
                                      }
                                      className="w-12 px-1.5 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                                    />
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  value={editingDrawerSkillForm.highlight || ''}
                                  onChange={(e) =>
                                    setEditingDrawerSkillForm({
                                      ...editingDrawerSkillForm,
                                      highlight: e.target.value,
                                    })
                                  }
                                  placeholder="Highlight notes"
                                  className="w-full px-2 py-1 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditingDrawerSkillLoc(null)}
                                    className="px-2 py-0.5 text-xs text-neutral-400"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleDrawerSaveSkillEdit}
                                    className="px-2.5 py-0.5 text-xs font-semibold text-neutral-950 bg-white rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={sIdx}
                              className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-850 flex items-center justify-between text-xs"
                            >
                              <div className="min-w-0 pr-2">
                                <span className="font-semibold text-white truncate block">
                                  {s.name}
                                </span>
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  {s.years} yrs{s.highlight ? ` · ${s.highlight}` : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-white text-[11px] font-bold">
                                  {s.level}%
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingDrawerSkillLoc({ catIdx, skillIdx: sIdx });
                                    setEditingDrawerSkillForm({ ...s });
                                  }}
                                  className="p-1 text-neutral-400 hover:text-white"
                                  title="Edit skill"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDrawerDeleteSkill(catIdx, sIdx)}
                                  className="p-1 text-neutral-400 hover:text-red-400"
                                  title="Delete skill"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TESTIMONIALS & ENDORSEMENTS TAB */}
          {activeTab === 'testimonials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">
                    Words from Engineering Partners
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Manage testimonials and recommendations shown on the live home page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingDrawerTestimonial(!isAddingDrawerTestimonial)}
                  className="px-2.5 py-1 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAddingDrawerTestimonial ? 'Cancel' : 'Add'}</span>
                </button>
              </div>

              {testimonialDrawerFeedback && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-850 text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{testimonialDrawerFeedback}</span>
                </div>
              )}

              {/* Add New Testimonial Form */}
              {isAddingDrawerTestimonial && (
                <form
                  onSubmit={handleDrawerAddTestimonial}
                  className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs"
                >
                  <div className="font-semibold text-white flex items-center gap-1.5 pb-1 border-b border-neutral-850">
                    <Quote className="w-3.5 h-3.5 text-neutral-400" />
                    <span>New Endorsement</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-0.5">Author *</label>
                      <input
                        type="text"
                        required
                        value={newDrawerTestimonialForm.author}
                        onChange={(e) =>
                          setNewDrawerTestimonialForm({ ...newDrawerTestimonialForm, author: e.target.value })
                        }
                        placeholder="Marcus Vance"
                        className="w-full px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-0.5">Role *</label>
                      <input
                        type="text"
                        required
                        value={newDrawerTestimonialForm.role}
                        onChange={(e) =>
                          setNewDrawerTestimonialForm({ ...newDrawerTestimonialForm, role: e.target.value })
                        }
                        placeholder="VP of Engineering"
                        className="w-full px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-0.5">Company *</label>
                      <input
                        type="text"
                        required
                        value={newDrawerTestimonialForm.company}
                        onChange={(e) =>
                          setNewDrawerTestimonialForm({ ...newDrawerTestimonialForm, company: e.target.value })
                        }
                        placeholder="AeroSphere"
                        className="w-full px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-0.5">Context</label>
                      <input
                        type="text"
                        value={newDrawerTestimonialForm.relation}
                        onChange={(e) =>
                          setNewDrawerTestimonialForm({ ...newDrawerTestimonialForm, relation: e.target.value })
                        }
                        placeholder="Managed directly"
                        className="w-full px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-0.5">Quote *</label>
                    <textarea
                      required
                      rows={3}
                      value={newDrawerTestimonialForm.quote}
                      onChange={(e) =>
                        setNewDrawerTestimonialForm({ ...newDrawerTestimonialForm, quote: e.target.value })
                      }
                      placeholder="Write partner endorsement quote..."
                      className="w-full px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white leading-relaxed font-light"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingDrawerTestimonial(false)}
                      className="px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold text-neutral-950 bg-white rounded flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save & Publish</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Testimonials List */}
              <div className="space-y-3">
                {(portfolio.testimonials || []).map((t, idx) => {
                  const isEditing = editingDrawerTestimonialId === t.id;

                  if (isEditing) {
                    return (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-700 space-y-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between pb-1 border-b border-neutral-850">
                          <span className="font-semibold text-white">Edit Endorsement</span>
                          <button
                            type="button"
                            onClick={() => setEditingDrawerTestimonialId(null)}
                            className="text-neutral-400 hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editingDrawerTestimonialForm.author || ''}
                            onChange={(e) =>
                              setEditingDrawerTestimonialForm({ ...editingDrawerTestimonialForm, author: e.target.value })
                            }
                            placeholder="Author Name"
                            className="px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                          />
                          <input
                            type="text"
                            value={editingDrawerTestimonialForm.role || ''}
                            onChange={(e) =>
                              setEditingDrawerTestimonialForm({ ...editingDrawerTestimonialForm, role: e.target.value })
                            }
                            placeholder="Role / Title"
                            className="px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editingDrawerTestimonialForm.company || ''}
                            onChange={(e) =>
                              setEditingDrawerTestimonialForm({ ...editingDrawerTestimonialForm, company: e.target.value })
                            }
                            placeholder="Company"
                            className="px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                          />
                          <input
                            type="text"
                            value={editingDrawerTestimonialForm.relation || ''}
                            onChange={(e) =>
                              setEditingDrawerTestimonialForm({ ...editingDrawerTestimonialForm, relation: e.target.value })
                            }
                            placeholder="Relationship Context"
                            className="px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                          />
                        </div>

                        <textarea
                          rows={3}
                          value={editingDrawerTestimonialForm.quote || ''}
                          onChange={(e) =>
                            setEditingDrawerTestimonialForm({ ...editingDrawerTestimonialForm, quote: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white leading-relaxed font-light"
                        />

                        <div className="flex justify-end gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingDrawerTestimonialId(null)}
                            className="px-2 py-0.5 text-xs text-neutral-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDrawerSaveTestimonialEdit(t.id)}
                            className="px-3 py-1 text-xs font-semibold text-neutral-950 bg-white rounded flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-750 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <Quote className="w-3 h-3 text-neutral-500" />
                            <span>{t.author}</span>
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {t.role} · <span className="text-neutral-300">{t.company}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDrawerTestimonialId(t.id);
                              setEditingDrawerTestimonialForm({
                                author: t.author,
                                role: t.role,
                                company: t.company,
                                quote: t.quote,
                                relation: t.relation,
                              });
                            }}
                            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            title="Edit Endorsement"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDrawerDeleteTestimonial(t.id)}
                            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                            title="Delete Endorsement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-neutral-300 italic font-light leading-relaxed pl-2 border-l border-neutral-800">
                        "{t.quote}"
                      </p>

                      <div className="text-[10px] text-neutral-500 font-mono pt-1 border-t border-neutral-900 flex justify-between items-center">
                        <span>{t.relation}</span>
                        <span className="text-emerald-400">Slot #{idx + 1}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* THEMES TAB WITH COMPONENT LIVE PREVIEW */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <div className="text-xs font-semibold text-white">Select Scheme & Live Component Preview</div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Click a scheme below to immediately simulate its impact on navigation, hero typography, project cards, and skill meters.
                </p>
              </div>

              {/* Theme Grid Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.values(THEMES).map((t) => {
                  const isSelected = selectedThemeForPreview === t.id;
                  const isSaved = portfolio.theme === t.id;

                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedThemeForPreview(t.id);
                        setPreviewTheme(t.id);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-white bg-neutral-800 shadow-md ring-1 ring-white/30'
                          : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div>
                        {/* Swatches preview pill */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.swatches.canvas }}
                            title="Canvas background"
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.swatches.surface }}
                            title="Surface / cards"
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: t.swatches.accent }}
                            title="Action accent"
                          />
                        </div>

                        <div className="text-xs font-semibold text-white truncate font-display">
                          {t.name}
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-neutral-400 font-mono">
                          {t.isDark ? 'Dark' : 'Light'}
                        </span>
                        {isSaved && (
                          <span className="text-emerald-400 font-bold font-mono">
                            ACTIVE
                          </span>
                        )}
                        {isSelected && !isSaved && (
                          <span className="text-amber-400 font-bold font-mono">
                            PREVIEW
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Live Component Preview Pane */}
              <ThemeLivePreview
                selectedTheme={selectedThemeForPreview}
                onApply={(theme) => updateTheme(theme)}
              />
            </div>
          )}

          {/* INBOX TAB */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-400">
                  Direct Inquiries ({messages.length})
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={clearMessages}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {messages.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No inquiries received yet. Submit the contact form on the website to test!
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => markMessageRead(msg.id)}
                      className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                        msg.read
                          ? 'bg-neutral-950 border-neutral-800 text-neutral-400'
                          : 'bg-neutral-950/90 border-neutral-700 text-white'
                      }`}
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="font-semibold text-xs text-white">
                          {msg.name} ({msg.email})
                        </div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          {new Date(msg.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-neutral-300 mb-1">
                        {msg.subject}
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-light">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DATA TAB */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-semibold text-white">Export Portfolio Config</h4>
                <p className="text-xs text-neutral-400">
                  Save all your projects, bio, skills, and settings into a single JSON file that you can store in Git or use anywhere.
                </p>
                <button
                  onClick={exportJSON}
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download portfolio.json</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-semibold text-white">Import Configuration</h4>
                <p className="text-xs text-neutral-400">
                  Paste JSON here to load a saved portfolio state.
                </p>
                <textarea
                  rows={3}
                  placeholder="Paste JSON config..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-neutral-900 border border-neutral-800 text-white font-mono"
                />
                <button
                  onClick={handleImportSubmit}
                  className="px-4 py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Load JSON</span>
                </button>
                {importStatus && (
                  <div className="text-xs text-emerald-400">{importStatus}</div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-red-950/40 space-y-3">
                <h4 className="text-xs font-semibold text-red-400">Factory Reset</h4>
                <p className="text-xs text-neutral-400">
                  Revert all customized profile fields, added projects, and settings to original defaults.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Reset portfolio back to default data?')) {
                      resetToDefaults();
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Drawer Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900 flex items-center justify-between text-xs text-neutral-400">
          <span>
            {isAuthenticated ? (
              <span className="text-emerald-400 font-mono">Logged in as admin · Edits sync to backend</span>
            ) : (
              <span className="text-neutral-500">Read-only visitor mode · Sign in to edit</span>
            )}
          </span>
          <button
            onClick={() => setIsStudioOpen(false)}
            className="text-white hover:underline font-medium cursor-pointer"
          >
            {isAuthenticated ? 'Done Editing' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
