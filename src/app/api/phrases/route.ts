import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

const allowedOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL || '*';

// interface Phrase {
//   id: number;
//   author: string;
//   phrase: string;
//   image_url: string | null;
// }

/**
 * Función utilitaria para configurar la respuesta con CORS.
 * @param data - Los datos a incluir en la respuesta.
 * @param {number} status - El código de estado de la respuesta.
 * @returns {NextResponse} Una respuesta HTTP con los datos y el estado especificado.
 */
function createResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/**
 * Maneja las solicitudes GET para obtener frases aleatorias o todas.
 * @param {NextRequest} req - La solicitud HTTP.
 * @returns {Promise<NextResponse> | {error: string}} Una respuesta HTTP con las frases obtenidas o un error.
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const all = searchParams.get('all');

    console.log('Query params:', searchParams.toString());

    if (all !== null) {
      console.log('Getting all phrases');
      const phrases = await getAllPhrases();
      return createResponse(phrases);
    }

    console.log('Getting a random phrase');
    const phrase = await getRandomPhrase();
    return createResponse(phrase);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return createResponse({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
}

// ✅ Manejar solicitudes preflight (CORS)
export function OPTIONS() {
  return createResponse({});
}

async function getRandomPhrase() {
  try {
    // Usando Prisma en lugar de SQL directo
    const phrasesCount = await prisma.phrases.count();

    if (phrasesCount === 0) return null;

    const skip = Math.floor(Math.random() * phrasesCount);
    const phrase = await prisma.phrases.findFirst({
      skip: skip,
    });

    return phrase;
  } catch (error) {
    console.error('Error getting random phrase:', error);
    throw error;
  }
}

async function getAllPhrases() {
  try {
    // Usando Prisma
    return await prisma.phrases.findMany({
      orderBy: { created_at: 'desc' },
    });
  } catch (error) {
    console.error('Error getting all phrases:', error);
    throw error;
  }
}
