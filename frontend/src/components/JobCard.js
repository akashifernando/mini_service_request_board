'use client';

import Link from 'next/link';

// Helper for status badge colors
const getStatusStyles = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'In Progress':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'Closed':
      return 'bg-slate-100 text-slate-600 border border-slate-200';
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-200';
  }
};

// Helper for category badge colors
const getCategoryStyles = (category) => {
  switch (category) {
    case 'Plumbing':
      return 'bg-sky-50 text-sky-700 border border-sky-200';
    case 'Electrical':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'Painting':
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'Joinery':
      return 'bg-orange-50 text-orange-700 border border-orange-200';
    case 'Gardening':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'Cleaning':
      return 'bg-pink-50 text-pink-700 border border-pink-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};

export default function JobCard({ job }) {
  const { _id, title, description, category, location, status, createdAt } = job;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Shorten description for preview
  const truncateDesc = (text, max = 120) => {
    if (text.length <= max) return text;
    return text.substring(0, max) + '...';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300 group">
      <div>
        {/* Category & Status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getCategoryStyles(category)}`}>
            {category}
          </span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getStatusStyles(status)}`}>
            {status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-150 line-clamp-1 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed font-medium">
          {truncateDesc(description)}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col space-y-0.5">
          {/* Location */}
          <div className="flex items-center text-xs font-semibold text-slate-700">
            <svg className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          {/* Posted Date */}
          <span className="text-[10px] text-slate-400">Posted {formattedDate}</span>
        </div>

        {/* Action Button */}
        <Link 
          href={`/jobs/${_id}`}
          className="text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 px-3 py-1.5 rounded border border-slate-200 transition-all duration-150"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
