import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

EMAIL = "mvali060103@gmail.com"
PASSWORD = "gaxg kfbu jmuv iduo"


def send_alert_email(subject, message):

    msg = MIMEText(message)

    msg["Subject"] = subject
    msg["From"] = EMAIL
    msg["To"] = EMAIL

    try:

        server = smtplib.SMTP(
            SMTP_SERVER,
            SMTP_PORT
        )

        server.starttls()

        server.login(
            EMAIL,
            PASSWORD
        )

        server.send_message(msg)

        server.quit()

        print("EMAIL SENT")

    except Exception as e:

        print(
            "EMAIL FAILED:",
            str(e)
        )