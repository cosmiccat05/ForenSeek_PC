import api from "./api";

//Registra un nuevo usuario
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    const { token, user } = response.data;

    //Guardar token y usuario en localStorage
    localStorage.setItem("forensic_token", token);
    localStorage.setItem("forensic_user", JSON.stringify(user));

    return {
      success: true,
      message: response.data.message || "Registro exitoso",
      data: {
        token,
        user,
      },
    };
  } catch (error) {
    //axios: error.response?.data?.message etc
    const apiMessage = error.response?.data?.message;
    return {
      success: false,
      message: apiMessage || error.message || "Error al registrar usuario",
      errors: error.response?.data?.errors || {},
    };
  }
};

//Inicia sesión
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const { token, user } = response.data;

    //Guardar token y usuario en localStorage
    localStorage.setItem("forensic_token", token);
    localStorage.setItem("forensic_user", JSON.stringify(user));

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        token,
        user,
      },
    };
  } catch (error) {
    const apiMessage = error.response?.data?.message;
    return {
      success: false,
      message: apiMessage || error.message || "Error al iniciar sesión",
      errors: error.response?.data?.errors || {},
    };
  }
};

//Cierra sesión
export const logout = async () => {
  // Limpiar localStorage
  localStorage.removeItem("forensic_token");
  localStorage.removeItem("forensic_user");

  return {
    success: true,
    message: "Sesión cerrada",
  };
};
