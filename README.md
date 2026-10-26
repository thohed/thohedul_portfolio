# Emon Islam — Production Portfolio & Dedicated Admin Dashboard

A production-quality personal portfolio website and full-featured, protected administrative control panel engineered with React 19, TypeScript, Tailwind CSS, and Express.

---

## 🚀 Key Architectural Highlights

1. **Strict Route Segregation**:
   - Public Portfolio: `/` (clean, anti-AI slop design, WCAG AA, dark mode, responsive).
   - Dedicated Admin Console: `/admin` (protected by session token and whitelist, redirects to `/admin/login` if unauthenticated).
   - Marked `noindex, nofollow` to prevent search indexing of admin routes.
   - Subdomain deployment switch via `APP_CONFIG.isSubdomainDeployment` in `src/config/appConfig.ts`.

2. **Complete CRUD on Every Portfolio Section**:
   - **Hero & Profile**: Name, titles, avatar uploads, bio, social links, metrics.
   - **Projects**: Filterable showcase, featured toggle, tech tags, deep dive case study modal, code snippets.
   - **Skills**: Grouped category matrix with proficiency sliders and highlights.
   - **Services**: Custom service offerings, icon selection, deliverables checklists, publish toggles, reordering.
   - **Experience**: Career milestones, roles, companies, achievements, and tech stacks.
   - **Education**: Degree titles, universities, graduation periods, and honors.
   - **Certifications**: Industry credentials (GCP, AWS, CKA) with verification URLs and dates.
   - **Testimonials**: Client and executive endorsements, quotes, and author roles.
   - **Articles & Blog**: Technical posts, slugs, excerpts, tags, reading times, and full article reader.
   - **Section Reordering & Visibility**: Drag/up-down reordering and live toggle switches for all 11 public sections.
   - **Site Settings & SEO**: Per-page titles, Open Graph tags, accent colors, theme defaults, and Person JSON-LD schema.
   - **Messages Inbox**: Contact form submissions persisted with read/unread flags, search, and direct mailto replies.

3. **Hybrid Data Layer**:
   - Backend Express API (`/api/portfolio`, `/api/messages`, `/api/stats`, `/api/upload-avatar`) with `.data/portfolio.json` disk persistence.
   - Client-side `localStorage` fallback ensuring uninterrupted offline operation.
   - Ready for Firestore / Firebase Storage drop-in via included `firestore.rules` and `storage.rules`.

---

## 🛠️ Local Development & Running

```bash
# 1. Install dependencies
npm install

# 2. Run local full-stack dev server (Express + Vite)
npm run dev

# 3. Open in browser:
# Public site:  http://localhost:3000/
# Admin login:  http://localhost:3000/admin/login
# Admin console: http://localhost:3000/admin
```

### Admin Credentials:
- **Username / Email**: `admin` or `emonislam79799@gmail.com`
- **Password**: `123456`

---

## 🌐 Deploying on a Dedicated Subdomain (e.g. `admin.mydomain.com`)

To host the admin dashboard on its own subdomain:
1. Open `src/config/appConfig.ts`.
2. Set `isSubdomainDeployment: true` and specify your hostname:
   ```ts
   export const APP_CONFIG = {
     isSubdomainDeployment: true,
     adminSubdomainHostname: 'admin.mydomain.com',
     ...
   };
   ```
3. Set DNS CNAME for `admin.mydomain.com` pointing to your server/hosting provider.
4. When accessed from that subdomain, visiting `/` immediately renders the Admin Dashboard (or prompts login at `/login`).

---

## ☁️ Deploying to Production (Vercel / Firebase Hosting)

### Option A: Node.js / Docker / Cloud Run
```bash
npm run build
npm run start
```

### Option B: Firebase Hosting & Firestore
1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com).
2. Deploy Firestore and Storage security rules:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```
3. Create your admin user in Firebase Authentication with email `emonislam79799@gmail.com`.
4. Deploy the frontend:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 🧩 How to Add a New Section in the Future

To add a new section (e.g., `Speaking & Talks` or `Open Source Contributions`):

1. **Define Schema (`src/types/portfolio.ts`)**:
   Add the item interface:
   ```ts
   export interface TalkItem {
     id: string;
     title: string;
     event: string;
     date: string;
     slideUrl?: string;
     order: number;
     published: boolean;
   }
   ```
   Add to `PortfolioState` and `SectionConfig['id']`.

2. **Add Default Seed Data (`src/data/defaultPortfolio.ts`)**:
   Add sample entries in `DEFAULT_PORTFOLIO.talks = [...]` and register `{ id: 'talks', name: 'Speaking & Talks', enabled: true, order: 12 }` in `sections`.

3. **Expose Context CRUD (`src/context/PortfolioContext.tsx`)**:
   Add `addTalk`, `updateTalk`, `deleteTalk`, and `reorderTalks`.

4. **Create Public Component (`src/components/TalksSection.tsx`)**:
   Render the section with semantic HTML, responsive grids, and dark theme variables. Add to `PublicPortfolioPage.tsx`.

5. **Create Admin Manager (`src/components/admin/TalksManager.tsx`)**:
   Provide the list view, Add modal, Edit modal, Delete confirmation, and Up/Down reordering controls. Add a tab in `AdminDashboard.tsx`.
