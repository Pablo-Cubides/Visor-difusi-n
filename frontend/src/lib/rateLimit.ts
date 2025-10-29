/**
 * Rate Limiting Helper
 * Implementa un sistema simple de rate limiting en memoria
 * para proteger contra abuso de API
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const CLEANUP_INTERVAL = 60000; // Limpiar cada minuto

// Limpiar entradas expiradas periódicamente
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, CLEANUP_INTERVAL);

export interface RateLimitConfig {
  interval: number; // milliseconds
  maxRequests: number;
}

/**
 * Verifica si una IP ha excedido el límite de rate limiting
 * @param ip - Dirección IP del cliente
 * @param config - Configuración de límites
 * @returns { success: boolean, remaining: number, retryAfter: number }
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const key = `${ip}`;

  // Inicializar si no existe
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return {
      success: true,
      remaining: config.maxRequests - 1,
      retryAfter: 0,
    };
  }

  // Si el período expiró, resetear
  if (store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return {
      success: true,
      remaining: config.maxRequests - 1,
      retryAfter: 0,
    };
  }

  // Incrementar contador
  store[key].count++;

  // Verificar si se excedió el límite
  if (store[key].count > config.maxRequests) {
    const retryAfter = Math.ceil(
      (store[key].resetTime - now) / 1000
    );
    return {
      success: false,
      remaining: 0,
      retryAfter,
    };
  }

  return {
    success: true,
    remaining: config.maxRequests - store[key].count,
    retryAfter: 0,
  };
}

/**
 * Extrae la IP del cliente de las headers
 */
export function getClientIp(headers?: Record<string, string | string[] | undefined> | null): string {
  if (!headers) {
    return 'unknown';
  }

  const forwarded = headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : 'unknown';
  const realIp = headers['x-real-ip'];
  const realIpStr = typeof realIp === 'string' ? realIp : 'unknown';
  return ip !== 'unknown' ? ip : realIpStr;
}
