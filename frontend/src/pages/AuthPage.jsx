//Login y Register

import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import '../styles/pages/auth.css';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="auth-page">
      {/* Lado izquierdo - Branding */}
      <div className="auth-branding">
        <div className="auth-logo-circle">
          <img 
            src="/images/logo.png" 
            alt="Forenseek Logo" 
            className="auth-logo"
          />
        </div>
        
        <h1 className="auth-title">FORENSEEK</h1>
        
        <h2 className="auth-welcome">Bienvenid@</h2>
        
        <p className="auth-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rutrum venenatis 
          pellentesque. Cras accumsan, ex sed rutrum iaculis, augue odio iaculis lorem, a 
          luctus erat tortor id dui. Suspendisse rutrum consectetur dolor, quis pharetra 
          augue rutrum non. Cras eu condimentum tellus.
        </p>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="auth-form-container">
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              onClick={() => setActiveTab('login')}
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            >
              Iniciar sesión
            </button>
            
            <button
              onClick={() => setActiveTab('register')}
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            >
              Registrarse
            </button>
          </div>

          {/* Formularios */}
          {activeTab === 'login' ? (
            <LoginForm />
          ) : (
            <RegisterForm onSuccess={() => setActiveTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;