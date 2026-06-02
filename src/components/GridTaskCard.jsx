import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, RefreshCw, Edit2 } from 'lucide-react';
import AlarmIndicator from './AlarmIndicator.jsx';
import OverdueBadge from './OverdueBadge.jsx';

export const GridTaskCard = ({ task, onCheck, onEdit, dragProps }) => {
  const isCompleted = task.estado === 'Hecho' || task.check_hoy;

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
    <div 
      className="bg-card border border-border p-2.5 sm:p-3 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer relative group overflow-hidden"
      onClick={() => onEdit(task)}
      draggable
      onDragStart={(e) => {
        if (dragProps?.sourceType) {
          e.dataTransfer.setData('application/json', JSON.stringify({ taskId: task.id, type: dragProps.sourceType }));
        }
      }}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="touch-target -ml-1.5 -mt-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={(val) => onCheck(task.id, val)}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
        
        <div className="flex-1 pt-0 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className={`font-medium text-[11px] sm:text-[13px] leading-tight line-clamp-2 ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {task.tarea}
            </h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <OverdueBadge task={task} />
              <AlarmIndicator task={task} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-1.5">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold ${getCategoryBadgeClass(task.categoria_codigo)}`}>
              {task.categoria_codigo}
            </span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold ${getPriorityBadgeClass(task.prioridad)}`}>
              {task.prioridad}
            </span>
          </div>
          {(task.fecha_vencimiento || (task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia')) && (
            <div className="flex flex-wrap gap-1.5 text-[9px] sm:text-[10px] font-medium opacity-80">
              {task.fecha_vencimiento && (
                <span className={`flex items-center gap-0.5 ${getDueDateColor(task.fecha_vencimiento)}`}>
                  <Calendar className="w-2.5 h-2.5" />
                  {new Date(task.fecha_vencimiento).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="absolute top-1 right-1 p-1 text-muted-foreground hover:text-primary opacity-100 sm:opacity-0 sm:group-hover:opacity-100 rounded-md hover:bg-muted transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};