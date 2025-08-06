import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import PredefinedAvatar

def seed_avatars():
    """Seed database with predefined avatar options"""
    
    default_avatars = [
        {
            'name': 'Red Character',
            'image_url': 'https://i.pinimg.com/736x/91/86/1b/91861b749841221d52122f0c2933d8a6.jpg',
            'category': 'default'
        },
        {
            'name': 'Blue Character',
            'image_url': 'https://i.pinimg.com/736x/54/c6/1c/54c61cf7a35db1d073a60ffe1f8c7e79.jpg',
            'category': 'default'
        },
        {
            'name': 'Green Character',
            'image_url': 'https://i.pinimg.com/736x/7c/48/9d/7c489dfa6cb5724bfe34af136f5d90c6.jpg',
            'category': 'default'
        },
        {
            'name': 'Yellow Character',
            'image_url': 'https://i.pinimg.com/736x/1b/a2/e6/1ba2e6d1d4874546c70c91f1024e17fb.jpg',
            'category': 'default'
        },
        {
            'name': 'Superhero Character',
            'image_url': 'https://i.pinimg.com/1200x/92/b4/e7/92b4e7c57de1b5e1e8c5e883fd915450.jpg',
            'category': 'default'
        },
        {
            'name': 'Penguin Character',
            'image_url': 'https://i.pinimg.com/736x/a4/c6/5f/a4c65f709d4c0cb1b4329c12beb9cd78.jpg',
            'category': 'default'
        }
    ]
    
    kids_avatars = [
        {
            'name': 'Kids Avatar 1',
            'image_url': 'https://i.pinimg.com/736x/fa/3d/56/fa3d56df2cdc7b574617ace75bd54912.jpg',
            'category': 'kids'
        },
        {
            'name': 'Kids Avatar 2', 
            'image_url': 'https://i.pinimg.com/736x/8d/dd/3f/8ddd3fb1a26aebad7270538cc82b8704.jpg',
            'category': 'kids'
        },
        {
            'name': 'Kids Avatar 3',
            'image_url': 'https://i.pinimg.com/736x/fd/9a/5e/fd9a5e6759cbdba7ac8c5106e5c73ee3.jpg',
            'category': 'kids'
        },
        {
            'name': 'Kids Avatar 4',
            'image_url': 'https://i.pinimg.com/736x/e2/58/be/e258be968935767253f55a093195e987.jpg',
            'category': 'kids'
        },
        {
            'name': 'Kids Avatar 5',
            'image_url': 'https://i.pinimg.com/1200x/df/36/f9/df36f98578d5b9406007f2ecdcd66a1c.jpg',
            'category': 'kids'
        },
        {
            'name': 'Kids Avatar 6',
            'image_url': 'https://i.pinimg.com/1200x/c1/72/48/c172489f61a0a4fa21884a43f4708f45.jpg',
            'category': 'kids'
        },
    ]
    
    all_avatars = default_avatars + kids_avatars
    
    try:
        for avatar_data in all_avatars:
            # Check if avatar already exists
            existing = PredefinedAvatar.query.filter_by(name=avatar_data['name']).first()
            if not existing:
                avatar = PredefinedAvatar(
                    name=avatar_data['name'],
                    image_url=avatar_data['image_url'],
                    category=avatar_data['category']
                )
                db.session.add(avatar)
                print(f"Added avatar: {avatar_data['name']}")
            else:
                # Update existing avatar with new URL
                existing.image_url = avatar_data['image_url']
                existing.category = avatar_data['category']
                print(f"Updated avatar: {avatar_data['name']}")
        
        db.session.commit()
        print(f"\n✅ Successfully seeded {len(all_avatars)} predefined avatars!")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error seeding avatars: {str(e)}")
        return False
    
    return True

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        print("🌱 Seeding predefined avatars...")
        
        db.create_all()
        
        success = seed_avatars()
        
        if success:
            print("🎉 Avatar seeding completed successfully!")
        else:
            print("💥 Avatar seeding failed!")
            sys.exit(1)