import React from 'react';

type ActiveTab = 'personal' | 'requirements' | 1 | 2 | '1' | '2';

interface StudentFormData {
  fullName?: string;
  phone?: string;
  age?: string | number;
  address?: string;
  courseInput?: string;
}

type StudentFiles = Record<string, File | null | undefined>;

interface StudentProfileFormProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  formData: StudentFormData;
  files: StudentFiles;
  submitting: boolean;
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  handleRemoveFile: (fieldName: string) => void;
  submitApplication: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const StudentProfileForm: React.FC<StudentProfileFormProps> = ({
  activeTab,
  setActiveTab,
  formData,
  files,
  submitting,
  handleTextChange,
  handleFileChange,
  handleRemoveFile,
  submitApplication,
  onCancel,
}) => {
  const isRequirementsTab = activeTab === 'requirements' || activeTab === 2 || activeTab === '2';

  return (
    <form onSubmit={submitApplication}>
      <div className="flex border-b border-slate-200 mb-6 space-x-8">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={`pb-3 font-semibold text-sm transition border-b-2 ${
            !isRequirementsTab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          1. PERSONAL PROFILE
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('requirements')}
          className={`pb-3 font-semibold text-sm transition border-b-2 ${
            isRequirementsTab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          2. COURSE & REQUIREMENTS
        </button>
      </div>

      {!isRequirementsTab ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-2">Profile Picture</h3>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6 flex items-center justify-between">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profilePicture')}
                className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
              {files.profilePicture && (
                <p className="text-xs text-emerald-600 mt-2 font-medium">Selected: {files.profilePicture.name}</p>
              )}
            </div>
            {files.profilePicture && (
              <button
                type="button"
                onClick={() => handleRemoveFile('profilePicture')}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleTextChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleTextChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleTextChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleTextChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requirements')}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Next: Requirements
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Select Degree Program</label>
            <select
              name="courseInput"
              value={formData.courseInput || ''}
              onChange={handleTextChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BS Information Technology">BS Information Technology</option>
              <option value="BS Business Administration">BS Business Administration</option>
              <option value="Bachelor of Elementary Education">Bachelor of Elementary Education</option>
              <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: '2X2 ID PHOTO', key: 'idPhoto2x2' },
              { label: 'VALID ID CARD', key: 'validId' },
              { label: 'REPORT CARD / FORM 138', key: 'reportCard' },
              { label: 'BIRTH CERTIFICATE (PSA)', key: 'birthCert' },
            ].map((req) => (
              <div key={req.key} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">{req.label}</label>
                <div className="flex items-center justify-between">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, req.key)}
                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  />
                  {files[req.key] && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(req.key)}
                      className="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {files[req.key] && (
                  <p className="text-xs text-emerald-600 mt-2 font-medium">Selected: {files[req.key]?.name}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300 transition"
            >
              Back
            </button>
            <div className="space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition duration-200"
              >
                {submitting ? 'Saving...' : 'Save & Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};