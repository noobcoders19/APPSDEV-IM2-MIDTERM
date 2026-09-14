import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
        <img 
          src="/cpclogo.png" 
          alt="CPC Logo" 
          className="w-10 h-10 object-contain" 
        />
        <span className="text-xl font-bold text-slate-800">Student Online Application System</span>
      </div>
      <div className="flex items-center gap-5">
           <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-blue-600">
          Sign In
        </button>
          <button onClick={() => navigate('/register')} className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ml-2">
          Register
        </button>
      </div>
    </header>
  );
};