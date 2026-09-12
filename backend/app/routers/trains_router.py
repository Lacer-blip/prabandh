import io
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Train, User
from app.schemas import TrainOut, TimetableUploadResponse

router = APIRouter()

REQUIRED_COLUMNS = {
    "train_number",
    "train_name",
    "category",
    "direction",
    "origin_station",
    "origin_time_decimal",
    "dest_station",
    "dest_time_decimal",
}


def resolve_priority_and_type(category: str) -> tuple[str, str]:
    cat = category.strip()
    if cat == "Vande Bharat":
        return "P1", "Vande Bharat"
    if cat in ("Rajdhani", "Shatabdi"):
        return "P2", cat
    if cat == "Express":
        return "P3", "Express"
    if cat == "Freight":
        return "P4", "Freight"
    return "P3", cat


@router.get("/trains", response_model=list[TrainOut])
def get_trains(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Train)
    return list(db.scalars(stmt).all())


@router.post("/coa/timetable", response_model=TimetableUploadResponse)
async def upload_timetable(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse CSV file: {str(exc)}",
        )

    missing_cols = REQUIRED_COLUMNS - set(df.columns)
    if missing_cols:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"CSV missing mandatory columns: {', '.join(sorted(missing_cols))}",
        )

    warnings: list[str] = []

    for index, row in df.iterrows():
        row_num = index + 2  # Accounting for zero-index and CSV header row

        # Check for empty / NaN values in required fields
        if pd.isna(row["train_number"]) or str(row["train_number"]).strip() == "":
            warnings.append(f"Row {row_num}: missing train_number, skipped")
            continue

        if pd.isna(row["origin_time_decimal"]):
            warnings.append(f"Row {row_num}: missing origin_time_decimal, skipped")
            continue

        if pd.isna(row["dest_time_decimal"]):
            warnings.append(f"Row {row_num}: missing dest_time_decimal, skipped")
            continue

        try:
            origin_time = float(row["origin_time_decimal"])
            dest_time = float(row["dest_time_decimal"])
        except (ValueError, TypeError):
            warnings.append(f"Row {row_num}: invalid decimal time value, skipped")
            continue

        train_no = str(row["train_number"]).strip()
        train_name = str(row["train_name"]).strip() if pd.notna(row["train_name"]) else "Unknown"
        category = str(row["category"]).strip() if pd.notna(row["category"]) else "Express"
        direction = str(row["direction"]).strip().upper() if pd.notna(row["direction"]) else "UP"

        priority, train_type = resolve_priority_and_type(category)

        existing_train = db.scalar(select(Train).where(Train.trainNo == train_no))

        if existing_train:
            existing_train.name = train_name
            existing_train.type = train_type
            existing_train.originTime = origin_time
            existing_train.destTime = dest_time
            existing_train.direction = direction
            existing_train.priority = priority
        else:
            new_train = Train(
                trainNo=train_no,
                name=train_name,
                type=train_type,
                originTime=origin_time,
                destTime=dest_time,
                direction=direction,
                priority=priority,
            )
            db.add(new_train)

    db.commit()

    all_trains = list(db.scalars(select(Train)).all())

    return {
        "trains": all_trains,
        "warnings": warnings,
    }

