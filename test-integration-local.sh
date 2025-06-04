#!/bin/bash

# Script para probar los tests de integración localmente
# Simula lo que hace el CI

set -e  # Salir si cualquier comando falla

echo "🧪 Testing Integration Tests Locally"
echo "=================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para cleanup
cleanup() {
  echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
  if [ -f server.pid ]; then
    echo "Stopping Next.js server..."
    kill $(cat server.pid) 2>/dev/null || true
    rm server.pid
  fi
  
  if [ -f server.log ]; then
    echo "Removing server log file..."
    rm server.log
  fi
  
  if [ -f .env.test ]; then
    echo "Removing test environment file..."
    rm .env.test
  fi
}

# Trap para cleanup al salir
trap cleanup EXIT

echo -e "${YELLOW}📋 Step 1: Setup test environment${NC}"
cat > .env.test << EOF
DATABASE_URL="postgresql://postgres:123456@localhost:5432/phrases_db"
NODE_ENV=test
CLOUDINARY_CLOUD_NAME=test
CLOUDINARY_API_KEY=test
CLOUDINARY_API_SECRET=test
EOF
echo "✅ Test environment file created"

echo -e "\n${YELLOW}🔧 Step 2: Verify Docker containers${NC}"
if ! docker ps | grep -q postgres; then
  echo -e "${RED}❌ PostgreSQL container not running${NC}"
  echo "Please run: docker-compose up -d"
  exit 1
fi
echo "✅ PostgreSQL container is running"

echo -e "\n${YELLOW}🏗️ Step 3: Generate Prisma client${NC}"
NODE_ENV=test npx dotenv -e .env.test -- npx prisma generate
echo "✅ Prisma client generated"

echo -e "\n${YELLOW}📊 Step 4: Setup database schema${NC}"
NODE_ENV=test npx dotenv -e .env.test -- npx prisma migrate deploy
echo "✅ Database schema applied"

echo -e "\n${YELLOW}🌱 Step 5: Seed test database${NC}"
NODE_ENV=test npx dotenv -e .env.test -- npx tsx src/scripts/seed-test-db.ts
echo "✅ Test database seeded"

echo -e "\n${YELLOW}🧪 Step 6: Run unit tests${NC}"
# Ejecutar test específico del seed-database que es unitario
if NODE_ENV=test npx dotenv -e .env.test -- npx jest src/app/seed/__tests__/seed-database.test.ts --verbose; then
  echo "✅ Unit tests passed"
else
  echo -e "${YELLOW}⚠️ Unit tests not found or failed, continuing...${NC}"
fi

echo -e "\n${YELLOW}🚀 Step 7: Start Next.js server${NC}"
NODE_ENV=test npx dotenv -e .env.test -- npm run dev:test > server.log 2>&1 &
echo $! > server.pid
echo "✅ Next.js server started in background"

echo -e "\n${YELLOW}⏳ Step 8: Wait for server to be ready${NC}"
for i in {1..30}; do
  if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is ready after $i attempts${NC}"
    break
  fi
  echo "⏳ Attempt $i/30: Server not ready yet, waiting 2 seconds..."
  sleep 2
  if [ $i -eq 30 ]; then
    echo -e "${RED}❌ Server failed to start after 60 seconds${NC}"
    echo "=== Server logs ==="
    cat server.log
    exit 1
  fi
done

echo -e "\n${YELLOW}🔍 Step 9: Verify database connection${NC}"
if curl -f http://localhost:3000/api/test-db >/dev/null 2>&1; then
  echo "✅ Database connection verified"
else
  echo -e "${RED}❌ Database connection test failed${NC}"
  echo "=== Server logs ==="
  cat server.log
  exit 1
fi

echo -e "\n${YELLOW}🧪 Step 10: Run integration tests${NC}"
NODE_ENV=test npx dotenv -e .env.test -- npm run test:integration

echo -e "\n${GREEN}🎉 All integration tests passed successfully!${NC}"
echo -e "${GREEN}Your CI setup should work correctly.${NC}" 