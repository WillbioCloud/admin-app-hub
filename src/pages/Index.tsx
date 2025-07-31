
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, isLoading, isAdmin } = useAuth();

  useEffect(() => {
    console.log('Index page - User:', user, 'Loading:', isLoading);
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Usar a função centralizada isAdmin() do contexto
  if (isAdmin()) {
    console.log('Usuário é admin, redirecionando para admin dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    console.log('Usuário é comerciante, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }
};

export default Index;
