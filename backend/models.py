from sqlalchemy import Boolean, Column, Integer, String, Text, Float, DateTime
from database import Base
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

class ChatHistory(Base):

    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String)

    prompt = Column(Text)


    response = Column(Text)

    model = Column(String)

    latency = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    cost = Column(Float, default=0)
    template_name = Column(String, nullable=True)
    template_version = Column(String, nullable=True)

    status = Column(String, default="success")
    error_message = Column(String, nullable=True)

class BenchmarkHistory(Base):
    __tablename__ = "benchmark_history"

    id = Column(Integer, primary_key=True)
    prompt = Column(Text)

    fastest_model = Column(String)
    cheapest_model = Column(String)
    best_quality_model = Column(String)

    created_at = Column(DateTime)

class AlertHistory(Base):
    __tablename__ = "alert_history"

    id = Column(Integer, primary_key=True)

    alert_type = Column(String)

    message = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True)

    password = Column(String)

class PromptTemplate(Base):

    __tablename__ = "prompt_templates"

    id = Column(Integer, primary_key=True)

    name = Column(String)

    version = Column(String)

    template = Column(Text)

    created_at = Column(DateTime)

    is_active = Column(Boolean)

    traffic_percentage = Column(
        Integer,
        default=0
    )