'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Gardening', 'Cleaning', 'Other'];

export default function NewJob() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Redirect unauthorized users
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Autofill contact fields from logged-in user if available
  useEffect(() => {
    if (user) {
      setContactName(user.name || '');
      setContactEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationError('');

    // Input validations
    if (!title || !description || !category || !location || !contactName || !contactEmail) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      setValidationError('Please enter a valid contact email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          contactName,
          contactEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit service request');
      }

      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 text-slate-500 font-semibold animate-pulse">
        Verifying user credentials...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow relative">
      
      {/* Back button */}
      <Link 
        href="/"
        className="inline-flex items-center text-xs font-bold text-zinc-400 hover:text-white bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/80 px-4 py-2.5 rounded-xl transition-all duration-200 mb-8 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 shadow-xl shadow-zinc-950/20">
        
        <div className="border-b border-zinc-800/60 pb-5 mb-6">
          <h1 className="text-xl font-bold text-zinc-100">Post a Service Request</h1>
          <p className="text-xs text-zinc-500 font-semibold mt-1">
            Complete the fields below to describe your service request.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Display validation or server error */}
          {(validationError || error) && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{validationError || error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Need a plumber for a leaking kitchen tap"
                maxLength={100}
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-150 placeholder-zinc-550 outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-300 outline-none transition-all duration-200 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-zinc-950">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Location (e.g. Glasgow) <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Glasgow West End"
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-150 placeholder-zinc-550 outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the issue. What needs fixing?"
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-150 placeholder-zinc-550 outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 resize-none"
              />
            </div>

            <div className="md:col-span-2 border-t border-zinc-800/60 pt-5 mt-2">
              <h3 className="text-sm font-bold text-zinc-200">Contact Details</h3>
            </div>

            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contactName"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Jane Smith"
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-150 placeholder-zinc-550 outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-150 placeholder-zinc-550 outline-none focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
              />
            </div>

          </div>

          <div className="pt-5 border-t border-zinc-800/60 flex items-center justify-end space-x-4">
            <Link
              href="/"
              className="text-zinc-450 hover:text-zinc-200 px-5 py-3 text-sm font-bold hover:bg-zinc-900/40 rounded-xl transition-all duration-200"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white font-bold px-6 py-3 rounded-xl text-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Post Request'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
