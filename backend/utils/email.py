import urllib.request
import json

from backend.core.config import settings

def send_otp_email(to_email: str, otp: str):
    subject = "Your OTP Code"
    body = f"Your OTP is: {otp}. It will expire in 5 minutes."

    payload = {
        "to": to_email,
        "subject": subject,
        "body": body
    }
    
    data = json.dumps(payload).encode('utf-8')
    # Use standard library to avoid needing 'requests'
    req = urllib.request.Request(settings.GAS_URL, data=data, headers={'Content-Type': 'application/json'})

    try:
        with urllib.request.urlopen(req) as response:
            response_text = response.read().decode('utf-8')
            print("✅ OTP sent successfully via Google Apps Script |", response_text)
    except Exception as e:
        import traceback
        traceback.print_exc()
        print("❌ Email sending failed:", e)
        raise e