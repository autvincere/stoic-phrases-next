import { jest } from "@jest/globals"

// Definir las interfaces para los tipos de Cloudinary
interface CloudinaryResource {
  public_id: string
  secure_url: string
}

interface CloudinaryResponse {
  resources: CloudinaryResource[]
}

interface CloudinaryMock {
  search: {
    expression: jest.Mock
    execute: jest.Mock
  }
}

describe("Cloudinary Mock", () => {
  let mockCloudinary: CloudinaryMock

  beforeEach(() => {
    // Crear una nueva instancia del mock para cada prueba
    mockCloudinary = {
      search: {
        expression: jest.fn().mockReturnThis(),
        execute: jest.fn()
      }
    }
  })

  afterEach(() => {
    // Limpiar todos los mocks después de cada prueba
    jest.clearAllMocks()
  })

  it("debería configurar correctamente el mock de expression", () => {
    // Verificar que expression devuelve this (para encadenamiento)
    const result = mockCloudinary.search.expression("test")
    expect(result).toBe(mockCloudinary.search)
    expect(mockCloudinary.search.expression).toHaveBeenCalledWith("test")
  })

  it("debería simular una respuesta exitosa de búsqueda", async () => {
    const mockImage: CloudinaryResource = {
      public_id: "phrases_images/test-image",
      secure_url: "https://res.cloudinary.com/test/test-image.jpg"
    }

    const mockResponse: CloudinaryResponse = {
      resources: [mockImage]
    }

    // Configurar el mock para devolver una respuesta exitosa
    mockCloudinary.search.execute.mockResolvedValue(mockResponse)

    // Ejecutar la búsqueda
    const result = await mockCloudinary.search.execute()

    // Verificar el resultado
    expect(result).toEqual(mockResponse)
    expect(mockCloudinary.search.execute).toHaveBeenCalled()
  })

  it("debería simular una respuesta vacía", async () => {
    const mockResponse: CloudinaryResponse = {
      resources: []
    }

    // Configurar el mock para devolver una respuesta vacía
    mockCloudinary.search.execute.mockResolvedValue(mockResponse)

    // Ejecutar la búsqueda
    const result = await mockCloudinary.search.execute()

    // Verificar el resultado
    expect(result).toEqual(mockResponse)
    expect(mockCloudinary.search.execute).toHaveBeenCalled()
  })

  it("debería simular un error", async () => {
    const mockError = new Error("Cloudinary error")

    // Configurar el mock para lanzar un error
    mockCloudinary.search.execute.mockRejectedValue(mockError)

    // Verificar que el error se lanza correctamente
    await expect(mockCloudinary.search.execute()).rejects.toThrow("Cloudinary error")
  })

  it("debería mantener el encadenamiento de métodos", () => {
    // Verificar que podemos encadenar expression y execute
    const mockImage: CloudinaryResource = {
      public_id: "phrases_images/test-image",
      secure_url: "https://res.cloudinary.com/test/test-image.jpg"
    }

    const mockResponse: CloudinaryResponse = {
      resources: [mockImage]
    }

    // Configurar el mock para el encadenamiento
    mockCloudinary.search.expression.mockReturnThis()
    mockCloudinary.search.execute.mockResolvedValue(mockResponse)

    // Ejecutar el encadenamiento
    const result = mockCloudinary.search.expression("test").execute()

    // Verificar que se llamaron los métodos en el orden correcto
    expect(mockCloudinary.search.expression).toHaveBeenCalledWith("test")
    expect(result).resolves.toEqual(mockResponse)
  })
})
