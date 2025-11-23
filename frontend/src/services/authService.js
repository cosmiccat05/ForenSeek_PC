import api from './api';

//Registra un nuevo usuario
export const register = async (userData) => {
  try {
    /* Descomentar esto cuando ya este el backend
    const response = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password
    });
    
    return {
      success: true,
      message: response.data.message || 'Registro exitoso',
      data: response.data
    };*/

    //Temporal pa la simulación sin backend. 
    //Eliminar cuando este listo el back menos el catch(error)
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      message: 'Registro exitoso',
      data: { message: 'Usuario registrado' }
    };


  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al registrar usuario',
      errors: error.errors || {}
    };
  }
};

// Inicia sesión
export const login = async (credentials) => {
  try {
    /*Descomentar esto cuando ya este el backend
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    const { token, user } = response.data;
    
    // Guardar token y usuario en localStorage
    localStorage.setItem('forensic_token', token);
    localStorage.setItem('forensic_user', JSON.stringify(user));
    
    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        user
      }
    };*/

    //TEMPORAL: Simulación sin backend
    //Eliminar cuando este listo el back menos el catch(error)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
    
    const fakeUser = {
      id: 1,
      name: 'Usuario Demo',
      email: credentials.email
    };
    const fakeToken = 'fake-jwt-token-' + Date.now();
    
    localStorage.setItem('forensic_token', fakeToken);
    localStorage.setItem('forensic_user', JSON.stringify(fakeUser));
    
    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token: fakeToken,
        user: fakeUser
      }
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al iniciar sesión',
      errors: error.errors || {}
    };
  }
};

//Cierra sesión
export const logout = async () => {
  try {
    await api.post('/auth/logout');
    
    // Limpiar localStorage
    localStorage.removeItem('forensic_token');
    localStorage.removeItem('forensic_user');
    
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
  } catch (error) {
    // Aunque falle, igual limpiamos el localStorage
    localStorage.removeItem('forensic_token');
    localStorage.removeItem('forensic_user');
    
    return {
      success: true,
      message: 'Sesión cerrada'
    };
  }
};