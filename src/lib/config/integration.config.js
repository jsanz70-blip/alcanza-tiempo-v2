/**
 * Parámetros de Integración - BSale → Sistema de Tesorería
 * 
 * Este archivo contiene parámetros configurables para la integración
 */

module.exports = {
  // Configuración de la API de BSale
  api: {
    baseURL: process.env.BSALE_API_BASE_URL || 'https://api-dev.bsale.com.co',
    apiKey: process.env.BSALE_API_KEY,
    apiSecret: process.env.BSALE_API_SECRET,
    timeout: parseInt(process.env.BSALE_TIMEOUT) || 30000,
  },

  // Configuración de sincronización
  sync: {
    fecha: process.env.SYNC_DATE || null, // Formato: YYYY-MM-DD
    force: process.env.SYNC_FORCE === 'true',
    maxRetries: parseInt(process.env.SYNC_MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.SYNC_RETRY_DELAY) || 1000, // ms
  },

  // Configuración de la tabla de destino
  database: {
    table: process.env.DATABASE_TABLE || 'daily_sales',
    schema: process.env.DATABASE_SCHEMA || 'public',
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info', // error, warn, info, debug
    enabled: process.env.LOG_ENABLED !== 'false',
  },

  // Mapeo de tipos de pago
  paymentMapping: {
    cash: ['efectivo', 'cash'],
    debit: ['debito', 'tarjeta_debito', 'debit'],
    credit: ['credito', 'tarjeta_credito', 'credit'],
    transfer: ['transferencia', 'bank_transfer', 'transfer'],
    creditAccount: ['credito_fiado', 'accounts', 'credit_account'],
    edenred: ['edenred'],
    other: ['manual', 'otros', 'misc'],
  },

  // Tipos de movimiento que se consideran retiros
  withdrawalKeywords: ['retiro', 'gasto', 'egreso', 'withdrawal', 'expense'],

  // Estado de caja por defecto (regla de negocio)
  defaultCajaState: 'PENDIENTE_REVISION',
};
