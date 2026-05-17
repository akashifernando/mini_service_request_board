'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/70 backdrop-blur-md border-b border-zinc-900/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-transform duration-200 group-hover:scale-105">
                G
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Global<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">TNA</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-zinc-900/40"
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                <Link 
                  href="/jobs/new" 
                  className="bg-violet-600 hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                >
                  Post a Job
                </Link>

                <div className="flex items-center pl-3 border-l border-zinc-800 space-x-3">
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-bold text-zinc-200">{user.name}</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Member</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-zinc-400 hover:text-red-400 hover:bg-red-950/20 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-zinc-300 hover:text-white hover:bg-zinc-900/40 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-zinc-700/50 shadow-sm transition-all duration-150 active:scale-[0.98]"
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
