import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Servicios para Clientes
export const clienteApi = {
  getAll: () => api.get('/clientes'),
  getById: (id: string) => api.get(`/clientes/${id}`),
  create: (data: any) => api.post('/clientes', data),
  update: (id: string, data: any) => api.put(`/clientes/${id}`, data),
  delete: (id: string) => api.delete(`/clientes/${id}`),
};

// Servicios para Máquinas
export const maquinaApi = {
  getAll: () => api.get('/maquinas'),
  getById: (id: string) => api.get(`/maquinas/${id}`),
  create: (data: any) => api.post('/maquinas', data),
  update: (id: string, data: any) => api.put(`/maquinas/${id}`, data),
  delete: (id: string) => api.delete(`/maquinas/${id}`),
};

// Servicios para Tickets
export const ticketApi = {
  getAll: () => api.get('/tickets'),
  getById: (id: string) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  update: (id: string, data: any) => api.put(`/tickets/${id}`, data),
  delete: (id: string) => api.delete(`/tickets/${id}`),
};

// Servicios para Visitas
export const visitaApi = {
  getAll: () => api.get('/visitas'),
  getById: (id: string) => api.get(`/visitas/${id}`),
  create: (data: any) => api.post('/visitas', data),
  update: (id: string, data: any) => api.put(`/visitas/${id}`, data),
  delete: (id: string) => api.delete(`/visitas/${id}`),
};

// Servicios para Repuestos
export const repuestoApi = {
  getAll: () => api.get('/repuestos'),
  getById: (id: string) => api.get(`/repuestos/${id}`),
  getByCliente: (clienteId: string) => api.get(`/repuestos/cliente/${clienteId}`),
  create: (data: any) => api.post('/repuestos', data),
  update: (id: string, data: any) => api.put(`/repuestos/${id}`, data),
  delete: (id: string) => api.delete(`/repuestos/${id}`),
};

// Servicios para Inventario
export const inventarioApi = {
  getAll: () => api.get('/inventarios'),
  getByCliente: (clienteId: string) => api.get(`/inventarios/cliente/${clienteId}`),
  getById: (id: string) => api.get(`/inventarios/${id}`),
  create: (data: any) => api.post('/inventarios', data),
  update: (id: string, data: any) => api.put(`/inventarios/${id}`, data),
  delete: (id: string) => api.delete(`/inventarios/${id}`),
};

// Servicios para Contactos
export const contactoApi = {
  getByCliente: (clienteId: string) => api.get(`/contactos/cliente/${clienteId}`),
  getById: (id: string) => api.get(`/contactos/${id}`),
  create: (data: any) => api.post('/contactos', data),
  update: (id: string, data: any) => api.put(`/contactos/${id}`, data),
  delete: (id: string) => api.delete(`/contactos/${id}`),
  setPrincipal: (id: string) => api.patch(`/contactos/${id}/principal`),
};

// Servicios para Usuarios
export const usuarioApi = {
  getAll: () => api.get('/usuarios'),
  create: (data: any) => api.post('/usuarios', data),
};

export default api;