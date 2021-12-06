from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from server import db
from datetime import datetime
import os


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    firstname = db.Column(db.String(20), nullable=False)
    lastname = db.Column(db.String(20), nullable=False)
    profile_pic = db.Column(db.String(1000), nullable=False, default='https://res.cloudinary.com/wizzle3d/imag'
                                                                     'e/upload/v1637699597/vaito/default_ni4q8g.jpg')
    password = db.Column(db.String(60), nullable=False)
    email_verified = db.Column(db.Boolean, default=False, nullable=False)
    balance = db.Column(db.Float, default=0.00, nullable=False)
    admin = db.Column(db.Boolean, default=False, nullable=False)
    cards = db.relationship('Card', backref='author', lazy=True)
    withdrawals = db.relationship('Withdrawal', backref='user', lazy=True)
    bank_name = db.Column(db.String(100))
    bank_account_no = db.Column(db.String(20))
    verification_code = db.Column(db.String(10))

    def get_token(self, expires_sec=1800):
        s = Serializer(os.environ.get("SECRET_KEY"), expires_sec)
        return s.dumps({'user_id': self.id}).decode('utf-8')

    @staticmethod
    def verify_token(token):
        s = Serializer(os.environ.get("SECRET_KEY"))
        try:
            user_id = s.loads(token)['user_id']
        except:
            return None
        return User.query.get(user_id)

    def __repr__(self):
        return f"User({self.email}, {self.firstname}, {self.lastname}, {self.profile_pic}, {self.balance}, {self.admin})"


class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    at_rate = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    image_file = db.Column(db.String(1000), nullable=False)
    note = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'),
                            nullable=False)
    status = db.Column(db.String(30), default="Pending")

    def __repr__(self):
        return f"Card({self.image_file}, {self.date_posted}, {self.category})"


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rate = db.Column(db.Integer, nullable=False)
    currency = db.Column(db.String(50), nullable=False)
    issuer = db.Column(db.String(50), nullable=False)
    card_type = db.Column(db.String(50), nullable=False)
    cards = db.relationship('Card', backref='category', lazy=True)

    def __repr__(self):
        return f"Category( {self.currency}, {self.issuer}, {self.card_type}, {self.rate})"


class Withdrawal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.String(30), default="Pending")
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Withdrawal({self.amount}, {self.date_posted}, {self.user_id})"
