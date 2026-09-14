import { useNavigate } from 'react-router-dom';
import useStudentApplication from '../hooks/useStudentApplication';
import StudentHeader from '../components/common/StudentHeader';

interface StudentStatusPageProps {
  user: { id: number; name: string; email: string };
  onLogout: () => void;
}

export default function StudentStatusPage({ user, onLogout }: StudentStatusPageProps) {
  const navigate = useNavigate();
  const studentName = user?.name || 'Student';
  const studentEmail = user?.email || '';
  const studentId = Number(user?.id || 0);
  const { status, adminMessage, formData, error, profilePicUrl } = useStudentApplication(studentId || undefined);
  const statusClass = status.toLowerCase() === 'approved'
    ? 'success'
    : status.toLowerCase() === 'rejected'
      ? 'danger'
      : 'warning text-dark';

  return (
    <div className="student-shell min-vh-100">
      <StudentHeader onLogout={onLogout} />
      <main className="container py-4 py-md-5">
        <div className="mb-4">
          <p className="text-uppercase text-primary fw-bold small mb-1">Student Portal</p>
          <h1 className="student-page-title mb-1">My application status</h1>
          <p className="text-muted mb-0">Keep track of your admission review and messages from CPC Admissions.</p>
        </div>

      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-lg-4">
          <section className="student-card h-100 text-center">
            <div className="student-status-avatar mx-auto mb-3">
              {profilePicUrl ? <img src={profilePicUrl} alt="Profile" /> : (formData.full_name || studentName).charAt(0).toUpperCase()}
            </div>
            <h2 className="h4 fw-bold mb-1">{formData.full_name || studentName}</h2>
            <p className="text-muted mb-4">{studentEmail}</p>
            <span className={`badge bg-${statusClass} px-3 py-2`}>STATUS: {status.toUpperCase()}</span>
          </section>
        </div>
        <div className="col-lg-8">
          <section className="student-card h-100">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
              <div><h2 className="h4 fw-bold mb-1">Application overview</h2><p className="text-muted mb-0">Your saved admission information.</p></div>
              <span className="status-dot" aria-hidden="true" />
            </div>
            <dl className="row student-details mb-4">
              <dt className="col-sm-4">Phone</dt><dd className="col-sm-8">{formData.phone || 'Not saved yet'}</dd>
              <dt className="col-sm-4">Age</dt><dd className="col-sm-8">{formData.age || 'Not saved yet'}</dd>
              <dt className="col-sm-4">Address</dt><dd className="col-sm-8">{formData.address || 'Not saved yet'}</dd>
              <dt className="col-sm-4">Course</dt><dd className="col-sm-8">{formData.course_input || 'Not selected yet'}</dd>
            </dl>
            {adminMessage && <div className="student-message mb-4"><strong>Message from Admissions</strong><p className="mb-0 mt-1">{adminMessage}</p></div>}
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-primary" onClick={() => navigate('/student/profile')}>Edit Profile</button>
              <button className="btn btn-success" onClick={() => navigate('/student/requirements')}>View Requirements</button>
            </div>
          </section>
        </div>
      </div>
      </main>
    </div>
  );
}