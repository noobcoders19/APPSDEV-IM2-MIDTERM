import React from 'react';

interface StudentProfileViewProps {
  formData: {
    fullName: string;
    phone: string;
    age: string;
    courseInput: string;
    address: string;
    previousSchool: string;
    guardianName: string;
  };
  onEdit: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ formData, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Submitted Application Summary</h3>
          <p className="text-xs text-slate-400">Your information is saved and visible to the admissions admin.</p>
        </div>
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
        >
          Edit Information
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-xs text-slate-400 block uppercase font-bold">Full Name</span>
          <span className="font-semibold text-slate-800">{formData.fullName}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block uppercase font-bold">Phone Number</span>
          <span className="font-semibold text-slate-800">{formData.phone || 'Not provided'}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block uppercase font-bold">Age</span>
          <span className="font-semibold text-slate-800">{formData.age || 'Not provided'}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block uppercase font-bold">Guardian Name</span>
          <span className="font-semibold text-slate-800">{formData.guardianName || 'Not provided'}</span>
        </div>
        <div className="md:col-span-2">
          <span className="text-xs text-slate-400 block uppercase font-bold">Complete Address</span>
          <span className="font-semibold text-slate-800">{formData.address || 'Not provided'}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block uppercase font-bold">Previous School</span>
          <span className="font-semibold text-slate-800">{formData.previousSchool || 'Not provided'}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block uppercase font-bold">Selected Course</span>
          <span className="font-semibold text-blue-600">{formData.courseInput}</span>
        </div>
      </div>
    </div>
  );
};