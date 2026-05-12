/// <reference path="../pb_data/types.d.ts" />
// Daily task postponement hook - runs at 23:59 UTC
// Postpones incomplete tasks with empty/Sin franja franjas to tomorrow

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  return formatDate(new Date());
}

// Helper function to get tomorrow's date in YYYY-MM-DD format
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return formatDate(tomorrow);
}

// Helper function to validate franjas value
function isValidFranja(franja) {
  const validValues = ['Mañana temprano', 'Apertura', 'Mediodía', 'Tarde', 'Cierre', 'Sin franja', ''];
  return validValues.indexOf(franja) !== -1;
}

// Helper function to check if franjas is empty or 'Sin franja'
function isFranjaEmpty(franja) {
  return franja === '' || franja === 'Sin franja' || franja === null || franja === undefined;
}

// Cron job that runs daily at 23:59 UTC
cronAdd('postpone_tasks_daily', '59 23 * * *', () => {
  const today = getTodayDate();
  const tomorrow = getTomorrowDate();
  const postponedTasks = [];
  const errors = [];
  
  try {
    // Query daily_objectives for today's records with empty/Sin franja franjas and not completed
    const records = $app.findAllRecords('daily_objectives', {
      filter: 'fecha = "' + today + '" && (franjas = "" || franjas = "Sin franja") && estado != "Hecho"'
    });
    
    // Process each matching record
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      try {
        // Update fecha to tomorrow
        record.set('fecha', tomorrow);
        $app.save(record);
        
        // Log postponed task
        postponedTasks.push({
          recordId: record.id,
          timestamp: new Date().toISOString(),
          originalDate: today,
          newDate: tomorrow
        });
        
        console.log('[POSTPONE-TASKS] Task ' + record.id + ' postponed from ' + today + ' to ' + tomorrow);
      } catch (err) {
        // Log error but continue processing
        errors.push({
          recordId: record.id,
          error: err.message || String(err),
          timestamp: new Date().toISOString()
        });
        console.error('[POSTPONE-TASKS] Error postponing task ' + record.id + ': ' + (err.message || String(err)));
      }
    }
    
    // Log summary
    console.log('[POSTPONE-TASKS] Daily run completed at ' + new Date().toISOString());
    console.log('[POSTPONE-TASKS] Postponed: ' + postponedTasks.length + ' tasks');
    if (errors.length > 0) {
      console.log('[POSTPONE-TASKS] Errors: ' + errors.length + ' tasks failed');
    }
    
  } catch (err) {
    console.error('[POSTPONE-TASKS] Fatal error in daily postponement job: ' + (err.message || String(err)));
  }
});