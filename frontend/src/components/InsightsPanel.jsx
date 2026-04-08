import React from 'react';

const InsightsPanel = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Personalized Insights</h3>
      
      {/* Summary Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">📋 Stress Summary</h4>
        <p className="text-blue-800">{insights.summary || 'Analysis complete. Check your stress level above.'}</p>
      </div>

      {/* Key Factors */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">🎯 Key Contributing Factors</h4>
        <div className="space-y-2">
          {insights.factors && insights.factors.length > 0 ? (
            insights.factors.map((factor, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-lg mr-2">⚠️</span>
                <span className="text-gray-700">{factor}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No specific factors identified</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">📝 Actionable Recommendations</h4>
        <div className="space-y-2">
          {insights.recommendations && insights.recommendations.length > 0 ? (
            insights.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-2 bg-green-50 rounded-lg">
                <span className="text-lg mr-2">✅</span>
                <span className="text-gray-700">{rec}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recommendations available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;