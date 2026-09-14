import { useNavigate } from 'react-router-dom';

interface StudentHeaderProps {
  onLogout: () => void;
}

export default function StudentHeader({ onLogout }: StudentHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container py-3 d-flex justify-content-between align-items-center">
        <button
          type="button"
          className="btn p-0 d-flex align-items-center gap-3 text-start"
          onClick={() => navigate('/student/status')}
        >
          <img src="/cpclogo.png" alt="CPC Logo" className="student-brand-logo" />
          <span className="student-brand-title">Student Online Application System</span>
        </button>
        <button className="btn btn-outline-danger btn-sm fw-semibold px-3" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
