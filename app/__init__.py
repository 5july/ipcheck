from flask import Flask
def create_app(config_class=None):
    app = Flask(__name__)
    app.config.from_object(config_class)

    return app

app = create_app()
from app import routes

