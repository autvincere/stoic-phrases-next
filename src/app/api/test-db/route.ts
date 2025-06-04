import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL (masked):', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    // Verificar la conexión ejecutando una consulta simple
    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW() as now`;
    console.log('Database connection successful, time:', result[0].now);

    // Intentar contar registros de phrases (puede fallar si no existen)
    let phrasesCount = 0;
    try {
      phrasesCount = await prisma.phrases.count();
      console.log('Phrases count:', phrasesCount);
    } catch (countError) {
      console.log('Could not count phrases (table may not exist yet):', countError instanceof Error ? countError.message : 'Unknown error');
    }

    return NextResponse.json({
      success: true,
      time: result[0].now,
      phrasesCount: phrasesCount,
      database: 'Connected via Prisma',
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Error en la API de prueba:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')
    }, { status: 500 });
  }
}
