import { useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useProjectProgress = () => {
  const updateProjectProgress = useCallback(async (projectId) => {
    if (!projectId) return 0;
    
    try {
      const tasks = await pb.collection('tareas').getFullList({
        filter: `proyecto_id="${projectId}"`,
        $autoCancel: false
      });
      
      const total = tasks.length;
      const completed = tasks.filter(t => t.check_hoy || t.estado === 'Hecho').length;
      const progreso = total === 0 ? 0 : Math.round((completed / total) * 100);
      
      await pb.collection('projects').update(projectId, { progreso }, { $autoCancel: false });
      
      return progreso;
    } catch (error) {
      console.error('Error updating project progress:', error);
      return 0;
    }
  }, []);

  return { updateProjectProgress };
};