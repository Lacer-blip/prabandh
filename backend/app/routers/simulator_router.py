from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.solver.conflict_engine import what_if_reslot

router = APIRouter()


class WhatIfRequest(BaseModel):
    trainNo: str
    delayMinutes: int
    rootCause: Optional[str] = None


class WhatIfResponse(BaseModel):
    trainNo: str
    delayMinutes: int
    startHour: float
    endHour: float
    timeWindowStr: str
    affected_block_id: Optional[str]
    solve_time_ms: float


@router.post("/simulator/what-if", response_model=WhatIfResponse)
def simulate_what_if(
    payload: WhatIfRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = what_if_reslot(
        db_session=db,
        train_no=payload.trainNo,
        delay_minutes=payload.delayMinutes,
    )
    return result