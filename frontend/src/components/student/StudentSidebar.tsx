import React from 'react';

interface StudentSidebarProps {
  userFullName: string;
  status: string;
  previewProfile: string | null;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  userFullName,
  status,
  previewProfile,
  isEditing,
  onToggleEdit,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit space-y-4">
      <div className="w-20 h-20 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center text-blue-600 font-bold text-3xl mx-auto border-4 border-white shadow-sm">
        {previewProfile ? (
          <img src={previewProfile} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span>{userFullName ? userFullName.charAt(0).toUpperCase() : 'S'}</span>
        )}
      </div>
      <div className="text-center">
        <h2 className="font-bold text-slate-800 text-lg truncate">{userFullName || 'Student'}</h2>
        <p className="text-xs text-slate-400">Student Applicant</p>
      </div>
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-500 uppercase">Status</span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
          status?.toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-700' :
          status?.toLowerCase() === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {status || 'Pending'}
        </span>
      </div>
      {!isEditing && (
        <button
          onClick={onToggleEdit}
          className="w-full mt-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold py-2 rounded-xl text-xs transition"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};