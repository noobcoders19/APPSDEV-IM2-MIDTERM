import { useState, useEffect, useCallback, useRef } from 'react';

export interface Application {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  age: number;
  course_input: string;
  address: string;
  previous_school: string;
  guardian_name: string;
  profile_picture?: string;
  photo_2x2?: string;
  valid_id?: string;
  report_card?: string;
  birth_certificate?: string;
  status: string;
  appointment_title?: string;
  appointment_date?: string;
  appointment_venue?: string;
  admin_message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export function toDateTimeLocal(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function uploadUrl(file?: string): string | undefined {
  if (!file) return undefined;
  const path = file.startsWith('uploads/') ? file : `uploads/${file}`;
  return `/uploads/${path}`;
}

export function useAdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const selectedAppRef = useRef<Application | null>(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState('');

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/applications`);
      const data = await res.json();
      if (res.ok) {
        setApplications(data);
        if (data.length > 0 && !selectedAppRef.current) {
          setSelectedApp(data[0]);
          selectedAppRef.current = data[0];
        }
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchApplications();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchApplications]);

  const handleSelectApp = (app: Application) => {
    setSelectedApp(app);
    selectedAppRef.current = app;
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedApp) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/applications/${selectedApp.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert(`Application marked as ${newStatus}`);
        fetchApplications();
        const updatedApp = { ...selectedApp, status: newStatus };
        setSelectedApp(updatedApp);
        selectedAppRef.current = updatedApp;
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!selectedApp || !trimmedMessage) {
      alert('Please write a message before sending.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/applications/${selectedApp.id}/message`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message.');
      }

      const updatedApp = { ...selectedApp, admin_message: trimmedMessage };
      setSelectedApp(updatedApp);
      selectedAppRef.current = updatedApp;
      setApplications((current) => current.map((app) => app.id === updatedApp.id ? updatedApp : app));
      setMessage('');
      alert('Message sent to the student.');
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again.');
    }
  };

  const removeApplication = async (application: Application) => {
    if (!window.confirm(`Remove ${application.full_name || 'this application'}? This cannot be undone.`)) return;

    const res = await fetch(`${API_BASE_URL}/admin/applications/${application.id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      alert('Failed to remove the application.');
      return;
    }

    const remaining = applications.filter((app) => app.id !== application.id);
    setApplications(remaining);
    if (selectedApp?.id === application.id) {
      const nextApp = remaining[0] || null;
      setSelectedApp(nextApp);
      selectedAppRef.current = nextApp;
    }
  };

  return {
    applications,
    selectedApp,
    loading,
    handleSelectApp,
    updateStatus,
    message,
    setMessage,
    sendMessage,
    removeApplication,
  };
}