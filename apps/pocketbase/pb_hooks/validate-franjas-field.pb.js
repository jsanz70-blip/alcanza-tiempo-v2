/// <reference path="../pb_data/types.d.ts" />
// Validate franjas field to accept only valid slot values
onRecordCreate((e) => {
  const franjas = e.record.get('franjas');
  
  // Valid franja values
  const validValues = ['Mañana temprano', 'Apertura', 'Mediodía', 'Tarde', 'Cierre', 'Sin franja', ''];
  
  // Check if franjas is provided and validate it
  if (franjas !== null && franjas !== undefined && franjas !== '') {
    if (validValues.indexOf(franjas) === -1) {
      throw new BadRequestError('Invalid franja value. Allowed values: Mañana temprano, Apertura, Mediodía, Tarde, Cierre, Sin franja, or empty string');
    }
  }
  
  e.next();
}, 'daily_objectives');

onRecordUpdate((e) => {
  const franjas = e.record.get('franjas');
  
  // Valid franja values
  const validValues = ['Mañana temprano', 'Apertura', 'Mediodía', 'Tarde', 'Cierre', 'Sin franja', ''];
  
  // Check if franjas is provided and validate it
  if (franjas !== null && franjas !== undefined && franjas !== '') {
    if (validValues.indexOf(franjas) === -1) {
      throw new BadRequestError('Invalid franja value. Allowed values: Mañana temprano, Apertura, Mediodía, Tarde, Cierre, Sin franja, or empty string');
    }
  }
  
  e.next();
}, 'daily_objectives');