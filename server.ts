import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_PORTFOLIO_DATA } from './src/server/defaultData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Persistence directory
const DATA_DIR = path.join(__dirname, '.data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory data with file persistence
let portfolioData = INITIAL_PORTFOLIO_DATA;
if (fs.existsSync(PORTFOLIO_FILE)) {
  try {
    portfolioData = JSON.parse(fs.readFileSync(PORTFOLIO_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error loading portfolio.json, using defaults', e);
  }
} else {
  fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(portfolioData, null, 2), 'utf-8');
}

export interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

let messagesData: StoredMessage[] = [
  {
    id: 'msg-seed-1',
    name: 'Sarah Lin',
    email: 'sarah.lin@techventures.io',
    subject: 'Staff Infrastructure Role & Advisory',
    message: 'Hi Emon, loved your recent work on distributed cluster orchestration. We are scaling our engineering team and would love to chat about a senior contract or lead position.',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    read: false,
  },
];

if (fs.existsSync(MESSAGES_FILE)) {
  try {
    messagesData = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error loading messages.json', e);
  }
} else {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messagesData, null, 2), 'utf-8');
}

let statsData = {
  visits: 412,
  lastVisit: new Date().toISOString(),
};

if (fs.existsSync(STATS_FILE)) {
  try {
    statsData = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error loading stats.json', e);
  }
} else {
  fs.writeFileSync(STATS_FILE, JSON.stringify(statsData, null, 2), 'utf-8');
}

const savePortfolio = () => {
  fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(portfolioData, null, 2), 'utf-8');
};

const saveMessages = () => {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messagesData, null, 2), 'utf-8');
};

const saveStats = () => {
  fs.writeFileSync(STATS_FILE, JSON.stringify(statsData, null, 2), 'utf-8');
};

// Sessions store
const activeSessions = new Map<string, { username: string; expiresAt: number }>();

// Auth Middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'] as string;
  const token = customHeader || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required' });
  }

  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  // Extend session
  session.expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  next();
};

/* ------------------- API ROUTES ------------------- */

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Allow login with 'admin' or owner email 'emonislam79799@gmail.com'
  const validUser = username === 'admin' || (typeof username === 'string' && username.toLowerCase() === 'emonislam79799@gmail.com');
  const validPass = password === '123456' || password === 'admin123';

  if (validUser && validPass) {
    const token = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    activeSessions.set(token, {
      username: username === 'admin' ? 'admin' : 'emonislam79799@gmail.com',
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });

    return res.json({
      success: true,
      token,
      user: {
        username: username === 'admin' ? 'admin' : 'emonislam79799@gmail.com',
        email: 'emonislam79799@gmail.com',
        name: 'Emon Islam',
        role: 'Super Administrator',
      },
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid username or password. Please verify credentials.',
  });
});

// GET /api/auth/me
app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  res.json({
    authenticated: true,
    user: {
      username: 'admin',
      name: 'Administrator',
      role: 'Super Administrator',
    },
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const customHeader = req.headers['x-admin-token'] as string;
  const token = customHeader || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

  if (token && activeSessions.has(token)) {
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /api/upload-avatar (Admin only)
app.post('/api/upload-avatar', requireAuth, (req: Request, res: Response) => {
  const { dataUrl } = req.body;
  if (!dataUrl || typeof dataUrl !== 'string') {
    return res.status(400).json({ error: 'dataUrl is required' });
  }

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mime = matches[1];
      const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg';
      const buffer = Buffer.from(matches[2], 'base64');
      const uploadsDir = path.join(__dirname, 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filename = `avatar_${Date.now()}.${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      return res.json({ success: true, url: `/uploads/${filename}` });
    }

    return res.json({ success: true, url: dataUrl });
  } catch (err: any) {
    console.error('Failed to process avatar upload', err);
    return res.status(500).json({ error: 'Failed to process avatar image' });
  }
});

// GET /api/portfolio (Public)
app.get('/api/portfolio', (req: Request, res: Response) => {
  res.json(portfolioData);
});

// PUT /api/portfolio (Admin only)
app.put('/api/portfolio', requireAuth, (req: Request, res: Response) => {
  if (req.body && typeof req.body === 'object') {
    portfolioData = {
      ...portfolioData,
      ...req.body,
    };
    savePortfolio();
    return res.json({ success: true, portfolio: portfolioData });
  }
  res.status(400).json({ error: 'Invalid payload' });
});

// POST /api/projects (Admin only - create/post project)
app.post('/api/projects', requireAuth, (req: Request, res: Response) => {
  const projectData = req.body;
  if (!projectData || !projectData.title) {
    return res.status(400).json({ error: 'Project title is required' });
  }

  const newProject = {
    ...projectData,
    id: projectData.id || `proj-${Date.now()}`,
  };

  portfolioData.projects = [newProject, ...(portfolioData.projects || [])];
  savePortfolio();
  res.status(201).json({ success: true, project: newProject });
});

// PUT /api/projects/:id (Admin only - update project)
app.put('/api/projects/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const index = portfolioData.projects?.findIndex((p: any) => p.id === id);
  if (index === -1 || index === undefined) {
    return res.status(404).json({ error: 'Project not found' });
  }

  portfolioData.projects[index] = {
    ...portfolioData.projects[index],
    ...updates,
  };
  savePortfolio();
  res.json({ success: true, project: portfolioData.projects[index] });
});

// DELETE /api/projects/:id (Admin only - delete project)
app.delete('/api/projects/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const initialCount = portfolioData.projects?.length || 0;
  portfolioData.projects = (portfolioData.projects || []).filter((p: any) => p.id !== id);

  if (portfolioData.projects.length < initialCount) {
    savePortfolio();
    return res.json({ success: true, message: 'Project deleted successfully' });
  }
  res.status(404).json({ error: 'Project not found' });
});

// POST /api/portfolio/reset (Admin only)
app.post('/api/portfolio/reset', requireAuth, (req: Request, res: Response) => {
  portfolioData = JSON.parse(JSON.stringify(INITIAL_PORTFOLIO_DATA));
  savePortfolio();
  res.json({ success: true, portfolio: portfolioData });
});

// GET /api/messages (Admin only)
app.get('/api/messages', requireAuth, (req: Request, res: Response) => {
  res.json(messagesData);
});

// POST /api/messages (Public - Contact Form)
app.post('/api/messages', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const newMessage: StoredMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: String(name).trim(),
    email: String(email).trim(),
    subject: subject ? String(subject).trim() : 'Portfolio Inquiry',
    message: String(message).trim(),
    timestamp: new Date().toISOString(),
    read: false,
  };

  messagesData.unshift(newMessage);
  saveMessages();

  res.status(201).json({ success: true, message: newMessage });
});

// PATCH /api/messages/:id/read (Admin only)
app.patch('/api/messages/:id/read', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const msg = messagesData.find((m) => m.id === id);
  if (msg) {
    msg.read = true;
    saveMessages();
    return res.json({ success: true, message: msg });
  }
  res.status(404).json({ error: 'Message not found' });
});

// DELETE /api/messages/:id (Admin only)
app.delete('/api/messages/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = messagesData.length;
  messagesData = messagesData.filter((m) => m.id !== id);
  if (messagesData.length < initialLength) {
    saveMessages();
    return res.json({ success: true, message: 'Deleted message successfully' });
  }
  res.status(404).json({ error: 'Message not found' });
});

// GET /api/stats (Admin only)
app.get('/api/stats', requireAuth, (req: Request, res: Response) => {
  const totalMessages = messagesData.length;
  const unreadMessages = messagesData.filter((m) => !m.read).length;
  const totalProjects = portfolioData.projects ? portfolioData.projects.length : 0;

  res.json({
    totalMessages,
    unreadMessages,
    totalProjects,
    visits: statsData.visits,
    lastVisit: statsData.lastVisit,
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
  });
});

// POST /api/stats/visit (Public)
app.post('/api/stats/visit', (req: Request, res: Response) => {
  statsData.visits += 1;
  statsData.lastVisit = new Date().toISOString();
  saveStats();
  res.json({ success: true, visits: statsData.visits });
});

// GET /api/resume/download (Public - Direct PDF File Download)
app.get('/api/resume/download', (req: Request, res: Response) => {
  const preferredPdf = path.join(__dirname, 'public', 'Md-Thohedul-Islam-CV.pdf');
  const fallbackPdf = path.join(__dirname, 'public', 'Emon_Islam_CV.pdf');
  const targetPdf = fs.existsSync(preferredPdf) ? preferredPdf : (fs.existsSync(fallbackPdf) ? fallbackPdf : null);

  if (targetPdf) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Md-Thohedul-Islam-CV.pdf"');
    return fs.createReadStream(targetPdf).pipe(res);
  }
  return res.status(404).json({ error: 'Resume PDF file not found' });
});

/* ------------------- DEV & PRODUCTION SERVER ------------------- */

const startServer = async () => {
  // Serve user uploaded images
  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

  if (process.env.NODE_ENV === 'production') {
    // Serve production static assets
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Vite middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server with Vite dev middleware running on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
