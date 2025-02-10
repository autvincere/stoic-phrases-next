import { NextRequest, NextResponse } from "next/server";
import { pool } from "../../../../db";

export async function GET(req: NextRequest) {
  try {
    // Agregar CORS permitiendo tu dominio en producción
    const origin = req.headers.get("origin");
    const response = NextResponse.json(await getRandomPhrase());

    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    );
  }
}

// ✅ Manejar las solicitudes preflight (CORS)
export function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
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
