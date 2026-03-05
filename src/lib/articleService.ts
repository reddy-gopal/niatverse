import { articlesApi } from './articlesApi';
import type {
  ApiArticle,
  ArticleUpdatePayload,
  ArticleWritePayload,
  ModerationPayload,
  PaginatedResponse,
  SuggestionPayload,
  UpvoteStatus,
} from '../types/articleApi';

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ApiSubcategory {
  slug: string;
  label: string;
  requires_other: boolean;
}

export const articleService = {
  list(params?: Record<string, string | number | boolean | undefined>) {
    return articlesApi.get<PaginatedResponse<ApiArticle>>('articles/', { params });
  },
  getCategories() {
    return articlesApi.get<ApiCategory[]>('categories/');
  },
  /** Subcategories for a category (e.g. club-directory, amenities). Returns [] if category has none. */
  getSubcategories(categorySlug: string) {
    if (!categorySlug) return Promise.resolve({ data: [] as ApiSubcategory[] });
    return articlesApi.get<ApiSubcategory[]>('subcategories/', { params: { category: categorySlug } });
  },
  /** Fetch next page using the full URL from paginated response (e.g. data.next) */
  listNextPage(nextUrl: string) {
    return articlesApi.get<PaginatedResponse<ApiArticle>>(nextUrl);
  },
  detail(id: number) {
    return articlesApi.get<ApiArticle>(`articles/${id}/`);
  },
  getUpvoteStatus(articleId: number) {
    return articlesApi.get<UpvoteStatus>(`articles/${articleId}/upvote-status/`);
  },
  toggleUpvote(articleId: number) {
    return articlesApi.post<{ upvote_count: number; upvoted: boolean }>(`articles/${articleId}/upvote/`);
  },
  submitSuggestion(articleId: number, payload: SuggestionPayload) {
    return articlesApi.post<{ success: boolean }>(`articles/${articleId}/suggest/`, payload);
  },
  incrementView(articleId: number) {
    return articlesApi.post<{ ok: boolean }>(`articles/${articleId}/view/`);
  },
  /** POST to http://localhost:8000/api/articles/articles/ — creates article with status pending_review when save_as_draft is false */
  create(payload: ArticleWritePayload) {
    return articlesApi.post<ApiArticle>('articles/', payload);
  },
  update(id: number, payload: ArticleUpdatePayload) {
    return articlesApi.patch<ApiArticle>(`articles/${id}/`, payload);
  },
  delete(id: number) {
    return articlesApi.delete(`articles/${id}/`);
  },
  myArticles() {
    return articlesApi.get<PaginatedResponse<ApiArticle>>('articles/my_articles/');
  },
  pendingQueue() {
    return articlesApi.get<PaginatedResponse<ApiArticle>>('articles/pending/');
  },
  moderate(id: number, payload: ModerationPayload) {
    return articlesApi.post<ApiArticle>(`articles/${id}/moderate/`, payload);
  },
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return articlesApi.post<{ url: string }>('upload_image/', formData, {
      transformRequest: [(data, headers) => {
        if (headers && typeof headers === 'object' && 'Content-Type' in headers) delete headers['Content-Type'];
        return data;
      }],
    });
  },
};
