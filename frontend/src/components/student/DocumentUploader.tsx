import React from 'react';
import { Button } from '../ui/Button';

interface DocumentUploaderProps {
  files: { [key: string]: File | null };
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  onBack: () => void;
  submitting: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  files,
  onFileChange,
  onBack,
  submitting,
}) => {
  const documentKeys = Object.keys(files).filter((k) => k !== 'profilePicture');

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Upload Requirements</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentKeys.map((key) => (
          <div key={key} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="file"
              onChange={(e) => onFileChange(e, key)}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700"
            />
          </div>
        ))}
      </div>
      <div className="pt-4 flex justify-between">
        <Button type="button" variant="secondary" onClick={onBack}>
          ← Back to Profile
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Final Application'}
        </Button>
      </div>
    </div>
  );
};