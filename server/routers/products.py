from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Product, OrderItem
from database import SessionLocal
from typing import List, Optional

# Configuration on the routers
router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

# database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    stock_quantity: Optional[int] = 0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    stock_quantity: Optional[int] = None

class ProductOut(BaseModel):
    id: int
    name: str
    price: float
    description: Optional[str]
    stock_quantity: int
    sold_quantity: Optional[int] = 0  # Total quantity sold

    class Config:
        orm_mode = True


# Get all products
@router.get("/", response_model=List[ProductOut], status_code=status.HTTP_200_OK)
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    
    # Calculate sold quantity for each product
    result = []
    for product in products:
        # Sum up all quantities from order_items for this product
        sold_count = db.query(func.sum(OrderItem.quantity)).filter(
            OrderItem.product_id == product.id
        ).scalar() or 0
        
        product_dict = {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "description": product.description,
            "stock_quantity": product.stock_quantity or 0,
            "sold_quantity": int(sold_count)
        }
        result.append(product_dict)
    
    return result

# Get a single product by ID
@router.get("/{product_id}", response_model=ProductOut, status_code=status.HTTP_200_OK)
def get_product(product_id: int = Path(gt=0), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Calculate sold quantity
    sold_count = db.query(func.sum(OrderItem.quantity)).filter(
        OrderItem.product_id == product_id
    ).scalar() or 0
    
    return {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "stock_quantity": product.stock_quantity or 0,
        "sold_quantity": int(sold_count)
    }

# Create a new product
@router.post("/", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(request: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**request.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    
    # Return with sold_quantity (will be 0 for new products)
    return {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "stock_quantity": product.stock_quantity or 0,
        "sold_quantity": 0
    }

# Update a product
@router.put("/{product_id}", response_model=ProductOut, status_code=status.HTTP_200_OK)
def update_product(
    request: ProductUpdate,
    product_id: int = Path(gt=0),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Update only provided fields
    for key, value in request.dict(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    
    # Calculate sold quantity
    sold_count = db.query(func.sum(OrderItem.quantity)).filter(
        OrderItem.product_id == product_id
    ).scalar() or 0
    
    return {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "stock_quantity": product.stock_quantity or 0,
        "sold_quantity": int(sold_count)
    }

# Delete a product
@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product(product_id: int = Path(gt=0), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted", "product_id": product_id}


# Analytics endpoint - Get sales statistics
@router.get("/analytics/overview", status_code=status.HTTP_200_OK)
def get_sales_analytics(db: Session = Depends(get_db)):
    """Get overall sales analytics across all products"""
    products = db.query(Product).all()
    
    total_products = len(products)
    total_stock = sum(p.stock_quantity or 0 for p in products)
    total_sold = 0
    total_revenue = 0.0
    low_stock_products = []
    
    for product in products:
        # Calculate sold quantity for each product
        sold_count = db.query(func.sum(OrderItem.quantity)).filter(
            OrderItem.product_id == product.id
        ).scalar() or 0
        
        # Calculate revenue (sold quantity * price_at_purchase)
        order_items = db.query(OrderItem).filter(
            OrderItem.product_id == product.id
        ).all()
        
        product_revenue = sum(item.quantity * item.price_at_purchase for item in order_items)
        
        total_sold += int(sold_count)
        total_revenue += product_revenue
        
        # Track low stock products (less than 10 items)
        if (product.stock_quantity or 0) < 10 and (product.stock_quantity or 0) > 0:
            low_stock_products.append({
                "id": product.id,
                "name": product.name,
                "stock_quantity": product.stock_quantity
            })
    
    return {
        "total_products": total_products,
        "total_stock_remaining": total_stock,
        "total_goods_sold": total_sold,
        "total_revenue": round(total_revenue, 2),
        "low_stock_count": len(low_stock_products),
        "low_stock_products": low_stock_products
    }
