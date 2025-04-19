import { NextResponse } from "next/server"
import { pool } from "../../../../db" // Asegúrate de que `db.ts` está bien configurado

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()") // Verifica la conexión ejecutando una consulta simple
    return NextResponse.json({ success: true, time: result.rows[0].now })
  } catch (error) {
    console.error("Error en la API de prueba:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}
