import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const VoiceAssistant = ({ onCommand, currentPrediction, historicalData }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const listeningRef = useRef(false);
  const latestProps = useRef({ currentPrediction, historicalData, onCommand });

  useEffect(() => {
    latestProps.current = { currentPrediction, historicalData, onCommand };
  }, [currentPrediction, historicalData, onCommand]);

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

        // clean input
        command = command.replace(/[^a-z\s]/g, '').trim();

        console.log('Voice command:', command);
        processCommand(command);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        listeningRef.current = false;
        toast.error('Mic error. Try again.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        listeningRef.current = false;
      };

      setRecognition(recognitionInstance);
    } else {
      toast.error('Voice not supported in this browser');
    }
  }, []);

  // 🔊 Text to speech
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      setIsSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(text);
      // Save reference to prevent garbage collection on some browsers
      window._activeUtterance = utterance;

      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setIsSpeaking(false);
        // Only show error if it's not a deliberate cancel/interruption
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          toast.error('Speech failed');
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported');
    }
  };

  // 🧠 Command processing
  const processCommand = (command) => {
    const { currentPrediction, historicalData, onCommand } = latestProps.current;
    let response = '';

    const has = (words) => words.some((w) => command.includes(w));

    console.log('Processed command:', command);

    // 🎯 CHECK STRESS
    if (has(['stress'])) {
      if (currentPrediction?.predicted_stress_level) {
        const level = currentPrediction.predicted_stress_level;

        response = `Your current stress level is ${level}. `;

        if (level === 'low') {
          response += 'Great job keeping your stress low!';
        } else if (level === 'medium') {
          response += 'You have moderate stress. Try to relax.';
        } else {
          response += 'You have high stress. Please take care.';
        }

        onCommand?.('check_stress');
      } else {
        response = 'You have not checked your stress yet.';
      }
    }

    // 📊 HISTORY
    else if (has(['history', 'records', 'past'])) {
      if (historicalData && historicalData.length > 0) {
        const last = historicalData.slice(-3);

        response = `You have ${historicalData.length} records. Recent stress levels are `;

        last.forEach((r, i) => {
          response += r.predicted_stress_level;
          if (i < last.length - 1) response += ', ';
        });

        response += '. Showing history now.';
        onCommand?.('show_history');
      } else {
        response = 'No history found. Please submit data first.';
      }
    }

    // 💡 RECOMMENDATIONS
    else if (has(['recommend', 'tips', 'suggest'])) {
      response =
        'To reduce stress: sleep well, reduce screen time, exercise, and take breaks.';
      onCommand?.('show_recommendations');
    }

    // ❓ HELP
    else if (has(['help'])) {
      response =
        'You can say: check stress, show history, or give recommendations.';
    }

    // ❌ UNKNOWN
    else {
      response =
        'Sorry, I did not understand. Try saying check stress or show history.';
    }

    speak(response);
  };

  // 🎤 Start listening
  const startListening = () => {
    if (!recognition) {
      toast.error('Voice not supported');
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
      listeningRef.current = true;

      toast.success('Listening...');

      setTimeout(() => {
        if (listeningRef.current) {
          recognition.stop();
          toast.error('No speech detected');
        }
      }, 6000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to start mic');
    }
  };

  // 🛑 Stop listening
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      listeningRef.current = false;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`${isListening
            ? 'bg-red-500 animate-pulse'
            : isSpeaking
              ? 'bg-green-500'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600'
          } text-white rounded-full p-3 shadow-lg`}
      >
        {isListening ? '🎤' : isSpeaking ? '🔊' : '🎙️'}
      </button>
    </div>
  );
};

export default VoiceAssistant;