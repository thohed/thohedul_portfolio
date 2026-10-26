import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, MapPin, Send, CheckCircle, Copy, Check, Clock, Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { portfolio, addMessage, setIsStudioOpen } = usePortfolio();
  const { profile } = portfolio;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    addMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject || 'Portfolio Inquiry',
      message: formData.message,
    });

    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
TITLE:${profile.title}
EMAIL;TYPE=INTERNET,WORK:${profile.email}
NOTE:${profile.tagline}
URL:${profile.social.website || 'https://emonislam.dev'}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.name.toLowerCase().replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="contact" className="py-20 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Inquiries & Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-medium mb-2">
                Initiate Conversation
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
                Let's Build Something Exceptional
              </h2>
              <p className="text-base text-neutral-400 mt-3 font-light leading-relaxed">
                Whether you need architectural advisory, a lead engineer to build your next core product, or a contract specialist for distributed systems.
              </p>
            </div>

            {/* Direct Email Card */}
            <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Direct Inbox</div>
              <div className="text-base font-semibold text-white truncate font-mono">
                {profile.email}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                </button>
                <button
                  onClick={downloadVCard}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Download vCard</span>
                </button>
              </div>
            </div>

            {/* Timezone & Location Details */}
            <div className="space-y-3 text-xs sm:text-sm text-neutral-300 font-light">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Based in {profile.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Active hours: 09:00 — 18:00 GMT+6 (Overlaps easily with EU & US mornings)</span>
              </div>
            </div>

            {/* Social Grid */}
            <div className="pt-4 border-t border-neutral-800/80 flex items-center gap-6 text-sm text-neutral-400">
              <a
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href={profile.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter / X</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in duration-300">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
                <h3 className="text-xl font-bold text-white font-display">Message Received</h3>
                <p className="text-sm text-neutral-300 max-w-md">
                  Thank you for reaching out! Your inquiry has been stored directly into your built-in Studio Inbox.
                </p>
                <button
                  onClick={() => setIsStudioOpen(true)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                >
                  View in Studio Inbox →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-medium text-neutral-300">
                      Your Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Alexander Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-neutral-300">
                      Work Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-medium text-neutral-300">
                    Subject / Project Context
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="e.g. Q4 Cloud Architecture Contract / Advisory"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-neutral-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Describe your timeline, project goals, tech stack, or challenges..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors resize-y"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    Typical response within 24 business hours
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
