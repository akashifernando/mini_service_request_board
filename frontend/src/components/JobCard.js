'use client';

import Link from 'next/link';

// Helper for status badge colors
const getStatusStyles = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20';
    case 'In Progress':
      return 'bg-amber-500/10 text-amber-450 border border-amber-500/20';
    case 'Closed':
      return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    default:
      return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
  }
};

// Helper for category badge colors
const getCategoryStyles = (category) => {
  switch (category) {
    case 'Plumbing':
      return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
    case 'Electrical':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'Painting':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    case 'Joinery':
      return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
    case 'Gardening':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'Cleaning':
      return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
    default:
      return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
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
    <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/40 hover:shadow-[0_15px_30px_-10px_rgba(124,58,237,0.25)] group relative overflow-hidden">
      {/* Dynamic Glowing Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Category & Status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryStyles(category)}`}>
            {category}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(status)}`}>
            {status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-zinc-100 group-hover:text-violet-400 transition-colors duration-200 line-clamp-1 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-zinc-400 line-clamp-3 mb-6 leading-relaxed font-medium">
          {truncateDesc(description)}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 border-t border-zinc-800/60 flex items-center justify-between relative z-10">
        <div className="flex flex-col space-y-0.5">
          {/* Location */}
          <div className="flex items-center text-xs font-semibold text-zinc-300">
            <svg className="w-3.5 h-3.5 text-zinc-500 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          {/* Posted Date */}
          <span className="text-[10px] text-zinc-500">Posted {formattedDate}</span>
        </div>

        {/* Action Button */}
        <Link 
          href={`/jobs/${_id}`}
          className="text-xs font-bold text-zinc-350 hover:text-white bg-zinc-950/40 hover:bg-violet-650 border border-zinc-850 hover:border-violet-600 px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
