# 🚀 LLM Observability Platform

<p align="center">

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![Grafana](https://img.shields.io/badge/Grafana-Dashboard-F46800?style=for-the-badge&logo=grafana)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge&logo=prometheus)
![Jaeger](https://img.shields.io/badge/Jaeger-Tracing-66CFE3?style=for-the-badge)

</p>

---

# 📌 Overview

The **LLM Observability Platform** is a full-stack monitoring and analytics platform designed to observe, benchmark, and analyze Large Language Model (LLM) applications.

It provides real-time visibility into:

- LLM latency
- Token usage
- API cost
- Response quality
- Error rates
- User interactions
- Model benchmarking
- Distributed tracing
- Performance dashboards
- Alerting

The platform supports multiple LLM providers including **Groq**, **Google Gemini**, and **Ollama**.

---

# ✨ Features

## 🤖 Multi-LLM Support

- Groq
- Google Gemini
- Ollama

---

## 📊 Monitoring

- Request Latency
- Prompt Tokens
- Completion Tokens
- Total Tokens
- Response Time
- Error Rate
- Success Rate
- API Cost Tracking

---

## 📈 Dashboards

- Grafana Dashboard
- Prometheus Metrics
- Live Analytics
- Benchmark Dashboard
- Cost Dashboard

---

## 🔍 Observability

- OpenTelemetry Integration
- Distributed Tracing
- Jaeger Trace Visualization
- Langfuse Integration

---

## 📧 Alerts

- Email Alerts
- Slack Notifications
- High Latency Alerts
- Error Rate Alerts

---

## 📚 Prompt Management

- Prompt Registry
- Prompt Templates
- Prompt Versioning

---

## 🧪 Benchmarking

- Multi-model Comparison
- Latency Comparison
- Cost Comparison
- Token Comparison

---

## 👤 User Features

- Login
- Chat History
- Alert History
- Benchmark History

---

# 🏗️ Architecture

```
                   +------------------------+
                   |      React Frontend    |
                   +-----------+------------+
                               |
                               |
                               ▼
                     +-------------------+
                     |   FastAPI Backend |
                     +-------------------+
                      |        |        |
                      |        |        |
          +-----------+        |        +------------+
          |                    |                     |
          ▼                    ▼                     ▼
   PostgreSQL          OpenTelemetry          Langfuse
          |                    |
          |                    |
          ▼                    ▼
   Prometheus -------------> Jaeger
          |
          ▼
      Grafana
```

---

# 🛠️ Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- APScheduler
- OpenTelemetry
- Langfuse
- Prometheus Client
- PostgreSQL

## Frontend

- React
- Axios
- Recharts

## Database

- PostgreSQL

## Monitoring

- Prometheus
- Grafana
- Jaeger

## AI Models

- Groq
- Gemini
- Ollama

## DevOps

- Docker
- Docker Compose
- Docker Hub

---

# 📂 Project Structure

```
llm-observability-platform
│
├── backend
│   ├── services
│   ├── utils
│   ├── otel_sdk
│   ├── Dockerfile
│   └── main.py
│
├── frontend
│   ├── src
│   ├── public
│   └── Dockerfile
│
├── prometheus
│
├── docker-compose.yml
│
├── .env.example
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a file named:

```
.env
```

using

```
.env.example
```

Fill in your own credentials:

```
GROQ_API_KEY=

GEMINI_API_KEY=

DATABASE_URL=postgresql://admin:admin@postgres:5432/llm_observability

LANGFUSE_PUBLIC_KEY=

LANGFUSE_SECRET_KEY=

LANGFUSE_HOST=http://host.docker.internal:3002

SLACK_WEBHOOK_URL=

EMAIL_FROM=

EMAIL_PASSWORD=

EMAIL_TO=
```

---

# 🐳 Docker Images

## Backend

```
shaikvali03/llm-observability-backend
```

## Frontend

```
shaikvali03/llm-observability-frontend
```

---

# 🚀 Quick Start

## Clone Repository

```bash
git clone https://github.com/ValiShaik03/llm-observability-platform.git

cd llm-observability-platform
```

---

## Create Environment File

### Windows

```bash
copy .env.example .env
```

### Linux/macOS

```bash
cp .env.example .env
```

Fill your API keys.

---

## Start Application

```bash
docker compose up -d
```

---

## Stop Application

```bash
docker compose down
```

---

## Restart

```bash
docker compose restart
```

---

# 🌐 Application URLs

| Service | URL |
|----------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Jaeger | http://localhost:16686 |

---

# 📷 Screenshots

## Dashboard

```
screenshots/dashboard.png
```

---

## Cost Analytics

```
screenshots/cost.png
```

---

## Benchmark Analytics

```
screenshots/benchmark.png
```

---

## Grafana

```
screenshots/grafana.png
```

---

## Prometheus

```
screenshots/prometheus.png
```

---

## Jaeger

```
screenshots/jaeger.png
```

---

# 📊 Metrics Collected

- Prompt Tokens
- Completion Tokens
- Total Tokens
- API Cost
- Response Time
- Latency
- Requests
- Errors
- Success Rate

---

# 📌 API Endpoints

Examples:

```
POST /chat

POST /benchmark

GET /metrics

GET /health

GET /docs
```

---

# 🔒 Security

- Environment variables managed through `.env`
- Secrets excluded from Git
- Docker-based isolated deployment

---

# 🔮 Future Enhancements

- Kubernetes Deployment
- Authentication & Authorization
- CI/CD using GitHub Actions
- Redis Caching
- Rate Limiting
- Multi-user Dashboard
- Role-Based Access Control (RBAC)
- Cloud Deployment (AWS/Azure/GCP)

---

# 👨‍💻 Author

**Shaik Mahaboob Vali**

GitHub:

https://github.com/ValiShaik03

Docker Hub:

https://hub.docker.com/u/shaikvali03

LinkedIn:

(Add your LinkedIn profile here)

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the repository

📢 Share it with others

---

# 📄 License

This project is licensed under the **MIT License**.
