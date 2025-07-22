# routers/analytics.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models

router = APIRouter()

@router.get("/projects/{project_id}/analytics")
def get_project_analytics(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Verify project ownership
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.owner_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found or unauthorized")

    # Count tasks by status
    status_counts = {
        "pending": 0,
        "in_progress": 0,
        "done": 0
    }

    tasks = db.query(models.Task).filter(models.Task.project_id == project_id).all()
    for task in tasks:
        if task.status in status_counts:
            status_counts[task.status] += 1

    return status_counts
