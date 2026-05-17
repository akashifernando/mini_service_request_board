export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-800/80"></div>
        {/* Spinning Gradient Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-xl opacity-20 animate-pulse"></div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-400 animate-pulse tracking-wide">
        Loading requests...
      </p>
    </div>
  );
}
