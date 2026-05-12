import React from 'react';
import { Calendar, X, Bell } from 'lucide-react';
import { useDragDrop } from '@/hooks/useDragDrop';

const TaskInSlotCard = ({ task, slotId, onRemove, onEdit }) => {
  const { startDrag, endDrag } = useDragDrop();

  const getPriorityBadgeClass = (prioridad) => `priority-badge-${prioridad?.toLowerCase() || 'media'}`;

  const handleDragStart = (e) => {
    e.stopPropagation();
    startDrag(e, task.id, { type: 'slot-task', taskId: task.id, sourceSlotId: slotId });
  };

  const getDueDateColor = (dateStr) => {
    if (!dateStr) return 'text-muted-foreground';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-destructive';
    if (diffDays === 0) return 'text-yellow-500';
    return 'text-foreground';
  };

  return (
    <div 
      className="task-in-slot"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={endDrag}
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="font-medium text-[13px] text-foreground leading-tight line-clamp-2">
          {task.tarea}
        </h4>
        <div className="flex items-center gap-1 shrink-0">
          {task.hora_alarma && (
            <Bell className="w-3.5 h-3.5 text-primary opacity-70" />
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemove(slotId, task.id);
            }}
            className="p-1 -mr-1 -mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            title="Quitar de la franja"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-1.5 flex-wrap">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${getPriorityBadgeClass(task.prioridad)}`}>
            {task.prioridad}
          </span>
          {task.expand?.proyecto_id && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground truncate max-w-[100px]">
              {task.expand.proyecto_id.nombre}
            </span>
          )}
        </div>
        
        {task.fecha_vencimiento && (
          <span className={`flex items-center gap-1 text-[10px] font-medium ${getDueDateColor(task.fecha_vencimiento)} shrink-0`}>
            <Calendar className="w-3 h-3" />
            {new Date(task.fecha_vencimiento).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskInSlotCard;