from flask_mail import Message
from random import randint
from server import mail

def send_email(user):
    token = user.get_token()
    msg = Message('Email Verification', sender='noreply@demo.com', recipients=[user.email])
    msg.body = f"""Hi {user.firstname}!
     Please Verify your email by clicking on the link below. 
    http://127.0.0.1:3000/verify?token={token}
"""
    mail.send(msg)


def send_reset_email(user):
    token = user.get_token()
    msg = Message('Password Reset Request', sender='noreply@demo.com', recipients=[user.email])
    msg.body = f"""Hi {user.firstname}!
     Please click on the link below to reset your password.
    http://127.0.0.1:3000/reset_password?token={token}
    
    If you did not make this request, ignore this email and nothing will be changed.
"""
    mail.send(msg)


def send_verification_email(user):
    code = randint(100000, 999999)
    msg = Message('Withdrawal Verification', sender='noreply@demo.com', recipients=[user.email])
    msg.body = f"""Hi {user.firstname}!
        Here is your verification code for your withdrawal request:
        
        {code}
        
        Thank you for choosing Vaito.
    """
    mail.send(msg)
    return code
