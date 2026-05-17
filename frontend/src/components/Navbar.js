'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-extrabold text-sm transition-transform duration-150">
                G
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Global<span className="text-indigo-600 font-extrabold">TNA</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                <Link 
                  href="/jobs/new" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-150"
                >
                  Post a Job
                </Link>

                <div className="flex items-center pl-3 border-l border-slate-200 space-x-3">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                    <span className="text-xs text-slate-500">Homeowner / Trades</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-slate-500 hover:text-red-600 hover:bg-red-50/50 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-slate-900 shadow-sm transition-all duration-150"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
