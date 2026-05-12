import React, { useState } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const PhaseModal = ({ isOpen, onClose, onSave, projectId, phase = null }) => {
  const [formData, setFormData] = useState({
    nombre: phase?.nombre || '',
    descripcion: phase?.descripcion || '',
    color: phase?.color || 'hsl(var(--color-green-light))',
    estado: phase?.estado || 'Pendiente',
    orden: phase?.orden || 0,
    proyecto_id: projectId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      let saved;
      if (phase) {
        saved = await pb.collection('project_phases').update(phase.id, formData, { $autoCancel: false });
        toast.success('Fase actualizada');
      } else {
        saved = await pb.collection('project_phases').create(formData, { $autoCancel: false });
        toast.success('Fase creada');
      }
      onSave(saved);
      onClose();
    } catch (error) {
      toast.error('Error al guardar la fase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{phase ? 'Editar Fase' : 'Nueva Fase'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={formData.estado} onValueChange={(v) => setFormData({...formData, estado: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhaseModal;