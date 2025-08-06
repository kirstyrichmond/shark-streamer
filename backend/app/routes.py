from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from .models import User, Profile, WatchlistItem, ViewingHistory, PredefinedAvatar
from . import db
from datetime import datetime, timezone
import json
import os
import uuid
from PIL import Image

api = Blueprint('api', __name__)

import base64
from io import BytesIO

def validate_and_process_image(base64_data):
    """Validate and process base64 image data"""
    try:
        # Remove data:image/jpeg;base64, prefix if present
        if base64_data.startswith('data:image'):
            base64_data = base64_data.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_data)
        
        # Open image to validate
        image = Image.open(BytesIO(image_data))
        
        # Resize image if too large (max 200x200)
        if image.width > 200 or image.height > 200:
            image.thumbnail((200, 200), Image.Resampling.LANCZOS)
        
        # Convert back to base64
        buffer = BytesIO()
        image.save(buffer, format='PNG')
        processed_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{processed_base64}"
        
    except Exception as e:
        raise ValueError(f"Invalid image data: {str(e)}")

@api.route("/auth/register", methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    print(f"Register attempt - Email: {email}")
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error': 'Email already exists'}), 400
        
    try:
        password_hash = generate_password_hash(password, method='pbkdf2:sha256')
        
        new_user = User(
            email=email,
            password=password_hash
        )
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'Registration successful',
            'access_token': f'netflix_token_{new_user.id}',
            'user': {
                'id': new_user.id, 
                'email': new_user.email,
                'subscription_plan': new_user.subscription_plan,
                'profiles': []
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@api.route("/auth/login", methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    print(f"Login attempt - Email: {email}")
    
    user = User.query.filter_by(email=email).first()
    print(f"User found: {user is not None}")
    print(f"User ID: {user.id if user else None}")
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 400
    
    try:
        if check_password_hash(user.password, password):
            profiles = []
            for profile in user.profiles:
                profiles.append({
                    'id': profile.id,
                    'name': profile.name,
                    'avatar_url': profile.avatar_url,
                    'is_kids': profile.is_kids
                })
            
            return jsonify({
                'message': 'Login successful',
                'access_token': f'netflix_token_{user.id}',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'subscription_plan': user.subscription_plan,
                    'profiles': profiles
                }
            }), 200
        else:
            print("Password check failed")
            return jsonify({'error': 'Invalid credentials'}), 400
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api.route("/auth/me", methods=['GET'])
def get_current_user():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No valid token provided'}), 401
        
        token = auth_header.split(' ')[1]
        if not token.startswith('netflix_token_'):
            return jsonify({'error': 'Invalid token format'}), 401
        
        try:
            user_id = int(token.split('_')[-1])
        except ValueError:
            return jsonify({'error': 'Invalid token format'}), 401
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        profiles = []
        for profile in user.profiles:
            profiles.append({
                'id': profile.id,
                'name': profile.name,
                'avatar_url': profile.avatar_url,
                'is_kids': profile.is_kids
            })
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'subscription_plan': user.subscription_plan,
                'profiles': profiles
            }
        }), 200
        
    except Exception as e:
        print(f"Get current user error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route("/auth/logout", methods=['POST'])
def logout():
    try:
        return jsonify({'message': 'Logout successful'}), 200
    except Exception as e:
        print(f"Logout error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@api.route("/profiles", methods=['GET'])
def get_profiles():
    user_id = request.args.get('user_id', type=int)
    try:
        profiles = Profile.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'avatar_url': p.avatar_url,
            'is_kids': p.is_kids,
            'created_at': p.created_at.isoformat() if p.created_at else None
        } for p in profiles])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route("/profiles/<int:profile_id>", methods=['GET'])
def get_profile(profile_id):
    try:
        profile = Profile.query.get(profile_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
            
        return jsonify({
            'id': profile.id,
            'user_id': profile.user_id,
            'name': profile.name,
            'avatar_url': profile.avatar_url,
            'is_kids': profile.is_kids,
            'created_at': profile.created_at.isoformat() if profile.created_at else None,
            'updated_at': profile.updated_at.isoformat() if profile.updated_at else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/profiles', methods=['POST'])
def create_profile():
    try:
        data = request.json
        print("Received data:", data)

        new_profile = Profile(
            user_id=data['user_id'],
            name=data['name'],
            avatar_url=data.get('avatar_url'),
            is_kids=data.get('is_kids', False),
            created_at=datetime.now(tz=timezone.utc),
            updated_at=datetime.now(tz=timezone.utc)
        )
        
        db.session.add(new_profile)
        db.session.commit()
        
        return jsonify({
            "id": new_profile.id,
            "name": new_profile.name,
            "avatar_url": new_profile.avatar_url,
            "is_kids": new_profile.is_kids,
            "user_id": new_profile.user_id,
            "created_at": new_profile.created_at.isoformat() if new_profile.created_at else None,
            "updated_at": new_profile.updated_at.isoformat() if new_profile.updated_at else None,
            "message": "Profile created successfully"
        }), 201
        
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@api.route("/profiles/user/<int:user_id>", methods=['GET'])
def get_user_profiles(user_id):
    try:
        profiles = Profile.query.filter_by(user_id=user_id).all()
        print(f"Profiles for user_id {user_id}: {profiles}")

        return jsonify([{
            'id': p.id,
            'name': p.name,
            'avatar_url': p.avatar_url,
            'is_kids': p.is_kids,
            'created_at': p.created_at.isoformat() if p.created_at else None
        } for p in profiles])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route("/profiles/<int:profile_id>", methods=['DELETE'])
def delete_profile(profile_id):
    try:
        profile = Profile.query.get(profile_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
            
        db.session.delete(profile)
        db.session.commit()
        
        return jsonify({'message': 'Profile deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route("/profiles/<int:profile_id>", methods=['PUT'])
def update_profile(profile_id):
    try:
        profile = Profile.query.get(profile_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404

        data = request.json
        
        for key, value in data.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        
        profile.updated_at = datetime.now(tz=timezone.utc)
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'id': profile.id,
                'user_id': profile.user_id,
                'name': profile.name,
                'avatar_url': profile.avatar_url,
                'is_kids': profile.is_kids
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
@api.route("/watchlist/<int:profile_id>", methods=['GET'])
def get_watchlist(profile_id):
    try:
        profile = Profile.query.get(profile_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
            
        watchlist_items = profile.watchlist_items.all()
        return jsonify([{
            'id': item.id,
            'movie_id': item.movie_id,
            'movie_title': item.movie_title,
            'movie_poster': item.movie_poster,
            'movie_type': item.movie_type,
            'added_at': item.added_at.isoformat() if item.added_at else None
        } for item in watchlist_items])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route("/watchlist/<int:profile_id>/<string:movie_id>", methods=['POST'])
def add_to_watchlist(profile_id, movie_id):
    try:
        profile = Profile.query.get(profile_id)
        
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        existing_item = WatchlistItem.query.filter_by(
            profile_id=profile_id, 
            movie_id=movie_id
        ).first()
        
        if existing_item:
            return jsonify({
                'success': True,
                'message': 'Movie is already in watchlist'
            }), 200
        
        data = request.json
        new_item = WatchlistItem(
            profile_id=profile_id,
            movie_id=movie_id,
            movie_title=data.get('movie_title', ''),
            movie_poster=data.get('movie_poster', ''),
            movie_type=data.get('movie_type', 'movie'),
            added_at=datetime.now(tz=timezone.utc)
        )
        
        db.session.add(new_item)
        db.session.commit()
            
        return jsonify({
            'success': True,
            'message': 'Movie added to watchlist',
            'item': {
                'id': new_item.id,
                'movie_id': new_item.movie_id,
                'movie_title': new_item.movie_title,
                'movie_poster': new_item.movie_poster,
                'movie_type': new_item.movie_type,
                'added_at': new_item.added_at.isoformat()
            }
        }), 200
            
    except Exception as e:
        db.session.rollback()
        print(f"Error adding to watchlist: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api.route("/watchlist/<int:profile_id>/<string:movie_id>", methods=['DELETE'])
def remove_from_watchlist(profile_id, movie_id):
    try:
        item = WatchlistItem.query.filter_by(
            profile_id=profile_id, 
            movie_id=movie_id
        ).first()
        
        if not item:
            return jsonify({'error': 'Item not found in watchlist'}), 404
            
        db.session.delete(item)
        db.session.commit()
            
        return jsonify({
            'success': True,
            'message': 'Movie removed from watchlist'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route("/history/<int:profile_id>", methods=['GET'])
def get_viewing_history(profile_id):
    try:
        profile = Profile.query.get(profile_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
            
        history_items = profile.viewing_history.order_by(
            ViewingHistory.watched_at.desc()
        ).all()
        
        return jsonify([{
            'id': item.id,
            'movie_id': item.movie_id,
            'movie_title': item.movie_title,
            'movie_poster': item.movie_poster,
            'movie_type': item.movie_type,
            'watched_at': item.watched_at.isoformat() if item.watched_at else None,
            'progress_percent': item.progress_percent
        } for item in history_items])
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@api.route("/history/<int:profile_id>", methods=['POST'])
def add_to_history(profile_id):
    try:
        data = request.json
        movie_id = data.get('movie_id')
        
        existing_item = ViewingHistory.query.filter_by(
            profile_id=profile_id, 
            movie_id=movie_id
        ).first()
        
        if existing_item:
            existing_item.watched_at = datetime.now(tz=timezone.utc)
            existing_item.progress_percent = data.get('progress_percent', 0.0)
        else:
            new_item = ViewingHistory(
                profile_id=profile_id,
                movie_id=movie_id,
                movie_title=data.get('movie_title', ''),
                movie_poster=data.get('movie_poster', ''),
                movie_type=data.get('movie_type', 'movie'),
                watched_at=datetime.now(tz=timezone.utc),
                progress_percent=data.get('progress_percent', 0.0)
            )
            db.session.add(new_item)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Added to viewing history'
        }), 200
            
    except Exception as e:
        db.session.rollback()
        print(f"Error adding to history: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api.route("/subscription/<int:user_id>", methods=['PUT'])
def update_subscription(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.json
        new_plan = data.get('subscription_plan')
        
        if new_plan not in ['basic', 'standard', 'premium']:
            return jsonify({'error': 'Invalid subscription plan'}), 400
        
        user.subscription_plan = new_plan
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription plan updated successfully',
            'subscription_plan': user.subscription_plan
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@api.route("/plans", methods=['GET'])
def get_plans():
    """Get all available subscription plans"""
    plans = [
        {
            'id': 'basic',
            'name': 'Basic',
            'description': 'Watch on 1 screen at a time in standard definition',
            'price': '£6.99/month',
            'features': [
                'Unlimited movies and TV shows',
                'Watch on 1 supported device at a time',
                'Standard definition (SD)',
                'Download on 1 supported device'
            ]
        },
        {
            'id': 'standard', 
            'name': 'Standard',
            'description': 'Watch on 2 screens at a time in HD',
            'price': '£10.99/month',
            'features': [
                'Unlimited movies and TV shows',
                'Watch on 2 supported devices at a time',
                'High definition (HD)',
                'Download on 2 supported devices'
            ]
        },
        {
            'id': 'premium',
            'name': 'Premium', 
            'description': 'Watch on 4 screens at a time in Ultra HD',
            'price': '£15.99/month',
            'features': [
                'Unlimited movies and TV shows',
                'Watch on 4 supported devices at a time',
                'Ultra High definition (UHD)',
                'Download on 4 supported devices'
            ]
        }
    ]
    
    return jsonify({
        'success': True,
        'plans': plans
    }), 200

@api.route("/profiles/<int:profile_id>/avatar", methods=['PUT'])
def update_profile_avatar(profile_id):
    """Update profile avatar with base64 image data"""
    try:
        profile = Profile.query.get(profile_id)
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404

        data = request.json
        avatar_data = data.get('avatar_data')
        
        if not avatar_data:
            return jsonify({'error': 'No avatar data provided'}), 400
        
        try:
            if avatar_data.startswith('http://') or avatar_data.startswith('https://'):
                processed_avatar = avatar_data
            else:
                processed_avatar = validate_and_process_image(avatar_data)
            
            profile.avatar_url = processed_avatar
            profile.updated_at = datetime.now(tz=timezone.utc)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Avatar updated successfully',
                'profile': {
                    'id': profile.id,
                    'user_id': profile.user_id,
                    'name': profile.name,
                    'avatar_url': profile.avatar_url,
                    'is_kids': profile.is_kids
                }
            }), 200
            
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route("/avatars", methods=['GET'])
def get_predefined_avatars():
    """Get all predefined avatar options"""
    try:
        category = request.args.get('category', 'default')
        
        avatars = PredefinedAvatar.query.filter_by(
            category=category, 
            is_active=True
        ).all()
        
        return jsonify({
            'success': True,
            'avatars': [avatar.to_dict() for avatar in avatars]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500