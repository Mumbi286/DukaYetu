import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import cart, auth, products


app = FastAPI()

# CORS configuration - supports both local and production
# Get frontend URL from environment variable, default to localhost for development
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Allow both local development and production frontend URLs
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",  # Alternative local port
]

# Add production frontend URL if set (remove trailing slash)
if FRONTEND_URL and FRONTEND_URL != "http://localhost:3000":
    # Remove trailing slash if present
    frontend_url_clean = FRONTEND_URL.rstrip('/')
    if frontend_url_clean not in allowed_origins:
        allowed_origins.append(frontend_url_clean)

# Remove None values and duplicates, filter out empty strings
allowed_origins = list(set([origin for origin in allowed_origins if origin and origin.strip()]))

# Log allowed origins in production for debugging
if os.getenv("ENVIRONMENT") == "production":
    print(f"CORS Allowed Origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(cart.router)
app.include_router(auth.router)
app.include_router(products.router)
