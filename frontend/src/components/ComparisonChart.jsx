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

    // 📅 Normalize date
    const formatDate = (date) =>
        new Date(date).toISOString().split('T')[0];

    // 🧠 GROUP BY DATE (USER)
    const userGrouped = {};
    userData.forEach(item => {
        const date = formatDate(item.created_at);

        if (!userGrouped[date]) userGrouped[date] = [];

        userGrouped[date].push(getStressValue(item.predicted_stress_level));
    });

    // 🧠 GROUP BY DATE (ALL USERS)
    const allGrouped = {};
    allData.forEach(item => {
        const date = formatDate(item.created_at);

        if (!allGrouped[date]) allGrouped[date] = [];

        allGrouped[date].push(getStressValue(item.predicted_stress_level));
    });

    // 📊 CALCULATE AVERAGES
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
            <div className="bg-white p-6 rounded-lg shadow">
                No comparison data available yet.
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
        <div className="bg-white p-6 rounded-lg shadow">

            <h3 className="text-xl font-bold mb-4">
                📊 Your Stress vs Global Average
            </h3>

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
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                <strong>Insight:</strong> {insight}
            </div>
        </div>
    );
};

export default ComparisonChart;