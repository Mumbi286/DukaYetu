#!/usr/bin/env python3
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

# Create a DB session
db: Session = SessionLocal()

try:
    # Find all users to delete
    users_to_delete = []
    
    # Find user with 'james' in email
    james_users = db.query(User).filter(User.email.contains("james")).all()
    users_to_delete.extend(james_users)
    
    # Find user with username 'string'
    string_users = db.query(User).filter(User.username == "string").all()
    users_to_delete.extend(string_users)
    
    # Remove duplicates
    users_to_delete = list(set(users_to_delete))
    
    if not users_to_delete:
        print("No users found to delete")
    else:
        print(f"Found {len(users_to_delete)} user(s) to delete:")
        for user in users_to_delete:
            print(f"  - ID {user.id}: {user.username} ({user.email})")
        
        # Delete each user
        for user in users_to_delete:
            db.delete(user)
            print(f" Deleted user: {user.username} ({user.email})")
        
        db.commit()
        print(f"\n Successfully deleted {len(users_to_delete)} user(s)!")
        
        # Show remaining users
        remaining = db.query(User).all()
        print(f"\nRemaining users in database: {len(remaining)}")
        for user in remaining:
            print(f"  - ID {user.id}: {user.username} ({user.email})")

except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
