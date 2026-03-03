import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageWithFallback from '../components/ImageWithFallback';
import { allArticles } from '../data/mockData';
import type { ArticlePageArticle, GuideTopic } from '../types';

const TOPICS: { value: GuideTopic | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Placements', label: 'Placements' },
  { value: 'Open Source', label: 'Open Source' },
  { value: 'Internships', label: 'Internships' },
  { value: 'Competitive Programming', label: 'Competitive Programming' },
  { value: 'GSoC', label: 'GSoC' },
  { value: 'Skills', label: 'Skills' },
];

function getGlobalGuides(): ArticlePageArticle[] {
  return allArticles
    .filter((a) => a.isGlobalGuide === true)
    .sort((a, b) => b.helpful - a.helpful);
}

function getFeaturedGuide(): ArticlePageArticle | null {
  const featured = allArticles
    .filter((a) => a.isGlobalGuide === true && a.featured === true)
    .sort((a, b) => b.helpful - a.helpful);
  return featured[0] ?? null;
}

export default function HowToGuides() {
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState<GuideTopic | 'All'>('All');

  const guides = useMemo(() => getGlobalGuides(), []);
  const featuredGuide = useMemo(() => getFeaturedGuide(), []);

  const filteredGuides = useMemo(() => {
    let list = guides;
    if (activeTopic !== 'All') {
      list = list.filter((a) => a.topic === activeTopic);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(q))
      );
    }
    return list;
  }, [guides, activeTopic, search]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-section py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-black mb-3">
            How-to Guides
          </h1>
          <p className="text-black/80 text-base md:text-lg mb-6">
            Practical knowledge for every NIAT student — campus doesn&apos;t matter
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search guides by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[rgba(30,41,59,0.1)] rounded-lg text-black placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#991b1b] focus:border-transparent"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Guide */}
        {featuredGuide && (
          <section className="mb-12">
            <Link
              to={`/article/${featuredGuide.id}`}
              className="block rounded-xl overflow-hidden shadow-card hover:shadow-lg border border-[rgba(30,41,59,0.08)] hover:border-[#991b1b]/30 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white">
                <div className="relative h-56 lg:h-72">
                  <ImageWithFallback
                    src={featuredGuide.coverImage}
                    alt={featuredGuide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  {featuredGuide.topic && (
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[#fbf2f3] text-[#991b1b] mb-3 w-fit">
                      {featuredGuide.topic}
                    </span>
                  )}
                  <h2 className="font-display text-2xl font-bold text-[#1e293b] mb-2 line-clamp-2">
                    {featuredGuide.title}
                  </h2>
                  <p className="text-[#64748b] mb-4 line-clamp-3">
                    {featuredGuide.excerpt}
                  </p>
                  <p className="text-sm text-[#94a3b8] mb-4">
                    👍 {featuredGuide.helpful} found this helpful
                  </p>
                  <span className="inline-flex items-center text-[#991b1b] font-medium hover:underline">
                    Read Guide <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Topic Chips */}
        <section className="mb-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
            {TOPICS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveTopic(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTopic === value
                    ? 'bg-[#991b1b] text-white'
                    : 'bg-section text-black hover:bg-[#f1f5f9]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Guide Cards Grid */}
        <section className="mb-16">
          {filteredGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide) => (
                <Link
                  key={guide.id}
                  to={`/article/${guide.id}`}
                  className="block bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg border border-transparent hover:border-[#991b1b] transition-all"
                >
                  {guide.coverImage && (
                    <div className="h-40 w-full overflow-hidden">
                      <ImageWithFallback
                        src={guide.coverImage}
                        alt={guide.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {guide.topic && (
                      <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b] mb-2">
                        {guide.topic}
                      </span>
                    )}
                    <h3 className="font-display text-lg font-bold text-[#1e293b] mb-2 line-clamp-2">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-[#64748b] mb-3 line-clamp-2">
                      {guide.excerpt}
                    </p>
                    <p className="text-xs text-[#94a3b8] mb-2">
                      👍 {guide.helpful} found this helpful
                    </p>
                    <span className="inline-flex items-center text-[#991b1b] text-sm font-medium hover:underline">
                      Read Guide <ChevronRight className="h-4 w-4 ml-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#64748b] py-12">
              No guides yet for this topic.
            </p>
          )}
        </section>

        {/* CTA Strip */}
        <section className="py-10 px-6 rounded-xl bg-[#fefce8] border border-[rgba(253,224,71,0.3)] text-center">
          <p className="text-[#1e293b] font-medium mb-4">
            Know something useful? Write a guide for all NIAT students.
          </p>
          <Link
            to="/contribute/write"
            className="inline-flex items-center px-5 py-2.5 bg-[#991b1b] text-white text-sm font-medium rounded-lg hover:bg-[#7f1d1d] transition-colors"
          >
            Write a Guide <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
