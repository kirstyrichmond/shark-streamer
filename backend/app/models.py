from datetime import datetime, timezone
from . import db
from sqlalchemy.types import TypeDecorator, TEXT
import json

class JSONEncodedDict(TypeDecorator):
    impl = TEXT

    def process_bind_param(self, value, dialect):
        if value is not None:
            return json.dumps(value)
        return None

    def process_result_value(self, value, dialect):
        if value is not None:
            return json.loads(value)
        return None

watchlist = db.Table('watchlist',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('profile_id', db.Integer, db.ForeignKey('profile.id'), primary_key=True),
    db.Column('movie_id', db.String, primary_key=True),  # TMDb movie ID
    db.Column('created_at', db.DateTime, default=datetime.now(tz=timezone.utc))
)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc))
    subscription_plan = db.Column(db.String(20), default='basic')
    
    profiles = db.relationship('Profile', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.created_at = datetime.now(tz=timezone.utc)

    def __repr__(self):
        return f"<User {self.email}>"

class Profile(db.Model):
    __tablename__ = "profile"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    avatar_url = db.Column(db.String(200))
    is_kids = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc), onupdate=datetime.now(tz=timezone.utc))
    
    watchlist_items = db.relationship(
        'WatchlistItem',
        backref='profile',
        lazy='dynamic',
        cascade='all, delete-orphan'
    )
    
    viewing_history = db.relationship(
        'ViewingHistory',
        backref='profile',
        lazy='dynamic',
        cascade='all, delete-orphan'
    )
    
    def __repr__(self):
        return f"<Profile {self.name}>"

class WatchlistItem(db.Model):
    __tablename__ = "watchlist_item"
    
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    movie_id = db.Column(db.String(20), nullable=False)
    movie_title = db.Column(db.String(200), nullable=False)
    movie_poster = db.Column(db.String(500))
    movie_type = db.Column(db.String(20), default='movie')
    added_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc))
    
    def __repr__(self):
        return f"<WatchlistItem {self.movie_title}>"

class PredefinedAvatar(db.Model):
    __tablename__ = 'predefined_avatars'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='default')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(tz=timezone.utc))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'image_url': self.image_url,
            'category': self.category
        }

class ViewingHistory(db.Model):
    __tablename__ = "viewing_history"
    
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile.id'), nullable=False)
    movie_id = db.Column(db.String(20), nullable=False)
    movie_title = db.Column(db.String(200), nullable=False)
    movie_poster = db.Column(db.String(500))
    movie_type = db.Column(db.String(20), default='movie')
    watched_at = db.Column(db.DateTime, default=datetime.now(tz=timezone.utc))
    progress_percent = db.Column(db.Float, default=0.0)
    
    def __repr__(self):
        return f"<ViewingHistory {self.movie_title}>"