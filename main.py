from fastapi import FastAPI, Request
from fastapi.openapi.utils import get_openapi
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from models import Base
from database import engine
from auth import router as auth_router
from routers import users, projects, tasks, comments, members, assistant, analytics

# ✅ Load environment variables from .env
load_dotenv()

# ✅ Create database tables
Base.metadata.create_all(bind=engine)

# ✅ Create FastAPI app
app = FastAPI()

# ✅ Jinja2 Templates (HTML frontend)
templates = Jinja2Templates(directory="templates")

# ✅ Mount static files for /static/
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ Register all routers
app.include_router(users.router, prefix="/users")
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(comments.router)
app.include_router(auth_router)
app.include_router(members.router)
app.include_router(assistant.router)
app.include_router(analytics.router)

# ✅ Customize Swagger UI to use Bearer JWT auth
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

# ✅ Serve login page by default
@app.get("/", response_class=HTMLResponse)
async def serve_login(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# ✅ Serve dashboard only when authenticated (frontend should handle the redirect)
@app.get("/dashboard", response_class=HTMLResponse)
async def serve_dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

# ✅ Serve members.html (optional)
@app.get("/members-page", response_class=HTMLResponse)
async def serve_members_page(request: Request):
    return templates.TemplateResponse("members.html", {"request": request})

@app.get("/tasks", response_class=HTMLResponse)
async def serve_tasks_page(request: Request):
    return templates.TemplateResponse("tasks.html", {"request": request})
