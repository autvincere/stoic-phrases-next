// // Configuración global para tests de Jest
// import { jest } from '@jest/globals';

// // Configuración global de Jest
// global.jest = jest;

// // Establecer variables de entorno para tests
// process.env.NODE_ENV = 'test';
// process.env.DB_USER = 'test_user';
// process.env.DB_HOST = 'localhost';
// process.env.DB_NAME = 'test_db';
// process.env.DB_PASSWORD = 'test_password';
// process.env.DB_PORT = '5432';

// // Mock de process.exit
// jest.spyOn(process, 'exit').mockImplementation(() => {}); 
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";