//rag
import { NextResponse } from "next/server";
import { pool } from "../../../../db";

export async function GET() {
  try {
    // Query para obtener una fila aleatoria
    const result = await pool.query("SELECT * FROM phrases ORDER BY RANDOM() LIMIT 1");
    
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "No phrases available" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 400 });
    }
  }
}
