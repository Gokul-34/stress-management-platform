import joblib
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import os

print("Training a placeholder Random Forest model...")

# Dummy data: 100 samples, 7 features
# Features: sleep_duration, work_hours, mood_level, screen_time, physical_activity, heart_rate, spo2
X = np.random.rand(100, 7) * 10
# Target: Low (0), Medium (1), High (2)
y = np.random.choice(["Low", "Medium", "High"], 100)

model = RandomForestClassifier()
model.fit(X, y)

# Ensure models directory exists
os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/stress_model.pkl")

print("Model saved to models/stress_model.pkl")
