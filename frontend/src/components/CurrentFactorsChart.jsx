import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const CurrentFactorsChart = ({ data }) => {
  if (!data) return null;

  // Normalize data for Radar Chart (0-100 scale for comparison)
  const chartData = [
    { subject: 'Sleep', A: Math.min((data.sleep_hours / 10) * 100, 100), fullMark: 100, raw: `${data.sleep_hours} hrs` },
    { subject: 'Work', A: Math.min((data.work_hours / 14) * 100, 100), fullMark: 100, raw: `${data.work_hours} hrs` },
    { subject: 'Screen', A: Math.min((data.screen_time / 14) * 100, 100), fullMark: 100, raw: `${data.screen_time} hrs` },
    { subject: 'Activity', A: Math.min((data.physical_activity / 120) * 100, 100), fullMark: 100, raw: `${data.physical_activity} min` },
    { subject: 'Mood', A: Math.min((data.mood_level / 5) * 100, 100), fullMark: 100, raw: `${data.mood_level}/5` }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md text-sm">
          <p className="font-bold text-gray-800">{point.subject}</p>
          <p className="text-purple-600 mt-1">Value: {point.raw}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 md:p-8 h-full fade-in">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-2">🎯 Lifestyle Balance</h3>
      <p className="text-sm font-medium text-gray-400 mb-6 border-b border-gray-100 pb-4">A visualization of the factors contributing to your stress level.</p>

      <div className="w-full" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Lifestyle"
              dataKey="A"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.6}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CurrentFactorsChart;
