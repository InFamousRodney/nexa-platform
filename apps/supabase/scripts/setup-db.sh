#!/bin/bash

# Load environment variables
source .env

# Set database connection parameters
export PGUSER=postgres
export PGHOST=localhost
export PGDATABASE=postgres

# Run migrations
echo "Running migrations..."
psql -f migrations/20240320000000_create_core_tables.sql

# Seed the database
echo "Seeding database..."
psql -f seed.sql

echo "Database setup complete!" 