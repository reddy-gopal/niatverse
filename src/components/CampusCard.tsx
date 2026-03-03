import { Link } from 'react-router-dom';
import { Star, FileText } from 'lucide-react';
import type { Campus } from '../types';
import ImageWithFallback from './ImageWithFallback';
interface CampusCardProps {
  campus: Campus;
}

export default function CampusCard({ campus }: CampusCardProps) {
  return (
    <Link
      to={`/campus/${campus.id}`}
      className="block bg-section rounded-lg shadow-card overflow-hidden hover:shadow-lg hover:ring-2 hover:ring-[#991b1b] transition-all duration-200"
    >
      {/* Campus Image Area */}
      <div className="relative h-48 w-full">
        <ImageWithFallback
          src={campus.coverImage}
          alt={campus.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-5">
        {/* Campus name */}
        <h3 className="font-display text-lg font-bold text-black mb-1">
          {campus.name}
        </h3>

        {/* University */}
        <p className="text-sm text-black mb-2 line-clamp-1">
          {campus.university}
        </p>

        {/* Location */}
        <p className="text-sm text-black mb-3">
          {campus.city}, {campus.state}
        </p>

        {/* Stats row */}
        <div className="flex items-center space-x-3">
          {campus.rating && (
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-[#f7b801] fill-[#f7b801] mr-1" />
              <span className="font-medium text-black">{campus.rating}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-black">
            <FileText className="h-4 w-4 mr-1" />
            <span>{campus.articleCount} articles</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
