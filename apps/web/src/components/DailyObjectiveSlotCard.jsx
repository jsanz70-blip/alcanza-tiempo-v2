import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Edit2 } from 'lucide-react';
import { useDragDrop } from '@/hooks/useDragDrop';
import TaskInSlotCard from './TaskInSlotCard.jsx';

const DailyObjectiveSlotCard = ({ slot, tasks, onEditSlot, onRemoveTask, onDropTask, onEditTask }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { onDragOver, onDragLeave, onDrop, dragOverTarget } = useDragDrop();

  const handleDrop = (e) => {
    const result = onDrop(e, { type: 'slot', slotId: slot.id });
    if (result.success && result.data) {
      onDropTask(slot.id, result.data);
    }
  };

  const isDragOver = dragOverTarget?.type === 'slot' && dragOverTarget?.slotId === slot.id;

  // Fallback to a neutral soft color if none provided
  const slotBgColor = slot.color || 'rgb(var(--color-indigo-light))';

  return (
    <div className="slot-card group mb-4" style={{ backgroundColor: slotBgColor }}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-background/60 backdrop-blur-md px-2 py-1 rounded-md text-foreground font-medium text-[12px] shadow-sm">
            <Clock className="w-3.5 h-3.5 opacity-70" />
            {slot.hora_inicio} - {slot.hora_fin}
          </div>
          <h3 className="font-heading font-semibold text-[15px] text-foreground mix-blend-hard-light dark:mix-blend-normal">
            {slot.nombre}
          </h3>
          {slot.categoria && (
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-background/40 text-foreground mix-blend-hard-light dark:mix-blend-normal">
              {slot.categoria}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-medium text-foreground/60 mr-2">
            {tasks.length} tareas
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditSlot(slot);
            }}
            className="p-1.5 text-foreground/60 hover:text-foreground hover:bg-background/40 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-foreground/60 hover:text-foreground rounded-md transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content / Dropzone */}
      {isExpanded && (
        <div 
          className={`slot-dropzone ${isDragOver ? 'slot-dropzone-active' : ''} mx-2 mb-2 sm:mx-4 sm:mb-4`}
          onDragOver={(e) => onDragOver(e, { type: 'slot', slotId: slot.id })}
          onDragLeave={(e) => onDragLeave(e, { type: 'slot', slotId: slot.id })}
          onDrop={handleDrop}
        >
          {tasks.length === 0 ? (
            <div className={`h-[60px] flex items-center justify-center border-2 border-dashed rounded-xl transition-colors ${isDragOver ? 'border-primary/40 text-primary' : 'border-foreground/20 text-foreground/50'}`}>
              <span className="text-[12px] font-medium">Arrastra tareas aquí</span>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <TaskInSlotCard 
                  key={task.id} 
                  task={task} 
                  slotId={slot.id} 
                  onRemove={onRemoveTask}
                  onEdit={onEditTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyObjectiveSlotCard;