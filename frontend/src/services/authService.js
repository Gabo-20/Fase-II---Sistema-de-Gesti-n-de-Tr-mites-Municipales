import api from './api'

export const authService = {
  register: (data) => api.post('/auth/registro', data),
  login: (data) => api.post('/auth/login', data),
  // JWT es stateless — el logout es solo client-side (limpia localStorage)
  logout: () => Promise.resolve(),
  me: () => api.get('/auth/me'),
}
