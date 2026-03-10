from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import students, classes, stats, export
import models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(students.router)
app.include_router(classes.router)
app.include_router(stats.router)
app.include_router(export.router)


@app.get("/")
def root():
    return {"message": "Student Management API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
