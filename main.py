from fastapi import FastAPI
from groq import Groq
from dotenv import load_dotenv
from prometheus_fastapi_instrumentator import Instrumentator
from telemetry import tracer

import os

load_dotenv()

app = FastAPI()

# Prometheus Metrics
Instrumentator().instrument(app).expose(app)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

@app.get("/")
def home():
    return {
        "message": "LLM Observability Platform Running"
    }

@app.get("/chat")
def chat(prompt: str):

    with tracer.start_as_current_span("llm_request"):

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return {
            "prompt": prompt,
            "response": response.choices[0].message.content
        }