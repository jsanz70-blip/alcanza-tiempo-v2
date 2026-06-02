import React from 'react';
import { Bell } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AlarmIndicator = ({ task }) => {
  if (!task || !task.hora_alarma || task.estado === 'Hecho') return null;

  const getAlarmStatus = () => {
    if (!task.fecha_vencimiento) return 'default';
    
    const now = new Date();
    const taskDate = new Date(task.fecha_vencimiento);
    
    // If not today, it's just a default future alarm
    if (taskDate.getDate() !== now.getDate() || 
        taskDate.getMonth() !== now.getMonth() || 
        taskDate.getFullYear() !== now.getFullYear()) {
      return 'default';
    }

    const [hours, minutes] = task.hora_alarma.split(':').map(Number);
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0, 0);
    
    const diffMs = alarmTime - now;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) return 'default'; // Already past
    if (diffMins <= 15) return 'critical';
    if (diffMins <= 60) return 'warning';
    
    return 'default';
  };

  const status = getAlarmStatus();
  
  const iconClasses = {
    default: 'alarm-indicator-default',
    warning: 'alarm-indicator-warning',
    critical: 'alarm-indicator-critical',
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center p-1" onClick={(e) => e.stopPropagation()}>
            <Bell className={`w-3.5 h-3.5 ${iconClasses[status]}`} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-popover border border-border text-foreground px-3 py-1.5 rounded-lg shadow-md text-xs">
          <p>Alarma: {task.hora_alarma}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AlarmIndicator;