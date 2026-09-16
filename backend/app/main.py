from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, courses, roadmap

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduForge API", version="1.0.0")

# CORS - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(roadmap.router)

@app.get("/")
def root():
    return {"message": "Welcome to EduForge API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}