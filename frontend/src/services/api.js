import axios from 'axios';
import toast from 'react-hot-toast';

// 🔗 Backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// 🔐 REQUEST INTERCEPTOR (ATTACH TOKEN)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 🚨 RESPONSE INTERCEPTOR (HANDLE TOKEN EXPIRY)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      const message = error.response.data?.detail || '';

      if (token && message.toLowerCase().includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


// ================= AUTH SERVICES =================

// ✅ Signup (SEND OTP)
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Signup failed' };
  }
};


// ✅ 🔥 NEW: VERIFY OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/verify-otp', null, {
      params: {
        email,
        otp
      }
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'OTP verification failed' };
  }
};


// ✅ 🔥 OPTIONAL: RESEND OTP
export const resendOTP = async (email) => {
  try {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Resend OTP failed' };
  }
};


// ✅ Login (ONLY AFTER OTP VERIFIED)
export const login = async (credentials) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const token = response.data.access_token;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;

  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};


// ✅ Logout
export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};


// ================= STRESS DATA =================

// ✅ Submit stress data
export const submitStressData = async (stressData) => {
  try {
    const payload = {
      sleep_duration: Number(stressData.sleep_hours),
      work_hours: Number(stressData.work_hours),
      mood_level: Number(stressData.mood_level),
      screen_time: Number(stressData.screen_time),
      physical_activity: Number(stressData.physical_activity),
      heart_rate: Number(stressData.heart_rate),
      spo2: Number(stressData.blood_oxygen),
    };

    const response = await api.post('/stress/data', payload);
    return response.data;

  } catch (error) {
    console.error('Submit stress data error:', error);
    throw error.response?.data || { error: 'Failed to analyze stress data' };
  }
};


// ✅ Get current user history
export const getUserHistory = async () => {
  try {
    const response = await api.get('/stress/history');
    return response.data;

  } catch (error) {
    console.error('Fetch history error:', error);
    return [];
  }
};


// ✅ Get ALL users data (comparison graph)
export const getAllStressData = async () => {
  try {
    const response = await api.get('/stress/all');
    return response.data;

  } catch (error) {
    console.error('Fetch all data error:', error);
    return [];
  }
};


export default api;