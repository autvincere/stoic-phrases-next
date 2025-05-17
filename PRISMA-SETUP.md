# Configuración de Prisma con Múltiples Entornos

Este proyecto utiliza Prisma ORM para la conexión a la base de datos, con soporte para cargar configuraciones desde diferentes archivos según el entorno (desarrollo o producción).

## Archivos de configuración

El proyecto utiliza dos archivos de variables de entorno principales:

- `.env.local` - Para desarrollo local
- `.env.production` - Para entorno de producción

## Configuración inicial

1. Crea los archivos de entorno necesarios:

```bash
# Copia los archivos de ejemplo
cp .env.local.example .env.local
cp .env.production.example .env.production
```

2. Modifica los valores en los archivos `.env.local` y `.env.production` según tu configuración:

```
# Ejemplo .env.local
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/tu_db_dev?schema=public"
```

## Comandos disponibles

### Generación de cliente Prisma

Para generar el cliente Prisma según el entorno:

```bash
# Para desarrollo
npm run prisma:generate:dev

# Para producción
npm run prisma:generate:prod
```

### Migraciones de base de datos

Para ejecutar migraciones:

```bash
# Para desarrollo (con confirmación)
npm run prisma:migrate:dev

# Para producción (sin confirmación)
npm run prisma:migrate:prod
```

### Explorador de base de datos (Prisma Studio)

Para abrir Prisma Studio con la configuración del entorno correspondiente:

```bash
# Para desarrollo
npm run prisma:studio:dev

# Para producción
npm run prisma:studio:prod
```

### Verificación de conexión

Para verificar la conexión a la base de datos:

```bash
# Para desarrollo
npm run db:init:dev

# Para producción
npm run db:init:prod
```

## Cómo funciona

El archivo `src/lib/db.ts` detecta automáticamente el entorno actual basado en la variable `NODE_ENV` y carga el archivo de variables de entorno correspondiente (`.env.local` para desarrollo o `.env.production` para producción).

Esto permite tener configuraciones diferentes para cada entorno sin necesidad de modificar el código. 