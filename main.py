from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import os

from models import Base
from database import engine
from auth import router as auth_router
from routers import users, projects, tasks, comments, members, assistant

# ✅ Load environment variables from .env
load_dotenv()

# ✅ Create database tables
Base.metadata.create_all(bind=engine)

# ✅ FastAPI app instance
app = FastAPI()

# ✅ Register all routers
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(comments.router)
app.include_router(auth_router)
app.include_router(members.router)
app.include_router(assistant.router)

# ✅ Swagger UI with Bearer auth
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="TeamSync API",
        version="1.0.0",
        description="Team collaboration backend with JWT auth",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# ✅ Serve static frontend files
app.mount("/static", StaticFiles(directory="static"), name="static")

# ✅ Serve index.html at root path
@app.get("/")
def serve_home():
    return FileResponse("static/index.html")

# ✅ Serve uploaded files
@app.get("/uploads/{filename}")
def serve_upload(filename: str):
    return FileResponse(f"uploads/{filename}")

# ✅ Serve members page
@app.get("/members")
def serve_members_page():
    return FileResponse("static/members.html")
