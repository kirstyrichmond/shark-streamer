from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__, static_url_path='/static', static_folder='static')
    CORS(app, 
         origins=['http://localhost:3002', 'http://localhost:3003'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
         supports_credentials=True,
         expose_headers=['Content-Range', 'X-Content-Range'])
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///netflix_clone.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    return app