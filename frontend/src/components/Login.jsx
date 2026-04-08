import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);

      // 🔥 STORE TOKEN HERE
      localStorage.setItem("token", response.access_token);

      // 🔥 (Optional) store user info
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success(`Welcome back, ${response.user.name}!`);

      // ✅ Navigate after storing token
      navigate('/dashboard');

    } catch (error) {
      toast.error(error.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-purple-200 selection:text-purple-900 flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 w-full h-full bg-gradient-to-b from-indigo-100/80 via-purple-50/40 to-transparent pointer-events-none -z-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply flex-shrink-0"></div>
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply flex-shrink-0"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 md:p-10 z-10 relative">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto mb-4">
             <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">FocusSync</h2>
          <p className="text-gray-500 font-medium mt-1">Sign in to track your stress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm"
              placeholder="hello@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden group bg-gray-900 text-white font-bold py-3.5 mt-2 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 hover:shadow-xl hover:-translate-y-[1px]"
          >
             <span className="relative z-10">{loading ? 'Logging in...' : 'Sign In'}</span>
             <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;