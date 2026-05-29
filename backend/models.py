from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from database import Base
from datetime import datetime

class ChatHistory(Base):

    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    prompt = Column(Text)

    response = Column(Text)

    model = Column(String)

    latency = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)
