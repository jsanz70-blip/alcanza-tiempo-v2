import React, { useState } from 'react';
import { Calendar, X, Bell, CheckCircle2, Circle, FolderInput } from 'lucide-react';
import { useDragDrop } from '@/hooks/useDragDrop.js';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const TaskCardInProject = ({ task, projectId, onRemove, onEdit, onToggleStatus, projects = [], onMoveToProject }) => {
  const { startDrag, endDrag, getDraggedItemClass } = useDragDrop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDragStart = (e) => {
    e.stopPropagation();
    startDrag(e, task.id, { type: 'task', taskId: task.id, sourceProjectId: projectId });
  };

  const getPriorityBadgeClass = (prioridad) => {
    const p = prioridad?.toLowerCase();
    if (p === 'alta') return 'bg-red-500/10 text-red-600 dark:text-red-400';
    if (p === 'media') return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    if (p === 'baja') return 'bg-green-500/10 text-green-600 dark:text-green-400';
    return 'bg-muted text-muted-foreground';
  };

  const isCompleted = task.estado === 'Hecho';

  return (
    <div 
      className={`bg-background/95 backdrop-blur-sm border border-border/60 p-3.5 rounded-xl shadow-sm mb-3 group relative flex gap-3 ${getDraggedItemClass(task.id)} ${isCompleted ? 'opacity-70' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={endDrag}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleStatus(task); }}
        className="mt-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
      >
        {isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5" />}
      </button>

      <div className="flex-1 min-w-0" onClick={() => onEdit && onEdit(task)}>
        <div className="flex items-start justify-between gap-3 mb-2 cursor-pointer">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <h4 className={`font-medium text-sm leading-snug line-clamp-2 transition-all ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.tarea}
            </h4>
          </div>
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {task.hora_alarma && <Bell className="w-3.5 h-3.5 text-primary" />}
            
            {projects.length > 0 && onMoveToProject && (
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                    title="Mover a otro proyecto"
                  >
                    <FolderInput className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {projects
                    .filter(p => p.id !== projectId)
                    .map(project => (
                      <DropdownMenuItem
                        key={project.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveToProject(project.id, { taskId: task.id });
                          setIsMenuOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm shrink-0" 
                            style={{ backgroundColor: project.color || 'hsl(var(--primary))' }}
                          />
                          <span className="truncate">{project.nombre}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  {projects.filter(p => p.id !== projectId).length === 0 && (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground text-center">
                      No hay otros proyectos
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(task.id);
                      setIsMenuOpen(false);
                    }}
                    className="cursor-pointer text-muted-foreground"
                  >
                    Desasignar de proyecto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(task.id);
              }}
              className="p-1 -mr-1 -mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              title="Desasignar del proyecto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 cursor-pointer">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${getPriorityBadgeClass(task.prioridad)}`}>
              {task.prioridad}
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
    </div>
  );
};

export default TaskCardInProject;