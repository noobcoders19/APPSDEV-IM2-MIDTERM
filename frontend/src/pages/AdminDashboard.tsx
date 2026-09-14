import { useNavigate } from 'react-router-dom';
import { useAdminApplications } from '../hooks/useAdminApplications';
import { ApplicantList } from '../components/admin/ApplicantList';
import { ApplicantDetails } from '../components/admin/ApplicantDetails';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    applications,
    selectedApp,
    loading,
    handleSelectApp,
    updateStatus,
    message,
    setMessage,
    sendMessage,
    removeApplication,
  } = useAdminApplications();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src="/cpclogo.png" alt="CPC Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-slate-800">
            CPC Admissions <span className="text-xs text-blue-600 block">ADMIN PORTAL</span>
          </span>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
          className="text-sm font-semibold bg-rose-50 text-rose-600 px-4 py-2 rounded-lg hover:bg-rose-100"
        >
          Logout
        </button>
      </header>

      <div className="p-6 max-w-7xl mx-auto w-full flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Control Center</h1>
            <p className="text-slate-500 text-sm">Review student requirements & set verification schedules</p>
          </div>
          <div className="bg-blue-50 text-blue-700 font-semibold px-4 py-2 rounded-lg text-sm border border-blue-200">
            Total Applications: {applications.length}
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10 text-slate-500">Loading applications...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
            <p className="text-slate-500 font-medium">No student applications submitted yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ApplicantList
              applications={applications}
              selectedApp={selectedApp}
              onSelectApp={handleSelectApp}
              onRemoveApp={removeApplication}
            />

            {selectedApp && (
              <ApplicantDetails
                selectedApp={selectedApp}
                updateStatus={updateStatus}
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}