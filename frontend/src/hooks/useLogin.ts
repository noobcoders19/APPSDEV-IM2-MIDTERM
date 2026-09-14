import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('cpc_token');
    localStorage.removeItem('cpc_user');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? '/api'}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `Login failed (${res.status})`);
      }

      if (!data?.user) {
        throw new Error('Server response is missing user information.');
      }

      const token = data.token || 'authenticated';
      const role = data.user.role || '';

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('cpc_token');
      localStorage.removeItem('cpc_user');

      const userRole = role.toLowerCase().trim();

      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
    navigate,
  };
}