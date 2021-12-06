from flask import Blueprint
from flask import send_from_directory
from server import app
import os


main = Blueprint("main", __name__)


@main.route('/', defaults={'path': ''})
@main.route('/<path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
