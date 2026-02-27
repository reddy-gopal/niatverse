// Mock Data for NIATVerse
import type { Campus, Article, Accommodation, FoodSpot, IRCInfo, Faculty, Experience, Club, Ratings, SearchResult, Comment, StateCount, ArticlePageArticle } from '../types';

export const campuses: Campus[] = [
  {
    id: 1,
    name: "St. Mary's College",
    university: "St. Mary's Group of Institutions",
    city: "Hyderabad",
    state: "Telangana",
    niatSince: 2023,
    batchSize: 340,
    articleCount: 47,
    rating: 4.2,
    coverage: "Full",
    coverColor: "#991b1b",
    sections: ["Week 1", "Living", "Food", "IRC", "Experiences", "Contacts", "Reviews"]
  },
  {
    id: 2,
    name: "Aurora Engineering College",
    university: "Aurora Group of Institutions",
    city: "Hyderabad",
    state: "Telangana",
    niatSince: 2023,
    batchSize: 280,
    articleCount: 31,
    rating: 3.9,
    coverage: "Growing",
    coverColor: "#7678ed"
  },
  {
    id: 3,
    name: "NSRIT",
    university: "Narasimha Reddy Engineering College",
    city: "Vizag",
    state: "Andhra Pradesh",
    niatSince: 2024,
    batchSize: 190,
    articleCount: 8,
    rating: null,
    coverage: "New",
    coverColor: "#f18701"
  },
  {
    id: 4,
    name: "BS Abdur Rahman",
    university: "B.S. Abdur Rahman Crescent Institute",
    city: "Chennai",
    state: "Tamil Nadu",
    niatSince: 2023,
    batchSize: 310,
    articleCount: 22,
    rating: 4.0,
    coverage: "Growing",
    coverColor: "#991b1b"
  },
  {
    id: 5,
    name: "Alard College",
    university: "Alard College of Engineering",
    city: "Pune",
    state: "Maharashtra",
    niatSince: 2024,
    batchSize: 240,
    articleCount: 4,
    rating: null,
    coverage: "New",
    coverColor: "#5a5cb8"
  },
  {
    id: 6,
    name: "RNS Institute of Technology",
    university: "RNS Educational Institutions",
    city: "Bangalore",
    state: "Karnataka",
    niatSince: 2023,
    batchSize: 295,
    articleCount: 19,
    rating: 3.7,
    coverage: "Growing",
    coverColor: "#7f1d1d"
  }
];

export const articles: Article[] = [
  {
    id: 1,
    campusId: 1,
    section: "week1",
    title: "Week 1 at St. Mary's — Complete Survival Guide",
    excerpt: "Everything you need to do in your first 7 days. From registration to finding your IRC coordinator.",
    author: "Priya S.",
    updatedDays: 3,
    helpful: 47
  },
  {
    id: 2,
    campusId: 1,
    section: "living",
    title: "Best PG Options Near St. Mary's — 2025 Guide",
    excerpt: "Honest reviews of 8 PG options within 15 minutes of campus. Prices, safety, and what seniors actually recommend.",
    author: "Rahul M.",
    updatedDays: 12,
    helpful: 38
  },
  {
    id: 3,
    campusId: 1,
    section: "irc",
    title: "How IRC Submission Actually Works at St. Mary's",
    excerpt: "The official process is confusing. Here's what actually happens — lab timings, who to approach, and how to avoid the common 3-week delay.",
    author: "Kiran T.",
    updatedDays: 7,
    helpful: 61
  },
  {
    id: 4,
    campusId: 1,
    section: "food",
    title: "Where to Eat Near Campus — The Complete List",
    excerpt: "From the mess (which is actually decent on Tuesdays) to late-night biryani at Raju's. Budget options under ₹100.",
    author: "Sneha R.",
    updatedDays: 5,
    helpful: 29
  },
  {
    id: 5,
    campusId: 1,
    section: "experiences",
    title: "My Internship Journey — Product Company, Hyderabad",
    excerpt: "How I got my first internship in 2nd year, what the selection process looked like, and what skills actually helped.",
    author: "Anonymous",
    updatedDays: 21,
    helpful: 54
  }
];

export const accommodation: Accommodation[] = [
  {
    name: "Sri Sai PG",
    type: "PG Off-Campus",
    area: "5 min walk from campus gate",
    priceMin: 4500,
    priceMax: 6000,
    tags: ["Budget", "Close to Campus"],
    foodIncluded: true,
    wifiAvailable: true,
    safetyNote: "Gated with 24hr security",
    verifiedDate: "Jan 2026"
  },
  {
    name: "Campus Hostel Block A",
    type: "Hostel On-Campus",
    area: "On campus, near IRC lab",
    priceMin: 3200,
    priceMax: 3200,
    tags: ["Budget", "Safe", "Close to Campus"],
    foodIncluded: true,
    wifiAvailable: false,
    safetyNote: "Women's block has biometric entry",
    verifiedDate: "Jan 2026"
  }
];

export const foodSpots: FoodSpot[] = [
  { name: "Raju Hotel", type: "Restaurant", area: "Near main gate", priceRange: "₹50–120", specialty: "Biryani, Thali", lateNight: true, swiggy: false },
  { name: "Campus Canteen", type: "Mess", area: "Inside campus", priceRange: "Under ₹50", specialty: "South Indian", lateNight: false, swiggy: false },
  { name: "Tea Point", type: "Street Food", area: "Back gate", priceRange: "Under ₹30", specialty: "Chai, Samosa", lateNight: true, swiggy: false },
  { name: "Domino's", type: "Restaurant", area: "2km from campus", priceRange: "₹150–300", specialty: "Pizza", lateNight: false, swiggy: true }
];

export const ircInfo: IRCInfo = {
  labName: "NIAT IRC Lab, Room 204",
  labLocation: "2nd Floor, CS Block",
  labTimings: "Mon–Sat: 9:00 AM – 8:00 PM",
  closedOn: "University holidays and 2nd Saturdays",
  submissionMode: "Online Portal + Physical copy to coordinator",
  coordinatorName: "Mr. Venkat Rao",
  coordinatorEmail: "venkat.rao@stmarys.ac.in",
  avgCompletionMonths: "4–6 months",
  commonDelays: "Mentor unavailability during exam weeks. Portal downtime on month-end.",
  campusTips: [
    "Book lab slots a week in advance — it fills up fast",
    "Submit progress reports every Friday or it counts as a missed week",
    "Mr. Venkat is available 10am–12pm for IRC queries — don't cold-email",
    "Project ideas from 2024 batch are pinned on the lab noticeboard",
    "The portal is slow on mobile — use a laptop for submissions"
  ]
};

export const faculty: Faculty[] = [
  {
    name: "Dr. Ramesh Kumar",
    designation: "Associate Professor",
    department: "Computer Science",
    roleAtNiat: "NIAT Coordinator",
    email: "ramesh.kumar@stmarys.ac.in",
    linkedin: "linkedin.com/in/rameshkumar",
    highestQual: "PhD",
    specialization: "Machine Learning, Data Science",
    subjectsTeaching: "Python, Data Structures, DBMS",
    verifiedDate: "Jan 2026"
  },
  {
    name: "Ms. Preethi Nair",
    designation: "Assistant Professor",
    department: "NIAT Program",
    roleAtNiat: "IRC Mentor",
    email: "preethi.nair@stmarys.ac.in",
    linkedin: "linkedin.com/in/preethinair",
    highestQual: "M.Tech",
    specialization: "Web Development, Cloud Computing",
    subjectsTeaching: "Web Technologies, Cloud Basics",
    verifiedDate: "Jan 2026"
  }
];

export const experiences: Experience[] = [
  {
    id: 1,
    campusId: 1,
    domain: "Web Development",
    companyType: "Product Startup",
    cityOfWork: "Hyderabad",
    duration: "3 months",
    howSelected: "LinkedIn cold outreach",
    excerpt: "I reached out to 40 companies on LinkedIn in January. Got 3 responses, 2 interviews, 1 offer. Here's the exact message I used...",
    skillsThatHelped: ["React", "Git", "Communication"],
    yearOfStudy: "2nd Year",
    isAnonymous: true,
    publishedDate: "Nov 2025"
  },
  {
    id: 2,
    campusId: 1,
    domain: "Data Science",
    companyType: "MNC",
    cityOfWork: "Remote",
    duration: "2 months",
    howSelected: "Campus Drive",
    excerpt: "TCS came to campus in March 2025. Only 2nd year NIAT students were eligible. The test had 3 sections — here's what each looked like...",
    skillsThatHelped: ["Python", "SQL", "Excel"],
    yearOfStudy: "2nd Year",
    isAnonymous: true,
    publishedDate: "Dec 2025"
  }
];

export const clubs: Club[] = [
  {
    name: "CodeCraft Club",
    type: "Coding",
    about: "Weekly coding contests, competitive programming, hackathon prep. Biggest tech club on campus.",
    activities: "LeetCode battles, internal hackathons, interview prep sessions",
    achievements: "1st place at inter-college hackathon 2024",
    openToAll: true,
    howToJoin: "Attend the first meeting of each semester — no application needed",
    instagram: "@codecraft_stmarys"
  },
  {
    name: "Spectrum Cultural Club",
    type: "Cultural",
    about: "Dance, music, drama, and art. Organises the annual Spectrum Fest.",
    activities: "Rehearsals every weekend, annual fest in February",
    achievements: "Best Cultural Club award, University Fest 2024",
    openToAll: true,
    howToJoin: "Auditions at semester start",
    instagram: "@spectrum_stmarys"
  }
];

export const ratings: Ratings = {
  hostel: 4.3,
  food: 3.8,
  infrastructure: 4.1,
  ircSupport: 4.5,
  socialLife: 4.0,
  totalReviews: 34
};

// Search results mock data
export const searchResults: SearchResult[] = [
  {
    id: 1,
    title: "Best PG Options Near St. Mary's — 2025 Guide",
    campus: "St. Mary's",
    category: "Campus Life",
    excerpt: "Honest reviews of 8 PG options within 15 minutes of campus. Prices, safety, and what seniors actually recommend.",
    updatedDays: 12
  },
  {
    id: 2,
    title: "Hostel vs PG at Aurora — Honest Comparison",
    campus: "Aurora",
    category: "Campus Life",
    excerpt: "A detailed comparison of hostel facilities vs off-campus PG options. Costs, convenience, and community aspects.",
    updatedDays: 21
  },
  {
    id: 3,
    title: "Week 1 at NSRIT — Finding Accommodation Fast",
    campus: "NSRIT",
    category: "Campus Life",
    excerpt: "How to find good PG options within your first week. Tips from seniors who've been through it.",
    updatedDays: 30
  },
  {
    id: 4,
    title: "Off-Campus PG Guide — Hyderabad NIAT Campuses",
    campus: "Global",
    category: "How-To",
    excerpt: "A comprehensive guide to finding PG accommodation near any Hyderabad NIAT campus. Budget tips and safety advice.",
    updatedDays: 60
  }
];

// Comments for article page
export const articleComments: Comment[] = [
  {
    id: 1,
    author: "Ravi K.",
    date: "3 days ago",
    content: "The portal is also down every Sunday for maintenance. Found out the hard way."
  },
  {
    id: 2,
    author: "Ananya M.",
    date: "1 week ago",
    content: "Mr. Venkat is also available on Saturday mornings — not mentioned officially but he's usually in the lab."
  }
];

// Related articles for article page
export const relatedArticles: { id: number; title: string; updatedDays: number; helpful: number }[] = [
  {
    id: 1,
    title: "IRC Project Ideas That Got Selected in 2024",
    updatedDays: 14,
    helpful: 42
  },
  {
    id: 2,
    title: "How to Choose the Right IRC Mentor",
    updatedDays: 21,
    helpful: 35
  },
  {
    id: 3,
    title: "IRC Presentation Tips from Coordinators",
    updatedDays: 28,
    helpful: 28
  }
];

// State counts for campus directory
export const stateCounts: StateCount[] = [
  { name: "All", count: 22 },
  { name: "Telangana", count: 6 },
  { name: "Andhra Pradesh", count: 5 },
  { name: "Tamil Nadu", count: 4 },
  { name: "Karnataka", count: 4 },
  { name: "Maharashtra", count: 3 }
];

// Articles page - full list with categories (featured: true for ids 3, 7, 8)
export const allArticles: ArticlePageArticle[] = [
  // IRC & Skills
  {
    id: 1, campusId: 1, campusName: "St. Mary's",
    category: "irc",
    title: "How IRC Submission Actually Works at St. Mary's",
    excerpt: "The official process is confusing. Here's what actually happens — lab timings, who to approach, and the 3-week delay trap.",
    updatedDays: 7, helpful: 61
  },
  {
    id: 2, campusId: 2, campusName: "Aurora",
    category: "irc",
    title: "IRC Lab Access Guide — Aurora Hyderabad",
    excerpt: "Lab timings, slot booking process, and which mentor to approach for project review at Aurora.",
    updatedDays: 14, helpful: 43
  },
  {
    id: 3, campusId: 4, campusName: "BS Abdur Rahman",
    category: "irc",
    title: "Completing IRC in 4 Months — A Realistic Timeline",
    excerpt: "Most students take 6+ months. Here's how 3 students from our campus did it in 4. The actual schedule they followed.",
    updatedDays: 21, helpful: 78, featured: true
  },

  // Campus Life
  {
    id: 4, campusId: 1, campusName: "St. Mary's",
    category: "campus-life",
    title: "Best PG Options Near St. Mary's — 2025 Guide",
    excerpt: "Honest reviews of 8 PG options within 15 minutes of campus. Prices, safety, and what seniors actually recommend.",
    updatedDays: 12, helpful: 38
  },
  {
    id: 5, campusId: 2, campusName: "Aurora",
    category: "campus-life",
    title: "Where to Eat Near Aurora — The Definitive List",
    excerpt: "From the mess (which is actually decent) to late-night biryani. Budget options under ₹100.",
    updatedDays: 5, helpful: 29
  },
  {
    id: 6, campusId: 6, campusName: "RNS Bangalore",
    category: "campus-life",
    title: "Off-Campus Living in Bangalore on a Student Budget",
    excerpt: "Bangalore PG prices shock most students from other states. Here's how to find good options under ₹6,000/month near RNS.",
    updatedDays: 9, helpful: 52
  },

  // Experiences
  {
    id: 7, campusId: 1, campusName: "St. Mary's",
    category: "experiences",
    title: "My Internship Journey — Product Startup, Hyderabad",
    excerpt: "How I got my first internship in 2nd year through LinkedIn cold outreach. The exact message I used.",
    updatedDays: 21, helpful: 54, featured: true
  },
  {
    id: 8, campusId: 4, campusName: "BS Abdur Rahman",
    category: "experiences",
    title: "Campus Drive at BS Abdur Rahman — What the Test Looked Like",
    excerpt: "TCS came to campus in March 2025. 2nd year NIAT students only. 3 sections, 90 minutes. Here's exactly what each section had.",
    updatedDays: 30, helpful: 67, featured: true
  },
  {
    id: 9, campusId: 6, campusName: "RNS Bangalore",
    category: "experiences",
    title: "Remote Internship While in College — How I Managed It",
    excerpt: "Got a remote internship while still attending college. Time management, what my college allowed, IRC impact.",
    updatedDays: 18, helpful: 41
  },

  // Academics
  {
    id: 10, campusId: 1, campusName: "St. Mary's",
    category: "academics",
    title: "Balancing NIAT IRC and University Exams — Survival Guide",
    excerpt: "Exam season + IRC deadlines hit at the same time. Here's how seniors at St. Mary's manage both without losing marks.",
    updatedDays: 45, helpful: 33
  },
  {
    id: 11, campusId: 2, campusName: "Aurora",
    category: "academics",
    title: "Attendance Policy at Aurora — What You Actually Need",
    excerpt: "75% is the rule. But here's how the portal calculates it, and the 3 things that can save you if you're borderline.",
    updatedDays: 60, helpful: 44
  },

  // How-To
  {
    id: 12, campusId: null, campusName: "Global",
    category: "howto",
    title: "How to Write a Good NIATVerse Article",
    excerpt: "The difference between an article that gets 2 helpful votes and one that gets 60. Structure, tone, what to include.",
    updatedDays: 15, helpful: 28
  },
  {
    id: 13, campusId: null, campusName: "Global",
    category: "howto",
    title: "How to Find Your IRC Coordinator — Any Campus",
    excerpt: "The official contact list is always outdated. Here's the reliable way to find the right person at any NIAT campus.",
    updatedDays: 25, helpful: 36
  }
];
