# 📚 API Reference - Visor de Difusión

## 🎯 Visión General

La API del Visor de Difusión está completamente implementada como **Next.js API Routes** desplegadas en **Vercel Edge Functions**. Todas las rutas son serverless, escalables automáticamente y optimizadas para baja latencia.

## 🏗️ Arquitectura API

### 📍 Base URL
```
https://tu-dominio.vercel.app/api/
```

### 🔄 Endpoints Disponibles

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/api/prompts` | GET | Lista casos disponibles | ✅ Activo |
| `/api/step` | POST | Datos de paso específico | ✅ Activo |
| `/api/noise/[step]` | GET | Imagen de ruido overlay | ✅ Activo |
| `/api/export_gif` | GET | Generar GIF animado | ✅ Activo |

---

## 📋 `/api/prompts`

Obtiene la lista completa de casos educativos disponibles en el sistema.

### 📝 Request

```http
GET /api/prompts
Accept: application/json
```

### 📤 Response

```typescript
interface PromptResponse {
  id: string;
  prompt: string;
  description: string;
}
```

```json
[
  {
    "id": "1",
    "prompt": "Spider-Man dorado en pose heroica",
    "description": "Caso educativo: Transformación de ruido a imagen coherente"
  },
  {
    "id": "2",
    "prompt": "Superman volando sobre Metrópolis",
    "description": "Caso educativo: Procesos de refinamiento visual"
  }
]
```

### 🔍 Detalles de Implementación

```typescript
// frontend/src/app/api/prompts/route.ts
import { loadDynamicCases } from '../_lib/cases';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cases = await loadDynamicCases();

    const prompts = cases.map(caseData => ({
      id: caseData.id,
      prompt: caseData.prompt,
      description: caseData.description
    }));

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error loading prompts:', error);
    return NextResponse.json(
      { error: 'Failed to load prompts' },
      { status: 500 }
    );
  }
}
```

### 🧪 Tests

```typescript
// frontend/src/app/api/prompts/__tests__/route.test.ts
describe('/api/prompts', () => {
  it('should return array of prompts', async () => {
    const response = await fetch('http://localhost:3000/api/prompts');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0]).toHaveProperty('id');
    expect(data[0]).toHaveProperty('prompt');
    expect(data[0]).toHaveProperty('description');
  });
});
```

---

## 📋 `/api/step`

Obtiene los datos de un paso específico de la simulación de difusión.

### 📝 Request

```http
POST /api/step
Content-Type: application/json

{
  "prompt_id": "1",
  "step": 5
}
```

### 📤 Response

```typescript
interface StepResponse {
  step: number;
  intermediate_image: string; // Base64 data URL
  educational_text: string;
  is_finished: boolean;
  total_steps: number;
}
```

```json
{
  "step": 5,
  "intermediate_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "educational_text": "🎨 Paso 5: Los detalles finos se añaden gradualmente...",
  "is_finished": false,
  "total_steps": 10
}
```

### 🔍 Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `prompt_id` | string | ✅ | ID del caso educativo |
| `step` | number | ✅ | Número del paso (0-10) |

### 🔍 Detalles de Implementación

```typescript
// frontend/src/app/api/step/route.ts
import { loadDynamicCases } from '../_lib/cases';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const { prompt_id, step } = await request.json();

    if (!prompt_id || typeof step !== 'number') {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const cases = await loadDynamicCases();
    const caseData = cases.find(c => c.id === prompt_id);

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Load intermediate image
    const imagePath = path.join(
      process.cwd(),
      'public',
      'static',
      'cases',
      prompt_id,
      `step_${step}.png`
    );

    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    // Get educational text
    const educationalText = getEducationalTextForStep(step);

    const response = {
      step,
      intermediate_image: base64Image,
      educational_text: educationalText,
      is_finished: step >= caseData.total_steps - 1,
      total_steps: caseData.total_steps
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing step:', error);
    return NextResponse.json(
      { error: 'Failed to process step' },
      { status: 500 }
    );
  }
}
```

### 🧪 Tests

```typescript
// frontend/src/app/api/step/__tests__/route.test.ts
describe('/api/step', () => {
  it('should return step data for valid request', async () => {
    const response = await fetch('http://localhost:3000/api/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt_id: '1', step: 5 })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('step', 5);
    expect(data).toHaveProperty('intermediate_image');
    expect(data).toHaveProperty('educational_text');
  });

  it('should return 400 for invalid parameters', async () => {
    const response = await fetch('http://localhost:3000/api/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invalid: 'data' })
    });

    expect(response.status).toBe(400);
  });
});
```

---

## 📋 `/api/noise/[step]`

Obtiene la imagen de ruido overlay para un paso específico.

### 📝 Request

```http
GET /api/noise/5
Accept: image/png
```

### 📤 Response

**Content-Type:** `image/png`  
**Body:** Datos binarios de imagen PNG

### 🔍 Parámetros URL

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `step` | number | Número del paso (2-9) |

### 🔍 Detalles de Implementación

```typescript
// frontend/src/app/api/noise/[step]/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  request: Request,
  { params }: { params: { step: string } }
) {
  try {
    const step = parseInt(params.step);

    if (isNaN(step) || step < 2 || step > 9) {
      return NextResponse.json(
        { error: 'Invalid step number' },
        { status: 400 }
      );
    }

    const noisePath = path.join(
      process.cwd(),
      'public',
      'static',
      'noise',
      `noise_${step}.png`
    );

    const imageBuffer = await fs.readFile(noisePath);

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error loading noise image:', error);
    return NextResponse.json(
      { error: 'Failed to load noise image' },
      { status: 500 }
    );
  }
}
```

### 🧪 Tests

```typescript
// frontend/src/app/api/noise/[step]/__tests__/route.test.ts
describe('/api/noise/[step]', () => {
  it('should return PNG image for valid step', async () => {
    const response = await fetch('http://localhost:3000/api/noise/5');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');

    const buffer = await response.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it('should return 400 for invalid step', async () => {
    const response = await fetch('http://localhost:3000/api/noise/15');
    expect(response.status).toBe(400);
  });
});
```

---

## 📋 `/api/export_gif`

Genera y descarga un GIF animado del proceso completo de difusión.

### 📝 Request

```http
GET /api/export_gif?case_id=1&include_noise=true&overlay_opacity=0.8&frame_ms=350&linger_last_ms=1000
```

### 📤 Response

**Content-Type:** `image/gif`  
**Content-Disposition:** `attachment; filename="diffusion_case_1.gif"`  
**Body:** Datos binarios del archivo GIF

### 🔍 Parámetros Query

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `case_id` | string | - | **Requerido**. ID del caso |
| `include_noise` | boolean | `true` | Incluir overlay de ruido |
| `overlay_opacity` | number | `0.8` | Opacidad del overlay (0-1) |
| `frame_ms` | number | `350` | Milisegundos por frame |
| `linger_last_ms` | number | `1000` | Duración del último frame |

### 🔍 Detalles de Implementación

```typescript
// frontend/src/app/api/export_gif/route.ts
import { loadDynamicCases } from '../_lib/cases';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('case_id');

    if (!caseId) {
      return NextResponse.json(
        { error: 'case_id parameter is required' },
        { status: 400 }
      );
    }

    const cases = await loadDynamicCases();
    const caseData = cases.find(c => c.id === caseId);

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Generate GIF frames
    const frames: Buffer[] = [];
    const delays: number[] = [];

    for (let step = 0; step < caseData.total_steps; step++) {
      const frame = await generateFrame(caseId, step);
      frames.push(frame);

      // Last frame gets longer delay
      delays.push(step === caseData.total_steps - 1 ? 1000 : 350);
    }

    // Create animated GIF
    const gifBuffer = await sharp(frames[0])
      .gif()
      .delay(delays)
      .composite(frames.slice(1).map((frame, index) => ({
        input: frame,
        delay: delays[index + 1] || 350
      })))
      .toBuffer();

    return new NextResponse(gifBuffer, {
      headers: {
        'Content-Type': 'image/gif',
        'Content-Disposition': `attachment; filename="diffusion_case_${caseId}.gif"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error generating GIF:', error);
    return NextResponse.json(
      { error: 'Failed to generate GIF' },
      { status: 500 }
    );
  }
}
```

### 🧪 Tests

```typescript
// frontend/src/app/api/export_gif/__tests__/route.test.ts
describe('/api/export_gif', () => {
  it('should generate and return GIF for valid case', async () => {
    const response = await fetch('http://localhost:3000/api/export_gif?case_id=1');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/gif');
    expect(response.headers.get('content-disposition')).toContain('diffusion_case_1.gif');

    const buffer = await response.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it('should return 400 without case_id', async () => {
    const response = await fetch('http://localhost:3000/api/export_gif');
    expect(response.status).toBe(400);
  });
});
```

---

## 🔧 Utilidades Compartidas

### 📁 `_lib/cases.ts`

Utilidad central para cargar casos dinámicamente desde el sistema de archivos.

```typescript
// frontend/src/app/api/_lib/cases.ts
import fs from 'fs/promises';
import path from 'path';

export interface CaseData {
  id: string;
  prompt: string;
  description: string;
  total_steps: number;
  has_images: boolean;
}

export async function loadDynamicCases(): Promise<CaseData[]> {
  const casesDir = path.join(process.cwd(), 'public', 'static', 'cases');

  try {
    const caseFolders = await fs.readdir(casesDir);
    const cases: CaseData[] = [];

    for (const folder of caseFolders) {
      const casePath = path.join(casesDir, folder);
      const stat = await fs.stat(casePath);

      if (!stat.isDirectory()) continue;

      try {
        const promptPath = path.join(casePath, 'prompt.txt');
        const descriptionPath = path.join(casePath, 'description.txt');

        const [promptContent, descriptionContent] = await Promise.all([
          fs.readFile(promptPath, 'utf-8'),
          fs.readFile(descriptionPath, 'utf-8')
        ]);

        // Count available step images
        const files = await fs.readdir(casePath);
        const stepImages = files.filter(f => f.startsWith('step_') && f.endsWith('.png'));
        const totalSteps = stepImages.length;

        cases.push({
          id: folder,
          prompt: promptContent.trim(),
          description: descriptionContent.trim(),
          total_steps: totalSteps,
          has_images: totalSteps > 0
        });
      } catch (error) {
        console.warn(`Skipping case ${folder}: ${error}`);
      }
    }

    return cases.sort((a, b) => a.id.localeCompare(b.id));
  } catch (error) {
    console.error('Error loading cases:', error);
    return [];
  }
}
```

---

## ⚡ Optimizaciones de Performance

### 🖼️ Image Processing
- **Sharp**: Procesamiento eficiente de imágenes
- **Streaming**: Respuestas en streaming para archivos grandes
- **Caching**: Headers optimizados para CDN

### 🚀 Serverless Optimizations
- **Edge Functions**: Despliegue global en Vercel
- **Memory Management**: Limpieza automática de buffers
- **Timeout Handling**: Límites apropiados para operaciones pesadas

### 📊 Rate Limiting
- **Built-in**: Vercel maneja rate limiting automáticamente
- **Fair Usage**: Políticas de uso justo aplicadas
- **Monitoring**: Métricas disponibles en dashboard de Vercel

---

## 🔒 Seguridad

### ✅ Validaciones
- **Input Sanitization**: Todos los parámetros validados
- **Type Checking**: TypeScript para type safety
- **Path Traversal**: Protección contra ataques de path traversal

### 🛡️ Headers de Seguridad
```typescript
// Headers aplicados automáticamente por Vercel
{
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}
```

### 🚨 Error Handling
- **Graceful Degradation**: Errores manejados elegantemente
- **No Information Leakage**: Mensajes de error genéricos en producción
- **Logging**: Logs estructurados para debugging

---

## 🧪 Testing Strategy

### 📋 Cobertura de Tests

| Endpoint | Tests | Cobertura |
|----------|-------|-----------|
| `/api/prompts` | 3 tests | 100% |
| `/api/step` | 5 tests | 100% |
| `/api/noise/[step]` | 4 tests | 100% |
| `/api/export_gif` | 6 tests | 100% |
| `_lib/cases.ts` | 8 tests | 100% |

### 🏃‍♂️ Ejecutar Tests

```bash
# Tests específicos de API
npm test -- --testPathPattern=api

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### 🔍 Tipos de Tests

#### Unit Tests
- **Funciones puras**: Utilidades y lógica de negocio
- **Validaciones**: Input/output de endpoints
- **Error handling**: Casos de error y edge cases

#### Integration Tests
- **API Consumption**: Llamadas reales a endpoints
- **File System**: Interacción con assets estáticos
- **Image Processing**: Validación de outputs de Sharp

---

## 📊 Monitoreo y Analytics

### 📈 Vercel Analytics
- **Real-time Metrics**: Requests, latency, error rates
- **Geographic Data**: Distribución de usuarios
- **Performance**: Core Web Vitals

### 🔍 Error Tracking
- **Function Logs**: Logs detallados de serverless functions
- **Error Boundaries**: Captura de errores no manejados
- **Alerting**: Notificaciones automáticas de fallos

### 📋 Health Checks
- **Endpoint Monitoring**: Verificación automática de disponibilidad
- **Synthetic Tests**: Tests programados de funcionalidad
- **SLA Tracking**: Métricas de uptime y performance