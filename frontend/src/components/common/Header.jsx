import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Home } from 'lucide-react';
import { useAuth } from '../ui/AuthProvider';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const goToHome = () => {
    navigate('/dashboard');
    setShowUserMenu(false);
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
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo" onClick={goToHome}>
          <img src="/images/logo.png" alt="Forenseek" className="header-logo-img" />
          <span className="header-logo-text">FORENSEEK</span>
        </div>

        {/* Acciones */}
        <div className="header-actions">
          {/* Botón inicio */}
          <button className="header-home-btn" onClick={goToHome}>
            <Home size={20} />
          </button>

          {/* Usuario */}
          <div className="header-user-container">
            <button 
              className="header-user-block"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <span className="header-user-name">{getUserInitials()}</span>
              <User size={20} />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="header-dropdown">
                <button 
                  className="header-dropdown-item"
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
  );
};

export default Header;