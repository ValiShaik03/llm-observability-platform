from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from prometheus_fastapi_instrumentator import Instrumentator

from sqlalchemy.orm import Session
from sqlalchemy import text

from schemas import ChatRequest
from database import engine, get_db
from models import Base, ChatHistory, User

from telemetry import tracer

from langfuse import Langfuse
from fastapi import HTTPException
from pydantic import BaseModel

from services.groq_service import generate_response as groq_response

from services.gemini_service import generate_response as gemini_response

from services.ollama_service import generate_response as ollama_response
import requests
class LoginRequest(BaseModel):
    username: str
    password: str


import os
import time

from prometheus_client import Counter
prompt_tokens_metric = Counter(
    "prompt_tokens_total",
    "Total Prompt Tokens"
)

completion_tokens_metric = Counter(
    "completion_tokens_total",
    "Total Completion Tokens"
)

total_tokens_metric = Counter(
    "llm_tokens_total",
    "Total LLM Tokens"
)
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

@app.post("/chat")
def chat(
    request: ChatRequest,
    username: str,
    db: Session = Depends(get_db)
):

    prompt = request.message
    selected_model = request.model

    with tracer.start_as_current_span("llm_request"):

        trace_obj = langfuse.trace(
            name="llm_request",
            input=prompt,
            metadata={
                "provider": selected_model,
                "application": "llm-observability-platform",
                "environment": "development",
                "user_id": username
            }
        )

        start_time = time.time()

        # MODEL SELECTION

        if selected_model == "groq":
            response = groq_response(prompt)

            response_text = (
                response.choices[0]
                .message
                .content
            )

            prompt_tokens = result["prompt_tokens"]
            completion_tokens = result["completion_tokens"]
            total_tokens = result["total_tokens"]

            if hasattr(response, "usage") and response.usage:
                prompt_tokens = response.usage.prompt_tokens
                completion_tokens = response.usage.completion_tokens
                total_tokens = response.usage.total_tokens
                cost = round(
                 (total_tokens / 1000000) * 0.59,
                  6
)

        elif selected_model == "gemini":

            result = gemini_response(prompt)

            response_text = result["text"]

            prompt_tokens = result["prompt_tokens"]

            completion_tokens = result["completion_tokens"]

            total_tokens = result["total_tokens"]

            cost = round(
        (total_tokens / 1000000) * 0.35,
        6
    )

        elif selected_model == "ollama":

            result = ollama_response(prompt)

            response_text = result["text"]

            prompt_tokens = 0
            completion_tokens = 0
            total_tokens = 0
            cost = 0

        else:

            raise HTTPException(
                status_code=400,
                detail="Invalid model"
            )

        latency = round(
            time.time() - start_time,
            2
        )
        prompt_tokens_metric.inc(prompt_tokens)

        completion_tokens_metric.inc(
            completion_tokens
        )

        total_tokens_metric.inc(
            total_tokens
        )

        chat_record = ChatHistory(
            username=username,
            prompt=prompt,
            response=response_text,
            model=selected_model,
            latency=latency,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            cost=cost
        )

        db.add(chat_record)
        db.commit()
        db.refresh(chat_record)

        trace_obj.update(
            output=response_text,
            metadata={
                "provider": selected_model,
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
            "model": selected_model,
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
    username: str,
    db: Session = Depends(get_db)
):

    with tracer.start_as_current_span("get_history"):

        chats = (
            db.query(ChatHistory)
            .filter(ChatHistory.username == username)
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

        avg_latency = (
            round(
                sum(chat.latency for chat in chats)
                / total_requests,
                2
            )
            if chats else 0
        )

        total_tokens = sum(
            getattr(chat, "total_tokens", 0)
            for chat in chats
        )

        prompt_tokens = sum(
            getattr(chat, "prompt_tokens", 0)
            for chat in chats
        )

        completion_tokens = sum(
            getattr(chat, "completion_tokens", 0)
            for chat in chats
        )
        total_cost = sum(
        getattr(chat, "cost", 0)
        for chat in chats
)

        return {
            "total_requests": total_requests,
            "avg_latency": avg_latency,
            "total_tokens": total_tokens,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_cost": format(total_cost, ".6f")
        }

@app.get("/model-stats")
def model_stats(
    db: Session = Depends(get_db)
):

    chats = db.query(ChatHistory).all()

    models = ["groq", "gemini", "ollama"]

    result = []

    for model_name in models:

        model_chats = [
            chat for chat in chats
            if chat.model == model_name
        ]

        requests_count = len(model_chats)

        total_tokens = sum(
            getattr(chat, "total_tokens", 0)
            for chat in model_chats
        )

        total_cost = sum(
            getattr(chat, "cost", 0)
            for chat in model_chats
        )

        avg_latency = (
            round(
                sum(chat.latency for chat in model_chats)
                / requests_count,
                2
            )
            if requests_count > 0
            else 0
        )

        result.append({
            "model": model_name,
            "requests": requests_count,
            "tokens": total_tokens,
            "cost": round(total_cost, 6),
            "latency": avg_latency
        })

    return result

@app.delete("/history/{chat_id}")
def delete_chat(
    chat_id: int,
    db: Session = Depends(get_db)
):

    chat = (
        db.query(ChatHistory)
        .filter(ChatHistory.id == chat_id)
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    db.delete(chat)
    db.commit()

    return {
        "message": "Chat deleted"
    }

@app.delete("/history")
def clear_history(
    db: Session = Depends(get_db)
):

    db.query(ChatHistory).delete()

    db.commit()

    return {
        "message": "All chats deleted"
    }
@app.get("/health")
def health(db: Session = Depends(get_db)):

    postgres = "healthy"
    prometheus = "healthy"
    langfuse = "healthy"
    jaeger = "healthy"
    grafana = "healthy"
    # PostgreSQL
    try:
        db.execute(text("SELECT 1"))
    except:
        postgres = "unhealthy"

    # Prometheus
    try:
        requests.get(
            "http://localhost:9090/-/healthy",
            timeout=2
        )
    except:
        prometheus = "unhealthy"

    # Langfuse
    try:
        requests.get(
            "http://localhost:3002",
            timeout=2
        )
    except:
        langfuse = "unhealthy"

    # Jaeger
    try:
        requests.get(
            "http://localhost:16686",
            timeout=2
        )
    except:
        jaeger = "unhealthy"
    
    # Grafana

    try:
        requests.get(
        "http://localhost:3000/api/health",
        timeout=2
    )
    except:
        grafana = "unhealthy"

    return {
        "fastapi": "healthy",
        "postgres": postgres,
        "prometheus": prometheus,
        "langfuse": langfuse,
        "jaeger": jaeger,
        "grafana": grafana
    }



    return {
        "fastapi": "healthy",
        "postgres": postgres,
        "prometheus": prometheus,
        "langfuse": langfuse,
        "jaeger": jaeger
    }


@app.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.username == data.username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username"
        )

    if user.password != data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    return {
    "message": "Login successful",
    "username": user.username
}

from models import User
from pydantic import BaseModel

class RegisterRequest(BaseModel):
    username: str
    password: str


@app.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    existing_user = (
        db.query(User)
        .filter(User.username == data.username)
        .first()
    )

    if existing_user:
        return {
            "message": "Username already exists"
        }

    user = User(
        username=data.username,
        password=data.password
    )

    db.add(user)
    db.commit()

    return {
        "message": "Registration successful"
    }