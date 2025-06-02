# Migración a Prisma ORM

Este documento detalla los cambios realizados para migrar de consultas directas con PostgreSQL (usando pg) a Prisma ORM.

## Archivos Modificados

### 1. Cliente Prisma Global

Se creó un archivo para manejar la instancia de Prisma:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '../generated/prisma';

// Añadir tipado global para prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Evita crear múltiples instancias de Prisma Client en desarrollo
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else if (process.env.NODE_ENV === 'test') {
  // En tests, usar una instancia limpia
  prisma = new PrismaClient();
} else {
  // En desarrollo, reutilizar una instancia global
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
```

### 2. Actualización de seed-database.ts

Se actualizó el archivo `src/app/seed/seed-database.ts` para usar Prisma:

**Antes (con pg):**
```typescript
import { Pool } from 'pg';

// Limpiar tabla
await pool.query('DELETE FROM phrases');

// Insertar datos
await pool.query(
  'INSERT INTO phrases (id, author, phrase, image_url, updated_at) VALUES ($1, $2, $3, $4, $5)',
  [crypto.randomUUID(), author, phrase, imageUrl, new Date()]
);

// Consultar datos
const result = await pool.query('SELECT * FROM phrases');
const phrases = result.rows;
```

**Después (con Prisma):**
```typescript
import prisma from '../../lib/prisma';

// Limpiar la tabla existente - usando Prisma
await prisma.phrases.deleteMany({});
console.log('Tabla "Phrases" limpiada.');

// Crear registros usando Prisma
await prisma.phrases.create({
  data: {
    id: crypto.randomUUID(),
    author,
    phrase,
    image_url: imageUrl,
    updated_at: new Date(),
  },
});

// Consultar datos usando Prisma
const phrasesFromDb = await prisma.phrases.findMany();
console.table(phrasesFromDb);

// Desconectar Prisma al final
await prisma.$disconnect();
```

### 3. Actualización de Tests

Se actualizaron los tests para mockear Prisma en lugar de pg:

**Mock para Prisma:**
```typescript
// __tests__/seed-database.test.ts
jest.mock('../../../lib/prisma', () => {
  return {
    __esModule: true,
    default: {
      phrases: {
        deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
        create: jest.fn().mockResolvedValue({
          id: 'test-id',
          author: 'Test Author',
          phrase: 'Test Phrase',
          image_url: 'http://test.com/image.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        }),
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'test-id',
            author: 'Test Author',
            phrase: 'Test Phrase',
            image_url: 'http://test.com/image.jpg',
            created_at: new Date(),
            updated_at: new Date(),
          }
        ])
      },
      $disconnect: jest.fn().mockResolvedValue(undefined)
    }
  };
});
```

## Cambios en APIs

Los archivos de API (`route.ts`) también deben ser actualizados para usar Prisma:

### Obtener todas las frases
**Antes con pg:**
```typescript
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM phrases");
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener frases' }, { status: 500 });
  }
}
```

**Después con Prisma:**
```typescript
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const phrases = await prisma.phrases.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json(phrases);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener frases' }, { status: 500 });
  }
}
```

### Obtener frase aleatoria
**Antes con pg:**
```typescript
const result = await pool.query("SELECT * FROM phrases ORDER BY RANDOM() LIMIT 1");
return NextResponse.json(result.rows[0] || null);
```

**Después con Prisma:**
```typescript
// Método optimizado para obtener frase aleatoria
const count = await prisma.phrases.count();
if (count === 0) {
  return NextResponse.json(null);
}

const skip = Math.floor(Math.random() * count);
const randomPhrase = await prisma.phrases.findFirst({
  skip: skip,
});

return NextResponse.json(randomPhrase);
```

## Beneficios de la migración

1. **Type Safety**: Prisma genera tipos TypeScript automáticamente
2. **Better Developer Experience**: Autocompletado y detección de errores
3. **Migrations**: Sistema de migraciones más robusto
4. **Query Builder**: API más intuitiva para construir consultas
5. **Connection Management**: Manejo automático de conexiones
6. **Performance**: Optimizaciones automáticas de consultas

## Comandos útiles post-migración

```bash
# Generar cliente después de cambios en schema
npm run prisma:generate:dev

# Crear y aplicar migración
npm run prisma:migrate:dev

# Ver base de datos en interfaz gráfica
npm run prisma:studio:dev

# Reset completo de base de datos (solo desarrollo)
npm run prisma:db:reset:dev
```

## Siguientes Pasos

- [x] ✅ Actualizar seed-database.ts para usar Prisma
- [x] ✅ Actualizar tests para mockear Prisma
- [ ] 🔄 Actualizar archivos de API para usar Prisma
- [ ] 🔄 Verificar todas las migraciones de Prisma
- [ ] 🔄 Considerar remover la dependencia de pg si ya no se requiere
- [ ] 🔄 Documentar nuevos endpoints de API con Prisma 