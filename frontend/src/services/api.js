import axios from 'axios';

const API_BASE = '/api';

export const apiService = {
  // Products
  getProducts: async (category, subcategory) => {
    const params = new URLSearchParams();

    if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);
            return axios.get(`${API_BASE}/products?${params}`);
  },

  getProduct: (id) => axios.get(`${API_BASE}/products/${id}`),
  
  createProduct: (data) => axios.post(`${API_BASE}/products`, data),
  
  updateProduct: (id, data) => axios.put(`${API_BASE}/products/${id}`, data),
  
  deleteProduct: (id) => axios.delete(`${API_BASE}/products/${id}`),

  // Orders
  createOrder: (data) => axios.post(`${API_BASE}/orders`, data),
  
  getOrders: (userId, status) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (status) params.append('status', status);
    return axios.get(`${API_BASE}/orders?${params}`);
  },

  getOrder: (id) => axios.get(`${API_BASE}/orders/${id}`),
  
  updateOrder: (id, data) => axios.put(`${API_BASE}/orders/${id}`, data),
  
  deleteOrder: (id) => axios.delete(`${API_BASE}/orders/${id}`),

  // Auth
  login: (email, password) => axios.post(`${API_BASE}/auth/login`, { email, password }),
  
  registerUser: (fullname, email, password, address) => axios.post(`${API_BASE}/auth/registerUser`, { fullname, email, password, address }),

  // Admin
  createAdmin: (email, password) => axios.post(`${API_BASE}/admin/users`, { email, password, role: 'admin' })
};
