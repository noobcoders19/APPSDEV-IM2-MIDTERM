import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthHeader } from '../components/auth/AuthHeader';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currentPassword, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to update password.');
      setMessage(data.message);
      setEmail('');
      setCurrentPassword('');
      setPassword('');
      setConfirmation('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <section className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-slate-800 text-center">Reset your password</h1>
          <p className="text-slate-500 text-sm text-center mb-6">Enter your registered email and choose a new password.</p>
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
          {message && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm p-3 rounded-lg mb-4">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Registered email" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800" />
            <input type="password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800" />
            <input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800" />
            <input type="password" required minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Confirm new password" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800" />
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          <button type="button" onClick={() => navigate('/login')} className="w-full mt-4 text-sm text-blue-600 hover:underline">Back to Sign In</button>
        </section>
      </main>
    </div>
  );
}
