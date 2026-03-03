import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CampusCard from '../components/CampusCard';
import { campuses, stateCounts } from '../data/mockData';

export default function CampusDirectory() {
  const [activeState, setActiveState] = useState('All');

  const filteredCampuses = activeState === 'All' 
    ? campuses 
    : campuses.filter(c => c.state === activeState);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Page Header */}
      <section className="bg-section py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-black mb-3">
            22 NIAT Campuses
          </h1>
          <p className="text-black text-base md:text-lg max-w-2xl mx-auto">
            Find yours. Explore others. Every campus mapped by students who've been there.
          </p>
        </div>
      </section>

      {/* State Filter Tabs */}
      <section className="py-6 bg-white border-b border-[rgba(30,41,59,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
            {stateCounts.map((state) => (
              <button
                key={state.name}
                onClick={() => setActiveState(state.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeState === state.name
                    ? 'bg-[#991b1b] text-white'
                    : 'bg-section text-black hover:text-black'
                }`}
              >
                {state.name} ({state.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampuses.map((campus) => (
              <CampusCard key={campus.id} campus={campus} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
