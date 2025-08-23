import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Créer une instance axios avec configuration par défaut
const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Fonctions pour les tâches
export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

// Fonctions pour l'authentification
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
// Fonctions pour l'authentification (REGISTER)
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Erreur API lors de l'inscription:", error);

    // Extraire le message d'erreur de la réponse si disponible
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      "Erreur lors de l'inscription";

    throw new Error(errorMessage);
  }
};

export default api;
