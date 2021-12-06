from flask import Flask
from flask_bcrypt import Bcrypt
from server.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_mail import Mail
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager


app = Flask(__name__, static_folder='build', static_url_path='/')
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
ma = Marshmallow(app)
mail = Mail(app)
jwt = JWTManager(app)


from server.main.routes import main
from server.users.routes import users
from server.admin.routes import admin

app.register_blueprint(main)
app.register_blueprint(users)
app.register_blueprint(admin)
