import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-xl font-bold text-slate-800">CPC Admissions</span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-xs font-semibold text-slate-600">
              Hello, {user.name || user.name || 'User'}
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-xs font-semibold bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="text-xs font-semibold text-slate-600 hover:text-blue-600">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition ml-2">
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
}