import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import RandomizedSearchCV

# 1. Load Data
df = pd.read_csv('wearables_health_6mo_daily.csv')

# 2. Handle Missing Values
# Dropping rows with missing values (approx 2% of data)
df = df.dropna()

# 3. Categorical Encoding
# Map Mood to a numeric scale (Ordinal)
mood_mapping = {'very_bad': 1, 'bad': 2, 'neutral': 3, 'good': 4, 'very_good': 5}
df['mood_encoded'] = df['mood'].map(mood_mapping)

# Encode Gender and Workout Type (Label Encoding)
le_gender = LabelEncoder()
df['gender_encoded'] = le_gender.fit_transform(df['gender'])

le_workout = LabelEncoder()
df['workout_encoded'] = le_workout.fit_transform(df['workout_type'])

# 4. Feature Selection
# Select features that match your UI requirements
features = [
    'age', 'gender_encoded', 'sleep_duration_hours', 'avg_hr_day_bpm', 
    'spo2_avg_pct', 'steps', 'workout_minutes', 'workout_encoded',
    'caffeine_mg', 'screen_time_min', 'mood_encoded'
]
X = df[features]
y = df['stress_score']

# 5. Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 6. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 7. Model Training
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 8. SAVE EVERYTHING
# You need these 4 files for your FastAPI backend
joblib.dump(model, 'stress_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(le_gender, 'le_gender.pkl')
joblib.dump(le_workout, 'le_workout.pkl')
print("Preprocessing complete. Model and transformers saved!")

# 1. Generate Predictions on the Test Set
y_pred = model.predict(X_test)

# 2. Calculate Metrics
mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"--- Model Accuracy Report ---")
print(f"Mean Absolute Error: {mae:.2f}")
print(f"Mean Squared Error: {mse:.2f}")
print(f"R-squared Score: {r2:.2f}")

# 3. Visual Accuracy Check (Actual vs Predicted Plot)
plt.figure(figsize=(10, 6))
sns.scatterplot(x=y_test, y=y_pred, alpha=0.3)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], '--r', linewidth=2)
plt.xlabel('Actual Stress Score')
plt.ylabel('Predicted Stress Score')
plt.title('Model Accuracy: Actual vs. Predicted')
plt.show()

# 1. Define the parameter grid (the "settings" we want to test)
param_dist = {
    'n_estimators': [100, 200, 300, 500],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2', None]
}

# 2. Initialize the Base Model
rf = RandomForestRegressor(random_state=42)

# 3. Initialize RandomizedSearch
# n_iter=10 means it will try 10 random combinations (faster for deadlines)
rf_random = RandomizedSearchCV(
    estimator=rf, 
    param_distributions=param_dist, 
    n_iter=10, 
    cv=3, 
    verbose=2, 
    random_state=42, 
    n_jobs=-1
)

# 4. Fit the tuned model
rf_random.fit(X_train, y_train)

# 5. Get the best model
best_model = rf_random.best_estimator_

print(f"Best Parameters: {rf_random.best_params_}")

# 6. Re-evaluate
y_pred_tuned = best_model.predict(X_test)
print(f"New R-squared Score: {r2_score(y_test, y_pred_tuned):.2f}")

# 7. Save the NEW best model
joblib.dump(best_model, 'stress_model.pkl')