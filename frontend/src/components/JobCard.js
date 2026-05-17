'use client';

import Link from 'next/link';

// Helper for status badge colors
const getStatusStyles = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'In Progress':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'Closed':
      return 'bg-slate-700/30 text-slate-400 border border-slate-700/50';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
};

// Helper for category badge colors
const getCategoryStyles = (category) => {
  switch (category) {
    case 'Plumbing':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    case 'Electrical':
      return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    case 'Painting':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'Joinery':
      return 'bg-amber-700/10 text-amber-500 border border-amber-700/20';
    case 'Gardening':
      return 'bg-green-500/10 text-green-400 border border-green-500/20';
    case 'Cleaning':
      return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
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
    <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 hover:border-slate-700/80 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 group">
      <div>
        {/* Category & Status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryStyles(category)}`}>
            {category}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyles(status)}`}>
            {status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors duration-200 line-clamp-1 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-3 mb-6 font-medium leading-relaxed">
          {truncateDesc(description)}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          {/* Location */}
          <div className="flex items-center text-xs font-semibold text-slate-300">
            <svg className="w-3.5 h-3.5 text-purple-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          {/* Posted Date */}
          <span className="text-xs text-slate-500">Posted {formattedDate}</span>
        </div>

        {/* Action Button */}
        <Link 
          href={`/jobs/${_id}`}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-3.5 py-2 rounded-lg border border-purple-500/20 hover:border-purple-500/40 group-hover:bg-purple-500/5 transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
