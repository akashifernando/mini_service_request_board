'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';
import LoadingSpinner from '../../../components/LoadingSpinner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const getStatusBadgeStyles = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20';
    case 'In Progress':
      return 'bg-amber-500/10 text-amber-450 border border-amber-500/20';
    case 'Closed':
      return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    default:
      return 'bg-zinc-850 text-zinc-400 border border-zinc-800';
  }
};

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status and Delete operation state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch job details
  const fetchJobDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to retrieve job details');
      }

      setJob(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    if (!token) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update job status');
      }

      setJob(data.data);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!token) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete job request');
      }

      router.push('/');
    } catch (err) {
      alert(`Error deleting job: ${err.message}`);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex-grow flex flex-col justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl mb-6">
          <svg className="w-10 h-10 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-base font-bold mb-1">Resource Not Found</h2>
          <p className="text-xs font-semibold">{error || 'This service request could not be located in our records.'}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-150"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { title, description, category, location, contactName, contactEmail, status, createdAt } = job;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow relative">
      
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Details Panel */}
        <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-8 shadow-xl shadow-zinc-950/20 space-y-6">
          
          {/* Header */}
          <div className="border-b border-zinc-800/60 pb-6 space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(status)}`}>
                {status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 leading-snug">
              {title}
            </h1>
            <div className="flex flex-wrap items-center text-zinc-450 text-xs font-semibold gap-y-2 gap-x-6">
              <span className="flex items-center text-zinc-300">
                <svg className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </span>
              <span className="flex items-center text-zinc-400">
                <svg className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Posted {formattedDate}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Project Description
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap">
              {description}
            </p>
          </div>

        </div>

        {/* Info & Administration Sidebar */}
        <div className="space-y-6">
          
          {/* Contact Details Card */}
          <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl shadow-zinc-950/20 space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/60 pb-3">
              Contact Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Contact Name</p>
                <p className="font-extrabold text-zinc-200">{contactName}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                <a 
                  href={`mailto:${contactEmail}`} 
                  className="font-extrabold text-violet-400 hover:text-violet-300 transition-colors duration-150 break-all hover:underline"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Administrative Control Panel */}
          {user ? (
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl shadow-zinc-950/20 space-y-5">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/60 pb-3">
                Action Center
              </h3>
              
              {/* Status Update Select */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Update Job Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-violet-500 rounded-xl py-3 px-4 text-sm text-zinc-300 outline-none transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    <option value="Open" className="bg-zinc-950">Open</option>
                    <option value="In Progress" className="bg-zinc-950">In Progress</option>
                    <option value="Closed" className="bg-zinc-950">Closed</option>
                  </select>
                  {updatingStatus && (
                    <span className="absolute right-10 top-3">
                      <svg className="animate-spin h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </div>
              </div>

              {/* Delete Request Section */}
              <div className="border-t border-zinc-800/60 pt-4">
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full bg-red-950/10 hover:bg-red-950/20 text-red-400 hover:text-red-300 font-bold py-3 px-4 rounded-xl border border-red-900/30 hover:border-red-900/60 text-xs transition-all duration-200 text-center cursor-pointer"
                  >
                    Delete Job Request
                  </button>
                ) : (
                  <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-red-400 leading-normal">
                      Are you sure you want to delete this job request?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-grow bg-red-650 hover:bg-red-650 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition-all duration-200"
                      >
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                        className="flex-grow bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 font-bold py-2 px-3 rounded-lg text-xs transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl text-center space-y-4">
              <svg className="w-8 h-8 text-zinc-550 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-zinc-400 font-bold leading-relaxed">
                Sign in to manage this request or update its status.
              </p>
              <Link 
                href="/login"
                className="block w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-200 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 active:scale-[0.98]"
              >
                Sign In
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
