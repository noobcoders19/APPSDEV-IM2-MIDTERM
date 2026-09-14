import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export default function useStudentApplication(userId?: number, initialStep: number = 1) {
  const [step, setStep] = useState<number>(initialStep);
  const [status, setStatus] = useState<string>('Pending');
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [profilePicUrl, setProfilePicUrl] = useState<string>('');
  const [adminMessage, setAdminMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    age: '',
    address: '',
    previous_school: '',
    guardian_name: '',
    course_input: 'BS Information Technology',
  });

  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    photo_2x2: null,
    valid_id: null,
    report_card: null,
    birth_certificate: null,
  });

  const loadProfileData = useCallback(() => {
    if (!userId) return;

    fetch(`${API_BASE}/student/application/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data && (data.id || data.user_id)) {
          setFormData((prev) => ({
            ...prev,
            full_name: data.full_name || prev.full_name,
            phone: data.phone || prev.phone,
            age: data.age ? String(data.age) : prev.age,
            address: data.address || prev.address,
            previous_school: data.previous_school || prev.previous_school,
            guardian_name: data.guardian_name || prev.guardian_name,
            course_input: data.course_input || data.course || prev.course_input,
          }));
          if (data.profile_picture) {
            const profilePath = data.profile_picture.startsWith('uploads/')
              ? data.profile_picture
              : `uploads/${data.profile_picture}`;
            setProfilePicUrl(`/uploads/${profilePath}`);
          }
          setStatus(data.status || 'Pending');
          setAdminMessage(data.admin_message || '');
        }
      })
      .catch(() => setError('Server connection error. Check that the backend is running.'));
  }, [userId]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setError('');
    setSuccessMsg('');
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setError('');
    setSuccessMsg('');
    if (e.target.files?.[0]) {
      if (field === 'profile_picture') {
        setProfilePicFile(e.target.files[0]);
        setProfilePicUrl(URL.createObjectURL(e.target.files[0]));
      } else {
        setFiles((prev) => ({ ...prev, [field]: e.target.files![0] }));
      }
    }
  };

  const handleRemoveFile = (field: string) => {
    setError('');
    setSuccessMsg('');
    if (field === 'profile_picture') {
      setProfilePicFile(null);
      setProfilePicUrl('');
    } else {
      setFiles((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.full_name || !formData.phone || !formData.age || !formData.address) {
      setError('Please complete all mandatory profile fields.');
      return;
    }

    const payload = new FormData();
    if (userId) payload.append('user_id', String(userId));
    payload.append('full_name', formData.full_name);
    payload.append('phone', formData.phone);
    payload.append('age', formData.age);
    payload.append('address', formData.address);
    payload.append('previous_school', formData.previous_school);
    payload.append('guardian_name', formData.guardian_name);
    if (profilePicFile) payload.append('profile_picture', profilePicFile);

    try {
      const res = await fetch(`${API_BASE}/student/application`, {
        method: 'POST',
        body: payload,
      });

      if (res.ok) {
        setSuccessMsg('Profile saved/updated successfully!');
        setStep(2);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || 'Failed to save profile.');
      }
    } catch {
      setError('Server connection error.');
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const payload = new FormData();
    if (userId) payload.append('user_id', String(userId));
    payload.append('course_input', formData.course_input);
    
    Object.entries(files).forEach(([k, v]) => {
      if (v) payload.append(k, v);
    });

    try {
      const res = await fetch(`${API_BASE}/student/application/requirements`, {
        method: 'POST',
        body: payload,
      });

      if (res.ok) {
        setStatus('Pending');
        setSuccessMsg('Course and requirements submitted successfully!');
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.message || 'Failed to submit application requirements.');
      }
    } catch {
      setError('Server connection error.');
    }
  };

  const handleDeleteApplication = async () => {
    if (!userId || !window.confirm('Are you sure you want to reset/delete this application?')) return;

    try {
      const res = await fetch(`${API_BASE}/student/application/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setFormData({
          full_name: '',
          phone: '',
          age: '',
          address: '',
          previous_school: '',
          guardian_name: '',
          course_input: 'BS Information Technology',
        });
        setProfilePicUrl('');
        setProfilePicFile(null);
        setFiles({
          photo_2x2: null,
          valid_id: null,
          report_card: null,
          birth_certificate: null,
        });
        setStatus('Pending');
        setStep(1);
        setSuccessMsg('Application reset successfully.');
      } else {
        setError('Failed to delete application.');
      }
    } catch {
      setError('Server connection error.');
    }
  };

  return {
    step, setStep, status, error, successMsg, adminMessage, formData, files, profilePicUrl, profilePicFile,
    handleInputChange, handleFileChange, handleRemoveFile, handleSaveProfile, handleSubmitApplication, handleDeleteApplication
  };
}