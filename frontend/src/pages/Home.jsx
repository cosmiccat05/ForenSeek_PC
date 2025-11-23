import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/ui/AuthProvider';
import { User, LogOut, Search, History } from 'lucide-react';
import '../styles/pages/home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const handleNewSearch = () => {
    console.log('Iniciar nueva búsqueda');
  };

  const handleViewHistory = () => {
    console.log('Ver historial');
  };

  // Obtener iniciales del nombre
  const getUserInitials = () => {
    if (!user?.name) return 'U. A.';
    
    const nameParts = user.name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0];
    
    const firstName = nameParts[0];
    const lastNameInitial = nameParts[nameParts.length - 1].charAt(0);
    
    return `${firstName} ${lastNameInitial}.`;
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          {/* Logo */}
          <div className="dashboard-logo">
            <img src="/images/logo.png" alt="Forenseek" className="logo-img" />
            <span className="logo-text">FORENSEEK</span>
          </div>

          {/* Usuario */}
          <div className="dashboard-user">
            <div className="user-menu-container">
              <button 
                className="user-block"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-block-name">{getUserInitials()}</span>
                <User size={20} />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="user-dropdown">
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Bienvenido a Forenseek,<br />
              {user?.name || 'Usuario'}
            </h1>
            <p className="hero-description">
              Analiza muestras de ADN y detecta patrones sospechosos en segundos
            </p>

            {/* Botones de acción */}
            <div className="hero-actions">
              <button 
                className="btn-action btn-primary-action"
                onClick={handleNewSearch}
              >
                <Search size={20} />
                <span>Iniciar nueva búsqueda de ADN</span>
              </button>

              <button 
                className="btn-action btn-secondary-action"
                onClick={handleViewHistory}
              >
                <History size={20} />
                <span>Ver mi historial de búsqueda</span>
              </button>
            </div>
          </div>

          {/* Imagen de ADN */}
          <div className="hero-image">
            <img src="/images/adn.png" alt="ADN Analysis" />
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">00</div>
          <div className="stat-label">Total de búsquedas realizadas</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">00</div>
          <div className="stat-label">Coincidencias detectadas este mes</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Forenseek © 2025 - Sistema de análisis forense con ADN</p>
      </footer>
    </div>
  );
};

export default Home;