import { useNavigate } from 'react-router-dom';
import { AuthHeader } from '../components/auth/AuthHeader';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AuthHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>Online Application System</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 max-w-2xl">
          Welcome to Cordova Public College
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-xl mb-8">
          Apply online, upload your requirements, and track your application status in real-time.
        </p>

        <button
          onClick={() => navigate('/register')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition duration-200"
        >
          Apply Now
        </button>
      </main>
    </div>
  );
}