# 🔧 Guía de Desarrollo - Visor de Difusión

## 🎯 Visión General

Esta guía proporciona instrucciones completas para el desarrollo, testing, debugging y despliegue del **Visor de Difusión**. El proyecto está construido con tecnologías modernas y sigue las mejores prácticas de desarrollo.

## 🏭 Configuración del Entorno

### 📋 Prerrequisitos

| Tecnología | Versión | Comando de verificación |
|------------|---------|-------------------------|
| Node.js | `>=18.17.0` | `node --version` |
| npm | `>=9.0.0` | `npm --version` |
| Git | `>=2.30.0` | `git --version` |
| VS Code | `>=1.80.0` | - |

### 🚀 Instalación Automática

#### Linux/Mac
```bash
# Desde la raíz del proyecto
chmod +x start.sh
./start.sh
```

#### Windows
```bash
# Desde la raíz del proyecto
start.bat
```

### 🔧 Instalación Manual

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd visor-difusion

# 2. Instalar dependencias del frontend
cd frontend
npm ci

# 3. Configurar variables de entorno (opcional)
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir navegador
# http://localhost:3000
```

### 📁 Estructura del Proyecto

```
visor-difusion/
├── 📁 frontend/                    # 🏠 Aplicación Next.js
│   ├── 📁 public/
│   │   └── 📁 static/
│   │       ├── 📁 cases/          # 📚 Casos educativos
│   │       │   ├── 📁 1/          # Caso 1: Spider-Man
│   │       │   │   ├── description.txt
│   │       │   │   ├── prompt.txt
│   │       │   │   └── step_*.png
│   │       └── 📁 noise/          # 🌪️ Imágenes de ruido
│   ├── 📁 src/
│   │   ├── 📁 app/
│   │   │   ├── layout.tsx         # 🎨 Layout principal
│   │   │   ├── page.tsx           # 🏠 Página principal
│   │   │   ├── globals.css        # 🎨 Estilos globales
│   │   │   └── 📁 api/            # 🔌 API Routes
│   │   │       ├── 📁 _lib/       # 🛠️ Utilidades compartidas
│   │   │       ├── 📁 prompts/    # 📋 Endpoint de prompts
│   │   │       ├── 📁 step/       # 📶 Endpoint de pasos
│   │   │       ├── 📁 noise/      # 🌪️ Endpoint de ruido
│   │   │       └── 📁 export_gif/ # 🎬 Endpoint de exportación
│   │   └── 📁 components/         # ⚛️ Componentes React
│   ├── 📁 __tests__/              # 🧪 Tests principales
│   ├── package.json               # 📦 Dependencias
│   ├── tailwind.config.ts         # 🎨 Configuración Tailwind
│   ├── next.config.mjs            # ⚙️ Configuración Next.js
│   ├── jest.setup.js              # 🧪 Configuración Jest
│   ├── .eslintrc.json             # 🔍 Configuración ESLint
│   └── tsconfig.json              # 📝 Configuración TypeScript
├── 📄 README.md                    # 📖 Documentación principal
├── 📄 API_REFERENCE.md             # 🔌 Documentación de APIs
├── 📄 DEVELOPMENT.md               # 🔧 Esta guía
├── 📄 start.sh                     # 🚀 Script de inicio Linux/Mac
├── 📄 start.bat                    # 🚀 Script de inicio Windows
└── 📄 .gitignore                   # 🚫 Archivos ignorados
```

## 🛠️ Stack Tecnológico

### 🎨 Frontend
- **Next.js 15 RC**: Framework React con App Router
- **React 19 RC**: Librería UI con hooks modernos
- **TypeScript 5.0**: Type safety completo
- **Tailwind CSS 3.4**: Utility-first CSS framework

### 🔧 Backend (Serverless)
- **Next.js API Routes**: Endpoints serverless
- **Sharp**: Procesamiento de imágenes de alto rendimiento
- **Node.js 18+**: Runtime de JavaScript

### 🧪 Testing & Quality
- **Jest**: Framework de testing con jsdom
- **React Testing Library**: Testing de componentes
- **ESLint**: Linting con reglas de Next.js
- **Prettier**: Formateo automático de código

### 🚀 Deployment
- **Vercel**: Plataforma de deployment serverless
- **Edge Functions**: Funciones desplegadas globalmente

## 📝 Scripts Disponibles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next out node_modules/.cache"
  }
}
```

### 🎯 Uso Común de Scripts

```bash
# Desarrollo
npm run dev                    # Servidor de desarrollo
npm run type-check            # Verificación de tipos

# Testing
npm test                      # Ejecutar tests
npm run test:watch            # Tests en modo watch
npm run test:coverage         # Tests con reporte de cobertura

# Quality
npm run lint                  # Ejecutar linter
npm run lint:fix              # Corregir errores de linting

# Build
npm run build                 # Build de producción
npm run start                 # Servidor de producción

# Utilidades
npm run clean                 # Limpiar caches
```

## 🔄 Flujo de Desarrollo

### 1. 🎯 Planificación
```bash
# Crear rama de feature
git checkout -b feature/nueva-funcionalidad

# Actualizar rama principal
git pull origin main
```

### 2. 🛠️ Desarrollo
```bash
# Iniciar desarrollo
npm run dev

# Verificar tipos continuamente
npm run type-check

# Ejecutar tests en watch mode
npm run test:watch
```

### 3. 🧪 Testing
```bash
# Ejecutar suite completa
npm test

# Tests con cobertura
npm run test:coverage

# Tests específicos
npm test -- --testPathPattern=api
npm test -- --testNamePattern="should return prompts"
```

### 4. 🔍 Code Quality
```bash
# Verificar linting
npm run lint

# Corregir errores automáticamente
npm run lint:fix

# Verificar build de producción
npm run build
```

### 5. 📝 Commit
```bash
# Verificar cambios
git status
git diff

# Commit siguiendo conventional commits
git commit -m "feat: añadir nueva funcionalidad educativa"

# Push a rama
git push origin feature/nueva-funcionalidad
```

### 6. 🔄 Pull Request
```bash
# Crear Pull Request en GitHub
# Incluir descripción detallada y screenshots si aplica
```

## 🧪 Estrategia de Testing

### 📊 Cobertura Objetivo
- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >85%
- **Lines**: >80%

### 🏗️ Tipos de Tests

#### Unit Tests
```typescript
// Ejemplo: Test de utilidad
describe('loadDynamicCases', () => {
  it('should load cases from filesystem', async () => {
    const cases = await loadDynamicCases();
    expect(cases).toBeInstanceOf(Array);
    expect(cases[0]).toHaveProperty('id');
  });
});
```

#### Component Tests
```typescript
// Ejemplo: Test de componente React
describe('EducationalPanel', () => {
  it('should render educational text', () => {
    render(<EducationalPanel text="Test text" />);
    expect(screen.getByText('Test text')).toBeInTheDocument();
  });
});
```

#### API Tests
```typescript
// Ejemplo: Test de API route
describe('/api/prompts', () => {
  it('should return array of prompts', async () => {
    const response = await request(app).get('/api/prompts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

#### Integration Tests
```typescript
// Ejemplo: Test de flujo completo
describe('Diffusion Simulation Flow', () => {
  it('should complete full simulation', async () => {
    // Simular selección de caso
    // Simular navegación por pasos
    // Verificar estado final
  });
});
```

### 🏃‍♂️ Ejecutar Tests

```bash
# Tests unitarios
npm test

# Tests con watch mode
npm run test:watch

# Tests con cobertura detallada
npm run test:coverage

# Tests específicos
npm test -- --testPathPattern="api/step"
npm test -- --testNamePattern="educational"

# Tests en CI mode
npm test -- --ci --coverage --watchAll=false
```

## 🔍 Debugging

### 🐛 Debugging en Desarrollo

#### Console Logs Estratégicos
```typescript
// En API routes
console.log('🔍 Processing step:', { prompt_id, step });

// En componentes
console.log('🎨 Rendering step:', currentStep);

// En utilidades
console.log('📁 Loading cases from:', casesDir);
```

#### React DevTools
```bash
# Instalar extensión de navegador
# Inspeccionar estado de componentes
# Verificar re-renders innecesarios
```

#### Network Tab
```bash
# Verificar requests a APIs
# Inspeccionar headers y payloads
# Verificar tiempos de respuesta
```

### 🚨 Debugging en Producción

#### Vercel Logs
```bash
# Acceder a Function Logs en dashboard
# Buscar errores específicos
# Verificar timeouts y memory usage
```

#### Error Boundaries
```typescript
// En componentes
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('❌ Error caught:', error, errorInfo);
    // Reportar a servicio de monitoring
  }
}
```

#### Performance Monitoring
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
// ...
```

## 🚀 Despliegue

### Vercel (Recomendado)

#### Configuración Automática
1. **Conectar repositorio** en Vercel
2. **Configurar root directory**: `frontend/`
3. **Vercel detecta automáticamente** Next.js
4. **Deploy automático** en cada push

#### Variables de Entorno
```env
# .env.local (desarrollo)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Vercel Environment Variables
NODE_ENV=production
```

#### Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "nodeVersion": "18.x"
}
```

### 🚀 Despliegue Manual

```bash
# Build de producción
npm run build

# Verificar build
npm run start

# Testing de producción local
curl http://localhost:3000/api/prompts
```

## 🔧 Configuraciones

### 📝 TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 🎨 Tailwind CSS (`tailwind.config.ts`)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        educational: '#10b981',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [],
}

export default config
```

### 🔍 ESLint (`.eslintrc.json`)
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-img-element": "off",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn"
  },
  "ignorePatterns": [
    "node_modules/",
    ".next/",
    "out/",
    "public/static/"
  ]
}
```

### 🧪 Jest (`jest.setup.js`)
```javascript
import '@testing-library/jest-dom'

// Mock de fetch para tests
global.fetch = jest.fn()

// Configuración adicional si es necesaria
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

## 🐛 Troubleshooting

### ❌ Errores Comunes

#### "Cannot find module 'next/babel'"
```bash
# Solución: Verificar configuración de Jest
npm install --save-dev babel-jest @babel/core @babel/preset-env
```

#### "TypeScript errors in API routes"
```bash
# Solución: Verificar tipos de Next.js
npm run type-check
```

#### "Build fails on Vercel"
```bash
# Solución: Verificar build localmente
npm run build
npm run start
```

#### "Images not loading"
```bash
# Solución: Verificar rutas de assets
ls -la public/static/cases/
```

### 🔧 Comandos Útiles

```bash
# Limpiar caches
rm -rf .next node_modules/.cache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Verificar instalación
npm ls --depth=0

# Ver logs detallados
DEBUG=* npm run dev

# Verificar puertos en uso
lsof -i :3000
```

## 📊 Performance

### 🎯 Métricas Objetivo

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| First Contentful Paint | <1.5s | Lighthouse |
| Largest Contentful Paint | <2.5s | Lighthouse |
| Cumulative Layout Shift | <0.1 | Lighthouse |
| First Input Delay | <100ms | Lighthouse |
| Bundle Size | <200KB | webpack-bundle-analyzer |

### 🚀 Optimizaciones

#### Code Splitting
```typescript
// Lazy loading de componentes
const EducationalPanel = dynamic(() => import('../components/EducationalPanel'), {
  loading: () => <div>Loading...</div>
});
```

#### Image Optimization
```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src="/static/cases/1/step_0.png"
  alt="Diffusion step"
  width={512}
  height={512}
  priority
/>
```

#### API Optimization
```typescript
// Response caching
export const revalidate = 3600; // 1 hour

// Streaming responses
return new Response(stream, {
  headers: { 'Content-Type': 'image/gif' }
});
```

## 🤝 Contribución

### 📋 Proceso de Contribución

1. **Fork** el repositorio
2. **Crear** rama de feature: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollo** siguiendo las guías
4. **Testing** completo
5. **Commit** con conventional commits
6. **Push** y crear Pull Request

### 🎯 Estándares de Código

#### Conventional Commits
```bash
feat: añadir nueva funcionalidad
fix: corregir bug específico
docs: actualizar documentación
style: cambios de formato
refactor: refactorización de código
test: añadir o modificar tests
chore: cambios de configuración
```

#### Code Style
- **TypeScript strict mode**: Activado
- **ESLint**: Configurado con reglas de Next.js
- **Prettier**: Formateo automático
- **Imports**: Ordenados y agrupados

#### Naming Conventions
```typescript
// Componentes: PascalCase
const EducationalPanel = () => {};

// Funciones: camelCase
const loadDynamicCases = () => {};

// Variables: camelCase
const currentStep = 0;

// Constantes: UPPER_SNAKE_CASE
const MAX_STEPS = 10;
```

## 📞 Soporte

### 🐛 Reportar Issues

**Template para bugs:**
```markdown
## Descripción
Breve descripción del problema

## Pasos para reproducir
1. Ir a '...'
2. Hacer click en '...'
3. Ver error

## Comportamiento esperado
Qué debería suceder

## Comportamiento actual
Qué sucede en realidad

## Ambiente
- OS: [Windows/Linux/Mac]
- Browser: [Chrome/Firefox/Safari]
- Node.js: [versión]
```

### 💡 Solicitar Features

**Template para features:**
```markdown
## Resumen
Breve descripción de la funcionalidad

## Motivación
Por qué esta funcionalidad es necesaria

## Solución propuesta
Descripción de la implementación

## Alternativas consideradas
Otras soluciones evaluadas

## Impacto
Cómo afecta al resto del sistema
```

### 📧 Contacto

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/visor-difusion/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/visor-difusion/discussions)
- **Email**: [tu-email@ejemplo.com]

---

**🎉 ¡Gracias por contribuir al Visor de Difusión!**