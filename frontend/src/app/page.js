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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
          Find Local Jobs & Get Things Done with{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            GlobalTNA
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 font-medium">
          Homeowners post service requests in seconds. Tradespeople browse available jobs, track project progression, and connect instantly.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/30 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 mb-10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by keywords (e.g. leaking tap)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:ring-1 focus:ring-purple-500/30 transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500/50 rounded-xl py-3 px-4 text-sm text-slate-300 outline-none transition-all duration-200 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-950 text-slate-300">
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
              className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500/50 rounded-xl py-3 px-4 text-sm text-slate-300 outline-none transition-all duration-200 cursor-pointer"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat} className="bg-slate-950 text-slate-300">
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
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-xl text-center font-medium max-w-md mx-auto my-10">
          <svg className="w-8 h-8 mx-auto mb-2 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 rounded-2xl border border-dashed border-slate-800 p-8 max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-slate-300 mb-1">No service requests found</h3>
          <p className="text-sm text-slate-500 mb-6 font-medium">Try modifying your filters or search terms, or create a brand new service request!</p>
          <Link 
            href="/jobs/new"
            className="inline-flex items-center bg-purple-600/20 hover:bg-purple-600/35 text-purple-300 font-semibold px-4 py-2 rounded-lg border border-purple-500/30 transition-all duration-200"
          >
            Post a New Request
          </Link>
        </div>
      ) : (
        <div>
          {/* Active Counters */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-300">
              Open Requests <span className="text-xs font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full ml-1">{jobs.length} found</span>
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
