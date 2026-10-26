import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { EducationItem } from '../../types/portfolio';
import {
  GraduationCap,
  Plus,
  Trash2,
  Pencil,
  Check,
  Search,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  Award,
} from 'lucide-react';

export const EducationManager: React.FC = () => {
  const { portfolio, addEducation, updateEducation, deleteEducation, reorderEducation } = usePortfolio();
  const educationList = portfolio.education || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [period, setPeriod] = useState('2018 — 2022');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [description, setDescription] = useState('');
  const [honors, setHonors] = useState('');
  const [published, setPublished] = useState(true);

  const resetForm = () => {
    setInstitution('');
    setDegree('');
    setFieldOfStudy('');
    setPeriod('2018 — 2022');
    setLocation('Dhaka, Bangladesh');
    setDescription('');
    setHonors('');
    setPublished(true);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EducationItem) => {
    setEditingId(item.id);
    setInstitution(item.institution);
    setDegree(item.degree);
    setFieldOfStudy(item.fieldOfStudy || '');
    setPeriod(item.period);
    setLocation(item.location);
    setDescription(item.description);
    setHonors(item.honors || '');
    setPublished(item.published !== false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) {
      setFeedback('Institution and degree are required.');
      return;
    }

    if (editingId) {
      await updateEducation(editingId, {
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        period: period.trim(),
        location: location.trim(),
        description: description.trim(),
        honors: honors.trim(),
        published,
      });
      setFeedback('Education entry updated successfully.');
    } else {
      await addEducation({
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        period: period.trim(),
        location: location.trim(),
        description: description.trim(),
        honors: honors.trim(),
        order: educationList.length + 1,
        published,
      });
      setFeedback('Education entry added successfully.');
    }

    setIsModalOpen(false);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      await deleteEducation(id);
      setFeedback('Education entry deleted.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...educationList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    await reorderEducation(list);
  };

  const handleTogglePublish = async (item: EducationItem) => {
    await updateEducation(item.id, { published: !item.published });
  };

  const filtered = educationList.filter(
    (e) =>
      e.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.fieldOfStudy && e.fieldOfStudy.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span>Education & Degrees Management</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage academic degrees, universities, periods, honors, and timeline order.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
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
          placeholder="Search education by degree or institution..."
          className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800 text-neutral-500 text-xs">
            No education entries found. Click "Add Education" to add your academic degrees.
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-emerald-400 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{item.institution}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        item.published !== false
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {item.published !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-400 font-medium mb-1">
                    {item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-mono mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 max-w-2xl line-clamp-2">
                    {item.description}
                  </p>
                  {item.honors && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-[11px]">
                      <Award className="w-3 h-3" />
                      <span>{item.honors}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors cursor-pointer"
                  title={item.published !== false ? 'Unpublish' : 'Publish'}
                >
                  {item.published !== false ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-neutral-500" />}
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
                  disabled={idx === filtered.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 hover:text-emerald-300 text-xs transition-colors cursor-pointer"
                  title="Edit Education"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/70 border border-red-900/40 text-red-400 text-xs transition-colors cursor-pointer"
                  title="Delete Education"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingId ? 'Edit Education Entry' : 'Add New Academic Degree'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Institution / University *
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Bangladesh University of Engineering and Technology (BUET)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="2016 — 2020"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dhaka, Bangladesh"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Description / Focus Areas
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key coursework, thesis, leadership, research..."
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Honors / Accreditations
                </label>
                <input
                  type="text"
                  value={honors}
                  onChange={(e) => setHonors(e.target.value)}
                  placeholder="e.g. Dean's Honor List · Magna Cum Laude"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="eduPublishToggle"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-neutral-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="eduPublishToggle" className="text-xs text-neutral-300 cursor-pointer">
                  Publish on public portfolio
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
