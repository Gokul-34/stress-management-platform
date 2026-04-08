import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.db.database import engine, Base
from backend.api.routes import auth, stress

# Create FastAPI app
app = FastAPI()

app.include_router(stress.router, prefix="/stress", tags=["Stress"])

# ✅ CORS configuration (FIXED)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create DB tables (after app init is safer)
Base.metadata.create_all(bind=engine)

# ✅ Include routers
app.include_router(auth.router)
app.include_router(stress.router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Stress Monitoring API!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=10000)
    