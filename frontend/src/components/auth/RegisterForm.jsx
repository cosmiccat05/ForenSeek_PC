//Formulario de registro
import { useState } from 'react';
import { useAuth } from '../ui/AuthProvider';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.lastname) {
      newErrors.lastname = 'Los apellidos son requeridos';
    }
    
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Correo inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
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
    setSuccessMessage('');
    
    try {
      const response = await register({
        name: `${formData.name} ${formData.lastname}`,
        email: formData.email,
        password: formData.password
      });
      
      if (response.success) {
        setSuccessMessage('¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setErrorMessage(response.message || 'Error al registrar usuario');
      }
    } catch (error) {
      setErrorMessage('Error al registrar. Intenta nuevamente.');
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

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      <Input
        type="text"
        name="name"
        label="Nombre"
        placeholder="Nombres"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        type="text"
        name="lastname"
        label="Apellidos"
        placeholder="Nombres"
        value={formData.lastname}
        onChange={handleChange}
        error={errors.lastname}
        required
      />

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

      <Input
        type="password"
        name="confirmPassword"
        label="Confirmar contraseña"
        placeholder="Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
      />

      <div className="checkbox-container">
        <input
          type="checkbox"
          id="terms"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={handleChange}
        />
        <label htmlFor="terms">
          Aceptar <strong>Términos y Condiciones</strong>
        </label>
      </div>
      {errors.termsAccepted && (
        <span className="input-error-message">
          {errors.termsAccepted}
        </span>
      )}

      <Button
        type="button"
        variant="primary"
        size="medium"
        fullWidth
        loading={loading}
        onClick={handleSubmit}
      >
        Crear cuenta
      </Button>
    </div>
  );
};

export default RegisterForm;