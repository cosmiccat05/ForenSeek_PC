import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

//Agregar token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("forensic_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "Error de conexión. Verifica tu internet.",
      });
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem("forensic_token");
      localStorage.removeItem("forensic_user");
      window.location.href = "/auth";
    }

    return Promise.reject({
      message: data.message || "Error en el servidor",
      errors: data.errors || {},
    });
  }
);

export default api;
