import '../styles/pages/splash.css';

const SplashScreen = () => {
  return (
    <div className="splash-container">
      <div className="splash-content">
        {/* Icono del gorrito */}
        <div className="splash-icon">
          <img 
            src="/images/loading.png" 
            alt="Loading" 
            className="splash-logo"
          />
        </div>
        
        {/* Título */}
        <h1 className="splash-title">
          FORENSEEK
        </h1>
        
        {/* Subtítulo */}
        <p className="splash-subtitle">
          Sistema forense de análisis de ADN
        </p>
        
        {/* Barra de progreso */}
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;