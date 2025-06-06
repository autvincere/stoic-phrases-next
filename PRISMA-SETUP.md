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

## 🔄 Actualización de Datos en Producción

### 📋 Tipos de Cambios y Mejores Prácticas

Existen **dos tipos principales** de cambios que puedes necesitar hacer en producción:

#### 1. **Cambios de Estructura (Esquema)** 🏗️

**❌ NUNCA hagas esto directamente en producción:**
```sql
-- ❌ NO hacer cambios de esquema manualmente
ALTER TABLE "Phrases" ADD COLUMN "category" VARCHAR(50);
DROP TABLE "OldTable";
CREATE INDEX "new_index" ON "Phrases"("author");
```

**✅ Flujo recomendado para cambios de estructura:**

```bash
# 1. En desarrollo: Modifica el esquema
vim prisma/schema.prisma

# 2. Genera y prueba la migración
npm run prisma:migrate:dev

# 3. Haz commit del cambio
git add prisma/
git commit -m "feat: add category column to Phrases"

# 4. En producción: Aplica la migración
git pull
npm run prisma:migrate:prod
```

#### 2. **Cambios de Datos (Contenido)** 📊

**✅ Cambios de datos SÍ son seguros manualmente:**
```sql
-- ✅ Estos cambios NO afectan el esquema
UPDATE "Phrases" SET "author" = 'Séneca' WHERE "author" = 'Seneca';
INSERT INTO "Phrases" VALUES ('new-id', 'Marco Aurelio', '...', '...', NOW(), NOW());
DELETE FROM "Phrases" WHERE "created_at" < '2020-01-01';
UPDATE "Phrases" SET "updated_at" = NOW() WHERE "id" = 'specific-id';
```

### ⚠️ Problemas de los Cambios Manuales de Esquema

Si modificas la estructura manualmente, pueden ocurrir:

1. **Desincronización:**
   ```
   Base de Datos Real:    [Tabla con columna extra]
   Prisma Schema:         [Esquema sin esa columna]
   Cliente TypeScript:    [Tipos incorrectos]
   ```

2. **Errores en futuras migraciones:**
   - Prisma puede intentar revertir cambios manuales
   - Conflictos de migración difíciles de resolver
   - Pérdida del historial de cambios

3. **Inconsistencias entre entornos:**
   - Desarrollo vs. Producción con esquemas diferentes
   - Dificultad para replicar bugs
   - Tests que fallan inesperadamente

### 🛠️ Resolución de Conflictos por Cambios Manuales

Si **YA hiciste cambios manuales** en producción, tienes estas opciones:

#### **Opción A: Sincronizar Prisma con BD Existente**
```bash
# 1. Actualiza el esquema para reflejar cambios manuales
vim prisma/schema.prisma

# 2. Crea migración personalizada (sin ejecutar)
npm run prisma:migrate:dev --create-only

# 3. Edita la migración generada para evitar cambios duplicados
# (La migración debe coincidir con el estado actual de la BD)

# 4. Aplica la migración "vacía"
npm run prisma:migrate:dev
```

#### **Opción B: Forzar Sincronización desde BD**
```bash
# Prisma lee la BD y actualiza el esquema automáticamente
npm run prisma:prod -- db pull

# Actualiza el cliente TypeScript
npm run prisma:generate:prod

# Crea migración inicial desde el estado actual
npm run prisma:migrate:dev --name sync_manual_changes
```

#### **Opción C: Reset Completo (Si es viable)**
```bash
# ⚠️ CUIDADO: Elimina todos los datos
npm run prisma:prod -- migrate reset --force

# Re-poblar datos
npm run populate-prod
```

### 🎯 Manejo del Error P3005

Si encuentras el error `P3005: The database schema is not empty`, significa que:
- Tu BD tiene esquema existente
- Prisma no encuentra el historial de migraciones
- Hay desincronización entre BD real y migraciones de Prisma

**Soluciones ordenadas por seguridad:**

1. **Baseline (Más seguro):**
   ```bash
   # Marca migraciones existentes como "aplicadas"
   npm run prisma:migrate:prod -- resolve --applied "nombre_migracion"
   npm run prisma:migrate:prod
   ```

2. **Sincronización directa:**
   ```bash
   # Sincroniza esquema sin usar migraciones
   npm run prisma:prod -- db push --accept-data-loss
   ```

3. **Reset completo (Solo si puedes recrear datos):**
   ```bash
   npm run prisma:prod -- migrate reset --force
   npm run populate-prod
   ```

### 📋 Checklist para Cambios en Producción

**Antes de hacer cualquier cambio:**

- [ ] ¿Es un cambio de datos (contenido) o estructura (esquema)?  
- [ ] Si es estructura: ¿Probé la migración en desarrollo?
- [ ] Si es datos: ¿Tengo backup de los datos que voy a modificar?
- [ ] ¿Documenté el cambio en commit/issue?
- [ ] ¿El cambio es reversible?

**Para cambios de estructura:**
- [ ] Modifiqué `prisma/schema.prisma`
- [ ] Creé migración con `prisma migrate dev`
- [ ] Probé la migración en entorno de staging
- [ ] Hice commit de esquema + migración
- [ ] Apliqué en producción con `prisma migrate deploy`

**Para cambios de datos:**
- [ ] Conecté directamente a la base de datos
- [ ] Ejecuté solo comandos DML (INSERT, UPDATE, DELETE)
- [ ] Verifiqué que los cambios son correctos
- [ ] Documenté los cambios realizados

### 🚀 Comandos Útiles para Producción

```bash
# Ver estado de migraciones
npm run prisma:prod -- migrate status

# Ver diferencias entre esquema y BD
npm run prisma:prod -- db pull --print

# Generar SQL de migración (sin aplicar)
npm run prisma:migrate:dev --create-only

# Conectar a Prisma Studio en producción (con cuidado)
npm run prisma:studio:prod

# Verificar conexión a BD de producción
npm run prisma:prod -- db ping
```

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