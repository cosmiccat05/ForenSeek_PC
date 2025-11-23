import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../components/ui/AuthProvider';
import SplashScreen from '../pages/SplashScreen';
import AuthPage from '../pages/AuthPage';
import Home from '../pages/Home';
import NewSearch from '../pages/NewSearch';
import SearchHistory from '../pages/SearchHistory';

const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/splash" element={<SplashScreen />} />
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Home /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/search/new"
        element={isAuthenticated ? <NewSearch /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/search/history"
        element={isAuthenticated ? <SearchHistory /> : <Navigate to="/auth" replace />}
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} 
      />
    </Routes>
  );
};

export default AppRouter;