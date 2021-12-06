from flask import Blueprint, jsonify, request
from server import bcrypt, db
from flask_jwt_extended import get_jwt_identity, jwt_required, create_access_token, create_refresh_token
from server.models import User, Category, Card, Withdrawal
from server.schemas import users_schema, admin_schema, categories_schema, cards_schema, withdrawals_schema
admin = Blueprint("admin", __name__)


"""Admin Queries Endpoints"""


@admin.route("/admin", methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    user = User.query.filter_by(email=email).first()
    if user and user.admin and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.email)
        refresh_token = create_refresh_token(identity=user.email)
        return jsonify(access_token=access_token, refresh_token=refresh_token)
    return jsonify({'error': 'Invalid password or email'}), 401


@admin.route("/admin", methods=['GET'])
@jwt_required()
def profile():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    if user.admin:
        return admin_schema.jsonify(user), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


"""Website Users Queries Endpoints for Admin"""
@admin.route("/admin/user", methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    if user and user.admin:
        users = User.query.all()
        return users_schema.jsonify(users), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403



@admin.route("/admin/card", methods=['GET'])
@jwt_required()
def get_all_cards():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    if user and user.admin:
        cards = Card.query.all()
        return cards_schema.jsonify(cards), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@admin.route("/admin/card/<id>", methods=['PUT'])
@jwt_required()
def edit_card(id):
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    action = request.json['action']
    # amount_to_add = request.json['amount']
    if user and user.admin:
        card = Card.query.get(id)
        customer = User.query.get(card.user_id)
        if action == "Approved":
            customer.balance += card.amount*card.at_rate
            card.status = "Approved"
            db.session.commit()
            # Send Approval Email to Customer
            return jsonify({'msg': 'Card Approved Successfully.'}), 200
        elif action == "Failed":
            card.status = "Failed"
            db.session.commit()
            # Send Failure Email to Customer
            return jsonify({'msg': 'Card Failed Successfully.'}), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


# Category Endpoint
@admin.route("/admin/category", methods=['GET'])
@jwt_required()
def get_categories():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    if user and user.admin:
        categories = Category.query.all()
        return categories_schema.jsonify(categories), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@admin.route("/admin/category", methods=['POST'])
@jwt_required()
def add_category():
    email = get_jwt_identity()
    issuer = request.json['issuer']
    currency = request.json['currency']
    card_type = request.json['cardType']
    rate = request.json['rate']
    user = User.query.filter_by(email=email).first()
    if user and user.admin:
        cat = Category.query.filter_by(issuer=issuer).filter_by(currency=currency).filter_by(card_type=card_type).first()
        if cat:
            return jsonify({"error": "Category already exist"}), 400
        category = Category( issuer=issuer, currency=currency, card_type=card_type, rate=rate)

        db.session.add(category)
        db.session.commit()
        categories = Category.query.all()
        return categories_schema.jsonify(categories), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@admin.route("/admin/category/<id>", methods=['PUT'])
@jwt_required()
def edit_category(id):
    email = get_jwt_identity()
    issuer = request.json['issuer']
    currency = request.json['currency']
    card_type = request.json['card_type']
    rate = request.json['rate']
    user = User.query.filter_by(email=email).first()
    if user and user.admin:
        category = Category.query.get(id)
        category.issuer = issuer
        category.currency = currency
        category.card_type = card_type
        category.rate = rate
        db.session.commit()
        return jsonify({"msg": "Category Edited"}), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@admin.route("/admin/category/<id>", methods=['DELETE'])
@jwt_required()
def delete_category(id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    if user and user.admin:
        category = Category.query.get(id)
        db.session.delete(category)
        db.session.commit()
        return jsonify({"msg": "Deleted Successfully"}), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@admin.route("/admin/withdrawal", methods=['GET'])
@jwt_required()
def get_withdrawals():
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    if user and user.admin:
        withdrawals = Withdrawal.query.all()
        return withdrawals_schema.jsonify(withdrawals)
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403


@admin.route("/admin/withdrawal/<id>", methods=['PUT'])
@jwt_required()
def edit_withdrawal(id):
    try:
        email = get_jwt_identity()
    except:
        return {"error": "You're not authorized to visit this page."}, 401
    user = User.query.filter_by(email=email).first()
    action = request.json['action']
    # amount_to_add = request.json['amount']
    if user and user.admin:
        withdrawal = Withdrawal.query.get(id)
        customer = User.query.get(withdrawal.user_id)
        if action == "Approved":
            withdrawal.status = action
            db.session.commit()
            # Send Approval Email to Customer
            return jsonify({'msg': 'Withdrawal Approved'}), 200
        elif action == "Declined":
            customer.balance += int(withdrawal.amount)
            withdrawal.status = action
            db.session.commit()
            # Send Decline Email to Customer
            return jsonify({'msg': 'Withdrawal Declined.'}), 200
    return jsonify({"error": "FORBIDDEN OPERATION"}), 403
