import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import CV data dynamically or define matching single-source CV structure
const cvData = {
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
  ],
  education: [
    {
      institution: 'Bangladesh University of Engineering and Technology (BUET)',
      degree: 'Bachelor of Science in Computer Science and Engineering',
      period: '2016 — 2020',
      location: 'Dhaka, Bangladesh',
      honors: "Dean's Honor List · Magna Cum Laude · Algorithms & Systems Focus",
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

export function buildResumePdf(data = cvData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const maxY = pageHeight - margin;
  let y = margin;

  const ensureSpace = (neededHeight) => {
    if (y + neededHeight > maxY) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  const renderSectionHeading = (title) => {
    ensureSpace(12);
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(17, 24, 39);
    doc.text(title.toUpperCase(), margin, y);
    y += 2;

    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(17, 24, 39);
  doc.text(data.header.name, margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(75, 85, 99);
  doc.text(data.header.location, pageWidth - margin, y, { align: 'right' });
  y += 7.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(29, 78, 216);
  doc.text(data.header.title, margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(55, 65, 81);

  const contactItems = [
    data.header.email,
    data.header.phone,
    data.header.portfolioUrl.replace(/^https?:\/\//, ''),
    data.header.github,
    data.header.linkedin,
  ].filter(Boolean);

  const contactLine = contactItems.join('   |   ');
  const splitContact = doc.splitTextToSize(contactLine, contentWidth);
  doc.text(splitContact, margin, y);
  y += splitContact.length * 4 + 2;

  doc.setDrawColor(17, 24, 39);
  doc.setLineWidth(0.75);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // 1. Summary
  renderSectionHeading('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(31, 41, 55);
  const splitSummary = doc.splitTextToSize(data.summary, contentWidth);
  ensureSpace(splitSummary.length * 4.6);
  doc.text(splitSummary, margin, y);
  y += splitSummary.length * 4.6 + 3;

  // 2. Skills
  renderSectionHeading('Core Technical Skills');
  data.skills.forEach((cat) => {
    const categoryLabel = `${cat.category}: `;
    const skillsString = cat.skills.join(', ');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    const labelWidth = doc.getTextWidth(categoryLabel);

    doc.setFont('helvetica', 'normal');
    const availableWidthForSkills = contentWidth - labelWidth;
    const splitSkills = doc.splitTextToSize(skillsString, Math.max(availableWidthForSkills, 120));
    const blockHeight = Math.max(splitSkills.length * 4.2, 4.5);

    ensureSpace(blockHeight + 1);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);
    doc.text(categoryLabel, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81);
    doc.text(splitSkills, margin + labelWidth, y);

    y += blockHeight + 1.2;
  });
  y += 2;

  // 3. Experience
  renderSectionHeading('Work Experience');
  data.experience.forEach((exp) => {
    let jobHeight = 10;
    const bulletSplitLines = [];

    exp.bullets.forEach((b) => {
      const split = doc.splitTextToSize(`•  ${b}`, contentWidth - 4);
      bulletSplitLines.push(split);
      jobHeight += split.length * 4.2 + 1;
    });

    ensureSpace(Math.min(jobHeight, 60));

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(17, 24, 39);
    doc.text(exp.role, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(75, 85, 99);
    doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(29, 78, 216);
    doc.text(exp.company, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text(exp.location, pageWidth - margin, y, { align: 'right' });
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);

    bulletSplitLines.forEach((splitBullet) => {
      ensureSpace(splitBullet.length * 4.2);
      doc.text(splitBullet, margin + 2, y);
      y += splitBullet.length * 4.2 + 1;
    });

    y += 2.5;
  });

  // 4. Projects
  renderSectionHeading('Selected Projects');
  data.projects.forEach((proj) => {
    let projHeight = 11;
    const bulletSplitLines = [];

    proj.bullets.forEach((b) => {
      const split = doc.splitTextToSize(`•  ${b}`, contentWidth - 4);
      bulletSplitLines.push(split);
      projHeight += split.length * 4.2 + 1;
    });

    ensureSpace(Math.min(projHeight, 45));

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(17, 24, 39);
    doc.text(proj.title, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(29, 78, 216);
    doc.text(proj.impactMetric || proj.period, pageWidth - margin, y, { align: 'right' });
    y += 4.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(75, 85, 99);
    const techText = `Role: ${proj.role}  |  Tech: ${proj.techStack.join(', ')}`;
    const splitTech = doc.splitTextToSize(techText, contentWidth);
    doc.text(splitTech, margin, y);
    y += splitTech.length * 3.8 + 1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);

    bulletSplitLines.forEach((splitBullet) => {
      ensureSpace(splitBullet.length * 4.2);
      doc.text(splitBullet, margin + 2, y);
      y += splitBullet.length * 4.2 + 1;
    });

    y += 2.5;
  });

  // 5. Education
  renderSectionHeading('Education');
  data.education.forEach((edu) => {
    ensureSpace(14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(17, 24, 39);
    doc.text(edu.institution, margin, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(75, 85, 99);
    doc.text(edu.period, pageWidth - margin, y, { align: 'right' });
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);
    doc.text(edu.degree, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(107, 114, 128);
    doc.text(edu.location, pageWidth - margin, y, { align: 'right' });
    y += 4;

    if (edu.honors) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text(`Honors: ${edu.honors}`, margin, y);
      y += 4.5;
    }
  });

  // 6. Certifications
  if (data.certifications && data.certifications.length > 0) {
    renderSectionHeading('Certifications');
    data.certifications.forEach((cert) => {
      ensureSpace(8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      doc.text(cert.title, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      doc.text(cert.year, pageWidth - margin, y, { align: 'right' });
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      const issuerText = cert.credentialId
        ? `${cert.issuer}  ·  Credential ID: ${cert.credentialId}`
        : cert.issuer;
      doc.text(issuerText, margin, y);
      y += 4.5;
    });
  }

  // 7. Languages
  if (data.languages && data.languages.length > 0) {
    renderSectionHeading('Languages');
    ensureSpace(8);

    const langString = data.languages
      .map((l) => `${l.name} (${l.proficiency})`)
      .join('   •   ');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(31, 41, 55);
    const splitLangs = doc.splitTextToSize(langString, contentWidth);
    doc.text(splitLangs, margin, y);
    y += splitLangs.length * 4.2;
  }

  return doc;
}

const publicDir = path.join(__dirname, '..', 'public');
const assetsDir = path.join(publicDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const doc = buildResumePdf();
const buffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(path.join(publicDir, 'Md-Thohedul-Islam-CV.pdf'), buffer);
fs.writeFileSync(path.join(publicDir, 'Emon_Islam_CV.pdf'), buffer);
fs.writeFileSync(path.join(assetsDir, 'resume.pdf'), buffer);
console.log('Successfully generated public/Md-Thohedul-Islam-CV.pdf, public/Emon_Islam_CV.pdf and public/assets/resume.pdf');
