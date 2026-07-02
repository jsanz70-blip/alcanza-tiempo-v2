import React from 'react';
import { ChevronRight, CheckCircle2, Circle, Bell, Calendar, FolderInput } from 'lucide-react';
import { useDragDrop } from '@/hooks/useDragDrop.js';

const ProjectCascadeView = ({ 
  project, 
  tasks, 
  onTaskClick, 
  onToggleStatus, 
  onDragOver, 
  onDragLeave, 
  onDrop, 
  getDropZoneClass 
}) => {
  const { startDrag, endDrag, getDraggedItemClass } = useDragDrop();

  const getPriorityBadgeClass = (prioridad) => {
    const p = prioridad?.toLowerCase();
    if (p === 'alta') return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    if (p === 'media') return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
    if (p === 'baja') return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const getEstadoBadgeClass = (estado) => {
    if (estado === 'Hecho') return 'bg-primary/10 text-primary border-primary/20';
    if (estado === 'En curso') return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    if (estado === 'Esperando') return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const groupedTasks = {
    bloqueantes: tasks.filter(t => t.notas?.toLowerCase().includes('bloqueante') || t.prioridad === 'Alta'),
    enCurso: tasks.filter(t => t.estado === 'En curso' && !t.notas?.toLowerCase().includes('bloqueante') && t.prioridad !== 'Alta'),
    pendientes: tasks.filter(t => t.estado === 'Pendiente' && !t.notas?.toLowerCase().includes('bloqueante') && t.prioridad !== 'Alta'),
    completadas: tasks.filter(t => t.estado === 'Hecho')
  };

  const renderTaskNode = (task, index, total) => {
    const isCompleted = task.estado === 'Hecho';
    const showArrow = index < total - 1;

    return (
      <div key={task.id} className="flex items-center gap-2">
        <div
          className={`bg-background border rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group relative min-w-[200px] max-w-[280px] ${getDraggedItemClass(task.id)} ${isCompleted ? 'opacity-60' : ''}`}
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            startDrag(e, task.id, { type: 'task', taskId: task.id, sourceProjectId: project.id });
          }}
          onDragEnd={endDrag}
          onClick={() => onTaskClick(task)}
        >
          <div className="flex items-start gap-2 mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(task);
              }}
              className="mt-0.5 text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4" />}
            </button>
            <h4 className={`font-medium text-xs leading-snug flex-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.tarea}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${getPriorityBadgeClass(task.prioridad)}`}>
              {task.prioridad}
            </span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border ${getEstadoBadgeClass(task.estado)}`}>
              {task.estado}
            </span>
            {task.hora_alarma && (
              <Bell className="w-3 h-3 text-primary" title="Tiene alarma" />
            )}
            {task.fecha_vencimiento && (
              <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                <Calendar className="w-2.5 h-2.5" />
                {new Date(task.fecha_vencimiento).toLocaleDateString('es', { day: '2-digit', month: '2-digit' })}
              </span>
            )}
          </div>

          {task.categoria_codigo && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[8px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                {task.categoria_codigo}
              </span>
            </div>
          )}
        </div>

        {showArrow && (
          <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
        )}
      </div>
    );
  };

  const renderPhase = (title, tasks, color, icon) => {
    if (tasks.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
            style={{ backgroundColor: color + '22', color: color }}
          >
            {icon}
          </div>
          <h3 className="font-heading font-bold text-sm" style={{ color: color }}>
            {title}
          </h3>
          <span className="text-xs bg-muted text-muted-foreground font-medium px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        <div className="flex flex-wrap items-start gap-2 pl-10">
          {tasks.map((task, idx) => renderTaskNode(task, idx, tasks.length))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-card border border-border rounded-2xl p-6 shadow-sm transition-colors ${getDropZoneClass({ type: 'project', projectId: project.id })}`}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e, { type: 'project', projectId: project.id });
      }}
      onDragLeave={(e) => onDragLeave(e, { type: 'project', projectId: project.id })}
      onDrop={(e) => {
        e.preventDefault();
        const result = onDrop(e, { type: 'project', projectId: project.id });
        if (result?.success) {
          // Parent will handle the drop
        }
      }}
    >
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div 
          className="w-3 h-3 rounded-md shadow-sm shrink-0" 
          style={{ backgroundColor: project.color || 'hsl(var(--primary))' }} 
        />
        <h2 className="font-heading font-bold text-lg text-foreground flex-1">
          {project.nombre}
        </h2>
        <span className="px-2.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-md uppercase tracking-wide">
          {project.estado}
        </span>
      </div>

      {project.descripcion && (
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {project.descripcion}
        </p>
      )}

      <div className="space-y-6">
        {renderPhase('🔴 Bloqueantes / Alta Prioridad', groupedTasks.bloqueantes, '#ef4444', '!')}
        {renderPhase('⚡ En Curso', groupedTasks.enCurso, '#3b82f6', '▶')}
        {renderPhase('📋 Pendientes', groupedTasks.pendientes, '#64748b', '○')}
        {renderPhase('✅ Completadas', groupedTasks.completadas, '#10b981', '✓')}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm font-medium">No hay tareas en este proyecto</p>
          <p className="text-xs mt-1">Arrastra tareas aquí para asignarlas</p>
        </div>
      )}
    </div>
  );
};

export default ProjectCascadeView;
