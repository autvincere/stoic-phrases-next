import request from 'supertest';

// Configuración de timeouts más altos para CI
const TIMEOUT = 10000; // 10 segundos
const SERVER_URL = 'http://localhost:3000';

describe('GET /api/phrases - Integration Tests', () => {
  // Tests que requieren servidor local
  describe('Integration tests (require local server)', () => {
    // Información de depuración
    beforeAll(async () => {
      console.log('=== Environment Info ===');
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('CI:', process.env.CI);
      console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

      // Verificar que el servidor esté disponible antes de ejecutar tests
      console.log('=== Server Health Check ===');
      try {
        const healthResponse = await request(SERVER_URL).get('/api/health').timeout(TIMEOUT);
        console.log('✅ Server health check passed:', healthResponse.body);
      } catch (error) {
        console.error('❌ Server health check failed:', error);
        throw new Error('Server is not available for integration tests');
      }
    }, 15000); // 15 segundos de timeout para beforeAll

    it(
      'debería rechazar rutas incorrectas',
      async () => {
        const response = await request(SERVER_URL).get('/api/phrases/invalid').timeout(TIMEOUT);

        expect(response.status).toBe(404);
      },
      TIMEOUT,
    );

    it(
      'debería obtener una frase del endpoint correcto',
      async () => {
        const response = await request(SERVER_URL).get('/api/phrases').timeout(TIMEOUT);

        console.log('Respuesta del endpoint:', response.status, response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('author');
        expect(response.body).toHaveProperty('phrase');
        expect(response.body).toHaveProperty('image_url');

        // Verificar que los valores no estén vacíos
        expect(response.body.id).toBeTruthy();
        expect(response.body.author).toBeTruthy();
        expect(response.body.phrase).toBeTruthy();
        expect(response.body.image_url).toBeTruthy();
      },
      TIMEOUT,
    );

    it(
      'debería obtener todas las frases cuando se incluye el parámetro all',
      async () => {
        const response = await request(SERVER_URL).get('/api/phrases?all=true').timeout(TIMEOUT);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        // Verificar estructura del primer elemento
        const firstPhrase = response.body[0];
        expect(firstPhrase).toHaveProperty('id');
        expect(firstPhrase).toHaveProperty('author');
        expect(firstPhrase).toHaveProperty('phrase');
        expect(firstPhrase).toHaveProperty('image_url');

        // Verificar que los valores no estén vacíos
        expect(firstPhrase.id).toBeTruthy();
        expect(firstPhrase.author).toBeTruthy();
        expect(firstPhrase.phrase).toBeTruthy();
        expect(firstPhrase.image_url).toBeTruthy();

        console.log(`✅ Retrieved ${response.body.length} phrases successfully`);
      },
      TIMEOUT,
    );

    it(
      'debería manejar CORS correctamente',
      async () => {
        const response = await request(SERVER_URL).options('/api/phrases').timeout(TIMEOUT);

        expect(response.status).toBe(200);
        expect(response.headers).toHaveProperty('access-control-allow-origin');
        expect(response.headers).toHaveProperty('access-control-allow-methods');
      },
      TIMEOUT,
    );

    it(
      'debería retornar error para métodos no permitidos',
      async () => {
        const response = await request(SERVER_URL).post('/api/phrases').timeout(TIMEOUT);

        expect(response.status).toBe(405);
      },
      TIMEOUT,
    );
  });
});
