import React from 'react';
import { Button } from '../ui/Button';

interface ProfileFormProps {
  formData: {
    fullName: string;
    phone: string;
    age: string | number;
    courseInput: string;
    address: string;
    previousSchool: string;
    guardianName: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  profilePicFile: File | null;
  onRemoveFile: (key: string) => void;
  onNext: () => void;
}

export default function ProfileForm({
  formData,
  onChange,
  onFileChange,
  profilePicFile,
  onRemoveFile,
  onNext,
}: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Course Choice</label>
          <select
            name="courseInput"
            value={formData.courseInput}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BS Information Technology">BS Information Technology</option>
            <option value="BS Hospitality Management">BS Hospitality Management</option>
            <option value="Bachelor of Elementary Education">Bachelor of Elementary Education</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Previous School</label>
          <input
            type="text"
            name="previousSchool"
            value={formData.previousSchool}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Guardian Name</label>
          <input
            type="text"
            name="guardianName"
            value={formData.guardianName}
            onChange={onChange}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e, 'profilePicture')}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700"
            />
            {profilePicFile && (
              <button
                type="button"
                onClick={() => onRemoveFile('profilePicture')}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <Button type="button" variant="primary" onClick={onNext}>
          Next: Requirements →
        </Button>
      </div>
    </div>
  );
}