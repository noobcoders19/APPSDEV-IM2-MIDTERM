import React from 'react';
import { toDateTimeLocal, uploadUrl } from '../../hooks/useAdminApplications';
import type { Application } from '../../hooks/useAdminApplications';
import { Button } from '../ui/Button';

interface ApplicantDetailsProps {
  selectedApp: Application;
  scheduleData: { title: string; appointment_date: string; venue: string };
  setScheduleData: React.Dispatch<React.SetStateAction<{ title: string; appointment_date: string; venue: string }>>;
  updateStatus: (status: string) => void;
  handleNotifySchedule: (e: React.FormEvent) => void;
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => void;
}

export const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  selectedApp,
  scheduleData,
  setScheduleData,
  updateStatus,
  handleNotifySchedule,
  message,
  setMessage,
  sendMessage,
}) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0 shadow-inner">
            {selectedApp.profile_picture ? (
              <img
                src={uploadUrl(selectedApp.profile_picture)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">{selectedApp.full_name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-800">{selectedApp.full_name}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                selectedApp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                selectedApp.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {selectedApp.status || 'Pending'}
              </span>
            </div>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">{selectedApp.course_input || 'No course selected'}</p>
            <p className="text-xs text-slate-500 mt-1">
              Age: <span className="font-medium text-slate-700">{selectedApp.age}</span> | Previous School: <span className="font-medium text-slate-700">{selectedApp.previous_school || 'N/A'}</span>
            </p>
            <p className="text-xs text-slate-500">
              Guardian: <span className="font-medium text-slate-700">{selectedApp.guardian_name || 'N/A'}</span> | Contact: <span className="font-medium text-slate-700">{selectedApp.phone}</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Address: <span className="font-medium text-slate-700">{selectedApp.address}</span></p>
          </div>
        </div>
        <div className="flex space-x-2 w-full md:w-auto justify-end">
          <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-xs px-4 py-2" onClick={() => updateStatus('Approved')}>
            Approve
          </Button>
          <Button variant="danger" className="text-xs px-4 py-2" onClick={() => updateStatus('Rejected')}>
            Reject
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Submitted Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: '2x2 Photo', file: selectedApp.photo_2x2 },
            { label: 'Valid ID Card', file: selectedApp.valid_id },
            { label: 'Report Card', file: selectedApp.report_card },
            { label: 'Birth Certificate', file: selectedApp.birth_certificate },
          ].map((doc, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-700">{doc.label}</span>
              {doc.file ? (
                <a
                  href={uploadUrl(doc.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View File
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">Not Uploaded</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleNotifySchedule} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Set On-Site Appointment & Notify Student</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Setting an appointment automatically approves the application and notifies the student.</p>
        </div>
        <div>
          <label htmlFor="appointment-title" className="block text-xs font-semibold text-slate-600 mb-1">Notice Title</label>
          <input
            id="appointment-title"
            type="text"
            value={scheduleData.title}
            onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="appointment-date" className="block text-xs font-semibold text-slate-600 mb-1">Appointment Date & Time</label>
            <input
              id="appointment-date"
              type="datetime-local"
              value={toDateTimeLocal(scheduleData.appointment_date)}
              onChange={(e) => setScheduleData({ ...scheduleData, appointment_date: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="appointment-venue" className="block text-xs font-semibold text-slate-600 mb-1">Venue / Room</label>
            <input
              id="appointment-venue"
              type="text"
              value={scheduleData.venue}
              onChange={(e) => setScheduleData({ ...scheduleData, venue: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition shadow-sm"
        >
          Notify Student with Schedule
        </button>
      </form>

      <form onSubmit={sendMessage} className="bg-blue-50 p-5 rounded-xl border border-blue-200 space-y-3">
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message Student</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">The message will appear in the student profile.</p>
        </div>
        {selectedApp.admin_message && (
          <p className="text-sm text-slate-700 bg-white p-3 rounded-lg">Current message: {selectedApp.admin_message}</p>
        )}
        <textarea
          id="student-message"
          name="student-message"
          aria-label="Message for student"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
          rows={3}
          placeholder="Write a message for this student"
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm">
          Send Message
        </button>
      </form>
    </div>
  );
};