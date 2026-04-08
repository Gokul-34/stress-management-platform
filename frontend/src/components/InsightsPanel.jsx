import React from 'react';

const InsightsPanel = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">💡</span> Personalized Insights
      </h3>
      
      {/* Summary Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-r-lg shadow-sm">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <span className="mr-2">📋</span> Stress Summary
        </h4>
        <p className="text-blue-800 leading-relaxed text-sm">
          {insights.summary || 'Analysis complete. Check your stress level above.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {/* Key Factors */}
        <div className="flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center border-b pb-2">
            <span className="mr-2">🎯</span> Key Contributing Factors
          </h4>
          <div className="space-y-3 mt-2 flex-grow">
            {insights.factors && insights.factors.length > 0 ? (
              insights.factors.map((factor, index) => {
                const isPositive = factor.includes('No significant negative');
                return (
                  <div key={index} className={`flex items-start p-3 rounded-lg text-sm border shadow-sm ${isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <span className="text-base mr-3 mt-0.5">{isPositive ? '✅' : '⚠️'}</span>
                    <span className={`font-medium ${isPositive ? 'text-green-800' : 'text-red-800'}`}>{factor}</span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 italic text-sm">No specific factors identified</p>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="flex flex-col">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center border-b pb-2">
            <span className="mr-2">📝</span> Actionable Recommendations
          </h4>
          <div className="space-y-3 mt-2 flex-grow">
            {insights.recommendations && insights.recommendations.length > 0 ? (
              insights.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm shadow-sm">
                  <span className="text-base mr-3 mt-0.5">📌</span>
                  <span className="text-emerald-900 font-medium">{rec}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">No recommendations available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;