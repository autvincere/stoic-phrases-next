import request from 'supertest';

// Ya no omitimos las pruebas en CI
describe('GET /api/phrases - Integration Tests', () => {
  // Tests que requieren servidor local
  describe('Integration tests (require local server)', () => {
    // Información de depuración
    beforeAll(() => {
      console.log('process.env.CI', process.env.CI);
      console.log('process.env.VERCEL', process.env.VERCEL);
      console.log('process.env.NODE_ENV', process.env.NODE_ENV);
      console.log('DB_HOST', process.env.DB_HOST);
      console.log('DB_NAME', process.env.DB_NAME);
    });

    it('debería rechazar rutas incorrectas', async () => {
      try {
        const response = await request('http://localhost:3000').get('/api/phrases/invalid');
        expect(response.status).toBe(404);
      } catch (error) {
        console.error('Error en la prueba:', error);
        throw error;
      }
    });

    it('debería obtener una frase del endpoint correcto', async () => {
      try {
        const response = await request('http://localhost:3000').get('/api/phrases');
        console.log('Respuesta del endpoint correcto:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('author');
        expect(response.body).toHaveProperty('phrase');
        expect(response.body).toHaveProperty('image_url');
      } catch (error) {
        console.error('Error al probar el endpoint correcto:', error);
        throw error;
      }
    });

    it('debería obtener todas las frases cuando se incluye el parámetro all', async () => {
      try {
        const response = await request('http://localhost:3000').get('/api/phrases?all=true');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('author');
        expect(response.body[0]).toHaveProperty('phrase');
        expect(response.body[0]).toHaveProperty('image_url');
      } catch (error) {
        console.error('Error al obtener todas las frases:', error);
        throw error;
      }
    });
  });
});
