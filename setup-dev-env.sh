#!/bin/bash

# Script para configurar entorno de desarrollo

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Configurando entorno de desarrollo...${NC}"

# Agregar validación de Docker
if ! docker ps >/dev/null 2>&1; then
  echo -e "${RED}Error: Docker no está corriendo${NC}"
  exit 1
fi

# Backup de datos existentes
if [ -f .env.local ]; then
  cp .env.local .env.local.backup
fi

# Verificar Node.js version
if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js no está instalado${NC}"
  exit 1
fi

# 1. Verificar que .env.local existe
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}Creando archivo .env.local...${NC}"
  echo 'DATABASE_URL="postgresql://postgres:123456@localhost:5432/phrases_db"' > .env.local
  echo -e "${GREEN}Archivo .env.local creado${NC}"
else
  echo -e "${GREEN}Archivo .env.local ya existe${NC}"
fi

# 2. Generar el cliente de Prisma
echo -e "${YELLOW}Generando cliente de Prisma...${NC}"
NODE_ENV=development npx prisma generate
echo -e "${GREEN}Cliente de Prisma generado${NC}"

# 3. Ejecutar migraciones de desarrollo
echo -e "${YELLOW}Ejecutando migraciones...${NC}"
NODE_ENV=development npx prisma migrate dev --name phrases_table
echo -e "${GREEN}Migraciones completadas${NC}"

# 4. Poblar la base de datos
echo -e "${YELLOW}Poblando la base de datos...${NC}"
npm run populate-dev
echo -e "${GREEN}Base de datos poblada${NC}"

echo -e "${GREEN}¡Entorno de desarrollo configurado correctamente!${NC}"
echo -e "${YELLOW}Ahora puedes ejecutar 'npm run dev' para iniciar la aplicación${NC}" 