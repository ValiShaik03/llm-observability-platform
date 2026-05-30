from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
from groq import Groq

from prometheus_fastapi_instrumentator import Instrumentator

from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, ChatHistory

from telemetry import tracer

from langfuse import Langfuse

import os
import time

# -----------------------------
# LOAD ENV
# -----------------------------

load_dotenv()

# -----------------------------
# DATABASE
# -----------------------------

Base.metadata.create_all(bind=engine)

# -----------------------------
# FASTAPI APP
# -----------------------------

app = FastAPI(title="LLM Observability Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# PROMETHEUS
# -----------------------------

Instrumentator().instrument(app).expose(app)

# -----------------------------
# GROQ CLIENT
# -----------------------------

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# -----------------------------
# LANGFUSE CLIENT
# -----------------------------

langfuse = Langfuse(
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
    host=os.getenv("LANGFUSE_HOST")
)

# -----------------------------
# HOME
# -----------------------------

@app.get("/")
def root():

    with tracer.start_as_current_span("root_endpoint"):

        return {
            "message": "LLM Observability Platform Running"
        }

# -----------------------------
# CHAT
# -----------------------------

@app.get("/chat")
def chat(
    prompt: str,
    db: Session = Depends(get_db)
):

    with tracer.start_as_current_span("llm_request"):

        trace_obj = langfuse.trace(
            name="llm_request",
            input=prompt,
            metadata={
                "provider": "groq",
                "application": "llm-observability-platform",
                "environment": "development",
                "user_id": "demo_user"
            }
        )

        generation = trace_obj.generation(
            name="groq_generation",
            model="llama-3.3-70b-versatile",
            input=prompt,
            metadata={
                "provider": "groq",
                "temperature": 0.7
            }
        )

        start_time = time.time()

        # ---------------------
        # GROQ API CALL
        # ---------------------

        with tracer.start_as_current_span("groq_api_call"):

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

        response_text = response.choices[0].message.content

        latency = round(time.time() - start_time, 2)

        # ---------------------
        # TOKEN USAGE
        # ---------------------

        prompt_tokens = 0
        completion_tokens = 0
        total_tokens = 0

        if hasattr(response, "usage") and response.usage:

            prompt_tokens = response.usage.prompt_tokens
            completion_tokens = response.usage.completion_tokens
            total_tokens = response.usage.total_tokens

        # ---------------------
        # SAVE TO POSTGRES
        # ---------------------

        with tracer.start_as_current_span("save_to_postgres"):

            chat_record = ChatHistory(
                prompt=prompt,
                response=response_text,
                model="llama-3.3-70b-versatile",
                latency=latency
            )

            db.add(chat_record)
            db.commit()
            db.refresh(chat_record)

        # ---------------------
        # LANGFUSE GENERATION
        # ---------------------

        generation.end(
            output=response_text,
            usage_details={
                "input": prompt_tokens,
                "output": completion_tokens,
                "total": total_tokens
            },
            metadata={
                "latency_seconds": latency
            }
        )

        # ---------------------
        # LANGFUSE TRACE
        # ---------------------

        trace_obj.update(
            output=response_text,
            metadata={
                "provider": "groq",
                "latency_seconds": latency,
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": total_tokens,
                "database_id": chat_record.id
            }
        )

        langfuse.flush()

        return {
            "id": chat_record.id,
            "prompt": prompt,
            "response": response_text,
            "latency": latency,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens
        }

# -----------------------------
# CHAT HISTORY
# -----------------------------

@app.get("/history")
def get_history(
    db: Session = Depends(get_db)
):

    with tracer.start_as_current_span("get_history"):

        chats = (
            db.query(ChatHistory)
            .order_by(ChatHistory.created_at.desc())
            .all()
        )

        return [
            {
                "id": chat.id,
                "prompt": chat.prompt,
                "response": chat.response,
                "created_at": chat.created_at
            }
            for chat in chats
        ]

# -----------------------------
# SINGLE CHAT
# -----------------------------

@app.get("/history/{chat_id}")
def get_chat(
    chat_id: int,
    db: Session = Depends(get_db)
):

    with tracer.start_as_current_span("get_chat_by_id"):

        chat = (
            db.query(ChatHistory)
            .filter(ChatHistory.id == chat_id)
            .first()
        )

        if not chat:
            return {"error": "Chat not found"}

        return {
            "id": chat.id,
            "prompt": chat.prompt,
            "response": chat.response,
            "model": chat.model,
            "latency": chat.latency,
            "created_at": chat.created_at
        }

# -----------------------------
# STATS
# -----------------------------

@app.get("/stats")
def get_stats(
    db: Session = Depends(get_db)
):

    with tracer.start_as_current_span("get_stats"):

        chats = db.query(ChatHistory).all()

        total_requests = len(chats)

        avg_latency = 0

        if chats:
            avg_latency = round(
                sum(chat.latency for chat in chats)
                / len(chats),
                2
            )

        return {
            "total_requests": total_requests,
            "avg_latency": avg_latency
        }