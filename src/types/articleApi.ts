export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'rejected';
export type ArticleCategory = 'irc' | 'campus-life' | 'experiences' | 'academics' | 'howto';
export type GuideTopic =
  | 'Placements'
  | 'Open Source'
  | 'Internships'
  | 'Competitive Programming'
  | 'GSoC'
  | 'Skills';

export interface ApiArticle {
  id: number;
  campus_id: number | null;
  campus_name: string;
  category: ArticleCategory;
  category_id?: number | null;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  images?: string[];
  status: ArticleStatus;
  featured: boolean;
  helpful_count: number;
  is_global_guide: boolean;
  topic: GuideTopic | '';
  club_id: number | null;
  subcategory: string;
  subcategory_other: string;
  author_username: string;
  published_at: string | null;
  updated_at: string;
  updated_days: number;
  body?: string;
  rejection_reason?: string;
  comments_count?: number;
  reviewed_at?: string | null;
  created_at?: string;
}

export interface ApiComment {
  id: number;
  author_username: string;
  body: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ArticleWritePayload {
  campus_id: number | null;
  campus_name: string;
  category?: ArticleCategory;
  category_id?: number | null;
  title: string;
  excerpt: string;
  body: string;
  cover_image?: string;
  images?: string[];
  is_global_guide: boolean;
  topic?: GuideTopic | '';
  club_id?: number | null;
  subcategory?: string;
  subcategory_other?: string;
  save_as_draft?: boolean;
}

/** For PATCH: optional fields + status when author submits or saves draft */
export type ArticleUpdatePayload = Partial<ArticleWritePayload> & { status?: 'draft' | 'pending_review' };

export interface ModerationPayload {
  status: 'published' | 'rejected';
  rejection_reason?: string;
  featured?: boolean;
}
