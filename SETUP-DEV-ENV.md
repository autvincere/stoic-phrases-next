# Script de Configuración del Entorno de Desarrollo

Este documento explica cómo usar el script `setup-dev-env.sh` para configurar automáticamente el entorno de desarrollo del proyecto Next.js + PostgreSQL + Prisma.

## 🎯 ¿Qué hace este script?

El script `setup-dev-env.sh` automatiza completamente la configuración inicial del entorno de desarrollo, ejecutando todos los pasos necesarios para tener el proyecto funcionando en minutos.

### ⚡ Tareas que automatiza:

1. **Validaciones previas**:
   - ✅ Verifica que Docker esté corriendo
   - ✅ Verifica que Node.js esté instalado
   - ✅ Crea backup de `.env.local` existente

2. **Configuración de entorno**:
   - 📁 Crea archivo `.env.local` con configuración por defecto
   - 🔧 Genera cliente de Prisma
   - 🗃️ Ejecuta migraciones de base de datos
   - 📊 Pobla la base de datos con datos iniciales

## 📋 Prerrequisitos

### Antes de ejecutar el script, asegúrate de tener:

#### 1. **Docker Desktop instalado y corriendo**
```bash
# Verificar que Docker esté corriendo
docker ps
# Debe mostrar una lista (puede estar vacía) sin errores
```

#### 2. **Node.js 18+ instalado**
```bash
# Verificar versión de Node.js
node --version
# Debe mostrar v18.0.0 o superior
```

#### 3. **Base de datos PostgreSQL en Docker**
```bash
# Levantar la base de datos
docker-compose --env-file .env.local up -d
```

#### 4. **Dependencias del proyecto instaladas**
```bash
npm install
```

## 🚀 Cómo usar el script

### **Opción 1: Setup inicial completo (recomendado)**

```bash
# 1. Clonar el repositorio
git clone [url-del-repositorio]
cd next-postgre

# 2. Instalar dependencias
npm install

# 3. Levantar base de datos
docker-compose up -d

# 4. Dar permisos al script y ejecutar
chmod +x setup-dev-env.sh
./setup-dev-env.sh

# 5. Iniciar aplicación
npm run dev
```

### **Opción 2: Reset del entorno existente**

```bash
# Si ya tienes el proyecto pero quieres resetear todo
./setup-dev-env.sh
```

### **Opción 3: Ejecutar con bash explícito**

```bash
# Si tienes problemas de permisos
bash setup-dev-env.sh
```

## 📊 Output esperado

Cuando ejecutes el script correctamente, verás algo así:

```bash
🟡 Configurando entorno de desarrollo...
✅ Docker está corriendo
✅ Node.js encontrado (v18.17.0)
🟡 Creando backup de .env.local existente...
🟡 Creando archivo .env.local...
✅ Archivo .env.local creado
🟡 Generando cliente de Prisma...
✅ Cliente de Prisma generado
🟡 Ejecutando migraciones...
✅ Migraciones completadas
🟡 Poblando la base de datos...
✅ Base de datos poblada
✅ ¡Entorno de desarrollo configurado correctamente!
🟡 Ahora puedes ejecutar 'npm run dev' para iniciar la aplicación
```

## 🔧 Configuración por defecto

### El script crea un archivo `.env.local` con:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/phrases_db"
```

### Variables que puedes personalizar después:

```env
# Configuración de base de datos
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/tu_db"

# Variables para Docker Compose
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=tu_base_de_datos

# Configuración de Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 🛠️ Troubleshooting

### ❌ **Error: "Docker no está corriendo"**

**Problema**: Docker Desktop no está iniciado
```bash
Error: Docker no está corriendo
```

**Solución**:
```bash
# macOS
open -a Docker

# Windows/Linux - Abrir Docker Desktop manualmente
# Esperar a que aparezca el ícono en la bandeja del sistema
```

### ❌ **Error: "Node.js no está instalado"**

**Problema**: Node.js no está en el PATH o no está instalado
```bash
Error: Node.js no está instalado
```

**Solución**:
```bash
# Instalar Node.js desde https://nodejs.org
# O usar nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### ❌ **Error: "Permission denied"**

**Problema**: El script no tiene permisos de ejecución
```bash
bash: ./setup-dev-env.sh: Permission denied
```

**Solución**:
```bash
# Dar permisos de ejecución
chmod +x setup-dev-env.sh

# O ejecutar con bash directamente
bash setup-dev-env.sh
```

### ❌ **Error en migraciones de Prisma**

**Problema**: Error al ejecutar migraciones
```bash
Error: P1001: Can't reach database server
```

**Solución**:
```bash
# 1. Verificar que la base de datos esté corriendo
docker-compose ps

# 2. Verificar conectividad
docker-compose logs phrasesDB

# 3. Reiniciar base de datos
docker-compose down
docker-compose up -d

# 4. Ejecutar script nuevamente
./setup-dev-env.sh
```

### ❌ **Error al poblar base de datos**

**Problema**: Falla en `npm run populate-dev`
```bash
Error uploading image to Cloudinary
```

**Solución**:
```bash
# 1. Configurar variables de Cloudinary en .env.local
echo 'CLOUDINARY_CLOUD_NAME=tu_cloud' >> .env.local
echo 'CLOUDINARY_API_KEY=tu_key' >> .env.local
echo 'CLOUDINARY_API_SECRET=tu_secret' >> .env.local

# 2. Ejecutar población manualmente
npm run populate-dev
```

## 🔄 Comandos manuales equivalentes

Si prefieres ejecutar los pasos manualmente en lugar del script:

```bash
# 1. Crear .env.local
echo 'DATABASE_URL="postgresql://postgres:123456@localhost:5432/phrases_db"' > .env.local

# 2. Generar cliente Prisma
npm run prisma:generate:dev

# 3. Ejecutar migraciones
npm run prisma:migrate:dev

# 4. Poblar base de datos
npm run populate-dev
```

## 📚 Comandos relacionados

### Después del setup inicial:

```bash
# Iniciar aplicación en desarrollo
npm run dev

# Abrir Prisma Studio (base de datos visual)
npm run prisma:studio:dev

# Ejecutar tests
npm test

# Ver logs de la base de datos
docker-compose logs phrasesDB

# Parar base de datos
docker-compose down
```

## 🎯 Casos de uso específicos

### **Para nuevo desarrollador en el equipo:**
1. Clonar repo → 2. `npm install` → 3. `docker-compose up -d` → 4. `./setup-dev-env.sh` → 5. `npm run dev`

### **Para cambiar de rama con migraciones nuevas:**
1. `git checkout nueva-rama` → 2. `./setup-dev-env.sh` → 3. `npm run dev`

### **Para limpiar y resetear entorno:**
1. `docker-compose down -v` → 2. `docker-compose up -d` → 3. `./setup-dev-env.sh`

## 🛡️ Archivos de seguridad

### El script crea automáticamente backup:
- **`.env.local.backup`** - Copia de seguridad de tu configuración anterior
- Si algo sale mal, puedes restaurar: `cp .env.local.backup .env.local`

## ⚠️ Importante

- **El script sobrescribe datos**: Al poblar la base de datos, elimina datos existentes
- **Usa configuración por defecto**: Revisa y personaliza `.env.local` después
- **Requiere conexión a internet**: Para descargar dependencias de Prisma y subir imágenes a Cloudinary

---

## 🎉 ¡Listo!

Después de ejecutar el script exitosamente, tu entorno de desarrollo estará completamente configurado y listo para usar. Solo ejecuta `npm run dev` y visita [http://localhost:3000](http://localhost:3000) para ver la aplicación funcionando. 