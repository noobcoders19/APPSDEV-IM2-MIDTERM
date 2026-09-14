import React from 'react';
import type { Application } from '../../hooks/useAdminApplications';

interface ApplicantListProps {
  applications: Application[];
  selectedApp: Application | null;
  onSelectApp: (app: Application) => void;
  onRemoveApp: (app: Application) => void;
}

export const ApplicantList: React.FC<ApplicantListProps> = ({
  applications,
  selectedApp,
  onSelectApp,
  onRemoveApp,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 h-fit">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Student Applicants List</h2>
      <div className="space-y-2">
        {applications.map((app) => (
          <div
            key={app.id}
            onClick={() => onSelectApp(app)}
            className={`p-3 rounded-xl cursor-pointer transition ${
              selectedApp?.id === app.id ? 'bg-blue-50 border-blue-300 border' : 'hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex justify-between items-center gap-2">
              <span className="font-bold text-slate-800">{app.full_name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  app.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-700'
                    : app.status === 'Rejected'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
                >
                  {app.status || 'Pending'}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${app.full_name || 'application'}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveApp(app);
                  }}
                  className="text-[10px] font-semibold text-rose-600 hover:text-rose-800"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="text-xs text-blue-600 font-medium mt-1">{app.course_input || 'No course selected'}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{app.phone || 'No phone number'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};