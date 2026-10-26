# Google AI Studio Prompt: Professional Portfolio + Separate Admin Dashboard

Copy everything below the line into AI Studio (Build mode). Replace the [BRACKETED] values with your own details.

---

## ROLE
You are a senior full-stack engineer and UI/UX designer. Build a complete, production-quality **personal portfolio website** with a **separate admin dashboard** on its own URL. Every piece of content on the public portfolio must be fully manageable (view, add, edit, delete, reorder, publish/unpublish) from the dashboard, with no code changes needed.

## ABOUT ME (seed content)
- Name: [YOUR NAME]
- Title/Role: [e.g. Full-Stack Developer / UI Designer]
- Short bio: [2-3 sentences]
- Email: [EMAIL]
- Location: [CITY, COUNTRY]
- Social links: [GitHub, LinkedIn, Twitter/X, Facebook, etc.]
- Skills: [list]
- Projects: [list with title, short description, tech, live link, repo link]
- Experience: [company, role, dates, description]
- Education: [institute, degree, dates]

Use realistic placeholder content wherever I haven't provided details, so the site never looks empty.

## TECH STACK
- React + Vite + TypeScript
- Tailwind CSS (design tokens via CSS variables, light and dark mode)
- React Router (two separate route trees: public site and admin)
- Firebase: Authentication (email/password), Firestore (data), Storage (images and resume PDF). If Firebase is unavailable, fall back to a clean data-access layer backed by localStorage, so the backend can be swapped later.
- Framer Motion for subtle animation
- React Hook Form + Zod for form validation
- Lucide icons

## URL STRUCTURE (IMPORTANT)
- Public portfolio: `/`
- Admin dashboard on a **different URL**: `/admin` (login at `/admin/login`)
- Admin routes are never linked from the public site and are marked `noindex`.
- Structure the code so the dashboard can also be deployed on its own subdomain (e.g. `admin.mydomain.com`) by changing one config value.
- Unauthenticated visits to `/admin/*` redirect to `/admin/login`. Only the owner account (email whitelist in config) may access the dashboard.

## PUBLIC PORTFOLIO SECTIONS (all data-driven from the database)
1. **Navbar**: logo/name, section links with smooth scroll, theme toggle, "Download CV" button
2. **Hero**: name, animated role text, short intro, profile photo, CTA buttons (View Work / Contact)
3. **About**: bio, photo, quick facts, resume download
4. **Skills**: grouped by category with proficiency level
5. **Services**: icon, title, description cards
6. **Projects**: filterable grid by tag/category, project detail modal or page (gallery, description, tech stack, live and repo links, featured flag)
7. **Experience** and **Education**: timeline layout
8. **Certifications/Achievements**
9. **Testimonials**: carousel
10. **Blog/Articles** (optional, toggleable from dashboard)
11. **Contact**: working form that saves messages to the database, plus social links
12. **Footer**

Each section can be shown or hidden and reordered from the dashboard.

## ADMIN DASHBOARD (`/admin`)
Layout: sidebar navigation, top bar with user menu and logout, responsive (collapses to a drawer on mobile).

**Overview page**: counts (projects, skills, messages, unread messages), recent messages, recent edits, quick-add buttons.

**A management page for EVERY section above, each with full CRUD:**
- **List view**: searchable, sortable table or card list, status badge (Published/Draft), pagination if needed
- **Add**: form in a modal or page with validation
- **Edit**: prefilled form, save with success toast
- **Delete**: confirmation dialog, then removal (also delete associated images from Storage)
- **Reorder**: drag-and-drop for orderable items (projects, skills, experience, etc.)
- **Publish/Unpublish toggle** and **Featured toggle** where relevant
- **Image upload**: preview, size and type validation, replace and remove

**Additional dashboard pages:**
- **Profile/Hero/About editor**: name, title, bio, photo, resume PDF upload, social links
- **Messages inbox**: read/unread, view, mark as read, delete, reply via mailto link
- **Site Settings**: site title, meta description, favicon, accent color, default theme, section visibility and order, footer text
- **SEO**: per-page title, description, Open Graph image
- **Account**: change password

Changes made in the dashboard must appear on the public site immediately (real-time listeners or refetch on navigation).

## DATA MODEL (Firestore collections)
`profile`, `settings`, `skills`, `services`, `projects`, `experience`, `education`, `certifications`, `testimonials`, `posts`, `messages`.
Every item has: `id`, `createdAt`, `updatedAt`, `order`, `published`.
Create the data-access layer as one service module per collection with typed `list`, `get`, `create`, `update`, `remove`, and `reorder` functions, so the UI never talks to Firebase directly.

## SECURITY
- Firestore rules: public **read** only for published documents; **write** only for the authenticated admin; `messages` allows public **create** only (with field validation and basic rate limiting), and read/delete by admin only.
- Storage rules: public read, admin-only write, file size and content-type limits.
- Never hard-code secrets; use environment variables and provide a `.env.example`.
- Sanitize any rich text before rendering.
- Include the final rules files in the output.

## DESIGN REQUIREMENTS
- Modern, clean, professional look: strong typographic hierarchy, generous spacing, consistent 8px grid, one accent color, soft shadows, rounded corners
- Light and dark mode with a saved preference
- Fully responsive (mobile first), tested at 360px, 768px, and 1280px+
- Accessible: semantic HTML, keyboard navigation, focus states, alt text, WCAG AA contrast
- Fast: lazy-load images, code-split the admin bundle from the public bundle, skeleton loaders, good Lighthouse scores
- Polished empty states, loading states, and error states throughout
- The dashboard has its own distinct, functional UI (clean data-focused layout), not the same styling as the public site

## SEO
Meta tags, Open Graph and Twitter cards, sitemap, robots.txt (disallow `/admin`), semantic headings, JSON-LD `Person` schema.

## DELIVERABLES
1. Complete working project with a clear folder structure (`/src/pages/public`, `/src/pages/admin`, `/src/services`, `/src/components`, `/src/lib`, etc.)
2. Seed script or first-run seeding that fills the database with my details and sample content
3. Firestore and Storage security rules
4. `.env.example` and step-by-step setup instructions: creating the Firebase project, creating the admin user, running locally, deploying (Firebase Hosting or Vercel), and connecting a custom domain, including how to host `/admin` on a subdomain
5. A short README describing how to add a new section in the future

## ACCEPTANCE CHECKLIST (verify before finishing)
- [ ] `/` shows the full portfolio; `/admin` is a separate protected dashboard
- [ ] Every public section has a dashboard page with working Add, Edit, Delete, and Reorder
- [ ] Image and resume uploads work and old files are cleaned up on delete
- [ ] Hiding a section or unpublishing an item removes it from the public site
- [ ] Contact form submissions appear in the dashboard inbox
- [ ] Non-admin users cannot access or write any admin data
- [ ] Responsive, dark mode works, no console errors, no broken links
- [ ] Forms validate and show clear error messages

Build it step by step, keep the code clean and typed, and explain any assumption you make at the end.
