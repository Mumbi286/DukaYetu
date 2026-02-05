from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product, User

# Create a DB session
db: Session = SessionLocal()


products_data = [
    {"name": "Laptop", "price": 1200.50, "description": "High-performance laptop"},
    {"name": "Smartphone", "price": 799.99, "description": "Latest Android phone"},
    {"name": "Headphones", "price": 150.00, "description": "Noise-cancelling headphones"},
    {"name": "Smartwatch", "price": 250.00, "description": "Waterproof smartwatch with heart rate monitor"},
    {"name": "Tablet", "price": 450.00, "description": "10 inch Android tablet"},
    {"name": "Wireless Mouse", "price": 35.00, "description": "Ergonomic wireless mouse"},
    {"name": "Keyboard", "price": 70.00, "description": "Mechanical keyboard with RGB lights"},
    {"name": "Monitor", "price": 300.00, "description": "24 inch full HD monitor"},
    {"name": "External HDD", "price": 90.00, "description": "1TB external hard drive"},
    {"name": "Webcam", "price": 60.00, "description": "1080p HD webcam for streaming"},
]

for item in products_data:
    product = Product(**item)
    db.add(product)


users_data = [
    {"email": "alice@example.com", "username": "alice", "first_name": "Alice", "last_name": "W", "hashed_password": "password123"},
    {"email": "bob@example.com", "username": "bob", "first_name": "Bob", "last_name": "K", "hashed_password": "password456"},
    {"email": "charlie@example.com", "username": "charlie", "first_name": "Charlie", "last_name": "M", "hashed_password": "password789"},
    {"email": "diana@example.com", "username": "diana", "first_name": "Diana", "last_name": "S", "hashed_password": "password101"},
    {"email": "eric@example.com", "username": "eric", "first_name": "Eric", "last_name": "L", "hashed_password": "password202"},
]

for user_item in users_data:
    user = User(**user_item)
    db.add(user)

# Commit to DB
db.commit()
db.close()

print("Seeding complete: 10 products + 5 users added.")
