import { useRegister } from '../hooks/useRegister';
import { AuthHeader } from '../components/auth/AuthHeader';
import { RegisterFormCard } from '../components/auth/RegisterFormCard';

export default function RegisterPage() {
  const {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
    navigate,
  } = useRegister();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AuthHeader />
      <RegisterFormCard
        formData={formData}
        error={error}
        loading={loading}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onNavigateLogin={() => navigate('/login')}
      />
    </div>
  );
}