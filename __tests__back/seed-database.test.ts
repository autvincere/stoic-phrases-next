import { jest } from '@jest/globals';
import { findImageInCloudinary } from '../src/app/seed/seed-database';

// Definir las interfaces para los tipos de Cloudinary
interface CloudinaryResource {
  public_id: string;
  secure_url: string;
}

interface CloudinaryResponse {
  resources: CloudinaryResource[];
}

interface CloudinaryMock {
  search: {
    expression: jest.Mock;
    execute: jest.Mock;
  };
}

// Mock de cloudinary
const mockCloudinary: CloudinaryMock = {
  search: {
    expression: jest.fn().mockReturnThis(),
    execute: jest.fn()
  }
};

jest.mock('../../../cloudinaryConfig.ts', () => mockCloudinary);

describe('findImageInCloudinary', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('debería retornar la imagen si se encuentra en Cloudinary', async () => {
    // Configurar el mock para simular una imagen encontrada
    const mockImage: CloudinaryResource = {
      public_id: 'phrases_images/test-image',
      secure_url: 'https://res.cloudinary.com/test/test-image.jpg'
    };

    const mockResponse: CloudinaryResponse = {
      resources: [mockImage]
    };

    (mockCloudinary.search.execute as jest.Mock).mockResolvedValue(mockResponse);

    const result = await findImageInCloudinary('test-image');
    
    expect(result).toEqual(mockImage);
    expect(mockCloudinary.search.expression).toHaveBeenCalledWith('public_id:phrases_images/test-image');
  });

  it('debería retornar null si no se encuentra la imagen', async () => {
    // Configurar el mock para simular que no se encuentra la imagen
    const mockResponse: CloudinaryResponse = {
      resources: []
    };

    (mockCloudinary.search.execute as jest.Mock).mockResolvedValue(mockResponse);

    const result = await findImageInCloudinary('non-existent-image');
    
    expect(result).toBeNull();
    expect(mockCloudinary.search.expression).toHaveBeenCalledWith('public_id:phrases_images/non-existent-image');
  });

  it('debería manejar errores correctamente', async () => {
    // Configurar el mock para simular un error
    const mockError = new Error('Cloudinary error');
    (mockCloudinary.search.execute as jest.Mock).mockRejectedValue(mockError);

    const result = await findImageInCloudinary('error-image');
    
    expect(result).toBeNull();
    expect(mockCloudinary.search.expression).toHaveBeenCalledWith('public_id:phrases_images/error-image');
  });
}); 