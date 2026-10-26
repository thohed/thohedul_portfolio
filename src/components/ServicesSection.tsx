import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Code, Cpu, Cloud, Layers, Sparkles, Database, Shield, Terminal, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '../types/portfolio';

const iconMap: Record<string, React.ElementType> = {
  code: Code,
  cpu: Cpu,
  cloud: Cloud,
  layers: Layers,
  sparkles: Sparkles,
  database: Database,
  shield: Shield,
  terminal: Terminal,
};

export const ServicesSection: React.FC = () => {
  const { portfolio } = usePortfolio();
  const services = (portfolio.services || []).filter((s) => s.published !== false);

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 border-t border-neutral-800/60 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">Offerings & Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-100">
              Services & Technical Solutions
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Architecting robust foundations for high-scale digital platforms, mission-critical infrastructure, and intelligent applications.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service: ServiceItem, index: number) => {
            const IconComponent = iconMap[service.icon] || Code;
            return (
              <div
                key={service.id || index}
                className="group p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:bg-neutral-900/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:scale-105 transition-all">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-neutral-500">
                      // 0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-neutral-100 mb-3 group-hover:text-white transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="pt-6 border-t border-neutral-800/80 space-y-2">
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block mb-2">Key Deliverables</span>
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
