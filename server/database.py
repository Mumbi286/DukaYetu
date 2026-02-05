import os
from sqlalchemy import create_engine 
from sqlalchemy.orm import sessionmaker, declarative_base

# Database URL - supports both SQLite (local) and PostgreSQL (production)
# Uses DATABASE_URL environment variable if set, otherwise defaults to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./shopapp.db")

# Render provides postgres:// but SQLAlchemy needs postgresql://
# Convert postgres:// to postgresql:// for compatibility
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# For PostgreSQL on Render, the URL format is: postgresql://user:pass@host:port/dbname
# SQLite URL format is: sqlite:///./shopapp.db

# The Engine: The entry point to the database.
if DATABASE_URL.startswith("postgresql"):
    # PostgreSQL - no special connect_args needed
    engine = create_engine(DATABASE_URL)
else:
    # SQLite - specific connect_args for local development
    engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})

# The Session Factory: A class used to create a new "Session" for each request.

# - autocommit=False: Transactions must be manually committed.
# - autoflush=False: Changes won't be sent to the DB until you explicitly call flush or commit.
# - bind=engine: Links this session maker to the specific database engine above.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# The Base Class: All database models (tables) will inherit from this class.
# This maps your Python classes to actual database tables.
Base = declarative_base()
