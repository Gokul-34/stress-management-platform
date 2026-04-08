import React from 'react';

const PredictionCard = ({ prediction }) => {
  if (!prediction) return null;

  const getStressColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStressIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return '😌';
      case 'medium': return '😐';
      case 'high': return '😰';
      default: return '🤔';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Current Stress Analysis</h3>

      <div className="text-center mb-6">
        <div className={`inline-flex items-center px-6 py-3 rounded-full ${getStressColor(prediction.predicted_stress_level)}`}>
          <span className="text-3xl mr-2">{getStressIcon(prediction.predicted_stress_level)}</span>
          <span className="text-2xl font-bold">{prediction.predicted_stress_level || 'Unknown'}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-600">Confidence Score:</span>
          <span className="font-semibold text-gray-800">
            {prediction.confidence ? `${(prediction.confidence * 100).toFixed(1)}%` : 'N/A'}
          </span>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-600">Analyzed At:</span>
          <span className="font-semibold text-gray-800">
            {prediction.timestamp ? new Date(prediction.timestamp).toLocaleString() : 'Just now'}
          </span>
        </div>

        {prediction.stress_level === 'low' && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-800 text-sm">✨ Great job! Keep maintaining your healthy habits.</p>
          </div>
        )}

        {prediction.stress_level === 'medium' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800 text-sm">⚠️ Some stress detected. Check recommendations below.</p>
          </div>
        )}

        {prediction.stress_level === 'high' && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-red-800 text-sm">🚨 High stress level! Please take action using our recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;