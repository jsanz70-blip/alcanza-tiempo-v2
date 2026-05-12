import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { SLOTS } from '@/hooks/useTimeSlots';

const TimeSlotSelector = ({ isOpen, onClose, onConfirm, taskName }) => {
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleConfirm = () => {
    if (selectedSlot) {
      onConfirm(selectedSlot);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Franja Horaria</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Selecciona una franja para la tarea: <strong className="text-foreground">{taskName}</strong>
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-2 py-4">
          {SLOTS.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setSelectedSlot(slot.id)}
              className={`flex flex-col items-start p-3 rounded-lg border transition-all ${
                selectedSlot === slot.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border bg-card hover:bg-muted'
              }`}
            >
              <span className="font-medium text-sm">{slot.label}</span>
              <span className="text-xs text-muted-foreground">{slot.time}</span>
            </button>
          ))}
        </div>

        {selectedSlot === 'Sin franja' && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Esta tarea pasará automáticamente a mañana al cierre del día.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!selectedSlot}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotSelector;