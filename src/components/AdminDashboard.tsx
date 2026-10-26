import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, SkillCategory, ExperienceItem, ProfileData, SkillItem, Testimonial } from '../types/portfolio';
import {
  LayoutDashboard,
  Mail,
  FolderGit2,
  User,
  Cpu,
  Database,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Save,
  Search,
  CheckCircle2,
  Clock,
  Activity,
  Server,
  Eye,
  RefreshCw,
  Download,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Camera,
  RotateCcw,
  Pencil,
  X,
  Briefcase,
  Quote,
  ArrowUp,
  ArrowDown,
  MessageSquareQuote,
  BookOpen,
  GraduationCap,
  SlidersHorizontal,
  Settings,
  Layers,
  Award,
} from 'lucide-react';
import { ServicesManager } from './admin/ServicesManager';
import { EducationManager } from './admin/EducationManager';
import { CertificationsManager } from './admin/CertificationsManager';
import { BlogPostsManager } from './admin/BlogPostsManager';
import { SectionsManager } from './admin/SectionsManager';
import { SiteSettingsManager } from './admin/SiteSettingsManager';

interface ServerStats {
  totalMessages: number;
  unreadMessages: number;
  totalProjects: number;
  visits: number;
  lastVisit: string;
  uptimeSeconds: number;
  nodeVersion: string;
}

export const AdminDashboard: React.FC = () => {
  const { user, logout, setIsAdminDashboardOpen } = useAuth();
  const {
    portfolio,
    messages,
    markMessageRead,
    deleteMessage,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    updateSkills,
    updateExperience,
    updateTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    resetToDefaults,
    refreshBackendData,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'messages'
    | 'projects'
    | 'profile'
    | 'skills'
    | 'services'
    | 'experience'
    | 'education'
    | 'certifications'
    | 'testimonials'
    | 'posts'
    | 'sections'
    | 'settings'
    | 'server'
  >('overview');
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState<ProfileData>(portfolio.profile);
  const [profileSaved, setProfileSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

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

  // New project modal / form
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    tagline: '',
    category: 'cloud' as 'cloud' | 'ai' | 'frontend' | 'fullstack',
    featured: true,
    image: '/src/assets/images/project_nexus_cloud_1792818814330.jpg',
    date: '2026',
    liveUrl: '',
    githubUrl: '',
    impactMetric: '',
    challenge: '',
    solution: '',
    techStack: 'Go, TypeScript, Kubernetes, Tailwind CSS',
    keyFeatures: 'High throughput pipeline, Automated observability',
  });

  // Editing Project State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectData, setEditingProjectData] = useState<Partial<Project>>({});

  // Message Filter
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch stats from /api/stats
  const fetchStats = async () => {
    setRefreshing(true);
    const token = localStorage.getItem('emon_portfolio_admin_token');
    try {
      const res = await fetch('/api/stats', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn('Failed to fetch stats:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    refreshBackendData();
  }, []);

  useEffect(() => {
    setProfileForm(portfolio.profile);
  }, [portfolio.profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;

    await addProject({
      title: newProject.title,
      tagline: newProject.tagline || 'Engineered high-performance solution.',
      category: newProject.category,
      featured: newProject.featured,
      image: newProject.image,
      date: newProject.date,
      liveUrl: newProject.liveUrl || undefined,
      githubUrl: newProject.githubUrl || undefined,
      impactMetric: newProject.impactMetric || 'Production Scale',
      challenge: newProject.challenge || 'High concurrency latency under distributed load.',
      solution: newProject.solution || 'Modular architecture with low latency pipeline.',
      techStack: newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      keyFeatures: newProject.keyFeatures.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setIsAddingProject(false);
    fetchStats();
    setNewProject({
      title: '',
      tagline: '',
      category: 'cloud',
      featured: true,
      image: '/src/assets/images/project_nexus_cloud_1792818814330.jpg',
      date: '2026',
      liveUrl: '',
      githubUrl: '',
      impactMetric: '',
      challenge: '',
      solution: '',
      techStack: 'Go, TypeScript, Kubernetes, Tailwind CSS',
      keyFeatures: 'High throughput pipeline, Automated observability',
    });
  };

  const startEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setEditingProjectData({ ...p });
  };

  const saveEditProject = async () => {
    if (editingProjectId) {
      await updateProject(editingProjectId, editingProjectData);
      setEditingProjectId(null);
      setEditingProjectData({});
    }
  };

  // Skills Matrix State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatForm, setNewCatForm] = useState<{ category: string; description: string }>({
    category: '',
    description: '',
  });

  const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
  const [catEditForm, setCatEditForm] = useState<{ category: string; description: string }>({
    category: '',
    description: '',
  });

  const [addingSkillToCatIdx, setAddingSkillToCatIdx] = useState<number | null>(null);
  const [newSkillForm, setNewSkillForm] = useState<SkillItem>({
    name: '',
    level: 85,
    years: 3,
    highlight: '',
  });

  const [editingSkillLoc, setEditingSkillLoc] = useState<{ catIdx: number; skillIdx: number } | null>(null);
  const [editingSkillForm, setEditingSkillForm] = useState<SkillItem>({
    name: '',
    level: 85,
    years: 3,
    highlight: '',
  });

  const [skillsFeedback, setSkillsFeedback] = useState<string | null>(null);

  // Experience State
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [newExpForm, setNewExpForm] = useState<Omit<ExperienceItem, 'id'>>({
    role: '',
    company: '',
    period: '2024 — Present',
    location: 'Remote',
    type: 'Full-time',
    description: '',
    achievements: [],
    technologies: [],
  });
  const [newExpAchievementsStr, setNewExpAchievementsStr] = useState('');
  const [newExpTechStr, setNewExpTechStr] = useState('');

  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingExpForm, setEditingExpForm] = useState<Partial<ExperienceItem>>({});
  const [editingExpAchievementsStr, setEditingExpAchievementsStr] = useState('');
  const [editingExpTechStr, setEditingExpTechStr] = useState('');
  const [expFeedback, setExpFeedback] = useState<string | null>(null);

  // Skills CRUD Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatForm.category.trim()) return;
    const newCategory: SkillCategory = {
      category: newCatForm.category.trim(),
      description: newCatForm.description.trim(),
      skills: [],
    };
    const updated = [...portfolio.skills, newCategory];
    await updateSkills(updated);
    setIsAddingCategory(false);
    setNewCatForm({ category: '', description: '' });
    setSkillsFeedback('New skill category created successfully.');
    setTimeout(() => setSkillsFeedback(null), 2500);
  };

  const handleStartEditCategory = (idx: number, cat: SkillCategory) => {
    setEditingCatIdx(idx);
    setCatEditForm({ category: cat.category, description: cat.description });
  };

  const handleSaveEditCategory = async (idx: number) => {
    if (!catEditForm.category.trim()) return;
    const updated = portfolio.skills.map((c, i) =>
      i === idx ? { ...c, category: catEditForm.category.trim(), description: catEditForm.description.trim() } : c
    );
    await updateSkills(updated);
    setEditingCatIdx(null);
    setSkillsFeedback('Category updated successfully.');
    setTimeout(() => setSkillsFeedback(null), 2500);
  };

  const handleDeleteCategory = async (idx: number) => {
    const updated = portfolio.skills.filter((_, i) => i !== idx);
    await updateSkills(updated);
    if (editingCatIdx === idx) setEditingCatIdx(null);
    if (addingSkillToCatIdx === idx) setAddingSkillToCatIdx(null);
    if (editingSkillLoc?.catIdx === idx) setEditingSkillLoc(null);
    setSkillsFeedback('Category deleted successfully.');
    setTimeout(() => setSkillsFeedback(null), 2500);
  };

  const handleAddSkillToCategory = async (catIdx: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillForm.name.trim()) return;
    const updated = portfolio.skills.map((c, i) => {
      if (i !== catIdx) return c;
      return {
        ...c,
        skills: [
          ...c.skills,
          {
            name: newSkillForm.name.trim(),
            level: Number(newSkillForm.level) || 50,
            years: Number(newSkillForm.years) || 1,
            highlight: newSkillForm.highlight?.trim() || '',
          },
        ],
      };
    });
    await updateSkills(updated);
    setAddingSkillToCatIdx(null);
    setNewSkillForm({ name: '', level: 85, years: 3, highlight: '' });
    setSkillsFeedback('Skill added successfully.');
    setTimeout(() => setSkillsFeedback(null), 2500);
  };

  const handleStartEditSkill = (catIdx: number, skillIdx: number, s: SkillItem) => {
    setEditingSkillLoc({ catIdx, skillIdx });
    setEditingSkillForm({ ...s });
  };

  const handleSaveEditSkill = async () => {
    if (!editingSkillLoc || !editingSkillForm.name.trim()) return;
    const { catIdx, skillIdx } = editingSkillLoc;
    const updated = portfolio.skills.map((c, i) => {
      if (i !== catIdx) return c;
      return {
        ...c,
        skills: c.skills.map((s, si) =>
          si === skillIdx
            ? {
                name: editingSkillForm.name.trim(),
                level: Number(editingSkillForm.level) || 50,
                years: Number(editingSkillForm.years) || 1,
                highlight: editingSkillForm.highlight?.trim() || '',
              }
            : s
        ),
      };
    });
    await updateSkills(updated);
    setEditingSkillLoc(null);
    setSkillsFeedback('Skill updated successfully.');
    setTimeout(() => setSkillsFeedback(null), 2500);
  };

  const handleDeleteSkill = async (catIdx: number, skillIdx: number) => {
    const updated = portfolio.skills.map((c, i) => {
      if (i !== catIdx) return c;
      return {
        ...c,
        skills: c.skills.filter((_, si) => si !== skillIdx),
      };
    });
    await updateSkills(updated);
    if (editingSkillLoc?.catIdx === catIdx && editingSkillLoc?.skillIdx === skillIdx) {
      setEditingSkillLoc(null);
    }
    setSkillsFeedback('Skill deleted successfully.');
    setTimeout(() => setSkillsFeedback(null), 2500);
  };

  // Experience CRUD Handlers
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpForm.role.trim() || !newExpForm.company.trim()) return;
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExpForm.role.trim(),
      company: newExpForm.company.trim(),
      period: newExpForm.period.trim(),
      location: newExpForm.location.trim(),
      type: newExpForm.type.trim() || 'Full-time',
      description: newExpForm.description.trim(),
      achievements: newExpAchievementsStr
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: newExpTechStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const updated = [newExp, ...portfolio.experience];
    await updateExperience(updated);
    setIsAddingExp(false);
    setNewExpForm({
      role: '',
      company: '',
      period: '2024 — Present',
      location: 'Remote',
      type: 'Full-time',
      description: '',
      achievements: [],
      technologies: [],
    });
    setNewExpAchievementsStr('');
    setNewExpTechStr('');
    setExpFeedback('Experience record created.');
    setTimeout(() => setExpFeedback(null), 2500);
  };

  const handleStartEditExp = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    setEditingExpForm({ ...exp });
    setEditingExpAchievementsStr(exp.achievements.join('\n'));
    setEditingExpTechStr(exp.technologies.join(', '));
  };

  const handleSaveEditExp = async () => {
    if (!editingExpId) return;
    const updated = portfolio.experience.map((exp) => {
      if (exp.id !== editingExpId) return exp;
      return {
        ...exp,
        ...editingExpForm,
        achievements: editingExpAchievementsStr
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        technologies: editingExpTechStr
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
    });
    await updateExperience(updated);
    setEditingExpId(null);
    setEditingExpForm({});
    setExpFeedback('Experience record updated.');
    setTimeout(() => setExpFeedback(null), 2500);
  };

  const handleDeleteExp = async (id: string) => {
    const updated = portfolio.experience.filter((exp) => exp.id !== id);
    await updateExperience(updated);
    if (editingExpId === id) setEditingExpId(null);
    setExpFeedback('Experience record deleted.');
    setTimeout(() => setExpFeedback(null), 2500);
  };

  // Testimonials / Endorsements State & Handlers
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [newTestimonialForm, setNewTestimonialForm] = useState<Omit<Testimonial, 'id'>>({
    author: '',
    role: '',
    company: '',
    quote: '',
    relation: '',
  });
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [editingTestimonialForm, setEditingTestimonialForm] = useState<Partial<Testimonial>>({});
  const [testimonialFeedback, setTestimonialFeedback] = useState<string | null>(null);
  const [testimonialSearch, setTestimonialSearch] = useState('');

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonialForm.author.trim() || !newTestimonialForm.quote.trim()) {
      setTestimonialFeedback('Author name and quote are required.');
      return;
    }

    await addTestimonial({
      author: newTestimonialForm.author.trim(),
      role: newTestimonialForm.role.trim() || 'Engineering Collaborator',
      company: newTestimonialForm.company.trim() || 'Partner',
      quote: newTestimonialForm.quote.trim(),
      relation: newTestimonialForm.relation.trim() || 'Collaborated on software architecture',
    });

    setIsAddingTestimonial(false);
    setNewTestimonialForm({
      author: '',
      role: '',
      company: '',
      quote: '',
      relation: '',
    });
    setTestimonialFeedback('Endorsement created and published successfully.');
    setTimeout(() => setTestimonialFeedback(null), 3000);
  };

  const handleStartEditTestimonial = (item: Testimonial) => {
    setEditingTestimonialId(item.id);
    setEditingTestimonialForm({
      author: item.author,
      role: item.role,
      company: item.company,
      quote: item.quote,
      relation: item.relation,
    });
  };

  const handleSaveEditTestimonial = async (id: string) => {
    if (!editingTestimonialForm.author?.trim() || !editingTestimonialForm.quote?.trim()) {
      setTestimonialFeedback('Author name and quote cannot be empty.');
      return;
    }

    await updateTestimonial(id, {
      author: editingTestimonialForm.author.trim(),
      role: editingTestimonialForm.role?.trim() || '',
      company: editingTestimonialForm.company?.trim() || '',
      quote: editingTestimonialForm.quote.trim(),
      relation: editingTestimonialForm.relation?.trim() || '',
    });

    setEditingTestimonialId(null);
    setEditingTestimonialForm({});
    setTestimonialFeedback('Endorsement updated successfully.');
    setTimeout(() => setTestimonialFeedback(null), 3000);
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this endorsement? It will be removed from the live website.')) {
      await deleteTestimonial(id);
      if (editingTestimonialId === id) setEditingTestimonialId(null);
      setTestimonialFeedback('Endorsement deleted successfully.');
      setTimeout(() => setTestimonialFeedback(null), 3000);
    }
  };

  const handleMoveTestimonial = async (index: number, direction: 'up' | 'down') => {
    const list = [...(portfolio.testimonials || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    await updateTestimonials(list);
  };

  const totalSkillsCount = portfolio.skills.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m ${seconds % 60}s`;
  };

  const filteredMessages = messages.filter((m) => {
    if (messageFilter === 'unread' && m.read) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-neutral-100 flex flex-col font-sans overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-16 px-6 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-sm">
              EI
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display leading-none">
                Emon Islam · Backend Control Panel
              </div>
              <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-2">
                <span>User: <strong className="text-neutral-200">admin</strong></span>
                <span>·</span>
                <span className="text-emerald-400">Authenticated (Port 3000)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminDashboardOpen(false)}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={logout}
            className="px-3.5 py-1.5 text-xs font-semibold text-red-300 hover:text-red-200 bg-red-950/40 hover:bg-red-950/80 border border-red-900/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Left Sidebar + Center Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Tabs */}
        <aside className="w-64 bg-neutral-900/60 border-r border-neutral-800 flex flex-col justify-between p-4 shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-neutral-400" />
              <span>Server Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span>Inquiries & Inbox</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4 text-neutral-400" />
                <span>Manage Projects</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">
                {portfolio.projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <User className="w-4 h-4 text-neutral-400" />
              <span>Bio & Contact Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-neutral-400" />
                <span>Skills Matrix</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">
                {totalSkillsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Services & Offerings</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">
                {(portfolio.services || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'experience'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-neutral-400" />
                <span>Experience & Roles</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">
                {portfolio.experience.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'education'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Education & Degrees</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">
                {(portfolio.education || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'certifications'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Certifications</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">
                {(portfolio.certifications || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'testimonials'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Quote className="w-4 h-4 text-neutral-400" />
                <span>Endorsements & Proof</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">
                {(portfolio.testimonials || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Articles & Blog</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">
                {(portfolio.posts || []).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sections')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'sections'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>Section Ordering & Vis</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <Settings className="w-4 h-4 text-neutral-400" />
              <span>Site Settings & SEO</span>
            </button>

            <button
              onClick={() => setActiveTab('server')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'server'
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              <Database className="w-4 h-4 text-neutral-400" />
              <span>Database & System</span>
            </button>
          </div>

          {/* Bottom server status card */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1.5 font-medium text-neutral-300">
                <Server className="w-3.5 h-3.5 text-neutral-500" />
                <span>Node.js Backend</span>
              </span>
              <span className="font-mono text-emerald-400">200 OK</span>
            </div>
            <div className="text-neutral-500 text-[10px] font-mono truncate">
              Uptime: {stats ? formatUptime(stats.uptimeSeconds) : 'Active'}
            </div>
            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="w-full mt-1 py-1 text-[11px] font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </aside>

        {/* Center Workspace Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-neutral-950">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h1 className="text-2xl font-bold text-white font-display">System Overview</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Active backend performance, visitor activity, and real-time portfolio management.
                </p>
              </div>

              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Contact Inquiries</span>
                    <Mail className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">
                    {messages.length}
                  </div>
                  <div className="text-[11px] text-amber-400 font-medium">
                    {unreadCount} requiring reply
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Published Projects</span>
                    <FolderGit2 className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">
                    {portfolio.projects.length}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {portfolio.projects.filter((p) => p.featured).length} marked featured
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Unique Website Visits</span>
                    <Activity className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">
                    {stats?.visits ?? 412}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Tracked via Express proxy
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Server Status</span>
                    <Server className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">
                    Live
                  </div>
                  <div className="text-[11px] text-emerald-400">
                    Port 3000 · Express + Vite
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Quick Table */}
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Recent Contact Inquiries</h3>
                    <p className="text-xs text-neutral-400">Messages sent via the website contact form</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs text-neutral-300 hover:text-white font-medium"
                  >
                    View All ({messages.length}) →
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    No inquiries recorded yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {messages.slice(0, 4).map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                          msg.read
                            ? 'bg-neutral-950/60 border-neutral-800 text-neutral-400'
                            : 'bg-neutral-950 border-neutral-700 text-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{msg.name}</span>
                            <span className="text-neutral-500">({msg.email})</span>
                            {!msg.read && (
                              <span className="w-2 h-2 rounded-full bg-amber-400" title="Unread" />
                            )}
                          </div>
                          <div className="text-neutral-300 font-medium truncate mt-0.5">
                            {msg.subject}
                          </div>
                          <div className="text-neutral-400 truncate max-w-xl text-[11px] mt-0.5 font-light">
                            {msg.message}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-neutral-500 font-mono">
                            {new Date(msg.timestamp).toLocaleDateString()}
                          </span>
                          {!msg.read && (
                            <button
                              onClick={() => markMessageRead(msg.id)}
                              className="px-2 py-1 text-[11px] font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors cursor-pointer"
                            >
                              Mark Read
                            </button>
                          )}
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="px-2 py-1 text-[11px] font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded transition-colors whitespace-nowrap"
                          >
                            Reply
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES & MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white font-display">Client & Recruiter Inquiries</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Every message submitted on the portfolio contact form is logged and persisted to backend storage.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMessageFilter('all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      messageFilter === 'all'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    onClick={() => setMessageFilter('unread')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      messageFilter === 'unread'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search sender name, email, subject, or message text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-400 bg-neutral-900/40 rounded-2xl border border-neutral-800">
                    No inquiries match the current filter.
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        msg.read
                          ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-400'
                          : 'bg-neutral-900 border-neutral-700 text-white shadow-md'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2 pb-2 border-b border-neutral-800">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{msg.name}</span>
                          <span className="text-xs text-neutral-400">· {msg.email}</span>
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-neutral-200 mb-2">
                        {msg.subject}
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light whitespace-pre-wrap mb-4 bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/60">
                        {msg.message}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          {!msg.read && (
                            <button
                              onClick={() => markMessageRead(msg.id)}
                              className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                            >
                              Mark as Read
                            </button>
                          )}
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply via Email</span>
                          </a>
                        </div>

                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS MANAGEMENT */}
          {activeTab === 'projects' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white font-display">Manage Portfolio Projects</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Add new case studies, edit technical descriptions, and update metrics live in the database.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingProject(!isAddingProject)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingProject ? 'Cancel' : 'Create Project'}</span>
                </button>
              </div>

              {/* Add Project Form Drawer */}
              {isAddingProject && (
                <form
                  onSubmit={handleCreateProject}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4"
                >
                  <div className="text-sm font-bold text-white">Create New Portfolio Project</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Project Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyperion High-Speed Ingress"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Impact Metric / KPI</label>
                      <input
                        type="text"
                        placeholder="e.g. 2.4ms P99 · 120k rps"
                        value={newProject.impactMetric}
                        onChange={(e) => setNewProject({ ...newProject, impactMetric: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Category</label>
                      <select
                        value={newProject.category}
                        onChange={(e) =>
                          setNewProject({ ...newProject, category: e.target.value as any })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      >
                        <option value="cloud">Cloud & Systems</option>
                        <option value="ai">AI & Workflows</option>
                        <option value="frontend">Frontend & Commerce</option>
                        <option value="fullstack">Full Stack & Wasm</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Year / Date</label>
                      <input
                        type="text"
                        value={newProject.date}
                        onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Tagline / Pitch</label>
                    <input
                      type="text"
                      placeholder="e.g. Distributed fault-tolerant telemetry stream processor"
                      value={newProject.tagline}
                      onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">The Problem / Challenge</label>
                      <textarea
                        rows={2}
                        value={newProject.challenge}
                        onChange={(e) => setNewProject({ ...newProject, challenge: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Architectural Solution</label>
                      <textarea
                        rows={2}
                        value={newProject.solution}
                        onChange={(e) => setNewProject({ ...newProject, solution: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Technologies (comma separated)</label>
                    <input
                      type="text"
                      value={newProject.techStack}
                      onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Live URL</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newProject.liveUrl}
                        onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">GitHub Repository URL</label>
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        value={newProject.githubUrl}
                        onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Save & Deploy to Live Site
                  </button>
                </form>
              )}

              {/* Projects List */}
              <div className="space-y-4">
                {portfolio.projects.map((proj) => {
                  const isEditing = editingProjectId === proj.id;

                  if (isEditing) {
                    return (
                      <div
                        key={proj.id}
                        className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">Editing {proj.title}</span>
                          <button
                            onClick={() => setEditingProjectId(null)}
                            className="text-xs text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs text-neutral-400">Title</label>
                            <input
                              type="text"
                              value={editingProjectData.title || ''}
                              onChange={(e) =>
                                setEditingProjectData({ ...editingProjectData, title: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-neutral-400">Impact Metric</label>
                            <input
                              type="text"
                              value={editingProjectData.impactMetric || ''}
                              onChange={(e) =>
                                setEditingProjectData({ ...editingProjectData, impactMetric: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-neutral-400">Tagline</label>
                          <input
                            type="text"
                            value={editingProjectData.tagline || ''}
                            onChange={(e) =>
                              setEditingProjectData({ ...editingProjectData, tagline: e.target.value })
                            }
                            className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingProjectId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveEditProject}
                            className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white font-display">
                            {proj.title}
                          </h3>
                          <span className="text-xs text-neutral-500 font-mono">
                            · {proj.category}
                          </span>
                          <span className="text-xs font-mono text-neutral-300">
                            · {proj.impactMetric}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                          {proj.tagline}
                        </p>
                        <div className="text-[11px] text-neutral-500 font-mono mt-1">
                          Tech: {proj.techStack.join(', ')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            updateProject(proj.id, { featured: !proj.featured })
                          }
                          className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                            proj.featured
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                              : 'bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {proj.featured ? 'Featured' : 'Standard'}
                        </button>

                        <button
                          onClick={() => startEditProject(proj)}
                          className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE & CONTACT */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl font-bold text-white font-display">Profile & Contact Information</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Manage the developer persona, titles, bio, and social handles presented on the website.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
                {/* Profile Picture / Avatar Management */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white">
                      <Camera className="w-4 h-4 text-neutral-400" />
                      <span>Profile Picture / Portrait Avatar</span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono">1:1 Aspect Ratio</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    {/* Current Avatar Thumbnail */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-900 border-2 border-neutral-700/80 shrink-0 shadow-md">
                      <img
                        src={profileForm.avatarUrl}
                        alt="Current Profile Picture"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-neutral-950/80 flex flex-col items-center justify-center text-[10px] text-white font-mono gap-1">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex-1 w-full space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload From Computer</span>
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
                          className="px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3 text-neutral-400" />
                          <span>Default Studio Photo</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-neutral-400 block">
                          Or specify image URL / local asset path:
                        </label>
                        <div className="relative">
                          <ImageIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={profileForm.avatarUrl}
                            onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                            placeholder="e.g. /uploads/my_photo.jpg or https://..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white font-mono focus:outline-none focus:border-neutral-600"
                          />
                        </div>
                      </div>

                      {avatarError && (
                        <div className="text-xs text-red-400">{avatarError}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Professional Title</label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Hero Tagline</label>
                  <textarea
                    rows={2}
                    value={profileForm.tagline}
                    onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Bio Narrative</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Primary Contact Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Location</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-300">Availability Status Note</label>
                  <input
                    type="text"
                    value={profileForm.status}
                    onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">GitHub URL</label>
                    <input
                      type="text"
                      value={profileForm.social.github}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          social: { ...profileForm.social, github: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profileForm.social.linkedin}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          social: { ...profileForm.social, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Twitter / X URL</label>
                    <input
                      type="text"
                      value={profileForm.social.twitter}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          social: { ...profileForm.social, twitter: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                  <span className="text-xs text-neutral-400">
                    Saves permanently to server file storage
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {profileSaved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Saved to Server!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile Data</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: SKILLS MATRIX (FULL CRUD: ADD, EDIT, DELETE) */}
          {activeTab === 'skills' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white font-display">Technical Skills & Categories</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Add new skills, update proficiencies, edit details, or delete skills and categories. Persisted directly to backend storage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(!isAddingCategory);
                    setAddingSkillToCatIdx(null);
                    setEditingSkillLoc(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingCategory ? 'Cancel Category' : 'Add New Category'}</span>
                </button>
              </div>

              {/* Status feedback badge */}
              {skillsFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{skillsFeedback}</span>
                </div>
              )}

              {/* Add New Category Form Drawer / Card */}
              {isAddingCategory && (
                <form
                  onSubmit={handleAddCategory}
                  className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-sm font-bold text-white font-display">
                      Create New Skill Category
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="p-1 text-neutral-400 hover:text-white rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Category Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mobile & Embedded Systems, Machine Learning..."
                      value={newCatForm.category}
                      onChange={(e) => setNewCatForm({ ...newCatForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Category Description</label>
                    <input
                      type="text"
                      placeholder="e.g. High-performance native applications, device drivers, and cross-platform runtimes."
                      value={newCatForm.description}
                      onChange={(e) => setNewCatForm({ ...newCatForm, description: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="px-3.5 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              )}

              {/* Categories & Skills List */}
              <div className="space-y-6">
                {portfolio.skills.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400 bg-neutral-900/60 rounded-2xl border border-neutral-800">
                    No skill categories available. Click "+ Add New Category" above to create one.
                  </div>
                ) : (
                  portfolio.skills.map((cat, catIdx) => {
                    const isEditingCategory = editingCatIdx === catIdx;
                    const isAddingSkill = addingSkillToCatIdx === catIdx;

                    return (
                      <div
                        key={catIdx}
                        className="p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-sm"
                      >
                        {/* Category Header or Edit Form */}
                        {isEditingCategory ? (
                          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-700 space-y-3">
                            <div className="text-xs font-bold text-white">Edit Category Details</div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-neutral-400">Category Name</label>
                              <input
                                type="text"
                                value={catEditForm.category}
                                onChange={(e) =>
                                  setCatEditForm({ ...catEditForm, category: e.target.value })
                                }
                                className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-neutral-400">Description</label>
                              <input
                                type="text"
                                value={catEditForm.description}
                                onChange={(e) =>
                                  setCatEditForm({ ...catEditForm, description: e.target.value })
                                }
                                className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingCatIdx(null)}
                                className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditCategory(catIdx)}
                                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg cursor-pointer"
                              >
                                Save Category Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/80">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h3 className="text-base font-bold text-white font-display">
                                  {cat.category}
                                </h3>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400">
                                  {cat.skills.length} {cat.skills.length === 1 ? 'skill' : 'skills'}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 mt-0.5">{cat.description}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setAddingSkillToCatIdx(isAddingSkill ? null : catIdx);
                                  setEditingSkillLoc(null);
                                }}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                                  isAddingSkill
                                    ? 'bg-neutral-800 text-white border border-neutral-700'
                                    : 'bg-white text-neutral-950 hover:bg-neutral-200 font-semibold'
                                }`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>{isAddingSkill ? 'Cancel' : 'Add Skill'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStartEditCategory(catIdx, cat)}
                                className="p-1.5 text-neutral-400 hover:text-white bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
                                title="Edit category name and description"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    cat.skills.length === 0 ||
                                    window.confirm(`Delete "${cat.category}" and its ${cat.skills.length} skills?`)
                                  ) {
                                    handleDeleteCategory(catIdx);
                                  }
                                }}
                                className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
                                title="Delete category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Inline Form to Add Skill into this Category */}
                        {isAddingSkill && (
                          <form
                            onSubmit={(e) => handleAddSkillToCategory(catIdx, e)}
                            className="p-4 rounded-xl bg-neutral-950 border border-neutral-700 space-y-3 shadow-md animate-in fade-in"
                          >
                            <div className="flex items-center justify-between text-xs font-bold text-white">
                              <span>Add New Skill to {cat.category}</span>
                              <button
                                type="button"
                                onClick={() => setAddingSkillToCatIdx(null)}
                                className="text-neutral-400 hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] text-neutral-300 font-medium">Skill Name</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. PostgreSQL, Docker, React 19"
                                  value={newSkillForm.name}
                                  onChange={(e) =>
                                    setNewSkillForm({ ...newSkillForm, name: e.target.value })
                                  }
                                  className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px] text-neutral-300 font-medium">
                                  <span>Proficiency Level</span>
                                  <span className="font-mono text-emerald-400 font-bold">{newSkillForm.level}%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={newSkillForm.level}
                                    onChange={(e) =>
                                      setNewSkillForm({ ...newSkillForm, level: Number(e.target.value) })
                                    }
                                    className="flex-1 accent-white"
                                  />
                                  <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={newSkillForm.level}
                                    onChange={(e) =>
                                      setNewSkillForm({ ...newSkillForm, level: Number(e.target.value) })
                                    }
                                    className="w-14 px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white font-mono text-center"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] text-neutral-300 font-medium">Years of Experience</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="30"
                                  value={newSkillForm.years}
                                  onChange={(e) =>
                                    setNewSkillForm({ ...newSkillForm, years: Number(e.target.value) })
                                  }
                                  className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] text-neutral-300 font-medium">Highlight / Specialization Note</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Microservices, indexing, goroutines"
                                  value={newSkillForm.highlight || ''}
                                  onChange={(e) =>
                                    setNewSkillForm({ ...newSkillForm, highlight: e.target.value })
                                  }
                                  className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setAddingSkillToCatIdx(null)}
                                className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg cursor-pointer"
                              >
                                Add Skill
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Skills Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {cat.skills.length === 0 ? (
                            <div className="col-span-full py-6 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/30">
                              No skills in this category yet. Click "+ Add Skill" above to add one.
                            </div>
                          ) : (
                            cat.skills.map((s, sIdx) => {
                              const isEditingThisSkill =
                                editingSkillLoc?.catIdx === catIdx && editingSkillLoc?.skillIdx === sIdx;

                              if (isEditingThisSkill) {
                                return (
                                  <div
                                    key={sIdx}
                                    className="col-span-1 sm:col-span-2 p-4 rounded-xl bg-neutral-950 border border-neutral-700 space-y-3 shadow-md animate-in fade-in"
                                  >
                                    <div className="flex items-center justify-between text-xs font-bold text-white">
                                      <span>Edit Skill: {s.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => setEditingSkillLoc(null)}
                                        className="text-neutral-400 hover:text-white"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <label className="text-[11px] text-neutral-300">Skill Name</label>
                                        <input
                                          type="text"
                                          value={editingSkillForm.name}
                                          onChange={(e) =>
                                            setEditingSkillForm({ ...editingSkillForm, name: e.target.value })
                                          }
                                          className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[11px] text-neutral-300">
                                          <span>Proficiency</span>
                                          <span className="font-mono text-emerald-400 font-bold">
                                            {editingSkillForm.level}%
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={editingSkillForm.level}
                                            onChange={(e) =>
                                              setEditingSkillForm({
                                                ...editingSkillForm,
                                                level: Number(e.target.value),
                                              })
                                            }
                                            className="flex-1 accent-white"
                                          />
                                          <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={editingSkillForm.level}
                                            onChange={(e) =>
                                              setEditingSkillForm({
                                                ...editingSkillForm,
                                                level: Number(e.target.value),
                                              })
                                            }
                                            className="w-14 px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-800 text-white font-mono text-center"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <label className="text-[11px] text-neutral-300">Years of Experience</label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="30"
                                          value={editingSkillForm.years}
                                          onChange={(e) =>
                                            setEditingSkillForm({
                                              ...editingSkillForm,
                                              years: Number(e.target.value),
                                            })
                                          }
                                          className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[11px] text-neutral-300">Highlight / Specialization</label>
                                        <input
                                          type="text"
                                          value={editingSkillForm.highlight || ''}
                                          onChange={(e) =>
                                            setEditingSkillForm({
                                              ...editingSkillForm,
                                              highlight: e.target.value,
                                            })
                                          }
                                          className="w-full px-3 py-1.5 text-xs rounded bg-neutral-900 border border-neutral-800 text-white"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={() => setEditingSkillLoc(null)}
                                        className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleSaveEditSkill}
                                        className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg cursor-pointer"
                                      >
                                        Save Changes
                                      </button>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={sIdx}
                                  className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700/80 transition-all flex flex-col justify-between gap-2.5 group"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <div className="font-semibold text-white text-xs truncate">
                                        {s.name}
                                      </div>
                                      <div className="text-[11px] text-neutral-400 mt-0.5 font-light truncate">
                                        {s.years} {s.years === 1 ? 'yr' : 'yrs'}
                                        {s.highlight ? ` · ${s.highlight}` : ''}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <span className="font-mono text-xs font-bold text-white px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                                        {s.level}%
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => handleStartEditSkill(catIdx, sIdx, s)}
                                        className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                                        title="Edit this skill"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSkill(catIdx, sIdx)}
                                        className="p-1 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                                        title="Delete this skill"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Visual Progress Bar */}
                                  <div className="w-full h-1.5 rounded-full bg-neutral-900 border border-neutral-850 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-neutral-500 to-white rounded-full transition-all duration-300"
                                      style={{ width: `${Math.min(100, Math.max(0, s.level))}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 6: EXPERIENCE & CAREER (FULL CRUD: ADD, EDIT, DELETE) */}
          {activeTab === 'experience' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white font-display">Experience & Career History</h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage work history positions, key achievements, and technology tags shown on your resume & portfolio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingExp(!isAddingExp)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingExp ? 'Cancel' : 'Add Experience'}</span>
                </button>
              </div>

              {expFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{expFeedback}</span>
                </div>
              )}

              {/* Add Experience Form */}
              {isAddingExp && (
                <form
                  onSubmit={handleAddExperience}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4 shadow-xl"
                >
                  <div className="text-sm font-bold text-white">Create New Career Experience</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Job Role / Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Software Architect"
                        value={newExpForm.role}
                        onChange={(e) => setNewExpForm({ ...newExpForm, role: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Company Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Google Cloud, Stripe, Veloce Labs"
                        value={newExpForm.company}
                        onChange={(e) => setNewExpForm({ ...newExpForm, company: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Period / Years</label>
                      <input
                        type="text"
                        placeholder="e.g. 2023 — Present"
                        value={newExpForm.period}
                        onChange={(e) => setNewExpForm({ ...newExpForm, period: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Remote · Singapore"
                        value={newExpForm.location}
                        onChange={(e) => setNewExpForm({ ...newExpForm, location: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-300">Employment Type</label>
                      <input
                        type="text"
                        placeholder="e.g. Full-time, Contract"
                        value={newExpForm.type}
                        onChange={(e) => setNewExpForm({ ...newExpForm, type: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">Role Summary Description</label>
                    <textarea
                      rows={2}
                      placeholder="High level overview of core responsibilities and engineering domain..."
                      value={newExpForm.description}
                      onChange={(e) => setNewExpForm({ ...newExpForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">
                      Key Impact & Achievements (one bullet per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Led migration of legacy monolithic system to microservices, reducing p99 latency by 45%&#10;Built real-time telemetry pipeline scaling to 12k events/sec"
                      value={newExpAchievementsStr}
                      onChange={(e) => setNewExpAchievementsStr(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-300">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Go, TypeScript, Kubernetes, PostgreSQL, Redis"
                      value={newExpTechStr}
                      onChange={(e) => setNewExpTechStr(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingExp(false)}
                      className="px-3.5 py-2 text-xs font-medium text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg cursor-pointer"
                    >
                      Save Career Experience
                    </button>
                  </div>
                </form>
              )}

              {/* Experience List */}
              <div className="space-y-4">
                {portfolio.experience.map((exp) => {
                  const isEditingThisExp = editingExpId === exp.id;

                  if (isEditingThisExp) {
                    return (
                      <div
                        key={exp.id}
                        className="p-5 sm:p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4 shadow-xl"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                          <span className="text-sm font-bold text-white">
                            Editing: {exp.role} at {exp.company}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingExpId(null)}
                            className="text-xs text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs text-neutral-400">Role</label>
                            <input
                              type="text"
                              value={editingExpForm.role || ''}
                              onChange={(e) =>
                                setEditingExpForm({ ...editingExpForm, role: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-neutral-400">Company</label>
                            <input
                              type="text"
                              value={editingExpForm.company || ''}
                              onChange={(e) =>
                                setEditingExpForm({ ...editingExpForm, company: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs text-neutral-400">Period</label>
                            <input
                              type="text"
                              value={editingExpForm.period || ''}
                              onChange={(e) =>
                                setEditingExpForm({ ...editingExpForm, period: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-neutral-400">Location</label>
                            <input
                              type="text"
                              value={editingExpForm.location || ''}
                              onChange={(e) =>
                                setEditingExpForm({ ...editingExpForm, location: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-neutral-400">Type</label>
                            <input
                              type="text"
                              value={editingExpForm.type || ''}
                              onChange={(e) =>
                                setEditingExpForm({ ...editingExpForm, type: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-neutral-400">Description</label>
                          <textarea
                            rows={2}
                            value={editingExpForm.description || ''}
                            onChange={(e) =>
                              setEditingExpForm({ ...editingExpForm, description: e.target.value })
                            }
                            className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-neutral-400">
                            Achievements (one bullet per line)
                          </label>
                          <textarea
                            rows={3}
                            value={editingExpAchievementsStr}
                            onChange={(e) => setEditingExpAchievementsStr(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-neutral-400">Technologies (comma separated)</label>
                          <input
                            type="text"
                            value={editingExpTechStr}
                            onChange={(e) => setEditingExpTechStr(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded bg-neutral-950 border border-neutral-800 text-white font-mono"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingExpId(null)}
                            className="px-3.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveEditExp}
                            className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg cursor-pointer"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={exp.id}
                      className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between gap-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-display">
                              {exp.role}
                            </span>
                            <span className="text-xs text-neutral-300">· {exp.company}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono">
                              {exp.type}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 font-mono mt-0.5">
                            {exp.period} · {exp.location}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditExp(exp)}
                            className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete experience record "${exp.role} at ${exp.company}"?`)) {
                                handleDeleteExp(exp.id);
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete experience"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed font-light">
                        {exp.description}
                      </p>

                      {exp.achievements.length > 0 && (
                        <ul className="space-y-1 text-xs text-neutral-400 list-disc list-inside font-light">
                          {exp.achievements.map((ach, aIdx) => (
                            <li key={aIdx} className="leading-relaxed">
                              {ach}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {exp.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS & ENDORSEMENTS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 max-w-5xl">
              {/* Header and Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-1">
                    Endorsements & Proof
                  </div>
                  <h1 className="text-2xl font-bold text-white font-display">
                    Words from Engineering Partners
                  </h1>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage leadership testimonials, client reviews, and peer recommendations rendered in the live endorsements section.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingTestimonial(!isAddingTestimonial)}
                    className="px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingTestimonial ? 'Close Form' : 'Add New Endorsement'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback toast banner */}
              {testimonialFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{testimonialFeedback}</span>
                </div>
              )}

              {/* Add New Testimonial Form Card */}
              {isAddingTestimonial && (
                <form
                  onSubmit={handleAddTestimonial}
                  className="p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                      <Quote className="w-4 h-4 text-neutral-400" />
                      <span>Add New Partner Endorsement</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingTestimonial(false)}
                      className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Author Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newTestimonialForm.author}
                        onChange={(e) =>
                          setNewTestimonialForm({ ...newTestimonialForm, author: e.target.value })
                        }
                        placeholder="e.g. Marcus Vance"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Role / Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newTestimonialForm.role}
                        onChange={(e) =>
                          setNewTestimonialForm({ ...newTestimonialForm, role: e.target.value })
                        }
                        placeholder="e.g. VP of Engineering"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Company / Organization *
                      </label>
                      <input
                        type="text"
                        required
                        value={newTestimonialForm.company}
                        onChange={(e) =>
                          setNewTestimonialForm({ ...newTestimonialForm, company: e.target.value })
                        }
                        placeholder="e.g. AeroSphere Systems"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1">
                        Professional Context / Relationship
                      </label>
                      <input
                        type="text"
                        value={newTestimonialForm.relation}
                        onChange={(e) =>
                          setNewTestimonialForm({ ...newTestimonialForm, relation: e.target.value })
                        }
                        placeholder="e.g. Managed Emon directly at AeroSphere"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Endorsement Quote / Recommendation *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newTestimonialForm.quote}
                      onChange={(e) =>
                        setNewTestimonialForm({ ...newTestimonialForm, quote: e.target.value })
                      }
                      placeholder="Write the partner's direct quote regarding velocity, technical judgment, teamwork, or architectural achievements..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500 leading-relaxed font-light"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingTestimonial(false)}
                      className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Publish Endorsement</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Search Bar & Summary Count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span>Displaying</span>
                  <strong className="text-white font-mono">
                    {(portfolio.testimonials || []).length}
                  </strong>
                  <span>active endorsements on public website</span>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                  <input
                    type="text"
                    value={testimonialSearch}
                    onChange={(e) => setTestimonialSearch(e.target.value)}
                    placeholder="Search endorsements..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                  />
                  {testimonialSearch && (
                    <button
                      onClick={() => setTestimonialSearch('')}
                      className="absolute right-2.5 top-2 text-neutral-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Endorsements Cards List */}
              {(!portfolio.testimonials || portfolio.testimonials.length === 0) ? (
                <div className="p-12 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                  <Quote className="w-8 h-8 text-neutral-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-white">No Endorsements Added Yet</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Add endorsements from engineering colleagues, CTOs, and product partners to showcase technical proof on your portfolio.
                  </p>
                  <button
                    onClick={() => setIsAddingTestimonial(true)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add First Endorsement</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.testimonials
                    .filter((item) => {
                      if (!testimonialSearch.trim()) return true;
                      const q = testimonialSearch.toLowerCase();
                      return (
                        item.author.toLowerCase().includes(q) ||
                        item.role.toLowerCase().includes(q) ||
                        item.company.toLowerCase().includes(q) ||
                        item.relation.toLowerCase().includes(q) ||
                        item.quote.toLowerCase().includes(q)
                      );
                    })
                    .map((item, index) => {
                      const isEditing = editingTestimonialId === item.id;

                      if (isEditing) {
                        return (
                          <div
                            key={item.id}
                            className="p-6 rounded-2xl bg-neutral-900 border border-neutral-600 space-y-4 shadow-lg"
                          >
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Pencil className="w-3.5 h-3.5 text-neutral-400" />
                                <span>Editing Endorsement ({item.author})</span>
                              </span>
                              <button
                                onClick={() => setEditingTestimonialId(null)}
                                className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                  Author Name *
                                </label>
                                <input
                                  type="text"
                                  value={editingTestimonialForm.author || ''}
                                  onChange={(e) =>
                                    setEditingTestimonialForm({
                                      ...editingTestimonialForm,
                                      author: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                  Role / Title *
                                </label>
                                <input
                                  type="text"
                                  value={editingTestimonialForm.role || ''}
                                  onChange={(e) =>
                                    setEditingTestimonialForm({
                                      ...editingTestimonialForm,
                                      role: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                  Company / Organization *
                                </label>
                                <input
                                  type="text"
                                  value={editingTestimonialForm.company || ''}
                                  onChange={(e) =>
                                    setEditingTestimonialForm({
                                      ...editingTestimonialForm,
                                      company: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-neutral-300 mb-1">
                                  Relationship / Context
                                </label>
                                <input
                                  type="text"
                                  value={editingTestimonialForm.relation || ''}
                                  onChange={(e) =>
                                    setEditingTestimonialForm({
                                      ...editingTestimonialForm,
                                      relation: e.target.value,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-neutral-300 mb-1">
                                Endorsement Quote *
                              </label>
                              <textarea
                                rows={4}
                                value={editingTestimonialForm.quote || ''}
                                onChange={(e) =>
                                  setEditingTestimonialForm({
                                    ...editingTestimonialForm,
                                    quote: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-neutral-500 leading-relaxed font-light"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-800">
                              <button
                                onClick={() => setEditingTestimonialId(null)}
                                className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveEditTestimonial(item.id)}
                                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Changes</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item.id}
                          className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 transition-colors space-y-4"
                        >
                          {/* Card top toolbar */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-400">
                                <Quote className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-white font-display">
                                  {item.author}
                                </h3>
                                <div className="text-xs text-neutral-400">
                                  {item.role} · <span className="text-neutral-300">{item.company}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Reorder Buttons */}
                              <div className="flex items-center border border-neutral-800 rounded-lg overflow-hidden mr-1">
                                <button
                                  onClick={() => handleMoveTestimonial(index, 'up')}
                                  disabled={index === 0}
                                  title="Move Earlier in Display Order"
                                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveTestimonial(index, 'down')}
                                  disabled={index === (portfolio.testimonials || []).length - 1}
                                  title="Move Later in Display Order"
                                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border-l border-neutral-800"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleStartEditTestimonial(item)}
                                className="px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleDeleteTestimonial(item.id)}
                                className="p-1.5 text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 rounded-lg transition-colors cursor-pointer"
                                title="Delete Endorsement"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Quote Body */}
                          <div className="pl-3 border-l-2 border-neutral-800 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light italic">
                            "{item.quote}"
                          </div>

                          {/* Footer Info */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-850 text-[11px]">
                            <div className="text-neutral-400 font-mono">
                              Context: <span className="text-neutral-300">{item.relation || 'Engineering Partner'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              <span>Live on Home Page (Slot #{index + 1})</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Live Preview Box */}
              <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Live Grid Preview
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Real-time simulation of how your engineering endorsements render to visitors on the live site.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAdminDashboardOpen(false)}
                    className="text-xs text-neutral-300 hover:text-white flex items-center gap-1 font-medium"
                  >
                    <span>View Section on Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {(portfolio.testimonials || []).slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex flex-col justify-between"
                    >
                      <div className="mb-4">
                        <Quote className="w-4 h-4 text-neutral-600 mb-2" />
                        <p className="text-xs text-neutral-300 leading-relaxed italic line-clamp-4 font-light">
                          "{item.quote}"
                        </p>
                      </div>
                      <div className="pt-3 border-t border-neutral-850">
                        <div className="font-semibold text-xs text-white">
                          {item.author}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {item.role} · {item.company}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                          {item.relation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DATABASE & SYSTEM */}
          {activeTab === 'server' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl font-bold text-white font-display">Database & Server Architecture</h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Low-level database snapshot, live disk persistence, and system backup management.
                </p>
              </div>

              {/* Server Info Card */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Server Environment Information</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                    <span className="text-neutral-500 block text-[10px]">HOST PORT</span>
                    <span className="text-white">0.0.0.0:3000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                    <span className="text-neutral-500 block text-[10px]">NODE RUNTIME</span>
                    <span className="text-white">{stats?.nodeVersion || process.version}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                    <span className="text-neutral-500 block text-[10px]">PERSISTENCE ENGINE</span>
                    <span className="text-white">JSON Disk Store</span>
                  </div>
                </div>
              </div>

              {/* Data actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Full Database Export
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Export the current server state, all projects, and contact messages as a single JSON file.
                  </p>
                  <button
                    onClick={() => {
                      const backup = {
                        portfolio,
                        messages,
                        stats,
                        exportedAt: new Date().toISOString(),
                      };
                      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
                      const a = document.createElement('a');
                      a.href = dataStr;
                      a.download = `emon_islam_server_backup_${Date.now()}.json`;
                      a.click();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Database Snapshot</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-red-950/40 space-y-3">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">
                    Factory Reset Server
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Reset all database records back to original seeded default state.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Reset all server records and portfolio data back to defaults?')) {
                        resetToDefaults();
                        fetchStats();
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Re-seed Factory Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SERVICES */}
          {activeTab === 'services' && (
            <div className="max-w-6xl">
              <ServicesManager />
            </div>
          )}

          {/* TAB 9: EDUCATION */}
          {activeTab === 'education' && (
            <div className="max-w-6xl">
              <EducationManager />
            </div>
          )}

          {/* TAB 10: CERTIFICATIONS */}
          {activeTab === 'certifications' && (
            <div className="max-w-6xl">
              <CertificationsManager />
            </div>
          )}

          {/* TAB 11: BLOG POSTS */}
          {activeTab === 'posts' && (
            <div className="max-w-6xl">
              <BlogPostsManager />
            </div>
          )}

          {/* TAB 12: SECTIONS REORDERING & VISIBILITY */}
          {activeTab === 'sections' && (
            <div className="max-w-6xl">
              <SectionsManager />
            </div>
          )}

          {/* TAB 13: SITE SETTINGS & SEO */}
          {activeTab === 'settings' && (
            <div className="max-w-6xl">
              <SiteSettingsManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
