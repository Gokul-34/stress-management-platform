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
import CurrentFactorsChart from './CurrentFactorsChart';

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [currentInsights, setCurrentInsights] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  const [historicalData, setHistoricalData] = useState([]);
  const [allData, setAllData] = useState([]); // 🌍 global data

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
      fetchAllData(); // 🔥 single unified fetch
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

      setCurrentData(formData);

      setCurrentPrediction({
        predicted_stress_level: response.predicted_stress_level,
        confidence: response.confidence,
        timestamp: new Date().toISOString(),
      });

      const generated = generateInsights(response.predicted_stress_level, formData);

      setCurrentInsights({
        summary: response.summary || generated.summary,
        factors: response.factors || generated.factors,
        recommendations:
          response.recommendations || generated.recommendations,
      });

      toast.success(`Stress level: ${response.predicted_stress_level}`);

      // 🔄 refresh both graphs
      await fetchAllData();

      setTimeout(() => {
        document.getElementById('analysis-results-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (error) {
      console.error(error);
      toast.error(error.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Intelligent Insights Engine
  const generateInsights = (level, data) => {
    const factors = [];
    const recommendations = [];
    let summary = '';

    // 1. Calculate deviations (0 to >1 scale) bounds
    const deviations = [
      { name: 'Sleep', value: Math.max(0, 7.5 - data.sleep_hours) / 7.5, key: 'sleep' },
      { name: 'Workload', value: Math.max(0, data.work_hours - 8) / 8, key: 'work' },
      { name: 'Screen Time', value: Math.max(0, data.screen_time - 6) / 6, key: 'screen' },
      { name: 'Inactivity', value: Math.max(0, 30 - data.physical_activity) / 30, key: 'activity' },
      { name: 'Heart Rate', value: Math.max(0, data.heart_rate - 80) / 40, key: 'heart' }
    ];

    // 2. Find the highest stressor attribute
    const primaryStressor = deviations.reduce((prev, current) => (prev.value > current.value) ? prev : current);

    // 3. Build Summary
    if (level === 'low') {
      summary = 'Your stress level is currently low. You are maintaining a healthy balance in your lifestyle. Keep up the good work!';
    } else if (level === 'medium') {
      summary = `You are experiencing moderate stress. Based on your data, the primary driving factor is your ${primaryStressor.name.toLowerCase()}. Focus on adjusting this specific area to bring your stress down quickly.`;
    } else if (level === 'high') {
      summary = `Your stress level is high, requiring immediate attention. Our analysis strictly points to ${primaryStressor.name.toLowerCase()} as the leading cause of this stress spike. Please prioritize the urgent recommendations below.`;
    }

    // 4. Primary Stressor Highlights (Only if it's statistically significant > 0.15)
    if (primaryStressor.value > 0.15 && level !== 'low') {
       factors.push(`🚨 PRIMARY CONTRIBUTOR: Extreme ${primaryStressor.name.toLowerCase()}`);
       
       if (primaryStressor.key === 'sleep') {
           recommendations.push('URGENT (Sleep): Your sleep deficit is your biggest stressor. Prioritize getting to bed 1 hour earlier tonight. Remove all screens from the bedroom completely.');
       } else if (primaryStressor.key === 'work') {
           recommendations.push('URGENT (Workload): Your work hours are severely unbalanced. Set a hard stop for work today and immediately disconnect to prevent chronic burnout.');
       } else if (primaryStressor.key === 'screen') {
           recommendations.push('URGENT (Screen Time): Neurological strain from screen exposure is driving up your stress. Implement a strict digital detox for the next 2-4 hours.');
       } else if (primaryStressor.key === 'activity') {
           recommendations.push('URGENT (Inactivity): Your lack of movement is heavily pooling physical stress. Stand up right now and do 5-10 minutes of deep stretching or brisk walking.');
       } else if (primaryStressor.key === 'heart') {
           recommendations.push('URGENT (Heart Rate): Your body is showing high physical signs of stress. Stop what you are doing and perform 5 minutes of box breathing (4s in, 4s hold, 4s out, 4s hold).');
       }
    }

    // 5. Secondary Factors
    if (data.sleep_hours < 7 && primaryStressor.key !== 'sleep') {
        factors.push('Insufficient sleep (< 7 hrs)');
        recommendations.push('Aim for 7-9 hours of sleep. Create a wind-down routine 30 mins before bed without screens.');
    }
    if (data.work_hours > 9 && primaryStressor.key !== 'work') {
        factors.push('High work hours');
        recommendations.push('Implement the Pomodoro technique (25m work, 5m rest) to sustain energy and avoid burnout.');
    }
    if (data.screen_time > 7 && primaryStressor.key !== 'screen') {
        factors.push('High screen exposure');
        recommendations.push('Try the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.');
    }
    if (data.physical_activity < 30 && primaryStressor.key !== 'activity') {
        factors.push('Below recommended physical activity (< 30 mins)');
        recommendations.push('Incorporate at least 30 minutes of light exercise, like brisk walking or yoga.');
    }
    if (data.heart_rate > 90 && primaryStressor.key !== 'heart') {
        factors.push(`Elevated resting heart rate (${data.heart_rate} bpm)`);
        recommendations.push('Your heart rate is elevated. Reduce caffeine intake and practice grounding exercises.');
    }
    if (data.mood_level <= 2) {
        factors.push('Low emotional well-being reported');
    }
    if (data.blood_oxygen < 95) {
        factors.push(`Slightly low blood oxygen (${data.blood_oxygen}%)`);
    }

    // 6. Default Fallback
    if (factors.length === 0 || (factors.length === 1 && factors[0].includes('PRIMARY') === false && level === 'low')) {
        factors.push('No significant negative factors identified! Your inputs look great.');
        if (recommendations.length === 0) {
           recommendations.push('Maintain your current excellent habits! Consistency is key to stress management.');
        }
    }

    return { summary, factors, recommendations };
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
    <div className="min-h-screen bg-slate-50 relative selection:bg-purple-200 selection:text-purple-900">
      {/* Decorative Background */}
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-indigo-100/80 via-purple-50/40 to-transparent pointer-events-none -z-10"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply"></div>
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply"></div>

      {/* HEADER */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">FocusSync</h1>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Hi, {user?.name}</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <VoiceAssistant
              onCommand={handleVoiceCommand}
              currentPrediction={currentPrediction}
              historicalData={historicalData}
            />

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 bg-white hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300 shadow-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">

        {/* Form and initial Prediction in a responsive grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <StressForm onSubmit={handleStressSubmit} loading={loading} />

          <div id="results" className="flex flex-col h-full gap-6">
            <PredictionCard prediction={currentPrediction} />
            <InsightsPanel insights={currentInsights} />
          </div>
        </div>

        {/* 📉 VISUALIZATIONS SECTION */}
        {(currentPrediction || historicalData.length > 0) && (
          <div id="analysis-results-container" className="mt-8 space-y-8 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-8">
              {currentData && <CurrentFactorsChart data={currentData} />}
              
              {/* 📊 USER HISTORY */}
              <div id="history-section" className="w-full">
                <HistoryChart data={historicalData} />
              </div>
            </div>

            {/* 🌍 COMPARISON GRAPH */}
            <div className="w-full">
              <ComparisonChart
                userData={historicalData}
                allData={allData}
              />
            </div>
          </div>
        )}

      </main>

      <footer className="text-center py-4 text-sm text-gray-600">
        Stress Manager © 2026
      </footer>
    </div>
  );
};

export default Dashboard;