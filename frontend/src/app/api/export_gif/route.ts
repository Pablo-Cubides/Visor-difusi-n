import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { loadDynamicCases } from '../_lib/cases';

const STATIC_CASES_DIR = path.join(process.cwd(), 'public', 'static', 'cases');

// Load cases (similar to other routes)
const predefinedCases = loadDynamicCases();

export async function GET(request: NextRequest) {
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

  try {
    const gifBuffer = fs.readFileSync(gifPath);

    const filename = `diffusion_case_${caseId}.gif`;
    const headers = {
      'Content-Disposition': `attachment; filename=${filename}`,
      'Cache-Control': 'no-store',
      'Content-Type': 'image/gif',
    };

    return new Response(gifBuffer, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Error reading pregenerated GIF', error as Error);
    return NextResponse.json({ error: 'Error leyendo GIF' }, { status: 500 });
  }
}