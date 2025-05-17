This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

1. Clonar el repositorio
2. duplicar el archivo `.env.template` a `.env.local` y `env.production`  para agregar cambiar las variables de entorno segun correspondan.
3. Levantar la base de datos (que contendra frases)
```bash
docker compose up -d
```
3. construir imagen de nextjs en docker: 
```bash
docker build -t next-postgre .
```
4. correr el contenedor:
```bash
docker container run -dp 3000:3000 next-postgre
```
5. Se comienza migracion con prisma
```bash
npm run prisma:dev
```
6. Generamos prisma
```bash
npm run prisma:generate:dev
```
7.  migramos schemas con prisma a base de datos
```bash
npm run prisma:migrate:dev
```
8. Probamos que la base de datos exista
```bash
db:init:dev
```
8. Se pobla tabla con datos de frases
```bash

```
9. Ejecutamos el comando para levantar front
```bash
npm run dev
```
5. visitar la url: [http://localhost:3000](http://localhost:3000)
6.  bajar el contenedor:
```bash
docker container stop next-postgre
```
if this not working use container_id.
7.
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma commands
```
npx prisma init
npx prisma migrate dev
npx prisma generate
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
