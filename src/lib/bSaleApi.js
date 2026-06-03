/**
 * Cliente de API para BSale - Configuración y endpoints
 * Documentación: https://apidocs.bsale.com.co
 */

const API_BASE = {
  production: 'https://api.bsale.com.co',
  staging: 'https://api-staging.bsale.com.co',
  dev: 'https://api-dev.bsale.com.co'
};

const BSaleAPI = {
  /**
   * Configuración de la API
   * @type {Object}
   */
  config: {
    baseURL: API_BASE.dev, // Cambiar según entorno
    apiKey: process.env.BSALE_API_KEY || '',
    apiSecret: process.env.BSALE_API_SECRET || '',
    timeout: 30000
  },

  /**
   * Obtener cabeceras autorizadas
   */
  get headers() {
    return {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  },

  /**
   * Ejecutar solicitud a la API de BSale
   */
  async request(endpoint, options = {}) {
    const url = `${this.config.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`BSale API Error ${response.status}: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('BSale API Request Error:', error);
      throw error;
    }
  },

  /**
   * Obtener turnos de caja para una fecha específica
   */
  async getTurnosCaja(fecha = null) {
    const fechaParam = fecha || new Date().toISOString().split('T')[0];
    return this.request(`/v1/turnos-caja?fecha=${fechaParam}`);
  },

  /**
   * Obtener formas de pago para un turno específico
   */
  async getFormasPagoTurno(turnoId) {
    return this.request(`/v1/turnos-caja/${turnoId}/formas-pago`);
  },

  /**
   * Obtener detalles de un turno
   */
  async getTurno(turnoId) {
    return this.request(`/v1/turnos-caja/${turnoId}`);
  },

  /**
   * Obtener todos los turnos de un rango de fechas
   */
  async getTurnosRango(fechaInicio, fechaFin) {
    return this.request(
      `/v1/turnos-caja/rango?inicio=${fechaInicio}&fin=${fechaFin}`
    );
  }
};

export default BSaleAPI;