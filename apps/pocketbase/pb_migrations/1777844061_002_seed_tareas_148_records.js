/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tareas");

  const record0 = new Record(collection);
    record0.set("numero", "01");
    record0.set("categoria_codigo", "A");
    record0.set("categoria_nombre", "Caja, pagos y deudas");
    record0.set("tarea", "Terminar flujo de caja");
    record0.set("frecuencia", "Puntual");
    record0.set("prioridad", "Alta");
    record0.set("semana_actual", true);
    record0.set("notas", "Base de todo lo financiero \u2014 hacerlo primero");
    record0.set("estado", "Pendiente");
    record0.set("bloque", "Finanzas");
    record0.set("check_hoy", false);
    record0.set("check_semana", false);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("numero", "02");
    record1.set("categoria_codigo", "A");
    record1.set("categoria_nombre", "Caja, pagos y deudas");
    record1.set("tarea", "Presupuesto de caja semanal con l\u00edmites de compra");
    record1.set("frecuencia", "Semanal");
    record1.set("prioridad", "Alta");
    record1.set("semana_actual", true);
    record1.set("notas", "Lunes antes de abrir");
    record1.set("estado", "Pendiente");
    record1.set("bloque", "Finanzas");
    record1.set("check_hoy", false);
    record1.set("check_semana", false);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("numero", "03");
    record2.set("categoria_codigo", "A");
    record2.set("categoria_nombre", "Caja, pagos y deudas");
    record2.set("tarea", "Revisar diariamente el presupuesto semanal");
    record2.set("frecuencia", "Diaria");
    record2.set("prioridad", "Alta");
    record2.set("semana_actual", true);
    record2.set("notas", "Primero del d\u00eda");
    record2.set("estado", "Pendiente");
    record2.set("bloque", "Finanzas");
    record2.set("check_hoy", false);
    record2.set("check_semana", false);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("numero", "04");
    record3.set("categoria_codigo", "A");
    record3.set("categoria_nombre", "Caja, pagos y deudas");
    record3.set("tarea", "Presupuesto mensual al inicio de cada mes");
    record3.set("frecuencia", "Mensual");
    record3.set("prioridad", "Alta");
    record3.set("semana_actual", false);
    record3.set("notas", "Primer d\u00eda h\u00e1bil del mes");
    record3.set("estado", "Pendiente");
    record3.set("bloque", "Finanzas");
    record3.set("check_hoy", false);
    record3.set("check_semana", false);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("numero", "05");
    record4.set("categoria_codigo", "A");
    record4.set("categoria_nombre", "Caja, pagos y deudas");
    record4.set("tarea", "Determinar excedente de caja real de IM");
    record4.set("frecuencia", "Puntual");
    record4.set("prioridad", "Alta");
    record4.set("semana_actual", true);
    record4.set("estado", "Pendiente");
    record4.set("bloque", "Finanzas");
    record4.set("check_hoy", false);
    record4.set("check_semana", false);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    record5.set("numero", "06");
    record5.set("categoria_codigo", "A");
    record5.set("categoria_nombre", "Caja, pagos y deudas");
    record5.set("tarea", "Simular crecimiento de ventas e impacto en excedente");
    record5.set("frecuencia", "Puntual");
    record5.set("prioridad", "Media");
    record5.set("semana_actual", false);
    record5.set("estado", "Pendiente");
    record5.set("bloque", "Finanzas");
    record5.set("check_hoy", false);
    record5.set("check_semana", false);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("numero", "07");
    record6.set("categoria_codigo", "A");
    record6.set("categoria_nombre", "Caja, pagos y deudas");
    record6.set("tarea", "Plan de pago de deudas");
    record6.set("frecuencia", "Puntual");
    record6.set("prioridad", "Alta");
    record6.set("semana_actual", true);
    record6.set("notas", "Ordenar por urgencia e inter\u00e9s");
    record6.set("estado", "Pendiente");
    record6.set("bloque", "Finanzas");
    record6.set("check_hoy", false);
    record6.set("check_semana", false);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("numero", "08");
    record7.set("categoria_codigo", "A");
    record7.set("categoria_nombre", "Caja, pagos y deudas");
    record7.set("tarea", "Revisar vencimientos de cr\u00e9ditos");
    record7.set("frecuencia", "Semanal");
    record7.set("prioridad", "Alta");
    record7.set("semana_actual", true);
    record7.set("notas", "Detectar pagos de la semana siguiente");
    record7.set("estado", "Pendiente");
    record7.set("bloque", "Finanzas");
    record7.set("check_hoy", false);
    record7.set("check_semana", false);
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("numero", "09");
    record8.set("categoria_codigo", "A");
    record8.set("categoria_nombre", "Caja, pagos y deudas");
    record8.set("tarea", "Revisar situaci\u00f3n TGR para convenio");
    record8.set("frecuencia", "Puntual");
    record8.set("prioridad", "Alta");
    record8.set("semana_actual", true);
    record8.set("notas", "Puede liberar presi\u00f3n financiera");
    record8.set("estado", "Pendiente");
    record8.set("bloque", "Finanzas");
    record8.set("check_hoy", false);
    record8.set("check_semana", false);
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("numero", "10");
    record9.set("categoria_codigo", "A");
    record9.set("categoria_nombre", "Caja, pagos y deudas");
    record9.set("tarea", "Pagar IVA");
    record9.set("frecuencia", "Mensual");
    record9.set("prioridad", "Alta");
    record9.set("semana_actual", false);
    record9.set("notas", "Seg\u00fan fecha SII");
    record9.set("estado", "Pendiente");
    record9.set("bloque", "Finanzas");
    record9.set("check_hoy", false);
    record9.set("check_semana", false);
  try {
    app.save(record9);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record10 = new Record(collection);
    record10.set("numero", "11");
    record10.set("categoria_codigo", "A");
    record10.set("categoria_nombre", "Caja, pagos y deudas");
    record10.set("tarea", "Pagar patente comercial");
    record10.set("frecuencia", "Puntual");
    record10.set("prioridad", "Alta");
    record10.set("semana_actual", true);
    record10.set("notas", "Verificar fecha l\u00edmite");
    record10.set("estado", "Pendiente");
    record10.set("bloque", "Finanzas");
    record10.set("check_hoy", false);
    record10.set("check_semana", false);
  try {
    app.save(record10);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record11 = new Record(collection);
    record11.set("numero", "12");
    record11.set("categoria_codigo", "A");
    record11.set("categoria_nombre", "Caja, pagos y deudas");
    record11.set("tarea", "Pagar arriendo del local");
    record11.set("frecuencia", "Mensual");
    record11.set("prioridad", "Alta");
    record11.set("semana_actual", true);
    record11.set("estado", "Pendiente");
    record11.set("bloque", "Finanzas");
    record11.set("check_hoy", false);
    record11.set("check_semana", false);
  try {
    app.save(record11);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record12 = new Record(collection);
    record12.set("numero", "13");
    record12.set("categoria_codigo", "A");
    record12.set("categoria_nombre", "Caja, pagos y deudas");
    record12.set("tarea", "Pagar imposiciones");
    record12.set("frecuencia", "Mensual");
    record12.set("prioridad", "Alta");
    record12.set("semana_actual", false);
    record12.set("notas", "Antes del d\u00eda 10");
    record12.set("estado", "Pendiente");
    record12.set("bloque", "Finanzas");
    record12.set("check_hoy", false);
    record12.set("check_semana", false);
  try {
    app.save(record12);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record13 = new Record(collection);
    record13.set("numero", "14");
    record13.set("categoria_codigo", "A");
    record13.set("categoria_nombre", "Caja, pagos y deudas");
    record13.set("tarea", "Pagar luz del local");
    record13.set("frecuencia", "Mensual");
    record13.set("prioridad", "Media");
    record13.set("semana_actual", false);
    record13.set("estado", "Pendiente");
    record13.set("bloque", "Finanzas");
    record13.set("check_hoy", false);
    record13.set("check_semana", false);
  try {
    app.save(record13);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record14 = new Record(collection);
    record14.set("numero", "15");
    record14.set("categoria_codigo", "A");
    record14.set("categoria_nombre", "Caja, pagos y deudas");
    record14.set("tarea", "Pagar agua del local");
    record14.set("frecuencia", "Mensual");
    record14.set("prioridad", "Media");
    record14.set("semana_actual", false);
    record14.set("estado", "Pendiente");
    record14.set("bloque", "Finanzas");
    record14.set("check_hoy", false);
    record14.set("check_semana", false);
  try {
    app.save(record14);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record15 = new Record(collection);
    record15.set("numero", "16");
    record15.set("categoria_codigo", "A");
    record15.set("categoria_nombre", "Caja, pagos y deudas");
    record15.set("tarea", "Pagar Entel celular e internet");
    record15.set("frecuencia", "Mensual");
    record15.set("prioridad", "Media");
    record15.set("semana_actual", false);
    record15.set("estado", "Pendiente");
    record15.set("bloque", "Finanzas");
    record15.set("check_hoy", false);
    record15.set("check_semana", false);
  try {
    app.save(record15);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record16 = new Record(collection);
    record16.set("numero", "17");
    record16.set("categoria_codigo", "A");
    record16.set("categoria_nombre", "Caja, pagos y deudas");
    record16.set("tarea", "Pagar Verisure");
    record16.set("frecuencia", "Mensual");
    record16.set("prioridad", "Media");
    record16.set("semana_actual", false);
    record16.set("estado", "Pendiente");
    record16.set("bloque", "Finanzas");
    record16.set("check_hoy", false);
    record16.set("check_semana", false);
  try {
    app.save(record16);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record17 = new Record(collection);
    record17.set("numero", "18");
    record17.set("categoria_codigo", "A");
    record17.set("categoria_nombre", "Caja, pagos y deudas");
    record17.set("tarea", "Pagar Bsale");
    record17.set("frecuencia", "Mensual");
    record17.set("prioridad", "Media");
    record17.set("semana_actual", false);
    record17.set("estado", "Pendiente");
    record17.set("bloque", "Finanzas");
    record17.set("check_hoy", false);
    record17.set("check_semana", false);
  try {
    app.save(record17);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record18 = new Record(collection);
    record18.set("numero", "19");
    record18.set("categoria_codigo", "A");
    record18.set("categoria_nombre", "Caja, pagos y deudas");
    record18.set("tarea", "Pagar cr\u00e9dito Santander");
    record18.set("frecuencia", "Mensual");
    record18.set("prioridad", "Alta");
    record18.set("semana_actual", false);
    record18.set("estado", "Pendiente");
    record18.set("bloque", "Finanzas");
    record18.set("check_hoy", false);
    record18.set("check_semana", false);
  try {
    app.save(record18);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record19 = new Record(collection);
    record19.set("numero", "20");
    record19.set("categoria_codigo", "A");
    record19.set("categoria_nombre", "Caja, pagos y deudas");
    record19.set("tarea", "Pagar cr\u00e9dito BancoEstado");
    record19.set("frecuencia", "Mensual");
    record19.set("prioridad", "Alta");
    record19.set("semana_actual", false);
    record19.set("estado", "Pendiente");
    record19.set("bloque", "Finanzas");
    record19.set("check_hoy", false);
    record19.set("check_semana", false);
  try {
    app.save(record19);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record20 = new Record(collection);
    record20.set("numero", "21");
    record20.set("categoria_codigo", "A");
    record20.set("categoria_nombre", "Caja, pagos y deudas");
    record20.set("tarea", "Pagar cr\u00e9dito Banco de Chile");
    record20.set("frecuencia", "Mensual");
    record20.set("prioridad", "Alta");
    record20.set("semana_actual", false);
    record20.set("estado", "Pendiente");
    record20.set("bloque", "Finanzas");
    record20.set("check_hoy", false);
    record20.set("check_semana", false);
  try {
    app.save(record20);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record21 = new Record(collection);
    record21.set("numero", "22");
    record21.set("categoria_codigo", "A");
    record21.set("categoria_nombre", "Caja, pagos y deudas");
    record21.set("tarea", "Devolver $1.000.000 a Valeria");
    record21.set("frecuencia", "Puntual");
    record21.set("prioridad", "Alta");
    record21.set("semana_actual", true);
    record21.set("estado", "Pendiente");
    record21.set("bloque", "Finanzas");
    record21.set("check_hoy", false);
    record21.set("check_semana", false);
  try {
    app.save(record21);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record22 = new Record(collection);
    record22.set("numero", "23");
    record22.set("categoria_codigo", "A");
    record22.set("categoria_nombre", "Caja, pagos y deudas");
    record22.set("tarea", "Gestionar mutuo con Arturo Quilodr\u00e1n");
    record22.set("frecuencia", "Puntual");
    record22.set("prioridad", "Media");
    record22.set("semana_actual", false);
    record22.set("estado", "Pendiente");
    record22.set("bloque", "Finanzas");
    record22.set("check_hoy", false);
    record22.set("check_semana", false);
  try {
    app.save(record22);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record23 = new Record(collection);
    record23.set("numero", "24");
    record23.set("categoria_codigo", "A");
    record23.set("categoria_nombre", "Caja, pagos y deudas");
    record23.set("tarea", "Ubicar financiamiento para Pablo Castro");
    record23.set("frecuencia", "Puntual");
    record23.set("prioridad", "Media");
    record23.set("semana_actual", false);
    record23.set("estado", "Pendiente");
    record23.set("bloque", "Finanzas");
    record23.set("check_hoy", false);
    record23.set("check_semana", false);
  try {
    app.save(record23);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record24 = new Record(collection);
    record24.set("numero", "25");
    record24.set("categoria_codigo", "A");
    record24.set("categoria_nombre", "Caja, pagos y deudas");
    record24.set("tarea", "Revisar tema Luis Castro por Fundaci\u00f3n");
    record24.set("frecuencia", "Puntual");
    record24.set("prioridad", "Media");
    record24.set("semana_actual", false);
    record24.set("estado", "Pendiente");
    record24.set("bloque", "Finanzas");
    record24.set("check_hoy", false);
    record24.set("check_semana", false);
  try {
    app.save(record24);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record25 = new Record(collection);
    record25.set("numero", "26");
    record25.set("categoria_codigo", "A");
    record25.set("categoria_nombre", "Caja, pagos y deudas");
    record25.set("tarea", "Cobrar Edenred");
    record25.set("frecuencia", "Semanal");
    record25.set("prioridad", "Media");
    record25.set("semana_actual", true);
    record25.set("notas", "Verificar montos pendientes");
    record25.set("estado", "Pendiente");
    record25.set("bloque", "Finanzas");
    record25.set("check_hoy", false);
    record25.set("check_semana", false);
  try {
    app.save(record25);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record26 = new Record(collection);
    record26.set("numero", "27");
    record26.set("categoria_codigo", "A");
    record26.set("categoria_nombre", "Caja, pagos y deudas");
    record26.set("tarea", "Calcular cuenta de luz de Juanita");
    record26.set("frecuencia", "Puntual");
    record26.set("prioridad", "Media");
    record26.set("semana_actual", true);
    record26.set("estado", "Pendiente");
    record26.set("bloque", "Finanzas");
    record26.set("check_hoy", false);
    record26.set("check_semana", false);
  try {
    app.save(record26);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record27 = new Record(collection);
    record27.set("numero", "28");
    record27.set("categoria_codigo", "A");
    record27.set("categoria_nombre", "Caja, pagos y deudas");
    record27.set("tarea", "Cuadrar pagos de luz con Juanita");
    record27.set("frecuencia", "Puntual");
    record27.set("prioridad", "Media");
    record27.set("semana_actual", false);
    record27.set("estado", "Pendiente");
    record27.set("bloque", "Finanzas");
    record27.set("check_hoy", false);
    record27.set("check_semana", false);
  try {
    app.save(record27);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record28 = new Record(collection);
    record28.set("numero", "29");
    record28.set("categoria_codigo", "A");
    record28.set("categoria_nombre", "Caja, pagos y deudas");
    record28.set("tarea", "Evaluar cambio de plan en Entel");
    record28.set("frecuencia", "Puntual");
    record28.set("prioridad", "Baja");
    record28.set("semana_actual", false);
    record28.set("estado", "Pendiente");
    record28.set("bloque", "Finanzas");
    record28.set("check_hoy", false);
    record28.set("check_semana", false);
  try {
    app.save(record28);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record29 = new Record(collection);
    record29.set("numero", "30");
    record29.set("categoria_codigo", "A");
    record29.set("categoria_nombre", "Caja, pagos y deudas");
    record29.set("tarea", "Separar finanzas entre socios y empresa");
    record29.set("frecuencia", "Puntual");
    record29.set("prioridad", "Alta");
    record29.set("semana_actual", true);
    record29.set("notas", "Urgente para claridad contable");
    record29.set("estado", "Pendiente");
    record29.set("bloque", "Finanzas");
    record29.set("check_hoy", false);
    record29.set("check_semana", false);
  try {
    app.save(record29);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record30 = new Record(collection);
    record30.set("numero", "31");
    record30.set("categoria_codigo", "B");
    record30.set("categoria_nombre", "Operaci\u00f3n diaria");
    record30.set("tarea", "Cuadrar cajas");
    record30.set("frecuencia", "Diaria");
    record30.set("prioridad", "Alta");
    record30.set("semana_actual", true);
    record30.set("notas", "Al cierre de cada turno");
    record30.set("estado", "Pendiente");
    record30.set("bloque", "Operaci\u00f3n");
    record30.set("check_hoy", false);
    record30.set("check_semana", false);
  try {
    app.save(record30);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record31 = new Record(collection);
    record31.set("numero", "32");
    record31.set("categoria_codigo", "B");
    record31.set("categoria_nombre", "Operaci\u00f3n diaria");
    record31.set("tarea", "Cuadrar MercadoPago");
    record31.set("frecuencia", "Diaria");
    record31.set("prioridad", "Alta");
    record31.set("semana_actual", true);
    record31.set("notas", "Junto con cuadratura de caja");
    record31.set("estado", "Pendiente");
    record31.set("bloque", "Operaci\u00f3n");
    record31.set("check_hoy", false);
    record31.set("check_semana", false);
  try {
    app.save(record31);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record32 = new Record(collection);
    record32.set("numero", "33");
    record32.set("categoria_codigo", "B");
    record32.set("categoria_nombre", "Operaci\u00f3n diaria");
    record32.set("tarea", "Recaudar cuota diaria para sueldos");
    record32.set("frecuencia", "Diaria");
    record32.set("prioridad", "Alta");
    record32.set("semana_actual", true);
    record32.set("notas", "Separar monto fijo diario");
    record32.set("estado", "Pendiente");
    record32.set("bloque", "Operaci\u00f3n");
    record32.set("check_hoy", false);
    record32.set("check_semana", false);
  try {
    app.save(record32);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record33 = new Record(collection);
    record33.set("numero", "34");
    record33.set("categoria_codigo", "B");
    record33.set("categoria_nombre", "Operaci\u00f3n diaria");
    record33.set("tarea", "Hacer compras para el local");
    record33.set("frecuencia", "Diaria");
    record33.set("prioridad", "Alta");
    record33.set("semana_actual", true);
    record33.set("notas", "Seg\u00fan l\u00edmite del presupuesto semanal");
    record33.set("estado", "Pendiente");
    record33.set("bloque", "Operaci\u00f3n");
    record33.set("check_hoy", false);
    record33.set("check_semana", false);
  try {
    app.save(record33);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record34 = new Record(collection);
    record34.set("numero", "35");
    record34.set("categoria_codigo", "B");
    record34.set("categoria_nombre", "Operaci\u00f3n diaria");
    record34.set("tarea", "Revisar facturas de pan y empanadas");
    record34.set("frecuencia", "Diaria");
    record34.set("prioridad", "Media");
    record34.set("semana_actual", true);
    record34.set("notas", "Al recibir cada entrega");
    record34.set("estado", "Pendiente");
    record34.set("bloque", "Operaci\u00f3n");
    record34.set("check_hoy", false);
    record34.set("check_semana", false);
  try {
    app.save(record34);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record35 = new Record(collection);
    record35.set("numero", "36");
    record35.set("categoria_codigo", "B");
    record35.set("categoria_nombre", "Operaci\u00f3n diaria");
    record35.set("tarea", "Recontar envases de bebidas y cervezas");
    record35.set("frecuencia", "Diaria");
    record35.set("prioridad", "Media");
    record35.set("semana_actual", true);
    record35.set("notas", "Control de stock b\u00e1sico");
    record35.set("estado", "Pendiente");
    record35.set("bloque", "Operaci\u00f3n");
    record35.set("check_hoy", false);
    record35.set("check_semana", false);
  try {
    app.save(record35);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record36 = new Record(collection);
    record36.set("numero", "37");
    record36.set("categoria_codigo", "B");
    record36.set("categoria_nombre", "Operaci\u00f3n diaria");
    record36.set("tarea", "Mantener aseo y orden del local");
    record36.set("frecuencia", "Diaria");
    record36.set("prioridad", "Media");
    record36.set("semana_actual", true);
    record36.set("notas", "Apertura y cierre");
    record36.set("estado", "Pendiente");
    record36.set("bloque", "Operaci\u00f3n");
    record36.set("check_hoy", false);
    record36.set("check_semana", false);
  try {
    app.save(record36);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record37 = new Record(collection);
    record37.set("numero", "38");
    record37.set("categoria_codigo", "C");
    record37.set("categoria_nombre", "Inventarios");
    record37.set("tarea", "Implementar gesti\u00f3n de inventarios");
    record37.set("frecuencia", "Puntual");
    record37.set("prioridad", "Alta");
    record37.set("semana_actual", true);
    record37.set("notas", "Define el sistema primero");
    record37.set("estado", "Pendiente");
    record37.set("bloque", "Operaci\u00f3n");
    record37.set("check_hoy", false);
    record37.set("check_semana", false);
  try {
    app.save(record37);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record38 = new Record(collection);
    record38.set("numero", "39");
    record38.set("categoria_codigo", "C");
    record38.set("categoria_nombre", "Inventarios");
    record38.set("tarea", "Planificar proceso de inventarios y cuadratura");
    record38.set("frecuencia", "Puntual");
    record38.set("prioridad", "Alta");
    record38.set("semana_actual", false);
    record38.set("estado", "Pendiente");
    record38.set("bloque", "Operaci\u00f3n");
    record38.set("check_hoy", false);
    record38.set("check_semana", false);
  try {
    app.save(record38);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record39 = new Record(collection);
    record39.set("numero", "40");
    record39.set("categoria_codigo", "C");
    record39.set("categoria_nombre", "Inventarios");
    record39.set("tarea", "Realizar inventarios diarios");
    record39.set("frecuencia", "Diaria");
    record39.set("prioridad", "Alta");
    record39.set("semana_actual", true);
    record39.set("estado", "Pendiente");
    record39.set("bloque", "Operaci\u00f3n");
    record39.set("check_hoy", false);
    record39.set("check_semana", false);
  try {
    app.save(record39);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record40 = new Record(collection);
    record40.set("numero", "41");
    record40.set("categoria_codigo", "C");
    record40.set("categoria_nombre", "Inventarios");
    record40.set("tarea", "Priorizar inventarios por productos m\u00e1s vendidos");
    record40.set("frecuencia", "Semanal");
    record40.set("prioridad", "Alta");
    record40.set("semana_actual", true);
    record40.set("notas", "Ajustar seg\u00fan ventas recientes");
    record40.set("estado", "Pendiente");
    record40.set("bloque", "Operaci\u00f3n");
    record40.set("check_hoy", false);
    record40.set("check_semana", false);
  try {
    app.save(record40);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record41 = new Record(collection);
    record41.set("numero", "42");
    record41.set("categoria_codigo", "C");
    record41.set("categoria_nombre", "Inventarios");
    record41.set("tarea", "Control de vencimientos en inventarios");
    record41.set("frecuencia", "Puntual");
    record41.set("prioridad", "Alta");
    record41.set("semana_actual", false);
    record41.set("estado", "Pendiente");
    record41.set("bloque", "Operaci\u00f3n");
    record41.set("check_hoy", false);
    record41.set("check_semana", false);
  try {
    app.save(record41);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record42 = new Record(collection);
    record42.set("numero", "43");
    record42.set("categoria_codigo", "C");
    record42.set("categoria_nombre", "Inventarios");
    record42.set("tarea", "Turno tarde para revisi\u00f3n de vencimientos");
    record42.set("frecuencia", "Diaria");
    record42.set("prioridad", "Alta");
    record42.set("semana_actual", true);
    record42.set("notas", "Designar responsable fijo");
    record42.set("estado", "Pendiente");
    record42.set("bloque", "Operaci\u00f3n");
    record42.set("check_hoy", false);
    record42.set("check_semana", false);
  try {
    app.save(record42);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record43 = new Record(collection);
    record43.set("numero", "44");
    record43.set("categoria_codigo", "C");
    record43.set("categoria_nombre", "Inventarios");
    record43.set("tarea", "Procedimiento de reposici\u00f3n de productos");
    record43.set("frecuencia", "Puntual");
    record43.set("prioridad", "Alta");
    record43.set("semana_actual", true);
    record43.set("estado", "Pendiente");
    record43.set("bloque", "Operaci\u00f3n");
    record43.set("check_hoy", false);
    record43.set("check_semana", false);
  try {
    app.save(record43);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record44 = new Record(collection);
    record44.set("numero", "45");
    record44.set("categoria_codigo", "C");
    record44.set("categoria_nombre", "Inventarios");
    record44.set("tarea", "Procedimiento de recepci\u00f3n de mercader\u00edas");
    record44.set("frecuencia", "Puntual");
    record44.set("prioridad", "Alta");
    record44.set("semana_actual", true);
    record44.set("estado", "Pendiente");
    record44.set("bloque", "Operaci\u00f3n");
    record44.set("check_hoy", false);
    record44.set("check_semana", false);
  try {
    app.save(record44);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record45 = new Record(collection);
    record45.set("numero", "46");
    record45.set("categoria_codigo", "C");
    record45.set("categoria_nombre", "Inventarios");
    record45.set("tarea", "Definir ingreso de stock y funciones");
    record45.set("frecuencia", "Puntual");
    record45.set("prioridad", "Media");
    record45.set("semana_actual", false);
    record45.set("estado", "Pendiente");
    record45.set("bloque", "Operaci\u00f3n");
    record45.set("check_hoy", false);
    record45.set("check_semana", false);
  try {
    app.save(record45);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record46 = new Record(collection);
    record46.set("numero", "47");
    record46.set("categoria_codigo", "C");
    record46.set("categoria_nombre", "Inventarios");
    record46.set("tarea", "Actualizaci\u00f3n de stock desde inventarios");
    record46.set("frecuencia", "Puntual");
    record46.set("prioridad", "Media");
    record46.set("semana_actual", false);
    record46.set("estado", "Pendiente");
    record46.set("bloque", "Operaci\u00f3n");
    record46.set("check_hoy", false);
    record46.set("check_semana", false);
  try {
    app.save(record46);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record47 = new Record(collection);
    record47.set("numero", "48");
    record47.set("categoria_codigo", "C");
    record47.set("categoria_nombre", "Inventarios");
    record47.set("tarea", "Colocar etiquetas en repisas");
    record47.set("frecuencia", "Puntual");
    record47.set("prioridad", "Media");
    record47.set("semana_actual", true);
    record47.set("notas", "Mejora inmediata de sala");
    record47.set("estado", "Pendiente");
    record47.set("bloque", "Operaci\u00f3n");
    record47.set("check_hoy", false);
    record47.set("check_semana", false);
  try {
    app.save(record47);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record48 = new Record(collection);
    record48.set("numero", "49");
    record48.set("categoria_codigo", "C");
    record48.set("categoria_nombre", "Inventarios");
    record48.set("tarea", "Comprar etiquetas para c\u00f3digos de barra");
    record48.set("frecuencia", "Puntual");
    record48.set("prioridad", "Media");
    record48.set("semana_actual", true);
    record48.set("estado", "Pendiente");
    record48.set("bloque", "Operaci\u00f3n");
    record48.set("check_hoy", false);
    record48.set("check_semana", false);
  try {
    app.save(record48);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record49 = new Record(collection);
    record49.set("numero", "50");
    record49.set("categoria_codigo", "C");
    record49.set("categoria_nombre", "Inventarios");
    record49.set("tarea", "Crear afiche de orden de coolers");
    record49.set("frecuencia", "Puntual");
    record49.set("prioridad", "Baja");
    record49.set("semana_actual", true);
    record49.set("notas", "Tarea r\u00e1pida de dise\u00f1o");
    record49.set("estado", "Pendiente");
    record49.set("bloque", "Operaci\u00f3n");
    record49.set("check_hoy", false);
    record49.set("check_semana", false);
  try {
    app.save(record49);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record50 = new Record(collection);
    record50.set("numero", "51");
    record50.set("categoria_codigo", "C");
    record50.set("categoria_nombre", "Inventarios");
    record50.set("tarea", "Resolver arreglo de m\u00e1quina de cecinas");
    record50.set("frecuencia", "Puntual");
    record50.set("prioridad", "Alta");
    record50.set("semana_actual", true);
    record50.set("notas", "Afecta operaci\u00f3n directamente");
    record50.set("estado", "Pendiente");
    record50.set("bloque", "Operaci\u00f3n");
    record50.set("check_hoy", false);
    record50.set("check_semana", false);
  try {
    app.save(record50);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record51 = new Record(collection);
    record51.set("numero", "52");
    record51.set("categoria_codigo", "D");
    record51.set("categoria_nombre", "Administraci\u00f3n contable");
    record51.set("tarea", "Dise\u00f1ar ingreso de facturas al sistema");
    record51.set("frecuencia", "Puntual");
    record51.set("prioridad", "Alta");
    record51.set("semana_actual", true);
    record51.set("notas", "Definir proceso antes de ingresar");
    record51.set("estado", "Pendiente");
    record51.set("bloque", "Administraci\u00f3n");
    record51.set("check_hoy", false);
    record51.set("check_semana", false);
  try {
    app.save(record51);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record52 = new Record(collection);
    record52.set("numero", "53");
    record52.set("categoria_codigo", "D");
    record52.set("categoria_nombre", "Administraci\u00f3n contable");
    record52.set("tarea", "Transcribir y ordenar flujo de facturas");
    record52.set("frecuencia", "Puntual");
    record52.set("prioridad", "Media");
    record52.set("semana_actual", false);
    record52.set("estado", "Pendiente");
    record52.set("bloque", "Administraci\u00f3n");
    record52.set("check_hoy", false);
    record52.set("check_semana", false);
  try {
    app.save(record52);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record53 = new Record(collection);
    record53.set("numero", "54");
    record53.set("categoria_codigo", "D");
    record53.set("categoria_nombre", "Administraci\u00f3n contable");
    record53.set("tarea", "Ingresar facturas de CCU y Coca-Cola");
    record53.set("frecuencia", "Puntual");
    record53.set("prioridad", "Alta");
    record53.set("semana_actual", true);
    record53.set("estado", "Pendiente");
    record53.set("bloque", "Administraci\u00f3n");
    record53.set("check_hoy", false);
    record53.set("check_semana", false);
  try {
    app.save(record53);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record54 = new Record(collection);
    record54.set("numero", "55");
    record54.set("categoria_codigo", "D");
    record54.set("categoria_nombre", "Administraci\u00f3n contable");
    record54.set("tarea", "Ingresar DIN al registro Iciz Market SpA");
    record54.set("frecuencia", "Puntual");
    record54.set("prioridad", "Media");
    record54.set("semana_actual", false);
    record54.set("estado", "Pendiente");
    record54.set("bloque", "Administraci\u00f3n");
    record54.set("check_hoy", false);
    record54.set("check_semana", false);
  try {
    app.save(record54);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record55 = new Record(collection);
    record55.set("numero", "56");
    record55.set("categoria_codigo", "D");
    record55.set("categoria_nombre", "Administraci\u00f3n contable");
    record55.set("tarea", "Registrar factura DHL");
    record55.set("frecuencia", "Puntual");
    record55.set("prioridad", "Media");
    record55.set("semana_actual", false);
    record55.set("estado", "Pendiente");
    record55.set("bloque", "Administraci\u00f3n");
    record55.set("check_hoy", false);
    record55.set("check_semana", false);
  try {
    app.save(record55);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record56 = new Record(collection);
    record56.set("numero", "57");
    record56.set("categoria_codigo", "D");
    record56.set("categoria_nombre", "Administraci\u00f3n contable");
    record56.set("tarea", "Preparar rectificatoria IM para DTE");
    record56.set("frecuencia", "Puntual");
    record56.set("prioridad", "Alta");
    record56.set("semana_actual", true);
    record56.set("estado", "Pendiente");
    record56.set("bloque", "Administraci\u00f3n");
    record56.set("check_hoy", false);
    record56.set("check_semana", false);
  try {
    app.save(record56);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record57 = new Record(collection);
    record57.set("numero", "58");
    record57.set("categoria_codigo", "D");
    record57.set("categoria_nombre", "Administraci\u00f3n contable");
    record57.set("tarea", "Preparar LRE para la DTE");
    record57.set("frecuencia", "Puntual");
    record57.set("prioridad", "Alta");
    record57.set("semana_actual", false);
    record57.set("estado", "Pendiente");
    record57.set("bloque", "Administraci\u00f3n");
    record57.set("check_hoy", false);
    record57.set("check_semana", false);
  try {
    app.save(record57);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record58 = new Record(collection);
    record58.set("numero", "59");
    record58.set("categoria_codigo", "D");
    record58.set("categoria_nombre", "Administraci\u00f3n contable");
    record58.set("tarea", "Revisar intereses cr\u00e9ditos 2024 para rebajar utilidad");
    record58.set("frecuencia", "Mensual");
    record58.set("prioridad", "Media");
    record58.set("semana_actual", false);
    record58.set("estado", "Pendiente");
    record58.set("bloque", "Administraci\u00f3n");
    record58.set("check_hoy", false);
    record58.set("check_semana", false);
  try {
    app.save(record58);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record59 = new Record(collection);
    record59.set("numero", "60");
    record59.set("categoria_codigo", "D");
    record59.set("categoria_nombre", "Administraci\u00f3n contable");
    record59.set("tarea", "Estudiar costos y gastos mensualmente");
    record59.set("frecuencia", "Mensual");
    record59.set("prioridad", "Media");
    record59.set("semana_actual", true);
    record59.set("notas", "Viernes o s\u00e1bado");
    record59.set("estado", "Pendiente");
    record59.set("bloque", "Administraci\u00f3n");
    record59.set("check_hoy", false);
    record59.set("check_semana", false);
  try {
    app.save(record59);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record60 = new Record(collection);
    record60.set("numero", "61");
    record60.set("categoria_codigo", "D");
    record60.set("categoria_nombre", "Administraci\u00f3n contable");
    record60.set("tarea", "Cuantificar y controlar mermas");
    record60.set("frecuencia", "Mensual");
    record60.set("prioridad", "Media");
    record60.set("semana_actual", false);
    record60.set("notas", "Comparar con mes anterior");
    record60.set("estado", "Pendiente");
    record60.set("bloque", "Administraci\u00f3n");
    record60.set("check_hoy", false);
    record60.set("check_semana", false);
  try {
    app.save(record60);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record61 = new Record(collection);
    record61.set("numero", "62");
    record61.set("categoria_codigo", "E");
    record61.set("categoria_nombre", "Recursos humanos");
    record61.set("tarea", "Construir equipo s\u00f3lido y alineado");
    record61.set("frecuencia", "Puntual");
    record61.set("prioridad", "Alta");
    record61.set("semana_actual", false);
    record61.set("estado", "Pendiente");
    record61.set("bloque", "Administraci\u00f3n");
    record61.set("check_hoy", false);
    record61.set("check_semana", false);
  try {
    app.save(record61);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record62 = new Record(collection);
    record62.set("numero", "63");
    record62.set("categoria_codigo", "E");
    record62.set("categoria_nombre", "Recursos humanos");
    record62.set("tarea", "Crear reglamento interno de funciones");
    record62.set("frecuencia", "Puntual");
    record62.set("prioridad", "Alta");
    record62.set("semana_actual", true);
    record62.set("notas", "Base para contratos y DT");
    record62.set("estado", "Pendiente");
    record62.set("bloque", "Administraci\u00f3n");
    record62.set("check_hoy", false);
    record62.set("check_semana", false);
  try {
    app.save(record62);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record63 = new Record(collection);
    record63.set("numero", "64");
    record63.set("categoria_codigo", "E");
    record63.set("categoria_nombre", "Recursos humanos");
    record63.set("tarea", "Definir descripci\u00f3n de cargos");
    record63.set("frecuencia", "Puntual");
    record63.set("prioridad", "Alta");
    record63.set("semana_actual", true);
    record63.set("estado", "Pendiente");
    record63.set("bloque", "Administraci\u00f3n");
    record63.set("check_hoy", false);
    record63.set("check_semana", false);
  try {
    app.save(record63);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record64 = new Record(collection);
    record64.set("numero", "65");
    record64.set("categoria_codigo", "E");
    record64.set("categoria_nombre", "Recursos humanos");
    record64.set("tarea", "Confeccionar contratos part time");
    record64.set("frecuencia", "Puntual");
    record64.set("prioridad", "Alta");
    record64.set("semana_actual", false);
    record64.set("estado", "Pendiente");
    record64.set("bloque", "Administraci\u00f3n");
    record64.set("check_hoy", false);
    record64.set("check_semana", false);
  try {
    app.save(record64);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record65 = new Record(collection);
    record65.set("numero", "66");
    record65.set("categoria_codigo", "E");
    record65.set("categoria_nombre", "Recursos humanos");
    record65.set("tarea", "Costear horas part time para turnos");
    record65.set("frecuencia", "Puntual");
    record65.set("prioridad", "Alta");
    record65.set("semana_actual", false);
    record65.set("estado", "Pendiente");
    record65.set("bloque", "Administraci\u00f3n");
    record65.set("check_hoy", false);
    record65.set("check_semana", false);
  try {
    app.save(record65);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record66 = new Record(collection);
    record66.set("numero", "67");
    record66.set("categoria_codigo", "E");
    record66.set("categoria_nombre", "Recursos humanos");
    record66.set("tarea", "Ingresar trabajadores a la DT");
    record66.set("frecuencia", "Puntual");
    record66.set("prioridad", "Alta");
    record66.set("semana_actual", true);
    record66.set("notas", "Urgente si hay sin contrato");
    record66.set("estado", "Pendiente");
    record66.set("bloque", "Administraci\u00f3n");
    record66.set("check_hoy", false);
    record66.set("check_semana", false);
  try {
    app.save(record66);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record67 = new Record(collection);
    record67.set("numero", "68");
    record67.set("categoria_codigo", "E");
    record67.set("categoria_nombre", "Recursos humanos");
    record67.set("tarea", "Enviar libro de remuneraciones a la DT");
    record67.set("frecuencia", "Puntual");
    record67.set("prioridad", "Alta");
    record67.set("semana_actual", false);
    record67.set("estado", "Pendiente");
    record67.set("bloque", "Administraci\u00f3n");
    record67.set("check_hoy", false);
    record67.set("check_semana", false);
  try {
    app.save(record67);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record68 = new Record(collection);
    record68.set("numero", "69");
    record68.set("categoria_codigo", "E");
    record68.set("categoria_nombre", "Recursos humanos");
    record68.set("tarea", "Preparar liquidaciones y contratos pendientes");
    record68.set("frecuencia", "Puntual");
    record68.set("prioridad", "Alta");
    record68.set("semana_actual", false);
    record68.set("estado", "Pendiente");
    record68.set("bloque", "Administraci\u00f3n");
    record68.set("check_hoy", false);
    record68.set("check_semana", false);
  try {
    app.save(record68);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record69 = new Record(collection);
    record69.set("numero", "70");
    record69.set("categoria_codigo", "E");
    record69.set("categoria_nombre", "Recursos humanos");
    record69.set("tarea", "Revisar carga familiar de Jacqueline");
    record69.set("frecuencia", "Puntual");
    record69.set("prioridad", "Media");
    record69.set("semana_actual", false);
    record69.set("estado", "Pendiente");
    record69.set("bloque", "Administraci\u00f3n");
    record69.set("check_hoy", false);
    record69.set("check_semana", false);
  try {
    app.save(record69);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record70 = new Record(collection);
    record70.set("numero", "71");
    record70.set("categoria_codigo", "F");
    record70.set("categoria_nombre", "Ventas y marketing");
    record70.set("tarea", "Crear modelo de atenci\u00f3n");
    record70.set("frecuencia", "Puntual");
    record70.set("prioridad", "Alta");
    record70.set("semana_actual", true);
    record70.set("notas", "Define c\u00f3mo se recibe al cliente");
    record70.set("estado", "Pendiente");
    record70.set("bloque", "Ventas");
    record70.set("check_hoy", false);
    record70.set("check_semana", false);
  try {
    app.save(record70);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record71 = new Record(collection);
    record71.set("numero", "72");
    record71.set("categoria_codigo", "F");
    record71.set("categoria_nombre", "Ventas y marketing");
    record71.set("tarea", "Encuesta de satisfacci\u00f3n a clientes");
    record71.set("frecuencia", "Puntual");
    record71.set("prioridad", "Media");
    record71.set("semana_actual", false);
    record71.set("estado", "Pendiente");
    record71.set("bloque", "Ventas");
    record71.set("check_hoy", false);
    record71.set("check_semana", false);
  try {
    app.save(record71);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record72 = new Record(collection);
    record72.set("numero", "73");
    record72.set("categoria_codigo", "F");
    record72.set("categoria_nombre", "Ventas y marketing");
    record72.set("tarea", "Definir canal principal de venta digital");
    record72.set("frecuencia", "Puntual");
    record72.set("prioridad", "Alta");
    record72.set("semana_actual", true);
    record72.set("notas", "Decisi\u00f3n estrat\u00e9gica r\u00e1pida");
    record72.set("estado", "Pendiente");
    record72.set("bloque", "Ventas");
    record72.set("check_hoy", false);
    record72.set("check_semana", false);
  try {
    app.save(record72);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record73 = new Record(collection);
    record73.set("numero", "74");
    record73.set("categoria_codigo", "F");
    record73.set("categoria_nombre", "Ventas y marketing");
    record73.set("tarea", "Implementar p\u00e1gina web como canal de ventas");
    record73.set("frecuencia", "Puntual");
    record73.set("prioridad", "Media");
    record73.set("semana_actual", false);
    record73.set("estado", "Pendiente");
    record73.set("bloque", "Ventas");
    record73.set("check_hoy", false);
    record73.set("check_semana", false);
  try {
    app.save(record73);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record74 = new Record(collection);
    record74.set("numero", "75");
    record74.set("categoria_codigo", "F");
    record74.set("categoria_nombre", "Ventas y marketing");
    record74.set("tarea", "Incentivar pedidos WhatsApp con retiro");
    record74.set("frecuencia", "Puntual");
    record74.set("prioridad", "Media");
    record74.set("semana_actual", false);
    record74.set("estado", "Pendiente");
    record74.set("bloque", "Ventas");
    record74.set("check_hoy", false);
    record74.set("check_semana", false);
  try {
    app.save(record74);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record75 = new Record(collection);
    record75.set("numero", "76");
    record75.set("categoria_codigo", "F");
    record75.set("categoria_nombre", "Ventas y marketing");
    record75.set("tarea", "Incentivar ventas WhatsApp con delivery");
    record75.set("frecuencia", "Puntual");
    record75.set("prioridad", "Media");
    record75.set("semana_actual", false);
    record75.set("estado", "Pendiente");
    record75.set("bloque", "Ventas");
    record75.set("check_hoy", false);
    record75.set("check_semana", false);
  try {
    app.save(record75);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record76 = new Record(collection);
    record76.set("numero", "77");
    record76.set("categoria_codigo", "F");
    record76.set("categoria_nombre", "Ventas y marketing");
    record76.set("tarea", "Campa\u00f1a para registrar WhatsApp del local");
    record76.set("frecuencia", "Puntual");
    record76.set("prioridad", "Alta");
    record76.set("semana_actual", true);
    record76.set("notas", "QR en caja \u2014 alto impacto");
    record76.set("estado", "Pendiente");
    record76.set("bloque", "Ventas");
    record76.set("check_hoy", false);
    record76.set("check_semana", false);
  try {
    app.save(record76);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record77 = new Record(collection);
    record77.set("numero", "78");
    record77.set("categoria_codigo", "F");
    record77.set("categoria_nombre", "Ventas y marketing");
    record77.set("tarea", "Campa\u00f1as WhatsApp, ofertas y referidos");
    record77.set("frecuencia", "Puntual");
    record77.set("prioridad", "Media");
    record77.set("semana_actual", false);
    record77.set("estado", "Pendiente");
    record77.set("bloque", "Ventas");
    record77.set("check_hoy", false);
    record77.set("check_semana", false);
  try {
    app.save(record77);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record78 = new Record(collection);
    record78.set("numero", "79");
    record78.set("categoria_codigo", "F");
    record78.set("categoria_nombre", "Ventas y marketing");
    record78.set("tarea", "Lanzar ofertas diarias y semanales");
    record78.set("frecuencia", "Diaria");
    record78.set("prioridad", "Alta");
    record78.set("semana_actual", true);
    record78.set("notas", "Publicar antes de las 10:00 AM");
    record78.set("estado", "Pendiente");
    record78.set("bloque", "Ventas");
    record78.set("check_hoy", false);
    record78.set("check_semana", false);
  try {
    app.save(record78);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record79 = new Record(collection);
    record79.set("numero", "80");
    record79.set("categoria_codigo", "F");
    record79.set("categoria_nombre", "Ventas y marketing");
    record79.set("tarea", "Iniciar campa\u00f1a del 10%");
    record79.set("frecuencia", "Puntual");
    record79.set("prioridad", "Alta");
    record79.set("semana_actual", true);
    record79.set("estado", "Pendiente");
    record79.set("bloque", "Ventas");
    record79.set("check_hoy", false);
    record79.set("check_semana", false);
  try {
    app.save(record79);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record80 = new Record(collection);
    record80.set("numero", "81");
    record80.set("categoria_codigo", "F");
    record80.set("categoria_nombre", "Ventas y marketing");
    record80.set("tarea", "Implementar campa\u00f1a de referidos");
    record80.set("frecuencia", "Puntual");
    record80.set("prioridad", "Media");
    record80.set("semana_actual", false);
    record80.set("estado", "Pendiente");
    record80.set("bloque", "Ventas");
    record80.set("check_hoy", false);
    record80.set("check_semana", false);
  try {
    app.save(record80);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record81 = new Record(collection);
    record81.set("numero", "82");
    record81.set("categoria_codigo", "F");
    record81.set("categoria_nombre", "Ventas y marketing");
    record81.set("tarea", "Concurso semanal con premio $50.000");
    record81.set("frecuencia", "Puntual");
    record81.set("prioridad", "Media");
    record81.set("semana_actual", false);
    record81.set("estado", "Pendiente");
    record81.set("bloque", "Ventas");
    record81.set("check_hoy", false);
    record81.set("check_semana", false);
  try {
    app.save(record81);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record82 = new Record(collection);
    record82.set("numero", "83");
    record82.set("categoria_codigo", "F");
    record82.set("categoria_nombre", "Ventas y marketing");
    record82.set("tarea", "Publicidad y campa\u00f1as redes sociales");
    record82.set("frecuencia", "Semanal");
    record82.set("prioridad", "Media");
    record82.set("semana_actual", true);
    record82.set("notas", "Planificar contenido de la semana");
    record82.set("estado", "Pendiente");
    record82.set("bloque", "Ventas");
    record82.set("check_hoy", false);
    record82.set("check_semana", false);
  try {
    app.save(record82);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record83 = new Record(collection);
    record83.set("numero", "84");
    record83.set("categoria_codigo", "F");
    record83.set("categoria_nombre", "Ventas y marketing");
    record83.set("tarea", "Enviar publicaciones del d\u00eda");
    record83.set("frecuencia", "Diaria");
    record83.set("prioridad", "Media");
    record83.set("semana_actual", true);
    record83.set("notas", "Instagram y/o Facebook");
    record83.set("estado", "Pendiente");
    record83.set("bloque", "Ventas");
    record83.set("check_hoy", false);
    record83.set("check_semana", false);
  try {
    app.save(record83);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record84 = new Record(collection);
    record84.set("numero", "85");
    record84.set("categoria_codigo", "F");
    record84.set("categoria_nombre", "Ventas y marketing");
    record84.set("tarea", "Informar ofertas por redes y carteles");
    record84.set("frecuencia", "Semanal");
    record84.set("prioridad", "Media");
    record84.set("semana_actual", true);
    record84.set("notas", "Actualizar semanalmente");
    record84.set("estado", "Pendiente");
    record84.set("bloque", "Ventas");
    record84.set("check_hoy", false);
    record84.set("check_semana", false);
  try {
    app.save(record84);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record85 = new Record(collection);
    record85.set("numero", "86");
    record85.set("categoria_codigo", "F");
    record85.set("categoria_nombre", "Ventas y marketing");
    record85.set("tarea", "Premiar clientes en su cumplea\u00f1os");
    record85.set("frecuencia", "Puntual");
    record85.set("prioridad", "Baja");
    record85.set("semana_actual", false);
    record85.set("estado", "Pendiente");
    record85.set("bloque", "Ventas");
    record85.set("check_hoy", false);
    record85.set("check_semana", false);
  try {
    app.save(record85);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record86 = new Record(collection);
    record86.set("numero", "87");
    record86.set("categoria_codigo", "F");
    record86.set("categoria_nombre", "Ventas y marketing");
    record86.set("tarea", "Alianza con locales de comida y vouchers");
    record86.set("frecuencia", "Puntual");
    record86.set("prioridad", "Media");
    record86.set("semana_actual", false);
    record86.set("estado", "Pendiente");
    record86.set("bloque", "Ventas");
    record86.set("check_hoy", false);
    record86.set("check_semana", false);
  try {
    app.save(record86);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record87 = new Record(collection);
    record87.set("numero", "88");
    record87.set("categoria_codigo", "F");
    record87.set("categoria_nombre", "Ventas y marketing");
    record87.set("tarea", "Revisar informe rendimiento Google");
    record87.set("frecuencia", "Semanal");
    record87.set("prioridad", "Media");
    record87.set("semana_actual", true);
    record87.set("notas", "M\u00e9tricas Iciz Market");
    record87.set("estado", "Pendiente");
    record87.set("bloque", "Ventas");
    record87.set("check_hoy", false);
    record87.set("check_semana", false);
  try {
    app.save(record87);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record88 = new Record(collection);
    record88.set("numero", "89");
    record88.set("categoria_codigo", "G");
    record88.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record88.set("tarea", "Definir modelo de negocio");
    record88.set("frecuencia", "Puntual");
    record88.set("prioridad", "Alta");
    record88.set("semana_actual", true);
    record88.set("notas", "30 min con papel y l\u00e1piz");
    record88.set("estado", "Pendiente");
    record88.set("bloque", "Estrategia");
    record88.set("check_hoy", false);
    record88.set("check_semana", false);
  try {
    app.save(record88);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record89 = new Record(collection);
    record89.set("numero", "90");
    record89.set("categoria_codigo", "G");
    record89.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record89.set("tarea", "Definir visi\u00f3n");
    record89.set("frecuencia", "Puntual");
    record89.set("prioridad", "Alta");
    record89.set("semana_actual", true);
    record89.set("estado", "Pendiente");
    record89.set("bloque", "Estrategia");
    record89.set("check_hoy", false);
    record89.set("check_semana", false);
  try {
    app.save(record89);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record90 = new Record(collection);
    record90.set("numero", "91");
    record90.set("categoria_codigo", "G");
    record90.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record90.set("tarea", "Definir misi\u00f3n");
    record90.set("frecuencia", "Puntual");
    record90.set("prioridad", "Alta");
    record90.set("semana_actual", true);
    record90.set("estado", "Pendiente");
    record90.set("bloque", "Estrategia");
    record90.set("check_hoy", false);
    record90.set("check_semana", false);
  try {
    app.save(record90);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record91 = new Record(collection);
    record91.set("numero", "92");
    record91.set("categoria_codigo", "G");
    record91.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record91.set("tarea", "Definir mercado objetivo");
    record91.set("frecuencia", "Puntual");
    record91.set("prioridad", "Alta");
    record91.set("semana_actual", false);
    record91.set("estado", "Pendiente");
    record91.set("bloque", "Estrategia");
    record91.set("check_hoy", false);
    record91.set("check_semana", false);
  try {
    app.save(record91);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record92 = new Record(collection);
    record92.set("numero", "93");
    record92.set("categoria_codigo", "G");
    record92.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record92.set("tarea", "Definir parrilla de productos");
    record92.set("frecuencia", "Puntual");
    record92.set("prioridad", "Alta");
    record92.set("semana_actual", false);
    record92.set("estado", "Pendiente");
    record92.set("bloque", "Estrategia");
    record92.set("check_hoy", false);
    record92.set("check_semana", false);
  try {
    app.save(record92);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record93 = new Record(collection);
    record93.set("numero", "94");
    record93.set("categoria_codigo", "G");
    record93.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record93.set("tarea", "Establecer metas mensuales de venta");
    record93.set("frecuencia", "Mensual");
    record93.set("prioridad", "Alta");
    record93.set("semana_actual", false);
    record93.set("notas", "Primer lunes del mes");
    record93.set("estado", "Pendiente");
    record93.set("bloque", "Estrategia");
    record93.set("check_hoy", false);
    record93.set("check_semana", false);
  try {
    app.save(record93);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record94 = new Record(collection);
    record94.set("numero", "95");
    record94.set("categoria_codigo", "G");
    record94.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record94.set("tarea", "Incrementar ventas en 30%");
    record94.set("frecuencia", "Meta");
    record94.set("prioridad", "Alta");
    record94.set("semana_actual", false);
    record94.set("estado", "Pendiente");
    record94.set("bloque", "Estrategia");
    record94.set("check_hoy", false);
    record94.set("check_semana", false);
  try {
    app.save(record94);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record95 = new Record(collection);
    record95.set("numero", "96");
    record95.set("categoria_codigo", "G");
    record95.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record95.set("tarea", "Aumentar margen operacional a MM$4");
    record95.set("frecuencia", "Meta");
    record95.set("prioridad", "Alta");
    record95.set("semana_actual", false);
    record95.set("estado", "Pendiente");
    record95.set("bloque", "Estrategia");
    record95.set("check_hoy", false);
    record95.set("check_semana", false);
  try {
    app.save(record95);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record96 = new Record(collection);
    record96.set("numero", "97");
    record96.set("categoria_codigo", "G");
    record96.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record96.set("tarea", "Determinar curvas ABC");
    record96.set("frecuencia", "Puntual");
    record96.set("prioridad", "Alta");
    record96.set("semana_actual", false);
    record96.set("estado", "Pendiente");
    record96.set("bloque", "Estrategia");
    record96.set("check_hoy", false);
    record96.set("check_semana", false);
  try {
    app.save(record96);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record97 = new Record(collection);
    record97.set("numero", "98");
    record97.set("categoria_codigo", "G");
    record97.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record97.set("tarea", "Identificar productos sensibles y ancla");
    record97.set("frecuencia", "Puntual");
    record97.set("prioridad", "Alta");
    record97.set("semana_actual", false);
    record97.set("estado", "Pendiente");
    record97.set("bloque", "Estrategia");
    record97.set("check_hoy", false);
    record97.set("check_semana", false);
  try {
    app.save(record97);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record98 = new Record(collection);
    record98.set("numero", "99");
    record98.set("categoria_codigo", "G");
    record98.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record98.set("tarea", "Pol\u00edtica de precios para productos ancla");
    record98.set("frecuencia", "Puntual");
    record98.set("prioridad", "Media");
    record98.set("semana_actual", false);
    record98.set("estado", "Pendiente");
    record98.set("bloque", "Estrategia");
    record98.set("check_hoy", false);
    record98.set("check_semana", false);
  try {
    app.save(record98);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record99 = new Record(collection);
    record99.set("numero", "100");
    record99.set("categoria_codigo", "G");
    record99.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record99.set("tarea", "Procedimiento de c\u00e1lculo de precios");
    record99.set("frecuencia", "Puntual");
    record99.set("prioridad", "Media");
    record99.set("semana_actual", false);
    record99.set("estado", "Pendiente");
    record99.set("bloque", "Estrategia");
    record99.set("check_hoy", false);
    record99.set("check_semana", false);
  try {
    app.save(record99);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record100 = new Record(collection);
    record100.set("numero", "101");
    record100.set("categoria_codigo", "G");
    record100.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record100.set("tarea", "Revisi\u00f3n peri\u00f3dica de precios");
    record100.set("frecuencia", "Mensual");
    record100.set("prioridad", "Media");
    record100.set("semana_actual", false);
    record100.set("estado", "Pendiente");
    record100.set("bloque", "Estrategia");
    record100.set("check_hoy", false);
    record100.set("check_semana", false);
  try {
    app.save(record100);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record101 = new Record(collection);
    record101.set("numero", "102");
    record101.set("categoria_codigo", "G");
    record101.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record101.set("tarea", "Evaluar productos m\u00e1s vendidos mensual");
    record101.set("frecuencia", "Mensual");
    record101.set("prioridad", "Media");
    record101.set("semana_actual", true);
    record101.set("notas", "Comparar con mes anterior");
    record101.set("estado", "Pendiente");
    record101.set("bloque", "Estrategia");
    record101.set("check_hoy", false);
    record101.set("check_semana", false);
  try {
    app.save(record101);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record102 = new Record(collection);
    record102.set("numero", "103");
    record102.set("categoria_codigo", "G");
    record102.set("categoria_nombre", "Estrategia y planificaci\u00f3n");
    record102.set("tarea", "Auditor\u00eda mensual de procesos");
    record102.set("frecuencia", "Mensual");
    record102.set("prioridad", "Alta");
    record102.set("semana_actual", false);
    record102.set("notas", "\u00daltimo viernes del mes");
    record102.set("estado", "Pendiente");
    record102.set("bloque", "Estrategia");
    record102.set("check_hoy", false);
    record102.set("check_semana", false);
  try {
    app.save(record102);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record103 = new Record(collection);
    record103.set("numero", "104");
    record103.set("categoria_codigo", "H");
    record103.set("categoria_nombre", "Sistemas y herramientas");
    record103.set("tarea", "Revisar utilidad de plantillas del sistema");
    record103.set("frecuencia", "Puntual");
    record103.set("prioridad", "Media");
    record103.set("semana_actual", false);
    record103.set("estado", "Pendiente");
    record103.set("bloque", "Sistemas");
    record103.set("check_hoy", false);
    record103.set("check_semana", false);
  try {
    app.save(record103);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record104 = new Record(collection);
    record104.set("numero", "105");
    record104.set("categoria_codigo", "H");
    record104.set("categoria_nombre", "Sistemas y herramientas");
    record104.set("tarea", "Definir sistema de pedidos");
    record104.set("frecuencia", "Puntual");
    record104.set("prioridad", "Alta");
    record104.set("semana_actual", false);
    record104.set("estado", "Pendiente");
    record104.set("bloque", "Sistemas");
    record104.set("check_hoy", false);
    record104.set("check_semana", false);
  try {
    app.save(record104);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record105 = new Record(collection);
    record105.set("numero", "106");
    record105.set("categoria_codigo", "H");
    record105.set("categoria_nombre", "Sistemas y herramientas");
    record105.set("tarea", "Crear sistemas que automaticen y deleguen");
    record105.set("frecuencia", "Puntual");
    record105.set("prioridad", "Alta");
    record105.set("semana_actual", false);
    record105.set("estado", "Pendiente");
    record105.set("bloque", "Sistemas");
    record105.set("check_hoy", false);
    record105.set("check_semana", false);
  try {
    app.save(record105);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record106 = new Record(collection);
    record106.set("numero", "107");
    record106.set("categoria_codigo", "H");
    record106.set("categoria_nombre", "Sistemas y herramientas");
    record106.set("tarea", "Cotizar Nubox");
    record106.set("frecuencia", "Puntual");
    record106.set("prioridad", "Media");
    record106.set("semana_actual", true);
    record106.set("notas", "Solo cotizar esta semana");
    record106.set("estado", "Pendiente");
    record106.set("bloque", "Sistemas");
    record106.set("check_hoy", false);
    record106.set("check_semana", false);
  try {
    app.save(record106);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record107 = new Record(collection);
    record107.set("numero", "108");
    record107.set("categoria_codigo", "H");
    record107.set("categoria_nombre", "Sistemas y herramientas");
    record107.set("tarea", "Cotizar Maxxa");
    record107.set("frecuencia", "Puntual");
    record107.set("prioridad", "Media");
    record107.set("semana_actual", true);
    record107.set("estado", "Pendiente");
    record107.set("bloque", "Sistemas");
    record107.set("check_hoy", false);
    record107.set("check_semana", false);
  try {
    app.save(record107);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record108 = new Record(collection);
    record108.set("numero", "109");
    record108.set("categoria_codigo", "H");
    record108.set("categoria_nombre", "Sistemas y herramientas");
    record108.set("tarea", "Cotizar Khame");
    record108.set("frecuencia", "Puntual");
    record108.set("prioridad", "Media");
    record108.set("semana_actual", true);
    record108.set("estado", "Pendiente");
    record108.set("bloque", "Sistemas");
    record108.set("check_hoy", false);
    record108.set("check_semana", false);
  try {
    app.save(record108);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record109 = new Record(collection);
    record109.set("numero", "110");
    record109.set("categoria_codigo", "H");
    record109.set("categoria_nombre", "Sistemas y herramientas");
    record109.set("tarea", "Cotizar Almacenes Digitales");
    record109.set("frecuencia", "Puntual");
    record109.set("prioridad", "Media");
    record109.set("semana_actual", false);
    record109.set("estado", "Pendiente");
    record109.set("bloque", "Sistemas");
    record109.set("check_hoy", false);
    record109.set("check_semana", false);
  try {
    app.save(record109);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record110 = new Record(collection);
    record110.set("numero", "111");
    record110.set("categoria_codigo", "H");
    record110.set("categoria_nombre", "Sistemas y herramientas");
    record110.set("tarea", "Cotizar Defontana");
    record110.set("frecuencia", "Puntual");
    record110.set("prioridad", "Media");
    record110.set("semana_actual", false);
    record110.set("estado", "Pendiente");
    record110.set("bloque", "Sistemas");
    record110.set("check_hoy", false);
    record110.set("check_semana", false);
  try {
    app.save(record110);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record111 = new Record(collection);
    record111.set("numero", "112");
    record111.set("categoria_codigo", "I");
    record111.set("categoria_nombre", "Desarrollo de apps");
    record111.set("tarea", "App para registro de gastos");
    record111.set("frecuencia", "Puntual");
    record111.set("prioridad", "Media");
    record111.set("semana_actual", false);
    record111.set("estado", "Pendiente");
    record111.set("bloque", "Sistemas");
    record111.set("check_hoy", false);
    record111.set("check_semana", false);
  try {
    app.save(record111);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record112 = new Record(collection);
    record112.set("numero", "113");
    record112.set("categoria_codigo", "I");
    record112.set("categoria_nombre", "Desarrollo de apps");
    record112.set("tarea", "Importaci\u00f3n de fotos/PDF para registro");
    record112.set("frecuencia", "Puntual");
    record112.set("prioridad", "Baja");
    record112.set("semana_actual", false);
    record112.set("estado", "Pendiente");
    record112.set("bloque", "Sistemas");
    record112.set("check_hoy", false);
    record112.set("check_semana", false);
  try {
    app.save(record112);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record113 = new Record(collection);
    record113.set("numero", "114");
    record113.set("categoria_codigo", "I");
    record113.set("categoria_nombre", "Desarrollo de apps");
    record113.set("tarea", "App para inscripci\u00f3n de sorteo $50.000");
    record113.set("frecuencia", "Puntual");
    record113.set("prioridad", "Media");
    record113.set("semana_actual", false);
    record113.set("estado", "Pendiente");
    record113.set("bloque", "Sistemas");
    record113.set("check_hoy", false);
    record113.set("check_semana", false);
  try {
    app.save(record113);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record114 = new Record(collection);
    record114.set("numero", "115");
    record114.set("categoria_codigo", "I");
    record114.set("categoria_nombre", "Desarrollo de apps");
    record114.set("tarea", "Integrar validaci\u00f3n por WhatsApp");
    record114.set("frecuencia", "Puntual");
    record114.set("prioridad", "Baja");
    record114.set("semana_actual", false);
    record114.set("estado", "Pendiente");
    record114.set("bloque", "Sistemas");
    record114.set("check_hoy", false);
    record114.set("check_semana", false);
  try {
    app.save(record114);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record115 = new Record(collection);
    record115.set("numero", "116");
    record115.set("categoria_codigo", "I");
    record115.set("categoria_nombre", "Desarrollo de apps");
    record115.set("tarea", "Crear QR para inscripci\u00f3n");
    record115.set("frecuencia", "Puntual");
    record115.set("prioridad", "Media");
    record115.set("semana_actual", false);
    record115.set("estado", "Pendiente");
    record115.set("bloque", "Sistemas");
    record115.set("check_hoy", false);
    record115.set("check_semana", false);
  try {
    app.save(record115);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record116 = new Record(collection);
    record116.set("numero", "117");
    record116.set("categoria_codigo", "I");
    record116.set("categoria_nombre", "Desarrollo de apps");
    record116.set("tarea", "Crear QR para cargar WhatsApp del local");
    record116.set("frecuencia", "Puntual");
    record116.set("prioridad", "Alta");
    record116.set("semana_actual", true);
    record116.set("notas", "F\u00e1cil, impacto inmediato");
    record116.set("estado", "Pendiente");
    record116.set("bloque", "Sistemas");
    record116.set("check_hoy", false);
    record116.set("check_semana", false);
  try {
    app.save(record116);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record117 = new Record(collection);
    record117.set("numero", "118");
    record117.set("categoria_codigo", "I");
    record117.set("categoria_nombre", "Desarrollo de apps");
    record117.set("tarea", "App para gestionar arriendos");
    record117.set("frecuencia", "Puntual");
    record117.set("prioridad", "Media");
    record117.set("semana_actual", false);
    record117.set("estado", "Pendiente");
    record117.set("bloque", "Sistemas");
    record117.set("check_hoy", false);
    record117.set("check_semana", false);
  try {
    app.save(record117);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record118 = new Record(collection);
    record118.set("numero", "119");
    record118.set("categoria_codigo", "I");
    record118.set("categoria_nombre", "Desarrollo de apps");
    record118.set("tarea", "App para an\u00e1lisis estad\u00edstico del minimarket");
    record118.set("frecuencia", "Puntual");
    record118.set("prioridad", "Media");
    record118.set("semana_actual", false);
    record118.set("estado", "Pendiente");
    record118.set("bloque", "Sistemas");
    record118.set("check_hoy", false);
    record118.set("check_semana", false);
  try {
    app.save(record118);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record119 = new Record(collection);
    record119.set("numero", "120");
    record119.set("categoria_codigo", "I");
    record119.set("categoria_nombre", "Desarrollo de apps");
    record119.set("tarea", "Analizar ventas por horario");
    record119.set("frecuencia", "Puntual");
    record119.set("prioridad", "Media");
    record119.set("semana_actual", false);
    record119.set("estado", "Pendiente");
    record119.set("bloque", "Sistemas");
    record119.set("check_hoy", false);
    record119.set("check_semana", false);
  try {
    app.save(record119);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record120 = new Record(collection);
    record120.set("numero", "121");
    record120.set("categoria_codigo", "I");
    record120.set("categoria_nombre", "Desarrollo de apps");
    record120.set("tarea", "Analizar ventas \u00faltimo a\u00f1o");
    record120.set("frecuencia", "Puntual");
    record120.set("prioridad", "Media");
    record120.set("semana_actual", false);
    record120.set("estado", "Pendiente");
    record120.set("bloque", "Sistemas");
    record120.set("check_hoy", false);
    record120.set("check_semana", false);
  try {
    app.save(record120);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record121 = new Record(collection);
    record121.set("numero", "122");
    record121.set("categoria_codigo", "J");
    record121.set("categoria_nombre", "Negocio online");
    record121.set("tarea", "Presupuesto Iciz Market Online");
    record121.set("frecuencia", "Puntual");
    record121.set("prioridad", "Media");
    record121.set("semana_actual", false);
    record121.set("estado", "Pendiente");
    record121.set("bloque", "Desarrollo");
    record121.set("check_hoy", false);
    record121.set("check_semana", false);
  try {
    app.save(record121);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record122 = new Record(collection);
    record122.set("numero", "123");
    record122.set("categoria_codigo", "J");
    record122.set("categoria_nombre", "Negocio online");
    record122.set("tarea", "Definir canal de venta del negocio online");
    record122.set("frecuencia", "Puntual");
    record122.set("prioridad", "Media");
    record122.set("semana_actual", false);
    record122.set("estado", "Pendiente");
    record122.set("bloque", "Desarrollo");
    record122.set("check_hoy", false);
    record122.set("check_semana", false);
  try {
    app.save(record122);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record123 = new Record(collection);
    record123.set("numero", "124");
    record123.set("categoria_codigo", "J");
    record123.set("categoria_nombre", "Negocio online");
    record123.set("tarea", "Presentaci\u00f3n MVP App Comercio");
    record123.set("frecuencia", "Puntual");
    record123.set("prioridad", "Media");
    record123.set("semana_actual", false);
    record123.set("estado", "Pendiente");
    record123.set("bloque", "Desarrollo");
    record123.set("check_hoy", false);
    record123.set("check_semana", false);
  try {
    app.save(record123);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record124 = new Record(collection);
    record124.set("numero", "125");
    record124.set("categoria_codigo", "J");
    record124.set("categoria_nombre", "Negocio online");
    record124.set("tarea", "Explorar marketing de afiliados");
    record124.set("frecuencia", "Puntual");
    record124.set("prioridad", "Baja");
    record124.set("semana_actual", false);
    record124.set("estado", "Pendiente");
    record124.set("bloque", "Desarrollo");
    record124.set("check_hoy", false);
    record124.set("check_semana", false);
  try {
    app.save(record124);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record125 = new Record(collection);
    record125.set("numero", "126");
    record125.set("categoria_codigo", "J");
    record125.set("categoria_nombre", "Negocio online");
    record125.set("tarea", "Conversar con Jorge Torres");
    record125.set("frecuencia", "Puntual");
    record125.set("prioridad", "Media");
    record125.set("semana_actual", false);
    record125.set("estado", "Pendiente");
    record125.set("bloque", "Desarrollo");
    record125.set("check_hoy", false);
    record125.set("check_semana", false);
  try {
    app.save(record125);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record126 = new Record(collection);
    record126.set("numero", "127");
    record126.set("categoria_codigo", "K");
    record126.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record126.set("tarea", "Capacitaci\u00f3n diaria en supermercados");
    record126.set("frecuencia", "Diaria");
    record126.set("prioridad", "Alta");
    record126.set("semana_actual", true);
    record126.set("estado", "Pendiente");
    record126.set("bloque", "Personal");
    record126.set("check_hoy", false);
    record126.set("check_semana", false);
  try {
    app.save(record126);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record127 = new Record(collection);
    record127.set("numero", "128");
    record127.set("categoria_codigo", "K");
    record127.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record127.set("tarea", "Curso Sistema Americano");
    record127.set("frecuencia", "Puntual");
    record127.set("prioridad", "Media");
    record127.set("semana_actual", false);
    record127.set("estado", "Pendiente");
    record127.set("bloque", "Personal");
    record127.set("check_hoy", false);
    record127.set("check_semana", false);
  try {
    app.save(record127);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record128 = new Record(collection);
    record128.set("numero", "129");
    record128.set("categoria_codigo", "K");
    record128.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record128.set("tarea", "Curso Supermercado Lucrativo");
    record128.set("frecuencia", "Puntual");
    record128.set("prioridad", "Media");
    record128.set("semana_actual", false);
    record128.set("estado", "Pendiente");
    record128.set("bloque", "Personal");
    record128.set("check_hoy", false);
    record128.set("check_semana", false);
  try {
    app.save(record128);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record129 = new Record(collection);
    record129.set("numero", "130");
    record129.set("categoria_codigo", "K");
    record129.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record129.set("tarea", "Curso de Marketing NDEFI");
    record129.set("frecuencia", "Puntual");
    record129.set("prioridad", "Media");
    record129.set("semana_actual", false);
    record129.set("estado", "Pendiente");
    record129.set("bloque", "Personal");
    record129.set("check_hoy", false);
    record129.set("check_semana", false);
  try {
    app.save(record129);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record130 = new Record(collection);
    record130.set("numero", "131");
    record130.set("categoria_codigo", "K");
    record130.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record130.set("tarea", "Curso Empresario Inteligente");
    record130.set("frecuencia", "Puntual");
    record130.set("prioridad", "Media");
    record130.set("semana_actual", false);
    record130.set("estado", "Pendiente");
    record130.set("bloque", "Personal");
    record130.set("check_hoy", false);
    record130.set("check_semana", false);
  try {
    app.save(record130);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record131 = new Record(collection);
    record131.set("numero", "132");
    record131.set("categoria_codigo", "K");
    record131.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record131.set("tarea", "Curso de Importaciones");
    record131.set("frecuencia", "Puntual");
    record131.set("prioridad", "Baja");
    record131.set("semana_actual", false);
    record131.set("estado", "Pendiente");
    record131.set("bloque", "Personal");
    record131.set("check_hoy", false);
    record131.set("check_semana", false);
  try {
    app.save(record131);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record132 = new Record(collection);
    record132.set("numero", "133");
    record132.set("categoria_codigo", "K");
    record132.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record132.set("tarea", "Curso de Seminarios Online");
    record132.set("frecuencia", "Puntual");
    record132.set("prioridad", "Baja");
    record132.set("semana_actual", false);
    record132.set("estado", "Pendiente");
    record132.set("bloque", "Personal");
    record132.set("check_hoy", false);
    record132.set("check_semana", false);
  try {
    app.save(record132);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record133 = new Record(collection);
    record133.set("numero", "134");
    record133.set("categoria_codigo", "K");
    record133.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record133.set("tarea", "Curso Maestr\u00eda JJ Abrahams");
    record133.set("frecuencia", "Puntual");
    record133.set("prioridad", "Baja");
    record133.set("semana_actual", false);
    record133.set("estado", "Pendiente");
    record133.set("bloque", "Personal");
    record133.set("check_hoy", false);
    record133.set("check_semana", false);
  try {
    app.save(record133);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record134 = new Record(collection);
    record134.set("numero", "135");
    record134.set("categoria_codigo", "K");
    record134.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record134.set("tarea", "Curso Foco");
    record134.set("frecuencia", "Puntual");
    record134.set("prioridad", "Baja");
    record134.set("semana_actual", false);
    record134.set("estado", "Pendiente");
    record134.set("bloque", "Personal");
    record134.set("check_hoy", false);
    record134.set("check_semana", false);
  try {
    app.save(record134);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record135 = new Record(collection);
    record135.set("numero", "136");
    record135.set("categoria_codigo", "K");
    record135.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record135.set("tarea", "Curso Lanza.Acelera");
    record135.set("frecuencia", "Puntual");
    record135.set("prioridad", "Baja");
    record135.set("semana_actual", false);
    record135.set("estado", "Pendiente");
    record135.set("bloque", "Personal");
    record135.set("check_hoy", false);
    record135.set("check_semana", false);
  try {
    app.save(record135);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record136 = new Record(collection);
    record136.set("numero", "137");
    record136.set("categoria_codigo", "K");
    record136.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record136.set("tarea", "Curso Las Leyes de la Abundancia");
    record136.set("frecuencia", "Puntual");
    record136.set("prioridad", "Baja");
    record136.set("semana_actual", false);
    record136.set("estado", "Pendiente");
    record136.set("bloque", "Personal");
    record136.set("check_hoy", false);
    record136.set("check_semana", false);
  try {
    app.save(record136);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record137 = new Record(collection);
    record137.set("numero", "138");
    record137.set("categoria_codigo", "K");
    record137.set("categoria_nombre", "Capacitaci\u00f3n y aprendizaje");
    record137.set("tarea", "Curso Divago CORFO");
    record137.set("frecuencia", "Puntual");
    record137.set("prioridad", "Baja");
    record137.set("semana_actual", false);
    record137.set("estado", "Pendiente");
    record137.set("bloque", "Personal");
    record137.set("check_hoy", false);
    record137.set("check_semana", false);
  try {
    app.save(record137);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record138 = new Record(collection);
    record138.set("numero", "139");
    record138.set("categoria_codigo", "L");
    record138.set("categoria_nombre", "Hogar y personal");
    record138.set("tarea", "Instalar soporte de cortinas de Mateo");
    record138.set("frecuencia", "Puntual");
    record138.set("prioridad", "Baja");
    record138.set("semana_actual", false);
    record138.set("estado", "Pendiente");
    record138.set("bloque", "Personal");
    record138.set("check_hoy", false);
    record138.set("check_semana", false);
  try {
    app.save(record138);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record139 = new Record(collection);
    record139.set("numero", "140");
    record139.set("categoria_codigo", "L");
    record139.set("categoria_nombre", "Hogar y personal");
    record139.set("tarea", "Ordenar ropa");
    record139.set("frecuencia", "Puntual");
    record139.set("prioridad", "Baja");
    record139.set("semana_actual", false);
    record139.set("estado", "Pendiente");
    record139.set("bloque", "Personal");
    record139.set("check_hoy", false);
    record139.set("check_semana", false);
  try {
    app.save(record139);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record140 = new Record(collection);
    record140.set("numero", "141");
    record140.set("categoria_codigo", "L");
    record140.set("categoria_nombre", "Hogar y personal");
    record140.set("tarea", "Eliminar ropa y cosas sin uso");
    record140.set("frecuencia", "Puntual");
    record140.set("prioridad", "Baja");
    record140.set("semana_actual", false);
    record140.set("estado", "Pendiente");
    record140.set("bloque", "Personal");
    record140.set("check_hoy", false);
    record140.set("check_semana", false);
  try {
    app.save(record140);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record141 = new Record(collection);
    record141.set("numero", "142");
    record141.set("categoria_codigo", "L");
    record141.set("categoria_nombre", "Hogar y personal");
    record141.set("tarea", "Colocar cuadros de Mateo y Nacha");
    record141.set("frecuencia", "Puntual");
    record141.set("prioridad", "Baja");
    record141.set("semana_actual", false);
    record141.set("estado", "Pendiente");
    record141.set("bloque", "Personal");
    record141.set("check_hoy", false);
    record141.set("check_semana", false);
  try {
    app.save(record141);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record142 = new Record(collection);
    record142.set("numero", "143");
    record142.set("categoria_codigo", "L");
    record142.set("categoria_nombre", "Hogar y personal");
    record142.set("tarea", "Limpiar y ordenar zapatos");
    record142.set("frecuencia", "Puntual");
    record142.set("prioridad", "Baja");
    record142.set("semana_actual", false);
    record142.set("estado", "Pendiente");
    record142.set("bloque", "Personal");
    record142.set("check_hoy", false);
    record142.set("check_semana", false);
  try {
    app.save(record142);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record143 = new Record(collection);
    record143.set("numero", "144");
    record143.set("categoria_codigo", "L");
    record143.set("categoria_nombre", "Hogar y personal");
    record143.set("tarea", "Instalar c\u00e1mara de entrada");
    record143.set("frecuencia", "Puntual");
    record143.set("prioridad", "Media");
    record143.set("semana_actual", false);
    record143.set("estado", "Pendiente");
    record143.set("bloque", "Personal");
    record143.set("check_hoy", false);
    record143.set("check_semana", false);
  try {
    app.save(record143);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record144 = new Record(collection);
    record144.set("numero", "145");
    record144.set("categoria_codigo", "L");
    record144.set("categoria_nombre", "Hogar y personal");
    record144.set("tarea", "Colocar vidrios a vitrina");
    record144.set("frecuencia", "Puntual");
    record144.set("prioridad", "Media");
    record144.set("semana_actual", false);
    record144.set("estado", "Pendiente");
    record144.set("bloque", "Personal");
    record144.set("check_hoy", false);
    record144.set("check_semana", false);
  try {
    app.save(record144);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record145 = new Record(collection);
    record145.set("numero", "146");
    record145.set("categoria_codigo", "L");
    record145.set("categoria_nombre", "Hogar y personal");
    record145.set("tarea", "Terminar arreglo de sillas del comedor");
    record145.set("frecuencia", "Puntual");
    record145.set("prioridad", "Baja");
    record145.set("semana_actual", false);
    record145.set("estado", "Pendiente");
    record145.set("bloque", "Personal");
    record145.set("check_hoy", false);
    record145.set("check_semana", false);
  try {
    app.save(record145);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record146 = new Record(collection);
    record146.set("numero", "147");
    record146.set("categoria_codigo", "L");
    record146.set("categoria_nombre", "Hogar y personal");
    record146.set("tarea", "Instalar parlantes Home Theater");
    record146.set("frecuencia", "Puntual");
    record146.set("prioridad", "Baja");
    record146.set("semana_actual", false);
    record146.set("estado", "Pendiente");
    record146.set("bloque", "Personal");
    record146.set("check_hoy", false);
    record146.set("check_semana", false);
  try {
    app.save(record146);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record147 = new Record(collection);
    record147.set("numero", "148");
    record147.set("categoria_codigo", "L");
    record147.set("categoria_nombre", "Hogar y personal");
    record147.set("tarea", "Revisar arriendos de caba\u00f1as");
    record147.set("frecuencia", "Puntual");
    record147.set("prioridad", "Media");
    record147.set("semana_actual", false);
    record147.set("estado", "Pendiente");
    record147.set("bloque", "Personal");
    record147.set("check_hoy", false);
    record147.set("check_semana", false);
  try {
    app.save(record147);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})