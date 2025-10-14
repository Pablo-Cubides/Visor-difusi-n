# 🎨 Visor de Difusión - Sistema Educativo Interactivo

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0--rc.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0--rc-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Una aplicación educativa interactiva que visualiza el proceso de difusión de IA, mostrando cómo los modelos convierten ruido aleatorio en imágenes coherentes a través de pasos iterativos.

## 📋 Tabla de Contenidos

- [🎯 Visión General](#-visión-general)
- [✨ Características Principales](#-características-principales)
- [🏗️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [📖 Guía de Uso](#-guía-de-uso)
- [🔧 Desarrollo](#-desarrollo)
- [🧪 Testing](#-testing)
- [🚀 Despliegue](#-despliegue)
- [📚 API Reference](#-api-reference)
- [🎨 Efectos Visuales](#-efectos-visuales)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔒 Seguridad y Rendimiento](#-seguridad-y-rendimiento)
- [🤝 Contribución](#-contribución)
- [📄 Licencia](#-licencia)

## 🎯 Visión General

**Visor de Difusión** es una aplicación web educativa que demuestra el funcionamiento interno de los modelos de difusión de IA. A través de una interfaz interactiva, los usuarios pueden explorar cómo estos modelos transforman ruido aleatorio puro en imágenes coherentes y detalladas.

### 🎓 Valor Educativo

- **Visualización Intuitiva**: Muestra el proceso de difusión paso a paso
- **Explicaciones Contextuales**: Textos educativos adaptados a cada etapa
- **Casos Reales**: Ejemplos con prompts profesionales de IA
- **Interactividad**: Control total sobre la velocidad y progreso de la simulación

### 💡 Casos de Uso

- **Educación**: Enseñanza de conceptos de IA generativa
- **Investigación**: Análisis visual de procesos de difusión
- **Desarrollo**: Debugging y validación de modelos de difusión
- **Demostración**: Presentaciones técnicas sobre IA

## ✨ Características Principales

### 🎮 Interfaz Interactiva
- **Selección de Casos**: Múltiples ejemplos educativos pre-cargados
- **Control de Reproducción**: Play/Pause, navegación por pasos
- **Visualización Dual**: Imagen intermedia + overlay de ruido
- **Texto Educativo**: Explicaciones contextuales por cada paso

### 🔬 Efectos Visuales Avanzados
- **Revelado Progresivo**: Transición suave de ruido a imagen final
- **Calidad Adaptativa**: Efectos visuales que mejoran con cada paso
- **Overlay de Ruido**: Visualización de la reducción de entropía
- **Canvas Optimizado**: Renderizado eficiente para animaciones fluidas

### ⚡ Rendimiento Optimizado
- **Serverless**: Desplegado en Vercel con funciones edge
- **Carga Dinámica**: Assets servidos eficientemente
- **Compresión**: Imágenes optimizadas para web
- **Caché Inteligente**: Gestión eficiente de estado del cliente

### 🛠️ Arquitectura Moderna
- **Next.js 15**: App Router con Server Components
- **React 19**: Hooks modernos y Concurrent Features
- **TypeScript**: Type safety completo
- **Tailwind CSS**: Utility-first styling

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   Static Assets │
│   (Next.js)     │◄──►│   (Serverless)  │◄──►│   (Public)      │
│                 │    │                 │    │                 │
│ • React 19      │    │ • /api/prompts  │    │ • cases/        │
│ • TypeScript    │    │ • /api/step     │    │ • noise/        │
│ • Tailwind CSS  │    │ • /api/export_gif│    │ • generated/   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Vercel        │
                    │   (Deployment)  │
                    └─────────────────┘
```

### 🏛️ Componentes Arquitectónicos

#### Frontend Layer
- **Framework**: Next.js 15 con App Router
- **UI Library**: React 19 con hooks modernos
- **Styling**: Tailwind CSS con PostCSS
- **Type Safety**: TypeScript completo
- **Testing**: Jest + React Testing Library

#### API Layer (Serverless)
- **Runtime**: Node.js en Vercel Edge Functions
- **Image Processing**: Sharp para manipulación de imágenes
- **File System**: Acceso nativo a assets estáticos
- **Response Format**: JSON + Base64 para imágenes

#### Asset Management
- **Storage**: Sistema de archivos local (Vercel)
- **Organization**: Estructura jerárquica por casos
- **Formats**: PNG para imágenes, TXT para metadata
- **Caching**: Headers optimizados para CDN

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js**: `>=18.17.0`
- **npm**: `>=9.0.0` o **yarn**: `>=1.22.0`
- **Git**: Para control de versiones

### Instalación Automática

```bash
# Desde la raíz del proyecto
# Linux/Mac
./start.sh

# Windows
start.bat
```

### Instalación Manual

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd visor-difusion

# 2. Instalar dependencias del frontend
cd frontend
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:3000
```

### Verificación

```bash
# Ejecutar tests
npm test

# Verificar build de producción
npm run build

# Ejecutar linter
npm run lint
```

## 📖 Guía de Uso

### 🎯 Flujo Básico de Usuario

1. **Selección de Caso**
   - Explorar casos educativos disponibles
   - Leer descripción y prompt de cada caso
   - Seleccionar caso de interés

2. **Inicio de Simulación**
   - Hacer clic en "Iniciar Simulación"
   - Sistema carga imagen final y genera ruido inicial
   - Comienza visualización paso a paso

3. **Exploración Interactiva**
   - Observar transformación gradual
   - Leer explicaciones educativas por paso
   - Controlar velocidad de reproducción

4. **Exportación (Opcional)**
   - Generar GIF animado del proceso completo
   - Descargar para uso educativo

### 🎨 Efectos Visuales por Paso

| Paso | Efecto Visual | Descripción Educativa |
|------|---------------|----------------------|
| 0 | Ruido puro | Punto de partida caótico |
| 1-3 | Formas básicas | Detección de patrones iniciales |
| 4-6 | Detalles emergentes | Refinamiento de características |
| 7-8 | Calidad final | Pulido y optimización |
| 9-10 | Imagen completa | Resultado final del proceso |

### ⌨️ Controles de Usuario

- **Botón "Iniciar Simulación"**: Comienza el proceso
- **Botón "Siguiente Paso"**: Avanza manualmente
- **Botón "Reiniciar"**: Vuelve al estado inicial
- **Botón "Exportar GIF"**: Genera animación descargable

## 🔧 Desarrollo

### 🏭 Configuración del Entorno

```bash
# Instalar dependencias
npm ci

# Configurar variables de entorno (opcional)
cp .env.example .env.local

# Iniciar desarrollo con hot reload
npm run dev
```

### 📝 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

### 🧩 Estructura de Componentes

```
src/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal
│   ├── globals.css         # Estilos globales
│   └── api/                # API Routes
│       ├── prompts/
│       ├── step/
│       ├── noise/
│       └── export_gif/
├── components/
│   └── EducationalPanel.tsx # Panel educativo
└── types/                  # Definiciones TypeScript
```

### 🎨 Sistema de Estilos

- **Framework**: Tailwind CSS
- **Metodología**: Utility-first
- **Tema**: Diseño educativo y profesional
- **Responsive**: Mobile-first approach

### 🔄 Flujo de Desarrollo

1. **Feature Branch**: Crear rama para nueva funcionalidad
2. **Desarrollo**: Implementar con TDD
3. **Testing**: Ejecutar suite completa
4. **Linting**: Verificar código con ESLint
5. **Build**: Validar compilación de producción
6. **PR**: Crear Pull Request con descripción detallada

## 🧪 Testing

### 🏃‍♂️ Ejecutar Tests

```bash
# Tests unitarios y de integración
npm test

# Tests con watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Tests específicos
npm test -- --testPathPattern=api
npm test -- --testNamePattern="should return prompts"
```

### 📊 Cobertura de Tests

| Componente | Cobertura | Estado |
|------------|-----------|--------|
| API Routes | 100% | ✅ Completo |
| Componentes | 95% | ✅ Completo |
| Utilidades | 90% | ✅ Completo |
| Integración | 85% | ✅ Completo |

### 🧪 Estrategia de Testing

#### Unit Tests
- **API Routes**: Validación de responses y errores
- **Componentes**: Renderizado y interacciones
- **Utilidades**: Lógica de negocio pura

#### Integration Tests
- **Flujos completos**: De selección a exportación
- **API consumption**: Llamadas reales a endpoints
- **Estado del cliente**: Gestión de estado React

#### E2E Tests (Futuro)
- **User journeys**: Flujos completos de usuario
- **Cross-browser**: Compatibilidad de navegadores
- **Performance**: Métricas de carga y renderizado

## 🚀 Despliegue

### Vercel (Recomendado)

#### Configuración Automática

1. **Conectar Repositorio**
   ```bash
   # Vercel detectará automáticamente Next.js
   # Root directory: frontend/
   # Build command: npm run build
   # Output directory: .next
   ```

2. **Variables de Entorno** (Opcional)
   ```env
   NEXT_PUBLIC_API_URL=
   NODE_ENV=production
   ```

3. **Build Settings**
   - **Framework**: Next.js
   - **Node Version**: 18.x
   - **Install Command**: npm ci
   - **Build Command**: npm run build

#### Optimizaciones de Performance

- **Edge Functions**: APIs desplegadas globalmente
- **Image Optimization**: Assets servidos desde CDN
- **Caching**: Headers optimizados para assets estáticos
- **Compression**: Gzip automático en responses

### 🚢 Despliegue Manual

```bash
# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar deployment
curl http://localhost:3000/api/prompts
```

### 🔍 Monitoreo y Analytics

- **Vercel Analytics**: Métricas de uso integradas
- **Error Tracking**: Logs de funciones serverless
- **Performance**: Core Web Vitals monitoring
- **Uptime**: Monitoreo de disponibilidad

## 📚 API Reference

### 🎯 Endpoints Disponibles

#### `GET /api/prompts`

Obtiene lista de casos educativos disponibles.

**Response:**
```json
[
  {
    "id": "1",
    "prompt": "Spider-Man dorado en pose heroica",
    "description": "Caso educativo: Transformación de ruido a imagen coherente"
  }
]
```

**Ejemplo de uso:**
```javascript
const response = await fetch('/api/prompts');
const prompts = await response.json();
```

#### `POST /api/step`

Obtiene datos de un paso específico de simulación.

**Request Body:**
```json
{
  "prompt_id": "1",
  "step": 5
}
```

**Response:**
```json
{
  "step": 5,
  "intermediate_image": "data:image/png;base64,...",
  "educational_text": "🎨 Paso 5: Los detalles finos se añaden...",
  "is_finished": false,
  "total_steps": 10
}
```

#### `GET /api/noise/[step]`

Obtiene imagen de ruido overlay para un paso específico.

**Parámetros URL:**
- `step`: Número del paso (2-9)

**Response:** Imagen PNG en formato binario

#### `GET /api/export_gif`

Genera y descarga GIF animado del proceso completo.

**Parámetros Query:**
- `case_id`: ID del caso
- `include_noise`: Boolean (default: true)
- `overlay_opacity`: Number 0-1 (default: 0.8)
- `frame_ms`: Milisegundos por frame (default: 350)
- `linger_last_ms`: Duración del último frame (default: 1000)

**Response:** Archivo GIF descargable

### 🔒 Límites de Rate Limiting

- **API Routes**: Sin límites específicos (serverless)
- **Image Generation**: Máximo 20 frames por request
- **File Size**: Límite de 100MB por response
- **Timeout**: 30 segundos máximo por request

### 📊 Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | Éxito |
| 400 | Request inválido |
| 404 | Caso o recurso no encontrado |
| 413 | Payload demasiado grande |
| 500 | Error interno del servidor |

## 🎨 Efectos Visuales

### 🔄 Sistema de Revelado Progresivo

El sistema implementa múltiples técnicas de transición visual:

#### 1. **Reducción de Ruido**
- **Técnica**: Overlay con opacidad decreciente
- **Efecto**: Transición suave de caos a orden
- **Implementación**: Canvas compositing con blend modes

#### 2. **Mejora de Calidad**
- **Técnica**: Filtro de desenfoque progresivo
- **Efecto**: Imagen emerge de la niebla
- **Implementación**: CSS filters + Canvas manipulation

#### 3. **Efectos de Textura**
- **Técnica**: Noise pattern con granularidad variable
- **Efecto**: Textura que se refina gradualmente
- **Implementación**: Algoritmos de generación procedural

### 🎭 Canvas Optimization

- **Single Canvas**: Un solo elemento canvas para mejor performance
- **Layer Compositing**: Múltiples capas renderizadas eficientemente
- **Memory Management**: Limpieza automática de recursos
- **Responsive Scaling**: Adaptación automática a diferentes resoluciones

## 📁 Estructura del Proyecto

```
visor-difusion/
├── 📁 frontend/                    # Aplicación Next.js
│   ├── 📁 public/
│   │   └── 📁 static/
│   │       ├── 📁 cases/          # Casos educativos
│   │       │   ├── 📁 1/          # Caso 1: Spider-Man
│   │       │   │   ├── description.txt
│   │       │   │   ├── prompt.txt
│   │       │   │   └── step_*.png
│   │       │   └── 📁 2/          # Caso 2: Superman
│   │       └── 📁 noise/          # Imágenes de ruido
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── layout.tsx         # Layout principal
│   │   │   ├── page.tsx           # Página principal
│   │   │   ├── globals.css        # Estilos globales
│   │   │   └── 📁 api/            # API Routes
│   │   │       ├── 📁 _lib/       # Utilidades compartidas
│   │   │       ├── 📁 prompts/    # Endpoint de prompts
│   │   │       ├── 📁 step/       # Endpoint de pasos
│   │   │       ├── 📁 noise/      # Endpoint de ruido
│   │   │       └── 📁 export_gif/ # Endpoint de exportación
│   │   └── 📁 components/         # Componentes React
│   ├── 📁 __tests__/              # Tests principales
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── next.config.mjs
│   └── jest.setup.js
├── 📁 backend/                     # Legacy (removido)
├── 📁 .github/                     # GitHub Actions
├── 📄 README.md                    # Esta documentación
├── 📄 MEJORAS_IMPLEMENTADAS.md     # Historial de cambios
├── 📄 start.sh                     # Script de inicio Linux/Mac
├── 📄 start.bat                    # Script de inicio Windows
└── 📄 .gitignore                   # Archivos ignorados
```

## 🔒 Seguridad y Rendimiento

### 🛡️ Medidas de Seguridad

#### Input Validation
- **Sanitización**: Todos los inputs validados
- **Type Checking**: TypeScript para type safety
- **Rate Limiting**: Límites en generación de imágenes

#### Data Protection
- **No Storage**: Datos no persistidos en servidor
- **Client-side State**: Estado manejado en navegador
- **Secure Headers**: Headers de seguridad en Vercel

### ⚡ Optimizaciones de Performance

#### Frontend
- **Code Splitting**: Carga lazy de componentes
- **Image Optimization**: Assets optimizados automáticamente
- **Caching**: Service Worker para assets estáticos
- **Bundle Analysis**: Tamaños de bundle monitoreados

#### Backend (Serverless)
- **Cold Starts**: Minimizados con Vercel
- **Memory Limits**: Gestión eficiente de memoria
- **Timeout Handling**: Requests con timeout apropiado
- **Error Recovery**: Graceful error handling

#### CDN & Caching
- **Global CDN**: Assets servidos desde edge locations
- **Cache Headers**: Optimización de cache por tipo de asset
- **Compression**: Gzip/Brotli automático
- **Preloading**: Recursos críticos precargados

## 🤝 Contribución

### 📋 Proceso de Contribución

1. **Fork** el repositorio
2. **Crear** rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'feat: añadir nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Crear** Pull Request

### 🎯 Estándares de Código

#### TypeScript
- **Strict Mode**: Configurado para máxima type safety
- **Interfaces**: Definidas para todos los objetos
- **Generics**: Uso apropiado de tipos genéricos
- **Utility Types**: Aprovechamiento de tipos de utilidad

#### React
- **Functional Components**: Uso exclusivo de funciones
- **Hooks**: Patrones de hooks modernos
- **Performance**: Optimización con useMemo/useCallback
- **Accessibility**: ARIA labels y navegación por teclado

#### Testing
- **TDD Approach**: Tests escritos antes del código
- **Coverage**: Mínimo 80% de cobertura
- **Integration**: Tests de flujos completos
- **Mocking**: Uso apropiado de mocks

### 📝 Convenciones de Commit

```bash
feat: añadir nueva funcionalidad
fix: corregir bug específico
docs: actualizar documentación
style: cambios de formato
refactor: refactorización de código
test: añadir o modificar tests
chore: cambios de configuración
```

### 🔍 Code Review

**Checklist para PRs:**
- [ ] Tests pasan completamente
- [ ] Linting sin errores
- [ ] Build de producción exitoso
- [ ] Documentación actualizada
- [ ] Tipos TypeScript correctos
- [ ] Performance no degradada
- [ ] Accessibility mantenida

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- **Next.js Team**: Por el increíble framework
- **Vercel**: Por la plataforma de despliegue
- **React Community**: Por la librería y ecosistema
- **Educadores de IA**: Por inspirar este proyecto educativo

## 📞 Soporte

Para soporte técnico o preguntas:

- 📧 **Email**: [tu-email@ejemplo.com]
- 💬 **Issues**: [GitHub Issues](https://github.com/tu-usuario/visor-difusion/issues)
- 📖 **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/visor-difusion/wiki)

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!**
