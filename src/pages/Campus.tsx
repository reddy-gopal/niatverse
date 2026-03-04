import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Star, MapPin, Users, FileText, Clock, ChevronRight,
  Calendar, MessageSquare, Award, Utensils, Home
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageWithFallback from '../components/ImageWithFallback';
import { ratings, clubs, allArticles } from '../data/mockData';
import { CLUB_TYPE_BADGE_STYLES } from '../constants/clubBadges';
import { useCampuses } from '../hooks/useCampuses';
import { apiCampusToCampus } from '../lib/campusUtils';
import { articleService } from '../lib/articleService';
import type { Campus } from '../types';

export default function Campus() {
  const { id } = useParams<{ id: string }>();
  const campusId = parseInt(id || '0', 10);
  const { campuses: apiCampuses, isLoading: campusesLoading } = useCampuses();
  const [articleCount, setArticleCount] = useState<number>(0);

  const campus: Campus | null = useMemo(() => {
    if (!apiCampuses.length || !Number.isFinite(campusId)) return null;
    const item = apiCampuses.find((c) => c.id === campusId);
    if (!item) return null;
    return apiCampusToCampus(item);
  }, [apiCampuses, campusId]);

  useEffect(() => {
    if (!Number.isFinite(campusId) || campusId < 1) return;
    articleService
      .list({ campus: campusId })
      .then((res) => setArticleCount((res.data as { count?: number })?.count ?? 0))
      .catch(() => setArticleCount(0));
  }, [campusId]);

  const notFound = !campusesLoading && !campus && Number.isFinite(campusId) && campusId > 0;
  const displayCampus: Campus = campus ?? {
    id: campusId,
    name: notFound ? 'Campus not found' : '',
    university: '',
    city: '—',
    state: '—',
    niatSince: new Date().getFullYear(),
    batchSize: 0,
    articleCount: 0,
    rating: null,
    coverColor: '#991b1b',
    coverImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  };
  const displayArticleCount = campus ? articleCount : displayCampus.articleCount;

  const [activeSection, setActiveSection] = useState('topVoted');

  const sectionRefs = {
    topVoted: useRef<HTMLDivElement>(null),
    week1: useRef<HTMLDivElement>(null),
    clubs: useRef<HTMLDivElement>(null),
    food: useRef<HTMLDivElement>(null),
    living: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
  };

  const campusArticles = useMemo(
    () => allArticles.filter((a) => a.campusId === campusId || a.campusId === null),
    [campusId]
  );
  const topVotedArticles = useMemo(
    () => [...campusArticles].sort((a, b) => b.helpful - a.helpful).slice(0, 6),
    [campusArticles]
  );
  const foodArticles = useMemo(
    () => campusArticles.filter((a) => a.campusSection === 'food'),
    [campusArticles]
  );
  const livingArticles = useMemo(
    () => campusArticles.filter((a) => a.campusSection === 'living'),
    [campusArticles]
  );
  const thirtyDaysArticles = useMemo(
    () => allArticles.filter((a) => a.campusSection === '30days'),
    []
  );

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      Object.entries(sectionRefs).forEach(([sectionId, ref]) => {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Campus Hero Header — cover and details from real API */}
      <section className="relative h-64 md:h-96 flex flex-col justify-end pb-8">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={displayCampus.coverImage}
            alt={displayCampus.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 object-cover" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center text-white/70 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/campuses" className="hover:text-white">Campuses</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">{displayCampus.name}</span>
          </nav>

          {/* Campus Name — spinner when loading */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            {campusesLoading && !campus ? (
              <span className="inline-flex items-center gap-2">
                <span className="animate-spin rounded-full border-2 border-white/30 border-t-white size-8" role="status" aria-label="Loading" />
              </span>
            ) : (
              displayCampus.name
            )}
          </h1>
          {!(campusesLoading && !campus) && (
            <p className="text-white/80 text-lg mb-4">{displayCampus.university || displayCampus.name}</p>
          )}

          {/* Stats Row — real-time article count */}
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {displayCampus.city}, {displayCampus.state}
            </span>
            {displayCampus.batchSize > 0 && (
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                ~{displayCampus.batchSize} students
              </span>
            )}
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {displayArticleCount} articles
            </span>
            {displayCampus.rating != null && displayCampus.rating > 0 && (
              <span className="flex items-center">
                <Star className="h-4 w-4 text-[#f7b801] fill-[#f7b801] mr-1" />
                {displayCampus.rating}
              </span>
            )}
          </div>

          {/* Last updated badge */}
          <div className="mt-4">
            <span className="inline-flex items-center bg-white/20 text-white text-xs px-3 py-1 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              Last updated 3 days ago
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Section Navigation */}
      <div className="sticky top-[6.5rem] z-40 bg-navbar border-b border-[rgba(30,41,59,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-3">
            {[
              { id: 'topVoted', label: 'Top voted', icon: Award },
              { id: 'week1', label: '30 days', icon: Calendar },
              { id: 'clubs', label: 'Clubs', icon: Users },
              { id: 'food', label: 'Food', icon: Utensils },
              { id: 'living', label: 'Living', icon: Home },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${activeSection === id
                  ? 'text-[#991b1b] border-b-2 border-[#991b1b]'
                  : 'text-black hover:text-black'
                  }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section: Top voted articles */}
        <section ref={sectionRefs.topVoted} className="mb-16">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Top voted articles
            </h2>
          </div>
          <p className="text-black mb-6">Most helpful articles at {displayCampus.name}</p>
          {topVotedArticles.length === 0 ? (
            <p className="text-black mb-4">No articles yet. Be the first to write one.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {topVotedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={article.campusId ? `/campus/${article.campusId}/article/${article.id}` : `/article/${article.id}`}
                  className="block bg-white rounded-xl shadow-card overflow-hidden border border-transparent hover:border-[#991b1b]/30 transition-colors"
                >
                  {article.coverImage && (
                    <div className="h-36 w-full overflow-hidden">
                      <ImageWithFallback src={article.coverImage} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display font-medium text-[#1e293b] mb-1 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-[#64748b] line-clamp-2 mb-2">{article.excerpt}</p>
                    <span className="text-xs text-[#94a3b8]">👍 {article.helpful} helpful</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link
            to={`/articles${campusId && Number.isFinite(campusId) ? `?campus=${campusId}` : ''}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#991b1b] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#7f1d1d] transition-colors"
          >
            Know more <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Section: 30 days at NIAT — global articles, same on all campuses */}
        <section ref={sectionRefs.week1} className="mb-16">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              30 days at NIAT
            </h2>
          </div>
          <p className="text-black mb-6">Your first month at {displayCampus.name}: what to do week by week.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {thirtyDaysArticles.map((article) => (
              <Link
                key={article.id}
                to={article.campusId ? `/campus/${article.campusId}/article/${article.id}` : `/article/${article.id}`}
                className="block bg-white rounded-lg shadow-card p-5 border-l-4 border-[#991b1b] hover:border-[#7f1d1d] transition-colors"
              >
                <h3 className="font-bold text-black mb-2">{article.title.replace('Your first month at NIAT — ', '')}</h3>
                <p className="text-sm text-black">{article.excerpt}</p>
              </Link>
            ))}
          </div>

          <Link
            to={`/articles${campusId && Number.isFinite(campusId) ? `?campus=${campusId}` : ''}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#991b1b] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#7f1d1d] transition-colors"
          >
            Know more <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Section: Clubs & Communities */}
        <section ref={sectionRefs.clubs} className="mb-16">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              🎯 Clubs & Communities
            </h2>
          </div>
          <p className="text-black mb-6">
            Active student clubs at {displayCampus.name}
          </p>

          {(() => {
            const campusClubs = clubs.filter((c) => c.campusId === campusId || c.campusId === null);
            const previewClubs = campusClubs.slice(0, 3);
            if (campusClubs.length === 0) {
              return (
                <>
                  <p className="text-black mb-2">No clubs listed yet for this campus.</p>
                  <Link to={`/campus/${campusId}/clubs`} className="text-[#991b1b] hover:underline">
                    → View clubs directory
                  </Link>
                </>
              );
            }
            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {previewClubs.map((club) => {
                    const badge = CLUB_TYPE_BADGE_STYLES[club.type];
                    return (
                      <Link
                        key={club.id}
                        to={`/campus/${campusId}/clubs/${club.id}`}
                        className="block bg-white rounded-xl border border-[rgba(30,41,59,0.1)] transition-all hover:border-[#991b1b] hover:shadow-lg overflow-hidden flex flex-col"
                        style={{ boxShadow: '0 4px 12px rgba(30, 41, 59, 0.08)' }}
                      >
                        {club.coverImage && (
                          <div className="h-32 w-full shrink-0">
                            <ImageWithFallback src={club.coverImage} alt={club.name} loading="lazy" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className="text-[11px] font-semibold rounded-full border"
                              style={{
                                padding: '3px 10px',
                                backgroundColor: badge.bg,
                                color: badge.text,
                                borderColor: badge.border,
                              }}
                            >
                              {club.type}
                            </span>
                            {club.openToAll ? (
                              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                                Open to All
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                                Application Required
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-[17px] font-bold text-[#1e293b] mb-2">
                            {club.name}
                          </h3>
                          <p
                            className="text-[13px] text-[rgba(30,41,59,0.7)] mb-3 line-clamp-2"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            {club.about}
                          </p>
                          <p
                            className="text-[12px] text-[rgba(30,41,59,0.5)] mb-2"
                            style={{ fontFamily: 'DM Sans, sans-serif' }}
                          >
                            Since {club.foundedYear} · ~{club.memberCount} members
                          </p>
                          <span className="text-[#991b1b] text-sm font-medium hover:underline">
                            View details →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  to={`/campus/${campusId}/clubs`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-[#991b1b] text-[#991b1b] font-medium rounded-lg hover:bg-[#991b1b] hover:text-white transition-colors"
                >
                  Club directory <ChevronRight className="h-4 w-4" />
                </Link>
              </>
            );
          })()}
        </section>

        {/* Section: Food */}
        <section ref={sectionRefs.food} className="mb-16">
          <div className="flex items-center mb-4">
            <Utensils className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Food
            </h2>
          </div>
          <p className="text-black mb-6">Where to eat at and around {displayCampus.name}</p>
          {foodArticles.length === 0 ? (
            <p className="text-black mb-4">No food articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {foodArticles.map((article) => (
                <Link
                  key={article.id}
                  to={article.campusId ? `/campus/${article.campusId}/article/${article.id}` : `/article/${article.id}`}
                  className="block bg-white rounded-xl shadow-card overflow-hidden border border-transparent hover:border-[#991b1b]/30 transition-colors"
                >
                  {article.coverImage && (
                    <div className="h-32 w-full overflow-hidden">
                      <ImageWithFallback src={article.coverImage} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display font-medium text-[#1e293b] mb-1 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-[#64748b] line-clamp-2 mb-2">{article.excerpt}</p>
                    <span className="text-xs text-[#94a3b8]">👍 {article.helpful} helpful</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link
            to={`/articles${campusId && Number.isFinite(campusId) ? `?campus=${campusId}` : ''}`}
            className="inline-flex items-center gap-1.5 text-[#991b1b] font-medium text-sm hover:underline"
          >
            Know more <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Section: Living */}
        <section ref={sectionRefs.living} className="mb-16">
          <div className="flex items-center mb-4">
            <Home className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Living
            </h2>
          </div>
          <p className="text-black mb-6">Hostel, PG, and accommodation near {displayCampus.name}</p>
          {livingArticles.length === 0 ? (
            <p className="text-black mb-4">No living articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {livingArticles.map((article) => (
                <Link
                  key={article.id}
                  to={article.campusId ? `/campus/${article.campusId}/article/${article.id}` : `/article/${article.id}`}
                  className="block bg-white rounded-xl shadow-card overflow-hidden border border-transparent hover:border-[#991b1b]/30 transition-colors"
                >
                  {article.coverImage && (
                    <div className="h-32 w-full overflow-hidden">
                      <ImageWithFallback src={article.coverImage} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-display font-medium text-[#1e293b] mb-1 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-[#64748b] line-clamp-2 mb-2">{article.excerpt}</p>
                    <span className="text-xs text-[#94a3b8]">👍 {article.helpful} helpful</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link
            to={`/articles${campusId && Number.isFinite(campusId) ? `?campus=${campusId}` : ''}`}
            className="inline-flex items-center gap-1.5 text-[#991b1b] font-medium text-sm hover:underline"
          >
            Know more <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Section: Student Ratings & Reviews */}
        <section ref={sectionRefs.reviews} className="mb-16">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Student Ratings & Reviews
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center mb-6">
              <div className="text-center mr-8">
                <span className="font-display text-5xl font-bold text-[#991b1b]">
                  {displayCampus.rating ?? 'N/A'}
                </span>
                <p className="text-sm text-black">{ratings.totalReviews} reviews</p>
              </div>

              <div className="flex-1 space-y-2">
                {[
                  { label: 'IRC Support', value: ratings.ircSupport },
                  { label: 'Hostel', value: ratings.hostel },
                  { label: 'Infrastructure', value: ratings.infrastructure },
                  { label: 'Social Life', value: ratings.socialLife },
                  { label: 'Food', value: ratings.food },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center">
                    <span className="w-28 text-sm text-black">{label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full mr-3">
                      <div
                        className="h-2 bg-[#991b1b] rounded-full"
                        style={{ width: `${(value / 5) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-sm font-medium text-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-black text-center">
              All reviews are anonymous and verified by Campus Ambassador
            </p>
          </div>
        </section>

        {/* Global guides — also useful for you */}
        <section className="mb-16 py-8 px-6 rounded-xl bg-[#f8fafc]">
          <h3 className="font-display text-lg font-semibold text-[#64748b] mb-4">
            📘 Global Guides — helpful at any campus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {allArticles
              .filter((a) => a.isGlobalGuide === true)
              .sort((a, b) => b.helpful - a.helpful)
              .slice(0, 3)
              .map((guide) => (
                <Link
                  key={guide.id}
                  to={`/article/${guide.id}`}
                  className="block bg-white rounded-lg p-4 border border-[rgba(30,41,59,0.08)] hover:border-[#991b1b]/30 transition-colors"
                >
                  <h4 className="font-display font-medium text-[#1e293b] mb-1 line-clamp-2">
                    {guide.title}
                  </h4>
                  <p className="text-sm text-[#64748b] line-clamp-2 mb-2">
                    {guide.excerpt}
                  </p>
                  <span className="inline-flex items-center text-[#991b1b] text-sm font-medium hover:underline">
                    Read <ChevronRight className="h-4 w-4 ml-0.5" />
                  </span>
                </Link>
              ))}
          </div>
          <div className="flex justify-end">
            <Link
              to="/how-to-guides"
              className="text-[#991b1b] text-sm font-medium hover:underline inline-flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </section>

        {/* V2 Coming Soon */}
        <section className="bg-gray-100 rounded-lg p-8 text-center">
          <h3 className="font-display text-xl font-bold text-gray-500 mb-2">
            Coming Soon
          </h3>
          <p className="text-gray-500">
            🗓 Events · 🚌 Transport · 🎯 Clubs · 🏙 City Guide — Be the first to contribute.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
