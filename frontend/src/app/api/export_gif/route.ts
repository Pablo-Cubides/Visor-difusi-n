import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { loadDynamicCases } from '../_lib/cases';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const STATIC_CASES_DIR = path.join(process.cwd(), 'public', 'static', 'cases');

// Load cases (similar to other routes)
const predefinedCases = loadDynamicCases();

export async function GET(request: NextRequest) {
  try {
    // Rate limiting: máximo 20 requests por hora para export (más restrictivo)
    const headers = request.headers ? Object.fromEntries(request.headers.entries()) : {};
    const ip = getClientIp(headers);
    const rateLimit = checkRateLimit(ip, {
      interval: 3600000, // 1 hora
      maxRequests: 20,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Límite de descargas excedido. Intenta de nuevo en ' + rateLimit.retryAfter + ' segundos.' },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter.toString(),
          }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('case_id');

    if (!caseId || !predefinedCases[caseId]) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    const caseData = predefinedCases[caseId];
    const stepFiles = caseData.step_files;

    if (!stepFiles || stepFiles.length === 0) {
      return NextResponse.json({ error: 'No hay imágenes de pasos para este caso' }, { status: 404 });
    }

    // Check for pregenerated GIF
    const gifPath = path.join(STATIC_CASES_DIR, caseId, 'diffusion.gif');
    if (!fs.existsSync(gifPath)) {
      return NextResponse.json({ error: 'GIF pregenerado no encontrado' }, { status: 404 });
    }

    const gifBuffer = fs.readFileSync(gifPath);

    const filename = `diffusion_case_${caseId}.gif`;
    const responseHeaders = {
      'Content-Disposition': `attachment; filename=${filename}`,
      'Cache-Control': 'no-store',
      'Content-Type': 'image/gif',
    };

    return new Response(gifBuffer, {
      headers: responseHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error in export_gif:', error as Error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}