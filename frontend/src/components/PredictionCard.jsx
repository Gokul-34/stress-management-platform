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
    <div className="relative overflow-hidden bg-gray-900 text-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-8 h-full flex flex-col justify-between border border-gray-800">
      {/* Decorative gradient orb */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none 
         ${prediction.predicted_stress_level === 'low' ? 'bg-emerald-500' : 
           prediction.predicted_stress_level === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`} 
      />

      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Current Status</h3>

      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        <div className={`flex items-center justify-center w-24 h-24 rounded-full mb-4 shadow-inner ring-4 ring-gray-800/50 
           ${prediction.predicted_stress_level === 'low' ? 'bg-gradient-to-tr from-emerald-500 to-teal-400' : 
             prediction.predicted_stress_level === 'medium' ? 'bg-gradient-to-tr from-amber-500 to-orange-400' : 
             'bg-gradient-to-tr from-red-500 to-rose-400'}`}>
          <span className="text-5xl drop-shadow-md">{getStressIcon(prediction.predicted_stress_level)}</span>
        </div>
        <span className="text-3xl font-black tracking-tight capitalize text-white drop-shadow-sm">
          {prediction.predicted_stress_level || 'Unknown'} Stress
        </span>
      </div>

      <div className="space-y-4 w-full bg-gray-800/50 rounded-xl p-5 border border-gray-700/50 backdrop-blur-sm relative z-10">
        <div className="flex justify-between items-center border-b border-gray-700 pb-3">
          <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Confidence Score
          </span>
          <span className="font-bold text-white bg-gray-700 px-2 py-0.5 rounded text-sm">
            {prediction.confidence ? `${(prediction.confidence * 100).toFixed(1)}%` : 'N/A'}
          </span>
        </div>

        <div className="flex justify-between items-center pb-1">
          <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Analyzed At
          </span>
          <span className="font-semibold text-gray-200 text-sm">
            {prediction.timestamp ? new Date(prediction.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
          </span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PredictionCard;