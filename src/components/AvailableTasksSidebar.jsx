import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, LayoutList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDragDrop } from '@/hooks/useDragDrop.js';

const AvailableTasksSidebar = ({ tasks, title }) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const { startDrag, endDrag, onDragOver, onDragLeave, onDrop, getDropZoneClass, getDraggedItemClass } = useDragDrop();

  const handleDrop = (e) => {
    onDrop(e, { type: 'sidebar' });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = task.tarea.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === 'all' || task.prioridad === priorityFilter;
      return matchSearch && matchPriority;
    });
  }, [tasks, search, priorityFilter]);

  const getPriorityBadgeClass = (prioridad) => {
    const p = prioridad?.toLowerCase();
    if (p === 'alta') return 'bg-red-500/10 text-red-600 dark:text-red-400';
    if (p === 'media') return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
    if (p === 'baja') return 'bg-green-500/10 text-green-600 dark:text-green-400';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-2xl flex flex-col mb-4 overflow-hidden shadow-sm h-full lg:h-full max-h-[calc(100vh-120px)]">
      <div 
        className="p-5 border-b border-border flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <LayoutList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">{title}</h3>
            <p className="text-[10px] text-muted-foreground">Arrastra para asignar</p>
          </div>
          <span className="text-xs bg-muted text-muted-foreground font-medium px-2.5 py-1 rounded-full">{filteredTasks.length}</span>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-4 space-y-3 border-b border-border bg-muted/10 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar tareas..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex gap-2">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full bg-background text-sm h-10">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div 
            className={`flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide border-2 border-transparent transition-colors ${getDropZoneClass({ type: 'sidebar' })}`}
            onDragOver={(e) => onDragOver(e, { type: 'sidebar' })}
            onDragLeave={(e) => onDragLeave(e, { type: 'sidebar' })}
            onDrop={handleDrop}
          >
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center text-muted-foreground">
                <LayoutList className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-medium">No hay tareas sin asignar</p>
                <p className="text-xs mt-1 text-muted-foreground/70 max-w-[200px]">
                  Las tareas asignadas a proyectos se ocultan automáticamente de esta lista.
                </p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className={`bg-background border border-border p-4 rounded-xl shadow-sm group ${getDraggedItemClass(task.id)}`}
                  draggable
                  onDragStart={(e) => startDrag(e, task.id, { type: 'task', taskId: task.id, sourceObj: 'sidebar' })}
                  onDragEnd={endDrag}
                >
                  <h4 className="font-medium text-sm text-foreground leading-snug mb-3">
                    {task.tarea}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-auto">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${getPriorityBadgeClass(task.prioridad)}`}>
                      {task.prioridad}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground">
                      {task.estado}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableTasksSidebar;