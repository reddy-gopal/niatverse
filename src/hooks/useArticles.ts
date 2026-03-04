import { useState, useEffect, useCallback } from 'react';
import { articleService } from '../lib/articleService';
import type { ApiArticle, ApiComment } from '../types/articleApi';
import type { PaginatedResponse } from '../types/articleApi';

type ListResponse = { data: PaginatedResponse<ApiArticle> };
type DetailResponse = { data: ApiArticle };
type CommentsResponse = { data: ApiComment[] };

export function usePublishedArticles(params?: Record<string, string | number | boolean>) {
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setIsNetworkError(false);
    articleService
      .list(params)
      .then((res: ListResponse) => {
        const data = res.data as PaginatedResponse<ApiArticle>;
        setArticles(data.results ?? []);
        setNext(data.next ?? null);
      })
      .catch((e: unknown) => {
        const err = e as { response?: { data?: { detail?: string } }; message?: string };
        const hasResponse = err?.response != null;
        if (!hasResponse) {
          setIsNetworkError(true);
          setArticles([]);
          setNext(null);
          setError(null);
        } else {
          setError(err?.response?.data?.detail ?? err?.message ?? 'Failed to load');
          setArticles([]);
          setNext(null);
        }
      })
      .finally(() => setLoading(false));
  }, [params?.campus, params?.category, params?.is_global_guide]);

  const loadMore = useCallback(() => {
    if (!next || loadingMore) return;
    setLoadingMore(true);
    articleService
      .listNextPage(next)
      .then((res: ListResponse) => {
        const data = res.data as PaginatedResponse<ApiArticle>;
        setArticles((prev: ApiArticle[]) => [...prev, ...(data.results ?? [])]);
        setNext(data.next ?? null);
      })
      .finally(() => setLoadingMore(false));
  }, [next, loadingMore]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { articles, loading, error, refetch, next, loadMore, loadingMore, isNetworkError };
}

export function useArticleDetail(id: number | null) {
  const [article, setArticle] = useState<ApiArticle | null>(null);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (id == null) return;
    setLoading(true);
    setError(null);
    Promise.all([articleService.detail(id), articleService.getComments(id)])
      .then(([detailRes, commentsRes]: [DetailResponse, CommentsResponse]) => {
        setArticle(detailRes.data);
        setComments(Array.isArray(commentsRes.data) ? commentsRes.data : []);
      })
      .catch((e: unknown) => {
        const err = e as { response?: { data?: { detail?: string } }; message?: string };
        setError(err?.response?.data?.detail ?? err?.message ?? 'Failed to load');
        setArticle(null);
        setComments([]);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (id == null) {
      setArticle(null);
      setComments([]);
      setLoading(false);
      return;
    }
    refetch();
  }, [id, refetch]);

  return { article, comments, loading, error, refetch };
}

export function usePendingArticles() {
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    articleService
      .pendingQueue()
      .then((res: ListResponse) => {
        const data = res.data as PaginatedResponse<ApiArticle>;
        setArticles(data.results ?? []);
      })
      .catch((e: unknown) => {
        const err = e as { response?: { data?: { detail?: string } }; message?: string };
        setError(err?.response?.data?.detail ?? err?.message ?? 'Failed to load');
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { articles, loading, error, refetch };
}

export function useMyArticles() {
  const [articles, setArticles] = useState<ApiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    articleService
      .myArticles()
      .then((res: ListResponse) => {
        const data = res.data as PaginatedResponse<ApiArticle>;
        setArticles(data.results ?? []);
      })
      .catch((e: unknown) => {
        const err = e as { response?: { data?: { detail?: string } }; message?: string };
        setError(err?.response?.data?.detail ?? err?.message ?? 'Failed to load');
        setArticles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { articles, loading, error, refetch };
}
