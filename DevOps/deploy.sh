#!/bin/bash
set -e

echo ">>> Pulling latest code..."
cd "$(dirname "$0")/.."
git pull

echo ">>> Building Spring Boot jar..."
cd backend
./gradlew build -x test

echo ">>> Starting Docker containers..."
cd ../DevOps
sudo docker-compose up --build -d

echo ">>> Done! Containers running:"
sudo docker-compose ps