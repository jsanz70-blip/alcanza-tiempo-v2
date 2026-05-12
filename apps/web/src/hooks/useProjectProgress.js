import { useCallback } from 'react';
import supabase from '@/lib/supabaseClient';

export const useProjectProgress = () => {
  const updateProjectProgress = useCallback(async (projectId) => {
    if (!projectId) return 0;
    
    try {
      const { data: tasks, error: tasksError } = await supabase
        .from('tareas')
        .select('*')
        .eq('proyecto_id', projectId);
        
      if (tasksError) throw tasksError;
      
      const total = tasks.length;
      const completed = tasks.filter(t => t.check_hoy || t.estado === 'Hecho').length;
      const progreso = total === 0 ? 0 : Math.round((completed / total) * 100);
      
      const { error: projectError } = await supabase
        .from('projects')
        .update({ progreso })
        .eq('id', projectId);
        
      if (projectError) throw projectError;
      
      return progreso;
    } catch (error) {
      console.error('Error updating project progress:', error);
      return 0;
    }
  }, []);

  return { updateProjectProgress };
};