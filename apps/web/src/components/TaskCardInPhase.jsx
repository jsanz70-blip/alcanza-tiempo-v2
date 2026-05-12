import React from 'react';
import { Calendar, X, Bell, CheckCircle2 } from 'lucide-react';
import { useDragDrop } from '@/hooks/useDragDrop';

const TaskCardInPhase = ({ task, phaseId, onRemove, onEdit }) => {
  const { startDrag, endDrag, getDraggedItemClass } = useDragDrop();

  const handleDragStart = (e) => {
    e.stopPropagation();
    startDrag(e, task.id, { type: 'task', taskId: task.id, sourcePhaseId: phaseId });
  };

  const getPriorityBadgeClass = (prioridad) => {
    const p = prioridad?.toLowerCase();
    if (p === 'alta') return 'bg-red-500/10 text-red-600 dark:text-red-400';
    if (p === 'media') return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    if (p === 'baja') return 'bg-green-500/10 text-green-600 dark:text-green-400';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div 
      className={`bg-background/95 backdrop-blur-sm border border-border/60 p-3.5 rounded-xl shadow-sm mb-3 group relative ${getDraggedItemClass(task.id)}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={endDrag}
      onClick={() => onEdit && onEdit(task)}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {task.estado === 'Hecho' && (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          )}
          <h4 className={`font-medium text-sm leading-snug line-clamp-2 ${task.estado === 'Hecho' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.tarea}
          </h4>
        </div>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.hora_alarma && <Bell className="w-3.5 h-3.5 text-primary" />}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove(phaseId, task.id);
            }}
            className="p-1 -mr-1 -mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            title="Desasignar de esta fase"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeClass(task.prioridad)}`}>
            {task.prioridad}
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
            {task.estado}
          </span>
        </div>
        {task.fecha_vencimiento && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground shrink-0">
            <Calendar className="w-3 h-3" />
            {new Date(task.fecha_vencimiento).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCardInPhase;