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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Daily Lifestyle Data
      </h3>

      {/* ⏱️ Remaining Hours */}
      <div className="mb-4">
        <p className="text-sm font-semibold">
          ⏱️ Remaining Hours:{" "}
          <span className={remainingHours < 0 ? "text-red-500" : "text-green-600"}>
            {remainingHours.toFixed(1)} hrs
          </span>
        </p>

        {/* 📊 Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${progressPercent > 100
                ? "bg-red-500"
                : progressPercent > 80
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          {totalHours.toFixed(1)} / 24 hours used
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inputFields.map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              {field.icon} {field.label} ({field.unit})
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              min={field.min}
              max={field.max}
              step={field.step}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
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
        className="mt-6 w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : '🔍 Analyze Stress Level'}
      </button>
    </form>
  );
};

export default StressForm;