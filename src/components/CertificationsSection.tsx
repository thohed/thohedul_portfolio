import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, ExternalLink, ShieldCheck, CheckCircle } from 'lucide-react';
import { CertificationItem } from '../types/portfolio';

export const CertificationsSection: React.FC = () => {
  const { portfolio } = usePortfolio();
  const certs = (portfolio.certifications || []).filter((c) => c.published !== false);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="py-24 border-t border-neutral-800/60 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">Verified Credentials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
              Certifications & Accreditations
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Industry credentials validated by Google Cloud, Amazon Web Services, and the Cloud Native Computing Foundation.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certs.map((cert: CertificationItem, idx: number) => (
            <div
              key={cert.id || idx}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-center text-purple-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    {cert.issueDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-100 mb-2 group-hover:text-white transition-colors">
                  {cert.title}
                </h3>

                <p className="text-xs text-neutral-400 mb-4">
                  Issued by <span className="text-neutral-200 font-medium">{cert.issuer}</span>
                </p>

                {cert.credentialId && (
                  <div className="text-[11px] font-mono text-neutral-500 mb-4 break-all">
                    Credential ID: {cert.credentialId}
                  </div>
                )}
              </div>

              {cert.credentialUrl && (
                <div className="pt-4 border-t border-neutral-800/80">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
