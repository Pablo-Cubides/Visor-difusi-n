'use client';

import { useState, useEffect, useRef } from 'react';
import EducationalPanel from '@/components/EducationalPanel';

// Define la URL de la API: preferimos rutas relativas para desplegar en Vercel
const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '' : 'http://localhost:3000');
const TOTAL_STEPS = 10;

// Nota sobre optimización de imágenes:
// Las imágenes en esta aplicación son datos base64 generados dinámicamente
// desde las APIs serverless, no URLs estáticas. Por esta razón, no se puede
// usar el componente <Image> de Next.js que requiere URLs optimizables.
// Se mantienen las etiquetas <img> nativas para contenido dinámico.

export default function Home() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [promptsLoading, setPromptsLoading] = useState<boolean>(true);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  // Stateless backend: frontend tracks prompt and current step
  // stateless: no simulationId needed
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log('Component rendered, current state:', { selectedPromptId, currentStep, isLoading, isFinished });
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // --- ESTADOS DE IMAGEN ---
  const [noiseImage, setNoiseImage] = useState<string | null>(null);
  const [intermediateImage, setIntermediateImage] = useState<string | null>(null);
  const [educationalText, setEducationalText] = useState<string>('Bienvenido. Selecciona un prompt y haz clic en "Iniciar Simulación".');

  // --- ESTADO PARA LA IMAGEN DE RUIDO TRANSPARENTE ---
  const [noiseOverlayImage, setNoiseOverlayImage] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.3);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setPromptsLoading(true);
    const response = await fetch(`${API_URL}/api/prompts`);
        if (!response.ok) throw new Error('No se pudieron cargar los prompts.');
        const data = await response.json();
        setPrompts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setPromptsLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  // --- FUNCIÓN PARA CARGAR IMAGEN DE RUIDO ESTÁTICA ---
  const loadStaticNoiseImage = async (step: number): Promise<string | null> => {
    // Solo hay imágenes de ruido para pasos 2-9
    if (step < 2 || step > 9) {
      return null;
    }

    try {
      // Try serverless API noise endpoint first, fall back to static public files
      const apiNoisePath = `${API_URL}/api/noise/${step}`;
      const staticNoisePath = `${API_URL}/static/noise_step_${step}.png`;
      try {
        const response = await fetch(apiNoisePath);
        if (response.ok) {
          const data = await response.json();
          return data.noise_image;
        }
      } catch (_) {
        // ignore and try static path below
      }

      // Fallback: return direct static file URL (browser will load it)
      return staticNoisePath;
    } catch (error) {
      console.error(`Error cargando imagen de ruido para paso ${step}:`, error);
      return null;
    }
  };

  // --- EFECTO PARA GENERAR RUIDO EN CADA PASO ---
  useEffect(() => {
    const loadNoiseOverlay = async () => {
      const overlay = await loadStaticNoiseImage(currentStep);
      setNoiseOverlayImage(overlay);
      
      // Opacidad fija para las imágenes estáticas (no necesitamos variarla)
      setOverlayOpacity(0.8); // Un poco más visible porque las imágenes ya son muy sutiles
    };
    
    loadNoiseOverlay();
  }, [currentStep]);


  const handleStartSimulation = async () => {
    if (!selectedPromptId) return;
    console.log('Starting simulation for prompt:', selectedPromptId);
    setIsLoading(true);
    setError(null);
    try {
      // Stateless: initialize local state and attempt to load step 0 image
      setCurrentStep(0);
      setIsFinished(false);
      setNoiseImage(null);
      setIntermediateImage(null);
      setEducationalText('Initializing...');

      console.log('Making API call to /api/step with step 0');
      // Load step 0 via /step endpoint
  const response = await fetch(`${API_URL}/api/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: selectedPromptId, step: 0 }),
      });
      console.log('API response status:', response.status);
      if (!response.ok) throw new Error('No se pudo iniciar la simulación.');
      const data = await response.json();
      console.log('API response data:', data);

  // API routes may return either a full data URL (data:image/...) or raw base64.
  const img = data.intermediate_image;
  const asDataUrl = img && img.startsWith && img.startsWith('data:') ? img : `data:image/png;base64,${img}`;
  setNoiseImage(asDataUrl);
  setIntermediateImage(asDataUrl);
      setEducationalText(data.educational_text);
      setCurrentStep(1);
      console.log('Simulation started successfully, currentStep set to 1');
    } catch (err: any) {
      console.error('Error in handleStartSimulation:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (!selectedPromptId || currentStep > TOTAL_STEPS) return;
    setIsLoading(true);
    setError(null);
    try {
  const response = await fetch(`${API_URL}/api/step`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: selectedPromptId, step: currentStep }),
      });
      if (!response.ok) throw new Error('Error al procesar el siguiente paso.');
      const data = await response.json();

  const img = data.intermediate_image;
  const asDataUrl = img && img.startsWith && img.startsWith('data:') ? img : `data:image/png;base64,${img}`;
  setIntermediateImage(asDataUrl);
  setEducationalText(data.educational_text);
      
      const finished = data.is_finished;
      setIsFinished(finished);
      
      if (!finished) {
        setCurrentStep(s => s + 1);
      } else {
        // Asegurarse de que el ruido desaparezca en el último paso
        setNoiseOverlayImage(null);
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedPromptId) return;
    try {
      setIsExporting(true);
      const url = `${API_URL}/api/export_gif?case_id=${selectedPromptId}&include_noise=true&overlay_opacity=0.8&frame_ms=350&linger_last_ms=1200`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('No se pudo generar el GIF.');

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `diffusion_${selectedPromptId}.gif`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (e: any) {
      setError(e?.message || 'Error exportando GIF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setSelectedPromptId('');
    setSimulationId(null);
    setCurrentStep(0);
    setIsLoading(false);
    setIsFinished(false);
    setError(null);
    setNoiseImage(null);
    setIntermediateImage(null);
    setNoiseOverlayImage(null);
    setEducationalText('Bienvenido. Selecciona un prompt y haz clic en "Iniciar Simulación".');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-6 lg:p-8 font-sans">
      <header className="text-center mb-4">
        <h1 className="text-4xl font-bold text-primary-DEFAULT">Visor del Proceso de Difusión</h1>
        <p className="text-lg text-gray-600 mt-2">Una herramienta educativa para visualizar la generación de imágenes paso a paso.</p>
      </header>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4"><b>Error:</b> {error}</div>}

      {/* --- SELECCIÓN DE PROMPT --- */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-center mb-4">1. Selecciona un Prompt Educativo</h2>
        {promptsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-DEFAULT"></div>
            <span className="ml-2 text-gray-600">Cargando casos educativos...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {prompts.map(prompt => (
              <div key={prompt.id} onClick={() => currentStep === 0 && setSelectedPromptId(prompt.id)}
                   className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPromptId === prompt.id ? 'border-primary-DEFAULT ring-2 ring-primary-DEFAULT bg-blue-50' : 'border-border hover:border-gray-400'} ${currentStep > 0 ? 'cursor-not-allowed opacity-60' : ''}`}>
                <h3 className="font-bold text-lg text-primary-DEFAULT line-clamp-3">{prompt.prompt}</h3>
                <p className="text-sm text-gray-600 mb-2 mt-2">{prompt.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- CONTROLES PRINCIPALES --- */}
      <div className="bg-card border border-border p-4 rounded-lg shadow-sm mb-6 flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap justify-center items-center">
          <h3 className='text-xl font-semibold mr-4'>2. Controla la Simulación</h3>
          <button onClick={handleStartSimulation} disabled={isLoading || currentStep > 0 || !selectedPromptId} className="bg-primary-DEFAULT text-primary-foreground px-4 py-2 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">{isLoading && currentStep === 0 ? 'Iniciando...' : 'Iniciar Simulación'}</button>
          <button onClick={handleNextStep} disabled={isLoading || !selectedPromptId || isFinished || currentStep === 0} className="bg-secondary-DEFAULT text-secondary-foreground px-4 py-2 rounded-md hover:bg-gray-200 disabled:bg-gray-400">{isLoading && !!selectedPromptId ? 'Procesando...' : `Siguiente Paso (${currentStep}/${TOTAL_STEPS})`}</button>
          <button onClick={handleReset} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Reiniciar</button>
          <button onClick={handleExport} disabled={!isFinished || isExporting} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400">{isExporting ? 'Generando...' : 'Descargar GIF'}</button>
        </div>
      </div>

      {/* --- PANELES DE VISUALIZACIÓN --- */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="panel bg-card border border-border p-4 rounded-lg shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-3 text-primary-DEFAULT">Ruido Inicial y Timestep</h2>
          <div className="flex-grow bg-gray-200 rounded-md flex items-center justify-center aspect-square">
            {noiseImage ? (
              // Nota: Se usa <img> en lugar de <Image> porque las imágenes son datos base64
              // generados dinámicamente desde las APIs, no URLs estáticas optimizables
              <img src={noiseImage} alt="Ruido Inicial" className="w-full h-full object-contain"/>
            ) : (
              <p className="text-gray-500">Esperando simulación...</p>
            )}
          </div>
          <p className="mt-3 text-center text-gray-600">Timestep: {currentStep > 0 ? Math.max(0, currentStep - 1) : 'N/A'}</p>
        </div>

        <div className="panel bg-card border border-border p-4 rounded-lg shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-3 text-primary-DEFAULT">Proceso de Difusión</h2>
          <div className="flex-grow bg-gray-200 rounded-md flex items-center justify-center aspect-square relative">
            {/* --- VISOR CON CAPA DE RUIDO TRANSPARENTE --- */}
            {intermediateImage ? (
              <>
                {/* Nota: Se usa <img> porque las imágenes son datos base64 dinámicos */}
                <img src={intermediateImage} alt={`Paso ${currentStep - 1}`} className="absolute top-0 left-0 w-full h-full object-contain rounded-md"/>
                {noiseOverlayImage && (
                  <>
                    {/* Nota: Imágenes de overlay también son datos dinámicos */}
                    <img
                      src={noiseOverlayImage}
                      alt="Capa de ruido"
                      className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none rounded-md"
                      style={{ opacity: overlayOpacity }}
                    />
                  </>
                )}
              </>
            ) : (
              <p className="text-gray-500">Esperando el primer paso...</p>
            )}
          </div>
          <p className="mt-3 text-center text-gray-600">
            Paso Actual: {currentStep > 0 ? `${Math.max(0, currentStep - 1)} / ${TOTAL_STEPS}` : 'N/A'}
          </p>
        </div>

        <div className="panel bg-card border border-border p-4 rounded-lg shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-3 text-primary-DEFAULT">Explicación del Paso</h2>
          <EducationalPanel text={educationalText} />
        </div>
      </main>

      <footer className="text-center mt-8">
        <p className="text-sm text-amber-700 bg-amber-100 border border-amber-300 rounded-md px-4 py-2 max-w-2xl mx-auto">
          Nota: Esta es una simulación educativa que demuestra cómo los modelos de difusión mejoran gradualmente la calidad de imagen.
        </p>
      </footer>
    </div>
  );
}