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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
        <AuthProvider>
          <Navbar />
          
          <main className="flex-grow flex flex-col">
            {children}
          </main>

          {/* Calm Minimalist Footer */}
          <footer className="border-t border-slate-200 bg-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} GlobalTNA. Built by Antigravity AI for Intern Technical Assessment. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <span className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer transition-colors duration-150">Privacy Policy</span>
                <span className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer transition-colors duration-150">Terms of Service</span>
                <span className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer transition-colors duration-150">Contact Support</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
