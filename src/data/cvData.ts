/**
 * Single source of truth for CV and Resume content.
 * Both the on-site interactive CV view and the PDF export read from this file.
 * Any fields that need personal customization are marked with [REPLACE].
 */

export interface CVExperience {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export interface CVProject {
  title: string;
  role: string;
  period: string;
  techStack: string[];
  impactMetric: string;
  bullets: string[];
}

export interface CVEducation {
  institution: string;
  degree: string;
  period: string;
  location: string;
  honors?: string;
}

export interface CVCertification {
  title: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface CVSkillCategory {
  category: string;
  skills: string[];
}

export interface CVLanguage {
  name: string;
  proficiency: string;
}

export interface CVData {
  header: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolioUrl: string;
  };
  summary: string;
  skills: CVSkillCategory[];
  experience: CVExperience[];
  projects: CVProject[];
  education: CVEducation[];
  certifications: CVCertification[];
  languages: CVLanguage[];
}

export const CV_DATA: CVData = {
  header: {
    name: 'Md. Thohedul Islam',
    title: 'Senior Full-Stack Engineer & Systems Architect',
    location: 'Dhaka, Bangladesh · Remote Worldwide',
    email: 'emonislam79799@gmail.com',
    phone: '[REPLACE: +880 1XXXXXXXXX]',
    linkedin: 'linkedin.com/in/[REPLACE: thohedul-islam]',
    github: 'github.com/[REPLACE: emonislam]',
    portfolioUrl: 'https://emonislam.dev',
  },
  summary:
    'Results-driven Senior Full-Stack Engineer and Systems Architect with 5+ years of production experience building high-throughput distributed systems, real-time web applications, and resilient cloud infrastructure. Specialized in Go, Node.js, React 19, TypeScript, and Kubernetes, with a focus on sub-millisecond API latency, fault-tolerant microservices, and pragmatic generative AI integrations supporting over 1.4M daily requests at 99.98% SLA availability.',
  skills: [
    {
      category: 'Frontend Architecture',
      skills: ['React 19', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS', 'State Management (Zustand, TanStack)', 'Web Performance & Core Web Vitals', 'HTML5 Canvas', 'WebAssembly'],
    },
    {
      category: 'Backend & Distributed Systems',
      skills: ['Go (Golang)', 'Node.js', 'Express', 'PostgreSQL', 'Redis & Pub/Sub', 'gRPC', 'REST APIs', 'GraphQL', 'WebSockets', 'Event-Driven Architectures'],
    },
    {
      category: 'Cloud, DevOps & Observability',
      skills: ['Docker & Containerization', 'Kubernetes & Helm', 'Google Cloud Platform (GCP)', 'AWS', 'CI/CD (GitHub Actions)', 'Linux Administration', 'Prometheus', 'Distributed Tracing'],
    },
    {
      category: 'AI Systems & Tooling',
      skills: ['Gemini API & LLM Tool Calling', 'Vector Embeddings & RAG Pipelines', 'Structured Outputs', 'Streaming Telemetry', 'Python (FastAPI, NumPy)'],
    },
  ],
  experience: [
    {
      company: 'AeroSphere Systems',
      role: 'Lead Full-Stack Engineer',
      period: '2023 — Present',
      location: 'Remote · Singapore / Dhaka',
      bullets: [
        'Architected an event-driven Go and WebSocket telemetry aggregation engine processing 12,000 active aircraft events per second with sub-4ms P99 latency.',
        'Led a squad of 6 engineers migrating legacy monolithic control portals to modular React 19 micro-frontends, reducing initial page load times by 48%.',
        'Implemented automated multi-cluster Kubernetes canary deployment pipelines across GCP and AWS, establishing zero-downtime rollouts and automated rollbacks.',
        'Engineered an edge caching tier and Redis cluster topology that reduced database load by 64% during peak operational surges.',
      ],
    },
    {
      company: 'Veloce Digital Labs',
      role: 'Senior Software Engineer',
      period: '2021 — 2023',
      location: 'Remote · London, UK',
      bullets: [
        'Built an edge-cached headless commerce platform processing over $8.5M in seasonal transaction volume with zero service outages.',
        'Designed real-time asynchronous fraud detection queue using Redis Streams and Go workers, preventing $140K in unauthorized charges.',
        'Established end-to-end automated testing and strict WCAG 2.2 AA accessibility standards across customer-facing checkout flows.',
        'Mentored 4 junior engineers in concurrent Go patterns, clean TypeScript interfaces, and optimistic UI synchronization.',
      ],
    },
    {
      company: 'Nexus Spark Studio',
      role: 'Full-Stack Developer',
      period: '2019 — 2021',
      location: 'Dhaka, Bangladesh',
      bullets: [
        'Delivered 14 enterprise web applications from conception to production on schedule, achieving an average client CSAT rating of 9.7/10.',
        'Refactored legacy database schemas and indexes, reducing complex analytical query execution time from 8.2s to under 640ms.',
        'Built reusable component libraries and RESTful services adopted across 8 international client products.',
      ],
    },
  ],
  projects: [
    {
      title: 'Nebula Cloud Orchestrator',
      role: 'Lead Architect',
      period: '2026',
      techStack: ['Go', 'TypeScript', 'Kubernetes', 'gRPC', 'React 19', 'Prometheus'],
      impactMetric: '3.8ms P99 Latency · 45k rps',
      bullets: [
        'Constructed multi-region Kubernetes control plane streaming live node degradation metrics over bidirectional WebSocket connections.',
        'Developed automated pod reallocation heuristics that eliminated cluster cold-starts during unexpected ingress spikes.',
      ],
    },
    {
      title: 'Synapse AI Workflow Canvas',
      role: 'Creator & Lead Developer',
      period: '2026',
      techStack: ['TypeScript', 'React 19', 'Tailwind CSS', 'Vite', 'FastAPI', 'WebAssembly'],
      impactMetric: '-72% Pipeline Debug Time',
      bullets: [
        'Designed virtualized infinite node canvas supporting 500+ simultaneous multi-agent LLM pipeline blocks with streaming token inspection.',
        'Implemented deterministic evaluation scoring and fallback routing with human-in-the-loop review nodes.',
      ],
    },
    {
      title: 'Hyperion Real-Time Spreadsheet',
      role: 'Core Systems Engineer',
      period: '2025',
      techStack: ['TypeScript', 'HTML5 Canvas', 'Rust / Wasm', 'Web Workers'],
      impactMetric: '1M+ Cells · 60 FPS Smooth Scroll',
      bullets: [
        'Created high-density canvas virtual grid capable of recalculating and rendering 1,000,000 spreadsheet cells at steady 60 FPS without UI thread freezing.',
      ],
    },
  ],
  education: [
    {
      institution: 'Bangladesh University of Engineering and Technology (BUET)',
      degree: 'Bachelor of Science in Computer Science and Engineering',
      period: '2016 — 2020',
      location: 'Dhaka, Bangladesh',
      honors: 'Dean\'s Honor List · Magna Cum Laude · Algorithms & Systems Focus',
    },
  ],
  certifications: [
    {
      title: 'Google Cloud Certified Professional Cloud Architect',
      issuer: 'Google Cloud',
      year: '2024',
      credentialId: 'GCP-PCA-98214',
    },
    {
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      year: '2023',
      credentialId: 'AWS-SAA-44910',
    },
    {
      title: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      year: '2023',
      credentialId: 'CKA-88301',
    },
  ],
  languages: [
    { name: 'English', proficiency: 'Professional Working / Fluent' },
    { name: 'Bengali', proficiency: 'Native / Bilingual' },
    { name: '[REPLACE: Language]', proficiency: '[REPLACE: Elementary / Conversational]' },
  ],
};
