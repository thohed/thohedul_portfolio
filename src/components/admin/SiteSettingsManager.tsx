import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { Settings, Save, Check, Globe, Palette, Shield, User, Key } from 'lucide-react';
import { ThemeStyle } from '../../types/portfolio';
import { THEMES } from '../../data/themes';

export const SiteSettingsManager: React.FC = () => {
  const { portfolio, updateSettings, updateTheme } = usePortfolio();
  const { user } = useAuth();
  const currentSettings = portfolio.settings || {
    siteTitle: 'Emon Islam — Senior Full-Stack Engineer & Systems Architect',
    metaDescription: 'Personal portfolio, engineering case studies, distributed systems architectures, and production projects by Emon Islam.',
    accentColor: '#3b82f6',
    defaultTheme: 'obsidian' as ThemeStyle,
    footerText: 'Crafted with precision. Engineered for resilient performance.',
    allowInquiries: true,
    resumePdfUrl: '/assets/resume.pdf',
  };

  const [siteTitle, setSiteTitle] = useState(currentSettings.siteTitle);
  const [metaDescription, setMetaDescription] = useState(currentSettings.metaDescription);
  const [accentColor, setAccentColor] = useState(currentSettings.accentColor);
  const [defaultTheme, setDefaultTheme] = useState<ThemeStyle>(portfolio.theme);
  const [footerText, setFooterText] = useState(currentSettings.footerText);
  const [allowInquiries, setAllowInquiries] = useState(currentSettings.allowInquiries !== false);
  const [resumePdfUrl, setResumePdfUrl] = useState(currentSettings.resumePdfUrl || '');

  // Account change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await updateSettings({
      siteTitle: siteTitle.trim(),
      metaDescription: metaDescription.trim(),
      accentColor: accentColor.trim(),
      defaultTheme,
      footerText: footerText.trim(),
      allowInquiries,
      resumePdfUrl: resumePdfUrl.trim(),
    });

    if (defaultTheme !== portfolio.theme) {
      await updateTheme(defaultTheme);
    }

    // Also update document title dynamically
    if (siteTitle.trim()) {
      document.title = siteTitle.trim();
    }

    setSaving(false);
    setFeedback('Settings and SEO metadata updated successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordFeedback('Please enter your current master password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordFeedback('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback('New passwords do not match.');
      return;
    }

    setPasswordFeedback('Master password updated. Use this new password for next login.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-neutral-400" />
          <span>Site Settings, SEO & Account Security</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Configure site-wide meta headers, default color schemes, footer typography, and administrative credentials.
        </p>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* SEO & Meta Form */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-mono flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>SEO & Metadata Configuration</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Public Page Title (`&lt;title&gt;` & OG Title)
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Meta Description (Search Snippet & Social Share)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Default Palette Theme
              </label>
              <select
                value={defaultTheme}
                onChange={(e) => setDefaultTheme(e.target.value as ThemeStyle)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-700"
              >
                {Object.entries(THEMES).map(([id, theme]) => (
                  <option key={id} value={id}>
                    {theme.name} ({theme.isDark ? 'Dark' : 'Light'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                Accent Brand Color (Hex)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-neutral-700 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Resume PDF Direct File URL
            </label>
            <input
              type="text"
              value={resumePdfUrl}
              onChange={(e) => setResumePdfUrl(e.target.value)}
              placeholder="/assets/resume.pdf"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Public Footer Text
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="inquiryToggle"
              checked={allowInquiries}
              onChange={(e) => setAllowInquiries(e.target.checked)}
              className="rounded border-neutral-700 text-blue-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="inquiryToggle" className="text-xs text-neutral-300 cursor-pointer">
              Enable Contact Inquiry Form (Saves submissions to Dashboard Inbox)
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Site Settings'}</span>
          </button>
        </div>
      </form>

      {/* Account Security Form */}
      <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-mono flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Admin Account & Master Password</span>
        </h3>

        <div className="text-xs text-neutral-400">
          Logged in as: <strong className="text-white">{user?.username || 'admin'}</strong> ({user?.role || 'Super Administrator'})
        </div>

        {passwordFeedback && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium">
            {passwordFeedback}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Update Master Password</span>
          </button>
        </div>
      </form>
    </div>
  );
};
