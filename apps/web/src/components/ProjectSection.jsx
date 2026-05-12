import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, RefreshCw, Edit2 } from 'lucide-react';
import AlarmIndicator from './AlarmIndicator.jsx';
import OverdueBadge from './OverdueBadge.jsx';

const ProjectSection = ({ project, tasks, onTaskUpdate, onTaskEdit, viewMode }) => {
  const getCategoryBadgeClass = (codigo) => `category-badge-${codigo?.toLowerCase() || 'a'}`;
  const getPriorityBadgeClass = (prioridad) => `priority-badge-${prioridad?.toLowerCase() || 'media'}`;

  const getDueDateColor = (dateStr) => {
    if (!dateStr) return 'text-muted-foreground';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-destructive';
    if (diffDays <= 1) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="mb-6">
      <h2 className="text-[16px] font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
        {project ? (
          <>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color || '#ccc' }} />
            {project.nombre}
          </>
        ) : (
          'Sin proyecto asignado'
        )}
      </h2>
      <div className="space-y-3">
        {tasks.map(task => {
          const isCompleted = task.estado === 'Hecho' || task.check_hoy;
          return (
            <div 
              key={task.id} 
              className="bg-card border border-border p-3 rounded-lg flex items-start gap-3 group relative hover:shadow-sm transition-all cursor-pointer"
              onClick={() => onTaskEdit(task)}
            >
              <div className="touch-target -ml-2 -mt-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <Checkbox 
                  checked={isCompleted}
                  onCheckedChange={(val) => onTaskUpdate(task.id, { check_hoy: val, estado: val ? 'Hecho' : 'Pendiente' })}
                  className="w-5 h-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
              </div>
              
              <div className="flex-1 pt-0.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`font-medium text-[13px] mb-1.5 leading-tight truncate ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {task.tarea}
                  </h3>
                  <div className="flex items-center gap-1">
                    <OverdueBadge task={task} />
                    <AlarmIndicator task={task} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${getCategoryBadgeClass(task.categoria_codigo)}`}>
                    {task.categoria_codigo}
                  </span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${getPriorityBadgeClass(task.prioridad)}`}>
                    {task.prioridad}
                  </span>
                </div>
                {(task.fecha_vencimiento || (task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia')) && (
                  <div className="flex flex-wrap gap-2 text-[10px] font-medium">
                    {task.fecha_vencimiento && (
                      <span className={`flex items-center gap-1 ${getDueDateColor(task.fecha_vencimiento)}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(task.fecha_vencimiento).toLocaleDateString()}
                      </span>
                    )}
                    {task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia' && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <RefreshCw className="w-3 h-3" />
                        {task.tipo_recurrencia}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskEdit(task);
                }}
                className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-primary opacity-100 md:opacity-0 md:group-hover:opacity-100 rounded-md hover:bg-muted transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectSection;