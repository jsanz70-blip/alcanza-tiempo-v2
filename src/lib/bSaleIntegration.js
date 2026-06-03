/**
 * Integración con la API de BSale para extraer el desglose de movimientos diarios de cajas
 * y sincronizarlos con el módulo de Venta Diaria del Sistema de Tesorería.
 * 
 * Este script se ejecuta en segundo plano (sin intervención del usuario) y:
 * 1. Se conecta a la API de BSale usando turnos de caja / formas de pago
 * 2. Extrae los movimientos diarios por caja
 * 3. Mapea los datos según las reglas de negocio
 * 4. Inserta/actualiza registros en Supabase (tabla: daily_sales)
 * 5. Evita duplicados por fecha y caja
 * 6. Mantiene el estado en "Abierto" o "Pendiente de Revisión" (nunca cierra automáticamente)
 */

import { realSupabase } from './supabaseClient.js';

// ─── CONFIGURACIÓN ─────────────────────────────────────────────────────────────
const API_BASE_URL = 'https://api.bsale.com.co'; // Ajustar según entorno (producción/staging)
const DAILY_SALES_TABLE = 'daily_sales';
const CACHE_KEY_BSALE_DAILY = 'bSale_daily_movements_cache';

// Máscaras de formato esperadas por Supabase
const DATE_FORMAT = 'YYYY-MM-DD';
const ID_FORMAT = 'bsale-{cajaId}-{fecha}-{movimientoId}';

// ─── ESTRUCTURA DE DATOS EN SUPABASE ───────────────────────────────────────────
/*
Tabla: daily_sales
- id: TEXT PK (uuid o string generado)
- date: DATE (fecha del movimiento)
- caja_id: TEXT (identificador de la caja en BSale)
- caja_nombre: TEXT
- estado_caja: TEXT ('ABIERTO' | 'PENDIENTE_REVISION' | 'CERRADO') -- siempre ABIERTO o PENDIENTE_REVISION al importar
- sales_cash: DECIMAL (Ventas en efectivo)
- sales_card_debit: DECIMAL (Ventas con tarjeta débito)
- sales_card_credit: DECIMAL (Ventas con tarjeta crédito)
- sales_transfer: DECIMAL (Ventas por transferencia)
- sales_credit: DECIMAL (Ventas a crédito)
- sales_edenred: DECIMAL (Ventas con Edenred)
- other_income: DECIMAL (Otros ingresos manuales)
- cash_withdrawals: DECIMAL (Retiros de efectivo / gastos de caja)
- total_sales: DECIMAL (suma de ventas totales)
- total_movements: DECIMAL (suma de entradas y salidas)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- synced: BOOLEAN (si ya fue enviado a contabilidad)
*/

// ─── VALIDACIÓN Y MAPEO DE DATOS ──────────────────────────────────────────────
/**
 * Valida y mapea un movimiento diario de BSale al modelo de Supabase
 * @param {Object} movimiento - Registro crudo de la API de BSale
 * @param {string} cajaId - Identificador de la caja
 * @param {string} fechaISO - Fecha en formato ISO (YYYY-MM-DD)
 * @returns {Object|null} Registro mapeado o null si no cumple validación
 */
function mapearMovimiento(movimiento, cajaId, fechaISO) {
  if (!movimiento || typeof movimiento !== 'object') return null;

  // Normalizar montos: asegurar que sean números decimales (0 si no vienen)
  const toDecimal = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    const n = Number(val);
    return isNaN(n) ? 0 : Math.round(n * 100) / 100;
  };

  // Determinar el tipo de venta según el medio de pago
  const medioPago = (movimiento.payment_method || '').toString().toLowerCase().trim();
  
  let salesCash = 0;
  let salesCardDebit = 0;
  let salesCardCredit = 0;
  let salesTransfer = 0;
  let salesCredit = 0;
  let salesEdenred = 0;
  let otherIncome = 0;
  let cashWithdrawals = 0;

  // Clasificar según el medio de pago
  if (medioPago.includes('efectivo') || medioPago === 'efectivo' || medioPago === 'cash') {
    salesCash = toDecimal(movimiento.amount);
  } else if (medioPago.includes('tarjeta') || medioPago.includes('debito') || medioPago === 'debit') {
    salesCardDebit = toDecimal(movimiento.amount);
  } else if (medioPago.includes('tarjeta') || medioPago.includes('credito') || medioPago === 'credit') {
    salesCardCredit = toDecimal(movimiento.amount);
  } else if (medioPago.includes('transferencia') || medioPago === 'transferencia' || medioPago === 'transfer') {
    salesTransfer = toDecimal(movimiento.amount);
  } else if (medioPago.includes('credito') || medioPago === 'credito_fiado' || medioPago === 'accounts') {
    salesCredit = toDecimal(movimiento.amount);
  } else if (medioPago.includes('edenred') || medioPago === 'edenred') {
    salesEdenred = toDecimal(movimiento.amount);
  } else if (medioPago.includes('manual') || medioPago === 'manual' || medioPago === 'otros') {
    otherIncome = toDecimal(movimiento.amount);
  } else {
    // Por defecto, tratar como otros ingresos si tiene monto
    otherIncome = toDecimal(movimiento.amount);
  }

  // Determinar si es retiro/gasto de caja (egresos)
  const isRetiro = movimiento.tipo === 'EGRESO' || movimiento.type === 'withdrawal' || 
                   movimiento.concepto?.toLowerCase().includes('retiro') ||
                   movimiento.concepto?.toLowerCase().includes('gasto') ||
                   movimiento.concepto?.toLowerCase().includes('egreso');
  
  if (isRetiro) {
    cashWithdrawals = toDecimal(movimiento.amount);
  }

  return {
    date: fechaISO,
    caja_id: cajaId,
    caja_nombre: movimiento.caja_nombre || `Caja ${cajaId}`,
    estado_caja: 'PENDIENTE_REVISION', // Regla de negocio: nunca cerrar automáticamente
    sales_cash: salesCash,
    sales_card_debit: salesCardDebit,
    sales_card_credit: salesCardCredit,
    sales_transfer: salesTransfer,
    sales_credit: salesCredit,
    sales_edenred: salesEdenred,
    other_income: otherIncome,
    cash_withdrawals: cashWithdrawals,
    total_sales: Math.round((salesCash + salesCardDebit + salesCardCredit + salesTransfer + salesCredit + salesEdenred + otherIncome) * 100) / 100,
    total_movements: Math.round((salesCash + salesCardDebit + salesCardCredit + salesTransfer + salesCredit + salesEdenred + otherIncome + cashWithdrawals) * 100) / 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    synced: false
  };
}

// ─── CONTROL DE DUPLICADOS ─────────────────────────────────────────────────────
/**
 * Verifica si un movimiento ya existe en Supabase para la misma fecha y caja
 * @param {string} cajaId - Identificador de la caja
 * @param {string} fechaISO - Fecha en formato YYYY-MM-DD
 * @param {string} movimientoId - ID del movimiento en BSale
 * @returns {Promise<boolean>} True si existe, false si no existe
 */
async function movimientoYaExiste(cajaId, fechaISO, movimientoId) {
  try {
    const { data, error } = await realSupabase
      .from(DAILY_SALES_TABLE)
      .select('id')
      .eq('caja_id', cajaId)
      .eq('date', fechaISO)
      .eq('external_movement_id', movimientoId)
      .single();
    
    return !error && data;
  } catch (err) {
    console.error('Error verificando duplicado:', err);
    return false;
  }
}

// ─── SINCRONIZACIÓN PRINCIPAL ─────────────────────────────────────────────────
/**
 * Sincroniza los movimientos diarios de cajas desde BSale a Supabase
 * @param {string} [fecha] - Fecha a sincronizar (YYYY-MM-DD). Si no se provee, sincroniza la fecha actual
 * @param {Object} [options] - Opciones de configuración
 * @param {boolean} [options.force=false] - Forzar sincronización aunque ya existan datos
 * @returns {Promise<Object>} Resultado de la sincronización
 */
async function sincronizarVentasDiarias(fecha = null, options = {}) {
  const force = options.force || false;
  const hoy = fecha || new Date().toISOString().split('T')[0];
  
  console.log(`[BSale Integration] Iniciando sincronización para fecha: ${hoy}`);
  
  try {
    // 1. Obtener turnos de caja abiertos/pendientes del día desde BSale
    console.log('[BSale Integration] Consultando turnos de caja...');
    const turnosResponse = await fetch(`${API_BASE_URL}/api/v1/turnos-caja`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BSALE_API_KEY || 'TOKEN_PENDIENTE'}`,
        'Content-Type': 'application/json',
      },
    });

    if (!turnosResponse.ok) {
      throw new Error(`Error consultando turnos: ${turnosResponse.status} ${turnosResponse.statusText}`);
    }

    const turnosData = await turnosResponse.json();
    const turnos = turnosResponse.data || [];
    
    console.log(`[BSale Integration] Encontrados ${turnos.length} turnos para ${hoy}`);

    // 2. Por cada turno, consultar el desglose de formas de pago
    let totalRegistrosInsertados = 0;
    let totalRegistrosActualizados = 0;
    let totalRegistrosDuplicados = 0;

    for (const turno of turnos) {
      const cajaId = turno.caja_id;
      
      // Verificar cache para evitar llamadas innecesarias
      const cacheKey = `${CACHE_KEY_BSALE_DAILY}_${cajaId}_${hoy}`;
      
      console.log(`[BSale Integration] Procesando caja ${cajaId} (${turno.caja_nombre || 'Sin nombre'})...`);

      // 3. Consultar formas de pago para este turno/caja
      const formasPagoResponse = await fetch(
        `${API_BASE_URL}/api/v1/turnos-caja/${turno.id}/formas-pago`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.BSALE_API_KEY || 'TOKEN_PENDIENTE'}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!formasPagoResponse.ok) {
        console.warn(`[BSale Integration] Error consultando formas de pago para turno ${turno.id}: ${formasPagoResponse.status}`);
        continue;
      }

      const formasPagoData = await formasPagoResponse.json();
      const formasPago = formasPagoResponse.data || [];

      console.log(`[BSale Integration] Encontradas ${formasPago.length} formas de pago para el turno ${turno.id}`);

      // 4. Procesar cada movimiento y guardar en Supabase
      for (const movimiento of formasPago) {
        const movimientoId = movimiento.id || movimiento.uuid;
        if (!movimientoId) continue;

        // Verificar duplicado
        const existe = await movimientoYaExiste(cajaId, hoy, movimientoId);
        if (existe && !force) {
          totalRegistrosDuplicados++;
          continue;
        }

        // Mapear movimiento
        const registro = mapearMovimiento(movimiento, cajaId, hoy);
        if (!registro) continue;

        // 5. Insertar o actualizar en Supabase
        try {
          // Verificar si existe por id externo
          const { data: existeRegistro, error: checkError } = await realSupabase
            .from(DAILY_SALES_TABLE)
            .select('id')
            .eq('caja_id', cajaId)
            .eq('date', hoy)
            .eq('external_movement_id', movimientoId)
            .single();

          if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
          }

          if (existeRegistro) {
            // Actualizar
            const { error: updateError } = await realSupabase
              .from(DAILY_SALES_TABLE)
              .update(registro)
              .eq('caja_id', cajaId)
              .eq('date', hoy)
              .eq('external_movement_id', movimientoId);

            if (updateError) throw updateError;
            totalRegistrosActualizados++;
            console.log(`[BSale Integration] Actualizado registro caja ${cajaId} día ${hoy}`);
          } else {
            // Insertar
            const { error: insertError } = await realSupabase
              .from(DAILY_SALES_TABLE)
              .insert(registro);

            if (insertError) throw insertError;
            totalRegistrosInsertados++;
            console.log(`[BSale Integration] Insertado registro caja ${cajaId} día ${hoy}`);
          }
        } catch (insertError) {
          console.error(`[BSale Integration] Error guardando movimiento ${movimientoId}:`, insertError);
        }
      }
    }

    // 6. Actualizar cache
    await actualizarCache(hoy, {
      totalRegistrosInsertados,
      totalRegistrosActualizados,
      totalRegistrosDuplicados
    });

    return {
      success: true,
      fecha: hoy,
      totalRegistrosInsertados,
      totalRegistrosActualizados,
      totalRegistrosDuplicados,
      mensaje: `Sincronización completada: ${totalRegistrosInsertados} nuevos, ${totalRegistrosActualizados} actualizados, ${totalRegistrosDuplicados} duplicados`
    };

  } catch (error) {
    console.error('[BSale Integration] Error en sincronización:', error);
    return {
      success: false,
      error: error.message,
      fecha: hoy
    };
  }
}

// ─── MANEJO DE CACHE ──────────────────────────────────────────────────────────
/**
 * Actualiza el cache de sincronización
 */
async function actualizarCache(fecha, datos) {
  try {
    const cacheData = {
      fecha,
      ...datos,
      timestamp: new Date().toISOString()
    };
    await realSupabase
      .from(DAILY_SALES_TABLE)
      .upsert({ cache_key: CACHE_KEY_BSALE_DAILY, cache_data: cacheData, updated_at: new Date().toISOString() }, { onConflict: 'cache_key' });
  } catch (err) {
    console.error('Error actualizando cache:', err);
  }
}

// ─── FUNCIÓN PARA EJECUCIÓN MANUAL O PROGRAMADA ──────────────────────────────
/**
 * Ejecuta la sincronización de ventas diarias
 * Uso: node -e "require('./bSaleIntegration').sincronizarVentasDiarias()"
 * Uprog: Para programar con node-cron: cada día a las 2am
 *   cron.schedule('0 2 * * *', async () => {
 *     const resultado = await sincronizarVentasDiarias();
 *     console.log(resultado.mensaje);
 *   });
 */
async function main() {
  console.log('=== Iniciando sincronización BSale → Supabase ===');
  const resultado = await sincronizarVentasDiarias();
  console.log('=== Resultado:', JSON.stringify(resultado, null, 2));
  return resultado;
}

// Ejecutar si se corre directamente
if (require.main === module) {
  main().then(() => process.exit(0)).catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
  });
}

// Exportar funciones para uso en otros módulos
export default {
  sincronizarVentasDiarias,
  mapearMovimiento,
  movimientoYaExiste,
  DAILY_SALES_TABLE,
  API_BASE_URL
};