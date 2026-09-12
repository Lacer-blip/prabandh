from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Block(Base):
    __tablename__ = "blocks"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    department: Mapped[str] = mapped_column(String)
    section: Mapped[str] = mapped_column(String)
    track: Mapped[str] = mapped_column(String)
    work_type: Mapped[str] = mapped_column(String)
    time_window: Mapped[str] = mapped_column(String)
    duration: Mapped[str] = mapped_column(String)
    machine: Mapped[str] = mapped_column(String)
    tsr_speed: Mapped[str] = mapped_column(String)
    power_cut: Mapped[bool] = mapped_column(Boolean)
    disruption_score: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    private_number: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    start_time: Mapped[datetime] = mapped_column(DateTime)
    end_time: Mapped[datetime] = mapped_column(DateTime)

    # Explicit relationships matching foreign keys
    conflicts_as_a: Mapped[list["Conflict"]] = relationship(
        "Conflict",
        foreign_keys="[Conflict.block_a_id]",
        back_populates="block_a_rel",
    )
    conflicts_as_b: Mapped[list["Conflict"]] = relationship(
        "Conflict",
        foreign_keys="[Conflict.block_b_id]",
        back_populates="block_b_rel",
    )


class Conflict(Base):
    __tablename__ = "conflicts"

    conflict_id: Mapped[str] = mapped_column(String, primary_key=True)
    section: Mapped[str] = mapped_column(String)
    track: Mapped[str] = mapped_column(String)
    block_a: Mapped[str] = mapped_column(String)
    block_b: Mapped[str] = mapped_column(String)
    overlap_window: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String)
    ai_recommendation: Mapped[str] = mapped_column(String)
    block_a_id: Mapped[str] = mapped_column(String, ForeignKey("blocks.id"))
    block_b_id: Mapped[str] = mapped_column(String, ForeignKey("blocks.id"))

    block_a_rel: Mapped["Block"] = relationship(
        "Block",
        foreign_keys=[block_a_id],
        back_populates="conflicts_as_a",
    )
    block_b_rel: Mapped["Block"] = relationship(
        "Block",
        foreign_keys=[block_b_id],
        back_populates="conflicts_as_b",
    )


class Train(Base):
    __tablename__ = "trains"

    trainNo: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)
    originTime: Mapped[float] = mapped_column(Float)
    destTime: Mapped[float] = mapped_column(Float)
    direction: Mapped[str] = mapped_column(String)
    priority: Mapped[str] = mapped_column(String)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    portalType: Mapped[str] = mapped_column(String)
    name: Mapped[str] = mapped_column(String)
    initials: Mapped[str] = mapped_column(String)
    division: Mapped[str] = mapped_column(String)
    zone: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String)