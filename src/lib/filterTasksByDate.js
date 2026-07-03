export const filterTasksByDate = (tasks, filterType, referenceDate = new Date()) => {
  if (!Array.isArray(tasks)) return [];

  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);

  const refEnd = new Date(ref);
  refEnd.setDate(refEnd.getDate() + 1);

  const weekEnd = new Date(ref);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return tasks.filter(task => {
    const hasDate = task.fecha_vencimiento && typeof task.fecha_vencimiento === 'string' && task.fecha_vencimiento.trim() !== '';
    let taskDate = null;
    
    if (hasDate) {
      taskDate = new Date(task.fecha_vencimiento);
      taskDate = new Date(taskDate.getTime() + taskDate.getTimezoneOffset() * 60000);
      taskDate.setHours(0, 0, 0, 0);
    }

    switch (filterType) {
      case 'today':
        if (!hasDate) return true;
        return taskDate.getTime() === ref.getTime();
        
      case 'week':
        if (!hasDate) return true;
        return taskDate.getTime() >= ref.getTime() && taskDate.getTime() < weekEnd.getTime();
        
      case 'all':
        return true;
        
      case 'routines':
        return !hasDate && task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia';
        
      case 'goals':
        return task.prioridad === 'Alta' || task.estado === 'Meta';
        
      default:
        return true;
    }
  });
};

export const filterTasksByDateExcludingCompleted = (tasks, referenceDate = new Date()) => {
  return filterTasksByDate(tasks, 'today', referenceDate).filter(t => t.estado !== 'Hecho');
};

export const filterTasksByWeekExcludingCompleted = (tasks, referenceDate = new Date()) => {
  return filterTasksByDate(tasks, 'week', referenceDate).filter(t => t.estado !== 'Hecho');
};

export const filterTasksByWeek = (tasks, referenceDate = new Date()) => {
  return filterTasksByDate(tasks, 'week', referenceDate);
};

export const filterRoutinesExcludingCompleted = (tasks) => {
  return filterTasksByDate(tasks, 'routines').filter(t => t.estado !== 'Hecho');
};

export const filterGoalsExcludingCompleted = (tasks) => {
  return filterTasksByDate(tasks, 'goals').filter(t => t.estado !== 'Hecho');
};

export const groupTasksByWeekDay = (tasks, referenceDate = new Date()) => {
  const groups = {
    'A Futuro': []
  };

  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);
  
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(ref);
    d.setDate(d.getDate() + i);
    const dayName = daysOfWeek[d.getDay()];
    const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    const key = `${dayName} ${dateStr}`;
    groups[key] = [];
  }

  tasks.forEach(task => {
    // Tasks with estado 'A Futuro' go to A Futuro group
    if (task.estado === 'A Futuro') {
      groups['A Futuro'].push(task);
      return;
    }

    // Tasks without a date (and not A Futuro) don't go to any day group
    if (!task.fecha_vencimiento || task.fecha_vencimiento.trim() === '') {
      return;
    }

    let taskDate = new Date(task.fecha_vencimiento);
    taskDate = new Date(taskDate.getTime() + taskDate.getTimezoneOffset() * 60000);
    taskDate.setHours(0, 0, 0, 0);

    const diffTime = taskDate.getTime() - ref.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
      const dayName = daysOfWeek[taskDate.getDay()];
      const dateStr = `${taskDate.getDate().toString().padStart(2, '0')}/${(taskDate.getMonth() + 1).toString().padStart(2, '0')}`;
      const key = `${dayName} ${dateStr}`;
      if (groups[key]) {
        groups[key].push(task);
      }
    } else {
      // Tasks outside the week range don't go to any day group
    }
  });

  return groups;
};

export const groupTasksByStatus = (tasks) => {
  const groups = {
    'Pendiente': [],
    'En curso': [],
    'Esperando': [],
    'Hecho': []
  };

  tasks.forEach(task => {
    const status = task.estado || 'Pendiente';
    if (groups[status]) {
      groups[status].push(task);
    } else {
      groups['Pendiente'].push(task);
    }
  });

  return groups;
};