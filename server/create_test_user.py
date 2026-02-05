#!/usr/bin/env python3
"""create a new test user
<username> <email> <first_name> <last_name> <password>
"""
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from passlib.context import CryptContext
import sys

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def create_user(username, email, first_name, last_name, password):
    """Creates a new test user in the database"""
    db: Session = SessionLocal()
    
    try:
        # Checks if user already exists
        existing_user = db.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        
        if existing_user:
            print(f"Error: User with username '{username}' or email '{email}' already exists!")
            if existing_user.username == username:
                print(f"  Username '{username}' is already taken")
            if existing_user.email == email:
                print(f"  Email '{email}' is already taken")
            return False
        
        # Create new user
        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            hashed_password=bcrypt_context.hash(password)
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"✓ User created successfully!")
        print(f"  - ID: {user.id}")
        print(f"  - Username: {user.username}")
        print(f"  - Email: {user.email}")
        print(f"  - Name: {user.first_name} {user.last_name}")
        print(f"\nYou can now login with:")
        print(f"  Username: {username}")
        print(f"  Password: {password}")
        return True
        
    except Exception as e:
        print(f" Error creating user: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) == 6:
        # Command line arguments
        username, email, first_name, last_name, password = sys.argv[1:6]
        create_user(username, email, first_name, last_name, password)
    else:
        # Interactive mode
        print("Create a New User")
        print("=" * 40)
        username = input("Username: ").strip()
        email = input("Email: ").strip()
        first_name = input("First Name: ").strip()
        last_name = input("Last Name: ").strip()
        password = input("Password: ").strip()
        
        if not all([username, email, first_name, last_name, password]):
            print("Error: All fields are required!")
        else:
            create_user(username, email, first_name, last_name, password)
