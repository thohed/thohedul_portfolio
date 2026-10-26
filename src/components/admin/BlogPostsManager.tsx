import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { BlogPost } from '../../types/portfolio';
import {
  BookOpen,
  Plus,
  Trash2,
  Pencil,
  Check,
  Search,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  Tag,
  Copy,
  Sparkles,
  FileText,
  X,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';

export const BlogPostsManager: React.FC = () => {
  const { portfolio, addPost, updatePost, deletePost, reorderPosts } = usePortfolio();
  const posts = portfolio.posts || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [publishedDate, setPublishedDate] = useState('Feb 2026');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setTagsStr('');
    setReadTime('5 min read');
    setPublishedDate(
      new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    );
    setCoverImage('');
    setPublished(true);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setTagsStr((post.tags || []).join(', '));
    setReadTime(post.readTime);
    setPublishedDate(post.publishedDate);
    setCoverImage(post.coverImage || '');
    setPublished(post.published !== false);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    // Auto calculate reading time based on ~200 words/min
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    if (words > 0) {
      const mins = Math.max(1, Math.round(words / 180));
      setReadTime(`${mins} min read`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      setFeedback('Title and excerpt are required.');
      return;
    }

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postSlug = slug.trim() || title.toLowerCase().replace(/\s+/g, '-');

    if (editingId) {
      await updatePost(editingId, {
        title: title.trim(),
        slug: postSlug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        tags,
        readTime: readTime.trim(),
        publishedDate: publishedDate.trim(),
        coverImage: coverImage.trim() || undefined,
        published,
      });
      setFeedback(`Article "${title.trim()}" updated successfully.`);
    } else {
      await addPost({
        title: title.trim(),
        slug: postSlug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        tags,
        readTime: readTime.trim(),
        publishedDate: publishedDate.trim(),
        coverImage: coverImage.trim() || undefined,
        order: posts.length + 1,
        published,
      });
      setFeedback(`Article "${title.trim()}" published successfully.`);
    }

    setIsModalOpen(false);
    resetForm();
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${postTitle}"? It will be removed from your portfolio.`)) {
      await deletePost(id);
      setFeedback('Article deleted successfully.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleDuplicate = async (post: BlogPost) => {
    await addPost({
      title: `${post.title} (Draft Copy)`,
      slug: `${post.slug}-copy-${Date.now().toString(36).slice(-4)}`,
      excerpt: post.excerpt,
      content: post.content,
      tags: [...post.tags],
      readTime: post.readTime,
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      coverImage: post.coverImage,
      order: posts.length + 1,
      published: false, // create as draft
    });
    setFeedback(`Duplicated "${post.title}" as a draft.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...posts];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    await reorderPosts(list);
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const nextState = !post.published;
    await updatePost(post.id, { published: nextState });
    setFeedback(`Article "${post.title}" is now ${nextState ? 'Published' : 'in Draft mode'}.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const publishedCount = posts.filter((p) => p.published !== false).length;
  const draftCount = posts.filter((p) => p.published === false).length;

  const filtered = posts.filter((p) => {
    if (statusFilter === 'published' && p.published === false) return false;
    if (statusFilter === 'draft' && p.published !== false) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Blog & Technical Articles Management</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Create, update, delete, and publish technical insights, system design write-ups, and release notes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-[11px] font-mono text-neutral-400 block uppercase">Total Articles</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">{posts.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-[11px] font-mono text-emerald-400 block uppercase">Published Live</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">{publishedCount}</span>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-[11px] font-mono text-amber-400 block uppercase">Drafts</span>
          <span className="text-2xl font-bold text-amber-400 font-mono mt-1 block">{draftCount}</span>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-[11px] font-mono text-cyan-400 block uppercase">Public Navigation</span>
          <span className="text-xs font-medium text-neutral-200 mt-2 block">Linked as #blog in Navbar</span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, tags, or summary..."
            className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'published' ? 'bg-neutral-800 text-emerald-300' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'draft' ? 'bg-neutral-800 text-amber-300' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>
      </div>

      {/* Articles List */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800 text-neutral-500 text-xs">
            No articles match your search or filter. Click "Write New Article" to add one.
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-cyan-400 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        item.published !== false
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                      }`}
                    >
                      {item.published !== false ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {item.readTime}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mb-2 flex items-center gap-3">
                    <span>{item.publishedDate}</span>
                    <span>·</span>
                    <span>slug: /{item.slug}</span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 max-w-2xl mb-2">
                    {item.excerpt}
                  </p>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700/60"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                {/* Preview Button */}
                <button
                  type="button"
                  onClick={() => setPreviewPost(item)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors cursor-pointer"
                  title="Preview Article Layout"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                </button>

                {/* Publish / Unpublish Toggle */}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    item.published !== false
                      ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-800/50'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title={item.published !== false ? 'Click to unpublish (switch to draft)' : 'Click to publish live'}
                >
                  {item.published !== false ? <Check className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={idx === filtered.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Duplicate / Clone */}
                <button
                  type="button"
                  onClick={() => handleDuplicate(item)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs transition-colors cursor-pointer"
                  title="Duplicate as Draft"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-400 hover:text-cyan-300 text-xs transition-colors cursor-pointer"
                  title="Edit Article"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-950/70 border border-red-900/40 text-red-400 text-xs transition-colors cursor-pointer"
                  title="Delete Article"
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
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>{editingId ? 'Update Technical Article' : 'Create New Technical Article'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Distributed State Sync with Raft in Go"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="distributed-state-sync"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 min read"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    Published Date
                  </label>
                  <input
                    type="text"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    placeholder="Feb 2026"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Go, Distributed Systems, Concurrency, Architecture"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /assets/images/..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Short Excerpt / Teaser *
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise summary explaining the engineering context, trade-offs, and learnings..."
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    Full Article Content
                  </label>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {content.trim() ? `${content.trim().split(/\s+/).filter(Boolean).length} words` : '0 words'}
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write full article body paragraphs, architectural diagrams explanations, code snippets, or markdown..."
                  rows={7}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono text-[11px] leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="postPublishToggle"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-neutral-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="postPublishToggle" className="text-xs text-neutral-300 cursor-pointer font-medium">
                  Publish on public portfolio website (uncheck to save as draft)
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
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
                >
                  {editingId ? 'Update Article' : 'Save & Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl"
            role="dialog"
          >
            <button
              onClick={() => setPreviewPost(null)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span>ADMIN PREVIEW</span>
              <span>·</span>
              <span className={previewPost.published ? 'text-emerald-400' : 'text-amber-400'}>
                {previewPost.published ? 'PUBLISHED' : 'DRAFT'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mb-4">
              <span>{previewPost.publishedDate}</span>
              <span>·</span>
              <span>{previewPost.readTime}</span>
              <span>·</span>
              <span>/{previewPost.slug}</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 pr-8">
              {previewPost.title}
            </h2>

            {previewPost.tags && previewPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {previewPost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono text-cyan-400 px-2 py-1 rounded bg-neutral-800 border border-neutral-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-relaxed space-y-4 pt-4 border-t border-neutral-800">
              <p className="text-neutral-200 font-medium italic text-base">
                {previewPost.excerpt}
              </p>
              <div className="whitespace-pre-line text-neutral-300">
                {previewPost.content}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  setPreviewPost(null);
                  handleOpenEdit(previewPost);
                }}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-400 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit This Post</span>
              </button>
              <button
                onClick={() => setPreviewPost(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
