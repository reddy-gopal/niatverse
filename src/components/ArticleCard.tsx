import { Link } from 'react-router-dom';
import { ThumbsUp, Clock } from 'lucide-react';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  campusId: number;
}

export default function ArticleCard({ article, campusId }: ArticleCardProps) {
  return (
    <Link
      to={`/campus/${campusId}/article/${article.id}`}
      className="block bg-white rounded-lg shadow-card border-l-4 border-transparent hover:border-[#991b1b] transition-all duration-200 p-5"
    >
      <h3 className="font-display text-lg font-bold text-black mb-2 line-clamp-2">
        {article.title}
      </h3>
      
      <p className="text-sm text-black mb-3 line-clamp-2">
        {article.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-xs text-black">
        <div className="flex items-center space-x-3">
          <span>By {article.author}</span>
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {article.updatedDays === 0 ? 'Today' : `${article.updatedDays} days ago`}
          </span>
        </div>
        <div className="flex items-center">
          <ThumbsUp className="h-3 w-3 mr-1" />
          <span>{article.helpful} helpful</span>
        </div>
      </div>
    </Link>
  );
}
