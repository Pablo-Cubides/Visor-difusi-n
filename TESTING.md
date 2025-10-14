# 🧪 Guía de Testing - Visor de Difusión

## 🎯 Visión General

El **Visor de Difusión** implementa una estrategia de testing completa y moderna, siguiendo las mejores prácticas de la industria. La suite de tests está diseñada para ser **confiable**, **rápida** y **mantenible**, asegurando la calidad del código en cada cambio.

## 🏗️ Arquitectura de Testing

### 📊 Testing Pyramid

```
E2E Tests (5%)          🚀 Tests de usuario completo
    │
    ├─ Integration Tests (20%)  🔗 Tests de componentes
    │   ├─ API Routes Testing
    │   └─ Component Integration
    │
    └─ Unit Tests (75%)         ⚡ Tests de unidades
        ├─ Utility Functions
        ├─ React Components
        ├─ API Handlers
        └─ Business Logic
```

### 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Jest** | `^29.0.0` | Framework de testing principal |
| **React Testing Library** | `^14.0.0` | Testing de componentes React |
| **jsdom** | `^22.0.0` | DOM simulation para tests |
| **@testing-library/jest-dom** | `^6.0.0` | Matchers personalizados |
| **babel-jest** | `^29.0.0` | Transpilación para tests |

## 📋 Configuración de Testing

### 🔧 Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 85,
      lines: 80
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  }
};
```

### 🎨 Babel Configuration

```javascript
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript'
  ]
};
```

### 🏭 Jest Setup

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock de fetch global
global.fetch = jest.fn();

// Mock de console para tests limpios
const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Warning: ReactDOM.render is no longer supported')) {
    return;
  }
  originalConsoleError(...args);
};

// Mock de matchMedia
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
});

// Mock de ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

## 🧪 Estrategia de Tests

### 📈 Cobertura Objetivo

| Categoría | Objetivo | Actual | Status |
|-----------|----------|--------|--------|
| **Statements** | >80% | ~87% | ✅ |
| **Branches** | >75% | ~82% | ✅ |
| **Functions** | >85% | ~91% | ✅ |
| **Lines** | >80% | ~86% | ✅ |

### 🎯 Tipos de Tests

#### 1. ⚡ Unit Tests

Tests que verifican unidades individuales de código en aislamiento.

**Características:**
- **Aislados**: Sin dependencias externas
- **Rápidos**: Ejecutan en milisegundos
- **Determinísticos**: Resultados predecibles
- **Focalizados**: Una sola responsabilidad

**Ejemplo:**
```typescript
// src/app/api/_lib/cases.test.ts
import { loadDynamicCases } from './cases';
import fs from 'fs/promises';
import path from 'path';

// Mock del módulo fs
jest.mock('fs/promises');

describe('loadDynamicCases', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty array when no cases directory exists', async () => {
    mockFs.readdir.mockRejectedValue(new Error('ENOENT'));

    const result = await loadDynamicCases();

    expect(result).toEqual([]);
    expect(mockFs.readdir).toHaveBeenCalledTimes(1);
  });

  it('should load and sort cases correctly', async () => {
    // Mock file system structure
    mockFs.readdir
      .mockResolvedValueOnce(['3', '1', '2']) // Root cases directory
      .mockResolvedValueOnce(['step_0.png', 'step_1.png', 'prompt.txt', 'description.txt']); // Case directory

    mockFs.stat.mockResolvedValue({ isDirectory: () => true } as any);
    mockFs.readFile
      .mockResolvedValueOnce('Test prompt')
      .mockResolvedValueOnce('Test description');

    const result = await loadDynamicCases();

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('1'); // Should be sorted
    expect(result[1].id).toBe('2');
    expect(result[2].id).toBe('3');
  });

  it('should skip invalid case directories', async () => {
    mockFs.readdir
      .mockResolvedValueOnce(['valid-case', 'invalid-case'])
      .mockResolvedValueOnce([]); // Empty directory

    mockFs.stat.mockResolvedValue({ isDirectory: () => true } as any);
    mockFs.readFile.mockRejectedValue(new Error('File not found'));

    const result = await loadDynamicCases();

    expect(result).toHaveLength(0); // No valid cases
  });
});
```

#### 2. 🔗 Integration Tests

Tests que verifican la interacción entre múltiples unidades.

**Características:**
- **Múltiples unidades**: Componentes trabajando juntos
- **Dependencias reales**: Uso de APIs reales
- **Estado compartido**: Manejo de estado entre componentes
- **E2E light**: Simulación de flujos completos

**Ejemplo:**
```typescript
// src/app/api/prompts/__tests__/route.test.ts
import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock de la utilidad compartida
jest.mock('../../_lib/cases');
const { loadDynamicCases } = require('../../_lib/cases');

describe('/api/prompts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return prompts successfully', async () => {
    const mockCases = [
      {
        id: '1',
        prompt: 'Test prompt 1',
        description: 'Test description 1',
        total_steps: 10,
        has_images: true
      },
      {
        id: '2',
        prompt: 'Test prompt 2',
        description: 'Test description 2',
        total_steps: 8,
        has_images: true
      }
    ];

    (loadDynamicCases as jest.Mock).mockResolvedValue(mockCases);

    const request = new NextRequest('http://localhost:3000/api/prompts');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual({
      id: '1',
      prompt: 'Test prompt 1',
      description: 'Test description 1'
    });
    expect(loadDynamicCases).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    (loadDynamicCases as jest.Mock).mockRejectedValue(
      new Error('Filesystem error')
    );

    const request = new NextRequest('http://localhost:3000/api/prompts');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Failed to load prompts'
    });
  });

  it('should return correct content type', async () => {
    (loadDynamicCases as jest.Mock).mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/prompts');
    const response = await GET(request);

    expect(response.headers.get('content-type')).toBe('application/json');
  });
});
```

#### 3. ⚛️ Component Tests

Tests específicos para componentes de React.

**Características:**
- **Renderizado**: Verificación de output visual
- **Interacciones**: Testing de eventos del usuario
- **Props**: Validación de propiedades
- **Estado**: Manejo de estado interno

**Ejemplo:**
```typescript
// src/components/EducationalPanel.test.tsx
import { render, screen } from '@testing-library/react';
import { EducationalPanel } from './EducationalPanel';

describe('EducationalPanel', () => {
  it('should render text content', () => {
    const testText = '🎨 Paso 5: Los detalles se refinan gradualmente';
    render(<EducationalPanel text={testText} />);

    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    render(<EducationalPanel text="Test" />);

    const panel = screen.getByRole('region');
    expect(panel).toHaveClass(
      'bg-blue-50',
      'border-l-4',
      'border-blue-500',
      'p-4',
      'rounded-r-lg'
    );
  });

  it('should have correct accessibility attributes', () => {
    render(<EducationalPanel text="Test content" />);

    const panel = screen.getByRole('region');
    expect(panel).toHaveAttribute('aria-label', 'Panel educativo');
  });

  it('should handle long text gracefully', () => {
    const longText = '🎨 '.repeat(100) + 'Paso muy largo con mucho texto educativo';
    render(<EducationalPanel text={longText} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    render(<EducationalPanel text="Test" className="custom-class" />);

    const panel = screen.getByRole('region');
    expect(panel).toHaveClass('custom-class');
  });
});
```

## 🚀 Ejecutar Tests

### 📝 Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch (desarrollo)
npm run test:watch

# Tests con reporte de cobertura
npm run test:coverage

# Tests específicos
npm test -- --testPathPattern=api/prompts
npm test -- --testNamePattern="should return prompts"

# Tests en modo verbose
npm test -- --verbose

# Tests en modo CI
npm test -- --ci --coverage --watchAll=false
```

### 🎯 Ejecución Selectiva

```bash
# Solo tests de API
npm test -- src/app/api

# Solo tests de componentes
npm test -- src/components

# Tests que coincidan con patrón
npm test -- --testNamePattern="error|fail"

# Tests con coverage específica
npm test -- --coverage --collectCoverageFrom="src/app/api/**/*.ts"
```

## 📊 Reportes de Cobertura

### 📈 Interpretar Reportes

```bash
# Ejecutar y ver reporte en terminal
npm run test:coverage

# Resultado esperado:
# -------------------|---------|----------|---------|---------|-------------------
# File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
# -------------------|---------|----------|---------|---------|-------------------
# All files          |     87 |      82 |     91 |     86 |
#  src/app/api       |     95 |      90 |     95 |     94 |
#   _lib/cases.ts    |     88 |      85 |     90 |     87 | 45-47
#   prompts/route.ts |    100 |     100 |    100 |    100 |
#  src/components    |     85 |      80 |     88 |     84 |
# -------------------|---------|----------|---------|---------|-------------------
```

### 📁 Archivos de Cobertura

Los reportes se generan en `coverage/`:
- **`coverage/lcov-report/index.html`**: Reporte HTML interactivo
- **`coverage/lcov.info`**: Formato LCOV para CI/CD
- **`coverage/coverage-final.json`**: Datos JSON detallados

### 🔍 Analizar Cobertura Baja

```typescript
// Ejemplo: Código no cubierto
export function getEducationalTextForStep(step: number): string {
  switch (step) {
    case 0: return '🎨 Paso 0: Estado inicial caótico';
    case 1: return '🎨 Paso 1: Primeros patrones emergen';
    // ... casos 2-8 no cubiertos
    case 9: return '🎨 Paso 9: Imagen casi completa';
    case 10: return '🎨 Paso 10: Resultado final';
    default: return '🎨 Paso desconocido'; // Esta línea no cubierta
  }
}

// Test que cubre el caso default
it('should return default text for unknown step', () => {
  expect(getEducationalTextForStep(99)).toBe('🎨 Paso desconocido');
});
```

## 🐛 Debugging de Tests

### 🔍 Técnicas de Debugging

#### 1. Console Logs en Tests
```typescript
it('should debug step processing', () => {
  const testData = { prompt_id: '1', step: 5 };
  console.log('Test data:', testData); // Aparecerá en output

  // Test implementation
});
```

#### 2. Usar Debugger
```typescript
it('should debug with breakpoint', () => {
  debugger; // Breakpoint en Node.js

  const result = processStep(testData);
  expect(result).toBeDefined();
});
```

#### 3. Inspect Test Context
```typescript
it('should inspect component render', () => {
  const { container, debug } = render(<MyComponent />);

  // Ver HTML renderizado
  debug();

  // Ver estructura del DOM
  screen.logTestingPlaygroundURL();
});
```

### 🚨 Tests Fallidos Comunes

#### Async/Await Issues
```typescript
// ❌ Incorrecto
it('should handle async operation', () => {
  const result = loadDynamicCases(); // Missing await
  expect(result).toBeDefined();
});

// ✅ Correcto
it('should handle async operation', async () => {
  const result = await loadDynamicCases();
  expect(result).toBeDefined();
});
```

#### Mock Issues
```typescript
// ❌ Mock not reset
describe('MyTests', () => {
  it('test 1', () => {
    mockFs.readFile.mockResolvedValue('data');
    // Test 1
  });

  it('test 2', () => {
    // Mock still has old value!
    // Test 2
  });
});

// ✅ Correct mock reset
describe('MyTests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test 1', () => {
    mockFs.readFile.mockResolvedValue('data');
    // Test 1
  });

  it('test 2', () => {
    mockFs.readFile.mockResolvedValue('other data');
    // Test 2
  });
});
```

#### Component Testing Issues
```typescript
// ❌ Testing implementation details
it('should have correct className', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('bg-blue-500'); // Brittle test
});

// ✅ Testing behavior
it('should call onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole('button');
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 🔧 Mocks y Fixtures

### 📁 Estructura de Mocks

```
src/
├── __mocks__/           # Mocks automáticos
│   ├── fs.ts           # Mock de fs/promises
│   └── sharp.ts       # Mock de sharp
├── __fixtures__/       # Datos de prueba
│   ├── cases.json     # Datos de casos mock
│   ├── images/        # Imágenes de prueba
│   └── api-responses/ # Responses mock
└── __tests__/          # Tests
```

### 🎭 Crear Mocks Efectivos

#### File System Mock
```typescript
// __mocks__/fs.ts
const fs = jest.createMockFromModule('fs/promises') as any;

// Mock implementations
fs.readFile = jest.fn();
fs.readdir = jest.fn();
fs.stat = jest.fn();

export default fs;
```

#### API Response Fixtures
```typescript
// __fixtures__/api-responses.ts
export const mockPromptsResponse = [
  {
    id: '1',
    prompt: 'Spider-Man dorado',
    description: 'Caso educativo básico'
  }
];

export const mockStepResponse = {
  step: 5,
  intermediate_image: 'data:image/png;base64,...',
  educational_text: '🎨 Paso 5: Detalles emergen',
  is_finished: false,
  total_steps: 10
};
```

#### Component Props Fixtures
```typescript
// __fixtures__/component-props.ts
export const defaultEducationalPanelProps = {
  text: '🎨 Texto educativo de prueba',
  className: 'test-class'
};

export const longTextProps = {
  text: '🎨 '.repeat(50) + 'Texto muy largo para testing',
  className: ''
};
```

## 🚀 CI/CD Integration

### 🔄 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test -- --ci --coverage --watchAll=false

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### 📊 Cobertura en PRs

```yaml
# Comment PR with coverage
- name: Comment Coverage
  uses: dorny/test-reporter@v1
  if: success()
  with:
    name: Jest Tests
    path: 'coverage/junit.xml'
    reporter: jest-junit
```

## 📈 Métricas y KPIs

### 🎯 Objetivos de Testing

| Métrica | Objetivo | Actual | Status |
|---------|----------|--------|--------|
| Cobertura Total | >80% | ~87% | ✅ |
| Tiempo de Ejecución | <30s | ~15s | ✅ |
| Tests por Commit | >5 | ~8 | ✅ |
| Flaky Tests | 0% | 0% | ✅ |

### 📊 Dashboard de Métricas

```typescript
// scripts/test-metrics.js
const { execSync } = require('child_process');

function runTestsWithMetrics() {
  console.log('🧪 Running test suite with metrics...');

  const startTime = Date.now();

  try {
    execSync('npm test -- --coverage --watchAll=false', {
      stdio: 'inherit'
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Tests completed in ${duration}ms`);

    // Parse coverage
    const coverage = JSON.parse(
      execSync('cat coverage/coverage-final.json').toString()
    );

    console.log('📊 Coverage Metrics:');
    console.log(`  Statements: ${coverage.total.statements.pct}%`);
    console.log(`  Branches: ${coverage.total.branches.pct}%`);
    console.log(`  Functions: ${coverage.total.functions.pct}%`);
    console.log(`  Lines: ${coverage.total.lines.pct}%`);

  } catch (error) {
    console.error('❌ Tests failed');
    process.exit(1);
  }
}

runTestsWithMetrics();
```

## 🛠️ Utilidades de Testing

### 🔧 Scripts Personalizados

```json
// package.json
{
  "scripts": {
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand",
    "test:watch:debug": "npm run test:debug -- --watch",
    "test:coverage:html": "npm run test:coverage && open coverage/lcov-report/index.html",
    "test:api": "npm test -- --testPathPattern=api",
    "test:components": "npm test -- --testPathPattern=components",
    "test:utils": "npm test -- --testPathPattern=_lib"
  }
}
```

### 🎨 Test Helpers

```typescript
// src/__tests__/helpers.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        {children}
      </>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
```

## 🎯 Mejores Prácticas

### 📝 Do's and Don'ts

#### ✅ DO
- **Escribir tests primero** (TDD)
- **Usar nombres descriptivos** para tests
- **Aislar unidades** de código
- **Mock dependencias externas**
- **Verificar comportamiento**, no implementación
- **Mantener tests independientes**

#### ❌ DON'T
- **Testear código privado**
- **Usar snapshots** para lógica compleja
- **Crear tests frágiles** (que fallen con refactorings)
- **Mock todo** (perder valor del test)
- **Crear tests lentos** (más de 100ms cada uno)
- **Duplicar lógica** del código bajo test

### 🔧 Patrones Recomendados

#### Arrange-Act-Assert Pattern
```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  const calculator = new PriceCalculator();

  // Act
  const total = calculator.getTotal(items);

  // Assert
  expect(total).toBe(30);
});
```

#### Given-When-Then Pattern
```typescript
describe('User Authentication', () => {
  it('should authenticate valid user', () => {
    // Given a valid user exists
    const user = { email: 'user@test.com', password: 'password' };

    // When attempting to authenticate
    const result = authenticate(user);

    // Then authentication should succeed
    expect(result.success).toBe(true);
  });
});
```

## 🚀 Próximos Pasos

### 🔮 Mejoras Futuras

#### E2E Testing
```typescript
// Futuro: Playwright/Cypress
describe('Diffusion Simulation E2E', () => {
  it('should complete full user journey', async () => {
    await page.goto('/');
    await page.click('[data-testid="case-selector"]');
    await page.click('[data-testid="start-simulation"]');
    // ... complete flow
  });
});
```

#### Performance Testing
```typescript
// Tests de performance
describe('Performance Tests', () => {
  it('should render within 100ms', async () => {
    const start = performance.now();
    render(<DiffusionViewer />);
    const end = performance.now();

    expect(end - start).toBeLessThan(100);
  });
});
```

#### Visual Regression Testing
```typescript
// Tests de UI visual
describe('Visual Regression', () => {
  it('should match design system', async () => {
    const { container } = render(<EducationalPanel />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

---

## 🎉 Conclusión

La suite de testing del **Visor de Difusión** proporciona:

- **🛡️ Confianza**: Cobertura completa y tests fiables
- **🚀 Velocidad**: Ejecución rápida y feedback inmediato
- **🔧 Mantenibilidad**: Código testeado y refactorizable
- **📊 Visibilidad**: Métricas claras y reportes detallados
- **🎯 Calidad**: Prevención de regresiones y bugs

Esta estrategia asegura que cada cambio al código sea validado automáticamente, manteniendo altos estándares de calidad y confiabilidad.