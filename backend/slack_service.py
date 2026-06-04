import os
import requests
from dotenv import load_dotenv

load_dotenv()

def send_slack_alert(message):

    webhook = os.getenv("SLACK_WEBHOOK_URL")

    print("Webhook =", webhook)

    if not webhook:
        print("Slack webhook missing")
        return

    response = requests.post(
        webhook,
        json={"text": message}
    )

    print("Status Code =", response.status_code)
    print("Response =", response.text)