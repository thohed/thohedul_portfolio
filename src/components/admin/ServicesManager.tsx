import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ServiceItem } from '../../types/portfolio';
import {
  Layers,
  Plus,
  Trash2,
  Pencil,
  Check,
  Search,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Code,
  Cpu,
  Cloud,
  Sparkles,
  Database,
  Shield,
  Terminal,
  CheckCircle2,
} from 'lucide-react';

const iconOptions: Array<{ id: ServiceItem['icon']; label: string }> = [
  { id: 'code', label: 'Code & Web' },
  { id: 'cpu', label: 'CPU & Performance' },
  { id: 'cloud', label: 'Cloud & Kubernetes' },
  { id: 'sparkles', label: 'AI & Machine Learning' },
  { id: 'database', label: 'Database & Storage' },
  { id: 'shield', label: 'Security & Auth' },
  { id: 'layers', label: 'Architecture & Systems' },
  { id: 'terminal', label: 'DevOps & Tooling' },
];

export const ServicesManager: React.FC = () => {
  const { portfolio, addService, updateService, deleteService, reorderServices } = usePortfolio();
  const services = portfolio.services || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<ServiceItem['icon']>('code');
  const [deliverablesStr, setDeliverablesStr] = useState('');
  const [published, setPublished] = useState(true);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIcon('code');
    setDeliverablesStr('');
    setPublished(true);
    setEditingServiceId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setTitle(srv.title);
    setDescription(srv.description);
    setIcon(srv.icon);
    setDeliverablesStr((srv.deliverables || []).join('\n'));
    setPublished(srv.published !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFeedback('Title and description are required.');
      return;
    }

    const deliverables = deliverablesStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingServiceId) {
      await updateService(editingServiceId, {
        title: title.trim(),
        description: description.trim(),
        icon,
        deliverables,
        published,
      });
      setFeedback('Service updated successfully.');
    } else {
      await addService({
        title: title.trim(),
        description: description.trim(),
        icon,
        deliverables,
        order: services.length + 1,
        published,
      });
      setFeedback('Service added successfully.');
    }

    setIsModalOpen(false);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service offering?')) {
      await deleteService(id);
      setFeedback('Service deleted.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...services];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    await reorderServices(list);
  };

  const handleTogglePublish = async (srv: ServiceItem) => {
    await updateService(srv.id, { published: !srv.published });
  };

  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Services & Capabilities Management</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage public engineering services, deliverables checklists, icons, and visibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search services by keyword..."
          className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
        />
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800 text-neutral-500 text-xs">
            No services found. Click "Add New Service" to create your first offering.
          </div>
        ) : (
          filteredServices.map((srv, idx) => (
            <div
              key={srv.id}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-blue-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{srv.title}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        srv.published !== false
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {srv.published !== false ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Icon: {srv.icon}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 max-w-2xl">
                    {srv.description}
                  </p>
                  {srv.deliverables && srv.deliverables.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {srv.deliverables.map((d, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[10px] text-neutral-300 bg-neutral-800/80 border border-neutral-700/60 px-2 py-0.5 rounded"
                        >
                          ✓ {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(srv)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors cursor-pointer"
                  title={srv.published !== false ? 'Unpublish' : 'Publish'}
                >
                  {srv.published !== false ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-neutral-500" />}
                </button>

                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={idx === filteredServices.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(srv)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-blue-400 hover:text-blue-300 text-xs transition-colors cursor-pointer"
                  title="Edit Service"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(srv.id)}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/70 border border-red-900/40 text-red-400 text-xs transition-colors cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingServiceId ? 'Edit Service Offering' : 'Add New Service Offering'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Architecture"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Icon Category
                </label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neutral-700"
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your solution, value proposition, and technical approaches..."
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Deliverables (One item per line)
                </label>
                <textarea
                  value={deliverablesStr}
                  onChange={(e) => setDeliverablesStr(e.target.value)}
                  placeholder="Microservices design&#10;Kubernetes cluster setup&#10;24/7 Monitoring topology"
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedToggle"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-neutral-700 text-blue-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="publishedToggle" className="text-xs text-neutral-300 cursor-pointer">
                  Publish to live portfolio website
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {editingServiceId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
