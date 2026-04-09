import os
import joblib
import numpy as np
from backend.schemas.stress import StressDataCreate

class MLService:
    def __init__(self):
        backend_dir = os.path.dirname(os.path.dirname(__file__))
        self.model_path = os.path.join(backend_dir, "models", "stress_model.pkl")
        self.scaler_path = os.path.join(backend_dir, "scaler.pkl")
        self.model = None
        self.scaler = None
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
            else:
                print(f"Warning: Model or scaler not found. Using fallback mock logic.")
        except Exception as e:
            print(f"Error loading model: {e}")

    def predict_stress_level(self, data: StressDataCreate) -> str:
        # Padded features to 11 to match training data: 
        # ['age', 'gender_encoded', 'sleep_duration_hours', 'avg_hr_day_bpm', 'spo2_avg_pct', 'steps', 'workout_minutes', 'workout_encoded', 'caffeine_mg', 'screen_time_min', 'mood_encoded']
        features = np.array([[
            30, # dummy age
            1,  # dummy gender
            data.sleep_duration,
            data.heart_rate,
            data.spo2,
            data.physical_activity * 100, # mock steps
            data.physical_activity, # mock workout minutes
            2, # dummy workout type
            100, # dummy caffeine
            data.screen_time * 60, # convert hours to minutes
            data.mood_level
        ]])

        if self.model and self.scaler:
            try:
                scaled_features = self.scaler.transform(features)
                prediction = self.model.predict(scaled_features)[0]
                # Map float prediction back to categorical
                if prediction > 66: return "High"
                elif prediction > 33: return "Medium"
                else: return "Low"
            except Exception as e:
                import traceback
                traceback.print_exc()
                print(f"Prediction error: {e}. Falling back to mock logic.")
                return self._mock_predict(data)
        else:
            return self._mock_predict(data)

    def _mock_predict(self, data: StressDataCreate) -> str:
        if data.sleep_duration < 6 or data.work_hours > 10:
            return "High"
        elif 6 <= data.sleep_duration <= 7 and data.work_hours > 8:
            return "Medium"
        return "Low"

    def generate_insights(self, latest_stress_level: str, data: StressDataCreate) -> dict:
        summary = f"Your latest predicted stress level is {latest_stress_level}."
        recommendations = []
        
        if latest_stress_level == "High":
            recommendations.append("Take regular breaks throughout your workday.")
            if data.sleep_duration < 7:
                recommendations.append("Try to get at least 7-8 hours of sleep. A sleep routine might help.")
            if data.screen_time > 6:
                recommendations.append("Reduce screen time before bed to improve sleep quality.")
        elif latest_stress_level == "Medium":
            recommendations.append("You are experiencing moderate stress. Consider a quick 10-minute meditation or walk.")
            if data.physical_activity < 30:
                recommendations.append("Increasing physical activity can help manage stress.")
        else:
            recommendations.append("Great job maintaining a low stress level! Keep up the good habits.")

        return {
            "summary": summary,
            "recommendations": recommendations,
            "latest_stress_level": latest_stress_level
        }

ml_service = MLService()
