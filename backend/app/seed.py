from datetime import datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Block, Conflict, Train, User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_default_timestamps(time_window: str) -> tuple[datetime, datetime]:
    today = datetime.now().date()
    try:
        start_str, end_str = [part.strip() for part in time_window.split("–")]
        start_h, start_m = map(int, start_str.split(":"))
        end_h, end_m = map(int, end_str.split(":"))

        start_dt = datetime.combine(today, datetime.min.time()).replace(
            hour=start_h, minute=start_m
        )
        end_dt = datetime.combine(today, datetime.min.time()).replace(
            hour=end_h, minute=end_m
        )

        if end_dt <= start_dt:
            end_dt += timedelta(days=1)
        return start_dt, end_dt
    except Exception:
        now = datetime.now()
        return now, now + timedelta(hours=4)


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Users
        hashed_password = pwd_context.hash("Rail@2026")
        users_data = [
            {
                "email": "sr.dom.bpl@railways.gov.in",
                "portalType": "APPROVER",
                "name": "Sr. Divisional Operations Manager (Sr. DOM)",
                "initials": "DOM",
                "role": "Approver",
            },
            {
                "email": "coa.feed.bpl@railways.gov.in",
                "portalType": "COA",
                "name": "COA Traffic Data Feed Desk",
                "initials": "COA",
                "role": "COA Operator",
            },
            {
                "email": "civil.bpl@railways.gov.in",
                "portalType": "DEPT",
                "name": "Section Engineer (Civil)",
                "initials": "TMS",
                "role": "Civil Engineer",
            },
            {
                "email": "trd.bpl@railways.gov.in",
                "portalType": "DEPT",
                "name": "Section Engineer (Traction)",
                "initials": "TDMS",
                "role": "Traction Engineer",
            },
            {
                "email": "st.bpl@railways.gov.in",
                "portalType": "DEPT",
                "name": "Section Engineer (Signal)",
                "initials": "SMMS",
                "role": "Signal Engineer",
            },
        ]

        for u in users_data:
            exists = db.scalar(select(User).where(User.email == u["email"]))
            if not exists:
                user = User(
                    email=u["email"],
                    hashed_password=hashed_password,
                    portalType=u["portalType"],
                    name=u["name"],
                    initials=u["initials"],
                    division="Bhopal Division (WCR)",
                    zone="West Central Railway (WCR)",
                    role=u["role"],
                )
                db.add(user)

        # 2. Seed Master Blocks
        blocks_data = [
            {
                "id": "BLK-2026-0901",
                "department": "Civil Engineering",
                "section": "Bhopal (BPL) – Itarsi (ET)",
                "track": "Down Main Line",
                "work_type": "Track Tamping & Deep Ballast Screening",
                "time_window": "08:00 – 12:00",
                "duration": "4.0 hrs",
                "machine": "TTM-Duomatic-08",
                "tsr_speed": "30 km/h",
                "power_cut": False,
                "disruption_score": "38.4",
                "status": "CONFLICT_DETECTED",
                "private_number": None,
            },
            {
                "id": "BLK-2026-0902",
                "department": "Traction Distribution (TRD)",
                "section": "Bhopal (BPL) – Itarsi (ET)",
                "track": "Down Main Line",
                "work_type": "25kV Catenary Wire Dropper Renewal",
                "time_window": "09:30 – 12:30",
                "duration": "3.0 hrs",
                "machine": "Tower Wagon TW-02",
                "tsr_speed": "45 km/h",
                "power_cut": True,
                "disruption_score": "28.0",
                "status": "CONFLICT_DETECTED",
                "private_number": None,
            },
            {
                "id": "BLK-2026-0889",
                "department": "Signal & Telecom (S&T)",
                "section": "Bina (BINA) – Jhansi (JHS)",
                "track": "Up Main Line",
                "work_type": "Electronic Interlocking & Digital Axle Counter Calibration",
                "time_window": "13:00 – 15:30",
                "duration": "2.5 hrs",
                "machine": "Manual Technical Crew",
                "tsr_speed": "Normal (MPS)",
                "power_cut": False,
                "disruption_score": "11.2",
                "status": "APPROVED",
                "private_number": "BPL-PN-4412",
            },
            {
                "id": "BLK-2026-0872",
                "department": "Civil Engineering",
                "section": "Nagpur (NGP) – Itarsi (ET)",
                "track": "Both Lines",
                "work_type": "Turnout Sleeper Renewal & Rail Welding",
                "time_window": "23:00 – 03:30",
                "duration": "4.5 hrs",
                "machine": "BCM-04 (Cleaner)",
                "tsr_speed": "20 km/h",
                "power_cut": False,
                "disruption_score": "21.6",
                "status": "PENDING_SANCTION",
                "private_number": None,
            },
        ]

        for b in blocks_data:
            exists = db.scalar(select(Block).where(Block.id == b["id"]))
            if not exists:
                start_dt, end_dt = get_default_timestamps(b["time_window"])
                block = Block(
                    id=b["id"],
                    department=b["department"],
                    section=b["section"],
                    track=b["track"],
                    work_type=b["work_type"],
                    time_window=b["time_window"],
                    duration=b["duration"],
                    machine=b["machine"],
                    tsr_speed=b["tsr_speed"],
                    power_cut=b["power_cut"],
                    disruption_score=b["disruption_score"],
                    status=b["status"],
                    private_number=b["private_number"],
                    start_time=start_dt,
                    end_time=end_dt,
                )
                db.add(block)

        # Flush blocks before inserting conflicts to satisfy foreign key constraints
        db.flush()

        # 3. Seed Conflicts
        conflicts_data = [
            {
                "conflict_id": "CONF-8821",
                "section": "Bhopal (BPL) – Itarsi (ET)",
                "track": "Down Main Line",
                "block_a": "Civil Track Tamping (08:00 – 12:00)",
                "block_b": "TRD Catenary Power Inspection (09:30 – 12:30)",
                "overlap_window": "09:30 – 12:00 (150 mins overlap)",
                "severity": "CRITICAL",
                "ai_recommendation": "Execute 1-Click Integrated Shadow Block: Bundle TRD catenary maintenance inside Civil possession window (08:00 – 12:00). Saves 3.5 hours of corridor downtime.",
                "block_a_id": "BLK-2026-0901",
                "block_b_id": "BLK-2026-0902",
            }
        ]

        for c in conflicts_data:
            exists = db.scalar(
                select(Conflict).where(Conflict.conflict_id == c["conflict_id"])
            )
            if not exists:
                conflict = Conflict(
                    conflict_id=c["conflict_id"],
                    section=c["section"],
                    track=c["track"],
                    block_a=c["block_a"],
                    block_b=c["block_b"],
                    overlap_window=c["overlap_window"],
                    severity=c["severity"],
                    ai_recommendation=c["ai_recommendation"],
                    block_a_id=c["block_a_id"],
                    block_b_id=c["block_b_id"],
                )
                db.add(conflict)

        # 4. Seed Trains
        trains_data = [
            {
                "trainNo": "20172",
                "name": "Vande Bharat",
                "type": "Vande Bharat",
                "originTime": 5.8,
                "destTime": 7.0,
                "direction": "UP",
                "priority": "P1",
            },
            {
                "trainNo": "12002",
                "name": "Bhopal Shatabdi",
                "type": "Shatabdi",
                "originTime": 14.3,
                "destTime": 15.6,
                "direction": "DN",
                "priority": "P2",
            },
            {
                "trainNo": "12616",
                "name": "GT Express",
                "type": "Express",
                "originTime": 3.2,
                "destTime": 5.0,
                "direction": "DN",
                "priority": "P3",
            },
            {
                "trainNo": "12722",
                "name": "Dakshin Express",
                "type": "Express",
                "originTime": 18.2,
                "destTime": 20.0,
                "direction": "DN",
                "priority": "P3",
            },
            {
                "trainNo": "12156",
                "name": "Shan-e-Bhopal",
                "type": "Express",
                "originTime": 21.0,
                "destTime": 22.4,
                "direction": "UP",
                "priority": "P2",
            },
            {
                "trainNo": "BOXN-91",
                "name": "Coal Freight Rake",
                "type": "Freight",
                "originTime": 12.2,
                "destTime": 15.0,
                "direction": "UP",
                "priority": "P4",
            },
            {
                "trainNo": "BCN-44",
                "name": "Grain Freight Rake",
                "type": "Freight",
                "originTime": 16.0,
                "destTime": 19.2,
                "direction": "DN",
                "priority": "P4",
            },
        ]

        for t in trains_data:
            exists = db.scalar(select(Train).where(Train.trainNo == t["trainNo"]))
            if not exists:
                train = Train(
                    trainNo=t["trainNo"],
                    name=t["name"],
                    type=t["type"],
                    originTime=t["originTime"],
                    destTime=t["destTime"],
                    direction=t["direction"],
                    priority=t["priority"],
                )
                db.add(train)

        db.commit()
        print("Database seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()