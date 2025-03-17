import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../db";

const allowedOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL || "*";

export async function GET(req: NextRequest) {
  try {
    console.log('GET method detoned:', req.method, req.headers);
    // Obtener una frase aleatoria
    const phrase = await getRandomPhrase();

    const response = NextResponse.json(phrase, {
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400, headers: { "Access-Control-Allow-Origin": allowedOrigin } }
    );
  }
}

// ✅ Manejar las solicitudes preflight (CORS)
export function OPTIONS(req: NextRequest) {
  console.log('OPTIONS request received:', req.method, req.headers);
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

async function getRandomPhrase() {
  const result = await pool.query("SELECT * FROM phrases ORDER BY RANDOM() LIMIT 1");
  if (result.rows.length === 0) throw new Error("No phrases available");
  return result.rows[0];
}
