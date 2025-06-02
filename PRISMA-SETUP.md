# Configuración de Prisma con Múltiples Entornos

Este proyecto utiliza Prisma ORM para la conexión a la base de datos, con soporte para cargar configuraciones desde diferentes archivos según el entorno (desarrollo, producción y tests).

## Estructura de archivos

```
project/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── src/
│   ├── lib/
│   │   └── prisma.ts          # Cliente Prisma global
│   └── generated/
│       └── prisma/            # Cliente generado automáticamente
├── .env.local                 # Variables para desarrollo
├── .env.production           # Variables para producción
├── .env.test                 # Variables para tests (opcional)
└── docker-compose.yml        # Configuración de PostgreSQL
```

## Archivos de configuración

El proyecto utiliza múltiples archivos de variables de entorno:

- **`.env.local`** - Para desarrollo local
- **`.env.production`** - Para entorno de producción  
- **`.env.test`** - Para tests (si es necesario)

## Configuración inicial

### 1. Crear archivos de entorno

```bash
# Crear archivo para desarrollo
cp .env.template .env.local

# Crear archivo para producción  
cp .env.template .env.production

# Opcional: para tests con base de datos separada
cp .env.template .env.test
```

### 2. Configurar variables de entorno

Modifica los valores en cada archivo según tu configuración:

**Ejemplo `.env.local` (desarrollo):**
```env
# Base de datos de desarrollo
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/phrases_dev?schema=public"

# Variables para Docker Compose
DB_USER=dev_user
DB_PASSWORD=dev_password
DB_NAME=phrases_dev

# Cloudinary (desarrollo)
CLOUDINARY_CLOUD_NAME=tu_cloud_dev
CLOUDINARY_API_KEY=tu_api_key_dev
CLOUDINARY_API_SECRET=tu_api_secret_dev
```

**Ejemplo `.env.production` (producción):**
```env
# Base de datos de producción
DATABASE_URL="postgresql://prod_user:prod_password@prod_host:5432/phrases_prod?schema=public"

# Variables para Docker Compose (si aplica)
DB_USER=prod_user
DB_PASSWORD=prod_password
DB_NAME=phrases_prod

# Cloudinary (producción)
CLOUDINARY_CLOUD_NAME=tu_cloud_prod
CLOUDINARY_API_KEY=tu_api_key_prod
CLOUDINARY_API_SECRET=tu_api_secret_prod
```

## Comandos disponibles

### Generación de cliente Prisma

```bash
# Para desarrollo
npm run prisma:generate:dev

# Para producción
npm run prisma:generate:prod
```

### Migraciones de base de datos

```bash
# Para desarrollo (con confirmación interactiva)
npm run prisma:migrate:dev

# Para producción (sin confirmación - ideal para CI/CD)
npm run prisma:migrate:prod

# Reset completo de base de datos (solo desarrollo)
npm run prisma:db:reset:dev
```

### Explorador de base de datos (Prisma Studio)

```bash
# Para desarrollo
npm run prisma:studio:dev

# Para producción
npm run prisma:studio:prod
```

### Verificación de conexión

```bash
# Para desarrollo
npm run db:init:dev

# Para producción
npm run db:init:prod
```

### Población de datos

```bash
# Poblar base de datos en desarrollo
npm run populate-dev

# Poblar base de datos en producción
npm run populate-prod
```

## Cómo funciona el sistema multi-entorno

### Cliente Prisma Global (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from '../generated/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // Producción: nueva instancia cada vez
  prisma = new PrismaClient();
} else if (process.env.NODE_ENV === 'test') {
  // Tests: instancia limpia para cada test
  prisma = new PrismaClient();
} else {
  // Desarrollo: reutilizar instancia global (evita hot-reload issues)
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
```

### Scripts con carga automática de entorno

Cada script npm automáticamente carga el archivo `.env` correspondiente:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development dotenv -e .env.local -- next dev",
    "build": "prisma generate && NODE_ENV=production dotenv -e .env.production -- next build",
    "prisma:migrate:dev": "NODE_ENV=development dotenv -e .env.local -- npx prisma migrate dev",
    "prisma:migrate:prod": "NODE_ENV=production dotenv -e .env.production -- npx prisma migrate deploy"
  }
}
```

## Flujo de trabajo recomendado

### Desarrollo local
1. **Configurar entorno**: `cp .env.template .env.local`
2. **Levantar base de datos**: `docker-compose --env-file .env.local up -d`
3. **Generar cliente**: `npm run prisma:generate:dev`
4. **Ejecutar migraciones**: `npm run prisma:migrate:dev`
5. **Poblar datos**: `npm run populate-dev`
6. **Desarrollar**: `npm run dev`

### Producción
1. **Configurar variables**: Actualizar `.env.production`
2. **Build**: `npm run build`
3. **Migrar**: `npm run prisma:migrate:prod`
4. **Poblar datos**: `npm run populate-prod`
5. **Ejecutar**: `npm run start`

## Beneficios de esta configuración

1. **Aislamiento**: Cada entorno tiene su propia configuración
2. **Flexibilidad**: Fácil cambio entre entornos
3. **Seguridad**: Variables sensibles separadas por entorno
4. **CI/CD friendly**: Scripts no interactivos para producción
5. **Hot-reload friendly**: Reutilización de conexiones en desarrollo

## Troubleshooting

### Error de conexión
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps

# Verificar variables de entorno
npm run db:init:dev
```

### Error de migración
```bash
# Reset base de datos (solo desarrollo)
npm run prisma:db:reset:dev

# Re-generar cliente
npm run prisma:generate:dev
```

### Problemas con hot-reload
- El sistema de cliente global evita múltiples conexiones durante el desarrollo
- Si persisten problemas, reiniciar el servidor de desarrollo 