import request from 'supertest';
// import { NextRequest } from "next/server";
// import { GET } from "../route";

// Determinar si estamos en CI/Vercel o desarrollo local
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1';

describe("API Phrases Tests", () => {
  // Tests que requieren servidor local
  (isCI ? describe.skip : describe)("Integration tests (require local server)", () => {
    console.log('isCI', isCI);
    console.log('process.env.CI', process.env.CI);
    console.log('process.env.VERCEL', process.env.VERCEL);
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    it('debería rechazar rutas incorrectas', async () => {
      try {
        const response = await request("http://localhost:3000").get('/api/phrases/invalid');
        expect(response.status).toBe(404);
      } catch (error) {
        console.error('Error en la prueba:', error);
        throw error;
      }
    });

    // it('debería obtener una frase del endpoint correcto', async () => {
    //   try {
    //     const response = await request("http://localhost:3000").get('/api/phrases');
    //     console.log('Respuesta del endpoint correcto:', response.status, response.body);
    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('id');
    //   } catch (error) {
    //     console.error('Error al probar el endpoint correcto:', error);
    //     throw error;
    //   }
    // });
  });

  // Tests que funcionan en cualquier entorno (incluyendo CI)
  // describe("Unit tests (work in any environment)", () => {
  //   it("debería obtener una frase aleatoria", async () => {
  //     const req = new NextRequest("http://localhost:3000/api/phrases");
  //     const res = await GET(req);
      
  //     const data = await res.json();
      
  //     expect(res.status).toBe(200);
  //     expect(data).toHaveProperty("id");
  //   });
    
  //   it("debería manejar errores en la ruta", async () => {
  //     const req = new NextRequest("http://localhost:3000/api/phrases/invalid");
  //     let errorThrown = false;
      
  //     try {
  //       await GET(req);
  //     } catch {
  //       errorThrown = true;
  //     }
      
  //     // O bien lanza error o devuelve respuesta con error
  //     if (!errorThrown) {
  //       const res = await GET(req);
  //       expect([404, 400, 500]).toContain(res.status);
  //     }
  //   });
  // });
});