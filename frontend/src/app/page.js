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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
      
      {/* Calm Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Mini Service Request Board
        </h1>
        <p className="text-base text-slate-500 font-medium leading-relaxed">
          Browse local service requests or post your own. Homeowners connect with certified tradespeople instantly.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search requests by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all duration-150"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 rounded-lg py-2.5 px-3 text-sm text-slate-700 outline-none transition-all duration-150 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
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
              className="w-full bg-slate-50/50 border border-slate-200 focus:border-indigo-500 rounded-lg py-2.5 px-3 text-sm text-slate-700 outline-none transition-all duration-150 cursor-pointer"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat}>
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
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center font-medium max-w-md mx-auto my-10">
          <p>{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 max-w-md mx-auto">
          <svg className="w-10 h-10 mx-auto text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-bold text-slate-800 mb-1">No requests found</h3>
          <p className="text-xs text-slate-500 mb-5 font-medium">Try modifying your filters, or create a brand new service request!</p>
          <Link 
            href="/jobs/new"
            className="inline-flex items-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2 rounded border border-indigo-200 text-xs transition-all duration-150"
          >
            Post a New Request
          </Link>
        </div>
      ) : (
        <div>
          {/* Active Counters */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Open Requests <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded ml-1">{jobs.length} found</span>
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
