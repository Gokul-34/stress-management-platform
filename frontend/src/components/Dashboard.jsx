import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  submitStressData,
  getUserHistory,
  getAllStressData,
  logout
} from '../services/api';
import toast from 'react-hot-toast';

import StressForm from './StressForm';
import PredictionCard from './PredictionCard';
import InsightsPanel from './InsightsPanel';
import HistoryChart from './HistoryChart';
import ComparisonChart from './ComparisonChart';
import VoiceAssistant from './VoiceAssistant';

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [currentInsights, setCurrentInsights] = useState(null);

  const [historicalData, setHistoricalData] = useState([]);
  const [allData, setAllData] = useState([]); // 🌍 NEW

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      fetchAllData();
    }
  }, [navigate]);

  // 🔥 FETCH BOTH USER + GLOBAL DATA
  const fetchAllData = async () => {
    try {
      const userHistory = await getUserHistory();
      const globalData = await getAllStressData();

      setHistoricalData(Array.isArray(userHistory) ? userHistory : []);
      setAllData(Array.isArray(globalData) ? globalData : []);
    } catch (error) {
      console.error('Fetch error:', error);
      setHistoricalData([]);
      setAllData([]);
    }
  };

  const handleStressSubmit = async (formData) => {
    if (!localStorage.getItem('token')) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await submitStressData(formData);

      setCurrentPrediction({
        predicted_stress_level: response.predicted_stress_level,
        confidence: response.confidence,
        timestamp: new Date().toISOString(),
      });

      setCurrentInsights({
        summary: response.summary || generateSummary(response.predicted_stress_level),
        factors: response.factors || generateFactors(formData),
        recommendations:
          response.recommendations || generateRecommendations(response.predicted_stress_level, formData),
      });

      toast.success(`Stress level: ${response.predicted_stress_level}`);

      // 🔄 refresh both graphs
      await fetchAllData();

      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error(error);
      toast.error(error.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Summary
  const generateSummary = (level) => {
    if (level === 'low') return 'Great! Low stress.';
    if (level === 'medium') return 'Moderate stress.';
    if (level === 'high') return 'High stress. Take care!';
    return '';
  };

  // 🔹 Factors
  const generateFactors = (data) => {
    const f = [];
    if (data.sleep_hours < 6) f.push('Low sleep');
    if (data.work_hours > 10) f.push('Overwork');
    if (data.screen_time > 8) f.push('Too much screen');
    return f.length ? f : ['All good'];
  };

  // 🔹 Recommendations
  const generateRecommendations = (level, data) => {
    const r = [];
    if (level !== 'low') r.push('Take breaks');
    if (data.sleep_hours < 7) r.push('Sleep more');
    if (data.screen_time > 6) r.push('Reduce screen time');
    return r;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleVoiceCommand = (cmd) => {
    if (cmd === 'show_history') {
      document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">

      {/* HEADER */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-purple-600">Stress Manager</h1>
            <p className="text-sm">Welcome, {user?.name}</p>
          </div>

          <div className="flex gap-4 items-center">
            <VoiceAssistant
              onCommand={handleVoiceCommand}
              currentPrediction={currentPrediction}
              historicalData={historicalData}
            />

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-8">

        <div className="grid lg:grid-cols-2 gap-8">
          <StressForm onSubmit={handleStressSubmit} loading={loading} />

          <div id="results">
            <PredictionCard prediction={currentPrediction} />
            <InsightsPanel insights={currentInsights} />
          </div>
        </div>

        {/* 📊 USER HISTORY */}
        <div id="history-section" className="mt-8">
          <HistoryChart data={historicalData} />
        </div>

        {/* 🌍 NEW COMPARISON GRAPH */}
        <div className="mt-8">
          <ComparisonChart
            userData={historicalData}
            allData={allData}
          />
        </div>

      </main>

      <footer className="text-center py-4 text-sm text-gray-600">
        Stress Manager © 2026
      </footer>
    </div>
  );
};

export default Dashboard;