import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const DaySelector = ({ isOpen, onClose, onSelectDay, taskTitle }) => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md rounded-2xl bg-popover border-border p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-heading text-xl text-foreground">Mover a un día</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            Selecciona el día para la tarea: <br/>
            <span className="font-medium text-foreground block mt-1 truncate">{taskTitle}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {days.map((day) => (
            <Button
              key={day}
              variant="outline"
              className="h-12 bg-card border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors ripple"
              onClick={() => {
                onSelectDay(day);
                onClose();
              }}
            >
              {day}
            </Button>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full h-12 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          Cancelar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DaySelector;