import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, Clock, ChevronRight, FileSearch } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { searchResults, campuses } from '../data/mockData';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCampus, setSelectedCampus] = useState('All Campuses');
  const [selectedDate, setSelectedDate] = useState('Any time');

  const categories = ['All', 'Campus Life', 'IRC', 'Experiences', 'Academics', 'How-To'];
  const dates = ['Any time', 'Last month', 'Last 6 months'];

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'IRC':
        return 'tag-irc';
      case 'Campus Life':
        return 'tag-campus-life';
      case 'Experiences':
        return 'tag-experiences';
      case 'Academics':
        return 'tag-academics';
      case 'How-To':
        return 'tag-how-to';
      default:
        return 'bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar searchQuery={query} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full min-w-0">
        {/* Page Header */}
        <h1 className="font-display text-2xl md:text-3xl font-bold text-black mb-2">
          Search Results
        </h1>
        <p className="text-black mb-6">
          {query ? `Showing results for "${query}"` : 'Enter a search term to find articles'}
        </p>

        {/* Search Input */}
        <form className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search campus, topic, or article..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-[rgba(30,41,59,0.1)] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
            />
          </div>
        </form>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-[rgba(30,41,59,0.1)]">
          {/* Campus Dropdown */}
          <div className="relative">
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="appearance-none bg-section text-black px-4 py-2 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
            >
              <option>All Campuses</option>
              {campuses.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-black pointer-events-none" />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#991b1b] text-white'
                    : 'bg-section text-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="appearance-none bg-section text-black px-4 py-2 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#991b1b]"
            >
              {dates.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <Clock className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-black pointer-events-none" />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 mb-12">
          {searchResults.map((result) => (
            <Link
              key={result.id}
              to={`/campus/1/article/${result.id}`}
              className="block bg-white rounded-lg shadow-soft p-5 hover:shadow-card transition-shadow"
            >
              <h3 className="font-display text-lg font-bold text-black mb-2">
                {result.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="tag-irc">{result.campus}</span>
                <span className={getCategoryClass(result.category)}>{result.category}</span>
              </div>
              <p className="text-sm text-black mb-2">{result.excerpt}</p>
              <div className="flex items-center text-xs text-black">
                <Clock className="h-3 w-3 mr-1" />
                Updated {result.updatedDays} days ago
              </div>
            </Link>
          ))}
        </div>

        {/* Zero Results State - Example */}
        <section className="border-t border-[rgba(30,41,59,0.1)] pt-8">
          <p className="text-sm text-black mb-4">
            If your search had no results, this is what students would see:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FileSearch className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-gray-500 mb-2">
              Nothing found for "xyz"
            </h3>
            <p className="text-gray-400 mb-4">
              Try different keywords or check your spelling
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/contribute" className="btn-primary text-sm">
                Write an article
              </Link>
              <Link to="/campuses" className="btn-secondary text-sm">
                Browse campuses
              </Link>
              <Link to="/" className="text-[#991b1b] text-sm hover:underline flex items-center">
                Go home <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
