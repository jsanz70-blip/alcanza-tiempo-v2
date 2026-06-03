#!/usr/bin/env node
/**
 * Script de Integración BSale - Sistema de Tesorería
 * 
 * Este script automatiza la importación de movimientos diarios de cajas
 * desde BSale al módulo de Venta Diaria del Sistema de Tesorería.
 * 
 * REGLAS DE NEGOCIO APLICADAS:
 * 1. Estado de caja siempre "PENDIENTE_REVISION" (nunca cerrado automáticamente)
 * 2. Control de duplicados por fecha, caja y movimiento ID
 * 3. Mapeo estricto de tipos de venta
 * 4. Registro en tabla: daily_sales
 */

require('dotenv').config();

const { sincronizarVentasDiarias } = require('./src/lib/bSaleIntegration');

async function main() {
  console.log('\n========================================');
  console.log('  BSale → Sistema de Tesorería');
  console.log('  Integración de Ventas Diarias');
  console.log('========================================\n');

  // Validar configuración requerida
  const apiKey = process.env.BSALE_API_KEY;
  if (!apiKey) {
    console.error('❌ ERROR: BSALE_API_KEY no está configurada en .env');
    console.error('   Por favor, copia .env.example a .env y configura tus credenciales');
    process.exit(1);
  }

  // Determinar fecha (opcional: YYYY-MM-DD)
  const fecha = process.argv[2];
  const options = fecha ? { force: true } : {};

  console.log(`Fecha a sincronizar: ${fecha || 'actual'}`);
  console.log('Modo: ' + (options.force ? 'fuerza' : 'normal'));
  console.log('========================================\n');

  try {
    const resultado = await sincronizarVentasDiarias(fecha, options);
    
    console.log('\n========================================');
    console.log('  RESULTADO');
    console.log('========================================');
    console.log(`✅ Estado: ${resultado.success ? 'EXITOSO' : 'FALLIDO'}`);
    console.log(`📅 Fecha: ${resultado.fecha}`);
    
    if (resultado.success) {
      console.log(`📥 Insertados: ${resultado.totalRegistrosInsertados}`);
      console.log(`🔄 Actualizados: ${resultado.totalRegistrosActualizados}`);
      console.log(`⚠️  Duplicados: ${resultado.totalRegistrosDuplicados}`);
      console.log(`\n${resultado.mensaje}`);
    } else {
      console.log(`❌ Error: ${resultado.error}`);
    }
    console.log('========================================\n');

    process.exit(resultado.success ? 0 : 1);
  } catch (error) {
    console.error('❌ Error fatal en la ejecución:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };