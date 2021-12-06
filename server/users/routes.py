from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, create_refresh_token, get_jwt
from flask import jsonify, Blueprint, request
from server.schemas import user_schema, categories_schema, card_schema, cards_schema
from server.models import User, Category, Card, Withdrawal
from server import db, bcrypt
from server.utils import send_email, send_verification_email, send_reset_email
import os

users = Blueprint("users", __name__)

@users.route("/register-user", methods=['GET', 'POST'])
def register():
    email = request.json['email']
    if User.query.filter_by(email=email.lower()).first():
        return {"email": "Email already taken"}
    firstname = request.json['firstname']
    lastname = request.json['lastname']
    password = request.json['password']
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email, firstname=firstname, lastname=lastname, password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    send_email(user)
    return {"response": f"An email verification has been sent to {user.email}, "
                        f"please click on the link in the email to verify your account"}, 200


@users.route("/login-user", methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    user = User.query.filter_by(email=email.lower()).first()
    if user and not user.admin and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.email)
        refresh_token = create_refresh_token(identity=user.email)
        return jsonify(access_token=access_token, refresh_token=refresh_token)
    return jsonify({'error': 'Invalid password or email'}), 401


@users.route('/token_refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    print("new token generated")
    return jsonify(access_token=access_token), 200


@users.route("/email_verify/<token>", methods=['GET', 'POST'])
def verify_email(token):
    s = Serializer(os.environ.get("SECRET_KEY"))
    try:
        user_id = s.loads(token)['user_id']
    except:
        return {"error": f"Expired or invalid link"}, 400
    user = User.query.get(user_id)
    user.email_verified = True
    db.session.commit()
    return {"response": f"Your email has been verified!"}, 200


@users.route("/resetPassword", methods=['POST'])
def password_reset_token():
    email = request.json['email']
    user = User.query.filter_by(email=email).first()
    if user:
        send_reset_email(user)
        return jsonify({'msg': "Instructions to reset your password has been sent to your email."}), 200
    return jsonify({"msg": "email does not exist in our database"}), 400


@users.route("/verify_token/<token>", methods=['GET'])
def verify_token(token):
    s = Serializer(os.environ.get("SECRET_KEY"))
    try:
        user_id = s.loads(token)['user_id']
        return jsonify({"msg": "Token verified!"}), 200
    except:
        return {"error": f"Expired or invalid link"}, 400


@users.route("/resetPassword/<token>", methods=['POST'])
def reset_password(token):
    s = Serializer(os.environ.get("SECRET_KEY"))
    try:
        user_id = s.loads(token)['user_id']
    except:
        return {"error": f"Expired or invalid link"}, 400
    password = request.json['password']
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User.query.get(user_id)
    user.password = hashed_pw
    db.session.commit()
    return jsonify({'msg': 'Password reset successfully, you can now login.'}), 200


@users.route("/profile")
@jwt_required()
def profile():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    return user_schema.jsonify(user), 200


@users.route("/profile", methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401

    bank_name = request.json['bank_name']
    account_no = request.json['bank_account_no']
    password = request.json['password']
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        user.bank_name = bank_name
        user.bank_account_no = account_no
        db.session.commit()
        return user_schema.jsonify(user), 200
    if user and not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect Password"}), 400
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@users.route("/profile_image", methods=['POST'])
@jwt_required()
def profile_image():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401

    image = request.json['image']
    user = User.query.filter_by(email=email).first()
    if user:
        if len(image) > 0:
            user.profile_pic = image
        db.session.commit()
        return user_schema.jsonify(user), 200
    return jsonify({"error": "BAD REQUEST"}), 400


@users.route("/category", methods=['GET'])
@jwt_required()
def get_categories():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    if user:
        categories = Category.query.all()
        return categories_schema.jsonify(categories), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@users.route("/card/<category_id>", methods=['POST'])
@jwt_required()
def add_card(category_id):
    email = get_jwt_identity()
    image = request.json['image']
    note = request.json['notes']
    amount = int(request.json['amount'])
    rate = request.json['rate']
    user = User.query.filter_by(email=email).first()
    if user:
        card = Card(image_file=image, at_rate=rate, amount=amount,  note=note,
                    category_id=category_id, user_id=user.id)

        db.session.add(card)
        db.session.commit()

        return card_schema.jsonify(card), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@users.route("/card", methods=['GET'])
@jwt_required()
def get_cards():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    if user:
        cards = Card.query.filter_by(user_id=user.id).all()
        return cards_schema.jsonify(cards), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@users.route("/request_withdrawal", methods=['GET'])
@jwt_required()
def request_withdrawal():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    if user:
        code = send_verification_email(user)
        user.verification_code = code
        db.session.commit()
        return jsonify({"msg": "A code was sent to your email, please enter the code to confirm withdrawal"}), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@users.route("/request_withdrawal", methods=['POST'])
@jwt_required()
def verify_withdrawal():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    code = request.json['code']
    amount = request.json['amount']
    user = User.query.filter_by(email=email).first()
    if user and user.verification_code == code:
        user.balance -= int(amount)
        user.verification_code = ""
        withdrawal = Withdrawal(amount=amount, user_id=user.id)
        db.session.add(withdrawal)
        db.session.commit()
        return user_schema.jsonify(user), 200
    return jsonify({"error": "Invalid Code"}), 400



