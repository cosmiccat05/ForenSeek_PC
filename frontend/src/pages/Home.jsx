import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/ui/AuthProvider';
import { Search, History } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/pages/home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNewSearch = () => {
    navigate('/search/new');
  };

  const handleViewHistory = () => {
    navigate('/search/history');
  };

  return (
    <div className="dashboard">
      <Header />

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

      <Footer />
    </div>
  );
};

export default Home;