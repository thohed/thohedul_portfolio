/**
 * Central application configuration for routing, admin access whitelist, and subdomain deployments.
 */
export const APP_CONFIG = {
  // App info
  appName: 'Emon Islam Portfolio',
  ownerName: 'Emon Islam',
  ownerEmail: 'emonislam79799@gmail.com',

  // Admin access control whitelist (emails permitted to login and manage portfolio)
  adminEmailWhitelist: [
    'emonislam79799@gmail.com',
    'admin@emonislam.dev',
    'admin', // Allow username 'admin' login fallback
  ],

  // URL & Deployment structure
  routes: {
    publicHome: '/',
    adminRoot: '/admin',
    adminLogin: '/admin/login',
  },

  /**
   * Set this to true if deploying the admin dashboard on a dedicated subdomain
   * (e.g. admin.yourdomain.com).
   * When true, visiting root '/' on the admin subdomain serves the admin panel directly.
   */
  isSubdomainDeployment: false,
  adminSubdomainHostname: 'admin.emonislam.dev',

  // SEO & Social
  siteUrl: 'https://emonislam.dev',
  defaultOgImage: '/assets/images/portfolio_hero_portrait_1792818813307.jpg',
};
