import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Image,
  Music,
  Video,
  FileCode,
  List,
  ListOrdered,
  MoreHorizontal,
  Check,
  X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { campuses } from '../data/mockData';

const SECTIONS = [
  'Week 1 Survival',
  'Living',
  'Food',
  'IRC & Skills',
  'Experiences',
  'Academics',
  'How-To',
];

const STYLE_OPTIONS = [
  { value: 'p', label: 'Normal text' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'blockquote', label: 'Quote block' },
];

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
        active ? 'bg-[#fbf2f3] text-[#991b1b]' : 'text-[rgba(30,41,59,0.7)] hover:bg-[#fbf2f3] hover:text-[#1e293b]'
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-[rgba(30,41,59,0.15)] mx-1" />;
}

export default function WriteArticle() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [campusId, setCampusId] = useState<string>('');
  const [section, setSection] = useState<string>('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [authors, setAuthors] = useState<string[]>(['Anthapu Gopal Reddy']);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageModalTab, setImageModalTab] = useState<'upload' | 'url'>('upload');
  const [videoModalTab, setVideoModalTab] = useState<'upload' | 'embed'>('embed');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ title?: boolean; campus?: boolean; body?: boolean }>({});
  const [showMiniToolbar, setShowMiniToolbar] = useState(false);
  const [miniToolbarPos, setMiniToolbarPos] = useState({ top: 0, left: 0 });
  const miniToolbarRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    bodyRef.current?.focus();
  }, []);

  const handleBodyInput = useCallback(() => {
    setSaved(false);
    setSaving(true);
    const t = setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const handler = () => handleBodyInput();
    el.addEventListener('input', handler);
    return () => el.removeEventListener('input', handler);
  }, [handleBodyInput]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !bodyRef.current?.contains(sel.anchorNode)) {
        setShowMiniToolbar(false);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMiniToolbarPos({
        top: rect.top + window.scrollY - 50,
        left: rect.left + (rect.width / 2) - 120,
      });
      setShowMiniToolbar(true);
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const handleSubmit = () => {
    const errors: typeof validationErrors = {};
    if (!title.trim()) errors.title = true;
    if (!campusId) errors.campus = true;
    if (!bodyRef.current?.innerText.trim()) errors.body = true;
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowSuccessModal(true);
  };

  const addAuthor = () => {
    setAuthors([...authors, '']);
  };

  const removeAuthor = (i: number) => {
    setAuthors(authors.filter((_, idx) => idx !== i));
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      execCommand('insertImage', imageUrl);
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  const insertLink = () => {
    if (linkUrl.trim()) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkPopover(false);
    }
  };

  const campusName = campuses.find((c) => String(c.id) === campusId)?.name ?? 'St. Mary\'s';

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Zone 1 — Editor Header */}
      <header
        className="sticky top-16 z-40 flex items-center justify-between h-[52px] px-6 border-b"
        style={{ backgroundColor: '#fff8eb', borderColor: 'rgba(30, 41, 59, 0.1)' }}
      >
        <Link
          to="/contribute"
          className="flex items-center gap-2 text-[rgba(30,41,59,0.7)] hover:text-[#1e293b] text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {saving ? (
            <span className="text-[rgba(30,41,59,0.5)]">Saving...</span>
          ) : saved ? (
            <span className="text-green-600">🟢 Saved</span>
          ) : (
            <span className="text-amber-600">Unsaved</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md border text-[#991b1b] bg-white hover:bg-[#fbf2f3] transition-colors text-sm font-medium"
            style={{ borderColor: '#991b1b' }}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-[#991b1b] text-white hover:bg-[#b91c1c] transition-colors text-sm font-medium"
          >
            Submit for Review
          </button>
        </div>
      </header>

      {/* Zone 2 — Formatting Toolbar */}
      <div
        className="sticky top-[116px] z-30 flex items-center gap-1 px-6 h-11 border-b"
        style={{ backgroundColor: '#ffffff', borderColor: 'rgba(30, 41, 59, 0.1)' }}
      >
        <ToolbarButton onClick={() => execCommand('undo')} title="Undo">
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('redo')} title="Redo">
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        <select
          className="h-8 px-2 rounded-md border text-sm bg-white"
          style={{ borderColor: 'rgba(30, 41, 59, 0.15)' }}
          onChange={(e) => execCommand('formatBlock', e.target.value)}
        >
          {STYLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ToolbarDivider />

        <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('strikeThrough')} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const sel = window.getSelection();
            const text = sel?.toString() || '';
            if (text) {
              document.execCommand('insertHTML', false, `<code>${text}</code>`);
            } else {
              document.execCommand('insertHTML', false, '<code></code>');
            }
            bodyRef.current?.focus();
          }}
          title="Inline code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={() => setShowLinkPopover(true)} title="Link">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => setShowImageModal(true)} title="Image">
          <Image className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}} title="Audio">
          <Music className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => setShowVideoModal(true)} title="Video">
          <Video className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => {}} title="Embed">
          <FileCode className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bullet list">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarDivider />

        <div className="relative group">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-md text-[rgba(30,41,59,0.7)] hover:bg-[#fbf2f3] hover:text-[#1e293b]"
            title="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating Mini Toolbar */}
      {showMiniToolbar && (
        <div
          ref={miniToolbarRef}
          className="fixed z-[100] flex items-center gap-1 rounded-lg px-2 py-1.5"
          style={{
            top: miniToolbarPos.top,
            left: Math.max(16, miniToolbarPos.left),
            backgroundColor: '#1e293b',
            boxShadow: '0 4px 12px rgba(30, 41, 59, 0.25)',
          }}
        >
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="w-7 h-7 flex items-center justify-center rounded text-white hover:bg-white/10"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="w-7 h-7 flex items-center justify-center rounded text-white hover:bg-white/10"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('strikeThrough')}
            className="w-7 h-7 flex items-center justify-center rounded text-white hover:bg-white/10"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowLinkPopover(true)}
            className="w-7 h-7 flex items-center justify-center rounded text-white hover:bg-white/10"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', 'h1')}
            className="w-7 h-7 flex items-center justify-center rounded text-white text-xs font-bold hover:bg-white/10"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', 'h2')}
            className="w-7 h-7 flex items-center justify-center rounded text-white text-xs font-bold hover:bg-white/10"
          >
            H2
          </button>
        </div>
      )}

      {/* Link Popover */}
      {showLinkPopover && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowLinkPopover(false)} />
          <div
            className="fixed z-50 p-3 rounded-lg bg-white shadow-lg"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 320,
              boxShadow: '0 4px 16px rgba(30, 41, 59, 0.12)',
            }}
          >
            <input
              type="url"
              placeholder="Paste or type URL..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm mb-2"
              style={{ borderColor: 'rgba(30, 41, 59, 0.1)' }}
              autoFocus
            />
            <button
              type="button"
              onClick={insertLink}
              className="w-full py-2 rounded-md bg-[#991b1b] text-white text-sm font-medium hover:bg-[#b91c1c]"
            >
              Insert Link
            </button>
          </div>
        </>
      )}

      {/* Zone 3 — Writing Canvas */}
      <main className="max-w-[720px] mx-auto px-6 py-12" style={{ minHeight: 'calc(100vh - 96px)' }}>
        {/* Meta Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={campusId}
            onChange={(e) => setCampusId(e.target.value)}
            className={`px-[14px] py-1.5 rounded-[100px] text-[13px] bg-[#fbf2f3] border transition-colors ${
              validationErrors.campus ? 'border-[#991b1b]' : 'border-[rgba(30,41,59,0.15)] hover:border-[#991b1b]'
            }`}
            style={{ color: '#1e293b' }}
          >
            <option value="">Campus: Select ▾</option>
            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="px-[14px] py-1.5 rounded-[100px] text-[13px] bg-[#fbf2f3] border border-[rgba(30,41,59,0.15)] hover:border-[#991b1b] transition-colors"
            style={{ color: '#1e293b' }}
          >
            <option value="">Section: Select ▾</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`font-playfair w-full text-[42px] font-bold border-none outline-none bg-transparent mb-2 placeholder-[rgba(30,41,59,0.3)] ${
            validationErrors.title ? 'border-b-2 border-[#991b1b] shake' : ''
          }`}
          style={{ color: '#1e293b' }}
          title={validationErrors.title ? 'Add a title' : undefined}
        />

        {/* Subtitle */}
        <input
          type="text"
          placeholder="Add a subtitle..."
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="font-dm-sans w-full text-[20px] border-none outline-none bg-transparent mb-6 placeholder-[rgba(30,41,59,0.5)]"
          style={{ color: 'rgba(30, 41, 59, 0.5)' }}
        />

        {/* Author Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {authors.map((a, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-[100px] text-[13px] bg-[#fbf2f3] border"
              style={{ borderColor: 'rgba(30, 41, 59, 0.1)', color: '#1e293b' }}
            >
              {a || 'Author name'}
              <button
                type="button"
                onClick={() => removeAuthor(i)}
                className="text-[rgba(30,41,59,0.5)] hover:text-[#1e293b]"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={addAuthor}
            className="text-[13px] hover:text-[#991b1b] transition-colors"
            style={{ color: 'rgba(30, 41, 59, 0.4)' }}
          >
            + Add co-author
          </button>
        </div>

        {/* Divider */}
        <div className="h-px my-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.08)' }} />

        {/* Body Editor */}
        <div
          ref={bodyRef}
          contentEditable
          data-placeholder="Start writing..."
          className={`font-dm-sans min-h-[400px] w-full border-none outline-none bg-transparent ${
            validationErrors.body ? 'ring-2 ring-[#991b1b] rounded' : ''
          }`}
          style={{
            fontSize: '18px',
            lineHeight: 1.8,
            color: '#1e293b',
          }}
          suppressContentEditableWarning
        />
      </main>

      {/* Image Modal */}
      {showImageModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowImageModal(false)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] p-8 rounded-xl bg-white"
            style={{ boxShadow: '0 8px 32px rgba(30, 41, 59, 0.15)' }}
          >
            <h3 className="font-playfair text-[20px] font-bold mb-6" style={{ color: '#1e293b' }}>
              Insert Image
            </h3>
            <div className="flex gap-4 border-b mb-6" style={{ borderColor: 'rgba(30, 41, 59, 0.1)' }}>
              <button
                type="button"
                onClick={() => setImageModalTab('upload')}
                className={`pb-2 text-sm font-medium ${
                  imageModalTab === 'upload' ? 'text-[#991b1b] border-b-2 border-[#991b1b]' : 'text-[rgba(30,41,59,0.7)]'
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageModalTab('url')}
                className={`pb-2 text-sm font-medium ${
                  imageModalTab === 'url' ? 'text-[#991b1b] border-b-2 border-[#991b1b]' : 'text-[rgba(30,41,59,0.7)]'
                }`}
              >
                URL
              </button>
            </div>
            {imageModalTab === 'upload' ? (
              <div
                className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-[#991b1b] transition-colors mb-6"
                style={{ borderColor: 'rgba(30, 41, 59, 0.2)' }}
              >
                <Image className="h-12 w-12 mx-auto mb-2 text-[rgba(30,41,59,0.4)]" />
                <p className="text-sm" style={{ color: 'rgba(30, 41, 59, 0.7)' }}>
                  Drop image here or click to upload
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(30, 41, 59, 0.5)' }}>
                  JPG, PNG, GIF, WebP — max 5MB
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-sm"
                  style={{ borderColor: 'rgba(30, 41, 59, 0.1)' }}
                />
                <button
                  type="button"
                  onClick={insertImage}
                  className="px-4 py-2 rounded-md bg-[#991b1b] text-white text-sm font-medium hover:bg-[#b91c1c]"
                >
                  Insert
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="px-4 py-2 rounded-md border text-sm"
              style={{ borderColor: 'rgba(30, 41, 59, 0.2)', color: 'rgba(30, 41, 59, 0.7)' }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setShowVideoModal(false)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[480px] p-8 rounded-xl bg-white"
            style={{ boxShadow: '0 8px 32px rgba(30, 41, 59, 0.15)' }}
          >
            <h3 className="font-playfair text-[20px] font-bold mb-6" style={{ color: '#1e293b' }}>
              Insert Video
            </h3>
            <div className="flex gap-4 border-b mb-6" style={{ borderColor: 'rgba(30, 41, 59, 0.1)' }}>
              <button
                type="button"
                onClick={() => setVideoModalTab('embed')}
                className={`pb-2 text-sm font-medium ${
                  videoModalTab === 'embed' ? 'text-[#991b1b] border-b-2 border-[#991b1b]' : 'text-[rgba(30,41,59,0.7)]'
                }`}
              >
                Embed URL
              </button>
              <button
                type="button"
                onClick={() => setVideoModalTab('upload')}
                className={`pb-2 text-sm font-medium ${
                  videoModalTab === 'upload' ? 'text-[#991b1b] border-b-2 border-[#991b1b]' : 'text-[rgba(30,41,59,0.7)]'
                }`}
              >
                Upload
              </button>
            </div>
            {videoModalTab === 'embed' ? (
              <div className="space-y-3 mb-6">
                <input
                  type="url"
                  placeholder="Paste YouTube, Loom, or video URL..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md text-sm"
                  style={{ borderColor: 'rgba(30, 41, 59, 0.1)' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (videoUrl) {
                      execCommand('insertHTML', `<p>Video: ${videoUrl}</p>`);
                      setVideoUrl('');
                      setShowVideoModal(false);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-[#991b1b] text-white text-sm font-medium hover:bg-[#b91c1c]"
                >
                  Insert
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-[#991b1b] transition-colors mb-6"
                style={{ borderColor: 'rgba(30, 41, 59, 0.2)' }}
              >
                <Video className="h-12 w-12 mx-auto mb-2 text-[rgba(30,41,59,0.4)]" />
                <p className="text-sm" style={{ color: 'rgba(30, 41, 59, 0.7)' }}>
                  Drop video here or click to upload
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(30, 41, 59, 0.5)' }}>
                  MP4, MOV — max 100MB
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowVideoModal(false)}
              className="px-4 py-2 rounded-md border text-sm"
              style={{ borderColor: 'rgba(30, 41, 59, 0.2)', color: 'rgba(30, 41, 59, 0.7)' }}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="fixed inset-0 bg-black/30 z-50" />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[420px] p-8 rounded-xl bg-white text-center"
            style={{ boxShadow: '0 8px 32px rgba(30, 41, 59, 0.15)' }}
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-playfair text-[22px] font-bold mb-2" style={{ color: '#1e293b' }}>
              Submitted for Review
            </h3>
            <p className="text-sm mb-6" style={{ color: 'rgba(30, 41, 59, 0.7)' }}>
              Your article has been sent to the {campusName} Campus Ambassador. You'll be notified once it's published — usually within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="block py-2.5 rounded-md bg-[#991b1b] text-white font-medium hover:bg-[#b91c1c] transition-colors"
              >
                Back to NIATVerse
              </Link>
              <Link
                to="/contribute/write"
                className="block py-2.5 rounded-md border font-medium hover:bg-[#fbf2f3] transition-colors"
                style={{ borderColor: '#991b1b', color: '#991b1b' }}
              >
                Write another article
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Placeholder and validation styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.3s ease-in-out; }
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(30, 41, 59, 0.4);
        }
        [contenteditable] h1 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
        }
        [contenteditable] h2 {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 600;
          color: #1e293b;
        }
        [contenteditable] h3 {
          font-family: 'Playfair Display', serif;
          font-size: 21px;
          font-weight: 600;
          color: #1e293b;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #991b1b;
          padding-left: 20px;
          color: rgba(30, 41, 59, 0.7);
          font-style: italic;
          font-size: 19px;
        }
        [contenteditable] code {
          background: #fbf2f3;
          color: #991b1b;
          font-family: monospace;
          padding: 2px 6px;
          border-radius: 4px;
        }
      `}</style>

      <Footer />
    </div>
  );
}
