import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const VoiceAssistant = ({ onCommand, currentPrediction, historicalData }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let command = event.results[0][0].transcript.toLowerCase();

        // 🔧 Clean noise (important improvement)
        command = command.replace(/[^a-z\s]/g, '').trim();

        console.log('Voice command:', command);
        processCommand(command);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Could not recognize speech. Please try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast.error('Your browser does not support voice commands');
    }
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('Failed to speak response');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Your browser does not support text-to-speech');
    }
  };

  // 🔥 SMART COMMAND PROCESSING
  const processCommand = (command) => {
    let response = '';

    // Helper: check if any word exists
    const hasWords = (words) => {
      return words.some((word) => command.includes(word));
    };

    // 🎯 CHECK STRESS (Flexible detection)
    if (
      (hasWords(['check', 'tell', 'what']) && hasWords(['stress'])) ||
      hasWords(['stress level', 'my stress', 'stress status'])
    ) {
      if (currentPrediction && currentPrediction.stress_level) {
        response = `Your current stress level is ${currentPrediction.stress_level}. `;

        if (currentPrediction.stress_level === 'low') {
          response += 'Great job keeping your stress low!';
        } else if (currentPrediction.stress_level === 'medium') {
          response += 'You have moderate stress. Try relaxing a bit.';
        } else {
          response += 'You have high stress. Please take care and follow recommendations.';
        }

        onCommand?.('check_stress');
      } else {
        response =
          "You haven't analyzed your stress yet. Please submit your data first.";
      }
    }

    // 📊 HISTORY
    else if (hasWords(['history', 'records', 'past'])) {
      if (historicalData && historicalData.length > 0) {
        const lastThree = historicalData.slice(-3);

        response = `You have ${historicalData.length} records. Last stress levels: `;

        lastThree.forEach((record, i) => {
          response += `${record.stress_level}`;
          if (i < lastThree.length - 1) response += ', ';
        });

        response += '. Showing history now.';
        onCommand?.('show_history');
      } else {
        response = 'No history available yet.';
      }
    }

    // 💡 RECOMMENDATIONS
    else if (hasWords(['recommend', 'suggest', 'tips'])) {
      response =
        'To reduce stress: sleep well, reduce screen time, exercise regularly, and practice breathing techniques.';
      onCommand?.('show_recommendations');
    }

    // ❓ HELP
    else if (hasWords(['help', 'what can you do'])) {
      response =
        'You can say things like: check stress, show history, or give recommendations.';
    }

    // ❌ UNKNOWN COMMAND
    else {
      response =
        'Sorry, I did not understand. Try saying: check stress, show history, or recommendations.';
    }

    speak(response);
  };

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        toast.success('Listening... Speak your command');

        setTimeout(() => {
          if (isListening) {
            recognition.stop();
            toast.error('No speech detected. Please try again.');
          }
        }, 5000);
      } catch (error) {
        console.error('Failed to start recognition:', error);
        toast.error('Failed to start voice recognition');
      }
    } else {
      toast.error('Voice assistant not supported');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`relative group ${isListening
            ? 'bg-red-500 animate-pulse'
            : isSpeaking
              ? 'bg-green-500'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600'
          } text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105`}
        title="Voice Assistant"
      >
        {isListening ? (
          <span>🎤</span>
        ) : isSpeaking ? (
          <span>🔊</span>
        ) : (
          <span>🎙️</span>
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block whitespace-nowrap">
        <div className="bg-gray-800 text-white text-xs rounded py-1 px-2">
          {isListening
            ? 'Listening...'
            : isSpeaking
              ? 'Speaking...'
              : 'Voice Assistant'}
        </div>
      </div>

      {/* Status Indicator */}
      {(isListening || isSpeaking) && (
        <div className="absolute -top-1 -right-1">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isListening ? 'bg-red-400' : 'bg-green-400'
                } opacity-75`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${isListening ? 'bg-red-500' : 'bg-green-500'
                }`}
            ></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;