# Next.js + PostgreSQL + Prisma - Stoic Phrases App

Este es un proyecto de [Next.js](https://nextjs.org) creado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), que utiliza PostgreSQL como base de datos y Prisma como ORM.

## 🚀 Configuración Inicial

### ⚡ Setup automático (Recomendado)

Para configurar el entorno de desarrollo automáticamente:

```bash
# 1. Clonar e instalar dependencias
git clone [url-del-repositorio]
cd next-postgre
npm install

# 2. Levantar base de datos
docker-compose up -d

# 3. Ejecutar script de configuración
chmod +x setup-dev-env.sh
./setup-dev-env.sh

# 4. Iniciar aplicación
npm run dev
```

📋 **[Ver documentación completa del script de setup →](./SETUP-DEV-ENV.md)**

### 🔧 Setup manual (paso a paso)

Si prefieres configurar manualmente o tienes problemas con el script automático:

### Prerrequisitos
- Node.js 18+
- Docker y Docker Compose
- npm o yarn

### Paso a paso

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd next-postgre
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
   - Duplicar el archivo `.env.template` a `.env.local` y `.env.production`
   - Modificar las variables según corresponda:
   ```env
   # .env.local (ejemplo)
   DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/base_datos_dev"
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_NAME=base_datos_dev
   ```

4. **Iniciar Docker Desktop**
```bash
open -a Docker  # macOS
# o abrir Docker Desktop manualmente en Windows/Linux
```

5. **Levantar la base de datos PostgreSQL**
```bash
docker-compose --env-file .env.local up -d
```

6. **Configurar Prisma**
```bash
# Generar cliente Prisma para desarrollo
npm run prisma:generate:dev

# Ejecutar migraciones
npm run prisma:migrate:dev

# Verificar conexión a la base de datos
npm run db:init:dev
```

7. **Poblar la base de datos con datos iniciales**
```bash
npm run populate-dev
```

8. **Ejecutar la aplicación en modo desarrollo**
```bash
npm run dev
```

9. **Abrir la aplicación**
   - Visitar: [http://localhost:3000](http://localhost:3000)

## 🐳 Docker para la aplicación Next.js

### Construir y ejecutar con Docker Compose (Recomendado)
```bash
# Construir y ejecutar toda la aplicación
docker-compose up --build -d

# Ver logs
docker-compose logs app

# Parar contenedores
docker-compose down
```

### Comandos Docker alternativos
```bash
# Construir imagen manualmente
docker build -t next-postgre .

# Ejecutar contenedor con nombre específico
docker run -dp 3000:3000 --name mi-app-next next-postgre

# Parar contenedor
docker stop mi-app-next

# Reiniciar contenedor existente
docker start mi-app-next
```

## 🧪 Testing

### Tests unitarios
```bash
# Ejecutar tests unitarios (no requieren servidor)
npm run test:unit

# Tests en modo watch
npm run test:watch

# Coverage de tests
npm run test:coverage
```

### Tests de integración

Los tests de integración requieren que tanto PostgreSQL como Next.js estén corriendo:

#### Opción 1: Script automático (Recomendado)
```bash
# Asegúrate de que PostgreSQL esté corriendo
docker-compose up -d

# Ejecutar script que maneja todo automáticamente
./test-integration-local.sh
```

#### Opción 2: Manual paso a paso
```bash
# 1. Levantar PostgreSQL
docker-compose up -d

# 2. Configurar entorno de test
echo 'DATABASE_URL="postgresql://postgres:123456@localhost:5432/phrases_db"' > .env.test
echo 'NODE_ENV=test' >> .env.test

# 3. Preparar base de datos
NODE_ENV=test dotenv -e .env.test -- npx prisma generate
NODE_ENV=test dotenv -e .env.test -- npx prisma migrate deploy
NODE_ENV=test dotenv -e .env.test -- tsx src/scripts/seed-test-db.ts

# 4. Iniciar Next.js en background
NODE_ENV=test dotenv -e .env.test -- npm run dev &

# 5. Esperar a que esté listo y ejecutar tests
sleep 10
NODE_ENV=test dotenv -e .env.test -- npm run test:integration

# 6. Limpiar
kill %1  # Matar proceso de Next.js
rm .env.test
```

### Todos los tests
```bash
# Ejecutar todos los tests (unitarios + integración)
npm test
```

## 🛠️ Scripts disponibles

### Desarrollo
```bash
npm run dev              # Ejecutar en modo desarrollo
npm run build            # Construir para producción
npm run start            # Ejecutar en modo producción
npm run lint             # Linter
npm run lint:fix         # Arreglar errores de linter
npm run format           # Formatear código con Prettier
```

### Base de datos (Prisma)
```bash
# Desarrollo
npm run prisma:generate:dev     # Generar cliente Prisma
npm run prisma:migrate:dev      # Ejecutar migraciones
npm run prisma:studio:dev       # Abrir Prisma Studio
npm run db:init:dev             # Verificar conexión

# Producción
npm run prisma:generate:prod    # Generar cliente para producción
npm run prisma:migrate:prod     # Ejecutar migraciones en producción
npm run prisma:studio:prod      # Abrir Prisma Studio para producción
npm run db:init:prod            # Verificar conexión en producción

# Poblar base de datos
npm run populate-dev            # Poblar datos en desarrollo
npm run populate-prod           # Poblar datos en producción
```

## 📚 Documentación adicional

- **[Script de Setup Automático](./SETUP-DEV-ENV.md)** - Guía completa para usar el script de configuración automática
- [Configuración de Prisma](./PRISMA-SETUP.md) - Configuración detallada de Prisma para múltiples entornos
- [Migración a Prisma](./PRISMA_MIGRATION.md) - Documentación sobre la migración de pg a Prisma

## 🔗 Recursos útiles

- [Documentación de Next.js](https://nextjs.org/docs) - Aprende sobre las características y API de Next.js
- [Tutorial de Next.js](https://nextjs.org/learn) - Tutorial interactivo de Next.js
- [Documentación de Prisma](https://www.prisma.io/docs) - Guía completa de Prisma ORM
- [Repositorio de Next.js](https://github.com/vercel/next.js) - Contribuciones y feedback son bienvenidos

## 🚀 Deploy en Vercel

La forma más fácil de desplegar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Consulta la [documentación de deploy de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## 🛠️ Tecnologías utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL 15.3
- **ORM**: Prisma
- **Containerización**: Docker & Docker Compose
- **Testing**: Jest, Testing Library
- **Linting**: ESLint, Prettier
- **Almacenamiento de imágenes**: Cloudinary
