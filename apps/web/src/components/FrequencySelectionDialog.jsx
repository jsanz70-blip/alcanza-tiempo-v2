import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const FrequencySelectionDialog = ({ isOpen, onClose, onConfirm }) => {
  const [frequency, setFrequency] = useState('Diaria');
  const [dayOfWeek, setDayOfWeek] = useState('Lunes');

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleConfirm = () => {
    if (!frequency) {
      toast.error('Selecciona una frecuencia');
      return;
    }
    
    onConfirm({ 
      frecuencia: frequency, 
      dia_semana: frequency === 'Semanal' ? dayOfWeek : null 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Cambiar a Recurrente</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <p className="text-[13px] text-muted-foreground">
            Selecciona la frecuencia para esta tarea recurrente.
          </p>

          <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-3">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Diaria" id="r-diaria" />
              <Label htmlFor="r-diaria" className="text-[14px]">Diaria</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Semanal" id="r-semanal" />
              <Label htmlFor="r-semanal" className="text-[14px]">Semanal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Mensual" id="r-mensual" />
              <Label htmlFor="r-mensual" className="text-[14px]">Mensual</Label>
            </div>
          </RadioGroup>

          {frequency === 'Semanal' && (
            <div className="space-y-2 pt-2 border-t border-border animate-fade-in">
              <Label className="text-[12px] text-muted-foreground uppercase">Día de la semana</Label>
              <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecciona un día" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="button" 
            onClick={handleConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FrequencySelectionDialog;