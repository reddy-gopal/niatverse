import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, PenLine } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageWithFallback from '../components/ImageWithFallback';
import { allArticles, campuses } from '../data/mockData';
import { CATEGORY_CONFIG, CATEGORY_ORDER } from '../data/articleCategories';
import type { ArticleCategory } from '../types';
import type { ArticlePageArticle } from '../types';

const campusOnlyArticles = allArticles.filter(
  (a): a is ArticlePageArticle & { campusId: number } => a.campusId !== null
);

const CATEGORY_LINKS = [
  { key: 'campus-life' as const, label: "Campus Life" },
  { key: 'irc' as const, label: "IRC & Skills" },
  { key: 'experiences' as const, label: "Experiences" },
  { key: 'academics' as const, label: "Academics" },
  { key: 'howto' as const, label: "How-To Guides" },
];

function ArticleRow({ article }: { article: ArticlePageArticle }) {
  const config = CATEGORY_CONFIG[article.category];
  const articleUrl = article.campusId
    ? `/campus/${article.campusId}/article/${article.id}`
    : `/article/${article.id}`;

  return (
    <Link
      to={articleUrl}
      className="flex gap-4 py-4 pl-3 border-l-[3px] border-l-transparent transition-all duration-150 ease-out hover:border-l-[#991b1b]"
    >
      {article.coverImage && (
        <div className="w-24 h-24 md:w-32 md:h-24 shrink-0 rounded-xl overflow-hidden hidden sm:block">
          <ImageWithFallback src={article.coverImage} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-1">
          <span
            className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-[100px]"
            style={{ backgroundColor: config.bg, color: config.text }}
          >
            {config.label}
          </span>
          <span
            className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-[100px]"
            style={
              article.campusName === 'Global'
                ? { backgroundColor: '#f8fafc', color: '#64748b' }
                : { backgroundColor: '#991b1b', color: 'white' }
            }
          >
            {article.campusName}
          </span>
        </div>
        <h3 className="font-playfair text-[17px] font-bold text-[#991b1b] mb-1 cursor-pointer hover:text-[#7f1d1d] hover:underline transition-colors duration-150">
          {article.title}
        </h3>
        <p className="font-dm-sans text-[14px] text-[#64748b] line-clamp-2 mb-2">
          {article.excerpt}
        </p>
        <p className="font-dm-sans text-[12px] text-[#94a3b8]">
          Updated {article.updatedDays} days ago · 👍 {article.helpful} helpful
        </p>
      </div>
    </Link>
  );
}

export default function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ArticleCategory | null;
  const campusParam = searchParams.get('campus');
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  const activeCategory = categoryParam && CATEGORY_ORDER.includes(categoryParam) ? categoryParam : null;
  const activeCampusId = campusParam ? parseInt(campusParam, 10) : null;

  const displayArticles = useMemo(() => {
    let result = campusOnlyArticles;
    if (activeCategory) result = result.filter((a) => a.category === activeCategory);
    if (activeCampusId != null && !isNaN(activeCampusId)) result = result.filter((a) => a.campusId === activeCampusId);
    return [...result].sort((a, b) => b.helpful - a.helpful);
  }, [activeCategory, activeCampusId]);

  const filteredArticles = displayArticles;
  const topArticles = useMemo(
    () => [...campusOnlyArticles].sort((a, b) => b.helpful - a.helpful).slice(0, 5),
    []
  );

  const campusArticleCounts = useMemo(() => {
    const counts = new Map<number, number>();
    for (const a of campusOnlyArticles) counts.set(a.campusId, (counts.get(a.campusId) || 0) + 1);
    return counts;
  }, []);

  const setCategory = (cat: ArticleCategory | null) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set('category', cat);
    else next.delete('category');
    setSearchParams(next);
  };

  const setCampus = (id: number | null) => {
    const next = new URLSearchParams(searchParams);
    if (id !== null && !isNaN(id)) next.set('campus', String(id));
    else next.delete('campus');
    setSearchParams(next);
    setCampusDropdownOpen(false);
  };

  const totalCount = displayArticles.length;
  const campusCount = campuses.length;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1e293b] mb-2">
            All Articles
          </h1>
          <p className="text-[#64748b] mb-4">
            Knowledge written by NIAT students, for NIAT students. Browse by campus or category.
          </p>
          <span className="inline-flex bg-[#f8fafc] text-[#64748b] text-sm px-3 py-1 rounded-full border border-[#94a3b8]">
            {totalCount} articles across {campusCount} campuses
          </span>
        </header>

        {/* Filter Bar (sticky) */}
        <div
          className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-b border-[rgba(30,41,59,0.1)]"
          style={{ backgroundColor: '#fff8eb' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory(null)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!activeCategory
                    ? 'bg-[#991b1b] text-white'
                    : 'bg-white text-[#1e293b] hover:bg-[#fbf2f3]'
                  }`}
              >
                All
              </button>
              {CATEGORY_LINKS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeCategory === key
                      ? 'bg-[#991b1b] text-white'
                      : 'bg-white text-[#1e293b] hover:bg-[#fbf2f3]'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="relative">
              <button
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[rgba(30,41,59,0.1)] rounded-md text-sm font-medium text-[#1e293b] hover:bg-gray-50"
              >
                {activeCampusId != null
                  ? campuses.find((c) => c.id === activeCampusId)?.name ?? 'All Campuses'
                  : 'All Campuses'}
                <ChevronDown className="h-4 w-4" />
              </button>
              {campusDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCampusDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 z-50 w-56 bg-white rounded-lg shadow-lg border border-[rgba(30,41,59,0.1)] py-1">
                    <button
                      onClick={() => setCampus(null)}
                      className={`w-full text-left px-4 py-2 text-sm ${activeCampusId === null ? 'bg-[#fbf2f3] text-[#991b1b] font-medium' : 'text-[#1e293b] hover:bg-gray-50'
                        }`}
                    >
                      All Campuses
                    </button>
                    {campuses.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCampus(c.id)}
                        className={`w-full text-left px-4 py-2 text-sm flex justify-between ${activeCampusId === c.id ? 'bg-[#fbf2f3] text-[#991b1b] font-medium' : 'text-[#1e293b] hover:bg-gray-50'
                          }`}
                      >
                        {c.name}
                        <span className="text-[#64748b]">{campusArticleCounts.get(c.id) ?? 0}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8 pt-8">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            <p className="font-dm-sans text-sm text-[#64748b] mb-2">
              {activeCategory
                ? `Showing ${filteredArticles.length} articles in ${CATEGORY_CONFIG[activeCategory].label}`
                : `Showing ${filteredArticles.length} articles`}
            </p>
            <div className="border-b border-[rgba(30,41,59,0.08)] mb-0" />

            {filteredArticles.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-dm-sans text-[#64748b] mb-4">
                  No articles found for this filter.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setSearchParams({})}
                    className="text-[#991b1b] font-medium hover:underline"
                  >
                    → Clear filters
                  </button>
                  <span className="text-[#94a3b8]">or</span>
                  <Link to="/contribute" className="text-[#991b1b] font-medium hover:underline">
                    → Write this article
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="divide-y divide-[rgba(30,41,59,0.08)]">
                  {filteredArticles.map((a: ArticlePageArticle) => (
                    <ArticleRow key={a.id} article={a} />
                  ))}
                </div>
              </>
            )}
          </main>

          {/* Sidebar (desktop only) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-6">
              {/* Top Articles This Week */}
              <div className="bg-white rounded-lg border border-[rgba(30,41,59,0.1)] p-4 shadow-[0_4px_12px_rgba(30,41,59,0.08)]">
                <h3 className="font-playfair font-bold text-[#1e293b] mb-3">Top Articles This Week</h3>
                <ul className="space-y-3">
                  {topArticles.map((a: ArticlePageArticle) => {
                    const url = a.campusId
                      ? `/campus/${a.campusId}/article/${a.id}`
                      : `/article/${a.id}`;
                    return (
                      <li key={a.id}>
                        <Link
                          to={url}
                          className="block text-sm text-[#1e293b] hover:text-[#991b1b] hover:underline"
                        >
                          {a.title}
                        </Link>
                        <span className="text-xs text-[#64748b]">👍 {a.helpful} helpful</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Browse by Campus */}
              <div className="bg-white rounded-lg border border-[rgba(30,41,59,0.1)] p-4 shadow-[0_4px_12px_rgba(30,41,59,0.08)]">
                <h3 className="font-playfair font-bold text-[#1e293b] mb-3">Browse by Campus</h3>
                <ul className="space-y-3">
                  {campuses.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={`/campus/${c.id}`}
                        className="block text-sm text-[#1e293b] hover:text-[#991b1b] hover:underline"
                      >
                        {c.name}
                      </Link>
                      <span className="text-xs text-[#64748b]">
                        {campusArticleCounts.get(c.id) ?? 0} articles
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Something */}
              <div className="bg-white rounded-lg border border-[rgba(30,41,59,0.1)] p-4 shadow-[0_4px_12px_rgba(30,41,59,0.08)]">
                <h3 className="font-playfair font-bold text-[#1e293b] mb-2">Missing Something?</h3>
                <p className="text-sm text-[#64748b] mb-3">
                  Can't find what you need? Write it.
                </p>
                <Link
                  to="/contribute/write"
                  className="inline-flex items-center gap-2 bg-[#991b1b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#b91c1c] transition-colors"
                >
                  <PenLine className="h-4 w-4" />
                  Start Writing
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
