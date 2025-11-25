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
          En Forenseek ponemos la tecnología al servicio de la investigación, 
          ofreciéndote una plataforma intuitiva y confiable para comparar perfiles genéticos. 
          Nuestro objetivo es que cada búsqueda sea clara, rápida y precisa, ayudándote a 
          encontrar coincidencias que marquen la diferencia en tus casos.
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