from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Conflict, User
from app.schemas import BlockOut, ConflictOut
from app.solver.conflict_engine import merge_shadow_block

router = APIRouter()


@router.get("/conflicts", response_model=list[ConflictOut])
def get_conflicts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Conflict)
    return list(db.scalars(stmt).all())


@router.post("/conflicts/{conflict_id}/shadow-merge", response_model=BlockOut)
def shadow_merge(
    conflict_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    merged_block = merge_shadow_block(db, conflict_id)
    return merged_block