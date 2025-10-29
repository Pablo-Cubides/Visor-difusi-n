# ✅ PLAN DE ACCIÓN - VISOR DE DIFUSIÓN
## Pasos Concretos para Producción

**Generado:** 27 de Octubre de 2025  
**Objetivo:** Desplegar en producción en 2-3 semanas  
**Recursos Requeridos:** 1-2 desarrolladores

---

## 🎯 OBJETIVO GENERAL

Desplegar Visor de Difusión a producción con máximo nivel de confiabilidad, seguridad y performance.

---

## 🎨 RESUMEN DE MEJORAS FRONTEND - TEMA NEGRO

### Cambio Principal: Tema Negro Profesional

**Problema actual:** Frontend blanco anticuado, sin WCAG AA, falta accesibilidad

**Solución:** Implementar tema negro profesional con mejoras UX y WCAG AA completa

#### 1. Actualizar Tailwind Config
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Tema Negro Profesional
        background: '#0F172A',           // Fondo principal oscuro
        'background-secondary': '#1E293B', // Cards y componentes
        'text-primary': '#F1F5F9',       // Texto principal blanco
        'text-secondary': '#CBD5E1',     // Texto secundario gris
        'accent-primary': '#60A5FA',     // Azul suave
        'accent-secondary': '#34D399',   // Verde esmeralda
        'accent-warning': '#FBBF24',     // Amarillo
        'accent-danger': '#F87171',      // Rojo suave
        border: '#334155',               // Bordes oscuros
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(96, 165, 250, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(96, 165, 250, 0.6)' },
        },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
}
```

#### 2. Actualizar globals.css
```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-text-primary;
    font-family: 'Inter', sans-serif;
  }

  button {
    @apply transition-all duration-200;
  }

  button:focus-visible {
    @apply outline-2 outline-offset-2 outline-accent-primary;
  }
}

@layer components {
  .glass {
    @apply bg-background-secondary/80 backdrop-blur-md border border-border;
  }

  .button-primary {
    @apply px-4 py-2 bg-accent-primary text-background rounded-lg font-semibold
           hover:bg-blue-400 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50;
  }

  .button-secondary {
    @apply px-4 py-2 border border-border text-text-primary rounded-lg font-semibold
           hover:bg-background-secondary transition-all duration-200;
  }

  .card {
    @apply bg-background-secondary border border-border rounded-lg p-6 shadow-lg;
  }

  .input {
    @apply bg-background border border-border text-text-primary px-3 py-2 rounded-lg
           focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20;
  }
}
```

#### 3. Actualizar Components
```typescript
// src/components/EducationalPanel.tsx - Ejemplo
export default function EducationalPanel({ upperText, lowerText }: Props) {
  return (
    <div className="glass rounded-lg p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto text-text-secondary mb-4">
        {upperText}
      </div>
      <hr className="border-border my-4" />
      <div className="flex-1 overflow-y-auto text-text-secondary text-sm">
        {lowerText}
      </div>
    </div>
  );
}
```

#### 4. Mejoras UX
- ✅ Agregar loading skeletons mientras carga
- ✅ Spinner visual en botones durante peticiones
- ✅ Transiciones suaves entre estados
- ✅ Responsive grid: 3col → 2col → 1col en móvil
- ✅ Imágenes escalables (no fijo 512x512)
- ✅ Botones 48px+ para touch

#### 5. Accesibilidad WCAG AA
```typescript
// Ejemplo en page.tsx
<button
  onClick={handleStartSimulation}
  aria-label="Iniciar simulación de generación de imágenes con IA"
  className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={!selectedPromptId}
>
  Iniciar Simulación
</button>

<select
  aria-label="Seleccionar caso educativo"
  value={selectedPromptId}
  onChange={(e) => setSelectedPromptId(e.target.value)}
  className="input"
>
  <option value="">Selecciona un caso...</option>
  {prompts.map(p => (
    <option key={p.id} value={p.id}>{p.title}</option>
  ))}
</select>
```

**Resultado esperado:**
- ✅ Tema negro profesional
- ✅ WCAG AA completa (contrast >= 4.5:1)
- ✅ UX mejorada con feedback visual
- ✅ Responsive perfecto en móvil
- ✅ Funcionalidad 100% intacta

**Tiempo estimado:** 4-6 horas de desarrollo

---

## 📋 FASE 1: MEJORAS CRÍTICAS (Semana 1)

### Tarea 1.1: Validación de Inputs con Zod
**Tiempo:** 2-3 horas  
**Prioridad:** 🔴 CRÍTICA  
**Responsable:** Backend Developer

#### Subtareas:
```
[ ] 1.1.1 Instalar Zod
    npm install zod

[ ] 1.1.2 Crear archivo de esquemas
    src/lib/validation.ts
    - StepRequestSchema
    - ExportGifSchema
    - NoiseRequestSchema

[ ] 1.1.3 Actualizar /api/step
    - Validar input con Zod
    - Retornar error 400 si inválido

[ ] 1.1.4 Actualizar /api/prompts
    - Agregar validación básica

[ ] 1.1.5 Actualizar /api/noise/[step]
    - Validar rango de step (2-9)

[ ] 1.1.6 Actualizar /api/export_gif
    - Validar case_id
    - Validar opciones

[ ] 1.1.7 Escribir tests para validaciones
    npm test -- validation

[ ] 1.1.8 Verificar todos los tests pasan
    npm test
```

#### Código de Ejemplo:
```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const StepRequestSchema = z.object({
  prompt_id: z.string()
    .min(1, 'prompt_id requerido')
    .max(50, 'prompt_id muy largo'),
  step: z.number()
    .int('step debe ser entero')
    .min(0, 'step no puede ser negativo')
    .max(100, 'step muy grande'),
});

export const ExportGifSchema = z.object({
  case_id: z.string().min(1),
  include_noise: z.boolean().optional().default(true),
  overlay_opacity: z.number().min(0).max(1).optional(),
  frame_ms: z.number().int().min(100).max(5000).optional(),
});

// src/app/api/step/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = StepRequestSchema.parse(body); // Valida

    // Resto de la lógica...
    return NextResponse.json({ /* ... */ });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }
    // ...
  }
}
```

---

### Tarea 1.2: Implementar Rate Limiting
**Tiempo:** 2-3 horas  
**Prioridad:** 🔴 CRÍTICA  
**Responsable:** Backend Developer

#### Subtareas:
```
[ ] 1.2.1 Elegir solución de rate limiting
    Opción A: Upstash Ratelimit (recomendado)
    Opción B: Custom con Redis
    Opción C: Middleware de Vercel

[ ] 1.2.2 Instalar dependencias
    npm install @upstash/ratelimit @upstash/redis

[ ] 1.2.3 Configurar env vars en Vercel
    - UPSTASH_REDIS_REST_URL
    - UPSTASH_REDIS_REST_TOKEN

[ ] 1.2.4 Crear middleware de rate limiting
    src/lib/rateLimit.ts

[ ] 1.2.5 Aplicar a /api/step
    - Límite: 100 requests/hora por IP

[ ] 1.2.6 Aplicar a /api/export_gif
    - Límite: 20 requests/hora por IP

[ ] 1.2.7 Aplicar a /api/noise/[step]
    - Límite: 500 requests/hora por IP

[ ] 1.2.8 Escribir tests
    npm test -- rateLimit

[ ] 1.2.9 Verificar en staging
```

#### Código de Ejemplo:
```typescript
// src/lib/rateLimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 h"),
});

// src/app/api/step/route.ts
import { headers } from 'next/headers';
import { ratelimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // Continuar con lógica...
}
```

---

### Tarea 1.3: Mejorar SEO Metadata
**Tiempo:** 1-2 horas  
**Prioridad:** 🔴 CRÍTICA  
**Responsable:** Frontend Developer

#### Subtareas:
```
[ ] 1.3.1 Expandir description metadata
    - Agregar keywords: "difusión", "IA", "generación de imágenes"
    - Mantener <160 caracteres

[ ] 1.3.2 Agregar Open Graph tags
    og:title
    og:description
    og:image
    og:url

[ ] 1.3.3 Agregar Twitter Card
    twitter:card
    twitter:title
    twitter:description
    twitter:image

[ ] 1.3.4 Crear/Optimizar og-image.png
    - Dimensiones: 1200x630px
    - Mostrar "Visor de Difusión"

[ ] 1.3.5 Agregar JSON-LD schema
    schema.org/EducationalWebsite

[ ] 1.3.6 Crear sitemap.xml
    npm install next-sitemap

[ ] 1.3.7 Crear robots.txt

[ ] 1.3.8 Verificar con SEO Checker
```

#### Código de Ejemplo:
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Visor de Difusión - Visualiza el Proceso de IA | Aprende sobre Generación de Imágenes",
  description: "Explora interactivamente cómo los modelos de IA como Stable Diffusion y Flux generan imágenes. Herramienta educativa gratuita con casos reales.",
  
  keywords: [
    "difusión de IA",
    "generación de imágenes",
    "Stable Diffusion",
    "Flux",
    "educación",
    "inteligencia artificial",
    "machine learning",
    "visualización"
  ],
  
  openGraph: {
    title: "Visor de Difusión - Visualiza Cómo la IA Genera Imágenes",
    description: "Herramienta educativa interactiva para entender el proceso de difusión en modelos de IA",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Visor de Difusión - Proceso de IA Visualizado",
      }
    ],
    url: "https://visor-difusion.vercel.app",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Visor de Difusión - Visualiza IA en Acción",
    description: "Comprende cómo funcionan los modelos de difusión",
    images: ["/twitter-image.png"],
  },
};

// Agregar JSON-LD Schema
export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalWebsite",
    "name": "Visor de Difusión",
    "description": "Herramienta educativa interactiva para visualizar el proceso de difusión de IA",
    "url": "https://visor-difusion.vercel.app",
    "author": {
      "@type": "Organization",
      "name": "Visor de Difusión"
    }
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🟠 FASE 2: MEJORAS IMPORTANTES (Semana 1-2)

### Tarea 2.1: Agregar Aria Labels
**Tiempo:** 1-2 horas  
**Prioridad:** 🟠 IMPORTANTE  
**Responsable:** Frontend Developer

```typescript
// Actualizar componentes con aria-label
<button 
  onClick={handleStartSimulation}
  aria-label="Iniciar simulación de difusión"
  disabled={!selectedPromptId}
>
  Iniciar Simulación
</button>

<select
  aria-label="Seleccionar caso educativo"
  value={selectedPromptId}
  onChange={(e) => setSelectedPromptId(e.target.value)}
>
  {/* opciones */}
</select>
```

### Tarea 2.2: Logging Centralizado
**Tiempo:** 3-4 horas  
**Prioridad:** 🟠 IMPORTANTE  
**Responsable:** Backend Developer

```bash
npm install pino @logdna/browser
```

### Tarea 2.3: Tests E2E básicos
**Tiempo:** 4 horas  
**Prioridad:** 🟠 IMPORTANTE  
**Responsable:** QA/Frontend Developer

```bash
npm install -D @playwright/test
```

---

## ✅ FASE 3: VALIDACIÓN Y DEPLOYMENT (Semana 2-3)

### Tarea 3.1: Testing Final
**Tiempo:** 2-3 horas  

```bash
[ ] npm run lint        # 0 errores
[ ] npm run test        # Todos pasan
[ ] npm run build       # Exitoso
[ ] npm run type-check  # Sin errores
[ ] npm run test:coverage  # >= 85%
```

### Tarea 3.2: Performance Review
**Tiempo:** 1-2 horas

```bash
[ ] Lighthouse score >= 94
[ ] Bundle size < 200KB
[ ] First Paint < 1.5s
[ ] Core Web Vitals OK
```

### Tarea 3.3: Deployment a Staging
**Tiempo:** 1 hora

```bash
[ ] Conectar a rama staging en Vercel
[ ] Deploy automático
[ ] Validar en staging
[ ] Test de humo básico
```

### Tarea 3.4: Deployment a Producción
**Tiempo:** 30 minutos

```bash
[ ] Merge a main
[ ] Verificar deploy automático
[ ] Validar en producción
[ ] Monitorear errores
```

---

## 📊 MATRIZ DE RESPONSABILIDADES

| Tarea | Dev | Backend | Frontend | QA | Tiempo |
|-------|-----|---------|----------|-----|--------|
| 1.1 - Zod Validation | | ✅ | | | 2-3h |
| 1.2 - Rate Limiting | | ✅ | | | 2-3h |
| 1.3 - SEO | | | ✅ | | 1-2h |
| 2.1 - Aria Labels | | | ✅ | | 1-2h |
| 2.2 - Logging | | ✅ | | | 3-4h |
| 2.3 - E2E Tests | | | | ✅ | 4h |
| 3.x - Deployment | ✅ | | | | 4-5h |

---

## 📅 CALENDARIO RECOMENDADO

### Semana 1
```
Lunes:
  [ ] Revisar informe
  [ ] Crear tickets GitHub
  [ ] Asignar tareas

Martes-Miércoles:
  [ ] Implementar 1.1 (Zod)
  [ ] Implementar 1.2 (Rate Limit)

Jueves-Viernes:
  [ ] Implementar 1.3 (SEO)
  [ ] Tests finales
  [ ] Deploy a staging
```

### Semana 2
```
Lunes-Martes:
  [ ] Validación en staging
  [ ] Arreglar bugs menores
  [ ] Implementar 2.1-2.3

Miércoles:
  [ ] Testing final
  [ ] Performance review
  [ ] Preparar deploy

Jueves-Viernes:
  [ ] Deploy a producción
  [ ] Monitoreo y alertas
  [ ] Documentar lecciones aprendidas
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Antes de Deploy
```
CÓDIGO:
☐ Validación Zod implementada
☐ Rate limiting configurado
☐ Todos tests pasan (npm test)
☐ Linting sin errores (npm run lint)
☐ Build exitoso (npm run build)
☐ Type checking sin errores

SEGURIDAD:
☐ Secrets en Vercel
☐ Headers de seguridad
☐ CORS configurado
☐ No hay secrets en código

SEO:
☐ Metadata actualizada
☐ JSON-LD schema agregado
☐ Sitemap.xml creado
☐ robots.txt configurado

PERFORMANCE:
☐ Lighthouse >= 94
☐ Bundle < 200KB
☐ FCP < 1.5s
☐ Images optimizadas

DOCUMENTACIÓN:
☐ README.md actualizado
☐ CHANGELOG.md iniciado
☐ API docs completa
☐ Deployment guide listo

MONITOREO:
☐ Vercel Analytics habilitado
☐ Error tracking configurado
☐ Alertas configuradas
☐ Logs centralizados
```

### Después de Deploy
```
VALIDACIÓN:
☐ Sitio carga correctamente
☐ API endpoints responden
☐ No errores en console
☐ Responsive en móvil

TESTING:
☐ Flujo completo funciona
☐ Casos se cargan
☐ Simulación funciona
☐ GIF descarga

MONITOREO:
☐ Check analytics en vivo
☐ Monitorear error rate
☐ Verificar performance
☐ Check de tráfico
```

---

## 📞 ESCALACIÓN Y SOPORTE

### Equipo Requerido
- **1 Backend Developer** - Zod + Rate Limiting
- **1 Frontend Developer** - SEO + UI
- **1 DevOps/QA** - Testing + Deployment

### Herramientas Necesarias
- Vercel account admin
- GitHub admin
- Sentry (opcional pero recomendado)
- Upstash Redis (para rate limiting)

---

## 💡 TIPS Y BUENAS PRÁCTICAS

### Para Implementación Rápida
1. **Enfocarse en críticos primero** - No perfectar todo
2. **Tests mientras se desarrolla** - TDD acelera
3. **Deploy a staging temprano** - Validar antes de prod
4. **Comunicación clara** - Daily standups de 15 min
5. **Documentar mientras se hace** - No dejar para después

### Para Evitar Problemas
1. ❌ No hacer todos los cambios al mismo tiempo
2. ❌ No saltar testing
3. ❌ No desplegar sin validar en staging
4. ❌ No ignorar warnings de TypeScript
5. ❌ No olvidar monitoreo post-deploy

---

## 📈 MÉTRICAS DE ÉXITO

Después de completar este plan, se deben cumplir:

```
✅ Zero critical bugs en producción
✅ Lighthouse score >= 94
✅ < 1% error rate
✅ Response time < 500ms
✅ Uptime > 99.9%
✅ Test coverage >= 85%
✅ SEO score >= 90
```

---

## 🎯 CONCLUSIÓN

Siguiendo este plan de acción:

- ✅ Todas las mejoras críticas se implementan en 5-6 horas
- ✅ Deployment es seguro y predecible
- ✅ Equipo está alineado
- ✅ Riesgos minimizados
- ✅ Monitoring asegurado

**Estimación total:** 2-3 semanas para lanzamiento seguro

**Estado:** Listo para comenzar

🚀 **¡A implementar!**
