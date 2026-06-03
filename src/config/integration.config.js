// ============================================
// Configuración Integración BSale
// Archivo: src/config/integration.config.js
// ============================================

/**
 * Configuración de la integración BSale → Sistema de Tesorería
 * 
 * Este archivo define parámetros ajustables para la integración sin
 * necesidad de modificar el código fuente.
 */

module.exports = {
  /**
   * Configuración de la API de BSale
   */
  bsale: {
    baseURL: process.env.BSALE_API_BASE_URL || 'https://api.bsale.com.co',
    apiKey: process.env.BSALE_API_KEY,
    apiSecret: process.env.BSALE_API_SECRET,
    timeout: parseInt(process.env.BSALE_TIMEOUT) || 30000,
    retries: parseInt(process.env.BSALE_RETRIES) || 3,
  },

  /**
   * Configuración de la base de datos (Supabase)
   */
  database: {
    table: process.env.DAILY_SALES_TABLE || 'daily_sales',
    schema: process.env.DATABASE_SCHEMA || 'public',
  },

  /**
   * Configuración de sincronización
   */
  sync: {
    // Si force está en true, se importarán todos los datos aunque ya existan
    force: process.env.FORCE_SYNC === 'true',
    
    // Horario de sincronización automática (formato: "HH:MM")
    schedule: process.env.SYNC_SCHEDULE || '02:00',
    
    // Número de días para retroceso (soporta fechas pasadas)
    daysBack: parseInt(process.env.SYNC_DAYS_BACK) || 0, // 0 = hoy, 1 = ayer, etc.
    
    // Pausar en errores (true = detener, false = continuar)
    pauseOnError: process.env.PAUSE_ON_ERROR !== 'false',
  },

  /**
   * Configuración de rendimiento
   */
  performance: {
    // Número máximo de intentos por movimiento
    maxAttempts: parseInt(process.env.MAX_ATTEMPTS) || 3,
    
    // Tiempo entre reintentos (ms)
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000,
    
    // Lote de procesamiento (0 = sin lote, >0 = procesar en lotes)
    batchSize: parseInt(process.env.BATCH_SIZE) || 0,
  },

  /**
   * Modo depuración
   */
  debug: {
    enabled: process.env.DEBUG_MODE === 'true',
    logQueries: process.env.LOG_QUERIES !== 'false',
    logDuplicates: process.env.LOG_DUPLICATES !== 'false',
  },

  /**
   * Mapeo personalizado de tipos de pago
   * Añadir tipos específicos de la compañía
   */
  paymentMappings: {
    // Ejemplo: 'TIPO_EN_BSALE': 'campo_en_tesoreria'
    // 'EFECTIVO': 'sales_cash',
    // 'TARJETA_DEBITO': 'sales_card_debit',
    // 'TARJETA_CREDITO': 'sales_card_credit',
  },

  /**
   * Estados permitidos para el campo estado_caja
   * (Regla de negocio: siempre PENDIENTE_REVISION al importar)
   */
  allowedStates: ['PENDIENTE_REVISION', 'ABIERTO'],
};

/*
  Ejemplo de uso en producción:

  // .env
  FORCE_SYNC=false
  SYNC_SCHEDULE='0 2 * * *'  // Cada día a las 2am
  SYNC_DAYS_BACK=0
  BSALE_API_KEY=xxxxx
  BSALE_API_SECRET=xxxxx
*/