const API_BASE_URL = '/api';

export const getAuthToken = () => localStorage.getItem('wt_jwt');
export const setAuthToken = (token) => localStorage.setItem('wt_jwt', token);
export const removeAuthToken = () => localStorage.removeItem('wt_jwt');

export const getStoredUser = () => {
  const u = localStorage.getItem('wt_user');
  return u ? JSON.parse(u) : null;
};
export const setStoredUser = (user) => localStorage.setItem('wt_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('wt_user');

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Session expired or invalid
    removeAuthToken();
    removeStoredUser();
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 24 || response.headers.get('content-length') === '0') {
    return null;
  }

  return await response.json();
}

// Auth API calls
export const authApi = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me', { method: 'GET' }),
};

// Exercise API calls
export const exerciseApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.targetMuscle) query.append('targetMuscle', params.targetMuscle);
    if (params.query) query.append('query', params.query);
    const qs = query.toString();
    return request(`/exercises${qs ? '?' + qs : ''}`);
  },
  getById: (id) => request(`/exercises/${id}`),
};

// Workout API calls
export const workoutApi = {
  create: (data) => request('/workouts', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (status) => request(`/workouts${status ? '?status=' + status : ''}`),
  getById: (id) => request(`/workouts/${id}`),
  update: (id, data) => request(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, data) => request(`/workouts/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => request(`/workouts/${id}`, { method: 'DELETE' }),
};

// Report API calls
export const reportApi = {
  getSummary: () => request('/reports/summary'),
};
