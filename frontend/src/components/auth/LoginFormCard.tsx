import React from 'react';

interface LoginFormCardProps {
  formData: { email: string; password: string };
  error: string;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onNavigateRegister: () => void;
  onNavigateForgotPassword: () => void;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
  formData,
  error,
  loading,
  handleChange,
  handleSubmit,
  onNavigateRegister,
  onNavigateForgotPassword,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Sign In</h2>
        <p className="text-slate-500 text-sm text-center mb-6">
          Enter your details to access your account
        </p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-4">
          Don't have an account?{' '}
          <span
            onClick={onNavigateRegister}
            className="text-blue-600 cursor-pointer font-semibold hover:underline"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};