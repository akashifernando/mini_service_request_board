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
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'In Progress':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'Closed':
      return 'bg-slate-700/30 text-slate-400 border border-slate-700/50';
    default:
      return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
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
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl mb-6">
          <svg className="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-lg font-bold mb-1">Resource Not Found</h2>
          <p className="text-xs font-semibold">{error || 'This service request could not be located in our records.'}</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow relative">
      
      {/* Back button */}
      <Link 
        href="/"
        className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-lg transition-all duration-200 mb-8"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Details Panel */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-8 shadow-xl relative space-y-6">
          
          {/* Header */}
          <div className="border-b border-slate-800/60 pb-6 space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                {category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyles(status)}`}>
                {status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
              {title}
            </h1>
            <div className="flex items-center text-slate-400 text-xs font-semibold space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 text-purple-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location}
              </span>
              <span>Posted {formattedDate}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Project Description
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
              {description}
            </p>
          </div>

        </div>

        {/* Info & Administration Sidebar */}
        <div className="space-y-6">
          
          {/* Contact Details Card */}
          <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
              Contact Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-0.5">Name</p>
                <p className="font-bold text-slate-200">{contactName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-0.5">Email Address</p>
                <a 
                  href={`mailto:${contactEmail}`} 
                  className="font-bold text-purple-400 hover:text-purple-300 transition-colors duration-200 break-all"
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Administrative Control Panel */}
          {user ? (
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-xl space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                Action Center
              </h3>
              
              {/* Status Update Select */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Update Job Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full bg-slate-950/70 border border-slate-800 focus:border-purple-500/50 rounded-xl py-3 px-4 text-sm text-slate-300 outline-none transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    <option value="Open" className="bg-slate-950 text-slate-300">Open</option>
                    <option value="In Progress" className="bg-slate-950 text-slate-300">In Progress</option>
                    <option value="Closed" className="bg-slate-950 text-slate-300">Closed</option>
                  </select>
                  {updatingStatus && (
                    <span className="absolute right-10 top-3.5">
                      <svg className="animate-spin h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </div>
              </div>

              {/* Delete Request Section */}
              <div className="border-t border-slate-800/80 pt-4">
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full bg-red-950/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 font-bold py-3 px-4 rounded-xl border border-red-500/20 hover:border-red-500/40 text-sm transition-all duration-200 text-center"
                  >
                    Delete Job Request
                  </button>
                ) : (
                  <div className="bg-red-950/25 border border-red-500/25 rounded-xl p-4 space-y-3 animate-fade-in">
                    <p className="text-xs font-bold text-red-400 leading-normal">
                      Are you absolutely sure you want to delete this job request? This action is irreversible.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-grow bg-red-600 hover:bg-red-500 text-white font-extrabold py-2 px-3 rounded-lg text-xs transition-all duration-200"
                      >
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={deleting}
                        className="flex-grow bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-3 rounded-lg text-xs transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-xl text-center space-y-4">
              <svg className="w-8 h-8 text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Log in to claim/manage this job request or change its status.
              </p>
              <Link 
                href="/login"
                className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-slate-700 hover:border-slate-600 transition-all duration-200"
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
