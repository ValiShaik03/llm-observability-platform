from slack_service import send_slack_alert

print("Starting test...")

send_slack_alert(
    "🚀 Test Alert from LLM Observability Platform"
)

print("Finished test...")