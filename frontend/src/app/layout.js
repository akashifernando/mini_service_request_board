import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'GlobalTNA Service Request Board | Find Home Services',
  description: 'Browse local plumbing, electrical, joinery, and painting service requests or post your own. Connecting homeowners with professional tradespeople instantly.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050814] text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
        <AuthProvider>
          {/* Subtle Ambient Background Auras */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-10000"></div>
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
          <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

          <Navbar />
          
          <main className="flex-grow flex flex-col">
            {children}
          </main>

          {/* Premium Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/30 py-8 mt-auto backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} GlobalTNA. Built by Antigravity AI for Intern Technical Assessment. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <span className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer">Privacy Policy</span>
                <span className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer">Terms of Service</span>
                <span className="text-xs text-slate-500 hover:text-slate-400 cursor-pointer">Contact Support</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
