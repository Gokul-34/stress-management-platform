import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const ComparisonChart = ({ userData, allData }) => {

    // 🔢 Convert stress level → number
    const getStressValue = (level) => {
        switch (level?.toLowerCase()) {
            case 'low': return 1;
            case 'medium': return 2;
            case 'high': return 3;
            default: return 0;
        }
    };

    // 📅 Normalize date (UPDATED for both APIs)
    const formatDate = (date) =>
        new Date(date).toISOString().split('T')[0];

    // 🧠 GROUP BY DATE (USER)
    const userGrouped = {};
    userData.forEach(item => {
        const date = formatDate(item.created_at); // user API unchanged

        if (!userGrouped[date]) userGrouped[date] = [];

        userGrouped[date].push(getStressValue(item.predicted_stress_level));
    });

    // 🧠 GROUP BY DATE (ALL USERS) ✅ UPDATED
    const allGrouped = {};
    allData.forEach(item => {
        const date = formatDate(item.date); // changed from created_at → date

        if (!allGrouped[date]) allGrouped[date] = [];

        allGrouped[date].push(getStressValue(item.stress_level));
    });

    // 📊 MERGE DATES
    const dates = Array.from(
        new Set([...Object.keys(userGrouped), ...Object.keys(allGrouped)])
    ).sort();

    const chartData = dates.map(date => {
        const userAvg =
            userGrouped[date]?.reduce((a, b) => a + b, 0) /
            (userGrouped[date]?.length || 1);

        const globalAvg =
            allGrouped[date]?.reduce((a, b) => a + b, 0) /
            (allGrouped[date]?.length || 1);

        return {
            date,
            userStress: Number(userAvg.toFixed(2)),
            avgStress: Number(globalAvg.toFixed(2))
        };
    });

    // 📉 Empty state
    if (!chartData.length) {
        return (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 md:p-8 h-full">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 mb-4 h-[30px]">
                   📊 Global Comparison
                </h3>
                <div className="text-center py-20 text-gray-400 font-medium bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    No comparison data available yet. Submit logs to see global averages.
                </div>
            </div>
        );
    }

    // 🧠 Insight calculation
    const latest = chartData[chartData.length - 1];
    let insight = "";

    if (latest.userStress > latest.avgStress) {
        insight = "⚠️ You are ABOVE average stress level";
    } else if (latest.userStress < latest.avgStress) {
        insight = "✅ You are BELOW average stress level";
    } else {
        insight = "➖ You are at average stress level";
    }

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 md:p-8 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                    🌍 Your Stress vs Global Average
                </h3>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        domain={[0, 3]}
                        ticks={[1, 2, 3]}
                        tickFormatter={(v) =>
                            v === 1 ? 'Low' :
                                v === 2 ? 'Medium' :
                                    v === 3 ? 'High' : ''
                        }
                    />

                    <Tooltip />
                    <Legend />

                    {/* 👤 USER LINE */}
                    <Line
                        type="monotone"
                        dataKey="userStress"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        name="Your Stress"
                        dot={{ r: 5 }}
                    />

                    {/* 🌍 GLOBAL LINE */}
                    <Line
                        type="monotone"
                        dataKey="avgStress"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Global Average"
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* 🧠 INSIGHT */}
            <div className="mt-8 p-5 bg-gradient-to-tr from-gray-50/80 to-blue-50/50 rounded-xl border border-gray-200/50 flex items-center shadow-sm">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 mr-4">
                    {latest.userStress > latest.avgStress ? '⚠️' : latest.userStress < latest.avgStress ? '✅' : '➖'}
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Global Insight</p>
                   <p className="font-semibold text-gray-800">
                     {latest.userStress > latest.avgStress ? "Your stress is tracking ABOVE the global average." : 
                      latest.userStress < latest.avgStress ? "Your stress is tracking BELOW the global average." : 
                      "You are exactly perfectly aligned with the global average stress."}
                   </p>
                </div>
            </div>
        </div>
    );
};

export default ComparisonChart;