import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';
import { useTimeSlots } from '@/hooks/useTimeSlots';

const OverdueBadge = ({ task }) => {
  const { isTaskOverdue } = useTimeSlots();

  if (!task || !task.fecha_vencimiento || task.estado === 'Hecho') return null;

  const isOverdue = isTaskOverdue(task);
  if (!isOverdue) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.fecha_vencimiento);
  dueDate.setHours(0, 0, 0, 0);
  
  const isToday = dueDate.getTime() === today.getTime();
  const label = isToday ? 'Vence hoy' : 'Vencida';
  const formattedDate = dueDate.toLocaleDateString();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
            <AlertCircle className="w-3 h-3" />
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Fecha de vencimiento: {formattedDate}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default OverdueBadge;