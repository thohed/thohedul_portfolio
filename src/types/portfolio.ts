export type ProjectCategory = 'all' | 'fullstack' | 'ai' | 'cloud' | 'frontend';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'fullstack' | 'ai' | 'cloud' | 'frontend';
  featured: boolean;
  published?: boolean;
  order?: number;
  image: string;
  date: string;
  liveUrl?: string;
  githubUrl?: string;
  impactMetric: string;
  challenge: string;
  solution: string;
  techStack: string[];
  keyFeatures: string[];
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
}

export interface SkillItem {
  name: string;
  level: number; // 0 - 100
  years: number;
  highlight?: string;
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
  order?: number;
  published?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: 'code' | 'cpu' | 'cloud' | 'layers' | 'sparkles' | 'database' | 'shield' | 'terminal';
  deliverables?: string[];
  order: number;
  published: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  period: string;
  location: string;
  description: string;
  honors?: string;
  order: number;
  published: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
  badge?: string;
  order: number;
  published: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string;
  publishedDate: string;
  coverImage?: string;
  order: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  relation: string;
  avatar?: string;
  order?: number;
  published?: boolean;
}

export interface SectionConfig {
  id: 'hero' | 'about' | 'skills' | 'services' | 'projects' | 'experience' | 'education' | 'certifications' | 'testimonials' | 'blog' | 'contact';
  name: string;
  enabled: boolean;
  order: number;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  accentColor: string;
  defaultTheme: ThemeStyle;
  footerText: string;
  allowInquiries: boolean;
  resumePdfUrl: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  status: string;
  avatarUrl: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    website?: string;
  };
  metrics: {
    label: string;
    value: string;
    sublabel: string;
  }[];
}

export type ThemeStyle = 'obsidian' | 'slate' | 'paper' | 'clean' | 'travertine' | 'emerald';

export interface PortfolioState {
  profile: ProfileData;
  projects: Project[];
  skills: SkillCategory[];
  services: ServiceItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  testimonials: Testimonial[];
  posts: BlogPost[];
  sections: SectionConfig[];
  settings: SiteSettings;
  theme: ThemeStyle;
}
