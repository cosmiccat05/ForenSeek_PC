//Formulario de inicio de sesion 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../ui/AuthProvider';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setErrorMessage('');
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Correo inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const response = await login(formData);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      setErrorMessage('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
        </div>
      )}

      <Input
        type="email"
        name="email"
        label="Correo electrónico"
        placeholder="correo@hotmail.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Input
        type="password"
        name="password"
        label="Contraseña"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />

      <Button
        type="button"
        variant="primary"
        size="medium"
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        Ingresar
      </Button>
    </div>
  );
};

export default LoginForm;