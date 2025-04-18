import { jest } from '@jest/globals';
import { TextEncoder, TextDecoder } from 'util';

// Configuración global de Jest
global.jest = jest;

// Configuración de variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.DB_USER = 'test_user';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'test_db';
process.env.DB_PASSWORD = 'test_password';
process.env.DB_PORT = '5432';

// Mock de process.exit
jest.spyOn(process, 'exit').mockImplementation(() => {});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder; 