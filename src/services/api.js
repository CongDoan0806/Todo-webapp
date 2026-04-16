const API_BASE_URL = 'http://localhost:8000/api/v1';

const getAuthToken = () => localStorage.getItem('taskflow_token');

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
};

export const authService = {
  register: async (email, username, password) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  },

  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, username: email, password }),
    });
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me', { method: 'GET' });
  },

  updateUser: async (updates) => {
    return apiCall('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  logout: () => {
    localStorage.removeItem('taskflow_token');
  },
};

export const todoService = {
  getTodos: async (skip = 0, limit = 100) => {
    return apiCall(`/todos/?skip=${skip}&limit=${limit}`, { method: 'GET' });
  },

  getTodo: async (todoId) => {
    return apiCall(`/todos/${todoId}`, { method: 'GET' });
  },

  createTodo: async (todo) => {
    return apiCall('/todos/', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  },

  updateTodo: async (todoId, updates) => {
    return apiCall(`/todos/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteTodo: async (todoId) => {
    return apiCall(`/todos/${todoId}`, { method: 'DELETE' });
  },
};

export const chatService = {
  sendMessage: async (message) => {
    return apiCall('/chat/', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};
