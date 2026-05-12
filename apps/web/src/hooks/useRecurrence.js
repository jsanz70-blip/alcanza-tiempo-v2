import { useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useRecurrence = () => {
  const calculateNextDate = useCallback((currentDateStr, recurrenceType) => {
    if (!currentDateStr || !recurrenceType || recurrenceType === 'Sin recurrencia') return null;
    
    const date = new Date(currentDateStr);
    if (isNaN(date.getTime())) return null;

    switch (recurrenceType) {
      case 'Diaria':
        date.setDate(date.getDate() + 1);
        break;
      case 'Semanal':
        date.setDate(date.getDate() + 7);
        break;
      case 'Quincenal':
        date.setDate(date.getDate() + 15);
        break;
      case 'Mensual':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'Semestral':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'Anual':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        return null;
    }
    
    return date.toISOString();
  }, []);

  const handleRecurringTaskCompletion = useCallback(async (task) => {
    if (!task || !task.tipo_recurrencia || task.tipo_recurrencia === 'Sin recurrencia') {
      return null;
    }

    const baseDate = task.fecha_vencimiento || new Date().toISOString();
    const nextDate = calculateNextDate(baseDate, task.tipo_recurrencia);
    
    if (!nextDate) return null;

    try {
      const newTaskData = {
        ...task,
        id: undefined,
        created: undefined,
        updated: undefined,
        estado: 'Pendiente',
        check_hoy: false,
        check_semana: false,
        fecha_vencimiento: nextDate,
        numero: Math.floor(100000 + Math.random() * 900000).toString()
      };

      const createdTask = await pb.collection('tareas').create(newTaskData, { $autoCancel: false });
      return {
        task: createdTask,
        nextDate: new Date(nextDate).toLocaleDateString()
      };
    } catch (error) {
      console.error('Error creating recurring task:', error);
      return null;
    }
  }, [calculateNextDate]);

  return { calculateNextDate, handleRecurringTaskCompletion };
};