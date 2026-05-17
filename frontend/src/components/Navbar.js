'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/75 border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
                T
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent group-hover:text-white transition-colors duration-200">
                Global<span className="text-purple-400 font-extrabold">TNA</span> Board
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                <Link 
                  href="/jobs/new" 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Post a Job
                </Link>

                <div className="flex items-center pl-3 border-l border-slate-800 space-x-3">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-semibold text-slate-200">{user.name}</span>
                    <span className="text-xs text-slate-400">Homeowner / Trades</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-slate-700 hover:border-slate-600 shadow-md transition-all duration-200"
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
