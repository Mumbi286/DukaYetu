#!/usr/bin/env python3
"""
update stock quantities for all products
"""
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product

# Create a DB session
db: Session = SessionLocal()

try:
    # Get all products
    products = db.query(Product).all()
    
    if not products:
        print("No products found in database")
    else:
        print(f"Found {len(products)} products. Updating stock quantities...\n")
        
        # Define stock quantities for each product
        stock_updates = {
            "Laptop": 50,
            "Smartphone": 100,
            "Headphones": 200,
            "Smartwatch": 75,
            "Tablet": 60,
            "Wireless Mouse": 150,
            "Keyboard": 120,
            "Monitor": 80,
            "External HDD": 100,
            "Webcam": 90,
        }
        
        updated_count = 0
        for product in products:
            new_quantity = stock_updates.get(product.name, 50)
            old_quantity = product.stock_quantity or 0
            
            product.stock_quantity = new_quantity
            updated_count += 1
            
            print(f"✓ {product.name}: {old_quantity} → {new_quantity}")
        
        db.commit()
        print(f"\n Successfully updated {updated_count} products!")
        
        # Show summary
        print("\n Current Stock Summary:")
        print("-" * 50)
        total_stock = sum(p.stock_quantity or 0 for p in products)
        for product in products:
            print(f"  {product.name:<20} {product.stock_quantity or 0:>5} units")
        print("-" * 50)
        print(f"  {'TOTAL':<20} {total_stock:>5} units")

except Exception as e:
    print(f"✗ Error updating stock: {e}")
    db.rollback()
finally:
    db.close()
