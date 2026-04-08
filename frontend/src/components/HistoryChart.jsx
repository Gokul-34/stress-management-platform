import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
} from 'recharts';

const HistoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 md:p-8 h-full">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-4 h-[30px]">📊 Stress History Trends</h3>
        <div className="text-center py-20 text-gray-400 font-medium bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          No historical data yet. Submit your first stress analysis!
        </div>
      </div>
    );
  }

  // 🔢 Convert stress level
  const getStressNumeric = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 0;
    }
  };

  const getStressColor = (value) => {
    if (value === 1) return '#10B981';
    if (value === 2) return '#F59E0B';
    if (value === 3) return '#EF4444';
    return '#6B7280';
  };

  // ✅ SAFE DATE FORMATTER
  const formatDate = (date) => {
    if (!date) return 'N/A';

    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Invalid';

      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Invalid';
    }
  };

  // 📊 Format data (✅ FIXED HERE)
  const chartData = data.map((record, index) => ({
    date: formatDate(record.created_at), // ✅ CORRECT FIELD
    stressValue: getStressNumeric(record.predicted_stress_level),
    sleepHours: record.sleep_duration,
    workHours: record.work_hours,
    moodLevel: record.mood_level,
    index,
  }));

  // 🎯 Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2">{label}</p>
          <div className="space-y-1.5">
            <p className="text-sm font-medium flex justify-between items-center gap-4">
              <span className="text-gray-500">Target Stress:</span>
              <span className="font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: getStressColor(d.stressValue) }}>
                {d.stressValue === 1 ? 'Low' : d.stressValue === 2 ? 'Medium' : 'High'}
              </span>
            </p>
            <p className="text-sm font-medium flex justify-between gap-4"><span className="text-gray-500">Sleep:</span> <span className="text-gray-800">{d.sleepHours} hrs</span></p>
            <p className="text-sm font-medium flex justify-between gap-4"><span className="text-gray-500">Work:</span> <span className="text-gray-800">{d.workHours} hrs</span></p>
            <p className="text-sm font-medium flex justify-between gap-4"><span className="text-gray-500">Mood:</span> <span className="text-gray-800">{d.moodLevel}/5</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  // 📈 Trend logic
  const first = chartData[0].stressValue;
  const last = chartData[chartData.length - 1].stressValue;

  let trendText = "Your stress is stable.";
  if (last < first) trendText = "Your stress is improving 🎉";
  else if (last > first) trendText = "Your stress is increasing ⚠️";

  // 🧠 Improvement Message
  const generateImprovementMessage = (data) => {
    if (data.length < 2) return "Not enough data to analyze trends.";

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    let improvements = [];

    if (latest.sleepHours > previous.sleepHours) {
      improvements.push("😴 Sleep improved");
    }

    if (latest.workHours < previous.workHours) {
      improvements.push("💼 Work hours reduced");
    }

    if (latest.moodLevel > previous.moodLevel) {
      improvements.push("😊 Mood improved");
    }

    if (latest.stressValue < previous.stressValue) {
      improvements.push("📉 Stress decreased");
    }

    if (improvements.length === 0) {
      return "⚠️ No improvement detected. Try following recommendations.";
    }

    return "✅ Improvements: " + improvements.join(", ");
  };

  const improvementText = generateImprovementMessage(chartData);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 md:p-8">
      <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-6">📊 Stress History Trends</h3>

      {/* 📊 Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis dataKey="date" stroke="#6B7280" />

          <YAxis
            domain={[1, 3]}
            ticks={[1, 2, 3]}
            tickFormatter={(v) =>
              v === 1 ? 'Low' : v === 2 ? 'Medium' : 'High'
            }
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Area
            type="monotone"
            dataKey="stressValue"
            stroke="#8B5CF6"
            fill="url(#stressGradient)"
            name="Stress Trend"
          />

          <Line
            type="monotone"
            dataKey="stressValue"
            stroke="#7C3AED"
            strokeWidth={3}
          />

          <Bar dataKey="sleepHours" fill="#3B82F6" opacity={0.2} name="Sleep" />
          <Bar dataKey="workHours" fill="#EF4444" opacity={0.2} name="Work" />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 🧠 Insight Box */}
      <div className="mt-8 p-5 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-xl border border-indigo-100/50 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="p-1.5 bg-white rounded-md shadow-sm">📈</span> 
            <span className="font-bold text-gray-800">Trend:</span> 
            <span className="text-indigo-700 font-medium">{trendText}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2 mt-2">
            <span className="p-1.5 bg-white rounded-md shadow-sm">🧠</span> 
            <span className="font-bold text-gray-800">Analysis:</span> 
            <span className="text-purple-700 font-medium">{improvementText}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryChart;