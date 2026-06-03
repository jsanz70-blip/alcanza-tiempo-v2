# Integración BSale → Sistema de Tesorería

## 📋 Resumen

Integración que automatiza la importación de movimientos diarios de cajas desde **BSale** al módulo de **Venta Diaria** del Sistema de Tesorería.

## 🎯 Objetivo

- **Automatizar**: Eliminar la carga manual de archivos PDF desde BSale
- **Tiempo real**: Ejecutarse en segundo plano sin intervención del usuario
- **Seguridad**: Mantener el estado de caja como "Pendiente de Revisión" (nunca cerrar automáticamente)
- **Control de duplicados**: Evitar registros duplicados por fecha y caja

## 🔧 Arquitectura

```
src/lib/
├── bSaleApi.js          # Cliente de API de BSale
├── bSaleIntegration.js  # Lógica principal de integración
└── supabaseClient.js    # Cliente de Supabase (existente)
```

## ⚙️ Tabla de Datos

### Tabla: `daily_sales` (Supabase)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | TEXT PK | Identificador único |
| date | DATE | Fecha del movimiento |
| caja_id | TEXT | Identificador de caja en BSale |
| caja_nombre | TEXT | Nombre de la caja |
| estado_caja | TEXT | 'PENDIENTE_REVISION' (siempre) |
| sales_cash | DECIMAL | Ventas en efectivo |
| sales_card_debit | DECIMAL | Ventas con tarjeta débito |
| sales_card_credit | DECIMAL | Ventas con tarjeta crédito |
| sales_transfer | DECIMAL | Ventas por transferencia |
| sales_credit | DECIMAL | Ventas a crédito |
| sales_edenred | DECIMAL | Ventas con Edenred |
| other_income | DECIMAL | Otros ingresos manuales |
| cash_withdrawals | DECIMAL | Retiros de efectivo |
| total_sales | DECIMAL | Total de ventas |
| total_movements | DECIMAL | Total de movimientos |
| synced | BOOLEAN | Ya fue enviado a contabilidad |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
| external_movement_id | TEXT | ID único de BSale |

## 🚀 Uso

### Ejecución manual

```bash
# Sincronizar fecha actual
node src/bin/integrate-bSale.js

# Sincronizar fecha específica
node src/bin/integrate-bSale.js 2024-12-15

# Forzar recarga (ignorar duplicados existentes)
node src/bin/integrate-bSale.js 2024-12-15 --force
```

### Programación (opcional)

```javascript
// Usar con node-cron para ejecutar diariamente a las 2am
const cron = require('node-cron');
const { main } = require('./src/bin/integrate-bSale');

cron.schedule('0 2 * * *', async () => {
  await main();
});
```

## 📊 Mapeo de Datos

### Tipos de venta en BSale → Sistema de Tesorería

| BSale (payment_method) | Tesorería (campo) |
|------------------------|-------------------|
| Efectivo / Cash | `sales_cash` |
| Débito / Debit | `sales_card_debit` |
| Crédito / Credit | `sales_card_credit` |
| Transferencia / Transfer | `sales_transfer` |
| Crédito Fiado / Credit | `sales_credit` |
| Edenred | `sales_edenred` |
| Otros / Manual | `other_income` |

### Regla de caja: Estilo del movimiento
- `INGRESO` → Agregar a ventas
- `EGRESO` / `WITHDRAWAL` → Agregar a `cash_withdrawals`

### Regla de estado
- **Nunca** se cierra la caja automáticamente
- Siempre se importa como: `PENDIENTE_REVISION`
- El usuario revisa y cierra manualmente desde la interfaz

## 🔄 Control de Duplicados

El sistema verifica antes de insertar:

```sql
-- Consulta de verificación
SELECT id FROM daily_sales 
WHERE caja_id = ? 
  AND date = ? 
  AND external_movement_id = ?
```

Si existe → se omite (a menos que se use `--force`)

## 📈 Resultados Esperados

Ejemplo de salida:

```
========================================
  RESULTADO
========================================
✅ Estado: EXITOSO
📅 Fecha: 2024-12-15
📥 Insertados: 5
🔄 Actualizados: 2
⚠️  Duplicados: 1

Sincronización completada: 5 nuevos, 2 actualizados, 1 duplicados
========================================
```

## 🔐 Configuración Requerida

### Variables de entorno

```bash
# Clave API de BSale (obligatorio)
BSALE_API_KEY=tu_api_key_aquí

# Secret opcional (si algunos endpoints lo requieren)
BSALE_API_SECRET=tu_api_secret_aquí

# Entorno
BSALE_ENVIRONMENT=dev  # dev | staging | production
```

### `.env`

Copia `.env.example` a `.env` y completa las credenciales.

## ⚠️ Consideraciones

1. **Proxy de tiempo muerto**: Node tiene timeout de 5 minutos. Si la sincronización tarda más, se recomienda paginación.

2. **Errores de red**: La función `isNetworkError()` detecta problemas comunes de conexión.

3. **Pendiente de implementación**: El código está listo para producción pero requiere:
   - Configurar `BSALE_API_KEY` real
   - Crear la tabla `daily_sales` en Supabase
   - Ajustar la URL base según entorno (dev/staging/production)

4. **Logs**: Todos los errores se muestran en consola para depuración.

## 🐛 Depuración

```bash
# Ver logs detallados
NODE_DEBUG=http,https node src/bin/integrate-bSale.js

# Ver respuesta completa de la API
# (Agregar console.log en bSaleIntegration.js)
```

## 📚 Referencias

- [BSale API Documentation](https://apidocs.bsale.com.co)
- [Sistema de Tesorería - Schema Docs](docs/tesoreria.md)
- [Reglas de Integración - Documento Técnico](docs/integracion-ventas.md)

## 🔄 Mantenimiento

- **Actualizar fechas**: El script soporta parámetro de fecha opcional
- **Reintentos**: Los errores de red disparan reintentos automáticos
- **Limpieza**: El cache se actualiza automáticamente tras éxito

## ✅ Checklist Pre-Producción

- [ ] Configurar `BSALE_API_KEY` en `.env`
- [ ] Crear tabla `daily_sales` en Supabase
- [ ] Ajustar `API_BASE_URL` según entorno
- [ ] Probar sincronización con fecha actual
- [ ] Configurar cron job (opcional)
- [ ] Monitorear primer día de producción
- [ ] Alertas de errores configuradas