import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Star, MapPin, Users, FileText, Clock, ChevronRight,
  Calendar, Home, Utensils, Briefcase,
  UserCheck, MessageSquare, AlertTriangle,
  Linkedin, Mail, Wifi, UtensilsCrossed, Shield
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageWithFallback from '../components/ImageWithFallback';
import {
  campuses, accommodation, foodSpots,
  faculty, experiences, ratings, clubs, allArticles
} from '../data/mockData';
import { CLUB_TYPE_BADGE_STYLES } from '../constants/clubBadges';

export default function Campus() {
  const { id } = useParams<{ id: string }>();
  const campusId = parseInt(id || '1');
  const campus = campuses.find(c => c.id === campusId) || campuses[0];
  const [activeSection, setActiveSection] = useState('week1');

  const sectionRefs = {
    week1: useRef<HTMLDivElement>(null),
    experiences: useRef<HTMLDivElement>(null),
    clubs: useRef<HTMLDivElement>(null),
    contacts: useRef<HTMLDivElement>(null),
    living: useRef<HTMLDivElement>(null),
    food: useRef<HTMLDivElement>(null),
    reviews: useRef<HTMLDivElement>(null),
  };

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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Campus Hero Header */}
      <section className="relative h-64 md:h-96 flex flex-col justify-end pb-8">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={campus.coverImage}
            alt={campus.name}
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
            <span className="text-white">{campus.name}</span>
          </nav>

          {/* Campus Name */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            {campus.name}
          </h1>
          <p className="text-white/80 text-lg mb-4">{campus.university}</p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {campus.city}, {campus.state}
            </span>
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              ~{campus.batchSize} students
            </span>
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {campus.articleCount} articles
            </span>
            {campus.rating && (
              <span className="flex items-center">
                <Star className="h-4 w-4 text-[#f7b801] fill-[#f7b801] mr-1" />
                {campus.rating}
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
      <div className="sticky top-16 z-40 bg-navbar border-b border-[rgba(30,41,59,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-1 py-3">
            {[
              { id: 'week1', label: 'Week 1', icon: Calendar },
              { id: 'experiences', label: 'Experiences', icon: Briefcase },
              { id: 'clubs', label: 'Clubs', icon: Users },
              { id: 'contacts', label: 'Contacts', icon: UserCheck },
              { id: 'living', label: 'Living', icon: Home },
              { id: 'food', label: 'Food', icon: Utensils },
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
        {/* Section 1: Week 1 Survival Guide */}
        <section ref={sectionRefs.week1} className="mb-16">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Week 1 Survival Guide
            </h2>
          </div>
          <p className="text-black mb-6">What to do in your first 7 days at {campus.name}</p>

          {/* Day cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-card p-5 border-l-4 border-[#991b1b]">
              <h3 className="font-bold text-black mb-2">Day 1</h3>
              <p className="text-sm text-black">
                Register at the admin office (Block A, Ground Floor) before 10am. Carry your admission letter,
                4 passport photos, and Aadhar. Go with a senior if possible — the queue is confusing.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-card p-5 border-l-4 border-[#7678ed]">
              <h3 className="font-bold text-black mb-2">Day 2–3</h3>
              <p className="text-sm text-black">
                Find your IRC coordinator and introduce yourself. Get your lab access card.
                Attend the orientation session and collect your schedule.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-card p-5 border-l-4 border-[#f18701]">
              <h3 className="font-bold text-black mb-2">Day 4–7</h3>
              <p className="text-sm text-black">
                Settle into accommodation, explore the campus, find food spots, and join
                the WhatsApp groups. Start thinking about your IRC project idea.
              </p>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <button className="btn-primary mb-6">
            Join the {campus.name} NIAT 2025 batch group →
          </button>

          {/* Common mistakes */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <h4 className="font-bold text-amber-800">Common Mistakes to Avoid</h4>
            </div>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Don't wait until Day 3 to register — the lines get longer</li>
              <li>• Don't skip the IRC coordinator meeting — they're your lifeline</li>
              <li>• Don't book PG without visiting first — photos can be misleading</li>
            </ul>
          </div>
        </section>

        {/* Section: Student Experiences */}
        <section ref={sectionRefs.experiences} className="mb-16">
          <div className="flex items-center mb-4">
            <Briefcase className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Student Experiences
            </h2>
          </div>

          {/* Note Banner */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-teal-700">
              <span className="font-medium">Real stories. Anonymous. Verified by Campus Ambassador.</span>
            </p>
          </div>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="h-36 w-full overflow-hidden">
                  <ImageWithFallback src={exp.image} alt={exp.domain} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="tag-campus-life">{exp.domain}</span>
                    <span className="text-sm text-black">{exp.companyType}</span>
                    <span className="text-sm text-black">• {exp.cityOfWork}</span>
                    <span className="text-sm text-black">• {exp.duration}</span>
                  </div>

                  <p className="text-sm text-black mb-3">{exp.excerpt}</p>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-black">How selected:</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {exp.howSelected}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-black">Skills that helped:</span>
                    {exp.skillsThatHelped.map((skill, i) => (
                      <span key={i} className="text-xs bg-[#fbf2f3] text-[#991b1b] px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-black">
                    <span>{exp.yearOfStudy} Student</span>
                    <span>{exp.publishedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-secondary mt-6">
            Share your experience →
          </button>
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
            Active student clubs at {campus.name}
          </p>

          {(() => {
            const campusClubs = clubs.filter((c) => c.campusId === campusId);
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
                      <div
                        key={club.id}
                        className="bg-white rounded-xl border border-[rgba(30,41,59,0.1)] transition-all hover:border-[#991b1b] hover:shadow-lg overflow-hidden flex flex-col"
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
                          <Link
                            to={`/campus/${campusId}/clubs/${club.id}`}
                            className="text-[#991b1b] text-sm font-medium hover:underline"
                          >
                            View details →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link
                  to={`/campus/${campusId}/clubs`}
                  className="inline-flex items-center px-4 py-2 border-2 border-[#991b1b] text-[#991b1b] font-medium rounded-lg hover:bg-[#991b1b] hover:text-white transition-colors"
                >
                  View all {campusClubs.length} clubs →
                </Link>
              </>
            );
          })()}
        </section>

        {/* Section: Faculty & Contacts */}
        <section ref={sectionRefs.contacts} className="mb-16">
          <div className="flex items-center mb-4">
            <UserCheck className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Faculty & Contacts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faculty.map((f, index) => (
              <div key={index} className="bg-white rounded-lg shadow-card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-black">{f.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {f.designation}
                    </span>
                  </div>
                  {(f.roleAtNiat === 'NIAT Coordinator' || f.roleAtNiat === 'IRC Mentor') && (
                    <span className="niat-role-badge">{f.roleAtNiat}</span>
                  )}
                </div>

                <p className="text-sm text-black mb-1">{f.department}</p>
                <p className="text-sm text-black mb-3">
                  <span className="font-medium">Specialization:</span> {f.specialization}
                </p>
                <p className="text-sm text-black mb-3">
                  <span className="font-medium">Subjects:</span> {f.subjectsTeaching}
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <a
                    href={`https://${f.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-[#991b1b] hover:underline"
                  >
                    <Linkedin className="h-4 w-4 mr-1" />
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:${f.email}`}
                    className="flex items-center text-sm text-[#991b1b] hover:underline"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </a>
                </div>

                <span className="verified-badge">Verified {f.verifiedDate}</span>
              </div>
            ))}
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-sm text-amber-700">
                <span className="font-medium">Important:</span> No phone numbers listed — use official email only
              </p>
            </div>
          </div>
        </section>

        {/* Section: Where to Live */}
        <section ref={sectionRefs.living} className="mb-16">
          <div className="flex items-center mb-4">
            <Home className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Where to Live
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accommodation.map((acc, index) => (
              <div key={index} className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="h-40 w-full overflow-hidden">
                  <ImageWithFallback src={acc.image} alt={acc.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-black">{acc.name}</h3>
                      <span className="inline-block bg-[#7678ed] text-white text-xs px-2 py-1 rounded-full mt-1">
                        {acc.type}
                      </span>
                    </div>
                    <span className="verified-badge">Verified {acc.verifiedDate}</span>
                  </div>

                  <p className="text-sm text-black mb-3">{acc.area}</p>

                  <div className="mb-3">
                    <span className="text-2xl font-bold text-[#991b1b]">
                      ₹{acc.priceMin.toLocaleString()}
                      {acc.priceMax > acc.priceMin && `–${acc.priceMax.toLocaleString()}`}
                    </span>
                    <span className="text-sm text-black">/month</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {acc.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${tag === 'Budget' ? 'bg-green-100 text-green-700' : 'bg-[#7678ed] text-white'
                          }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-black">
                    <span className="flex items-center">
                      <UtensilsCrossed className="h-4 w-4 mr-1" />
                      {acc.foodIncluded ? 'Food included' : 'No food'}
                    </span>
                    <span className="flex items-center">
                      <Wifi className="h-4 w-4 mr-1" />
                      {acc.wifiAvailable ? 'WiFi' : 'No WiFi'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center text-sm text-green-600">
                    <Shield className="h-4 w-4 mr-1" />
                    {acc.safetyNote}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Food Scene */}
        <section ref={sectionRefs.food} className="mb-16">
          <div className="flex items-center mb-4">
            <Utensils className="h-6 w-6 text-[#991b1b] mr-3" />
            <h2 className="font-display text-2xl font-bold text-black">
              Food Scene
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foodSpots.map((spot, index) => (
              <div key={index} className="bg-white rounded-xl shadow-card p-5 flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                  <ImageWithFallback src={spot.image} alt={spot.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-black">{spot.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {spot.type}
                    </span>
                  </div>
                  <p className="text-sm text-black mb-2">{spot.area}</p>
                  <p className="text-sm text-black mb-2">
                    <span className="font-medium">Specialty:</span> {spot.specialty}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#991b1b]">{spot.priceRange}</span>
                    {spot.lateNight && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        Late Night
                      </span>
                    )}
                    {spot.swiggy && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        Swiggy
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  {campus.rating || 'N/A'}
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
