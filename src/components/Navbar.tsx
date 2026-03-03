import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronRight } from 'lucide-react';
import { allArticles } from '../data/mockData';
import { CATEGORY_CONFIG } from '../data/articleCategories';

interface NavbarProps {
  searchQuery?: string;
  showSearch?: boolean;
}

const CATEGORY_NAV_LINKS = [
  { key: 'campus-life' as const, label: 'Campus Life', icon: '🏠', path: '/articles?category=campus-life' },
  { key: 'irc' as const, label: 'IRC & Skills', icon: '🔬', path: '/articles?category=irc' },
  { key: 'experiences' as const, label: 'Experiences', icon: '💼', path: '/articles?category=experiences' },
  { key: 'academics' as const, label: 'Academics', icon: '📚', path: '/articles?category=academics' },
];
const HOW_TO_GUIDES_LINK = { label: 'How-To Guides', icon: '📘', path: '/how-to-guides' };

/** Niat Reviews Platform URL — update after deployment */
const REVIEWS_PLATFORM_URL = 'http://localhost:3000';

export default function Navbar({ searchQuery = '', showSearch }: NavbarProps) {
  const [search, setSearch] = useState(searchQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [articlesDropdownOpen, setArticlesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isOnArticles = location.pathname === '/articles';
  const shouldShowSearch = !isHome || showSearch === true;
  const shouldShowNavShadow = isHome && showSearch === true;

  const featuredArticles = allArticles.filter((a) => a.featured);
  const recentlyUpdated = allArticles
    .filter((a) => !a.featured)
    .sort((a, b) => a.updatedDays - b.updatedDays)
    .slice(0, 2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setArticlesDropdownOpen(false);
      }
    };
    if (articlesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [articlesDropdownOpen]);

  return (
    <nav
      className={`bg-navbar border-b border-[rgba(30,41,59,0.1)] sticky top-0 z-50 transition-[box-shadow] duration-300 ease-out ${shouldShowNavShadow ? 'shadow-[0_2px_12px_rgba(30,41,59,0.10)]' : ''
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="font-display text-2xl font-bold text-[#991b1b]">NIAT</span>
            <span className="font-body text-xl font-medium text-black ml-1">Verse</span>
          </Link>

          {/* Desktop Search - scroll-aware on Home, always visible elsewhere */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex mx-8 transition-[opacity,transform,width] duration-[250ms] ease-out ${shouldShowSearch
                ? `opacity-100 translate-y-0 flex-1 min-w-0 overflow-visible ${isHome ? 'max-w-[280px]' : 'max-w-md'}`
                : 'opacity-0 -translate-y-1.5 w-0 min-w-0 flex-none overflow-hidden pointer-events-none'
              }`}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search campus, topic, or article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[rgba(30,41,59,0.1)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b] focus:border-transparent"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/campuses"
              className="text-black hover:text-black text-sm font-medium transition-colors"
            >
              Campuses
            </Link>

            {/* Articles with mega dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setArticlesDropdownOpen(true)}
              onMouseLeave={() => setArticlesDropdownOpen(false)}
            >
              <Link
                to="/articles"
                className={`text-sm font-medium transition-colors flex items-center ${isOnArticles ? 'text-[#991b1b] border-b-2 border-[#991b1b] pb-0.5' : 'text-black hover:text-black'
                  }`}
              >
                Articles
              </Link>

              {/* Mega dropdown */}
              {articlesDropdownOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-2"
                  style={{ minWidth: '520px' }}
                >
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: '0 8px 24px rgba(30, 41, 59, 0.12)',
                      borderRadius: '12px',
                      borderTop: '3px solid #991b1b',
                    }}
                  >
                    <div className="flex">
                      {/* Left column - Browse by Category */}
                      <div className="w-1/2 p-5 border-r border-[rgba(30,41,59,0.08)]">
                        <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
                          Browse by Category
                        </h4>
                        <ul className="space-y-1">
                          {CATEGORY_NAV_LINKS.map(({ key, label, icon, path }) => (
                            <li key={key}>
                              <Link
                                to={path}
                                className="flex items-center gap-2 py-2 px-2 -mx-2 rounded-md text-[#1e293b] hover:bg-[#fbf2f3] hover:text-[#991b1b] transition-colors text-sm font-medium"
                              >
                                <span>{icon}</span>
                                {label}
                              </Link>
                            </li>
                          ))}
                          <li className="border-t border-[rgba(30,41,59,0.08)] mt-2 pt-2">
                            <Link
                              to={HOW_TO_GUIDES_LINK.path}
                              className="flex items-center gap-2 py-2 px-2 -mx-2 rounded-md text-[#1e293b] hover:bg-[#fbf2f3] hover:text-[#991b1b] transition-colors text-sm font-medium"
                            >
                              <span>{HOW_TO_GUIDES_LINK.icon}</span>
                              {HOW_TO_GUIDES_LINK.label}
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Right column - Featured + Recently Updated */}
                      <div className="w-1/2 p-5">
                        <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
                          ⭐ Featured
                        </h4>
                        <div className="space-y-3 mb-4">
                          {featuredArticles.map((a) => {
                            const config = CATEGORY_CONFIG[a.category];
                            const url = a.campusId
                              ? `/campus/${a.campusId}/article/${a.id}`
                              : `/article/${a.id}`;
                            return (
                              <Link
                                key={a.id}
                                to={url}
                                className="block p-3 rounded-lg hover:bg-[#fbf2f3] transition-colors group"
                              >
                                <div className="flex justify-end mb-1">
                                  <span
                                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                                    style={{ backgroundColor: '#f7b801', color: '#1e293b' }}
                                  >
                                    ⭐ Featured
                                  </span>
                                </div>
                                <h5 className="font-playfair text-sm font-bold text-[#1e293b] mb-1 line-clamp-2 group-hover:text-[#991b1b]">
                                  {a.title}
                                </h5>
                                <div className="flex flex-wrap gap-1 mb-1">
                                  <span
                                    className="text-[10px] px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: config.bg, color: config.text }}
                                  >
                                    {config.label}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#991b1b] text-white">
                                    {a.campusName}
                                  </span>
                                </div>
                                <p className="text-xs text-[#64748b] mb-1">
                                  👍 {a.helpful} students found this helpful
                                </p>
                                <span className="inline-flex items-center text-xs text-[#991b1b] font-medium">
                                  Read <ChevronRight className="h-3 w-3" />
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">
                          Recently Updated
                        </h4>
                        <div className="space-y-2">
                          {recentlyUpdated.map((a) => {
                            const config = CATEGORY_CONFIG[a.category];
                            const url = a.campusId
                              ? `/campus/${a.campusId}/article/${a.id}`
                              : `/article/${a.id}`;
                            return (
                              <Link
                                key={a.id}
                                to={url}
                                className="block p-2 rounded-lg hover:bg-[#fbf2f3] transition-colors group"
                              >
                                <h5 className="font-playfair text-sm font-bold text-[#1e293b] line-clamp-1 group-hover:text-[#991b1b]">
                                  {a.title}
                                </h5>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <span
                                    className="text-[10px] px-2 py-0.5 rounded-full"
                                    style={{ backgroundColor: config.bg, color: config.text }}
                                  >
                                    {config.label}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#991b1b] text-white">
                                    {a.campusName}
                                  </span>
                                </div>
                                <p className="text-xs text-[#64748b] mt-1">
                                  Updated {a.updatedDays} days ago
                                </p>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bottom - Browse all articles */}
                    <div
                      className="px-5 py-3 border-t border-[rgba(30,41,59,0.08)]"
                      style={{ backgroundColor: 'rgba(153, 27, 27, 0.04)' }}
                    >
                      <Link
                        to="/articles"
                        className="inline-flex items-center gap-1 text-[#991b1b] font-medium text-sm hover:underline"
                      >
                        Browse all articles
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a
              href={REVIEWS_PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-black text-sm font-medium transition-colors"
            >
              Niat Reviews
            </a>
            <Link to="/contribute" className="btn-primary text-sm font-medium">
              Contribute
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-black"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(30,41,59,0.1)]">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campus, topic, or article..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[rgba(30,41,59,0.1)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
                />
              </div>
            </form>
            <div className="flex flex-col space-y-3">
              <Link
                to="/campuses"
                onClick={() => setMobileMenuOpen(false)}
                className="text-black hover:text-black text-sm font-medium"
              >
                Campuses
              </Link>
              <Link
                to="/articles"
                onClick={() => setMobileMenuOpen(false)}
                className="text-black hover:text-black text-sm font-medium"
              >
                Articles
              </Link>
              <a
                href={REVIEWS_PLATFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-black hover:text-black text-sm font-medium"
              >
                Niat Reviews
              </a>
              <Link
                to="/contribute"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary text-sm font-medium text-center"
              >
                Contribute
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
