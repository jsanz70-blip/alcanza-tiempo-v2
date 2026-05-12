import { useMemo } from 'react';

export const SLOTS = [
  { id: 'Mañana temprano', label: 'Mañana temprano', time: '07:00-09:00', colorClass: 'slot-morning' },
  { id: 'Apertura', label: 'Apertura', time: '09:00-12:00', colorClass: 'slot-opening' },
  { id: 'Mediodía', label: 'Mediodía', time: '12:00-14:00', colorClass: 'slot-midday' },
  { id: 'Tarde', label: 'Tarde', time: '14:00-18:00', colorClass: 'slot-afternoon' },
  { id: 'Cierre', label: 'Cierre', time: '18:00-21:00', colorClass: 'slot-closing' },
  { id: 'Sin franja', label: 'Sin franja', time: 'Pasan a mañana', colorClass: 'slot-none' }
];

export const useTimeSlots = () => {
  const getTasksBySlot = (tasks, dailyObjectives) => {
    const grouped = {
      'Mañana temprano': [],
      'Apertura': [],
      'Mediodía': [],
      'Tarde': [],
      'Cierre': [],
      'Sin franja': []
    };

    // Assuming dailyObjectives.franjas is a JSON object mapping taskId -> slotId
    // If not, we fallback to 'Sin franja'
    const franjasMap = dailyObjectives?.franjas || {};

    tasks.forEach(task => {
      const slot = franjasMap[task.id] || 'Sin franja';
      if (grouped[slot]) {
        grouped[slot].push(task);
      } else {
        grouped['Sin franja'].push(task);
      }
    });

    return grouped;
  };

  const getTasksWithoutDate = (tasks) => {
    return tasks.filter(t => !t.fecha_vencimiento);
  };

  const isTaskOverdue = (task) => {
    if (!task.fecha_vencimiento) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.fecha_vencimiento);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  };

  const postponeTasksWithoutSlot = async (date) => {
    // This is handled by the backend hook 'postpone-tasks-daily'
    // But we can provide a manual trigger if needed
    console.log('Postponement is handled by backend cron job.');
  };

  return {
    SLOTS,
    getTasksBySlot,
    getTasksWithoutDate,
    isTaskOverdue,
    postponeTasksWithoutSlot
  };
};