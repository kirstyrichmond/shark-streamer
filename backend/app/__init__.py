import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__, static_url_path='/static', static_folder='static')
    
    frontend_urls = os.getenv('FRONTEND_URL', '').split(',') if os.getenv('FRONTEND_URL') else []
    allowed_origins = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://localhost:3002', 
        'http://localhost:3003',
        'https://shark-streamer.vercel.app',
        'https://netflix-clone-dm4fykb0z-kirstyrichmonds-projects.vercel.app',
    ] + frontend_urls
    allowed_origins = [origin.strip() for origin in allowed_origins if origin.strip()]
    
    CORS(app, 
         origins=allowed_origins,
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
         supports_credentials=True,
         expose_headers=['Content-Range', 'X-Content-Range'])
    
    database_url = os.getenv('DATABASE_URL', 'sqlite:///netflix_clone.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    return app