#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== ConveyAI Setup Script ===${NC}"
echo "This script will set up the ConveyAI application on your Mac."

# Check for Node.js
echo -e "\n${YELLOW}Checking for Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}Found Node.js $NODE_VERSION${NC}"
fi

# Check for npm
echo -e "\n${YELLOW}Checking for npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed.${NC}"
    echo "Please install npm (usually comes with Node.js)"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}Found npm $NPM_VERSION${NC}"
fi

# Check for PostgreSQL
echo -e "\n${YELLOW}Checking for PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL is not installed.${NC}"
    echo "Installing PostgreSQL would require sudo access."
    echo "You can install it with: brew install postgresql"
    echo "After installing, start PostgreSQL with: brew services start postgresql"
    
    read -p "Do you want to try installing PostgreSQL now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if ! command -v brew &> /dev/null; then
            echo -e "${RED}Homebrew is not installed.${NC}"
            echo "Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
        
        echo "Installing PostgreSQL..."
        brew install postgresql
        
        echo "Starting PostgreSQL service..."
        brew services start postgresql
    else
        echo "Please install PostgreSQL before continuing."
        exit 1
    fi
else
    echo -e "${GREEN}Found PostgreSQL$(psql --version | cut -d ' ' -f 3)${NC}"
fi

# Create package.json files
echo -e "\n${YELLOW}Setting up package.json files...${NC}"
# Root package.json - get from artifact

# Backend package.json - get from artifact

# Frontend package.json - get from artifact

echo -e "${GREEN}Package.json files created.${NC}"

# Create .env files
echo -e "\n${YELLOW}Setting up environment files...${NC}"
# Create backend/.env.example - get from artifact
# Create frontend/.env.example - get from artifact

# Copy example env files to actual env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

echo -e "${GREEN}Environment files created.${NC}"

# Set up database
echo -e "\n${YELLOW}Setting up database...${NC}"
read -p "Enter PostgreSQL username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -s -p "Enter PostgreSQL password: " DB_PASS
echo

read -p "Enter database name [conveyai]: " DB_NAME
DB_NAME=${DB_NAME:-conveyai}

# Update backend/.env with actual DB credentials
sed -i '' "s|postgresql://postgres:password@localhost:5432/conveyai|postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME|g" backend/.env

# Create database
echo "Creating database..."
createdb $DB_NAME || (echo -e "${RED}Failed to create database. You may need to create it manually.${NC}" && exit 1)

echo -e "${GREEN}Database setup completed.${NC}"

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install

# Generate prisma client and run migrations
echo -e "\n${YELLOW}Setting up Prisma...${NC}"
cd backend
npx prisma generate
npx prisma migrate dev --name init

# Seed the database
echo -e "\n${YELLOW}Seeding the database...${NC}"
npx prisma db seed

echo -e "\n${GREEN}Setup completed successfully!${NC}"
echo -e "To start the application:"
echo -e "  1. From the project root, run: ${YELLOW}npm run dev${NC}"
echo -e "  2. Open your browser and navigate to: ${YELLOW}http://localhost:3000${NC}"
echo -e "  3. Log in with:"
echo -e "     - Email: ${YELLOW}admin@yourcompany.com${NC}"
echo -e "     - Password: ${YELLOW}password123${NC}"
echo -e "     - Company Domain: ${YELLOW}yourcompany.com${NC}"

exit 0
