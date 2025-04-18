import { NextRequest } from "next/server";
import { GET } from "../../route";
import { pool } from "../../../../../../db";

// Mock the pool.query function
jest.mock("../../../../../../db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("GET /api/phrases - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería devolver una frase aleatoria cuando no hay parámetro 'all'", async () => {
    // Mock data
    const mockPhrase = {
      id: 1,
      author: "Test Author",
      phrase: "Test Phrase",
      image_url: "test.jpg",
    };

    // Mock pool.query
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockPhrase] });

    // Create mock request
    const req = new NextRequest("http://localhost:3000/api/phrases");

    // Call the GET function
    const response = await GET(req);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toEqual(mockPhrase);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM phrases ORDER BY RANDOM() LIMIT 1"
    );
  });

  it("debería devolver todas las frases cuando se incluye el parámetro 'all'", async () => {
    // Mock data
    const mockPhrases = [
      {
        id: 1,
        author: "Test Author 1",
        phrase: "Test Phrase 1",
        image_url: "test1.jpg",
      },
      {
        id: 2,
        author: "Test Author 2",
        phrase: "Test Phrase 2",
        image_url: "test2.jpg",
      },
    ];

    // Mock pool.query
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: mockPhrases });

    // Create mock request with 'all' parameter
    const req = new NextRequest("http://localhost:3000/api/phrases?all=true");

    // Call the GET function
    const response = await GET(req);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toEqual(mockPhrases);
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM phrases");
  });

  it("debería manejar errores correctamente", async () => {
    // Mock error
    const mockError = new Error("Database error");
    (pool.query as jest.Mock).mockRejectedValueOnce(mockError);

    // Create mock request
    const req = new NextRequest("http://localhost:3000/api/phrases");

    // Call the GET function
    const response = await GET(req);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Database error" });
  });
}); 