from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
# from unittest import result
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from prometheus_fastapi_instrumentator import Instrumentator

from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from utils.email_service import send_alert_email
from schemas import ChatRequest
from models import PromptTemplate
from schemas import PromptTemplateCreate
class BenchmarkRequest(BaseModel):
    prompt: str
from database import engine, get_db
from models import (
    Base,
    ChatHistory,
    User,
    BenchmarkHistory,
    AlertHistory
)

# from telemetry import tracer

from otel_sdk.tracer import tracer

from otel_sdk.llm_tracker import (
    start_chat_span,
    start_inference_span,
    start_database_span
)

from langfuse import Langfuse
from fastapi import HTTPException

from services.groq_service import generate_response as groq_response

from services.gemini_service import generate_response as gemini_response

from services.ollama_service import generate_response as ollama_response
import requests
from sqlalchemy import func
from slack_service import send_slack_alert
class LoginRequest(BaseModel):
    username: str
    password: str


import os
import time
import random
from prometheus_client import Counter
prompt_tokens_metric = Counter(
    "prompt_tokens_total",
    "Total Prompt Tokens"
)

chat_requests_metric = Counter(
    "chat_requests_total",
    "Total Chat Requests"
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

FastAPIInstrumentor.instrument_app(app)

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
    selected_template = None
    print("================================")
    print("REQUEST TEMPLATE =", request.template)
    if request.template:
        print(
        "TEMPLATE SELECTED:",
        request.template
    )
    print("================================")
    if request.template:
        if "|" in request.template:
            template_name, template_version = (
            request.template.split("|")
        )
            selected_template = (
            db.query(PromptTemplate)
            .filter(
                PromptTemplate.name == template_name,
                PromptTemplate.version == template_version
            )
            .first()
        )
        else:
            selected_template = (
                db.query(PromptTemplate)
                .filter(
                    PromptTemplate.name == request.template
                )
                .order_by(
                    PromptTemplate.id.desc()
                )
                .first()
            )
    
    template_name = None
    template_version = None
    if selected_template:
        template_name = selected_template.name
        template_version = selected_template.version
        
        print(
        f"USING TEMPLATE: "
        f"{template_name} {template_version}"
    )
        prompt = f"""
{selected_template.template}

User Input:
{prompt}
"""
    # chat_requests_metric.inc()

    print("CHAT REQUEST RECEIVED")
    trace_obj = langfuse.trace(
    name="llm_request",
    input=prompt,
    metadata={
        "provider": selected_model,
        "user_id": username
    }
)
    start_time = time.time()
    with start_chat_span(
    username,
    selected_model
) as chat_span:
        with start_inference_span(
    selected_model
) as inference_span:
            if selected_model == "groq":
                response = groq_response(prompt)
                response_text = (
                response.choices[0]
                .message
                .content
            )
                if hasattr(response, "usage") and response.usage:
                    prompt_tokens = response.usage.prompt_tokens
                    completion_tokens = (
                    response.usage.completion_tokens
                )
                    total_tokens = (
                    response.usage.total_tokens
                )
                    cost = round(
                    (total_tokens / 1000000) * 0.59,
                    6
                )

            elif selected_model == "gemini":

                result = gemini_response(prompt)

                response_text = result["text"]

                prompt_tokens = result["prompt_tokens"]

                completion_tokens = (
                    result["completion_tokens"]
                )

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

            inference_span.set_attribute(
                "provider",
                selected_model
            )

            inference_span.set_attribute(
                "total_tokens",
                total_tokens
            )

            latency = round(
    time.time() - start_time,
    2
)
            inference_span.set_attribute(
    "cost",
    cost
)
            inference_span.set_attribute(
    "latency",
    latency
)
            status = "success"
            error_message = None
        
            print("OTEL ATTRIBUTES")
            print("LATENCY =", latency)
            print("TOKENS =", total_tokens)
            print("COST =", cost)
            print("TEMPLATE =", template_name)
            print("VERSION =", template_version)
        
        chat_span.set_attribute(
        "latency",
        latency
    )
        
        chat_span.set_attribute(
            "prompt_template",
            request.template or "None"
    )

        chat_span.set_attribute(
            "total_tokens",
            total_tokens
        )

        chat_span.set_attribute(
            "cost",
            cost
        )

        chat_span.set_attribute(
            "template_name",
            template_name or "None"
        )

        chat_span.set_attribute(
            "template_version",
            template_version or "None"
        )

        chat_span.set_attribute(
            "username",
            username
        )

        chat_span.set_attribute(
            "model",
            selected_model
        )

        chat_record = ChatHistory(
        username=username,

        prompt=request.message,

        response=response_text,

        model=selected_model,

        template_name=template_name,

        template_version=template_version,

        latency=latency,

        prompt_tokens=prompt_tokens,

        completion_tokens=completion_tokens,

        total_tokens=total_tokens,

        cost=cost,

        status=status,

        error_message=error_message
    )

        with start_database_span() as db_span:
            db.add(chat_record)
            db.commit()
            db.refresh(chat_record)

            db_span.set_attribute(
        "chat_id",
        chat_record.id
    )
            db_span.set_attribute(
    "username",
    username
)
            db_span.set_attribute(
    "model",
    selected_model
)
        print("PROMPT TOKENS =", prompt_tokens)
        print("COMPLETION TOKENS =", completion_tokens)
        print("TOTAL TOKENS =", total_tokens)
        print("COST =", cost)

        quality_score = random.randint(7, 10)
        generation = trace_obj.generation(
        name="llm_generation",
        model=selected_model,
        input=prompt,
        output=response_text,
        
        metadata={
            "latency": latency,
            "cost": cost,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens
        }
    )
        generation.score(
        name="quality",
        value=quality_score
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
                "total_tokens": total_tokens,
                "cost": cost,
                "quality_score": quality_score,
    }

@app.post("/benchmark")
def benchmark_models(
    request: BenchmarkRequest,
    db: Session = Depends(get_db)
):

    prompt = request.prompt

    results = []

    models = [
        "groq",
        "gemini",
        "ollama"
    ]

    for model in models:

        start_time = time.time()

        try:

            if model == "groq":

                response = groq_response(prompt)

                response_text = (
                    response.choices[0]
                    .message
                    .content
                )

                prompt_tokens = (
                    response.usage.prompt_tokens
                )

                completion_tokens = (
                    response.usage.completion_tokens
                )

                total_tokens = (
                    response.usage.total_tokens
                )

                cost = round(
                    (total_tokens / 1000000) * 0.59,
                    6
                )

            elif model == "gemini":

                result = gemini_response(prompt)

                response_text = result["text"]

                prompt_tokens = result[
                    "prompt_tokens"
                ]

                completion_tokens = result[
                    "completion_tokens"
                ]

                total_tokens = result[
                    "total_tokens"
                ]

                cost = round(
                    (total_tokens / 1000000) * 0.35,
                    6
                )

            elif model == "ollama":

                result = ollama_response(prompt)

                response_text = result["text"]

                prompt_tokens = 0
                completion_tokens = 0
                total_tokens = 0
                cost = 0

            latency = round(
                time.time() - start_time,
                2
            )

            results.append({
                "model": model,
                "response": response_text,
                "latency": latency,
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": total_tokens,
                "cost": cost
            })

        except Exception as e:

            results.append({
                "model": model,
                "error": str(e)
            })

    successful_results = [
        r for r in results
        if "error" not in r
    ]

    if successful_results:

        fastest_model = min(
            successful_results,
            key=lambda x: x["latency"]
        )["model"]

        cheapest_model = min(
            successful_results,
            key=lambda x: x["cost"]
        )["model"]

        best_quality_model = max(
            successful_results,
            key=lambda x: len(
                x.get("response", "")
            )
        )["model"]

        benchmark_record = BenchmarkHistory(
            prompt=prompt,
            fastest_model=fastest_model,
            cheapest_model=cheapest_model,
            best_quality_model=best_quality_model
        )

        db.add(benchmark_record)
        db.commit()

    return {
        "prompt": prompt,
        "fastest_model": (
            fastest_model
            if successful_results
            else None
        ),
        "cheapest_model": (
            cheapest_model
            if successful_results
            else None
        ),
        "best_quality_model": (
            best_quality_model
            if successful_results
            else None
        ),
        "results": results
    }

@app.get("/benchmark-history")
def benchmark_history(
    db: Session = Depends(get_db)
):

    records = (
        db.query(BenchmarkHistory)
        .order_by(
            BenchmarkHistory.created_at.desc()
        )
        .all()
    )

    return [
        {
            "id": r.id,
            "prompt": r.prompt,
            "fastest_model": r.fastest_model,
            "cheapest_model": r.cheapest_model,
            "best_quality_model": r.best_quality_model,
            "created_at": r.created_at
        }
        for r in records
    ]

@app.get("/benchmark-dashboard")
def benchmark_dashboard(db: Session = Depends(get_db)):

    benchmarks = (
        db.query(BenchmarkHistory)
        .order_by(
            BenchmarkHistory.created_at.desc()
        )
        .limit(20)
        .all()
    )

    return [
        {
            "prompt": item.prompt,
            "fastest_model": item.fastest_model,
            "cheapest_model": item.cheapest_model,
            "best_quality_model": item.best_quality_model,
            "created_at": item.created_at
        }
        for item in benchmarks
    ]

@app.get("/benchmark-stats")
def benchmark_stats(
    db: Session = Depends(get_db)
):

    records = (
        db.query(BenchmarkHistory)
        .all()
    )

    groq_fastest = sum(
        1
        for r in records
        if r.fastest_model == "groq"
    )

    gemini_fastest = sum(
        1
        for r in records
        if r.fastest_model == "gemini"
    )

    ollama_fastest = sum(
        1
        for r in records
        if r.fastest_model == "ollama"
    )

    groq_quality = sum(
        1
        for r in records
        if r.best_quality_model == "groq"
    )

    gemini_quality = sum(
        1
        for r in records
        if r.best_quality_model == "gemini"
    )

    ollama_quality = sum(
        1
        for r in records
        if r.best_quality_model == "ollama"
    )

    groq_cheapest = sum(
        1
        for r in records
        if r.cheapest_model == "groq"
    )

    gemini_cheapest = sum(
        1
        for r in records
        if r.cheapest_model == "gemini"
    )

    ollama_cheapest = sum(
        1
        for r in records
        if r.cheapest_model == "ollama"
    )

    return {
        "total_runs": len(records),

        "fastest": {
            "groq": groq_fastest,
            "gemini": gemini_fastest,
            "ollama": ollama_fastest
        },

        "quality": {
            "groq": groq_quality,
            "gemini": gemini_quality,
            "ollama": ollama_quality
        },

        "cheapest": {
            "groq": groq_cheapest,
            "gemini": gemini_cheapest,
            "ollama": ollama_cheapest
        }
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
            .order_by(PromptTemplate.id.desc())
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

from collections import defaultdict

@app.get("/request-trends")
def request_trends(
    db: Session = Depends(get_db)
):

    chats = db.query(ChatHistory).all()

    grouped = defaultdict(int)

    for chat in chats:

        date = chat.created_at.strftime(
            "%Y-%m-%d"
        )

        grouped[date] += 1

    result = []

    for date, count in grouped.items():

        result.append({
            "date": date,
            "requests": count
        })

    return sorted(
        result,
        key=lambda x: x["date"]
    )

@app.get("/cost-forecast")
def cost_forecast(
    db: Session = Depends(get_db)
):

    total_cost = db.query(
        func.sum(ChatHistory.cost)
    ).scalar() or 0

    total_requests = db.query(
        ChatHistory
    ).count()

    avg_cost_per_request = (
        total_cost / total_requests
        if total_requests > 0
        else 0
    )

    forecast_7 = round(
        avg_cost_per_request * total_requests * 7,
        6
    )

    forecast_30 = round(
        avg_cost_per_request * total_requests * 30,
        6
    )

    forecast_90 = round(
        avg_cost_per_request * total_requests * 90,
        6
    )

    return {
        "forecast_7_days": forecast_7,
        "forecast_30_days": forecast_30,
        "forecast_90_days": forecast_90
    }

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

        alert_message = "🚨 PostgreSQL is DOWN"

        last_alert = (
            db.query(AlertHistory)
            .filter(
                AlertHistory.alert_type == "POSTGRES_DOWN"
            )
            .order_by(AlertHistory.id.desc())
            .first()
        )

        if not last_alert:

            send_slack_alert(alert_message)

            alert = AlertHistory(
                alert_type="POSTGRES_DOWN",
                message=alert_message
            )

            db.add(alert)
            db.commit()

    # Prometheus
    try:
        requests.get(
            "http://localhost:9090/-/healthy",
            timeout=2
        )

    except:
        prometheus = "unhealthy"

        alert_message = "🚨 Prometheus is DOWN"

        last_alert = (
            db.query(AlertHistory)
            .filter(
                AlertHistory.alert_type == "PROMETHEUS_DOWN"
            )
            .order_by(AlertHistory.id.desc())
            .first()
        )

        if not last_alert:

            send_slack_alert(alert_message)

            alert = AlertHistory(
                alert_type="PROMETHEUS_DOWN",
                message=alert_message
            )

            db.add(alert)
            db.commit()

    # Langfuse
    try:
        requests.get(
            "http://localhost:3002",
            timeout=2
        )

    except:
        langfuse = "unhealthy"

        alert_message = "🚨 Langfuse is DOWN"

        last_alert = (
            db.query(AlertHistory)
            .filter(
                AlertHistory.alert_type == "LANGFUSE_DOWN"
            )
            .order_by(AlertHistory.id.desc())
            .first()
        )

        if not last_alert:

            send_slack_alert(alert_message)

            alert = AlertHistory(
                alert_type="LANGFUSE_DOWN",
                message=alert_message
            )

            db.add(alert)
            db.commit()

    # Jaeger
    try:
        requests.get(
            "http://localhost:16686",
            timeout=2
        )

    except:
        jaeger = "unhealthy"

        alert_message = "🚨 Jaeger is DOWN"

        last_alert = (
            db.query(AlertHistory)
            .filter(
                AlertHistory.alert_type == "JAEGER_DOWN"
            )
            .order_by(AlertHistory.id.desc())
            .first()
        )

        if not last_alert:

            send_slack_alert(alert_message)

            alert = AlertHistory(
                alert_type="JAEGER_DOWN",
                message=alert_message
            )

            db.add(alert)
            db.commit()

    # Grafana
    try:
        requests.get(
            "http://localhost:3000/api/health",
            timeout=2
        )

    except:
        grafana = "unhealthy"

        alert_message = "🚨 Grafana is DOWN"

        last_alert = (
            db.query(AlertHistory)
            .filter(
                AlertHistory.alert_type == "GRAFANA_DOWN"
            )
            .order_by(AlertHistory.id.desc())
            .first()
        )

        if not last_alert:

            send_slack_alert(alert_message)

            alert = AlertHistory(
                alert_type="GRAFANA_DOWN",
                message=alert_message
            )

            db.add(alert)
            db.commit()

    return {
        "fastapi": "healthy",
        "postgres": postgres,
        "prometheus": prometheus,
        "langfuse": langfuse,
        "jaeger": jaeger,
        "grafana": grafana
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

@app.get("/quality-drift")
def quality_drift(db: Session = Depends(get_db)):

    chats = (
        db.query(ChatHistory)
        .order_by(ChatHistory.id.desc())
        .limit(50)
        .all()
    )

    if not chats:
        return {
            "drift": "Unknown",
            "avg_latency": 0,
            "avg_response_length": 0,
            "error_rate": 0
        }

    avg_latency = (
        sum(chat.latency for chat in chats)
        / len(chats)
    )

    avg_response_length = (
        sum(
            len(chat.response or "")
            for chat in chats
        )
        / len(chats)
    )

    errors = len(
        [
            c for c in chats
            if c.status == "failed"
        ]
    )

    error_rate = (
        errors / len(chats)
    ) * 100

    print("AVG LATENCY =", avg_latency)
    print("ERROR RATE =", error_rate)

    # -------------------------
    # QUALITY DRIFT DETECTION
    # -------------------------

    if avg_latency > 5 or error_rate > 20:

        drift = "High"

        print("HIGH DRIFT DETECTED")
        print("CALLING EMAIL FUNCTION")

        send_alert_email(
            "QUALITY DRIFT ALERT",
            (
                f"Drift={drift}\n"
                f"Latency={avg_latency:.2f}s\n"
                f"Error Rate={error_rate:.2f}%"
            )
        )

        existing_alert = (
            db.query(AlertHistory)
            .filter(
                AlertHistory.alert_type
                == "QUALITY_DRIFT"
            )
            .order_by(
                AlertHistory.id.desc()
            )
            .first()
        )

        if not existing_alert:

            alert = AlertHistory(
                alert_type="QUALITY_DRIFT",
                message=(
                    f"Quality Drift Detected "
                    f"(Latency={avg_latency:.2f}s, "
                    f"Error Rate={error_rate:.2f}%)"
                )
            )

            db.add(alert)
            db.commit()

    elif avg_latency > 2 or error_rate > 10:

        drift = "Medium"

    else:

        drift = "Low"

    return {
        "drift": drift,
        "avg_latency": round(
            avg_latency,
            2
        ),
        "avg_response_length": round(
            avg_response_length,
            2
        ),
        "error_rate": round(
            error_rate,
            2
        )
    }

@app.get("/recommended-model")
def recommended_model(db: Session = Depends(get_db)):

    models = ["groq", "gemini", "ollama"]

    results = []

    for model in models:

        chats = (
            db.query(ChatHistory)
            .filter(ChatHistory.model == model)
            .all()
        )

        if not chats:
            continue

        avg_latency = sum(c.latency for c in chats) / len(chats)

        total_cost = sum(c.cost for c in chats)

        quality_score = 8

        score = (
            quality_score * 50
            - avg_latency * 10
            - total_cost * 100000
        )

        results.append({
            "model": model,
            "score": round(score, 2),
            "avg_latency": round(avg_latency, 2),
            "cost": round(total_cost, 6)
        })

    if not results:
        return {
            "recommended_model": "No Data"
        }

    best = max(results, key=lambda x: x["score"])

    return {
        "recommended_model": best["model"],
        "score": best["score"],
        "avg_latency": best["avg_latency"],
        "cost": best["cost"]
    }

@app.get("/alerts")
def get_alerts(
    db: Session = Depends(get_db)
):

    alerts = (
        db.query(AlertHistory)
        .order_by(AlertHistory.id.desc())
        .limit(20)
        .all()
    )

    return [
        {
            "type": alert.alert_type,
            "message": alert.message,
            "created_at": alert.created_at
        }
        for alert in alerts
    ]
@app.post("/prompt-template")
def create_prompt_template(
    data: PromptTemplateCreate,
    db: Session = Depends(get_db)
):

    template = PromptTemplate(
        name=data.name,
        version=data.version,
        template=data.template,
        is_active=True
    )

    db.add(template)
    db.commit()
    db.refresh(template)

    return template

@app.get("/prompt-template")
def get_prompt_templates(
    db: Session = Depends(get_db)
):

    templates = (
        db.query(PromptTemplate)
        .order_by(
            PromptTemplate.created_at.desc()
        )
        .all()
    )

    return templates

@app.put("/prompt-template/{template_id}/activate")
def activate_prompt(
    template_id: int,
    db: Session = Depends(get_db)
):

    db.query(PromptTemplate).update(
        {"is_active": False}
    )

    template = (
        db.query(PromptTemplate)
        .filter(
            PromptTemplate.id == template_id
        )
        .first()
    )

    if template:

        template.is_active = True

        db.commit()

    return {
        "message":
        "Template activated"
    }

@app.get("/prompt-analytics")
def prompt_analytics(
    db: Session = Depends(get_db)
):

    chats = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.template_name != None
        )
        .all()
    )

    analytics = {}

    for chat in chats:

        key = (
            chat.template_name,
            chat.template_version,
            chat.model
        )

        if key not in analytics:

            analytics[key] = {
                "requests": 0,
                "cost": 0,
                "latency": 0,
                "tokens": 0
            }

        analytics[key]["requests"] += 1

        analytics[key]["cost"] += (
            chat.cost or 0
        )

        analytics[key]["latency"] += (
            chat.latency or 0
        )

        analytics[key]["tokens"] += (
            chat.total_tokens or 0
        )

    result = []

    for (
        template_name,
        template_version,
        model
    ), values in analytics.items():

        requests_count = values["requests"]

        template = (
            db.query(PromptTemplate)
            .filter(
                PromptTemplate.version
                == template_version
            )
            .first()
        )

        traffic_percentage = 0

        if template:
            traffic_percentage = (
                template.traffic_percentage
            )

        result.append({

            "template_name":
                template_name,

            "template_version":
                template_version,

            "traffic_percentage":
                traffic_percentage,

            "model":
                model,

            "requests":
                requests_count,

            "avg_cost":
                round(
                    values["cost"]
                    / requests_count,
                    6
                ),

            "avg_latency":
                round(
                    values["latency"]
                    / requests_count,
                    2
                ),

            "avg_tokens":
                round(
                    values["tokens"]
                    / requests_count,
                    2
                ),

            "total_cost":
                round(
                    values["cost"],
                    6
                ),

            "total_tokens":
                values["tokens"]
        })

    return sorted(
        result,
        key=lambda x: x["requests"],
        reverse=True
    )

@app.get("/templates")
def get_templates(
    db: Session = Depends(get_db)
):

    templates = (
        db.query(PromptTemplate)
        .all()
    )

    return [
        {
            "name": t.name,
            "version": t.version
        }
        for t in templates
    ]

@app.get("/ab-testing")
def ab_testing(db: Session = Depends(get_db)):

    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.template_name != None)
        .all()
    )

    analytics = {}

    for chat in chats:

        key = (
            chat.template_name,
            chat.template_version
        )

        if key not in analytics:

            analytics[key] = {
                "requests": 0,
                "latency": 0,
                "cost": 0,
                "tokens": 0
            }

        analytics[key]["requests"] += 1
        analytics[key]["latency"] += chat.latency or 0
        analytics[key]["cost"] += chat.cost or 0
        analytics[key]["tokens"] += chat.total_tokens or 0

    result = []

    for (
        template_name,
        template_version
    ), values in analytics.items():

        requests_count = values["requests"]

        result.append({
            "template_name": template_name,
            "template_version": template_version,
            "requests": requests_count,
            "avg_latency": round(
                values["latency"] / requests_count,
                2
            ),
            "avg_cost": round(
                values["cost"] / requests_count,
                6
            ),
            "avg_tokens": round(
                values["tokens"] / requests_count,
                2
            )
        })

    return result