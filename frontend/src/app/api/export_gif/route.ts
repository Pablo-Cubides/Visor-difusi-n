import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { loadDynamicCases } from '../_lib/cases';

const STATIC_CASES_DIR = path.join(process.cwd(), 'public', 'static', 'cases');
const STATIC_NOISE_DIR = path.join(process.cwd(), 'public', 'static');

// Load cases (similar to other routes)
const predefinedCases = loadDynamicCases();

async function generateGifBytes(
  stepFiles: string[],
  includeNoise: boolean = true,
  overlayPaths: string[] = [],
  overlayOpacity: number = 0.8,
  frameMs: number = 350,
  lingerLastMs: number = 1000
): Promise<Buffer> {
  const frames: Buffer[] = [];
  const delays: number[] = [];

  for (let idx = 0; idx < stepFiles.length; idx++) {
    const stepFile = stepFiles[idx];
    let baseImage: sharp.Sharp;

    try {
      baseImage = sharp(stepFile);
    } catch (error) {
      // Create a placeholder
      baseImage = sharp({
        create: {
          width: 512,
          height: 512,
          channels: 3,
          background: { r: 200, g: 200, b: 200 }
        }
      });
    }

    // Apply noise overlay if requested
    if (includeNoise && overlayPaths[idx]) {
      const overlayPath = overlayPaths[idx];
      if (fs.existsSync(overlayPath)) {
        try {
          const overlayBuffer = fs.readFileSync(overlayPath);
          const baseBuffer = await baseImage.png().toBuffer();

          // For opacity, we need to modify the overlay
          const overlayWithOpacity = await sharp(overlayBuffer)
            .composite([{
              input: Buffer.from([255, 255, 255, Math.floor(overlayOpacity * 255)]),
              blend: 'dest-in'
            }])
            .png()
            .toBuffer();

          const composited = await sharp(baseBuffer)
            .composite([{
              input: overlayWithOpacity,
              blend: 'over'
            }])
            .png()
            .toBuffer();

          baseImage = sharp(composited);
        } catch (error) {
          console.error('Error applying overlay', error);
        }
      }
    }

    // Convert to RGB for GIF
    const frameBuffer = await baseImage
      .resize(512, 512, { withoutEnlargement: true })
      .png()
      .toBuffer();

    frames.push(frameBuffer);
    delays.push(idx === stepFiles.length - 1 ? lingerLastMs : frameMs);
  }

  if (frames.length === 0) {
    throw new Error('No frames to generate GIF');
  }

  // Use sharp to create animated GIF
  const gifBuffer = await sharp(frames[0])
    .gif({ delay: delays })
    .toBuffer();

  return gifBuffer;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const caseId = searchParams.get('case_id');
  const overlayOpacity = parseFloat(searchParams.get('overlay_opacity') || '0.8');
  const includeNoise = searchParams.get('include_noise') !== 'false';
  const frameMs = parseInt(searchParams.get('frame_ms') || '350', 10);
  const lingerLastMs = parseInt(searchParams.get('linger_last_ms') || '1000', 10);

  if (!caseId || !predefinedCases[caseId]) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  const caseData = predefinedCases[caseId];
  const stepFiles = caseData.step_files;

  if (!stepFiles || stepFiles.length === 0) {
    return NextResponse.json({ error: 'No hay imágenes de pasos para este caso' }, { status: 404 });
  }

  // Safety limits for Vercel
  const maxFrames = 20;
  const maxPixels = 512 * 512 * maxFrames;
  const estimatedMemoryMB = (maxPixels * 4) / (1024 * 1024); // Rough estimate

  if (stepFiles.length > maxFrames) {
    return NextResponse.json({ error: 'Too many frames' }, { status: 413 });
  }

  if (estimatedMemoryMB > 100) { // 100MB limit
    return NextResponse.json({ error: 'GIF too large' }, { status: 413 });
  }

  const overlayPaths: string[] = [];
  if (includeNoise) {
    for (let i = 1; i <= stepFiles.length; i++) {
      overlayPaths.push(path.join(STATIC_NOISE_DIR, `noise_step_${i}.png`));
    }
  }

  try {
    const gifBytes = await generateGifBytes(
      stepFiles,
      includeNoise,
      overlayPaths,
      overlayOpacity,
      frameMs,
      lingerLastMs
    );

    const filename = `diffusion_case_${caseId}.gif`;
    const headers = {
      'Content-Disposition': `attachment; filename=${filename}`,
      'Cache-Control': 'no-store',
      'Content-Type': 'image/gif',
    };

    return new Response(new Uint8Array(gifBytes), {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Error generating GIF', error as Error);
    return NextResponse.json({ error: 'Error generating GIF' }, { status: 500 });
  }
}