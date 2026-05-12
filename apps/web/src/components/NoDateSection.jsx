import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NoDateSection = ({ tasks, onAssignDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  if (!tasks || tasks.length === 0) return null;

  const handleAssign = (taskId) => {
    if (selectedDate) {
      onAssignDate(taskId, selectedDate);
      setEditingTaskId(null);
      setSelectedDate('');
    }
  };

  return (
    <div className="mt-8 mb-6 border-t border-border pt-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full py-2 mb-3 touch-target group"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-heading font-bold text-foreground group-hover:text-primary transition-colors">Sin fecha</h2>
          <span className="text-[12px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{tasks.length} tareas sin fecha asignada</span>
        </div>
        <div className="bg-card p-1.5 rounded-md border border-border group-hover:border-primary/50 transition-colors">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-card border border-border p-3 rounded-lg flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[13px] truncate text-foreground">{task.tarea}</h3>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground mt-1">
                  {task.prioridad}
                </span>
              </div>
              
              {editingTaskId === task.id ? (
                <div className="flex items-center gap-2">
                  <Input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="h-8 text-xs w-32"
                  />
                  <Button size="sm" onClick={() => handleAssign(task.id)} className="h-8">Guardar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingTaskId(null)} className="h-8">Cancelar</Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setEditingTaskId(task.id)}
                  className="h-8 text-xs"
                >
                  <CalendarPlus className="w-3.5 h-3.5 mr-1" /> Asignar fecha
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NoDateSection;