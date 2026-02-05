#!/usr/bin/env python3
"""
check if database tables exist
"""
from database import engine
from sqlalchemy import inspect, text

# Get inspector to examine the database
inspector = inspect(engine)

# Get all table names
tables = inspector.get_table_names()

print("=" * 60)
print("DATABASE TABLES CHECK")
print("=" * 60)
print(f"\nTotal tables found: {len(tables)}\n")

expected_tables = ['users', 'products', 'carts', 'cart_items', 'orders', 'order_items']

for table in sorted(tables):
    if table == 'alembic_version':
        # Check alembic version
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version_num FROM alembic_version"))
            version = result.fetchone()
            print(f" {table:<20} (Alembic version: {version[0] if version else 'None'})")
    else:
        # Get column info for each table
        columns = inspector.get_columns(table)
        print(f" {table:<20} ({len(columns)} columns)")

print("\n" + "=" * 60)
print("EXPECTED TABLES STATUS")
print("=" * 60)

missing_tables = []
for table in expected_tables:
    if table in tables:
        print(f" {table} - EXISTS")
    else:
        print(f"{table} - MISSING")
        missing_tables.append(table)

if missing_tables:
    print(f"\n WARNING: {len(missing_tables)} table(s) are missing!")
else:
    print("\n All expected tables exist!")

print("\n" + "=" * 60)
print("\nTo view table structure, use:")
print("  sqlite3 shopapp.db \".schema <table_name>\"")
print("\nTo view all data in a table, use:")
print("  sqlite3 shopapp.db \"SELECT * FROM <table_name>;\"")
print("=" * 60)
