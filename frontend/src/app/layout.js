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
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden relative antialiased">
        {/* Modern Ambient Glowing Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-indigo-500/10 blur-[80px] sm:blur-[140px] animate-pulse duration-[8000ms]"></div>
          <div className="absolute top-[5%] right-[5%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-violet-500/10 blur-[80px] sm:blur-[140px] animate-pulse duration-[10000ms]"></div>
        </div>

        <AuthProvider>
          <Navbar />
          
          <main className="flex-grow flex flex-col z-10 relative">
            {children}
          </main>

          {/* Premium Glassmorphic Footer */}
          <footer className="border-t border-zinc-900 bg-zinc-950/40 backdrop-blur-md py-8 mt-auto z-10 relative">
            <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <p className="text-xs text-zinc-500">
                &copy; {new Date().getFullYear()} GlobalTNA. Built for Intern Technical Assessment. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <span className="text-xs text-zinc-500 hover:text-violet-400 cursor-pointer transition-colors duration-200">Privacy Policy</span>
                <span className="text-xs text-zinc-500 hover:text-violet-400 cursor-pointer transition-colors duration-200">Terms of Service</span>
                <span className="text-xs text-zinc-500 hover:text-violet-400 cursor-pointer transition-colors duration-200">Contact Support</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
