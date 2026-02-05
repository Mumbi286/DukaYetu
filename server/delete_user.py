from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

# Creates a DB session
db: Session = SessionLocal()

try:
    # Find the user by email containing "james"
    user = db.query(User).filter(User.email.contains("james")).first()
    
    if user:
        print(f"Deleting user: {user.username} ({user.email})")
        db.delete(user)
        db.commit()
        print("User deleted successfully!")
    else:
        print("User not found")
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
