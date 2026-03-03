import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Calendar, Wrench, Edit3 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CampusCard from '../components/CampusCard';
import VideoCarousel from '../components/VideoCarousel';
import { campuses, stateCounts, allArticles } from '../data/mockData';

const HOW_TO_GUIDES_URL = '/how-to-guides';

function getGlobalGuides(limit: number) {
  return allArticles
    .filter((a) => a.isGlobalGuide === true)
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, limit);
}

export default function Home() {
  const [heroSearch, setHeroSearch] = useState('');
  const [activeState, setActiveState] = useState('All');
  const [showNavSearch, setShowNavSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerWidth < 768 ? 400 : 500;
      setShowNavSearch(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const filteredCampuses = activeState === 'All'
    ? campuses
    : campuses.filter(c => c.state === activeState);

  const states = ['All', 'Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Maharashtra'];

  return (
    <div className="min-h-screen bg-white">
      <Navbar showSearch={showNavSearch} />

      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Every NIAT Campus. Mapped by students who've been there.
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            22 campuses. Real information. Written by students who figured it out the hard way.
          </p>

          {/* Hero Search */}
          <form onSubmit={handleHeroSearch} className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Find your campus — type name or city"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </form>

          {/* State Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => setActiveState(state)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeState === state
                    ? 'bg-white text-[#991b1b]'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Your Campus Card - Welcome Back */}
      <section className="bg-section py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-card border-l-4 border-[#991b1b] p-6">
            <p className="text-sm text-black mb-1">Welcome back</p>
            <h2 className="font-display text-xl font-bold text-black mb-1">
              St. Mary's College, Hyderabad
            </h2>
            <p className="text-sm text-black mb-4">47 articles · 3 new this week</p>
            <Link
              to="/campus/1"
              className="inline-flex items-center text-[#991b1b] font-medium hover:underline"
            >
              Go to my campus <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Explore by State */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black mb-6">
            Explore All 22 Campuses
          </h2>

          {/* State Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-[rgba(30,41,59,0.1)] pb-4">
            {stateCounts.map((state) => (
              <button
                key={state.name}
                onClick={() => setActiveState(state.name)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeState === state.name
                    ? 'text-[#991b1b] border-b-2 border-[#991b1b]'
                    : 'text-black hover:text-black'
                  }`}
              >
                {state.name} ({state.count})
              </button>
            ))}
          </div>

          {/* Campus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampuses.map((campus) => (
              <CampusCard key={campus.id} campus={campus} />
            ))}
          </div>
        </div>
      </section>

      {/* Watch & Learn: videos + How-to Guides */}
      <section className="bg-section">
        <VideoCarousel />
        <div className="py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fefce8' }}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-black mb-2">
              📘 How-to Guides for Every NIAT Student
            </h2>
            <p className="text-[#64748b] mb-6">
              Practical knowledge that helps — no matter which campus you&apos;re at
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {getGlobalGuides(3).map((guide) => (
                <Link
                  key={guide.id}
                  to={`/article/${guide.id}`}
                  className="block bg-white rounded-xl shadow-card p-5 hover:shadow-lg hover:border-[#991b1b] transition-all border border-transparent"
                >
                  <h3 className="font-display text-lg font-bold text-[#1e293b] mb-2 line-clamp-2">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-[#64748b] line-clamp-2 mb-3">
                    {guide.excerpt}
                  </p>
                  <p className="text-xs text-[#94a3b8] mb-2">
                    👍 {guide.helpful} found this helpful
                  </p>
                  <span className="inline-flex items-center text-[#991b1b] text-sm font-medium hover:underline">
                    Read <ChevronRight className="h-4 w-4 ml-0.5" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex justify-end">
              <Link
                to={HOW_TO_GUIDES_URL}
                className="text-[#991b1b] font-medium text-sm hover:underline inline-flex items-center"
              >
                View all guides <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Start Here - 3 main cards → guide sections */}
      <section className="py-12 bg-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-black mb-8">
            New to NIAT? Start here.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              to="/guide#week1"
              className="block bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-[#991b1b]/20"
            >
              <Calendar className="h-8 w-8 text-[#991b1b] mb-3" />
              <h3 className="font-display text-lg font-bold text-black mb-1">
                Week 1 at NIAT
              </h3>
              <p className="text-sm text-[#64748b] mb-3">What to do first</p>
              <span className="inline-flex items-center text-[#991b1b] text-sm font-medium">
                Read more <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
            <Link
              to="/guide#irc"
              className="block bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-[#991b1b]/20"
            >
              <Wrench className="h-8 w-8 text-[#991b1b] mb-3" />
              <h3 className="font-display text-lg font-bold text-black mb-1">
                How IRC actually works
              </h3>
              <p className="text-sm text-[#64748b] mb-3">The complete guide</p>
              <span className="inline-flex items-center text-[#991b1b] text-sm font-medium">
                Read more <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
            <Link
              to="/guide#contribute"
              className="block bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-[#991b1b]/20"
            >
              <Edit3 className="h-8 w-8 text-[#991b1b] mb-3" />
              <h3 className="font-display text-lg font-bold text-black mb-1">
                How to contribute
              </h3>
              <p className="text-sm text-[#64748b] mb-3">Share what you know</p>
              <span className="inline-flex items-center text-[#991b1b] text-sm font-medium">
                Read more <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
