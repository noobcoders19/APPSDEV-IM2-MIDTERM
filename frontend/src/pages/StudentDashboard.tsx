import useStudentApplication from '../hooks/useStudentApplication';
import { useNavigate } from 'react-router-dom';
import StudentHeader from '../components/common/StudentHeader';

interface StudentDashboardProps {
  user?: { id: number; name: string; email: string };
  onLogout?: () => void;
  initialStep?: 1 | 2;
}

interface StudentFormData {
  full_name?: string;
  phone?: string;
  age?: string | number;
  address?: string;
  course_input?: string;
}

export default function StudentDashboard({ user, onLogout, initialStep = 1 }: StudentDashboardProps) {
  const navigate = useNavigate();
  const {
    step,
    setStep,
    status = 'pending',
    error,
    successMsg,
    adminMessage,
    formData = {},
    files = {},
    profilePicUrl,
    profilePicFile,
    handleInputChange,
    handleFileChange,
    handleRemoveFile,
    handleSaveProfile,
    handleSubmitApplication,
  } = useStudentApplication(user?.id, initialStep);

  const typedFormData = (formData || {}) as StudentFormData;
  const typedFiles = (files || {}) as Record<string, File | null>;

  return (
    <div className="student-shell min-vh-100">
      {onLogout && <StudentHeader onLogout={onLogout} />}
      <main className="container py-4 py-md-5">
        <div className="mb-4">
          <p className="text-uppercase text-primary fw-bold small mb-1">Student Portal</p>
          <h1 className="student-page-title mb-1">Your application journey</h1>
          <p className="text-muted mb-0">Complete your profile, submit your requirements, and track your admission status.</p>
        </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {adminMessage && <div className="alert alert-info"><strong>Message from Admissions:</strong> {adminMessage}</div>}
      <div className="d-flex justify-content-end gap-2 mb-3">
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => navigate('/student/status')}>
          View My Status & Messages
        </button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm p-4 border-0 text-center">
            <div className="d-flex justify-content-center mb-3">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="rounded-circle object-fit-cover shadow-sm"
                  style={{ width: '100px', height: '100px' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-2 shadow-sm"
                  style={{ width: '100px', height: '100px' }}
                >
                  {(typedFormData.full_name || user?.name || 'S').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h4 className="fw-bold mb-1">{typedFormData.full_name || user?.name || 'Student'}</h4>
            <p className="text-muted small mb-3">{user?.email || 'Student Applicant'}</p>
            <div>
              <span
                className={`badge px-3 py-2 bg-${
                  status.toLowerCase() === 'approved'
                    ? 'success'
                    : status.toLowerCase() === 'rejected'
                    ? 'danger'
                    : 'warning text-dark'
                }`}
              >
                STATUS: {status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm p-4 border-0">
            <div className="d-flex border-bottom pb-3 mb-4">
              <button
                type="button"
                className={`btn btn-link text-decoration-none p-0 me-4 fw-bold ${
                  step === 1 ? 'text-primary border-bottom border-primary border-2 pb-1' : 'text-muted'
                }`}
                onClick={() => setStep(1)}
              >
                1. PERSONAL PROFILE
              </button>
              <button
                type="button"
                className={`btn btn-link text-decoration-none p-0 fw-bold ${
                  step === 2 ? 'text-primary border-bottom border-primary border-2 pb-1' : 'text-muted'
                }`}
                onClick={() => setStep(2)}
              >
                2. COURSE & REQUIREMENTS
              </button>
            </div>

            {step === 1 && (
              <form onSubmit={handleSaveProfile}>
                <div className="mb-3 p-3 bg-light rounded border">
                  <label className="form-label small fw-bold">PROFILE PICTURE</label>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      key={profilePicFile?.name || 'empty-profile-picture'}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => handleFileChange(e, 'profile_picture')}
                    />
                    {profilePicFile && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm flex-shrink-0"
                        onClick={() => handleRemoveFile('profile_picture')}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">FULL NAME</label>
                  <input
                    type="text"
                    name="full_name"
                    className="form-control"
                    value={typedFormData.full_name || ''}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold">PHONE NUMBER</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={typedFormData.phone || ''}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold">AGE</label>
                    <input
                      type="number"
                      name="age"
                      className="form-control"
                      value={typedFormData.age || ''}
                      onChange={handleInputChange}
                      placeholder="Enter age"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">ADDRESS</label>
                  <textarea
                    name="address"
                    className="form-control"
                    rows={2}
                    value={typedFormData.address || ''}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button type="submit" className="btn btn-primary fw-semibold">
                    Save & Next: Requirements
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmitApplication}>
                <div className="mb-4">
                  <label className="form-label small fw-bold">SELECT COURSE</label>
                  <select
                    name="course_input"
                    className="form-select"
                    value={typedFormData.course_input || 'BS Information Technology'}
                    onChange={handleInputChange}
                  >
                    <option value="BS Information Technology">BS Information Technology</option>
                    <option value="BS Business Administration">BS Business Administration</option>
                    <option value="BS Elementary Education">BS Elementary Education</option>
                    <option value="BS Hospitality Management">BS Hospitality Management</option>
                  </select>
                </div>

                <h6 className="fw-bold mb-3">SUBMITTED DOCUMENTS</h6>
                {['photo_2x2', 'valid_id', 'report_card', 'birth_certificate'].map((field) => (
                  <div
                    key={field}
                    className="mb-3 p-3 bg-light rounded border d-flex justify-content-between align-items-center"
                  >
                    <div className="w-75">
                      <label className="form-label fw-bold text-uppercase small m-0">
                        {field.replace('_', ' ')}
                      </label>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <input
                          key={`${field}-${typedFiles[field]?.name || 'empty'}`}
                          type="file"
                          className="form-control form-control-sm"
                          onChange={(e) => handleFileChange(e, field)}
                        />
                        {typedFiles[field] && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm flex-shrink-0"
                            onClick={() => handleRemoveFile(field)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                    {typedFiles[field] && <span className="badge bg-success ms-2">Selected</span>}
                  </div>
                ))}

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setStep(1)}
                  >
                    Back to Profile
                  </button>
                  <button type="submit" className="btn btn-success fw-semibold">
                    Submit Requirements
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}