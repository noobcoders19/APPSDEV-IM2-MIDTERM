import React from 'react';
import { useNavigate } from 'react-router-dom';

interface StudentHeaderProps {
  onLogout: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
        <img src="/cpclogo.png" alt="CPC Logo" className="w-10 h-10 object-contain" />
        <span className="text-xl font-bold text-slate-800">
          CPC Admissions <span className="text-xs text-blue-600 block">STUDENT PORTAL</span>
        </span>
      </div>
      <button
        onClick={onLogout}
        className="text-sm font-semibold bg-rose-50 text-rose-600 px-4 py-2 rounded-lg hover:bg-rose-100 transition"
      >
        Logout
      </button>
    </header>
  );
};