'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const CATEGORIES = ['All Categories', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Gardening', 'Cleaning', 'Other'];
const STATUSES = ['All Statuses', 'Open', 'In Progress', 'Closed'];

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Statuses');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch jobs from backend API
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (category !== 'All Categories') {
        queryParams.append('category', category);
      }
      
      if (status !== 'All Statuses') {
        queryParams.append('status', status);
      }
      
      if (debouncedSearch.trim() !== '') {
        queryParams.append('search', debouncedSearch.trim());
      }

      const res = await fetch(`${API_URL}/jobs?${queryParams.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch job requests');
      }

      setJobs(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, status, debouncedSearch]);

  // Fetch jobs on parameter change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow relative">
      
      {/* Premium Ambient Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Mini Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">Request Board</span>
        </h1>
        <p className="text-base text-zinc-400 font-medium leading-relaxed max-w-xl mx-auto">
          Connecting homeowners with certified, local tradespeople. Browse requests below or post your own service request in minutes.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 mb-12 shadow-xl shadow-zinc-950/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search requests by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-300 outline-none transition-all duration-200 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-zinc-950 text-zinc-300">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-300 outline-none transition-all duration-200 cursor-pointer"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat} className="bg-zinc-950 text-zinc-300">
                  {stat}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Main Jobs Listing */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center font-semibold max-w-md mx-auto my-10">
          <p>{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-8 max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto text-zinc-650 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-base font-bold text-zinc-200 mb-1.5">No requests found</h3>
          <p className="text-xs text-zinc-500 mb-6 font-medium leading-relaxed">Try adjusting your filter settings, or post a brand new service request!</p>
          <Link 
            href="/jobs/new"
            className="inline-flex items-center bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 hover:text-violet-300 font-bold px-5 py-2.5 rounded-xl border border-violet-500/20 hover:border-violet-500/30 text-xs transition-all duration-200"
          >
            Post a New Request
          </Link>
        </div>
      ) : (
        <div>
          {/* Active Counters */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
              Active Board Requests 
              <span className="text-[10px] font-bold bg-zinc-900/80 text-violet-400 border border-zinc-800 px-2.5 py-0.5 rounded-full ml-2">
                {jobs.length} open
              </span>
            </h2>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
