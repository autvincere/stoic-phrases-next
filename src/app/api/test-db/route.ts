import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    // Verificar la conexión ejecutando una consulta simple
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;

    // También verificar que la tabla Phrases existe y contar registros
    const phrasesCount = await prisma.phrases.count();

    return NextResponse.json({
      success: true,
      time: result[0].now,
      phrasesCount: phrasesCount,
      database: 'Connected via Prisma',
    });
  } catch (error) {
    console.error('Error en la API de prueba:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
