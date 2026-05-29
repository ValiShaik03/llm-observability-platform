from fastapi import FastAPI
from groq import Groq
from dotenv import load_dotenv
from prometheus_fastapi_instrumentator import Instrumentator
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry import trace
from database import engine
from models import Base
from langfuse import Langfuse
from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
from models import ChatHistory
from fastapi.middleware.cors import CORSMiddleware

import os

# Load environment variables
load_dotenv()

Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------
# LANGFUSE SETUP
# -----------------------------

langfuse = Langfuse(
    secret_key=os.getenv("LANGFUSE_SECRET_KEY"),
    public_key=os.getenv("LANGFUSE_PUBLIC_KEY"),
    host=os.getenv("LANGFUSE_HOST")
)

# -----------------------------
# OPENTELEMETRY + JAEGER SETUP
# -----------------------------

trace.set_tracer_provider(TracerProvider())

tracer_provider = trace.get_tracer_provider()

otlp_exporter = OTLPSpanExporter(
    endpoint="http://localhost:4318/v1/traces"
)

span_processor = BatchSpanProcessor(otlp_exporter)

tracer_provider.add_span_processor(span_processor)

tracer = trace.get_tracer(__name__)

# -----------------------------
# PROMETHEUS METRICS
# -----------------------------

Instrumentator().instrument(app).expose(app)

# -----------------------------
# GROQ CLIENT
# -----------------------------

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# -----------------------------
# HOME ENDPOINT
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "LLM Observability Platform Running"
    }

# -----------------------------
# CHAT ENDPOINT
# -----------------------------

@app.get("/chat")
def chat(prompt: str, db: Session = Depends(get_db)):


    with tracer.start_as_current_span("llm_request"):

        # Langfuse Trace
        trace_obj = langfuse.trace(
            name="llm_request"
        )

        # Langfuse Generation
        generation = trace_obj.generation(
            name="groq-response",
            model="llama-3.3-70b-versatile",
            input=prompt
        )

        # Groq API Call
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extract response text
        response_text = response.choices[0].message.content
        # SAVE INTO POSTGRESQL
        chat_record = ChatHistory(
            prompt=prompt,
            response=response_text,
            model="llama-3.3-70b-versatile",
            latency=0.0
        )

        db.add(chat_record)

        db.commit()

        db.refresh(chat_record)
        # End Langfuse generation
        generation.end(
            output=response_text
        )

        # Return API response
        return {
            "prompt": prompt,
            "response": response_text
        }

