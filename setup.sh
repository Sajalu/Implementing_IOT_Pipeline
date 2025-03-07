#!/bin/bash

# Setup script for IoT Backend Server
# Run with: `bash setup.sh`

set -e  # Stop on errors

echo "🔹 Updating System Packages..."
sudo apt update && sudo apt upgrade -y

echo "🔹 Installing Required Packages..."
sudo apt install -y nodejs npm postgresql postgresql-contrib

echo "🔹 Setting Up PostgreSQL Database..."

# Create PostgreSQL user & database (modify as needed)
DB_USER="iot_user"
DB_PASSWORD="p123_g-IoT"
DB_NAME="iot_database"

sudo -u postgres psql <<EOF
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo "✅ PostgreSQL database and user created!"

echo "🔹 Creating Tables..."

# Create tables
sudo -u postgres psql -d $DB_NAME <<EOF
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) UNIQUE NOT NULL,
    api_key TEXT NOT NULL
);

CREATE TABLE sensor_data (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(255) REFERENCES devices(device_id),
    door_status BOOLEAN,
    temperature FLOAT,
    humidity FLOAT,
    timestamp TIMESTAMP DEFAULT NOW()
);
EOF

echo "✅ Database tables created!"

echo "🔹 Installing Node.js Dependencies..."
npm install

echo "🔹 Configuring Environment Variables..."

JWT_SECRET=$(openssl rand -base64 32) 
# Create .env file 
cat <<EOF > 
.env PORT=3000 
DB_USER=$DB_USER 
DB_PASSWORD=$DB_PASSWORD 
DB_NAME=$DB_NAME 
DB_HOST=localhost 
DB_PORT=5432 
JWT_SECRET=$JWT_SECRET 
EOF

echo "✅ Environment variables configured!"

echo "🔹 Starting the Server..."
node server.js &

echo "🚀 Server is running on port 3000!"
