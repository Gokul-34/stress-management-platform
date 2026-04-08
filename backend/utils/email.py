import smtplib
from email.mime.text import MIMEText

EMAIL = "srigokulkrishna123@gmail.com"
PASSWORD = "bnxydpfdxuqzqwtu" # 🔥 app password (not Gmail password)

def send_otp_email(to_email: str, otp: str):
    subject = "Your OTP Code"
    body = f"Your OTP is: {otp}. It will expire in 5 minutes."

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL
    msg["To"] = to_email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, to_email, msg.as_string())
        server.quit()

        print("✅ OTP sent successfully")

    except Exception as e:
        print("❌ Email sending failed:", e)
        raise e