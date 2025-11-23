import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Agregar token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('forensic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Error de conexión. Verifica tu internet.'
      });
    }
    
    const { status, data } = error.response;
    
    if (status === 401) {
      localStorage.removeItem('forensic_token');
      localStorage.removeItem('forensic_user');
      window.location.href = '/auth';
    }
    
    return Promise.reject({
      message: data.message || 'Error en el servidor',
      errors: data.errors || {}
    });
  }
);

export default api;