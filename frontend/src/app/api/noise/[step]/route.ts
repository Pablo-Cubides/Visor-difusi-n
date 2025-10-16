import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// noise images live under public/static/noise/noise_step_X.png
const STATIC_NOISE_DIR = path.join(process.cwd(), 'public', 'static', 'noise');

export async function GET(
  request: NextRequest,
  { params }: { params: { step: string } }
) {
  const step = parseInt(params.step, 10);

  if (step < 2 || step > 9) {
    return NextResponse.json({ error: 'No hay imagen de ruido para este paso' }, { status: 404 });
  }

  const noiseFile = path.join(STATIC_NOISE_DIR, `noise_step_${step}.png`);

  if (!fs.existsSync(noiseFile)) {
    return NextResponse.json({ error: 'Noise image not found' }, { status: 404 });
  }

  try {
    const imageData = fs.readFileSync(noiseFile);
    const imageBase64 = imageData.toString('base64');
    return NextResponse.json({
      step,
      noise_image: `data:image/png;base64,${imageBase64}`
    });
  } catch (error) {
    console.error('Error reading noise file', error as Error);
    return NextResponse.json({ error: 'Error reading noise image' }, { status: 500 });
  }
}