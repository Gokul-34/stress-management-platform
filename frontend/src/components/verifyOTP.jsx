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
            await axios.post("http://127.0.0.1:8000/auth/verify-otp", null, {
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
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
                    <p className="text-gray-600 mt-2">
                        Enter the OTP sent to <span className="font-semibold">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">

                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        className="w-full text-center text-lg tracking-widest px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                </form>

                <p className="text-sm text-gray-500 text-center mt-4">
                    Didn’t receive OTP? Try signing up again.
                </p>

            </div>
        </div>
    );
};

export default VerifyOTP;