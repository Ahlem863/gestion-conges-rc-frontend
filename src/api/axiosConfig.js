import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gestion-conges-rc-backend.onrender.com/api',
});

// Intercepteur : ajoute automatiquement le token JWT à chaque requête si l'utilisateur est connecté
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;