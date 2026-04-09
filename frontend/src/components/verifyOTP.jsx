import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 🔥 Get email safely
    const email = location.state?.email || localStorage.getItem("temp_email");

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        setLoading(true);

        try {
            const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
            await axios.post(`${baseURL}/auth/verify-otp`, null, {
                params: {
                    email: email,
                    otp: otp
                }
            });

            toast.success("Email verified successfully ✅");

            // Clear temp email
            localStorage.removeItem("temp_email");

            // Redirect to login
            navigate("/login");

        } catch (error) {
            toast.error(error.response?.data?.detail || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-purple-200 selection:text-purple-900 flex items-center justify-center px-4 overflow-hidden py-10">
            {/* Decorative Background */}
            <div className="absolute top-0 w-full h-full bg-gradient-to-b from-indigo-100/80 via-purple-50/40 to-transparent pointer-events-none -z-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply flex-shrink-0"></div>
            <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply flex-shrink-0"></div>

            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 md:p-10 z-10 relative">

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto mb-4">
                       <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                    </div>
                    <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">Verify Email</h2>
                    <p className="text-gray-500 font-medium mt-2">
                        Enter the OTP sent to <br/><span className="text-indigo-600 font-bold">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">

                    <div>
                      <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1 text-center">
                        Secure OTP Code
                      </label>
                      <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          placeholder="• • • • • •"
                          className="w-full text-center text-3xl font-mono tracking-[0.5em] px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm"
                      />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden group bg-gray-900 text-white font-bold py-4 mt-2 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 hover:shadow-xl hover:-translate-y-[1px]"
                    >
                        <span className="relative z-10">{loading ? "Verifying Token..." : "Authenticate"}</span>
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>

                </form>

                <p className="text-sm font-medium text-gray-500 text-center mt-8">
                    Didn’t receive OTP? <button onClick={() => navigate('/signup')} className="text-indigo-600 font-bold hover:text-indigo-700">Try signing up again.</button>
                </p>

            </div>
        </div>
    );
};

export default VerifyOTP;