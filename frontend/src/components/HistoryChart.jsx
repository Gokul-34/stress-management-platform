import React from 'react';
import {
  LineChart,
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Stress History Trends</h3>
        <div className="text-center py-8 text-gray-500">
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

  // 📊 Format data
  const chartData = data.map((record, index) => ({
    date: new Date(record.created_at).toLocaleDateString(),
    stressValue: getStressNumeric(record.predicted_stress_level),
    sleep: record.sleep_duration,
    work: record.work_hours,
    mood: record.mood_level,
    index,
  }));

  // 🎯 Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            🎯 Stress: <span style={{ color: getStressColor(d.stressValue) }}>
              {d.stressValue === 1 ? 'Low' :
                d.stressValue === 2 ? 'Medium' : 'High'}
            </span>
          </p>
          <p className="text-sm">😴 Sleep: {d.sleep} hrs</p>
          <p className="text-sm">💼 Work: {d.work} hrs</p>
          <p className="text-sm">😊 Mood: {d.mood}/5</p>
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Stress History Trends</h3>

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

          <XAxis
            dataKey="date"
            stroke="#6B7280"
            interval="preserveStartEnd"
          />

          <YAxis
            domain={[1, 3]}
            ticks={[1, 2, 3]}
            tickFormatter={(v) =>
              v === 1 ? 'Low' : v === 2 ? 'Medium' : 'High'
            }
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* 📊 Area */}
          <Area
            type="monotone"
            dataKey="stressValue"
            stroke="#8B5CF6"
            fill="url(#stressGradient)"
            name="Stress Trend"
          />

          {/* 🎯 Line */}
          <Line
            type="monotone"
            dataKey="stressValue"
            stroke="#7C3AED"
            strokeWidth={3}
            dot={({ cx, cy, payload }) => (
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill={getStressColor(payload.stressValue)}
                stroke="#fff"
                strokeWidth={2}
              />
            )}
          />

          {/* 📊 Extra Bars */}
          <Bar dataKey="sleep" fill="#3B82F6" opacity={0.2} name="Sleep" />
          <Bar dataKey="work" fill="#EF4444" opacity={0.2} name="Work" />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 🧠 Insight Box */}
      <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
        <p className="text-sm text-gray-700">
          📈 <span className="font-semibold">Insight:</span> {trendText}
        </p>
      </div>
    </div>
  );
};

export default HistoryChart;