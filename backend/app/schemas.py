from typing import Optional
from pydantic import BaseModel, ConfigDict


class BlockOut(BaseModel):
    id: str
    department: str
    section: str
    track: str
    work_type: str
    time_window: str
    duration: str
    machine: str
    tsr_speed: str
    power_cut: bool
    disruption_score: str
    status: str
    private_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class BlockCreate(BaseModel):
    department: str
    section: str
    track: str
    work_type: str
    start_time: str
    end_time: str
    duration_hours: str
    assigned_machine: str
    speed_restriction: str
    ohe_power_cut: str
    disruption_score: str

class TrainOut(BaseModel):
    trainNo: str
    name: str
    type: str
    originTime: float
    destTime: float
    direction: str
    priority: str

    model_config = ConfigDict(from_attributes=True)


class TimetableUploadResponse(BaseModel):
    trains: list[TrainOut]
    warnings: list[str]    

class ConflictOut(BaseModel):
    conflict_id: str
    section: str
    track: str
    block_a: str
    block_b: str
    overlap_window: str
    severity: str
    ai_recommendation: str

    model_config = ConfigDict(from_attributes=True)