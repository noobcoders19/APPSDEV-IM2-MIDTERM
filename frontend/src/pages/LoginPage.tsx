import { useLogin } from '../hooks/useLogin';
import { AuthHeader } from '../components/auth/AuthHeader';
import { LoginFormCard } from '../components/auth/LoginFormCard';

export default function LoginPage() {
  const {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
    navigate,
  } = useLogin();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AuthHeader />
      <LoginFormCard
        formData={formData}
        error={error}
        loading={loading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onNavigateRegister={() => navigate('/register')}
        onNavigateForgotPassword={() => navigate('/forgot-password')}
      />
    </div>
  );
}