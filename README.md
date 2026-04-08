# Stress Management & Prediction Platform

An end-to-end full-stack application that leverages Machine Learning (ML) to analyze lifestyle habits and predict user stress levels. The platform empowers users with a comprehensive dashboard featuring interactive data visualizations, Voice Assistant functionality, and personalized, actionable insights to improve their well-being.

## 🚀 Features

- **Machine Learning Stress Prediction:** Analyzes 7 vital metrics (sleep, work hours, mood, screen time, physical activity, heart rate, SpO2) using a trained ML classification model to categorize stress.
- **Intelligent Insights Engine:** Mathematically isolates your biggest stressor automatically and provides extremely detailed, actionable advice and urgency rankings.
- **Dynamic Data Visualizations:** Beautiful interactive history trends, global comparison charts, and an instantaneous Lifestyle Factors Radar Chart powered by `recharts`.
- **Integrated Voice Assistant:** Speak normally to check your stress level, ask for a recap of your history, or listen to recommendations utilizing the Web Speech API.
- **Secure Authentication:** Complete Login/Signup pipeline utilizing JSON Web Tokens (JWT) and OTP.

---

## 🏗️ System Architecture

The project follows a standard decoupled Client-Server architecture:

- **Frontend (Client):** Developed with **React.js** and **Tailwind CSS**. It provides a highly responsive UI and communicates with the backend REST APIs via Axios. Data graphics are beautifully rendered via **Recharts**.
- **Backend (Server):** Developed with **FastAPI (Python)**. It provides lightning-fast asynchronous REST APIs and automatic Swagger documentation.
- **Database:** Relational data tracking using **SQLAlchemy** ORM.
- **Machine Learning Layer:** Built with **Scikit-Learn/Pandas**, trained on structured lifestyle datasets, serialized via `joblib`, and loaded dynamically into the FastAPI backend inference service (`ml_service.py`).

---

## 🧠 Machine Learning Model Explanation

The core prediction mechanism relies on a trained classification model (e.g., Random Forest or similar mapping) utilizing physiological and daily habit datasets to understand stress patterns.

**Input Features (7 dimensions):**
1. Sleep Duration (hours)
2. Work Hours (hours)
3. Screen Time (hours)
4. Physical Activity (minutes)
5. Mood Level (Scale 1-5)
6. Resting Heart Rate (BPM)
7. Blood Oxygen (SpO2 %)

**Output Classes:**
- `Low`: Optimal lifestyle equilibrium.
- `Medium`: Minor imbalances requiring correction.
- `High`: Severe imbalances causing measurable physical/mental stress.

**Inference Flow:**
When the user submits their data form, FastAPI converts the JSON payload into a Numpy array and feeds it directly into the loaded `stress_model.pkl`. The categorical result is generated instantly, saved to the database under the user's profile, and returned to the React frontend to generate specific mathematical insights.

---

## 🔌 API Details

The FastAPI backend exposes the following primary endpoints natively accessible via `http://127.0.0.1:8000/docs`:

### Auth APIs
- `POST /auth/signup` - Registers a new user account.
- `POST /auth/verify-otp` - Verifies the email token to complete registration.
- `POST /auth/login` - Authenticates user credentials via OAuth2 format and returns a JWT `access_token`.

### Stress Analysis APIs (Protected, requires Bearer Token)
- `POST /stress/data` 
  - **Body Format:** `StressDataCreate` schema (the 7 core metrics).
  - **Action:** Predicts stress using the ML model, saves the footprint to the DB under the current user context, and returns the newly minted entry.
- `GET /stress/history`
  - **Action:** Retrieves the chronological stress records of the authenticated user to populate the individual History Line charts.
- `GET /stress/all`
  - **Action:** Retrieves anonymized aggregate data from all users across the platform to render the global Comparison charts.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (3.9 or higher)
- Appropriate package managers (`npm` / `pip`)

### 1. Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install Python backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI backend server using Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
   *The API will be available at `http://127.0.0.1:8000`. You can test APIs directly through the Swagger UI at `http://127.0.0.1:8000/docs`.*

### 2. Frontend Setup

1. Open a new terminal window completely and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the React application dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The frontend application will automatically launch in your default web browser at `http://localhost:3000`.*
