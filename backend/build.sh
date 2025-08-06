#!/usr/bin/env bash
# Build script for Render deployment

set -o errexit  # Exit on error

# Install dependencies
pip install -r requirements.txt

# Initialize database and run migrations
python -c "
from app import create_app, db
from app.models import User, Profile

app = create_app()
with app.app_context():
    db.create_all()
    print('Database initialized!')
"

# Seed avatars if needed
python seed_avatars.py