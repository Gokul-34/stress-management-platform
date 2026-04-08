import os
import joblib
import numpy as np
from backend.schemas.stress import StressDataCreate

class MLService:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "stress_model.pkl")
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            else:
                print(f"Warning: Model not found at {self.model_path}. Using fallback mock logic.")
        except Exception as e:
            print(f"Error loading model: {e}")

    def predict_stress_level(self, data: StressDataCreate) -> str:
        # Prepare features in the exact expected order
        features = np.array([[
            data.sleep_duration,
            data.work_hours,
            data.mood_level,
            data.screen_time,
            data.physical_activity,
            data.heart_rate,
            data.spo2
        ]])

        if self.model:
            try:
                prediction = self.model.predict(features)[0]
                return str(prediction)
            except Exception as e:
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
