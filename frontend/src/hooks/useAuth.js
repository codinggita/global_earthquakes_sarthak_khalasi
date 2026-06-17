import { useSelector } from 'react-redux';

/**
 * Custom hook to access auth state conveniently.
 */
const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isAdmin: user?.role === 'admin',
    username: user?.username || '',
    email: user?.email || '',
    role: user?.role || 'user',
  };
};

export default useAuth;
