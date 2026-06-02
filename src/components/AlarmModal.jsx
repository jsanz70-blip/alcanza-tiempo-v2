import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import supabase from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { BellRing, Check, Clock, X } from 'lucide-react';

const AlarmModal = ({ task, isOpen, onClose, onPostpone }) => {
  const [customTime, setCustomTime] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!task) return null;

  const handlePostpone = async (minutes) => {
    setIsProcessing(true);
    await onPostpone(task, minutes);
    setIsProcessing(false);
  };

  const handleCustomPostpone = async () => {
    if (!customTime) return;
    setIsProcessing(true);
    await onPostpone(task, 0, customTime);
    setIsProcessing(false);
  };

  const handleMarkAsDone = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('tareas')
        .update({ estado: 'Hecho' })
        .eq('id', task.id);
        
      if (error) throw error;
      
      toast.success('Tarea marcada como completada');
      onClose();
    } catch (err) {
      console.error('Error completing task:', err);
      toast.error('Error al completar tarea');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-2xl p-0 overflow-hidden">
        <div className="bg-destructive/10 p-6 flex flex-col items-center justify-center border-b border-border text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4 animate-bounce">
            <BellRing className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground mb-2">¡Alarma!</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground font-medium">
            {task.tarea}
          </DialogDescription>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 border-border hover:bg-muted" onClick={() => handlePostpone(5)} disabled={isProcessing}>
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              5 min
            </Button>
            <Button variant="outline" className="h-12 border-border hover:bg-muted" onClick={() => handlePostpone(15)} disabled={isProcessing}>
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              15 min
            </Button>
            <Button variant="outline" className="h-12 border-border hover:bg-muted" onClick={() => handlePostpone(60)} disabled={isProcessing}>
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              1 hora
            </Button>
            <Button variant="outline" className="h-12 border-border hover:bg-muted" onClick={() => handlePostpone(1440)} disabled={isProcessing}>
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              1 día
            </Button>
          </div>

          {!showCustomPicker ? (
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={() => setShowCustomPicker(true)}
              disabled={isProcessing}
            >
              Postergar a hora específica
            </Button>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl border border-border animate-fade-in">
              <Input 
                type="time" 
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="bg-background border-border flex-1"
              />
              <Button onClick={handleCustomPostpone} disabled={!customTime || isProcessing} size="sm">
                Confirmar
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowCustomPicker(false)} disabled={isProcessing}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="pt-2 border-t border-border/50 grid grid-cols-1 gap-2 mt-4">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={handleMarkAsDone} disabled={isProcessing}>
              <Check className="w-5 h-5 mr-2" />
              Marcar como hecho
            </Button>
            <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-foreground" onClick={onClose} disabled={isProcessing}>
              Cerrar alarma
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlarmModal;