export interface Campus {
  id: number;
  name: string;
  university: string;
  city: string;
  state: string;
  niatSince: number;
  batchSize: number;
  articleCount: number;
  rating: number | null;
  coverage: 'Full' | 'Growing' | 'New';
  coverColor: string;
  sections?: string[];
}

export interface Article {
  id: number;
  campusId: number;
  section: string;
  title: string;
  excerpt: string;
  author: string;
  updatedDays: number;
  helpful: number;
}

export interface Accommodation {
  name: string;
  type: string;
  area: string;
  priceMin: number;
  priceMax: number;
  tags: string[];
  foodIncluded: boolean;
  wifiAvailable: boolean;
  safetyNote: string;
  verifiedDate: string;
}

export interface FoodSpot {
  name: string;
  type: string;
  area: string;
  priceRange: string;
  specialty: string;
  lateNight: boolean;
  swiggy: boolean;
}

export interface IRCInfo {
  labName: string;
  labLocation: string;
  labTimings: string;
  closedOn: string;
  submissionMode: string;
  coordinatorName: string;
  coordinatorEmail: string;
  avgCompletionMonths: string;
  commonDelays: string;
  campusTips: string[];
}

export interface Faculty {
  name: string;
  designation: string;
  department: string;
  roleAtNiat: string;
  email: string;
  linkedin: string;
  highestQual: string;
  specialization: string;
  subjectsTeaching: string;
  verifiedDate: string;
}

export interface Experience {
  id: number;
  campusId: number;
  domain: string;
  companyType: string;
  cityOfWork: string;
  duration: string;
  howSelected: string;
  excerpt: string;
  skillsThatHelped: string[];
  yearOfStudy: string;
  isAnonymous: boolean;
  publishedDate: string;
}

export interface Club {
  name: string;
  type: string;
  about: string;
  activities: string;
  achievements: string;
  openToAll: boolean;
  howToJoin: string;
  instagram: string;
}

export interface Ratings {
  hostel: number;
  food: number;
  infrastructure: number;
  ircSupport: number;
  socialLife: number;
  totalReviews: number;
}

export interface SearchResult {
  id: number;
  title: string;
  campus: string;
  category: string;
  excerpt: string;
  updatedDays: number;
}

export interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
}

export interface StateCount {
  name: string;
  count: number;
}

export type ArticleCategory = 'irc' | 'campus-life' | 'experiences' | 'academics' | 'howto';

export interface ArticlePageArticle {
  id: number;
  campusId: number | null;
  campusName: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  updatedDays: number;
  helpful: number;
  featured?: boolean;
}
