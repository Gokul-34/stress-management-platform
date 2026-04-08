import React, { useState } from 'react';

const StressForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    sleep_hours: 7,
    work_hours: 8,
    mood_level: 3,
    screen_time: 5,
    physical_activity: 30,
    heart_rate: 75,
    blood_oxygen: 98,
  });

  const [error, setError] = useState('');

  // 🔢 Calculate total hours
  const totalHours =
    formData.sleep_hours +
    formData.work_hours +
    formData.screen_time;

  const remainingHours = 24 - totalHours;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = parseFloat(value);

    // Copy existing data
    let updatedData = {
      ...formData,
      [name]: newValue,
    };

    // Calculate new total
    let newTotal =
      (updatedData.sleep_hours || 0) +
      (updatedData.work_hours || 0) +
      (updatedData.screen_time || 0);

    // 🤖 Smart Auto Adjustment
    if (newTotal > 24) {
      const excess = newTotal - 24;

      // Reduce only the field being changed
      newValue = newValue - excess;

      if (newValue < 0) newValue = 0;

      updatedData[name] = parseFloat(newValue.toFixed(1));

      setError('Adjusted to fit within 24 hours');
    } else {
      setError('');
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (totalHours > 24) {
      setError('Total hours cannot exceed 24');
      return;
    }

    onSubmit(formData);
  };

  const inputFields = [
    { name: 'sleep_hours', label: 'Sleep Duration', type: 'number', min: 0, max: 24, step: 0.5, unit: 'hours', icon: '😴' },
    { name: 'work_hours', label: 'Work Hours', type: 'number', min: 0, max: 24, step: 0.5, unit: 'hours', icon: '💼' },
    { name: 'mood_level', label: 'Mood Level', type: 'number', min: 1, max: 5, step: 1, unit: '1-5', icon: '😊' },
    { name: 'screen_time', label: 'Screen Time', type: 'number', min: 0, max: 24, step: 0.5, unit: 'hours', icon: '📱' },
    { name: 'physical_activity', label: 'Physical Activity', type: 'number', min: 0, max: 300, step: 5, unit: 'minutes', icon: '🏃' },
    { name: 'heart_rate', label: 'Heart Rate', type: 'number', min: 40, max: 200, step: 1, unit: 'bpm', icon: '❤️' },
    { name: 'blood_oxygen', label: 'Blood Oxygen (SpO₂)', type: 'number', min: 70, max: 100, step: 1, unit: '%', icon: '🫁' },
  ];

  // 📊 Progress %
  const progressPercent = Math.min((totalHours / 24) * 100, 100);

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 tracking-tight">
          Daily Log
        </h3>
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          Metrics
        </span>
      </div>

      {/* ⏱️ Remaining Hours */}
      <div className="mb-8 p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100/50">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-700">
             Time Distribution
          </p>
          <span className={`text-sm font-bold ${remainingHours < 0 ? "text-red-500" : "text-emerald-500"}`}>
            {remainingHours.toFixed(1)} hrs left
          </span>
        </div>

        {/* 📊 Progress Bar */}
        <div className="w-full bg-gray-200/60 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${progressPercent > 100
                ? "bg-red-500"
                : progressPercent > 80
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <p className="text-xs font-medium text-gray-500 mt-2 text-right">
          {totalHours.toFixed(1)} / 24 hours logged
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {inputFields.map((field) => (
          <div key={field.name} className="relative group">
            <label className="flex items-center text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1">
              <span className="mr-2 text-lg">{field.icon}</span> {field.label}
            </label>
            <div className="relative">
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                min={field.min}
                max={field.max}
                step={field.step}
                required
                className="w-full pl-4 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 font-medium 
                           focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent 
                           transition-all shadow-sm hover:border-gray-300 pointer-events-auto"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 cursor-none select-none">
                {field.unit === 'hours' ? 'hrs' : field.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 🔴 Error Message */}
      {error && (
        <p className="text-yellow-600 text-sm mt-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || totalHours > 24}
        className="mt-8 w-full relative overflow-hidden group bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg 
                   transition-all duration-300 disabled:opacity-50 hover:shadow-xl hover:-translate-y-[1px]"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
           {loading ? (
             <>
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Analyzing...
             </>
           ) : 'Run Analysis'}
        </span>
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </button>
    </form>
  );
};

export default StressForm;